import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence, animate, useMotionValue, useTransform } from "framer-motion"
import {
  IndianRupee, Wallet, Receipt, CalendarClock, CheckCircle2, Banknote, Percent, ShieldCheck, PiggyBank, ArrowDown, BellRing,
} from "lucide-react"
import { ShowcaseShell } from "@/components/showcase/ShowcaseShell"
import { GlassCard, Reveal, SectionHeading, DemoButton, CountUp, EASE } from "@/components/showcase/ui"

const GOLD = "#D49A58"
const GREEN = "#4ADE80"

const TOTAL_FEE = 45000

const ITEMS = [
  { label: "Tuition Fee", amount: 30000 },
  { label: "Transport Fee", amount: 8000 },
  { label: "Exam & Lab Charges", amount: 4000 },
  { label: "Smart Class Subscription", amount: 3000 },
]

function RollingNumber({ to }: { to: number }) {
  const value = useMotionValue(0)

  useEffect(() => {
    const controls = animate(value, to, { duration: 2.4, ease: EASE })
    return () => controls.stop()
  }, [value, to])

  const segments = useMemo(() => {
    const s = String(to)
    const segs: string[] = []
    const first = s.length % 3
    if (first) segs.push(s.slice(0, first))
    for (let i = first || 3; i < s.length; i += 3) segs.push(s.slice(i, i + 3))
    return segs.map((seg) => [...seg].map(Number))
  }, [to])

  return (
    <span className="inline-flex items-baseline overflow-hidden">
      {segments.map((seg, si) => (
        <span key={si} className="flex items-baseline">
          {si > 0 && <span className="px-0.5 text-3xl font-black text-[#B8A995] sm:text-5xl">,</span>}
          {seg.map((_, i) => {
            const factor = Math.pow(10, seg.length - 1 - i + (segments.length - si - 1) * 3)
            const y = useTransform(value, (v) => {
              const d = Math.floor(v / factor) % 10
              return `${-d}em`
            })
            return (
              <span key={`${si}-${i}`} className="relative inline-block h-[1em] w-[0.62em] overflow-hidden text-center">
                <motion.span style={{ y }} className="absolute left-0 top-0 flex flex-col">
                  {Array.from({ length: 10 }).map((_, d) => (
                    <span key={d} className="h-[1em] leading-[1em]">{d}</span>
                  ))}
                </motion.span>
              </span>
            )
          })}
        </span>
      ))}
    </span>
  )
}

const fmt = (n: number) => n.toLocaleString("en-IN")

