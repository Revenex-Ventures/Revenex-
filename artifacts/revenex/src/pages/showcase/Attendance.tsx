import { useCallback, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Fingerprint, Camera, Clock, BellRing, Check, Users, ScanFace, Radio, ShieldCheck,
} from "lucide-react"
import { ShowcaseShell } from "@/components/showcase/ShowcaseShell"
import { GlassCard, Reveal, SectionHeading, DemoButton, CountUp, EASE } from "@/components/showcase/ui"

const PRESENT = "#4ADE80"
const GOLD = "#D49A58"

const STUDENTS = [
  { id: "s1", name: "Aarav", grade: "VI-A" },
  { id: "s2", name: "Diya", grade: "VI-A" },
  { id: "s3", name: "Vihaan", grade: "VII-B" },
  { id: "s4", name: "Anaya", grade: "VII-B" },
  { id: "s5", name: "Ishaan", grade: "VIII-C" },
  { id: "s6", name: "Saanvi", grade: "VIII-C" },
  { id: "s7", name: "Kabir", grade: "IX-A" },
  { id: "s8", name: "Myra", grade: "IX-A" },
]

const FEATURES = [
  {
    icon: ScanFace,
    title: "Face & fingerprint recognition",
    desc: "Students punch in with a face scan or fingerprint in under a second — no queues, no buddy-marking, no proxies.",
  },
  {
    icon: Radio,
    title: "Live registers in real time",
    desc: "The attendance register updates instantly for every class, period-wise, the moment a student walks in.",
  },
  {
    icon: BellRing,
    title: "Instant parent alerts",
    desc: "The second attendance is marked, parents receive an SMS or app notification. Absence is never discovered late.",
  },
]

interface Burst {
  id: number
  x: number
  y: number
}

