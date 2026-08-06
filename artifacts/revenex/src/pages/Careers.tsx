import { motion } from 'framer-motion'
import { Link } from 'wouter'
import {
  Rocket, Users, GraduationCap, Heart, TrendingUp, Coffee,
  Mail, MapPin, ArrowRight, Sparkles, Briefcase, Layers, Target
} from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Chatbot } from '@/components/Chatbot'
import { useLanguage } from '@/lib/language-context'

const values = [
  {
    icon: Target,
    title: 'Mission-Driven',
    desc: 'Every line of code we write helps a school serve its students better. That purpose keeps the team sharp.',
    color: '#8B4513',
  },
  {
    icon: Users,
    title: 'Ownership Culture',
    desc: 'Small team, big ownership. You will ship real features that real schools use — not busywork.',
    color: '#166534',
  },
  {
    icon: TrendingUp,
    title: 'Grow Fast',
    desc: 'Clear growth paths, mentorship, and real responsibility from day one. Your career here compounds.',
    color: '#7C3AED',
  },
  {
    icon: Coffee,
    title: 'Balanced & Human',
    desc: 'Flexible hours, remote-friendly work, and a team that actually likes each other. We build to last.',
    color: '#B45309',
  },
]

const roles = [
  {
    icon: Briefcase,
    title: 'Full-Stack Engineer',
    type: 'Full-time · Pune / Remote',
    dept: 'Engineering',
    desc: 'Build the ERP modules that power 100+ school workflows. React, TypeScript, Firebase, and cloud-native chops are a plus.',
    accent: '#166534',
  },
  {
    icon: Layers,
    title: 'Product Designer',
    type: 'Full-time · Pune',
    dept: 'Design',
    desc: 'Design intuitive, accessible experiences for teachers, parents, and students — from first sketch to shipped UI.',
    accent: '#8B4513',
  },
  {
    icon: Rocket,
    title: 'Growth Marketing Lead',
    type: 'Full-time · Pune',
    dept: 'Marketing',
    desc: 'Own demand generation and school outreach. You will turn our education-first story into admissions pipelines.',
    accent: '#7C3AED',
  },
  {
    icon: GraduationCap,
    title: 'Implementation Specialist',
    type: 'Full-time · Field',
    dept: 'Success',
    desc: 'Onboard schools, train staff, and be the friendly face of REVENEX across Maharashtra. Travel to Pune & Sangamner.',
    accent: '#B45309',
  },
]

const perks = [
  'Competitive salary with equity options',
  'Health insurance for you and your family',
  'Flexible remote-friendly work setup',
  'Learning budget for courses & conferences',
  'Annual offsites and team retreats',
  'Direct mentorship from the founders',
]

