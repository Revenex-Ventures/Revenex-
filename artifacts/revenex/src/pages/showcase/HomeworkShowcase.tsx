import { useRef, useState } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import {
  BookOpen, CheckCircle2, PenLine, Clock3, CalendarClock, Flame, Send, FileCheck2, Sparkles, Layers,
} from "lucide-react"
import confetti from "canvas-confetti"
import { ShowcaseShell } from "@/components/showcase/ShowcaseShell"
import { GlassCard, Reveal, SectionHeading, DemoButton, EASE } from "@/components/showcase/ui"

const GOLD = "#D49A58"
const GREEN = "#4ADE80"

type Deadline = "today" | "week" | "overdue"

interface Task {
  id: string
  subject: string
  color: string
  title: string
  desc: string
  teacher: string
  due: string
  deadline: Deadline
  cls: string
  students: number
}

const TASKS: Task[] = [
  {
    id: "t1", subject: "Mathematics", color: "#D49A58", title: "Quadratic Equations — Problem Set 7",
    desc: "Solve Q1–Q20 from the textbook. Show all steps.", teacher: "Mrs. A. Kulkarni", due: "Due today · 4:00 PM", deadline: "today", cls: "VI-A", students: 42,
  },
  {
    id: "t2", subject: "English", color: "#C98BD8", title: "Essay — The Power of Habits",
    desc: "Write a 350-word personal essay with a clear thesis.", teacher: "Mr. R. Iyer", due: "Due today · 6:00 PM", deadline: "today", cls: "IX-B", students: 39,
  },
  {
    id: "t3", subject: "Science", color: "#7FD1AE", title: "Ch. 8 — Light: Reflection Quiz",
    desc: "Complete the online quiz. Two attempts allowed.", teacher: "Dr. S. Patil", due: "Due Friday · 11:59 PM", deadline: "week", cls: "VIII-C", students: 41,
  },
  {
    id: "t4", subject: "Social Studies", color: "#E7B158", title: "Map Work — Monsoon India",
    desc: "Label rainfall zones on the outline map provided.", teacher: "Mrs. L. Deshpande", due: "Due Sunday · 8:00 PM", deadline: "week", cls: "VII-A", students: 38,
  },
  {
    id: "t5", subject: "Hindi", color: "#8FB4E8", title: "कविता — पाठ 12 का सारांश",
    desc: "Summarise the poem in your own words (100 words).", teacher: "Mrs. M. Verma", due: "Overdue · was due Monday", deadline: "overdue", cls: "VI-B", students: 40,
  },
  {
    id: "t6", subject: "Mathematics", color: "#D49A58", title: "Algebra Worksheet 3 (Home)",
    desc: "Covered in class — complete and submit by the weekend.", teacher: "Mrs. A. Kulkarni", due: "Overdue · was due Sunday", deadline: "overdue", cls: "IX-C", students: 42,
  },
]

const FILTERS: { id: Deadline; label: string; icon: typeof Clock3 }[] = [
  { id: "today", label: "Today", icon: CalendarClock },
  { id: "week", label: "This Week", icon: Clock3 },
  { id: "overdue", label: "Overdue", icon: Flame },
]

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 260, damping: 20 })
  const sry = useSpring(ry, { stiffness: 260, damping: 20 })

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rx.set(-py * 9)
    ry.set(px * 9)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => { rx.set(0); ry.set(0) }}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900, transformStyle: "preserve-3d" }}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}

