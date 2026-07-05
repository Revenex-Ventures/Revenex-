import { useRef } from 'react'
import { Link } from 'wouter'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Shield, Lock, Key, Cloud, Database, Eye, CheckCircle2, Award, Zap, Activity, Server, AlertTriangle } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Chatbot } from '@/components/Chatbot'
import { useLanguage } from '@/lib/language-context'

function TiltCard({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transition = 'transform 0.08s linear'
    el.style.transform = `perspective(900px) rotateY(${x * 11}deg) rotateX(${-y * 11}deg) translateZ(8px)`
  }
  const onMouseLeave = () => {
    const el = ref.current; if (!el) return
    el.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)'
    el.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0px)'
  }
  return (
    <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} className={className}
      style={{ willChange: 'transform', transformStyle: 'preserve-3d', ...style }}>
      {children}
    </div>
  )
}

const securityLayers = [
  {
    layer: '01',
    icon: Lock,
    title: '256-bit AES Encryption',
    desc: 'Every student record, fee receipt, and document is encrypted at rest using AES-256 — the same standard used by military and banking systems. In transit, all data uses TLS 1.3.',
    color: '#00E5C3',
    glow: 'rgba(0,229,195,0.3)',
    bg: 'bg-[#00E5C3]/10',
    border: 'border-[#00E5C3]/25',
    badge: 'Data Protection',
  },
  {
    layer: '02',
    icon: Key,
    title: 'Role-Based Access Control',
    desc: 'Principals see everything. Teachers see their class. Parents see only their child. Staff see only payroll-relevant data. Zero privilege escalation possible — enforced at the API layer, not just the UI.',
    color: '#7C4DFF',
    glow: 'rgba(124,77,255,0.3)',
    bg: 'bg-[#7C4DFF]/10',
    border: 'border-[#7C4DFF]/25',
    badge: 'Access Control',
  },
  {
    layer: '03',
    icon: Cloud,
    title: 'Google Cloud Infrastructure',
    desc: 'Hosted on Google Cloud Platform — the same infrastructure that runs Gmail and YouTube. Multi-region redundancy, automatic failover, and 99.9% uptime SLA backed by Google\'s global network.',
    color: '#3B82F6',
    glow: 'rgba(59,130,246,0.3)',
    bg: 'bg-[#3B82F6]/10',
    border: 'border-[#3B82F6]/25',
    badge: 'Infrastructure',
  },
  {
    layer: '04',
    icon: Database,
    title: 'Automated Encrypted Backups',
    desc: 'Continuous backups with point-in-time recovery. Your data is never in one place. Backup encryption keys are separate from data encryption keys — a breach of one cannot expose the other.',
    color: '#10B981',
    glow: 'rgba(16,185,129,0.3)',
    bg: 'bg-[#10B981]/10',
    border: 'border-[#10B981]/25',
    badge: 'Backup & Recovery',
  },
  {
    layer: '05',
    icon: Activity,
    title: '24/7 Automated Monitoring',
    desc: 'Real-time threat detection, anomaly alerts, and automated incident response. Suspicious login attempts, unusual data access, and API abuse are flagged and blocked automatically — day or night.',
    color: '#F59E0B',
    glow: 'rgba(245,158,11,0.3)',
    bg: 'bg-[#F59E0B]/10',
    border: 'border-[#F59E0B]/25',
    badge: 'Monitoring',
  },
  {
    layer: '06',
    icon: Eye,
    title: 'Full Audit Logging',
    desc: 'Every action in REVENEX is logged: who accessed what, when, from which IP, what changed. Immutable audit trails mean you can reconstruct any event — and prove compliance to any authority.',
    color: '#EF4444',
    glow: 'rgba(239,68,68,0.3)',
    bg: 'bg-[#EF4444]/10',
    border: 'border-[#EF4444]/25',
    badge: 'Compliance',
  },
]

