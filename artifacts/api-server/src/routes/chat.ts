import { Router, type IRouter } from "express";
import { randomUUID } from "crypto";

const router: IRouter = Router();
const KEY = (process.env["OPENROUTER_API_KEY"] ?? "").trim();
const SYS_EN = `You are the official AI assistant of Revenex, India's leading School ERP SaaS platform.

Revenex helps schools across India manage every aspect of school operations including:
- Admissions management (online applications, document collection, enrollment)
- Attendance tracking (student and staff, biometric integration, parent notifications)
- Fee management (fee collection, online payments, receipts, defaulter tracking)
- Academic management (timetables, exam scheduling, report cards, grade books)
- Communication tools (SMS/email to parents, notices, announcements)
- Admin dashboard (analytics, reports, multi-branch support)
- Staff & HR management (payroll, leave management)
- Library management, transport tracking, and more

Revenex is built for Indian schools (CBSE, ICSE, State Board), affordable, and works on mobile and desktop.

Always provide clear, specific answers about Revenex's features and benefits. Guide interested schools toward booking a demo or contacting the team. Never give generic responses — be specific about how Revenex solves real school management problems. Keep responses concise but informative.`;
const SYS_HI = SYS_EN + "\nRespond in Hindi (Devanagari).";

const sessions = new Map<string, Array<{ role: string; content: string }>>();

async function callOpenRouter(model: string, messages: Array<{ role: string; content: string }>) {
  const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", "X-Title": "REVENEX Chatbot" },
    body: JSON.stringify({ model, messages, max_tokens: 400, temperature: 0.2 }),
  });
  return resp;
}

const FREE_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "nousresearch/hermes-3-llama-3.1-405b:free",
  "openai/gpt-oss-120b:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
];

router.post("/chat", async (req, res) => {
  const { message, language } = req.body as { message?: string; language?: string };
  if (!message?.trim()) { res.status(400).json({ error: "message required" }); return; }
  if (!KEY) { res.status(503).json({ error: "AI not configured" }); return; }

  try {
    const cookieName = "chat_session";
    let sid = req.cookies?.[cookieName] as string | undefined;
    if (!sid) { sid = randomUUID(); res.cookie(cookieName, sid, { httpOnly: true, sameSite: "lax" }); }

    const memory = sessions.get(sid) ?? [];
    const system = { role: "system", content: language === "hi" ? SYS_HI : SYS_EN };
    const msgs = [system, ...memory, { role: "user", content: message }];

    let r: Response | null = null;
    let usedModel = FREE_MODELS[0]!;
    for (const model of FREE_MODELS) {
      usedModel = model;
      r = await callOpenRouter(model, msgs);
      if (r.ok) break;
      req.log.warn({ status: r.status, model }, "Model unavailable, trying next");
    }

    if (!r || !r.ok) {
      req.log.error({ status: r?.status }, "OpenRouter all-models-failed");
      const bodyText = await r?.text().catch(() => "") ?? "";
      res.status(502).json({ error: "AI error", details: bodyText });
      return;
    }

    const d = await r.json() as { choices?: Array<{ message?: { content?: string } }> };
    const reply = d.choices?.[0]?.message?.content?.trim() ?? "";

    const newMem = [...memory, { role: "user", content: message }, { role: "assistant", content: reply }].slice(-12);
    sessions.set(sid, newMem);

    res.json({ reply, model: usedModel });
  } catch (err) {
    req.log.error({ err }, "Chat failed");
    res.status(500).json({ error: "Internal error" });
  }
});

export default router;
