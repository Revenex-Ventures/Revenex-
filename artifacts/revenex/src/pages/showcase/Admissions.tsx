import { useRef, useState } from "react"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import {
  FileSearch, UserCheck, ClipboardCheck, GraduationCap, ArrowRight, X, CheckCircle2,
  Clock3, Phone, Mail, BadgeCheck, FileText, Zap,
} from "lucide-react"
import { ShowcaseShell } from "@/components/showcase/ShowcaseShell"
import { GlassCard, Reveal, SectionHeading, DemoButton, EASE } from "@/components/showcase/ui"

const GOLD = "#D49A58"
const GREEN = "#4ADE80"

type ColumnId = "inquiry" | "verification" | "interview" | "enrolled"

interface Applicant {
  id: string
  name: string
  grade: string
  course: string
  parent: string
  phone: string
  email: string
  docs: { label: string; verified: boolean }[]
}

interface Column {
  id: ColumnId
  title: string
  hint: string
  color: string
  icon: typeof FileSearch
}

const COLUMNS: Column[] = [
  { id: "inquiry", title: "Inquiry", hint: "New leads", color: "#D49A58", icon: FileSearch },
  { id: "verification", title: "Document Verification", hint: "Checking records", color: "#E7B158", icon: BadgeCheck },
  { id: "interview", title: "Interview", hint: "Interaction scheduled", color: "#C98BD8", icon: UserCheck },
  { id: "enrolled", title: "Enrolled", hint: "Confirmed seats", color: "#4ADE80", icon: GraduationCap },
]

const INITIAL: Record<ColumnId, Applicant[]> = {
  inquiry: [
    {
      id: "a1", name: "Arjun Mehta", grade: "XI", course: "PCM + Computer Sci",
      parent: "Rajesh Mehta", phone: "+91 98765 44321", email: "arjun.mehta@example.in",
      docs: [
        { label: "Aadhaar Card", verified: true },
        { label: "Previous Report Card", verified: true },
        { label: "Passport Photo", verified: true },
        { label: "Transfer Certificate", verified: false },
      ],
    },
    {
      id: "a2", name: "Sara Khan", grade: "VI", course: "General",
      parent: "Imran Khan", phone: "+91 91234 56780", email: "sara.khan@example.in",
      docs: [
        { label: "Aadhaar Card", verified: true },
        { label: "Birth Certificate", verified: true },
        { label: "Passport Photo", verified: false },
      ],
    },
    {
      id: "a3", name: "Rohan Deshmukh", grade: "IX", course: "General",
      parent: "Anil Deshmukh", phone: "+91 90000 11223", email: "rohan.d@example.in",
      docs: [
        { label: "Aadhaar Card", verified: true },
        { label: "Previous Report Card", verified: false },
      ],
    },
  ],
  verification: [
    {
      id: "a4", name: "Isha Patel", grade: "VII", course: "General",
      parent: "Nilesh Patel", phone: "+91 98111 22334", email: "isha.patel@example.in",
      docs: [
        { label: "Aadhaar Card", verified: true },
        { label: "Birth Certificate", verified: true },
        { label: "Passport Photo", verified: true },
        { label: "Caste Certificate", verified: true },
      ],
    },
    {
      id: "a5", name: "Dev Sharma", grade: "XII", course: "Commerce + Accounts",
      parent: "Sunil Sharma", phone: "+91 90212 34567", email: "dev.sharma@example.in",
      docs: [
        { label: "Aadhaar Card", verified: true },
        { label: "Previous Report Card", verified: true },
        { label: "Transfer Certificate", verified: false },
      ],
    },
  ],
  interview: [
    {
      id: "a6", name: "Nisha Rao", grade: "VIII", course: "General",
      parent: "Kiran Rao", phone: "+91 97654 32109", email: "nisha.rao@example.in",
      docs: [
        { label: "Aadhaar Card", verified: true },
        { label: "Previous Report Card", verified: true },
        { label: "Passport Photo", verified: true },
      ],
    },
    {
      id: "a7", name: "Aryan Gupta", grade: "X", course: "General",
      parent: "Vikram Gupta", phone: "+91 95555 88990", email: "aryan.gupta@example.in",
      docs: [
        { label: "Aadhaar Card", verified: true },
        { label: "Previous Report Card", verified: true },
        { label: "Passport Photo", verified: false },
      ],
    },
  ],
  enrolled: [
    {
      id: "a8", name: "Priya Nair", grade: "V", course: "General",
      parent: "Mohan Nair", phone: "+91 94444 55667", email: "priya.nair@example.in",
      docs: [
        { label: "Aadhaar Card", verified: true },
        { label: "Birth Certificate", verified: true },
        { label: "Passport Photo", verified: true },
        { label: "Fee Receipt", verified: true },
      ],
    },
    {
      id: "a9", name: "Om Karle", grade: "I", course: "General",
      parent: "Sachin Karle", phone: "+91 92222 33445", email: "om.karle@example.in",
      docs: [
        { label: "Aadhaar Card", verified: true },
        { label: "Birth Certificate", verified: true },
        { label: "Passport Photo", verified: true },
      ],
    },
    {
      id: "a10", name: "Tara Joshi", grade: "VII", course: "General",
      parent: "Aditi Joshi", phone: "+91 93333 44556", email: "tara.joshi@example.in",
      docs: [
        { label: "Aadhaar Card", verified: true },
        { label: "Previous Report Card", verified: true },
        { label: "Passport Photo", verified: true },
        { label: "Fee Receipt", verified: true },
      ],
    },
  ],
}

