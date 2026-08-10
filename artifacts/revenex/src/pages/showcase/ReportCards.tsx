import { useState } from "react"
import { motion } from "framer-motion"
import {
  Award, BarChart3, CheckCircle2, ClipboardCheck, FileCheck2, RotateCw, Sparkles, TrendingUp, Stamp,
} from "lucide-react"
import { ShowcaseShell } from "@/components/showcase/ShowcaseShell"
import { GlassCard, Reveal, SectionHeading, DemoButton, CountUp, EASE } from "@/components/showcase/ui"

const GOLD = "#D49A58"
const GREEN = "#4ADE80"

const SUBJECTS = [
  { label: "Mathematics", value: 92 },
  { label: "Science", value: 88 },
  { label: "Languages", value: 90 },
  { label: "Social Studies", value: 84 },
  { label: "Computers", value: 95 },
  { label: "Sports", value: 78 },
]

const CX = 150
const CY = 150
const R = 100

function polar(i: number, scale: number) {
  const angle = (-90 + i * 60) * (Math.PI / 180)
  return { x: CX + R * scale * Math.cos(angle), y: CY + R * scale * Math.sin(angle) }
}

function buildDataPath() {
  return (
    "M " +
    SUBJECTS.map((s, i) => {
      const p = polar(i, s.value / 100)
      return `${p.x},${p.y}`
    }).join(" L ") +
    " Z"
  )
}

