// A fixed, first-party backend keeps Pages requests and auth cookies same-origin.
const API_ORIGIN = "https://revenex-revenex-ventures-projects.vercel.app";
export async function onRequest({ request }: { request: Request }): Promise<Response> {
  const source = new URL(request.url);
  if (!source.pathname.startsWith("/api/")) return new Response("Not found", { status: 404 });
  const upstream = new URL(API_ORIGIN);
  upstream.pathname = source.pathname;
  upstream.search = source.search;
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("connection");
  try {
    const response = await fetch(new Request(upstream, {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
      redirect: "manual",
      // Node test compatibility; Cloudflare accepts streamed request bodies.
      ...(["GET", "HEAD"].includes(request.method) ? {} : { duplex: "half" }),
    }));
    const result = new Response(response.body, response);
    result.headers.set("Cache-Control", "no-store");
    return result;
  } catch {
    return Response.json({ message: "The service is temporarily unavailable. Please try again." }, {
      status: 503, headers: { "Cache-Control": "no-store" },
    });
  }
}
