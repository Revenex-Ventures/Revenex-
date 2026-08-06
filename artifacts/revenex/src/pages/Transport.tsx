import { motion } from 'framer-motion'
import { Link } from 'wouter'
import {
  BusFront, MapPin, Navigation, ShieldCheck, Users, Route as RouteIcon,
  Smartphone, BellRing, CheckCircle2, ClipboardCheck, ArrowRight, PhoneCall
} from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Chatbot } from '@/components/Chatbot'
import { useLanguage } from '@/lib/language-context'

const features = [
  {
    icon: Navigation,
    title: 'Live GPS Tracking',
    desc: 'Parents see the school bus on a live map with estimated arrival time at each stop. No more waiting at the gate wondering where the bus is.',
    color: '#166534',
    points: ['Real-time bus location', 'ETA per stop', 'Works on any phone'],
  },
  {
    icon: MapPin,
    title: 'Route & Stop Planner',
    desc: 'Design routes, assign stops, and set pickup/drop timings visually. Drivers get turn-by-turn guidance from the same system.',
    color: '#8B4513',
    points: ['Visual route builder', 'Per-stop timing', 'Driver app sync'],
  },
  {
    icon: Users,
    title: 'Student Manifest',
    desc: 'Digital roll-call of every student on board. Know exactly who boarded and who got off at which stop — and where they are right now.',
    color: '#7C3AED',
    points: ['Tap in / tap out', 'Live headcount', 'Missed-stop alerts'],
  },
  {
    icon: ShieldCheck,
    title: 'Safety & Compliance',
    desc: 'Speed alerts, route deviation warnings, and journey history keep every trip auditable and every child accountable.',
    color: '#B45309',
    points: ['Overspeed alerts', 'Deviation warnings', 'Full trip history'],
  },
  {
    icon: BellRing,
    title: 'Parent Notifications',
    desc: 'Automatic SMS and app alerts when the bus approaches a stop, boards, and reaches school. Reassurance in real time.',
    color: '#1D4ED8',
    points: ['Boarding alerts', 'Arrival alerts', 'Delay updates'],
  },
  {
    icon: ClipboardCheck,
    title: 'Transport Fees & Admin',
    desc: 'Track route-wise fees, seat availability, and vehicle expenses from a single dashboard — no more messy registers.',
    color: '#B91C1C',
    points: ['Route-wise fees', 'Seat management', 'Fuel & expense logs'],
  },
]

const steps = [
  { icon: RouteIcon, title: 'Plan Routes', desc: 'Draw routes and set stops on a map in minutes.' },
  { icon: BusFront, title: 'Assign Students', desc: 'Allocate each student to a route and stop instantly.' },
  { icon: Navigation, title: 'Go Live', desc: 'Drivers start the trip in the app; tracking begins.' },
  { icon: BellRing, title: 'Parents Stay Informed', desc: 'Alerts fire at every stop automatically.' },
]

export default function Transport() {
  const { language } = useLanguage()

  return (
    <main className="min-h-screen bg-[#F5F0E8] overflow-x-hidden">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 hero-glow pointer-events-none" />
        <div className="absolute top-24 right-8 w-[420px] h-[420px] bg-[#166534]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-6 left-1/4 w-[360px] h-[360px] bg-[#8B4513]/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E8E0D4] bg-[#F0E8DC] mb-6">
              <BusFront className="h-3.5 w-3.5 text-[#166534]" />
              <span className="text-xs font-semibold text-[#3D3128] uppercase tracking-widest">
                {language === 'en' ? 'School Transport' : 'स्कूल परिवहन'}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1A1410] leading-[1.1] font-display tracking-tight mb-6 max-w-3xl">
              Every bus, every stop, <span className="gradient-text">every child accounted for</span>
            </h1>
            <p className="max-w-2xl text-lg text-[#3D3128] leading-relaxed mb-8">
              {language === 'en'
                ? 'Live GPS tracking, digital manifests, and automatic parent alerts turn school transport from a daily worry into a fully managed service.'
                : 'लाइव GPS ट्रैकिंग, डिजिटल मैनिफेस्ट और स्वचालित पैरेंट अलर्ट स्कूल परिवहन को दैनिक चिंता से पूरी तरह प्रबंधित सेवा में बदल देते हैं।'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/book-demo">
                <span className="inline-flex items-center gap-2 btn-primary cursor-pointer">
                  {language === 'en' ? 'Book a Demo' : 'डेमो बुक करें'} <ArrowRight className="h-5 w-5" />
                </span>
              </Link>
              <a href="/contact" className="inline-flex items-center justify-center gap-2 border border-[#1A1410]/20 text-[#1A1410] font-semibold px-7 py-3.5 rounded-xl text-base transition-all hover:bg-[#1A1410]/5 cursor-pointer">
                <PhoneCall className="h-4 w-4" /> {language === 'en' ? 'Talk to Us' : 'हमसे बात करें'}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Feature grid ── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-14">
            <span className="text-[11px] font-black text-[#166534] uppercase tracking-widest mb-3">Transport Suite</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1A1410] font-display tracking-tight">
              Safety, visibility, and control — all in one
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color, points }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="glass-card rounded-3xl p-7 card-lift shine-card"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: `${color}14`, border: `1px solid ${color}25` }}>
                  <Icon className="h-6 w-6" style={{ color }} />
                </div>
                <h3 className="text-lg font-bold text-[#1A1410] mb-2">{title}</h3>
                <p className="text-sm text-[#6B5D52] leading-relaxed mb-5">{desc}</p>
                <ul className="space-y-1.5">
                  {points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-xs font-medium text-[#3D3128]">
                      <CheckCircle2 className="h-3.5 w-3.5" style={{ color }} /> {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-14">
            <span className="text-[11px] font-black text-[#166534] uppercase tracking-widest mb-3">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1A1410] font-display tracking-tight">
              From route planning to peace of mind
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative glass-card rounded-3xl p-6"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-xl bg-[#166534] text-[#F5F0E8] flex items-center justify-center text-xs font-black">
                  {i + 1}
                </div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#F0E8DC] border border-[#E8E0D4] mb-4">
                  <Icon className="h-5 w-5 text-[#166534]" />
                </div>
                <h3 className="text-base font-bold text-[#1A1410] mb-1.5">{title}</h3>
                <p className="text-sm text-[#6B5D52] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Safety strip ── */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl border border-[#166534]/15 bg-[#166534]/5 px-8 py-10 sm:px-12"
          >
            <div className="absolute -top-16 -right-16 w-[300px] h-[300px] bg-[#166534]/8 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="h-5 w-5 text-[#166534]" />
                  <span className="text-xs font-black text-[#166534] uppercase tracking-widest">Our Safety Promise</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#1A1410] font-display tracking-tight mb-3">
                  Zero-phone, zero-surprise school commutes
                </h3>
                <p className="max-w-xl text-[#3D3128] leading-relaxed">
                  When every trip is live-tracked and every child is on a digital manifest, incidents become exceptions — and parents never have to guess.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/book-demo">
                  <span className="inline-flex items-center gap-2 bg-[#166534] text-white font-semibold px-7 py-3.5 rounded-xl text-sm transition-all hover:bg-[#15803D] hover:shadow-[0_0_24px_rgba(22,101,52,0.35)] cursor-pointer">
                    Book a Demo <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </main>
  )
}
