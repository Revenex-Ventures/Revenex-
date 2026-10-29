import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import app from "../src/app";

let server: ReturnType<typeof app.listen>;
let base: string;
const originalFetch = globalThis.fetch;
let status = 200;
let finishReason = "STOP";
let fail = false;
const calls: Array<{ url: string; headers: Headers; body: any }> = [];

before(async () => {
  process.env.GEMINI_API_KEY = "test-gemini-secret";
  process.env.GEMINI_MODEL = "gemini-3.5-flash-lite";
  process.env.CHAT_PROVIDER = "gemini";
  globalThis.fetch = (async (input, init) => {
    const url = String(input);
    if (url.startsWith("https://generativelanguage.googleapis.com/")) {
      calls.push({ url, headers: new Headers(init?.headers), body: JSON.parse(String(init?.body)) });
      if (fail) throw new Error("private-provider-details test-gemini-secret");
      if (status !== 200) return Response.json({ privateDetails: "test-gemini-secret" }, { status });
      return Response.json({ candidates: [{
        finishReason,
        content: { parts: [{ thought: true, text: "Internal reasoning" }, { text: "Verified reply" }] },
      }] });
    }
    if (!url.startsWith(base)) throw new Error("External services are forbidden in tests");
    return originalFetch(input, init);
  }) as typeof fetch;
  await new Promise<void>(resolve => { server = app.listen(0, "127.0.0.1", resolve); });
  base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
});

after(async () => {
  globalThis.fetch = originalFetch;
  await new Promise<void>(resolve => server.close(() => resolve()));
});

async function chat(message = "How should a teacher organise a week of work?", language = "en", cookie?: string) {
  const response = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Revenex-Request": "1", ...(cookie ? { Cookie: cookie } : {}) },
    body: JSON.stringify({ message, language }),
  });
  return { status: response.status, data: await response.json(), cookie: response.headers.get("set-cookie")?.split(";")[0] };
}

test("Gemini receives website facts, bounded generation and server-only credentials", async () => {
  const result = await chat();
  assert.equal(result.status, 200);
  assert.equal(result.data.reply, "Verified reply");
  assert.equal(result.data.model, "gemini-3.5-flash-lite");
  assert.doesNotMatch(JSON.stringify(result.data), /Internal reasoning|test-gemini-secret/);
  const call = calls.at(-1)!;
  assert.equal(call.headers.get("x-goog-api-key"), "test-gemini-secret");
  assert.doesNotMatch(call.url, /secret|key=/);
  assert.match(call.body.systemInstruction.parts[0].text, /PUBLIC WEBSITE CONTENT/);
  assert.match(call.body.systemInstruction.parts[0].text, /Do not invent prices/);
  assert.equal(call.body.contents[0].role, "user");
  assert.equal(call.body.generationConfig.maxOutputTokens, 1024);
  assert.equal(call.body.generationConfig.thinkingConfig.thinkingLevel, "low");
  assert.equal(call.body.generationConfig.temperature, undefined);

  await chat("What would be the next step?", "hi", result.cookie);
  const followup = calls.at(-1)!;
  assert.match(followup.body.systemInstruction.parts[0].text, /Reply in natural Hindi/);
  assert.deepEqual(followup.body.contents.map((entry: any) => entry.role), ["user", "model", "user"]);
  assert.equal(followup.body.contents[1].parts[0].text, "Verified reply");
});

test("Gemini access failures stay private and public FAQ help remains available", async () => {
  status = 403;
  try {
    const before = calls.length;
    const result = await chat();
    assert.equal(result.status, 503);
    assert.equal(calls.length, before + 1);
    assert.doesNotMatch(JSON.stringify(result.data), /private|secret/i);
    const faq = await chat("Book a Demo", "hi");
    assert.equal(faq.status, 200);
    assert.equal(faq.data.model, "public-knowledge");
    assert.match(faq.data.reply, /डेमो/);
    assert.equal(calls.length, before + 1);
  } finally { status = 200; }
});

test("detailed module questions reach Gemini while pricing stays authoritative", async () => {
  const before = calls.length;
  const detailed = await chat("How can teachers manage attendance and homework?");
  assert.equal(detailed.status, 200);
  assert.equal(detailed.data.model, "gemini-3.5-flash-lite");
  assert.equal(calls.length, before + 1);
  const pricing = await chat("Explain pricing for our school");
  assert.equal(pricing.data.model, "public-knowledge");
  assert.match(pricing.data.reply, /confirm current pricing/i);
  assert.equal(calls.length, before + 1);
});

test("Gemini blocked and truncated output is never shown as a complete answer", async () => {
  try {
    for (const reason of ["SAFETY", "MAX_TOKENS"]) {
      finishReason = reason;
      const result = await chat();
      assert.equal(result.status, 502);
      assert.equal(result.data.reply, undefined);
    }
  } finally { finishReason = "STOP"; }
});

test("Gemini quotas and transport failures produce controlled errors", async () => {
  status = 429;
  try { assert.equal((await chat()).status, 502); } finally { status = 200; }
  fail = true;
  try {
    const result = await chat();
    assert.equal(result.status, 502);
    assert.doesNotMatch(JSON.stringify(result.data), /private|secret/i);
  } finally { fail = false; }
});

test("an explicit Gemini configuration never falls through to another provider", async () => {
  delete process.env.GEMINI_API_KEY;
  try {
    const before = calls.length;
    assert.equal((await chat()).status, 503);
    assert.equal(calls.length, before);
  } finally { process.env.GEMINI_API_KEY = "test-gemini-secret"; }
});