const stats = [
  { value: '256-bit', label: 'AES Encryption', color: '#00E5C3' },
  { value: '99.9%', label: 'Uptime SLA Target', color: '#7C4DFF' },
  { value: '0', label: 'Data Breaches Ever', color: '#10B981' },
  { value: '24/7', label: 'Security Monitoring', color: '#F59E0B' },
]

const compliance = [
  { name: 'GDPR Compliant', desc: 'Full EU data protection compliance', icon: '🇪🇺', color: '#00E5C3' },
  { name: 'ISO 27001 Target', desc: 'Information security management', icon: '🔒', color: '#7C4DFF' },
  { name: 'SOC 2 Type II', desc: 'Service organization controls', icon: '✅', color: '#3B82F6' },
  { name: 'PCI DSS Ready', desc: 'Payment card data security', icon: '💳', color: '#F59E0B' },
]

function SecurityLayerItem({ layer, isLast }: { layer: typeof securityLayers[0]; isLast: boolean }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: '-15% 0px -15% 0px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0.25 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-[64px_1fr] gap-6 lg:gap-8"
    >
      <div className="flex flex-col items-center">
        <motion.div
          animate={isInView ? { boxShadow: `0 0 22px ${layer.glow}, 0 0 44px ${layer.glow.replace('0.3', '0.1')}` } : { boxShadow: '0 0 0px transparent' }}
          transition={{ duration: 0.5 }}
          className={`relative w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${layer.bg} border ${layer.border}`}
        >
          <layer.icon className="h-6 w-6" style={{ color: layer.color }} />
          <span
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black text-black"
            style={{ background: layer.color }}
          >
            {layer.layer}
          </span>
        </motion.div>
        {!isLast && (
          <div className="w-px flex-1 mt-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', minHeight: '40px' }}>
            <motion.div
              className="w-full origin-top"
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{ height: '100%', background: `linear-gradient(to bottom, ${layer.color}80, transparent)` }}
            />
          </div>
        )}
      </div>

      <div className={isLast ? 'pb-0' : 'pb-10 lg:pb-14'}>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase"
            style={{ color: layer.color, background: `${layer.color}14`, border: `1px solid ${layer.color}28` }}
          >
            LAYER {layer.layer} — {layer.badge}
          </span>
        </div>
        <h3 className="text-xl lg:text-2xl font-black text-white mb-3">{layer.title}</h3>
        <p className="text-white/55 leading-relaxed text-[15px]">{layer.desc}</p>
      </div>
    </motion.div>
  )
}