function AttendanceGauge() {
  const R = 70
  const C = 2 * Math.PI * R
  const target = 96.4
  return (
    <div className="relative flex h-64 w-64 items-center justify-center">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute inset-0 rounded-full border border-[#D49A58]/20"
          animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.9, ease: "easeOut" }}
        />
      ))}
      <motion.span
        aria-hidden
        className="absolute h-40 w-40 rounded-full blur-2xl"
        animate={{ opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: "radial-gradient(circle, rgba(212,154,88,0.55), transparent 70%)" }}
      />
      <svg viewBox="0 0 180 180" className="relative h-56 w-56 -rotate-90">
        <circle cx="90" cy="90" r={R} fill="none" stroke="rgba(34,25,16,0.08)" strokeWidth="11" />
        <motion.circle
          cx="90"
          cy="90"
          r={R}
          fill="none"
          stroke={GOLD}
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C - (target / 100) * C }}
          transition={{ duration: 2.2, ease: EASE }}
          style={{ filter: "drop-shadow(0 0 8px rgba(212,154,88,0.65))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="flex items-baseline gap-0.5">
          <CountUp
            to={target}
            decimals={1}
            className="text-5xl font-black tracking-tight text-[#221910]"
          />
          <span className="text-2xl font-black text-[#A34E17]">%</span>
        </div>
        <span className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-[#8A7A6B]">
          Attendance this week
        </span>
      </div>
    </div>
  )
}

export default function Attendance() {
  const [present, setPresent] = useState<Record<string, boolean>>({})
  const [bursts, setBursts] = useState<Burst[]>([])
  const dragging = useRef(false)

  const markPresent = useCallback((id: string, rect: DOMRect) => {
    setPresent((prev) => {
      if (prev[id]) return prev
      const bId = Date.now() + Math.random()
      setBursts((b) => [...b, { id: bId, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }])
      setTimeout(() => setBursts((b) => b.filter((p) => p.id !== bId)), 950)
      return { ...prev, [id]: true }
    })
  }, [])

  const handleTilePointerDown = (e: React.PointerEvent<HTMLButtonElement>, id: string) => {
    dragging.current = true
    markPresent(id, e.currentTarget.getBoundingClientRect())
  }

  const handleTilePointerEnter = (e: React.PointerEvent<HTMLButtonElement>, id: string) => {
    if (dragging.current) markPresent(id, e.currentTarget.getBoundingClientRect())
  }

  const presentCount = STUDENTS.filter((s) => present[s.id]).length
  const progress = Math.round((presentCount / STUDENTS.length) * 100)

  return (
    <ShowcaseShell
      section="Product"
      label="Attendance"
      accent={GOLD}
      title={
        <>
          Attendance that{" "}
          <span className="bg-gradient-to-r from-[#D49A58] to-[#E9B97E] bg-clip-text text-transparent">
            runs itself
          </span>
        </>
      }
      subtitle="Biometric punch-in, live period-wise registers, and automatic parent alerts — attendance tracked to the second and calculated to the decimal."
    >
      {/* ── Hero interactive grid ── */}
      <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Gauge + stats */}
          <div className="flex flex-col items-center justify-center gap-8">
            <GlassCard className="relative flex flex-col items-center overflow-hidden p-10">
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(212,154,88,0.6), transparent)" }}
              />
              <AttendanceGauge />
              <div className="mt-8 grid w-full grid-cols-3 gap-3">
                <div className="flex flex-col items-center gap-0.5 rounded-2xl border border-[#E5DDD2] bg-white/70 px-3 py-3">
                  <span className="counter-num text-xl font-black text-[#221910]">212</span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8A7A6B]">Days</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 rounded-2xl border border-[#E5DDD2] bg-white/70 px-3 py-3">
                  <span className="counter-num text-xl font-black text-[#3BA855]">98.1%</span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8A7A6B]">On-time</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 rounded-2xl border border-[#E5DDD2] bg-white/70 px-3 py-3">
                  <span className="counter-num text-xl font-black text-[#A34E17]">1,240</span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8A7A6B]">Students</span>
                </div>
              </div>
            </GlassCard>
            <div className="grid w-full grid-cols-3 gap-3">
              <div className="flex flex-col items-center gap-1 rounded-2xl border border-[#E5DDD2] bg-white/70 px-3 py-4 text-center backdrop-blur-md">
                <Fingerprint className="h-5 w-5 text-[#A34E17]" />
                <span className="text-xs font-semibold text-[#61544A]">Biometric punch-in</span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-2xl border border-[#E5DDD2] bg-white/70 px-3 py-4 text-center backdrop-blur-md">
                <Camera className="h-5 w-5 text-[#A34E17]" />
                <span className="text-xs font-semibold text-[#61544A]">Face recognition</span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-2xl border border-[#E5DDD2] bg-white/70 px-3 py-4 text-center backdrop-blur-md">
                <Clock className="h-5 w-5 text-[#A34E17]" />
                <span className="text-xs font-semibold text-[#61544A]">Period-wise registers</span>
              </div>
            </div>
          </div>

          {/* Biometric scan zone */}
          <GlassCard className="relative overflow-hidden p-6 sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ADE80] opacity-70" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-[#4ADE80]" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#221910]">Biometric Scan Zone</h3>
                  <p className="text-xs text-[#8A7A6B]">Click or drag across faces to mark present</p>
                </div>
              </div>
              <span className="rounded-full border border-[#E5DDD2] bg-white/70 px-3 py-1 text-[11px] font-bold text-[#61544A]">
                {presentCount}/{STUDENTS.length}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {STUDENTS.map((s, i) => {
                const isPresent = !!present[s.id]
                return (
                  <motion.button
                    key={s.id}
                    type="button"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.05, duration: 0.45, ease: EASE }}
                    onPointerDown={(e) => handleTilePointerDown(e, s.id)}
                    onPointerEnter={(e) => handleTilePointerEnter(e, s.id)}
                    onPointerUp={() => { dragging.current = false }}
                    onPointerLeave={() => { dragging.current = false }}
                    className={`group relative flex select-none flex-col items-center gap-2 rounded-2xl border p-3 transition-colors ${isPresent
                        ? "border-[#4ADE80]/60 bg-[#4ADE80]/15"
                        : "border-[#E5DDD2] bg-white/70 hover:border-[#D49A58]/60 hover:bg-white"
                      }`}
                  >
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-black text-[#221910] transition-transform group-hover:scale-105"
                      style={{ background: isPresent ? PRESENT : "#F0E8DC" }}
                    >
                      {s.name.slice(0, 1)}
                    </span>
                    <span className="text-center">
                      <span className="block text-[11px] font-bold text-[#221910]">{s.name}</span>
                      <span className="block text-[10px] text-[#8A7A6B]">{s.grade}</span>
                    </span>
                    <AnimatePresence>
                      {isPresent && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#4ADE80] shadow-[0_0_12px_rgba(74,222,128,0.8)]"
                        >
                          <Check className="h-3 w-3 text-[#18120E]" strokeWidth={3.5} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                )
              })}
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-semibold text-[#61544A]">Today&apos;s register</span>
                <span className="counter-num font-black text-[#3BA855]">{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#E5DDD2]">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #D49A58, #4ADE80)" }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-[11px] text-[#8A7A6B]">
                <Users className="h-3.5 w-3.5" />
                Every punch-in flows straight into the class register and the parents&apos; phone.
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Confetti-style particle bursts */}
        <div className="pointer-events-none fixed inset-0 z-50">
          <AnimatePresence>
            {bursts.map((b) => (
              <motion.div key={b.id} className="absolute" style={{ left: b.x, top: b.y }}>
                {Array.from({ length: 10 }).map((_, i) => {
                  const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.5
                  const dist = 34 + Math.random() * 34
                  return (
                    <motion.span
                      key={i}
                      className="absolute h-1.5 w-1.5 rounded-full"
                      style={{ background: i % 2 ? PRESENT : GOLD }}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{
                        x: Math.cos(angle) * dist,
                        y: Math.sin(angle) * dist,
                        opacity: 0,
                        scale: 0,
                      }}
                      transition={{ duration: 0.85, ease: "easeOut" }}
                    />
                  )
                })}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            kicker="Why schools choose it"
            accent={GOLD}
            title="Three things every principal loves"
            subtitle="Automation that removes the register chore, cuts proxy attendance, and keeps parents informed without a single phone call."
          />
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 0.1}>
              <GlassCard className="group h-full p-7 transition-all hover:border-[#D49A58]/50 hover:bg-white hover:shadow-[0_24px_60px_rgba(212,154,88,0.18)]">
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
            <div
              aria-hidden
              className="absolute -top-20 left-1/3 h-80 w-80 rounded-full bg-[#D49A58]/20 blur-[110px]"
            />
            <div className="relative">
              <ShieldCheck className="mx-auto mb-4 h-9 w-9 text-[#A34E17]" />
              <h3 className="mx-auto max-w-xl font-display text-2xl font-black tracking-tight text-[#221910] sm:text-3xl">
                Make every classroom clockwork-precise
              </h3>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#61544A]">
                See live attendance, biometric hardware, and parent alerts in a 20-minute demo built around your school.
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
