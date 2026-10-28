export function safeRequestPath(url?: string) {
  const path = (url ?? "").split("?")[0];
  if (
    /^\/api\/(healthz|readyz|contact|demo|reviews|chat|auth\/(signup|login|google|forgot-password|reset-password|logout|me|session)|admin\/(stats|contacts|demos|reviews|users))$/.test(
      path,
    )
  )
    return path;
  if (/^\/api\/admin\/(contacts|demos|reviews|users)\/\d+(\/role)?$/.test(path))
    return path.replace(/\/\d+(?=\/|$)/, "/:id");
  return "[unmatched route]";
}

export function safeError(error: unknown) {
  const value = error as {
    name?: unknown;
    code?: unknown;
    cause?: { code?: unknown };
  } | null;
  const code = value?.code ?? value?.cause?.code;
  return {
    type:
      typeof value?.name === "string" && /^[A-Za-z]{1,40}$/.test(value.name)
        ? value.name
        : "Error",
    ...(typeof code === "string" && /^[A-Z0-9_]{1,32}$/.test(code)
      ? { code }
      : {}),
  };
}
