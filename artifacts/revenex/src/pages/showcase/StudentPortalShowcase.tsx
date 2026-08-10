import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useMotionTemplate } from "framer-motion"
import {
  CalendarDays, Clock3, BellRing, FileText, Wallet, Award, Library, ShieldCheck,
  ScanLine, Fingerprint, BadgeCheck, Wifi, LockKeyhole, Sparkles,
} from "lucide-react"
import { ShowcaseShell } from "@/components/showcase/ShowcaseShell"
import { GlassCard, Reveal, SectionHeading, DemoButton, CountUp, EASE } from "@/components/showcase/ui"

const GOLD = "#D49A58"
const GREEN = "#4ADE80"

const parseSec = (t: string) => {
  const [h, m] = t.split(":").map(Number)
  return h * 3600 + m * 60
}

const PERIODS = [
  { time: "08:45", subject: "Mathematics", room: "Room 204", color: GOLD },
  { time: "09:40", subject: "Science", room: "Lab 3", color: "#7FD1AE" },
  { time: "10:35", subject: "English", room: "Room 112", color: "#C98BD8" },
  { time: "11:45", subject: "Physical Education", room: "School Ground", color: "#E7B158" },
  { time: "12:30", subject: "Lunch Break", room: "Cafeteria", color: "#8FB4E8" },
  { time: "13:15", subject: "Social Studies", room: "Room 101", color: "#E07B54" },
  { time: "14:10", subject: "Hindi", room: "Room 108", color: "#9CA3AF" },
  { time: "15:05", subject: "Computers", room: "Lab 2", color: GREEN },
]

const LOCKERS = [
  { icon: FileText, label: "Report Cards", desc: "Term 2 · 2025-26", color: GOLD },
  { icon: Wallet, label: "Fee Receipts", desc: "Last paid 12 Jun", color: GREEN },
  { icon: Award, label: "Certificates", desc: "14 achievements", color: "#C98BD8" },
  { icon: Library, label: "E-Library", desc: "3 new titles", color: "#7FD1AE" },
  { icon: CalendarDays, label: "Calendar", desc: "PTM · 24 Aug", color: "#E7B158" },
  { icon: BadgeCheck, label: "Attendance", desc: "96.4% this term", color: "#8FB4E8" },
]

function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return now
}

