import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageCircle, MessageSquareText, BellRing, Send, CheckCheck, Languages, CalendarClock,
  Megaphone, Fingerprint, Sparkles,
} from "lucide-react"
import { ShowcaseShell } from "@/components/showcase/ShowcaseShell"
import { GlassCard, Reveal, SectionHeading, DemoButton, CountUp, EASE } from "@/components/showcase/ui"

const GOLD = "#D49A58"
const GREEN = "#4ADE80"

type Tone = "alert" | "fee" | "info" | "success"

interface Msg {
  id: number
  text: string
  tone: Tone
  time: string
}

const TONE_STYLES: Record<Tone, { chip: string; bubble: string; text: string }> = {
  alert: { chip: "border-[#C0392B]/40 text-[#C0392B]", bubble: "border-[#F08A7A]/40 bg-[#F08A7A]/15", text: "#221910" },
  fee: { chip: "border-[#B57F1E]/40 text-[#B57F1E]", bubble: "border-[#E7B158]/45 bg-[#E7B158]/20", text: "#221910" },
  info: { chip: "border-[#4A76B8]/40 text-[#4A76B8]", bubble: "border-[#8FB4E8]/45 bg-[#8FB4E8]/20", text: "#221910" },
  success: { chip: "border-[#2E8B52]/40 text-[#2E8B52]", bubble: "border-[#4ADE80]/45 bg-[#4ADE80]/15", text: "#221910" },
}

const QUICK: { label: string; text: string; tone: Tone }[] = [
  {
    label: "School closed Monday",
    text: "📢 IMPORTANT: School remains closed on Monday, 18 Aug due to heavy rain forecast. Classes resume Tuesday at 8:00 AM.",
    tone: "alert",
  },
  {
    label: "Term 2 fee due 15 Nov",
    text: "🧾 Reminder: Term 2 fee of ₹12,500 is due by 15 Nov. Pay via the portal, UPI, or school counter.",
    tone: "fee",
  },
  {
    label: "PTM this Saturday",
    text: "📅 Parent-Teacher Meeting this Saturday, 24 Aug · 10 AM–1 PM. Slots auto-assigned — check your portal.",
    tone: "info",
  },
  {
    label: "Results uploaded",
    text: "🎉 Term 1 results are live on the portal. Report cards will also be sent to your WhatsApp.",
    tone: "success",
  },
]

