export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  headers.set("X-Revenex-Request", "1");
  if (options.body) headers.set("Content-Type", "application/json");
  let response: Response;
  try {
    response = await fetch(path, {
      ...options,
      headers,
      credentials: "include",
      signal: options.signal ?? AbortSignal.timeout(30000),
    });
  } catch {
    throw new Error(
      "Unable to reach the server. Please check your connection and try again.",
    );
  }
  if (!response.headers.get("content-type")?.includes("application/json"))
    throw new Error(
      "The service is temporarily unavailable. Please try again later.",
    );
  const data = await response.json();
  if (!response.ok)
    throw new Error(
      data.message ?? data.error ?? "Request failed. Please try again.",
    );
  return data as T;
}