function RadarChart() {
  const dataPath = buildDataPath()

  const ringPoints = [0.25, 0.5, 0.75, 1].map((scale) =>
    Array.from({ length: 6 }, (_, i) => {
      const p = polar(i, scale)
      return `${p.x},${p.y}`
    }).join(" ")
  )

  return (
    <div className="relative mx-auto w-full max-w-[400px]">
      <motion.div
        aria-hidden
        className="absolute inset-6 rounded-full blur-3xl"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: "radial-gradient(circle, rgba(212,154,88,0.5), transparent 70%)" }}
      />
      <svg viewBox="0 0 300 300" className="relative w-full">
        {ringPoints.map((points, i) => (
          <polygon
            key={i}
            points={points}
            fill="none"
            stroke="rgba(34,25,16,0.08)"
            strokeWidth="1"
          />
        ))}
        {SUBJECTS.map((_, i) => {
          const p = polar(i, 1)
          return (
            <line
              key={i}
              x1={CX}
              y1={CY}
              x2={p.x}
              y2={p.y}
              stroke="rgba(34,25,16,0.06)"
              strokeWidth="1"
            />
          )
        })}

        <motion.path
          d={dataPath}
          fill="rgba(212,154,88,0.16)"
          stroke={GOLD}
          strokeWidth="2.5"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
          style={{ filter: "drop-shadow(0 0 6px rgba(212,154,88,0.55))" }}
        />

        {SUBJECTS.map((s, i) => {
          const p = polar(i, s.value / 100)
          return (
            <motion.circle
              key={s.label}
              cx={p.x}
              cy={p.y}
              r="4.5"
              fill="#FFFFFF"
              stroke={GOLD}
              strokeWidth="2.5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.1 + i * 0.1, duration: 0.4, ease: EASE }}
              style={{ transformOrigin: `${p.x}px ${p.y}px` }}
            />
          )
        })}
      </svg>

      <div className="relative mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {SUBJECTS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + i * 0.08, duration: 0.4, ease: EASE }}
            className="flex items-center justify-between rounded-xl border border-[#E5DDD2] bg-white/70 px-3 py-2"
          >
            <span className="text-[11px] font-medium text-[#61544A]">{s.label}</span>
            <span className="counter-num text-[11px] font-black text-[#A34E17]">{s.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const GRADES = [
  { subject: "Mathematics", grade: "A+", marks: 92 },
  { subject: "Science", grade: "A", marks: 88 },
  { subject: "English", grade: "A", marks: 90 },
  { subject: "Hindi", grade: "A+", marks: 91 },
  { subject: "Social Studies", grade: "B+", marks: 84 },
  { subject: "Computers", grade: "A+", marks: 95 },
]

function ReportCardFlip() {
  const [flipped, setFlipped] = useState(false)
  return (
    <div className="w-full cursor-pointer [perspective:1400px]" onClick={() => setFlipped((f) => !f)}>
      <motion.div
        className="relative aspect-[3/4] w-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        {/* Front */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl border border-[#E5DDD2] bg-gradient-to-br from-white to-[#F3ECE0] p-7 shadow-[0_24px_60px_rgba(212,154,88,0.18)] [backface-visibility:hidden]">
          <div aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#D49A58]/15 blur-[70px]" />
          <div className="flex items-center justify-between">
            <img src="/logo.png" alt="REVENEX" className="h-6 w-auto" />
            <span className="rounded-full border border-[#D49A58]/40 bg-[#D49A58]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#A34E17]">
              Term 2 · 2025-26
            </span>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0E8DC] text-xl font-black text-[#221910]">
              AN
            </span>
            <div>
              <h3 className="text-lg font-black text-[#221910]">Ananya Nair</h3>
              <p className="text-xs text-[#8A7A6B]">Roll No. 27 · Grade VIII-A</p>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3">
            {GRADES.slice(0, 4).map((g) => (
              <div key={g.subject} className="rounded-xl border border-[#E5DDD2] bg-white/70 px-3.5 py-2.5">
                <p className="text-[10px] uppercase tracking-widest text-[#8A7A6B]">{g.subject}</p>
                <p className="mt-0.5 text-sm font-black text-[#A34E17]">{g.grade}</p>
              </div>
            ))}
          </div>

          <div className="absolute inset-x-7 bottom-6 flex items-center justify-between text-[11px] text-[#8A7A6B]">
            <span>Overall · 90.4%</span>
            <span className="inline-flex items-center gap-1.5 text-[#A34E17]">
              <RotateCw className="h-3.5 w-3.5" /> Tap to flip
            </span>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl border border-[#D49A58]/25 bg-[#FFFDF8] p-6 text-[#1A1410] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="flex items-start justify-between border-b-2 border-dotted border-[#D49A58]/40 pb-3">
            <div>
              <p className="font-serif text-sm font-black tracking-wide">REVENEX GLOBAL SCHOOL</p>
              <p className="text-[10px] text-[#6B5D52]">Affiliated to CBSE · Pune, Maharashtra</p>
            </div>
            <span className="rounded-lg bg-[#1A1410] px-2.5 py-1 text-[10px] font-black text-[#F9F6F0]">
              Term 2
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px]">
            <p><span className="font-bold">Ananya Nair</span> · Roll 27 · VIII-A</p>
            <p className="counter-num font-black text-[#A34E17]">90.4%</p>
          </div>

          <table className="mt-3 w-full text-[11px]">
            <thead>
              <tr className="border-b border-[#1A1410]/15 text-left text-[9px] uppercase tracking-widest text-[#6B5D52]">
                <th className="py-1.5 font-bold">Subject</th>
                <th className="py-1.5 font-bold">Marks</th>
                <th className="py-1.5 font-bold">Grade</th>
              </tr>
            </thead>
            <tbody>
              {GRADES.map((g) => (
                <tr key={g.subject} className="border-b border-[#1A1410]/5">
                  <td className="py-1.5 font-semibold">{g.subject}</td>
                  <td className="py-1.5">{g.marks}</td>
                  <td className="py-1.5 font-black text-[#A34E17]">{g.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-[#6B5D52]">Class Teacher&apos;s Remark</p>
              <p className="mt-0.5 max-w-[180px] text-[11px] font-semibold italic leading-snug">
                "A focused, curious learner with outstanding consistency."
              </p>
            </div>
            <motion.span
              className="rounded-md border-2 border-[#A34E17]/60 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-[#A34E17]"
              animate={{ rotate: [-4, -1, -4] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Stamp className="mr-1 inline h-3 w-3" />
              Excellent
            </motion.span>
          </div>
        </div>
      </motion.div>

      <p className="mt-5 text-center text-xs text-[#8A7A6B]">
        <RotateCw className="mr-1 inline h-3.5 w-3.5" />
        Tap the card to flip between the live summary and the official report card
      </p>
    </div>
  )
}

export default function ReportCards() {
  return (
    <ShowcaseShell
      section="Product"
      label="Report Cards"
      accent={GOLD}
      title={
        <>
          Report cards that{" "}
          <span className="bg-gradient-to-r from-[#D49A58] to-[#E9B97E] bg-clip-text text-transparent">
            draw themselves
          </span>
        </>
      }
      subtitle="Radar-sharp performance analytics and official term report cards generated the moment exams close — no spreadsheets, no printer queues."
    >
      {/* ── Hero: radar + flip card ── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <GlassCard className="p-8">
              <div className="mb-6 flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D49A58]/40 bg-[#D49A58]/10">
                  <BarChart3 className="h-4.5 w-4.5 text-[#A34E17]" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#221910]">Subject Radar</h3>
                  <p className="text-[11px] text-[#8A7A6B]">Live performance across all six domains</p>
                </div>
              </div>
              <RadarChart />
            </GlassCard>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { icon: TrendingUp, value: <CountUp to={18.2} decimals={1} suffix="%" />, label: "YoY growth" },
                { icon: CheckCircle2, value: <CountUp to={96} suffix="%" />, label: "On-time publish" },
                { icon: Award, value: <CountUp to={4.6} decimals={1} suffix="/5" />, label: "Parent rating" },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 rounded-2xl border border-[#E5DDD2] bg-white/70 px-3 py-4 text-center backdrop-blur-md">
                  <Icon className="h-4 w-4 text-[#A34E17]" />
                  <span className="counter-num text-base font-black text-[#221910]">{value}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8A7A6B]">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-sm">
            <ReportCardFlip />
          </div>
        </div>
      </section>

      {/* ── Why it matters ── */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            kicker="CBSE · ICSE · State Board ready"
            accent={GOLD}
            title="One click from marks to masterpiece"
            subtitle="Grading schemes, remark banks, and printable PDFs tailored to your board — ready the moment results are locked."
          />
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { icon: ClipboardCheck, title: "Board-aware grading", desc: "CBSE, ICSE, and State Board grade scales built in — no manual conversions." },
            { icon: FileCheck2, title: "PDF & print ready", desc: "Watermarked, footer-stamped report cards export in one click for print or email." },
            { icon: Sparkles, title: "Parent-ready language", desc: "Teacher remarks and progress notes in plain words parents actually understand." },
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
            <div aria-hidden className="absolute -top-20 right-1/4 h-80 w-80 rounded-full bg-[#D49A58]/20 blur-[110px]" />
            <div className="relative">
              <Award className="mx-auto mb-4 h-9 w-9 text-[#A34E17]" />
              <h3 className="mx-auto max-w-xl font-display text-2xl font-black tracking-tight text-[#221910] sm:text-3xl">
                Close this term on autopilot
              </h3>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#61544A]">
                See report cards generated for your actual board and grading scheme in a live demo.
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