function HoloCard() {
  const ref = useRef<HTMLDivElement>(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 180, damping: 20 })
  const sry = useSpring(ry, { stiffness: 180, damping: 20 })
  const gx = useMotionValue(50)
  const gy = useMotionValue(50)
  const sgx = useSpring(gx, { stiffness: 120, damping: 26 })
  const sgy = useSpring(gy, { stiffness: 120, damping: 26 })
  const glow = useMotionTemplate`radial-gradient(420px circle at ${sgx}% ${sgy}%, rgba(212,154,88,0.3), transparent 65%)`

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * 16)
    rx.set(-py * 16)
    gx.set((px + 0.5) * 100)
    gy.set((py + 0.5) * 100)
  }

  const onLeave = () => {
    rx.set(0)
    ry.set(0)
    gx.set(50)
    gy.set(50)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative mx-auto w-full max-w-md [perspective:1400px]"
    >
      <motion.div
        aria-hidden
        className="absolute -inset-8 rounded-[3rem] blur-3xl"
        animate={{ opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: "radial-gradient(circle, rgba(212,154,88,0.35), transparent 70%)" }}
      />

      <motion.div
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        className="relative aspect-[8/5] w-full overflow-hidden rounded-3xl border border-[#D49A58]/25 bg-gradient-to-br from-[#2A211A] to-[#17110C] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.6)] sm:p-7"
      >
        <motion.div aria-hidden className="absolute inset-0" style={{ background: glow }} />

        <motion.div
          aria-hidden
          className="absolute inset-x-8 h-[3px] rounded-full"
          style={{ top: "-10%", background: "linear-gradient(90deg, transparent, rgba(212,154,88,0.7), transparent)" }}
          animate={{ top: ["-10%", "110%"] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative flex h-full flex-col" style={{ transform: "translateZ(46px)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="REVENEX" className="h-6 w-auto opacity-90" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#D49A58]">Student ID</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi className="h-3.5 w-3.5 text-[#4ADE80]" />
              <LockKeyhole className="h-3.5 w-3.5 text-white/40" />
              <ScanLine className="h-3.5 w-3.5 text-[#D49A58]" />
            </div>
          </div>

          <div className="mt-4 flex flex-1 items-center gap-4">
            <div className="relative shrink-0">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F0E8DC] to-[#D9CCBB] text-xl font-black text-[#18120E] sm:h-20 sm:w-20 sm:text-2xl">
                AN
              </span>
              <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#4ADE80] shadow-[0_0_12px_rgba(74,222,128,0.7)]">
                <BadgeCheck className="h-3.5 w-3.5 text-[#18120E]" />
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-display text-lg font-black tracking-tight text-[#F9F6F0] sm:text-xl">
                Ananya Nair
              </h3>
              <p className="mt-0.5 text-xs text-white/50">Grade VIII-A · Roll 27 · Blood A+</p>
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold text-white/60">
                <Fingerprint className="h-3 w-3 text-[#D49A58]" /> Biometric verified
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-white/35">ID Number</p>
              <p className="counter-num text-sm font-black tracking-widest text-[#F9F6F0]">RVX-2025-0347</p>
            </div>
            <div className="flex items-end gap-[3px]">
              {[3, 1, 2, 1, 4, 1, 2, 3, 1, 1, 4, 2, 1, 3, 2, 1].map((w, i) => (
                <span key={i} className="bg-[#F9F6F0]/90" style={{ width: w, height: i % 3 ? 22 : 30 }} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.span
        className="absolute -left-3 top-6 flex items-center gap-1.5 rounded-full border border-[#D49A58]/30 bg-[#18120E]/90 px-3 py-1.5 text-[10px] font-bold text-[#D49A58] backdrop-blur-md"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="h-3 w-3" /> Holographic ID
      </motion.span>
      <motion.span
        className="absolute -right-2 bottom-8 flex items-center gap-1.5 rounded-full border border-[#4ADE80]/30 bg-[#18120E]/90 px-3 py-1.5 text-[10px] font-bold text-[#4ADE80] backdrop-blur-md"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ADE80] opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4ADE80]" />
        </span>
        Verified
      </motion.span>
    </div>
  )
}

function NextClassBento() {
  const now = useNow()
  const secNow = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
  const dayEnd = 24 * 3600

  let idx = PERIODS.findIndex((p) => secNow < parseSec(p.time))
  let target: number
  let tomorrow = false
  if (idx === -1) {
    tomorrow = true
    idx = 0
    target = dayEnd + parseSec(PERIODS[0].time)
  } else {
    target = parseSec(PERIODS[idx].time)
  }
  const diff = Math.max(0, target - secNow)
  const hh = Math.floor(diff / 3600)
  const mm = Math.floor((diff % 3600) / 60)
  const ss = diff % 60
  const pad = (n: number) => String(n).padStart(2, "0")
  const countdown = hh > 0 ? `${hh}h ${pad(mm)}m ${pad(ss)}s` : `${mm}m ${pad(ss)}s`
  const next = PERIODS[idx]

  return (
    <GlassCard className="relative overflow-hidden p-6 sm:p-7">
      <div aria-hidden className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-[#D49A58]/15 blur-[70px]" />

      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D49A58]/40 bg-[#D49A58]/10">
            <Clock3 className="h-4 w-4 text-[#A34E17]" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-[#221910]">Today&apos;s Timetable</h3>
            <p className="text-[11px] text-[#8A7A6B]">Class VIII-A · {tomorrow ? "tomorrow" : "live"} schedule</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#4ADE80]/40 bg-[#4ADE80]/15 px-3 py-1 text-[10px] font-bold text-[#2E8B52]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ADE80] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4ADE80]" />
          </span>
          LIVE
        </span>
      </div>

      <div className="relative mb-5 overflow-hidden rounded-2xl border border-[#D49A58]/40 bg-gradient-to-br from-[#D49A58]/15 to-transparent p-5">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(212,154,88,0.8), transparent)" }}
        />
        <p className="text-[10px] font-black uppercase tracking-widest text-[#A34E17]">
          Next class · {next.subject}
        </p>
        <p className="mt-1.5 font-display text-xl font-black tracking-tight text-[#221910]">
          {tomorrow ? "Starts tomorrow" : `Starts in ${countdown}`}
        </p>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-[#61544A]">
          <Clock3 className="h-3.5 w-3.5 text-[#A34E17]" /> {next.time} · {next.room}
        </p>
      </div>

      <ul className="space-y-1.5">
        {PERIODS.map((p, i) => {
          const isNext = i === idx
          return (
            <li
              key={p.time + p.subject}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs transition-colors ${
                isNext ? "border border-[#D49A58]/50 bg-[#D49A58]/10" : "border border-transparent"
              }`}
            >
              <span className="counter-num w-11 font-black text-[#B8A995]">{p.time}</span>
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: p.color, boxShadow: isNext ? `0 0 10px ${p.color}` : "none" }}
              />
              <span className={`flex-1 font-semibold ${isNext ? "text-[#221910]" : "text-[#61544A]"}`}>{p.subject}</span>
              <span className="hidden text-[10px] text-[#B8A995] sm:inline">{p.room}</span>
              {isNext && (
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="rounded-full bg-[#D49A58] px-2 py-0.5 text-[9px] font-black text-[#221910] shadow-[0_0_14px_rgba(212,154,88,0.5)]"
                >
                  NEXT
                </motion.span>
              )}
            </li>
          )
        })}
      </ul>
    </GlassCard>
  )
}

export default function StudentPortalShowcase() {
  return (
    <ShowcaseShell
      section="Solutions"
      label="Student Portal"
      accent={GOLD}
      title={
        <>
          The whole school in a{" "}
          <span className="bg-gradient-to-r from-[#D49A58] to-[#E9B97E] bg-clip-text text-transparent">
            student&apos;s pocket
          </span>
        </>
      }
      subtitle="A holographic ID, a live timetable, and every digital locker in one place — the entire school, one tap away for every student and parent."
    >
      {/* ── Hero: holographic ID + bento ── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <HoloCard />

            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center gap-1 rounded-2xl border border-[#E5DDD2] bg-white/70 px-3 py-4 text-center backdrop-blur-md">
                <span className="counter-num text-base font-black text-[#A34E17] sm:text-lg">
                  <CountUp to={2140} suffix="+" />
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8A7A6B]">Students on portal</span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-2xl border border-[#E5DDD2] bg-white/70 px-3 py-4 text-center backdrop-blur-md">
                <span className="counter-num text-base font-black text-[#3BA855] sm:text-lg">
                  <CountUp to={100} suffix="%" />
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8A7A6B]">Card adoption</span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-2xl border border-[#E5DDD2] bg-white/70 px-3 py-4 text-center backdrop-blur-md">
                <span className="counter-num text-base font-black text-[#221910] sm:text-lg">
                  <CountUp to={24} suffix="/7" />
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8A7A6B]">Offline access</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <NextClassBento />

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-bold text-[#221910]">
                  <BadgeCheck className="h-4 w-4 text-[#A34E17]" /> Digital Lockers
                </h3>
                <span className="text-[11px] text-[#8A7A6B]">6 secured vaults</span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {LOCKERS.map(({ icon: Icon, label, desc, color }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.4, ease: EASE }}
                    className="group cursor-pointer rounded-2xl border border-[#E5DDD2] bg-white/70 p-4 transition-all hover:-translate-y-0.5 hover:border-[#D49A58]/60 hover:bg-white hover:shadow-[0_14px_36px_rgba(212,154,88,0.20)]"
                  >
                    <div
                      className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ background: `${color}1A`, border: `1px solid ${color}45` }}
                    >
                      <Icon className="h-5 w-5" style={{ color }} />
                    </div>
                    <p className="text-xs font-bold text-[#221910]">{label}</p>
                    <p className="mt-0.5 text-[10px] text-[#8A7A6B]">{desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why it matters ── */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            kicker="One login, zero friction"
            accent={GOLD}
            title="Students carry everything on their phone"
            subtitle="No lost report cards, no forgotten fee receipts, no missed PTMs — the whole school lives in one verified, always-on pocket app."
          />
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { icon: Fingerprint, title: "One app, every credential", desc: "Attendance, timetable, homework, fees, and results — one login, one verified identity." },
            { icon: BellRing, title: "Parents ride along", desc: "Every update mirrors to parents instantly, so both sides always see the same truth." },
            { icon: ShieldCheck, title: "Private and verifiable", desc: "Biometric locks, role-based access, and full data privacy on every device." },
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
              <ShieldCheck className="mx-auto mb-4 h-9 w-9 text-[#A34E17]" />
              <h3 className="mx-auto max-w-xl font-display text-2xl font-black tracking-tight text-[#221910] sm:text-3xl">
                Give every family the whole school
              </h3>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#61544A]">
                See the student portal live — holographic IDs, timetables, and lockers built around your school.
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
