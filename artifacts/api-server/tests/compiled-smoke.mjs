import http from "node:http";
import assert from "node:assert/strict";

// Exercise the exact deployment entry, without loading .env or contacting a DB.
process.env.NODE_ENV = "production";
process.env.LOG_LEVEL = "silent";
process.env.SESSION_SECRET = "isolated-compiled-api-test-secret-32-characters";
process.env.DATABASE_URL = "postgresql://unused:unused@127.0.0.1:5432/unused";
const { default: handler } = await import("../../../api/[...path].js");
const server = http.createServer((req, res) => {
  Promise.resolve(handler(req, res)).catch((error) => {
    console.error(error.name);
    res.statusCode = 500;
    res.end("Handler failed");
  });
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
try {
  for (const [path, expected] of [
    ["/api/healthz", { status: "ok" }],
    ["/api/auth/session", { user: null }],
  ]) {
    const response = await fetch(
      `http://127.0.0.1:${server.address().port}${path}`,
    );
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), expected);
    console.log(`Compiled API OK: ${path}`);
  }
} finally {
  await new Promise((resolve) => server.close(resolve));
}
