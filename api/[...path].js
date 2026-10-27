// Load the compiled API so Vercel does not recompile the monorepo with different
// TypeScript module-resolution settings. The bundle is created by the root build.
module.exports = async function handler(req, res) {
  const { default: app } = await import("../artifacts/api-server/dist/app.mjs");
  return app(req, res);
};
