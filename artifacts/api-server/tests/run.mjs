import { build } from "esbuild";
import { mkdir, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { createRequire, isBuiltin } from "node:module";
import { pathToFileURL } from "node:url";
const output = path.resolve("tests/.build");
await mkdir(output, { recursive: true });
try {
  await build({
    entryPoints: ["tests/api.test.ts"],
    outfile: path.join(output, "api.test.mjs"),
    bundle: true,
    platform: "node",
    format: "esm",
    plugins: [
      {
        name: "external-dependencies",
        setup(builder) {
          builder.onResolve({ filter: /^[^./]/ }, (args) => {
            if (args.path.startsWith("@workspace/")) return;
            if (isBuiltin(args.path))
              return { path: args.path, external: true };
            return {
              path: pathToFileURL(
                createRequire(args.importer).resolve(args.path),
              ).href,
              external: true,
            };
          });
        },
      },
    ],
    alias: {
      "@workspace/db": path.resolve("tests/database.ts"),
      "@workspace/api-zod": path.resolve("../../lib/api-zod/src/index.ts"),
    },
  });
  const result = spawnSync(
    process.execPath,
    ["--test", path.join(output, "api.test.mjs")],
    {
      stdio: "inherit",
      env: {
        ...process.env,
        NODE_ENV: "test",
        LOG_LEVEL: "silent",
        DATABASE_URL: "postgres://unused-test-only",
        SESSION_SECRET: "isolated-tests-only-secret-at-least-32-characters",
        GOOGLE_CLIENT_ID: "test-client.apps.googleusercontent.com",
        RESEND_API_KEY: "test-email-key",
        OPENROUTER_API_KEY: "test-ai-key",
        APP_URL: "http://localhost:5173",
        TRUST_PROXY_HOPS: "0",
      },
    },
  );
  process.exitCode = result.status ?? 1;
} finally {
  await rm(output, { recursive: true, force: true });
}