function BroadcastPreview() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: 1, text: QUICK[3].text, tone: QUICK[3].tone, time: "9:41 AM" },
  ])

  const nowLabel = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  const send = (text: string, tone: Tone) => {
    setMessages((prev) => [...prev, { id: Date.now(), text, tone, time: nowLabel() }])
  }

  return (
    <GlassCard className="relative flex h-full flex-col overflow-hidden p-6 sm:p-8">
      <div aria-hidden className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-[#D49A58]/15 blur-[80px]" />

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D49A58]/40 bg-[#D49A58]/10">
            <Megaphone className="h-4.5 w-4.5 text-[#A34E17]" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-[#221910]">Broadcast Studio</h3>
            <p className="text-[11px] text-[#8A7A6B]">1,240 parents · WhatsApp + SMS + Push</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-[#4ADE80]/40 bg-[#4ADE80]/15 px-3 py-1 text-[10px] font-bold text-[#2E8B52]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ADE80] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4ADE80]" />
          </span>
          Live
        </span>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {QUICK.map((q) => (
          <button
            key={q.label}
            type="button"
            onClick={() => send(q.text, q.tone)}
            className={`group inline-flex items-center gap-1.5 rounded-full border bg-white/70 px-3.5 py-1.5 text-[11px] font-bold transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_8px_20px_rgba(212,154,88,0.25)] ${TONE_STYLES[q.tone].chip}`}
          >
            <Sparkles className="h-3 w-3 opacity-60 group-hover:opacity-100" />
            {q.label}
          </button>
        ))}
      </div>

      <div className="flex min-h-[300px] flex-1 flex-col-reverse gap-3 overflow-hidden rounded-2xl border border-[#E5DDD2] bg-[#FDFAF5] p-4 sm:p-5">
        {messages.map((m) => {
          const s = TONE_STYLES[m.tone]
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 24, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 18, bounce: 0.4 }}
              className={`max-w-[88%] rounded-2xl rounded-tl-md border px-4 py-3 ${s.bubble}`}
            >
              <p className="text-xs leading-relaxed text-[#221910]">{m.text}</p>
              <p className="mt-2 flex items-center gap-1 text-[9px] font-semibold text-[#8A7A6B]">
                <CheckCheck className="h-3 w-3 text-[#3BA855]" /> {m.time} · Broadcast
              </p>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-[#E5DDD2] bg-white/70 p-1.5">
        <span className="pl-3 text-xs text-[#61544A]">
          To <b className="text-[#A34E17]">All parents</b> · bilingual EN + MR
        </span>
        <span className="ml-auto hidden text-[10px] font-semibold text-[#8A7A6B] sm:inline">
          WhatsApp · SMS · Push
        </span>
        <button
          type="button"
          onClick={() => send("Thank you for your attention — the REVENEX team.", "success")}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#D49A58] px-4 py-2.5 text-xs font-bold text-[#221910] transition-all hover:bg-[#E0AA6E] hover:shadow-[0_0_16px_rgba(212,154,88,0.5)]"
        >
          <Send className="h-3.5 w-3.5" /> Broadcast
        </button>
      </div>
    </GlassCard>
  )
}

type Channel = "whatsapp" | "sms" | "push"

const CHANNELS: { id: Channel; label: string; icon: typeof MessageCircle }[] = [
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "sms", label: "SMS", icon: MessageSquareText },
  { id: "push", label: "Push", icon: BellRing },
]

function WhatsAppScreen() {
  return (
    <motion.div
      key="whatsapp"
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="flex h-full flex-col bg-[#0B141A]"
    >
      <div className="flex items-center gap-2.5 bg-[#1F2C34] px-4 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00A884] text-[10px] font-black text-white">
          RV
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-bold text-white">REVENEX School</p>
          <p className="text-[9px] text-[#00A884]">online</p>
        </div>
        <MessageCircle className="ml-auto h-4 w-4 text-white/60" />
      </div>
      <div className="flex-1 space-y-2.5 overflow-hidden px-3 py-4">
        <p className="mx-auto w-fit rounded-lg bg-[#182229] px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white/40">
          Today
        </p>
        <div className="ml-auto w-fit max-w-[82%] rounded-lg rounded-tr-none bg-[#00A884] px-3 py-2 text-[11px] leading-relaxed text-white">
          📢 School closed Monday due to heavy rain. Classes resume Tuesday.
        </div>
        <div className="w-fit max-w-[82%] rounded-lg rounded-tl-none bg-[#005C4B] px-3 py-2 text-[11px] leading-relaxed text-white">
          🧾 Term 2 fee of ₹12,500 due by 15 Nov. Pay via portal, UPI, or counter.
        </div>
        <p className="ml-auto flex w-fit items-center gap-1 text-[9px] text-white/35">
          <CheckCheck className="h-3 w-3 text-[#53BDEB]" /> Delivered
        </p>
      </div>
      <div className="flex items-center gap-2 bg-[#1F2C34] px-3 py-2.5">
        <span className="flex-1 rounded-full bg-[#2A3942] px-4 py-2 text-[10px] text-white/35">
          Broadcast to all parents
        </span>
        <Send className="h-4 w-4 text-[#00A884]" />
      </div>
    </motion.div>
  )
}

function SMSScreen() {
  return (
    <motion.div
      key="sms"
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="flex h-full flex-col bg-[#10151B]"
    >
      <div className="flex items-center gap-2 bg-[#1A2129] px-4 py-3">
        <MessageSquareText className="h-4 w-4 text-white/70" />
        <p className="text-xs font-bold text-white">REVENEX-SCHL</p>
        <span className="ml-auto text-[9px] text-white/40">SMS · 1240</span>
      </div>
      <div className="flex-1 space-y-3 overflow-hidden px-3 py-4">
        <p className="mx-auto w-fit rounded-lg bg-[#1E2733] px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white/40">
          Today · 7:02 AM
        </p>
        <div className="w-fit max-w-[85%] rounded-xl bg-[#FFFFFF] px-3.5 py-2.5 text-[11px] leading-relaxed text-[#1A1410]">
          📢 IMPORTANT: School closed Monday 18 Aug due to heavy rain forecast. Classes resume Tuesday 8 AM.
          <p className="mt-1 text-[9px] font-bold text-[#6B5D52]">REVENEX-SCHL</p>
        </div>
        <div className="ml-auto w-fit rounded-xl bg-[#D9E2F0] px-3.5 py-2.5 text-[11px] leading-relaxed text-[#1A1410]">
          Yes, noted. Thanks.
          <p className="mt-1 text-right text-[9px] font-bold text-[#6B5D52]">Me · 7:04 AM</p>
        </div>
      </div>
      <div className="bg-[#1A2129] px-3 py-2.5">
        <span className="block rounded-full bg-[#232C36] px-4 py-2 text-[10px] text-white/35">Text message</span>
      </div>
    </motion.div>
  )
}

function PushScreen() {
  return (
    <motion.div
      key="push"
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="flex h-full flex-col bg-gradient-to-br from-[#241A12] via-[#18120E] to-[#0D0A07]"
    >
      <div className="flex flex-col items-center pt-7">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Mon · 18 Aug</p>
        <p className="mt-1 text-4xl font-black tracking-tight text-[#F9F6F0]">9:41</p>
      </div>

      <motion.div
        className="mx-4 mt-6 rounded-2xl border border-white/10 bg-[#23201C]/95 p-3.5 backdrop-blur-md"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D49A58] shadow-[0_0_14px_rgba(212,154,88,0.4)]">
            <BellRing className="h-4 w-4 text-[#18120E]" />
          </span>
          <div className="min-w-0">
            <p className="flex items-center gap-1 text-[11px] font-bold text-[#F9F6F0]">
              REVENEX School <span className="ml-auto font-normal text-white/35">now</span>
            </p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-white/60">
              📢 School closed Monday — classes resume Tuesday 8 AM.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="mt-auto flex flex-col items-center gap-1.5 pb-8">
        <Fingerprint className="h-8 w-8 text-[#D49A58]/60" />
        <p className="text-[9px] font-semibold uppercase tracking-widest text-white/30">Slide to open</p>
      </div>
    </motion.div>
  )
}

function DevicePreview() {
  const [channel, setChannel] = useState<Channel>("whatsapp")
  return (
    <GlassCard className="flex h-full flex-col items-center p-6 sm:p-8">
      <div className="mb-6 inline-flex rounded-2xl border border-[#E5DDD2] bg-white/70 p-1.5 shadow-[0_10px_30px_rgba(212,154,88,0.10)] backdrop-blur-md">
        {CHANNELS.map(({ id, label, icon: Icon }) => {
          const active = channel === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => setChannel(id)}
              className="relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors"
              style={{ color: active ? "#221910" : "#8A7A6B" }}
            >
              {active && (
                <motion.span
                  layoutId="commChannelDial"
                  className="absolute inset-0 rounded-xl bg-[#D49A58] shadow-[0_0_18px_rgba(212,154,88,0.5)]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <Icon className="relative h-4 w-4" />
              <span className="relative">{label}</span>
            </button>
          )
        })}
      </div>

      <div className="relative w-[280px]">
        <div className="rounded-[2.6rem] border-[10px] border-[#1C140F] bg-black shadow-[0_30px_80px_rgba(34,25,16,0.4)]">
          <div className="relative h-[540px] w-full overflow-hidden rounded-[2rem]">
            <div className="absolute left-1/2 top-0 z-20 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-[#1C140F]" />
            <AnimatePresence mode="wait">
              {channel === "whatsapp" && <WhatsAppScreen />}
              {channel === "sms" && <SMSScreen />}
              {channel === "push" && <PushScreen />}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-[#8A7A6B]">
        This is exactly how parents see your broadcast.
      </p>
    </GlassCard>
  )
}

export default function Communication() {
  return (
    <ShowcaseShell
      section="Solutions"
      label="Communication"
      accent={GOLD}
      title={
        <>
          Every parent hears you,{" "}
          <span className="bg-gradient-to-r from-[#D49A58] to-[#E9B97E] bg-clip-text text-transparent">
            the first time
          </span>
        </>
      }
      subtitle="Broadcast on WhatsApp, SMS, and push from one composer — with read receipts, auto-translation, and bilingual messages parents actually open."
    >
      {/* ── Hero: broadcast + device preview ── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-8 lg:grid-cols-2">
          <BroadcastPreview />
          <DevicePreview />
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center gap-1 rounded-2xl border border-[#E5DDD2] bg-white/70 px-3 py-4 text-center backdrop-blur-md">
            <span className="counter-num text-lg font-black text-[#3BA855] sm:text-xl">
              <CountUp to={98} suffix="%" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8A7A6B]">Open rate</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-2xl border border-[#E5DDD2] bg-white/70 px-3 py-4 text-center backdrop-blur-md">
            <span className="counter-num text-lg font-black text-[#221910] sm:text-xl">
              <CountUp to={4.2} decimals={1} suffix="s" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8A7A6B]">Median reply</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-2xl border border-[#E5DDD2] bg-white/70 px-3 py-4 text-center backdrop-blur-md">
            <span className="counter-num text-lg font-black text-[#A34E17] sm:text-xl">
              <CountUp to={12} />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8A7A6B]">Channels</span>
          </div>
        </div>
      </section>

      {/* ── Why it matters ── */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            kicker="Two-way, translated, scheduled"
            accent={GOLD}
            title="School-to-parent messaging that finally works"
            subtitle="One composer reaches every phone in every language — and parents can actually reply back."
          />
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { icon: MessageCircle, title: "One compose box, every channel", desc: "Write once, deliver on WhatsApp, SMS, email, and push — with read receipts on every message." },
            { icon: Languages, title: "Auto-translate & local languages", desc: "Broadcasts auto-translate to the 8 languages your families speak, keeping tone intact." },
            { icon: CalendarClock, title: "Schedule & sequence follow-ups", desc: "Queue reminders and auto-escalate unread messages so nothing important slips through." },
          ].map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 0.1}>
              <GlassCard className="h-full p-7 transition-all hover:border-[#D49A58]/50 hover:bg-white hover:shadow-[0_24px_60px_rgba(212,154,88,0.18)]">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D49A58]/40 bg-[#D49A58]/10">
                  <Icon className="h-6 w-6 text-[#A34E17]" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#221910]">{title}</h3>
                <p className="text-sm leading-relaxed text-[#61544A]">{desc}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-[#E5DDD2] bg-white/70 backdrop-blur-xl shadow-[0_20px_60px_rgba(212,154,88,0.15)] px-8 py-12 text-center sm:px-14">
            <div aria-hidden className="absolute -top-20 left-1/3 h-80 w-80 rounded-full bg-[#D49A58]/20 blur-[110px]" />
            <div className="relative">
              <Megaphone className="mx-auto mb-4 h-9 w-9 text-[#A34E17]" />
              <h3 className="mx-auto max-w-xl font-display text-2xl font-black tracking-tight text-[#221910] sm:text-3xl">
                Be heard by every parent
              </h3>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#61544A]">
                See bilingual broadcasts delivered across WhatsApp, SMS, and push in a live demo.
              </p>
              <div className="mt-8 flex justify-center">
                <DemoButton />
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </ShowcaseShell>
  )
}
