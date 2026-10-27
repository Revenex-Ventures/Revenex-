import { useRef, useState, useEffect } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useSpring,
  type MotionValue,
} from 'framer-motion'
import {
  Phone,
  Clock,
  ArrowRight,
  Server,
  Database,
  Shield,
  Palette,
  BookOpen,
  CheckCircle2,
  MessageSquare,
  GraduationCap,
  Video,
  Zap,
  Activity,
  Headphones,
  Globe,
  Lock,
  Check,
  Wifi,
  Timer,
  Heart,
  ChevronRight,
} from 'lucide-react'
import { BorderTrail } from '@/components/motion-primitives/border-trail'

/* ─── Theme tokens ─── */
const T = {
  pageBg: '#F5F0E8',
  white: '#FFFFFF',
  textDark: '#1A1410',
  textBody: '#3D3128',
  textMuted: '#6B5D52',
  textLight: '#9B8E82',
  border: '#E8E0D4',
  borderSoft: '#F0E8DC',
  fillWarm: '#F0E8DC',
  fillWarm2: '#F5F0E8',
  accent: '#8B4513',
  accentGold: '#D49A58',
  accentDeep: '#7C3D0F',
}

/* ─── Types ─── */
interface StepData {
  id: string
  phase: string
  label: string
  title: string
  subtitle: string
  tags: string[]
  accent: string
  accentRgb: string
  accentSoft: string
  accentBorder: string
  trailColor1: string
  trailColor2: string
}

const STEPS: StepData[] = [
  {
    id: '01',
    phase: 'Phase 01',
    label: 'CONNECT',
    title: 'Contact & Discovery',
    subtitle: 'Tell us about your institution and needs.',
    tags: ['Free Consultation', 'No Commitment', 'Same-Day Response'],
    accent: '#D97706',
    accentRgb: '217,119,6',
    accentSoft: 'rgba(217,119,6,0.07)',
    accentBorder: 'rgba(217,119,6,0.2)',
    trailColor1: '#D97706',
    trailColor2: '#F59E0B',
  },
  {
    id: '02',
    phase: 'Phase 02',
    label: 'SETUP',
    title: 'Custom ERP Setup',
    subtitle: 'We set up the platform to match your processes.',
    tags: ['Zero Data Loss', 'Custom Branding', '48hr Turnaround'],
    accent: '#059669',
    accentRgb: '5,150,105',
    accentSoft: 'rgba(5,150,105,0.07)',
    accentBorder: 'rgba(5,150,105,0.2)',
    trailColor1: '#059669',
    trailColor2: '#10B981',
  },
  {
    id: '03',
    phase: 'Phase 03',
    label: 'ONBOARD',
    title: 'Staff Onboarding & Training',
    subtitle: 'We train your staff and provide clear guides.',
    tags: ['Role-Based Access', 'Live Video Training', 'Dedicated POC'],
    accent: '#0891B2',
    accentRgb: '8,145,178',
    accentSoft: 'rgba(8,145,178,0.07)',
    accentBorder: 'rgba(8,145,178,0.2)',
    trailColor1: '#0891B2',
    trailColor2: '#06B6D4',
  },
  {
    id: '04',
    phase: 'Phase 04',
    label: 'LAUNCH',
    title: 'Go Live & Continuous Support',
    subtitle: '99.9% Uptime with dedicated assistance.',
    tags: ['SSL Secured', '24/7 Monitoring', 'Instant Support'],
    accent: '#7C3AED',
    accentRgb: '124,58,237',
    accentSoft: 'rgba(124,58,237,0.07)',
    accentBorder: 'rgba(124,58,237,0.2)',
    trailColor1: '#7C3AED',
    trailColor2: '#8B5CF6',
  },
]

/* ─────────────────── Waveform ─────────────────── */

function Waveform({ color }: { color: string }) {
  return (
    <div className="flex items-end gap-[2px] h-9">
      {Array.from({ length: 24 }).map((_, i) => {
        const s = Math.sin(i * 1.4) * 0.5 + 0.5
        return (
          <motion.div
            key={i}
            className="rounded-full flex-1 min-w-[2px]"
            style={{ backgroundColor: color, opacity: 0.35 + s * 0.65 }}
            animate={{ height: [4 + s * 4, 16 + s * 20, 4 + s * 3, 12 + s * 14, 4 + s * 4] }}
            transition={{ duration: 0.8 + s * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.045 }}
          />
        )
      })}
    </div>
  )
}