export default function HomeworkShowcase() {
  const [filter, setFilter] = useState<Deadline>("today")
  const [submitted, setSubmitted] = useState<Set<string>>(new Set())

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    setSubmitted((prev) => {
      if (prev.has(id)) return prev
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
        colors: ["#D49A58", "#F9F6F0", "#A34E17", "#4ADE80"],
        zIndex: 200,
      })
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const visible = TASKS.filter((t) => t.deadline === filter)
  const done = submitted.size

  return (
    <ShowcaseShell
      section="Product"
      label="Homework"
      accent={GOLD}
      title={
        <>
          Assignments that{" "}
          <span className="bg-gradient-to-r from-[#D49A58] to-[#E9B97E] bg-clip-text text-transparent">
            turn themselves in
          </span>
        </>
      }
      subtitle="Glass-clean task cards, one-tap submission, and automatic deadline tracking — homework that organises itself for teachers, students, and parents."
    >
      {/* ── Filter dial + task board ── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-center gap-5">
          <div className="inline-flex rounded-2xl border border-[#E5DDD2] bg-white/70 p-1.5 shadow-[0_10px_30px_rgba(212,154,88,0.10)] backdrop-blur-md">
            {FILTERS.map(({ id, label, icon: Icon }) => {
              const active = filter === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFilter(id)}
                  className="relative flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors"
                  style={{ color: active ? "#221910" : "#8A7A6B" }}
                >
                  {active && (
                    <motion.span
                      layoutId="homeworkFilterDial"
                      className="absolute inset-0 rounded-xl bg-[#D49A58] shadow-[0_0_20px_rgba(212,154,88,0.5)]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Icon className="relative h-4 w-4" />
                  <span className="relative">{label}</span>
                  <span className="relative rounded-full px-1.5 py-0.5 text-[10px] font-black" style={{ background: active ? "rgba(34,25,16,0.15)" : "rgba(34,25,16,0.08)" }}>
                    {TASKS.filter((t) => t.deadline === id).length}
                  </span>
                </button>
              )
            })}
          </div>
          <p className="flex items-center gap-2 text-xs text-[#8A7A6B]">
            <Sparkles className="h-3.5 w-3.5 text-[#A34E17]" />
            Hit the submit button on a card to see it turn itself in
          </p>
        </div>

        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((t) => {
              const isDone = submitted.has(t.id)
              return (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <TiltCard>
                    <GlassCard
                      className={`flex h-full flex-col p-6 transition-shadow ${isDone ? "border-[#4ADE80]/60" : "hover:shadow-[0_24px_60px_rgba(212,154,88,0.20)]"}`}
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold"
                          style={{ background: `${t.color}1A`, color: t.color, border: `1px solid ${t.color}45` }}
                        >
                          <BookOpen className="h-3 w-3" /> {t.subject}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            t.deadline === "overdue"
                              ? "bg-[#E05252]/15 text-[#C0392B]"
                              : "bg-[#F5F0E6] text-[#8A7A6B]"
                          }`}
                        >
                          <Clock3 className="h-3 w-3" /> {t.due}
                        </span>
                      </div>

                      <h3 className="mb-2 text-base font-bold leading-snug text-[#221910]">{t.title}</h3>
                      <p className="mb-5 flex-1 text-sm leading-relaxed text-[#61544A]">{t.desc}</p>

                      <div className="mb-4 flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0E8DC] text-[11px] font-black text-[#221910]">
                          {t.teacher.replace(/[^A-Z]/g, "").slice(0, 2)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-[#221910]/70">{t.teacher}</p>
                          <p className="text-[10px] text-[#8A7A6B]">{t.students} students · Std {t.students % 40}</p>
                        </div>
                      </div>

                      {isDone ? (
                        <button
                          type="button"
                          disabled
                          className="inline-flex cursor-default items-center justify-center gap-2 rounded-xl border border-[#4ADE80]/60 bg-[#4ADE80]/15 py-2.5 text-sm font-bold text-[#2E8B52]"
                        >
                          <FileCheck2 className="h-4 w-4" /> Submitted
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleSubmit(e, t.id)}
                          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#D49A58] py-2.5 text-sm font-bold text-[#221910] transition-all hover:bg-[#E0AA6E] hover:shadow-[0_0_18px_rgba(212,154,88,0.5)]"
                        >
                          <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          Submit Homework
                        </button>
                      )}
                    </GlassCard>
                  </TiltCard>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>

        <div className="mt-10 flex flex-col items-center gap-2">
          <p className="counter-num text-sm font-bold text-[#221910]/70">
            {done} of {TASKS.length} assignments turned in
          </p>
          <div className="h-2 w-56 overflow-hidden rounded-full bg-[#E5DDD2]">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #D49A58, #4ADE80)" }}
              animate={{ width: `${(done / TASKS.length) * 100}%` }}
              transition={{ duration: 0.5, ease: EASE }}
            />
          </div>
        </div>
      </section>

      {/* ── How teachers save time ── */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            kicker="The full workflow"
            accent={GOLD}
            title="Create, assign, collect, grade — in minutes"
            subtitle="Teachers stop chasing paperwork. Students stop losing worksheets. Parents stop guessing what's due."
          />
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { icon: PenLine, title: "Create in under a minute", desc: "Rich-text editor, attachments, templates, and holiday-aware scheduling." },
            { icon: Send, title: "Submit from any device", desc: "Photos of notebook work, PDFs, or typed answers — timestamped automatically." },
            { icon: CheckCircle2, title: "Grades flow onward", desc: "Rubric grading feeds report cards and parent updates with zero re-entry." },
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
            <div aria-hidden className="absolute -top-20 left-1/4 h-80 w-80 rounded-full bg-[#D49A58]/20 blur-[110px]" />
            <div className="relative">
              <Layers className="mx-auto mb-4 h-9 w-9 text-[#A34E17]" />
              <h3 className="mx-auto max-w-xl font-display text-2xl font-black tracking-tight text-[#221910] sm:text-3xl">
                Give teachers their evenings back
              </h3>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#61544A]">
                A short demo shows how REVENEX Homework eliminates the paper chase at your school.
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
