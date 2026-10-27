import { test, before, after, mock } from "node:test";
import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { eq } from "drizzle-orm";
import app from "../src/app";
import { db, usersTable } from "@workspace/db";
import { ChatMemory } from "../src/lib/chat-memory";
import { seedAdmin } from "../src/lib/seed";

let server: ReturnType<typeof app.listen>;
let base: string;
const originalFetch = globalThis.fetch;
const sentEmails: string[] = [];
let emailFailure = false;
let aiFailure = false;
const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
});
before(async () => {
  mock.method(
    OAuth2Client.prototype,
    "getFederatedSignonCertsAsync",
    async () => ({
      certs: { "test-key": publicKey.export({ type: "spki", format: "pem" }) },
      format: "PEM",
    }),
  );
  globalThis.fetch = (async (input: any, options: any) => {
    const url = String(input);
    if (url === "https://api.resend.com/emails") {
      sentEmails.push(JSON.parse(options.body).html);
      return Response.json(
        { id: "test-email" },
        { status: emailFailure ? 500 : 200 },
      );
    }
    if (url === "https://openrouter.ai/api/v1/chat/completions") {
      if (aiFailure)
        return Response.json(
          { privateProviderDetails: "must not leak" },
          { status: 429 },
        );
      return Response.json({
        choices: [{ message: { content: "Test assistant reply" } }],
      });
    }
    if (!url.startsWith(base))
      throw new Error("Tests must not call external services");
    return originalFetch(input, options);
  }) as typeof fetch;
  await new Promise<void>((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });
  base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
});
after(async () => {
  globalThis.fetch = originalFetch;
  mock.restoreAll();
  await new Promise<void>((resolve) => server.close(() => resolve()));
});
async function request(
  path: string,
  method = "GET",
  body?: unknown,
  cookie?: string,
) {
  const response = await fetch(`${base}/api${path}`, {
    method,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return {
    status: response.status,
    data: await response.json(),
    cookie: response.headers.get("set-cookie")?.split(";")[0],
    response,
  };
}
const googleToken = (
  email: string,
  options: {
    audience?: string;
    verified?: boolean;
    expired?: boolean;
    sub?: string;
    hd?: string;
  } = {},
) =>
  jwt.sign(
    {
      email,
      email_verified: options.verified ?? true,
      sub: options.sub ?? email,
      name: "Verified User",
      hd: options.hd,
    },
    privateKey,
    {
      algorithm: "RS256",
      keyid: "test-key",
      audience: options.audience ?? process.env.GOOGLE_CLIENT_ID,
      issuer: "https://accounts.google.com",
      expiresIn: options.expired ? -3600 : 3600,
    },
  );
const userInput = {
  name: "Test User",
  email: "user@example.com",
  password: "test-password-123",
  phone: "9876543210",
  school: "Test School",
};
let userCookie: string;
let adminCookie: string;
let adminId: number;

test("health and readiness check all database tables", async () => {
  assert.equal((await request("/healthz")).status, 200);
  assert.equal((await request("/readyz")).status, 200);
  assert.deepEqual((await request("/auth/session")).data, { user: null });
});
test("invalid Google payload cannot impersonate an administrator", async () => {
  assert.equal(
    (
      await request("/auth/google", "POST", {
        email: "team@revenex.in",
        name: "Admin",
        googleId: "fake",
      })
    ).status,
    400,
  );
  assert.equal(
    (await request("/auth/google", "POST", { credential: "forged-token" }))
      .status,
    401,
  );
});
test("signup normalizes email, sets HttpOnly session, rejects duplicate and invalid requests", async () => {
  assert.equal(
    (await request("/auth/signup", "POST", { ...userInput, password: "short" }))
      .status,
    400,
  );
  assert.equal(
    (await request("/auth/signup", "POST", { ...userInput, email: 5 })).status,
    400,
  );
  const result = await request("/auth/signup", "POST", {
    ...userInput,
    email: " User@Example.com ",
    role: "admin",
  });
  assert.equal(result.status, 201);
  assert.equal(result.data.user.email, userInput.email);
  assert.equal(result.data.user.role, "user");
  assert.match(result.response.headers.get("set-cookie")!, /HttpOnly/i);
  userCookie = result.cookie!;
  assert.equal((await request("/auth/signup", "POST", userInput)).status, 409);
});
test("email login, /me contract, and authorization work", async () => {
  assert.equal(
    (
      await request("/auth/login", "POST", {
        email: userInput.email,
        password: "wrong",
      })
    ).status,
    401,
  );
  const result = await request("/auth/login", "POST", userInput);
  assert.equal(result.status, 200);
  const me = await request("/auth/me", "GET", undefined, result.cookie);
  assert.equal(me.data.email, userInput.email);
  assert.equal(me.data.user, undefined);
  assert.equal(
    (await request("/auth/session", "GET", undefined, result.cookie)).data.user
      .email,
    userInput.email,
  );
  assert.equal((await request("/admin/stats")).status, 401);
  assert.equal(
    (await request("/admin/stats", "GET", undefined, userCookie)).status,
    403,
  );
});
test("Google verifies signature, audience, expiry, and verified email", async () => {
  const signed = googleToken("g@gmail.com");
  const parts = signed.split(".");
  parts[2] = (parts[2][0] === "a" ? "b" : "a") + parts[2].slice(1);
  assert.equal(
    (await request("/auth/google", "POST", { credential: parts.join(".") }))
      .status,
    401,
  );
  for (const token of [
    googleToken("g@gmail.com", { audience: "wrong" }),
    googleToken("g@gmail.com", { verified: false }),
    googleToken("g@gmail.com", { expired: true }),
  ]) {
    assert.equal(
      (await request("/auth/google", "POST", { credential: token })).status,
      401,
    );
  }
  const result = await request("/auth/google", "POST", {
    credential: googleToken("google@gmail.com"),
  });
  assert.equal(result.status, 200);
  assert.equal(result.data.user.role, "user");
});
test("admin bootstrap leaves existing credentials unchanged", async () => {
  process.env.ADMIN_EMAIL = "admin@example.com";
  process.env.ADMIN_PASSWORD = "initial-admin-password";
  await seedAdmin();
  const login = await request("/auth/login", "POST", {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  });
  assert.equal(login.status, 200);
  assert.equal(login.data.user.role, "admin");
  adminCookie = login.cookie!;
  adminId = login.data.user.id;
  process.env.ADMIN_PASSWORD = "changed-admin-password";
  await seedAdmin();
  assert.equal(
    (
      await request("/auth/login", "POST", {
        email: process.env.ADMIN_EMAIL,
        password: "initial-admin-password",
      })
    ).status,
    200,
  );
});
test("contact and demo submissions validate and persist; email HTML is escaped", async () => {
  const stats = await request("/admin/stats", "GET", undefined, adminCookie);
  assert.equal(stats.status, 200);
  assert.equal(typeof stats.data.users, "number");
  assert.equal(
    (
      await request("/contact", "POST", {
        name: "A",
        email: "bad",
        message: "Hi",
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await request("/contact", "POST", {
        name: "<b>Sender</b>",
        email: "test@example.com",
        message: "<script>bad</script>",
      })
    ).status,
    200,
  );
  assert.match(sentEmails.at(-1)!, /&lt;script&gt;/);
  assert.equal(
    (
      await request("/demo", "POST", {
        name: "School Admin",
        email: "test@example.com",
        schoolName: "Test School",
      })
    ).status,
    200,
  );
  assert.equal(
    (await request("/admin/contacts", "GET", undefined, adminCookie)).data
      .length,
    1,
  );
  assert.equal(
    (await request("/admin/demos", "GET", undefined, adminCookie)).data.length,
    1,
  );
});
test("review is hidden until approved; admin updates and deletes records", async () => {
  const input = {
    name: "Educator",
    role: "Teacher",
    school: "Test School",
    content: "Great support",
    rating: 5,
  };
  assert.equal(
    (await request("/reviews", "POST", { ...input, rating: 2.5 })).status,
    400,
  );
  const review = await request("/reviews", "POST", {
    ...input,
    approved: true,
  });
  assert.equal(review.status, 201);
  assert.equal(review.data.approved, false);
  assert.equal((await request("/reviews")).data.length, 0);
  assert.equal(
    (
      await request(
        `/admin/reviews/${review.data.id}`,
        "PATCH",
        { approved: true },
        adminCookie,
      )
    ).status,
    200,
  );
  assert.equal((await request("/reviews")).data.length, 1);
  assert.equal(
    (
      await request(
        "/admin/contacts/1",
        "PATCH",
        { status: "resolved" },
        adminCookie,
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await request(
        "/admin/demos/1",
        "PATCH",
        { status: "scheduled" },
        adminCookie,
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await request(
        "/admin/demos/1",
        "PATCH",
        { status: "invalid" },
        adminCookie,
      )
    ).status,
    400,
  );
  assert.equal(
    (await request("/admin/contacts/nope", "DELETE", undefined, adminCookie))
      .status,
    400,
  );
  assert.equal(
    (
      await request(
        "/admin/reviews/99999",
        "PATCH",
        { approved: false },
        adminCookie,
      )
    ).status,
    404,
  );
  for (const path of [
    "/admin/contacts/1",
    "/admin/demos/1",
    `/admin/reviews/${review.data.id}`,
  ])
    assert.equal(
      (await request(path, "DELETE", undefined, adminCookie)).status,
      200,
    );
  assert.equal(
    (await request("/admin/contacts/1", "DELETE", undefined, adminCookie))
      .status,
    404,
  );
  assert.equal(
    (await request("/admin/users", "GET", undefined, adminCookie)).status,
    200,
  );
});
test("chat validates input, sets a session, and hides provider errors", async () => {
  assert.equal((await request("/chat", "POST", { message: {} })).status, 400);
  const result = await request("/chat", "POST", { message: "Hello" });
  assert.equal(result.status, 200);
  assert.equal(result.data.reply, "Test assistant reply");
  assert.match(result.cookie!, /^chat_session=/);
  aiFailure = true;
  const failed = await request(
    "/chat",
    "POST",
    { message: "Hello again" },
    result.cookie,
  );
  assert.equal(failed.status, 502);
  assert.doesNotMatch(JSON.stringify(failed.data), /privateProviderDetails/);
  aiFailure = false;
});
test("chat memory expires, caps session count, and bounds history", () => {
  let now = 0;
  const memory = new ChatMemory(2, 10, () => now);
  const messages = Array.from({ length: 20 }, () => ({
    role: "user" as const,
    content: "x".repeat(3000),
  }));
  memory.set("a", messages);
  assert.equal(memory.get("a").length, 12);
  assert.equal(memory.get("a")[0].content.length, 2000);
  memory.set("b", []);
  memory.set("c", []);
  assert.equal(memory.size, 2);
  assert.deepEqual(memory.get("a"), []);
  now = 11;
  assert.deepEqual(memory.get("b"), []);
});
test("password reset hashes tokens, consumes once, and invalidates old sessions", async () => {
  const result = await request("/auth/forgot-password", "POST", {
    email: userInput.email,
  });
  assert.equal(result.status, 200);
  const token = sentEmails.at(-1)!.match(/token=([a-f0-9]{64})/)![1];
  const [stored] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, userInput.email));
  assert.notEqual(stored.resetToken, token);
  assert.equal(
    (
      await request("/auth/reset-password", "POST", {
        token,
        password: "new-test-password",
      })
    ).status,
    200,
  );
  assert.equal(
    (
      await request("/auth/reset-password", "POST", {
        token,
        password: "new-test-password",
      })
    ).status,
    400,
  );
  assert.equal(
    (await request("/auth/me", "GET", undefined, userCookie)).status,
    401,
  );
  assert.equal(
    (
      await request("/auth/login", "POST", {
        email: userInput.email,
        password: "new-test-password",
      })
    ).status,
    200,
  );
});
test("failed email delivery is reported and its reset token is removed", async () => {
  emailFailure = true;
  assert.equal(
    (await request("/auth/forgot-password", "POST", { email: userInput.email }))
      .status,
    503,
  );
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, userInput.email));
  assert.equal(user.resetToken, null);
  emailFailure = false;
});
test("admin demotion is enforced immediately for an existing session", async () => {
  assert.equal(
    (
      await request(
        `/admin/users/${adminId}/role`,
        "PATCH",
        { role: "user" },
        adminCookie,
      )
    ).status,
    400,
  );
  await db
    .update(usersTable)
    .set({ role: "user" })
    .where(eq(usersTable.id, adminId));
  assert.equal(
    (await request("/admin/stats", "GET", undefined, adminCookie)).status,
    403,
  );
});
test("logout clears the session cookie", async () => {
  const result = await request("/auth/logout", "POST");
  assert.equal(result.status, 200);
  assert.match(
    result.response.headers.get("set-cookie")!,
    /Expires=Thu, 01 Jan 1970/,
  );
});
test("malformed JSON, oversized bodies, cross-site writes, unknown API paths and throttling", async () => {
  const broken = await fetch(`${base}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{",
  });
  assert.equal(broken.status, 400);
  const huge = await request("/chat", "POST", { message: "x".repeat(40000) });
  assert.equal(huge.status, 413);
  const crossSite = await fetch(`${base}/api/auth/logout`, {
    method: "POST",
    headers: { Origin: "https://attacker.example" },
  });
  assert.equal(crossSite.status, 403);
  assert.equal((await request("/missing")).status, 404);
  let limited = false;
  for (let i = 0; i < 25; i++) {
    const response = await request("/auth/login", "POST", {
      email: "missing@example.com",
      password: "wrong",
    });
    if (response.status === 429) {
      limited = true;
      break;
    }
  }
  assert.equal(limited, true);
});