/* ─────────────────── Corner Accent ─────────────────── */

function CornerAccent({ position, color }: { position: 'tl' | 'tr' | 'bl' | 'br'; color: string }) {
  const posClass =
    position === 'tl' ? 'top-2 left-2' :
    position === 'tr' ? 'top-2 right-2' :
    position === 'bl' ? 'bottom-2 left-2' :
    'bottom-2 right-2'
  const rotation =
    position === 'tl' ? 'rotate-0' :
    position === 'tr' ? 'rotate-90' :
    position === 'bl' ? '-rotate-90' :
    'rotate-180'

  return (
    <div className={`absolute ${posClass} pointer-events-none z-10 ${rotation}`}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M0 14V4C0 1.79 1.79 0 4 0H14" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.25" />
        <circle cx="1" cy="13" r="1" fill={color} opacity="0.2" />
      </svg>
    </div>
  )
}

/* ─────────────────── Micro-Widgets ─────────────────── */

function DiscoveryWidget() {
  return (
    <div className="space-y-2.5">
      <div className="rounded-xl p-3.5 relative" style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.4))',
        border: '1px solid rgba(139,69,19,0.06)',
        boxShadow: '0 1px 3px rgba(26,20,16,0.03), inset 0 1px 0 rgba(255,255,255,0.6)',
      }}>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#D97706' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: '#D97706' }} />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#D97706' }}>Discovery Call</span>
          </div>
          <span className="flex items-center gap-1 text-[8px] font-bold px-2 py-0.5 rounded-full" style={{ color: '#D97706', background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.12)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#D97706' }} /> LIVE
          </span>
        </div>
        <div className="rounded-lg p-2.5 mb-2.5" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(139,69,19,0.06)', boxShadow: 'inset 0 1px 2px rgba(26,20,16,0.03)' }}>
          <Waveform color="#D97706" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.12)' }}>
              <Phone className="h-3 w-3" style={{ color: '#D97706' }} />
            </div>
            <div>
              <p className="text-[10px] font-semibold" style={{ color: T.textDark }}>Free Discovery Call</p>
              <p className="text-[8px]" style={{ color: T.textLight }}>Discuss your institution's needs</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[8px] px-2 py-1 rounded-md" style={{ color: T.textMuted, background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(139,69,19,0.06)' }}>
            <Clock className="h-2.5 w-2.5" /><span className="font-mono font-bold">15 min</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SetupWidget() {
  const [progress] = useState(88)
  const modules = [
    { name: 'Branding', icon: Palette, status: 'complete' as const },
    { name: 'Fee Ledgers', icon: Database, status: 'active' as const },
    { name: 'Role Permissions', icon: Shield, status: 'pending' as const },
  ]
  return (
    <div className="space-y-2.5">
      <div className="rounded-xl p-3.5" style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.4))',
        border: '1px solid rgba(139,69,19,0.06)',
        boxShadow: '0 1px 3px rgba(26,20,16,0.03), inset 0 1px 0 rgba(255,255,255,0.6)',
      }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5"><Server className="h-3 w-3" style={{ color: '#059669' }} /><span className="text-[10px] font-bold" style={{ color: T.textDark }}>Data Migration</span></div>
          <span className="text-[10px] font-bold font-mono" style={{ color: '#059669' }}>{progress}%</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden mb-1.5" style={{ background: 'rgba(139,69,19,0.06)', boxShadow: 'inset 0 1px 2px rgba(26,20,16,0.04)' }}>
          <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #059669, #10B981, #34D399)', boxShadow: '0 1px 4px rgba(5,150,105,0.25)' }} initial={{ width: '0%' }} animate={{ width: `${progress}%` }} transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }} />
        </div>
        <p className="text-[8px] italic text-center" style={{ color: T.textLight }}>Migrating institution records — encrypted end-to-end</p>
      </div>
      <div className="space-y-1.5">
        <span className="text-[8px] font-bold uppercase tracking-wider px-1" style={{ color: T.textLight }}>Migration Status</span>
        {modules.map((m) => {
          const Icon = m.icon
          return (
            <div key={m.name} className="flex items-center justify-between rounded-lg px-3 py-2" style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.3))',
              border: '1px solid rgba(139,69,19,0.06)',
              boxShadow: '0 1px 2px rgba(26,20,16,0.02)',
            }}>
              <div className="flex items-center gap-2">
                <Icon className="h-3 w-3" style={{ color: m.status === 'complete' ? '#059669' : m.status === 'active' ? '#D97706' : T.textLight }} />
                <span className="text-[10px] font-medium" style={{ color: T.textBody }}>{m.name}</span>
              </div>
              {m.status === 'complete' && <span className="flex items-center gap-1 text-[7px] font-bold px-1.5 py-0.5 rounded-full" style={{ color: '#059669', background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.10)' }}><CheckCircle2 className="h-2 w-2" /> DONE</span>}
              {m.status === 'active' && <span className="flex items-center gap-1 text-[7px] font-bold px-1.5 py-0.5 rounded-full" style={{ color: '#D97706', background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.10)' }}><span className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: '#D97706' }} /> SYNCING</span>}
              {m.status === 'pending' && <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-full" style={{ color: T.textLight, background: 'rgba(139,69,19,0.04)', border: '1px solid rgba(139,69,19,0.06)' }}>QUEUED</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TrainingWidget() {
  const [checked, setChecked] = useState<Record<string, boolean>>({ teacher: true, fee: true, whatsapp: false })
  const items = [
    { id: 'teacher', label: 'Teacher App Walkthrough', icon: GraduationCap },
    { id: 'fee', label: 'Fee Collection Guide', icon: BookOpen },
    { id: 'whatsapp', label: 'WhatsApp Alerts Setup', icon: MessageSquare },
  ]
  const toggle = (id: string) => setChecked((p) => ({ ...p, [id]: !p[id] }))
  const doneCount = Object.values(checked).filter(Boolean).length
  return (
    <div className="space-y-2.5">
      <div className="rounded-xl p-3.5 space-y-1" style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.4))',
        border: '1px solid rgba(139,69,19,0.06)',
        boxShadow: '0 1px 3px rgba(26,20,16,0.03), inset 0 1px 0 rgba(255,255,255,0.6)',
      }}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: T.textLight }}>Training Checklist</span>
          <span className="text-[9px] font-bold" style={{ color: '#0891B2' }}>{doneCount}/{items.length}</span>
        </div>
        {items.map((item) => {
          const Icon = item.icon
          const done = checked[item.id]
          return (
            <button key={item.id} onClick={() => toggle(item.id)} className="flex items-center gap-2.5 w-full text-left py-1.5 px-1 rounded-lg transition-colors cursor-pointer" style={{ background: done ? 'rgba(8,145,178,0.03)' : 'transparent' }}>
              <motion.div className="h-4 w-4 rounded-md border flex items-center justify-center shrink-0" style={{ background: done ? '#0891B2' : 'rgba(255,255,255,0.6)', borderColor: done ? '#0891B2' : 'rgba(139,69,19,0.10)' }} animate={done ? { boxShadow: ['0 0 0 rgba(8,145,178,0)', '0 0 8px rgba(8,145,178,0.2)', '0 0 0 rgba(8,145,178,0)'] } : {}} transition={{ duration: 1.5, repeat: done ? Infinity : 0 }}>
                {done && <Check className="h-2.5 w-2.5 stroke-[3]" style={{ color: '#fff' }} />}
              </motion.div>
              <Icon className="h-3 w-3" style={{ color: done ? '#0891B2' : T.textLight }} />
              <span className="text-[10px] font-medium" style={{ color: done ? T.textDark : T.textMuted, textDecoration: done ? 'line-through' : 'none', textDecorationColor: 'rgba(139,69,19,0.15)' }}>{item.label}</span>
            </button>
          )
        })}
      </div>
      <div className="rounded-xl p-3 flex items-center justify-between" style={{ background: 'rgba(8,145,178,0.03)', border: '1px solid rgba(8,145,178,0.10)' }}>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#0891B2' }} /><span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: '#0891B2' }} /></span>
          <div><p className="text-[10px] font-bold" style={{ color: '#0891B2' }}>Live Video Training</p><p className="text-[8px]" style={{ color: T.textLight }}>Real-time screen share session</p></div>
        </div>
        <Video className="h-4 w-4" style={{ color: '#0891B2' }} />
      </div>
    </div>
  )
}