function InstallmentBuilder() {
  const [down, setDown] = useState(40)
  const [paid, setPaid] = useState(false)

  const first = Math.round((TOTAL_FEE * down) / 100)
  const remainder = TOTAL_FEE - first
  const second = Math.round(remainder / 2)
  const third = remainder - second

  return (
    <GlassCard className="relative overflow-hidden p-6 sm:p-8">
      <div aria-hidden className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#D49A58]/10 blur-[60px]" />

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D49A58]/40 bg-[#D49A58]/10">
            <Banknote className="h-4 w-4 text-[#A34E17]" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-[#221910]">Split into 3 installments</h3>
            <p className="text-[11px] text-[#8A7A6B]">Drag the dial to adjust the down payment</p>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {paid ? (
            <motion.span
              key="paid"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#4ADE80]/20 px-3 py-1 text-[11px] font-bold text-[#2E8B52]"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Paid
            </motion.span>
          ) : (
            <motion.span
              key="due"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#F5F0E6] px-3 py-1 text-[11px] font-bold text-[#8A7A6B]"
            >
              <CalendarClock className="h-3.5 w-3.5" /> Plan active
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Slider */}
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-semibold text-[#61544A]">Down payment</span>
        <motion.span key={down} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="counter-num font-black text-[#A34E17]">
          {down}%
        </motion.span>
      </div>
      <input
        type="range"
        min={20}
        max={50}
        step={1}
        value={down}
        onChange={(e) => { setDown(Number(e.target.value)); setPaid(false) }}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#E5DDD2] accent-[#D49A58]"
        aria-label="Down payment percentage"
      />
      <div className="mt-1 flex justify-between text-[10px] text-[#B8A995]">
        <span>20%</span>
        <span>50%</span>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[11px] text-[#8A7A6B]">
        <Percent className="h-3.5 w-3.5 text-[#A34E17]" />
        Remaining balance split equally across the next two installments
      </div>

      {/* Receipt */}
      <div className="mt-6 rounded-2xl border border-[#E5DDD2] bg-white/70 p-5">
        <div className="mb-4 flex items-center gap-2 border-b border-dashed border-[#E5DDD2] pb-4">
          <Receipt className="h-4 w-4 text-[#A34E17]" />
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#61544A]">Digital receipt</p>
          <span className="ml-auto text-[10px] font-semibold text-[#B8A995]">RCP-2025-04271</span>
        </div>

        <ul className="space-y-2">
          {ITEMS.map((item, i) => (
            <motion.li
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.4, ease: EASE }}
              className="flex items-center justify-between text-xs"
            >
              <span className="text-[#61544A]">{item.label}</span>
              <span className="counter-num font-semibold text-[#221910]">₹{fmt(item.amount)}</span>
            </motion.li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between border-t border-[#E5DDD2] pt-4">
          <span className="text-sm font-bold text-[#221910]">Total fee</span>
          <span className="counter-num text-lg font-black text-[#A34E17]">₹{fmt(TOTAL_FEE)}</span>
        </div>

        <div className="mt-4 space-y-1.5 rounded-xl border border-[#E5DDD2] bg-[#F9F6F0]/80 p-3.5 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#61544A]">Subtotal</span>
            <span className="counter-num font-semibold text-[#221910]">₹{fmt(TOTAL_FEE - 8100)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#61544A]">GST (18%) — tuition &amp; services</span>
            <span className="counter-num font-semibold text-[#8A7A6B]">₹{fmt(8100)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between border-t border-dashed border-[#E5DDD2] pt-1.5">
            <span className="text-xs font-black text-[#221910]">Billable total</span>
            <span className="counter-num text-xs font-black text-[#A34E17]">₹{fmt(TOTAL_FEE)}</span>
          </div>
        </div>
      </div>

      {/* Installment schedule */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Now", amount: first, when: "On admission", accent: GOLD },
          { label: "2nd", amount: second, when: "By 15 Nov", accent: "#B57F1E" },
          { label: "3rd", amount: third, when: "By 15 Feb", accent: "#A34E17" },
        ].map((inst, i) => (
          <motion.div
            key={inst.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1, duration: 0.45, ease: EASE }}
            className={`rounded-2xl border p-4 ${i === 0 ? "border-[#D49A58]/50 bg-[#D49A58]/10" : "border-[#E5DDD2] bg-white/70"}`}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#61544A]">
                {i === 0 ? `Down ${down}%` : inst.label}
              </span>
              <span className="text-[10px] text-[#B8A995]">{inst.when}</span>
            </div>
            <AnimatePresence mode="popLayout">
              <motion.p
                key={inst.amount}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="counter-num text-lg font-black"
                style={{ color: inst.accent }}
              >
                ₹{fmt(inst.amount)}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setPaid(true)}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D49A58] py-3 text-sm font-bold text-[#221910] transition-all hover:bg-[#E0AA6E] hover:shadow-[0_0_20px_rgba(212,154,88,0.5)]"
      >
        <IndianRupee className="h-4 w-4" />
        Pay down payment · ₹{fmt(first)}
      </button>
    </GlassCard>
  )
}

export default function FeeManagement() {
  return (
    <ShowcaseShell
      section="Solutions"
      label="Fee Management"
      accent={GOLD}
      title={
        <>
          Fees that{" "}
          <span className="bg-gradient-to-r from-[#D49A58] to-[#E9B97E] bg-clip-text text-transparent">
            collect themselves
          </span>
        </>
      }
      subtitle="Odometer-accurate collections, flexible installment plans, and digital receipts — real-time visibility into every rupee your school is owed."
    >
      {/* ── Hero: odometer + builder ── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <GlassCard className="relative overflow-hidden p-10">
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(212,154,88,0.6), transparent)" }}
              />
              <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#8A7A6B]">
                <Wallet className="h-4 w-4 text-[#A34E17]" />
                Collected this month
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#A34E17] sm:text-5xl">₹</span>
                <span className="text-5xl font-black tracking-tight text-[#221910] sm:text-7xl">
                  <RollingNumber to={TOTAL_FEE} />
                </span>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center gap-1 rounded-2xl border border-[#E5DDD2] bg-white/70 px-3 py-4">
                  <span className="counter-num text-lg font-black text-[#3BA855]">
                    <CountUp to={92.4} decimals={1} suffix="%" />
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8A7A6B]">Collection rate</span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-2xl border border-[#E5DDD2] bg-white/70 px-3 py-4">
                  <span className="counter-num text-lg font-black text-[#221910]">
                    <CountUp to={418} />
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8A7A6B]">Paid students</span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-2xl border border-[#E5DDD2] bg-white/70 px-3 py-4">
                  <span className="counter-num text-lg font-black text-[#A34E17]">
                    <CountUp to={12} suffix=" days" />
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8A7A6B]">Faster cycle</span>
                </div>
              </div>
            </GlassCard>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                { icon: ShieldCheck, text: "UPI, cards, net-banking & offline reconciliation" },
                { icon: PiggyBank, text: "Fee waivers, concessions & late-fee logic built in" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 rounded-2xl border border-[#E5DDD2] bg-white/70 px-4 py-3.5 backdrop-blur-md">
                  <Icon className="h-5 w-5 shrink-0 text-[#A34E17]" />
                  <p className="text-xs leading-relaxed text-[#61544A]">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <InstallmentBuilder />
        </div>
      </section>

      {/* ── Why it matters ── */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            kicker="The finance office, unclogged"
            accent={GOLD}
            title="Stop chasing parents for money"
            subtitle="Auto-reminders, flexible plans, and instant receipts turn fee collection from the office's biggest headache into a background task."
          />
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { icon: BellRing, title: "Smart reminders", desc: "Polite, scheduled nudges on WhatsApp and SMS before and after every due date." },
            { icon: ArrowDown, title: "Auto-reconciliation", desc: "UPI and bank payments match to students automatically — zero manual matching." },
            { icon: CheckCircle2, title: "Instant digital receipts", desc: "Parents get a branded, itemised receipt the moment a payment lands." },
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
              <IndianRupee className="mx-auto mb-4 h-9 w-9 text-[#A34E17]" />
              <h3 className="mx-auto max-w-xl font-display text-2xl font-black tracking-tight text-[#221910] sm:text-3xl">
                See your collection rate climb
              </h3>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#61544A]">
                A live demo shows how schools recover lakhs of previously-stuck fees every term.
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
