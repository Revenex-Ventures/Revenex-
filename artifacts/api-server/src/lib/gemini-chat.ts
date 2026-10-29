type Message = { role: string; content: string };

/** Server-only adapter. Credentials never enter URLs, browser bundles or response bodies. */
export async function callGemini(model: string, messages: Message[], key: string) {
  if (!/^gemini-[a-z0-9.-]+$/.test(model)) throw new Error("Invalid Gemini model configuration");
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      signal: AbortSignal.timeout(12000),
      headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: messages[0]!.content }] },
        contents: messages.slice(1).map(message => ({
          role: message.role === "assistant" ? "model" : "user",
          parts: [{ text: message.content }],
        })),
        generationConfig: {
          maxOutputTokens: 1024,
          // Retain default sampling; keep reasoning short for website help.
          thinkingConfig: { thinkingLevel: "low" },
          responseMimeType: "text/plain",
        },
      }),
    },
  );
  if (!response.ok) {
    await response.body?.cancel();
    return new Response(null, { status: response.status });
  }
  const data = await response.json() as {
    candidates?: Array<{
      finishReason?: string;
      content?: { parts?: Array<{ text?: string; thought?: boolean }> };
    }>;
  };
  const candidate = data.candidates?.[0];
  // Blocked or truncated responses must not be presented as complete answers.
  const text = candidate?.finishReason === "STOP"
    ? candidate.content?.parts?.filter(part => !part.thought).map(part => part.text ?? "").join("") ?? ""
    : "";
  return Response.json({ choices: [{ message: { content: text } }] });
}
