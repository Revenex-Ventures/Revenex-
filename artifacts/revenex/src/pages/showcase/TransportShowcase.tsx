import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, animate, useMotionValue, useMotionValueEvent } from "framer-motion"
import {
  Bus, Route, ShieldAlert, BellRing, MapPin, Navigation, CheckCircle2, Clock3, Users,
} from "lucide-react"
import { ShowcaseShell } from "@/components/showcase/ShowcaseShell"
import { GlassCard, Reveal, SectionHeading, DemoButton, CountUp, EASE } from "@/components/showcase/ui"

const GOLD = "#D49A58"
const GREEN = "#4ADE80"

type ZoneId = "square" | "gate" | "campus"

interface Zone {
  id: ZoneId
  name: string
  parents: number
  x: number
  y: number
  r: number
}

const ZONES: Zone[] = [
  { id: "square", name: "Town Square Stop", parents: 46, x: 205, y: 300, r: 44 },
  { id: "gate", name: "School Gate Zone", parents: 128, x: 395, y: 195, r: 44 },
  { id: "campus", name: "Campus Drop Zone", parents: 84, x: 520, y: 84, r: 42 },
]

const ROUTE_D = "M 30 410 C 90 410 130 330 205 300 C 280 270 300 235 395 195 C 450 170 470 130 520 84"

const BLOCKS: [number, number, number, number][] = [
  [40, 40, 90, 70], [150, 30, 110, 90], [290, 20, 90, 110], [400, 30, 80, 60],
  [40, 150, 80, 90], [140, 180, 70, 60], [280, 150, 90, 70], [240, 250, 60, 50],
  [60, 260, 80, 60], [330, 290, 80, 60], [450, 120, 70, 60], [40, 340, 70, 60],
  [180, 340, 80, 60], [330, 360, 90, 60], [460, 300, 80, 50], [560, 40, 40, 60],
]

const ROADS = ["M0 130 H600", "M0 260 H600", "M0 390 H600", "M120 0 V460", "M260 0 V460", "M440 0 V460", "M540 0 V460"]

const INITIAL_ENABLED: Record<ZoneId, boolean> = { square: true, gate: true, campus: true }

