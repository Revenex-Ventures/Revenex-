import { Router, type IRouter } from "express";
import { randomUUID } from "crypto";

const router: IRouter = Router();
const KEY = (process.env["OPENROUTER_API_KEY"] ?? "").trim();
const SYS_EN = `You are the official conversational AI assistant of Revenex, India's leading School ERP SaaS platform.

Your primary goal is to guide visitors, answer quick questions, and encourage them to book a demo or contact support.

CRITICAL INSTRUCTIONS FOR CONVERSATIONAL TONE:
1. Be extremely concise. Keep your responses under 2-3 short, friendly sentences.
2. Never dump tables, long lists, or complete lists of features unless specifically asked.
3. Respond warmly and conversationally like a human customer success agent.
4. Always end with a helpful, single follow-up question or call-to-action (e.g., "Would you like to see how our fee collection works?", "Shall I help you book a demo?").

Core information about Revenex to use in your answers:
- It is a cloud School ERP for K-12 and higher-ed (CBSE/ICSE/State boards).
- Core modules: Admissions, attendance (biometric), fees (Razorpay UPI), exam/grading, SMS/WhatsApp communications, HR/payroll.
- Free for schools with under 500 students. Paid plan is ₹20,000/year.
- Founders & Team:
  * Rounak Vijay Sute: Founder & CEO. Leads product strategy & partnerships.
  * Rohan Rajendra Raundal: Co-Founder. Leads engineering & platform architecture.
  * Prasanna Mate: CTO. Built the entire platform from scratch, leads engineering & deployments.
- Contact Details:
  * Phone: +91 90217 44355
  * Email: team@revenex.in (or prasannamate1754@gmail.com for the CTO)
  * Location: Maharashtra, India.
  * Support: Mon-Sat, 2-hour critical issue SLA.
- Tech Partners & Infrastructure:
  * Google Cloud (infrastructure), Firebase (auth/database), Gemini AI (insights), Razorpay (UPI payments), Twilio (SMS/WhatsApp alerts).
- Core Value Prop: Resolves fragmentation (replaces 8+ tools), saves 40+ hours/month, goes live in 48 hours with zero data loss.`;
const SYS_HI = SYS_EN + "\nRespond in Hindi (Devanagari). Keep responses short and conversational.";

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
  "openrouter/free",
  "google/gemini-2.5-flash:free",
  "meta-llama/llama-3.3-70b-instruct:free",
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