export default function Security() {
  const { language, t } = useLanguage()

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 hero-glow opacity-50 pointer-events-none" />
        <div className="absolute top-24 right-1/4 w-[400px] h-[400px] bg-[#00E5C3]/4 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-24 left-1/4 w-[300px] h-[300px] bg-[#7C4DFF]/4 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00E5C3]/20 bg-[#00E5C3]/5 mb-6">
              <Shield className="h-3.5 w-3.5 text-aqua" />
              <span className="text-xs font-black text-aqua/80 uppercase tracking-widest">Security</span>
            </div>
            <h1 className="text-5xl font-black text-white sm:text-6xl lg:text-7xl mb-6">
              {t('security.title')}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/40">
              {t('security.subtitle')}
            </p>
            <div className="mt-8 inline-flex items-center gap-3 px-5 py-3 rounded-2xl border border-[#00E5C3]/20 bg-[#00E5C3]/5">
              <AlertTriangle className="h-4 w-4 text-[#00E5C3]" />
              <span className="text-sm font-semibold text-white/70">
                Your students' data is a <span className="text-[#00E5C3]">legal responsibility</span>. REVENEX takes it seriously.
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-10 border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#00E5C3]/2 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-black mb-1 lg:text-4xl" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-sm text-white/40">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6-Layer Security Architecture */}
      <section className="py-20 lg:py-28 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 40% 60% at 0% 50%, rgba(0,229,195,0.04), transparent)' }} />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 lg:grid lg:grid-cols-2 lg:gap-12 lg:items-end"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-5">
                <span className="text-xs font-black text-white/50 uppercase tracking-widest">Architecture</span>
              </div>
              <h2 className="text-4xl font-black text-white sm:text-5xl leading-tight mb-4">
                6-Layer Security<br /><span className="gradient-text">No Weak Points.</span>
              </h2>
            </div>
            <div>
              <p className="text-white/45 leading-relaxed">
                Security isn't a feature we added at the end — it's the foundation. Every layer of REVENEX is designed around the principle that a data breach is unacceptable when children's records are involved.
              </p>
            </div>
          </motion.div>

          <div className="max-w-3xl">
            {securityLayers.map((layer, i) => (
              <SecurityLayerItem key={layer.layer} layer={layer} isLast={i === securityLayers.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* Compliance grid */}
      <section className="py-16 lg:py-24 relative border-t border-white/5">
        <div className="absolute inset-0 bg-white/[0.01]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-4">
              <span className="text-xs font-black text-white/50 uppercase tracking-widest">Compliance</span>
            </div>
            <h2 className="text-3xl font-black text-white sm:text-4xl">
              {language === 'en' ? 'Compliance & Certifications' : 'अनुपालन और प्रमाणपत्र'}
            </h2>
            <p className="text-white/40 mt-2 text-sm">
              {language === 'en' ? 'Targets for enterprise-grade compliance' : 'एंटरप्राइज-ग्रेड अनुपालन के लक्ष्य'}
            </p>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {compliance.map((cert, i) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <TiltCard
                  className="glass-card animated-border rounded-2xl p-6 text-center h-full"
                  style={{ border: `1px solid ${cert.color}20` } as React.CSSProperties}
                >
                  <div className="text-4xl mb-3">{cert.icon}</div>
                  <div className="font-bold text-white mb-1">{cert.name}</div>
                  <div className="text-xs text-white/35">{cert.desc}</div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Promise */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <TiltCard className="glass-card animated-border rounded-3xl p-10 text-center border-[#00E5C3]/20">
              <div className="mx-auto mb-6 w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(0,229,195,0.3)]">
                <Award className="h-8 w-8 text-black" />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00E5C3]/20 bg-[#00E5C3]/5 mb-5">
                <span className="text-xs font-black text-aqua/80 uppercase tracking-widest">Our Promise</span>
              </div>
              <h2 className="text-3xl font-black text-white mb-4">
                {language === 'en' ? 'We Will Never Sell Your Data' : 'हम आपका डेटा कभी नहीं बेचेंगे'}
              </h2>
              <p className="text-white/45 leading-relaxed mb-8 max-w-xl mx-auto">
                {language === 'en'
                  ? "Every piece of data you put into REVENEX stays yours. We don't sell it, we don't mine it, and we don't share it with third parties. Ever. You always retain full ownership and can export everything at any time."
                  : 'REVENEX में डाला गया हर डेटा आपका है। हम इसे बेचते नहीं, माइन नहीं करते, और किसी से शेयर नहीं करते।'}
              </p>
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: Server, label: 'No Data Selling', desc: 'Your data is never monetized' },
                  { icon: Shield, label: 'Full Ownership', desc: 'Export everything, anytime' },
                  { icon: Activity, label: '24/7 Monitoring', desc: 'Threats stopped before impact' },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/3 border border-white/6">
                    <CheckCircle2 className="h-5 w-5 text-aqua" />
                    <span className="text-sm font-bold text-white">{item.label}</span>
                    <span className="text-xs text-white/35">{item.desc}</span>
                  </div>
                ))}
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-40 pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-black text-white sm:text-5xl mb-6">{t('cta.title')}</h2>
            <p className="text-white/50 mb-8 text-lg">{t('cta.subtitle')}</p>
            <Link href="/book-demo">
              <motion.span whileHover={{ scale: 1.03 }} className="inline-flex items-center gap-2 gradient-bg text-black font-bold px-8 py-4 rounded-2xl cursor-pointer shadow-[0_0_30px_rgba(0,229,195,0.25)]">
                {t('cta.demo')} <ArrowRight className="h-4 w-4" />
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </main>
  )
}
