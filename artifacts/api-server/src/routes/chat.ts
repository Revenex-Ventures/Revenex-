import { buildChatSystemPrompt, getPublicAnswer, getFaqAnswer } from "@workspace/api-zod";
import { Router, type IRouter } from "express";
import { randomUUID } from "crypto";
import { ChatMemory } from "../lib/chat-memory";
import { schemas, validateBody } from "../lib/validation";

const router: IRouter = Router();
const KEY = (process.env["OPENROUTER_API_KEY"] ?? "").trim();

const sessions = new ChatMemory();

async function callOpenRouter(
  model: string,
  messages: Array<{ role: string; content: string }>,
) {
  const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    signal: AbortSignal.timeout(7000),
    headers: {
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      "X-Title": "REVENEX Chatbot",
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 320,
      temperature: 0.2,
    }),
  });
  return resp;
}

const FREE_MODELS = (process.env.OPENROUTER_MODELS ?? "openrouter/free")
  .split(",")
  .map((model) => model.trim())
  .filter(Boolean)
  .slice(0, 3);

router.post("/chat", validateBody(schemas.chat), async (req, res) => {
  const { message, language } = req.body as {
    message?: string;
    language?: string;
  };
  if (!message?.trim()) {
    res.status(400).json({ error: "message required" });
    return;
  }
  // FAQ mode is the default: unsupported questions never reach a paid provider.
  if (process.env.CHAT_MODE !== "ai") {
    res.json({ reply: getFaqAnswer(message, language ?? "en"), model: "public-knowledge" });
    return;
  }
  const publicReply = getPublicAnswer(message, language ?? "en");
  if (publicReply) {
    res.json({ reply: publicReply, model: "public-knowledge" });
    return;
  }
  if (!KEY) {
    res.status(503).json({ error: "AI not configured" });
    return;
  }

  try {
    const cookieName = "chat_session";
    let sid = req.cookies?.[cookieName] as string | undefined;
    if (!sid || !/^[a-f0-9-]{36}$/.test(sid)) {
      sid = randomUUID();
      res.cookie(cookieName, sid, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 60 * 1000,
        path: "/",
      });
    }

    const memory = sessions.get(sid) ?? [];
    const system = {
      role: "system",
      content: buildChatSystemPrompt(language ?? "en"),
    };
    const msgs = [system, ...memory, { role: "user", content: message }];

    let r: Response | null = null;
    let usedModel = FREE_MODELS[0]!;
    for (const model of FREE_MODELS) {
      usedModel = model;
      try {
        r = await callOpenRouter(model, msgs);
      } catch {
        req.log.warn({ model }, "AI provider request timed out or failed");
        continue;
      }
      if (r.ok) break;
      // Access and account failures affect every model on this provider key.
      // Retrying another model only repeats a request that cannot succeed.
      if ([401, 402, 403].includes(r.status)) {
        req.log.error(
          { status: r.status, model, code: "AI_PROVIDER_ACCESS" },
          "AI provider rejected account access; check server configuration",
        );
        res.status(503).json({
          error:
            "AI replies are temporarily unavailable. You can still use FAQ help or contact our team.",
        });
        return;
      }
      req.log.warn(
        { status: r.status, model },
        "Model unavailable, trying next",
      );
    }

    if (!r || !r.ok) {
      req.log.error({ status: r?.status }, "OpenRouter all-models-failed");
      res.status(502).json({
        error: "AI is temporarily unavailable. Please try again later.",
      });
      return;
    }

    const d = (await r.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const rawReply = d.choices?.[0]?.message?.content;
    const reply =
      typeof rawReply === "string" ? rawReply.trim().slice(0, 4000) : "";
    if (!reply) {
      res
        .status(502)
        .json({ error: "AI returned an empty response. Please try again." });
      return;
    }

    sessions.set(sid, [
      ...memory,
      { role: "user", content: message! },
      { role: "assistant", content: reply },
    ]);

    res.json({ reply, model: usedModel });
  } catch (err) {
    req.log.error({ err }, "Chat failed");
    res.status(500).json({ error: "Internal error" });
  }
});

export default router;