function BusMap({
  enabled,
  onStatus,
}: {
  enabled: Record<ZoneId, boolean>
  onStatus: (current: string[], entered: Zone | null) => void
}) {
  const routeRef = useRef<SVGPathElement>(null)
  const prevInside = useRef<string[]>([])
  const progress = useMotionValue(0)
  const busX = useMotionValue(0)
  const busY = useMotionValue(0)

  useEffect(() => {
    const controls = animate(progress, 1, {
      duration: 16,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "linear",
    })
    return () => controls.stop()
  }, [progress])

  useMotionValueEvent(progress, "change", (v) => {
    const path = routeRef.current
    if (!path) return
    const pt = path.getPointAtLength(v * path.getTotalLength())
    busX.set(pt.x)
    busY.set(pt.y)

    const current = ZONES.filter(
      (z) => enabled[z.id] && Math.hypot(pt.x - z.x, pt.y - z.y) < z.r + 6,
    ).map((z) => z.id)

    const prev = prevInside.current
    const changed =
      prev.length !== current.length || current.some((id) => !prev.includes(id))
    if (changed) {
      const entered = current.find((id) => !prev.includes(id))
      prevInside.current = current
      onStatus(current, entered ? ZONES.find((z) => z.id === entered) ?? null : null)
    }
  })

  return (
    <GlassCard className="relative overflow-hidden p-4 sm:p-6">
      <div aria-hidden className="absolute -left-16 -top-16 h-52 w-52 rounded-full bg-[#D49A58]/10 blur-[90px]" />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D49A58]/40 bg-[#D49A58]/10">
            <Navigation className="h-4 w-4 text-[#A34E17]" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-[#221910]">Route 7 · City Centre → School</h3>
            <p className="flex items-center gap-1.5 text-[11px] text-[#8A7A6B]">
              <Clock3 className="h-3 w-3" /> ETA 12 min · 6 stops · 34 students
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#4ADE80]/40 bg-[#4ADE80]/15 px-3 py-1 text-[10px] font-bold text-[#2E8B52]">
          <CheckCircle2 className="h-3 w-3" /> On time
        </span>
      </div>

      <div className="relative">
        <svg viewBox="0 0 600 460" className="w-full">
          <rect width="600" height="460" rx="20" fill="#F2ECDF" />
          <rect x="420" y="240" width="150" height="150" rx="18" fill="rgba(74,222,128,0.14)" />

          {BLOCKS.map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx="8" fill="rgba(34,25,16,0.05)" />
          ))}
          {ROADS.map((d, i) => (
            <path key={i} d={d} stroke="rgba(163,78,23,0.14)" strokeWidth="2" fill="none" />
          ))}

          <path ref={routeRef} d={ROUTE_D} fill="none" stroke="rgba(212,154,88,0.35)" strokeWidth="6" strokeLinecap="round" />
          <motion.path
            d={ROUTE_D}
            fill="none"
            stroke="#A34E17"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 6px rgba(212,154,88,0.6))" }}
          />
          <motion.path
            d={ROUTE_D}
            fill="none"
            stroke="rgba(163,78,23,0.55)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="3 12"
            animate={{ strokeDashoffset: [0, -60] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          />

          {ZONES.map((z) => {
            const active = enabled[z.id]
            const isInside = active && prevInside.current.includes(z.id)
            return (
              <g key={z.id}>
                <motion.circle
                  cx={z.x}
                  cy={z.y}
                  r={z.r}
                  fill="rgba(212,154,88,0.05)"
                  stroke="rgba(212,154,88,0.35)"
                  strokeWidth="1.5"
                  strokeDasharray="5 7"
                  animate={{ opacity: isInside ? [0.5, 1, 0.5] : active ? [0.35, 0.6, 0.35] : [0.15, 0.25, 0.15] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
                {isInside && (
                  <>
                    <motion.circle
                      cx={z.x}
                      cy={z.y}
                      fill="none"
                      stroke="rgba(212,154,88,0.6)"
                      strokeWidth="2"
                      initial={{ r: z.r * 0.5, opacity: 0.9 }}
                      animate={{ r: z.r + 22, opacity: 0 }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                    />
                    <motion.circle
                      cx={z.x}
                      cy={z.y}
                      fill="none"
                      stroke="rgba(212,154,88,0.5)"
                      strokeWidth="1.5"
                      initial={{ r: z.r * 0.5, opacity: 0.8 }}
                      animate={{ r: z.r + 22, opacity: 0 }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut", delay: 0.55 }}
                    />
                    <circle cx={z.x} cy={z.y} r="5" fill="#D49A58" />
                  </>
                )}
                <text
                  x={z.x}
                  y={z.y + z.r + 14}
                  textAnchor="middle"
                  fill="rgba(34,25,16,0.55)"
                  fontSize="11"
                  fontWeight="700"
                >
                  {z.name}
                </text>
              </g>
            )
          })}

          <g transform="translate(520 84)">
            <motion.circle
              r="16"
              fill="rgba(212,154,88,0.15)"
              stroke="rgba(212,154,88,0.5)"
              strokeWidth="1.5"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "0px 0px" }}
            />
            <path d="M-5 6 V0 L0 -6 L5 0 V6 Z" fill="#221910" />
          </g>

          <motion.g style={{ x: busX, y: busY }}>
            <motion.circle
              r="13"
              fill="rgba(212,154,88,0.35)"
              animate={{ opacity: [0.6, 0.15, 0.6] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <rect x="-8" y="-5" width="16" height="10" rx="2.5" fill="#A34E17" stroke="#221910" strokeWidth="1.5" />
            <rect x="3" y="-3" width="4" height="4" rx="1" fill="#F9F6F0" />
            <rect x="-7" y="-3" width="3" height="3" rx="0.75" fill="#221910" opacity="0.35" />
          </motion.g>
        </svg>
      </div>
    </GlassCard>
  )
}

function GeofencePanel({
  enabled,
  inside,
  toggle,
}: {
  enabled: Record<ZoneId, boolean>
  inside: string[]
  toggle: (id: ZoneId) => void
}) {
  return (
    <GlassCard className="p-6 sm:p-7">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold text-[#221910]">
            <ShieldAlert className="h-4 w-4 text-[#A34E17]" /> Geofence Alerts
          </h3>
          <p className="mt-0.5 text-[11px] text-[#8A7A6B]">Toggle the safety zones on your route</p>
        </div>
        <span className="rounded-full border border-[#E5DDD2] bg-white/70 px-3 py-1 text-[10px] font-black text-[#61544A]">
          {Object.values(enabled).filter(Boolean).length}/3 armed
        </span>
      </div>

      <div className="space-y-3">
        {ZONES.map((z) => {
          const on = enabled[z.id]
          const isInside = on && inside.includes(z.id)
          return (
            <div
              key={z.id}
              className={`flex items-center gap-3 rounded-2xl border p-4 transition-colors ${isInside ? "border-[#D49A58]/50 bg-[#D49A58]/10" : "border-[#E5DDD2] bg-white/70"
                }`}
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{ background: `${GOLD}1A`, border: `1px solid ${GOLD}40` }}
              >
                <MapPin className="h-4 w-4 text-[#A34E17]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-[#221910]">{z.name}</p>
                <p className="text-[10px] text-[#8A7A6B]">
                  {z.parents} parents · {isInside ? "bus inside" : on ? "armed" : "muted"}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                onClick={() => toggle(z.id)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-[#D49A58]" : "bg-[#E5DDD2]"
                  }`}
              >
                <motion.span
                  className={`absolute top-0.5 h-5 w-5 rounded-full shadow ${on ? "bg-[#221910]" : "bg-white"}`}
                  animate={{ left: on ? 22 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                />
              </button>
            </div>
          )
        })}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[#E5DDD2] pt-5">
        <div className="flex flex-col items-center gap-1">
          <span className="counter-num text-lg font-black text-[#3BA855]">
            <CountUp to={98.2} decimals={1} suffix="%" />
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-widest text-[#8A7A6B]">On-time</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="counter-num text-lg font-black text-[#221910]">
            <CountUp to={34} />
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-widest text-[#8A7A6B]">Trips today</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="counter-num text-lg font-black text-[#A34E17]">
            <CountUp to={1240} suffix="+" />
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-widest text-[#8A7A6B]">Pings sent</span>
        </div>
      </div>
    </GlassCard>
  )
}

export default function TransportShowcase() {
  const [enabled, setEnabled] = useState<Record<ZoneId, boolean>>(INITIAL_ENABLED)
  const [inside, setInside] = useState<string[]>([])
  const [alert, setAlert] = useState<{ id: number; text: string } | null>(null)

  const handleStatus = (current: string[], entered: Zone | null) => {
    setInside(current)
    if (entered) {
      setAlert({
        id: Date.now() + Math.random(),
        text: `Bus entered ${entered.name} — ${entered.parents} parents notified`,
      })
    }
  }

  const toggleZone = (id: ZoneId) => {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <ShowcaseShell
      section="Solutions"
      label="Transport"
      accent={GOLD}
      title={
        <>
          Transport that{" "}
          <span className="bg-gradient-to-r from-[#D49A58] to-[#E9B97E] bg-clip-text text-transparent">
            arrives on time
          </span>
          , every time
        </>
      }
      subtitle="Live GPS, geofenced safety zones, and instant parent pings — every child accounted for on every route, every single day."
    >
      {/* ── Hero: live map + geofence panel ── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <BusMap enabled={enabled} onStatus={handleStatus} />

            <AnimatePresence>
              {alert && (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="mt-4 flex items-center gap-3 rounded-2xl border border-[#D49A58]/40 bg-[#D49A58]/10 px-4 py-3.5"
                >
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D49A58] opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#D49A58]" />
                  </span>
                  <p className="flex-1 text-xs font-semibold text-[#221910]">{alert.text}</p>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#A34E17]">Geofence</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-2">
            <GeofencePanel enabled={enabled} inside={inside} toggle={toggleZone} />
          </div>
        </div>
      </section>

      {/* ── Why it matters ── */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            kicker="From the first stop to the last"
            accent={GOLD}
            title="No bus ever goes missing again"
            subtitle="Schools see every vehicle live, drivers follow safe routes, and parents relax — because they always know where their child is."
          />
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { icon: Route, title: "Live GPS on every bus", desc: "Track each vehicle in real time with ETA predictions and route history for every trip." },
            { icon: ShieldAlert, title: "Geofenced safety zones", desc: "The moment a bus leaves or enters a defined zone, the right people are alerted instantly." },
            { icon: BellRing, title: "Parents pinged instantly", desc: "Boarding, arrival, and delay updates reach parents on WhatsApp and push — no calls needed." },
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
              <Bus className="mx-auto mb-4 h-9 w-9 text-[#A34E17]" />
              <h3 className="mx-auto max-w-xl font-display text-2xl font-black tracking-tight text-[#221910] sm:text-3xl">
                Give every parent peace of mind
              </h3>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#61544A]">
                See live routes, geofences, and parent alerts in a 20-minute demo built around your school.
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