function LaunchWidget() {
  const metricStyle = {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.4))',
    border: '1px solid rgba(139,69,19,0.06)',
    boxShadow: '0 1px 3px rgba(26,20,16,0.03), inset 0 1px 0 rgba(255,255,255,0.6)',
  } as const
  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-xl p-3.5 text-center" style={metricStyle}>
          <Activity className="h-4 w-4 mx-auto mb-1" style={{ color: '#7C3AED' }} />
          <p className="text-[18px] font-black tracking-tight" style={{ color: T.textDark }}>99.9%</p>
          <p className="text-[7px] font-bold uppercase tracking-wider" style={{ color: T.textLight }}>SLA Uptime</p>
        </div>
        <div className="rounded-xl p-3.5 text-center" style={metricStyle}>
          <Timer className="h-4 w-4 mx-auto mb-1" style={{ color: '#7C3AED' }} />
          <p className="text-[18px] font-black tracking-tight" style={{ color: T.textDark }}>&lt;2hr</p>
          <p className="text-[7px] font-bold uppercase tracking-wider" style={{ color: T.textLight }}>Response Time</p>
        </div>
      </div>
      <div className="rounded-xl p-3.5 flex items-center justify-between" style={metricStyle}>
        <div className="flex items-center gap-2.5">
          <motion.div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.12)' }} animate={{ boxShadow: ['0 0 0 rgba(5,150,105,0)', '0 0 12px rgba(5,150,105,0.12)', '0 0 0 rgba(5,150,105,0)'] }} transition={{ duration: 2, repeat: Infinity }}>
            <Heart className="h-4 w-4" style={{ color: '#059669' }} fill="currentColor" />
          </motion.div>
          <div><p className="text-[10px] font-bold" style={{ color: T.textDark }}>All Systems Operational</p><p className="text-[8px]" style={{ color: T.textLight }}>Live monitoring active</p></div>
        </div>
        <span className="flex items-center gap-1 text-[7px] font-bold px-2 py-0.5 rounded-full" style={{ color: '#059669', background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.10)' }}><Wifi className="h-2 w-2" /> ONLINE</span>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[9px] font-bold" style={{ ...metricStyle, color: T.textMuted }}><Lock className="h-3 w-3" /> SSL Secured</div>
        <div className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[9px] font-bold" style={{ ...metricStyle, color: T.textMuted }}><Globe className="h-3 w-3" /> 24/7 Live</div>
        <div className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[9px] font-bold" style={{ background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.10)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)', color: '#7C3AED' }}><Headphones className="h-3 w-3" /> Support</div>
      </div>
    </div>
  )
}