const COLUMN_IDS = COLUMNS.map((c) => c.id)

const boardVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 26, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
}

export default function Admissions() {
  const [columns, setColumns] = useState<Record<ColumnId, Applicant[]>>(INITIAL)
  const [active, setActive] = useState<Applicant | null>(null)
  const colRefs = useRef<Record<ColumnId, HTMLDivElement | null>>({
    inquiry: null,
    verification: null,
    interview: null,
    enrolled: null,
  })

  const moveApplicant = (id: string, target: ColumnId) => {
    setColumns((prev) => {
      const source = COLUMN_IDS.find((col) => prev[col].some((a) => a.id === id))
      if (!source || source === target) return prev
      const applicant = prev[source].find((a) => a.id === id)
      if (!applicant) return prev
      return {
        ...prev,
        [source]: prev[source].filter((a) => a.id !== id),
        [target]: [...prev[target], applicant],
      }
    })
  }

  const handleDragEnd = (id: string) => (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { x, y } = info.point
    const target = COLUMN_IDS.find((col) => {
      const el = colRefs.current[col]
      if (!el) return false
      const r = el.getBoundingClientRect()
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom
    })
    if (target) moveApplicant(id, target)
  }

  const autoVerify = () => {
    setColumns((prev) => {
      const next: Record<ColumnId, Applicant[]> = { inquiry: [], verification: [], interview: [], enrolled: [] }
      const nextId: Record<ColumnId, ColumnId> = { inquiry: "verification", verification: "interview", interview: "enrolled", enrolled: "enrolled" }
      ;(Object.keys(prev) as ColumnId[]).forEach((col) => {
        prev[col].forEach((a) => {
          const target = col === "enrolled" ? "enrolled" : nextId[col]
          next[target] = [...next[target], a]
        })
      })
      return next
    })
  }

  return (
    <ShowcaseShell
      section="Product"
      label="Admissions"
      accent={GOLD}
      title={
        <>
          From first inquiry to{" "}
          <span className="bg-gradient-to-r from-[#D49A58] to-[#E9B97E] bg-clip-text text-transparent">
            enrolled
          </span>{" "}
          in one pipeline
        </>
      }
      subtitle="Drag applicants through the full admission funnel — inquiry, document verification, interview, and enrollment — with every document tracked and verified along the way."
    >
      {/* ── Kanban pipeline ── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-[#61544A]">
            Drag any applicant to the next stage — or let automation do the paperwork.
          </p>
          <motion.button
            type="button"
            onClick={autoVerify}
            whileTap={{ scale: 0.97 }}
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D49A58] to-[#E9B97E] px-5 py-2.5 text-sm font-bold text-[#221910] shadow-[0_8px_24px_rgba(212,154,88,0.35)] transition-all hover:shadow-[0_10px_32px_rgba(212,154,88,0.5)]"
          >
            <Zap className="h-4 w-4 transition-transform group-hover:scale-125" />
            Auto-Verify &amp; Advance All
          </motion.button>
        </div>
        <motion.div
          variants={boardVariants}
          initial="hidden"
          animate="show"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {COLUMNS.map((col) => (
            <motion.div
              key={col.id}
              ref={(el) => { colRefs.current[col.id] = el }}
              variants={cardVariants}
              className="min-h-[420px] rounded-3xl border border-[#E5DDD2] bg-white/50 p-4 backdrop-blur-md"
            >
              <div className="mb-4 flex items-center justify-between px-1">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-xl"
                    style={{ background: `${col.color}1A`, border: `1px solid ${col.color}40` }}
                  >
                    <col.icon className="h-4 w-4" style={{ color: col.color }} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[#221910]">{col.title}</h3>
                    <p className="text-[10px] text-[#8A7A6B]">{col.hint}</p>
                  </div>
                </div>
                <span
                  className="counter-num rounded-full px-2 py-0.5 text-[11px] font-black"
                  style={{ background: `${col.color}1A`, color: col.color }}
                >
                  {columns[col.id].length}
                </span>
              </div>

              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {columns[col.id].map((a) => (
                    <motion.div
                      key={a.id}
                      layout
                      drag
                      dragSnapToOrigin
                      dragElastic={0.25}
                      onDragEnd={handleDragEnd(a.id)}
                      onMouseEnter={() => setActive(a)}
                      onMouseLeave={() => setActive((cur) => (cur?.id === a.id ? null : cur))}
                      onClick={() => setActive(a)}
                      className="group cursor-grab touch-none select-none rounded-2xl border border-[#E5DDD2] bg-white/80 p-4 shadow-[0_10px_30px_rgba(212,154,88,0.10)] active:cursor-grabbing"
                      whileDrag={{ scale: 1.06, rotate: 1.5, zIndex: 40, boxShadow: "0 24px 48px rgba(212,154,88,0.35)" }}
                      style={{ position: "relative" }}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0E8DC] text-xs font-black text-[#221910]">
                          {a.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                        <span className="rounded-full border border-[#E5DDD2] bg-white/70 px-2 py-0.5 text-[10px] font-bold text-[#61544A]">
                          Grade {a.grade}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#221910]">{a.name}</h4>
                      <p className="text-xs text-[#61544A]">{a.course}</p>
                      <div className="mt-3 flex items-center gap-2 text-[10px] font-semibold text-[#3BA855]">
                        <CheckCircle2 className="h-3 w-3" />
                        {a.docs.filter((d) => d.verified).length}/{a.docs.length} docs verified
                      </div>
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                        <ArrowRight className="h-4 w-4 text-[#A34E17]" />
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <p className="mt-6 text-center text-xs text-[#8A7A6B]">
          Tip: hover any applicant card to preview their file, or drag it to the next stage.
        </p>
      </section>

      {/* ── Slide-out preview drawer ── */}
      <AnimatePresence>
        {active && (
          <>
            <motion.button
              key="drawer-backdrop"
              type="button"
              aria-label="Close preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
              className="fixed inset-0 z-40 cursor-default bg-[#221910]/40 backdrop-blur-sm"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 34 }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-[#E5DDD2] bg-[#FDFAF5] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#E5DDD2] px-6 py-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F0E8DC] text-sm font-black text-[#221910]">
                    {active.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[#221910]">{active.name}</h3>
                    <p className="text-xs text-[#8A7A6B]">Grade {active.grade} · {active.course}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  aria-label="Close"
                  className="rounded-lg border border-[#E5DDD2] bg-white/70 p-2 text-[#61544A] transition-colors hover:text-[#A34E17]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#8A7A6B]">Parent</p>
                <p className="mb-4 text-sm font-semibold text-[#221910]">{active.parent}</p>

                <div className="mb-6 space-y-2 text-xs text-[#61544A]">
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-[#A34E17]" /> {active.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-[#A34E17]" /> {active.email}
                  </p>
                </div>

                <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#8A7A6B]">
                  Verified documents
                </p>
                <ul className="space-y-2">
                  {active.docs.map((d) => (
                    <li
                      key={d.label}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm ${
                        d.verified
                          ? "border-[#4ADE80]/40 bg-[#4ADE80]/10"
                          : "border-[#E5DDD2] bg-white/70"
                      }`}
                    >
                      <span className="flex items-center gap-2.5 font-medium text-[#221910]/80">
                        <FileText className="h-4 w-4 text-[#8A7A6B]" />
                        {d.label}
                      </span>
                      {d.verified ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#4ADE80]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#2E8B52]">
                          <CheckCircle2 className="h-3 w-3" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F5F0E6] px-2.5 py-0.5 text-[10px] font-bold text-[#8A7A6B]">
                          <Clock3 className="h-3 w-3" /> Pending
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-[#E5DDD2] p-5">
                <button
                  type="button"
                  className="w-full rounded-xl bg-[#D49A58] py-3 text-sm font-bold text-[#221910] transition-all hover:bg-[#E0AA6E] hover:shadow-[0_0_20px_rgba(212,154,88,0.45)]"
                >
                  Send next-step update
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Why it matters ── */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            kicker="The admission office, digitised"
            accent={GOLD}
            title="No more lost files or follow-up calls"
            subtitle="Every lead, document, and decision sits in one visible pipeline — so the admission team always knows exactly where each child stands."
          />
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { icon: ClipboardCheck, title: "Automated verification", desc: "OCR reads Aadhaar, birth certificates, and report cards the moment they're uploaded." },
            { icon: UserCheck, title: "Interview scheduling", desc: "Slot parents for interviews with a self-serve link. No phone tag, no double-booking." },
            { icon: GraduationCap, title: "Seat confirmation", desc: "The moment a seat is accepted, fees, transport, and class lists update automatically." },
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
              <FileSearch className="mx-auto mb-4 h-9 w-9 text-[#A34E17]" />
              <h3 className="mx-auto max-w-xl font-display text-2xl font-black tracking-tight text-[#221910] sm:text-3xl">
                Fill your seats months faster
              </h3>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#61544A]">
                Watch a 20-minute demo of the REVENEX admission pipeline and see how schools recover 15+ staff hours a week.
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