export default function Careers() {
  const { language } = useLanguage()

  return (
    <main className="min-h-screen bg-[#F5F0E8] overflow-x-hidden">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 hero-glow pointer-events-none" />
        <div className="absolute top-24 right-8 w-[420px] h-[420px] bg-[#8B4513]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-6 left-1/4 w-[360px] h-[360px] bg-[#D49A58]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E8E0D4] bg-[#F0E8DC] mb-6">
              <Rocket className="h-3.5 w-3.5 text-[#8B4513]" />
              <span className="text-xs font-semibold text-[#3D3128] uppercase tracking-widest">
                {language === 'en' ? 'Careers' : 'करियर'}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1A1410] leading-[1.1] font-display tracking-tight mb-6 max-w-3xl">
              Build the future of <span className="gradient-text">Indian education</span> with us
            </h1>
            <p className="max-w-2xl text-lg text-[#3D3128] leading-relaxed mb-8">
              {language === 'en'
                ? 'REVENEX is a small, ambitious team from Pune and Sangamner building the ERP that modern schools run on. We are hiring people who want their work to matter.'
                : 'REVENEX पुणे और सांगमनेर की एक छोटी, महत्वाकांक्षी टीम है जो उस ERP का निर्माण कर रही है जिस पर आधुनिक स्कूल चलते हैं। हम ऐसे लोगों को नियुक्त कर रहे हैं जो चाहते हैं कि उनका काम मायने रखे।'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="mailto:team@revenex.in?subject=Career%20Application" className="inline-flex items-center gap-2 btn-primary cursor-pointer">
                {language === 'en' ? 'Apply Now' : 'आवेदन करें'} <ArrowRight className="h-5 w-5" />
              </a>
              <a href="#open-roles" className="inline-flex items-center justify-center gap-2 border border-[#1A1410]/20 text-[#1A1410] font-semibold px-7 py-3.5 rounded-xl text-base transition-all hover:bg-[#1A1410]/5 cursor-pointer">
                <Briefcase className="h-4 w-4" /> {language === 'en' ? 'Open Roles' : 'रिक्तियां'}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-14">
            <span className="text-[11px] font-black text-[#8B4513] uppercase tracking-widest mb-3">What We Value</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1A1410] font-display tracking-tight">
              The culture behind the product
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                className="glass-card rounded-3xl p-7 card-lift"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: `${color}14`, border: `1px solid ${color}25` }}>
                  <Icon className="h-6 w-6" style={{ color }} />
                </div>
                <h3 className="text-base font-bold text-[#1A1410] mb-2">{title}</h3>
                <p className="text-sm text-[#6B5D52] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open roles ── */}
      <section id="open-roles" className="py-20 scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-14">
            <span className="text-[11px] font-black text-[#8B4513] uppercase tracking-widest mb-3">Open Positions</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1A1410] font-display tracking-tight">
              Join the founding team
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {roles.map(({ icon: Icon, title, type, dept, desc, accent }, i) => (
              <motion.a
                key={title}
                href={`mailto:team@revenex.in?subject=Application%20-%20${encodeURIComponent(title)}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
                className="group glass-card rounded-3xl p-7 card-lift block"
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${accent}14`, border: `1px solid ${accent}25` }}>
                    <Icon className="h-6 w-6" style={{ color: accent }} />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-[#E8E0D4] bg-[#F0E8DC] text-[#6B5D52]">
                    {dept}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#1A1410] mb-1">{title}</h3>
                <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: accent }}>{type}</p>
                <p className="text-sm text-[#6B5D52] leading-relaxed mb-5">{desc}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#8B4513] transition-all group-hover:gap-2.5">
                  {language === 'en' ? 'Apply' : 'आवेदन करें'} <ArrowRight className="h-4 w-4" />
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Perks + CTA ── */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-3xl p-8 sm:p-10"
          >
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-[#B45309]" />
              <span className="text-xs font-black text-[#B45309] uppercase tracking-widest">Perks & Benefits</span>
            </div>
            <h3 className="text-2xl font-black text-[#1A1410] font-display tracking-tight mb-5">
              We take care of the people who take care of schools
            </h3>
            <ul className="space-y-3">
              {perks.map((perk) => (
                <li key={perk} className="flex items-center gap-3 text-sm text-[#3D3128]">
                  <Sparkles className="h-4 w-4 text-[#8B4513] shrink-0" />
                  {perk}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#281E18] to-[#1C140F] p-8 sm:p-10 flex flex-col justify-center"
          >
            <div className="absolute -top-16 -right-16 w-[280px] h-[280px] bg-[#D49A58]/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative">
              <MapPin className="h-8 w-8 text-[#D49A58] mb-4" />
              <h3 className="text-2xl font-black text-[#F9F6F0] font-display tracking-tight mb-3">
                Don't see your role?
              </h3>
              <p className="text-white/50 text-base leading-relaxed mb-6">
                We are always on the lookout for exceptional people. Send us your story — we will find the right seat for you.
              </p>
              <a href="mailto:team@revenex.in?subject=General%20Application" className="inline-flex items-center gap-2 bg-[#D49A58] text-[#18120E] font-semibold px-6 py-3.5 rounded-xl text-sm transition-all hover:bg-[#E0AA6E] hover:shadow-[0_0_24px_rgba(212,154,88,0.35)]">
                <Mail className="h-4 w-4" /> team@revenex.in
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </main>
  )
}