const WIDGETS: Record<string, React.FC> = { '01': DiscoveryWidget, '02': SetupWidget, '03': TrainingWidget, '04': LaunchWidget }

/* ─────────────────── Step Card ─────────────────── */

function StepCard({ step, x, opacity, scale }: { step: StepData; x: MotionValue<number>; opacity: MotionValue<number>; scale: MotionValue<number> }) {
  const Widget = WIDGETS[step.id]
  return (
    <motion.div style={{ x, opacity, scale }} className="absolute inset-0 flex items-center justify-center m-auto">
      {/* ── Outer frame (parchment layer) ── */}
      <div className="relative w-full max-w-[640px] max-h-[580px] rounded-[20px] p-[3px]" style={{
        background: `linear-gradient(145deg, rgba(139,69,19,0.18), rgba(139,69,19,0.06) 40%, rgba(212,154,88,0.10) 60%, rgba(139,69,19,0.15))`,
        boxShadow: '0 20px 60px rgba(26,20,16,0.12), 0 4px 12px rgba(26,20,16,0.06), inset 0 1px 0 rgba(255,255,255,0.5)',
      }}>
        {/* ── BorderTrail on outer frame ── */}
        <BorderTrail
          className="rounded-[20px]"
          style={{ background: `linear-gradient(90deg, ${step.trailColor1}88, ${step.trailColor2}cc, ${step.trailColor1}88)` }}
          size={70}
          transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
        />

        {/* Corner accents */}
        <CornerAccent position="tl" color={step.accent} />
        <CornerAccent position="tr" color={step.accent} />
        <CornerAccent position="bl" color={step.accent} />
        <CornerAccent position="br" color={step.accent} />

        {/* ── Inner card surface ── */}
        <motion.div
          className="relative rounded-[17px] overflow-hidden flex flex-col"
          style={{
            background: 'linear-gradient(175deg, #FFFFFF 0%, #FBF8F3 40%, #F8F3EB 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(139,69,19,0.04)',
          }}
          whileHover={{
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(139,69,19,0.04), 0 8px 30px rgba(26,20,16,0.10)',
            y: -2,
          }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Subtle top parchment gradient strip */}
          <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none" style={{
            background: `linear-gradient(180deg, rgba(212,154,88,0.04) 0%, transparent 100%)`,
          }} />

          {/* Thin accent ribbon at very top */}
          <div className="h-[3px] w-full shrink-0 relative overflow-hidden" style={{
            background: `linear-gradient(90deg, ${step.accent}dd, ${step.accent}88, ${step.accent}dd)`,
          }}>
            <div className="absolute inset-0" style={{
              background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)`,
              animation: 'shimmer 3s ease-in-out infinite',
            }} />
          </div>

          {/* ── Header ── */}
          <div className="relative flex items-center justify-between px-6 sm:px-7 pt-4 pb-2">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.12em]"
              style={{
                background: `linear-gradient(135deg, ${step.accentSoft}, rgba(255,255,255,0.5))`,
                color: step.accent,
                border: `1px solid ${step.accentBorder}`,
                boxShadow: `0 1px 4px rgba(${step.accentRgb},0.08)`,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: step.accent, boxShadow: `0 0 6px rgba(${step.accentRgb},0.3)` }} />
              {step.phase}
            </span>
            <span className="text-[9px] font-mono tracking-widest tabular-nums" style={{ color: T.textLight }}>{step.id} / 04</span>
          </div>

          {/* ── Body ── */}
          <div className="relative flex-1 flex flex-col px-6 sm:px-7 pb-5 overflow-y-auto scrollbar-none">
            <h3 className="text-xl sm:text-[22px] font-extrabold mb-1 leading-tight tracking-tight" style={{ color: T.textDark }}>{step.title}</h3>
            <p className="text-[12px] font-semibold mb-3.5" style={{ color: step.accent }}>{step.subtitle}</p>

            {/* ── Inset widget panel ── */}
            <div className="rounded-xl mb-3.5 relative overflow-hidden" style={{
              background: 'linear-gradient(170deg, #F5F0E8 0%, #EDE5D8 100%)',
              border: '1px solid rgba(139,69,19,0.08)',
              boxShadow: 'inset 0 2px 6px rgba(26,20,16,0.04), inset 0 0 0 1px rgba(255,255,255,0.5)',
              padding: '14px',
            }}>
              {/* Inner panel corner detail */}
              <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none opacity-30" style={{
                background: `radial-gradient(circle at 100% 0%, rgba(${step.accentRgb},0.08) 0%, transparent 70%)`,
              }} />
              {Widget && <Widget />}
            </div>

            {/* ── Feature pills ── */}
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {step.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-[5px] rounded-full text-[8px] font-bold uppercase tracking-wider" style={{
                  color: T.textBody,
                  background: 'linear-gradient(135deg, #F5F0E8, #EDE5D8)',
                  border: '1px solid rgba(139,69,19,0.10)',
                  boxShadow: '0 1px 2px rgba(26,20,16,0.03)',
                }}>
                  <Check className="h-2 w-2" style={{ color: step.accent }} />{tag}
                </span>
              ))}
            </div>

            {/* ── Divider ── */}
            <div className="h-px my-3" style={{
              background: 'linear-gradient(90deg, transparent, rgba(139,69,19,0.10) 20%, rgba(139,69,19,0.10) 80%, transparent)',
            }} />

            {/* ── CTA ── */}
            <div className="flex items-center gap-2.5">
              <motion.button
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${step.accent}, ${step.accent}ee)`,
                  color: '#fff',
                  boxShadow: `0 4px 16px rgba(${step.accentRgb},0.22), inset 0 1px 0 rgba(255,255,255,0.15)`,
                }}
                whileHover={{ scale: 1.03, y: -1, boxShadow: `0 6px 24px rgba(${step.accentRgb},0.30), inset 0 1px 0 rgba(255,255,255,0.15)` }}
                whileTap={{ scale: 0.97 }}
              >
                {step.id === '01' && 'Book a Call'}{step.id === '02' && 'Start Setup'}{step.id === '03' && 'Begin Training'}{step.id === '04' && 'Go Live'}
                <motion.span className="inline-flex" animate={{ x: [0, 3, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
                  <ArrowRight className="h-3 w-3" />
                </motion.span>
              </motion.button>
              <span className="text-[8px] font-medium" style={{ color: T.textLight }}>Step {step.id} of 04</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ─────────────────── Progress Tracker ─────────────────── */

function ProgressTracker({ activeStep }: { activeStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-[520px] mx-auto mb-8 px-4">
      {STEPS.map((step, i) => {
        const isActive = activeStep === i
        const isCompleted = activeStep > i
        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 relative">
              <motion.div className="relative flex items-center justify-center" animate={{ scale: isActive ? 1 : 0.85 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                {isActive && <motion.div className="absolute -inset-2 rounded-full" style={{ background: `radial-gradient(circle, rgba(${step.accentRgb},0.12) 0%, transparent 70%)` }} animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />}
                <motion.div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border-2 relative z-10" animate={{ backgroundColor: isActive ? step.accent : isCompleted ? `${step.accent}20` : T.fillWarm, borderColor: isActive ? step.accent : isCompleted ? `${step.accent}40` : T.border, color: isActive ? '#fff' : isCompleted ? step.accent : T.textLight }} transition={{ duration: 0.3 }}>
                  {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : step.id}
                </motion.div>
              </motion.div>
              <motion.span className="text-[8px] font-black uppercase tracking-[0.2em] whitespace-nowrap" animate={{ color: isActive ? step.accent : T.textLight }} transition={{ duration: 0.3 }}>{step.label}</motion.span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-[2px] mx-2 rounded-full relative overflow-hidden" style={{ background: T.border }}>
                <motion.div className="absolute inset-y-0 left-0 rounded-full" animate={{ width: isCompleted ? '100%' : isActive ? '50%' : '0%', backgroundColor: isCompleted ? step.accent : `${step.accent}40` }} transition={{ duration: 0.5 }} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─────────────────── Main Export ─────────────────── */

export function HowItWorks({ language = 'en' }: { language?: string }) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [isPinned, setIsPinned] = useState(false)
  const [activeStep, setActiveStep] = useState(0)

  const { scrollYProgress } = useScroll({ target: sentinelRef, offset: ['start start', 'end end'] })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 20, mass: 0.3, restDelta: 0.001 })

  useEffect(() => {
    if (!sentinelRef.current) return
    const obs = new IntersectionObserver(([e]) => setIsPinned(e.isIntersecting), { threshold: 0, rootMargin: '-1px 0px -1px 0px' })
    obs.observe(sentinelRef.current)
    return () => obs.disconnect()
  }, [])

  useMotionValueEvent(smoothProgress, 'change', (v) => {
    if (v < 0.25) setActiveStep(0)
    else if (v < 0.50) setActiveStep(1)
    else if (v < 0.75) setActiveStep(2)
    else setActiveStep(3)
  })

  const c0x = useTransform(smoothProgress, [0, 0.20, 0.25], [0, 0, -180])
  const c0o = useTransform(smoothProgress, [0, 0.20, 0.25], [1, 1, 0])
  const c0s = useTransform(smoothProgress, [0, 0.03, 0.20, 0.25], [0.82, 1, 1, 0.88])

  const c1x = useTransform(smoothProgress, [0.20, 0.25, 0.45, 0.50], [180, 0, 0, -180])
  const c1o = useTransform(smoothProgress, [0.20, 0.25, 0.45, 0.50], [0, 1, 1, 0])
  const c1s = useTransform(smoothProgress, [0.20, 0.25, 0.45, 0.50], [0.82, 1, 1, 0.88])

  const c2x = useTransform(smoothProgress, [0.45, 0.50, 0.70, 0.75], [180, 0, 0, -180])
  const c2o = useTransform(smoothProgress, [0.45, 0.50, 0.70, 0.75], [0, 1, 1, 0])
  const c2s = useTransform(smoothProgress, [0.45, 0.50, 0.70, 0.75], [0.82, 1, 1, 0.88])

  const c3x = useTransform(smoothProgress, [0.70, 0.75, 1.0], [180, 0, 0])
  const c3o = useTransform(smoothProgress, [0.70, 0.75, 1.0], [0, 1, 1])
  const c3s = useTransform(smoothProgress, [0.70, 0.73, 1.0], [0.82, 1, 1])

  return (
    <>
      {/* ── Header ── */}
      <div className="relative overflow-hidden py-20 sm:py-28 text-center" style={{ background: T.pageBg }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[160px]" style={{ background: 'rgba(139,69,19,0.05)' }} />
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative inline-block mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: T.accent, background: 'rgba(139,69,19,0.06)', border: `1px solid rgba(139,69,19,0.12)` }}>
            <Zap className="h-3 w-3" style={{ color: T.accentGold }} />How It Works
          </span>
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="relative text-4xl font-bold sm:text-5xl leading-[1.1] mb-5 px-4" style={{ color: T.textDark }}>
          {language === 'en' ? (<><FromSignupToLive /><br /><span style={{ color: T.accent }}>in 4 simple steps.</span></>) : (<><FourEasySteps /><br /><span style={{ color: T.accent }}>शुरू करें।</span></>)}
        </motion.h2>

        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="relative text-[15px] leading-relaxed max-w-xl mx-auto px-4" style={{ color: T.textMuted }}>
          No long contracts. No complicated setup. No IT team needed. Just contact us and we handle everything.
        </motion.p>
      </div>

      {/* ── Sentinel (scroll track) ── */}
      <section ref={sentinelRef} className="relative h-[450vh]" style={{ background: T.pageBg }} />

      {/* ── Fixed viewport ── */}
      {isPinned && (
        <div className="fixed inset-0 z-50 w-screen h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: T.pageBg }}>
          {/* Subtle noise / texture */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(139,69,19,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

          {/* Warm ambient glows */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] rounded-full blur-[200px]" style={{ background: 'rgba(139,69,19,0.04)' }} />
            <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full blur-[180px]" style={{ background: 'rgba(212,154,88,0.03)' }} />
          </div>

          <ProgressTracker activeStep={activeStep} />

          <div className="relative w-[92vw] max-w-[640px] h-[580px]">
            {STEPS.map((step, i) => (
              <StepCard key={step.id} step={step} x={[c0x, c1x, c2x, c3x][i]} opacity={[c0o, c1o, c2o, c3o][i]} scale={[c0s, c1s, c2s, c3s][i]} />
            ))}
          </div>

          {/* Scroll hint */}
          <motion.div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }}>
            <span className="text-[8px] font-bold uppercase tracking-[0.3em]" style={{ color: T.textLight }}>Scroll to explore</span>
            <motion.div className="w-4 h-7 rounded-full flex items-start justify-center p-1" style={{ border: `1px solid ${T.border}` }} animate={{ borderColor: [T.border, 'rgba(139,69,19,0.25)', T.border] }} transition={{ duration: 2, repeat: Infinity }}>
              <motion.div className="w-1 h-1.5 rounded-full" style={{ background: T.textLight }} animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} />
            </motion.div>
          </motion.div>
        </div>
      )}
    </>
  )
}

/* Tiny text fragments to avoid JSX lint issues */
function FromSignupToLive() { return <>From signup to live —</> }
function FourEasySteps() { return <>4 आसान चरणों में</> }

export default HowItWorks
