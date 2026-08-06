import { useState, type FormEvent } from 'react'
import { Link } from 'wouter'
import { Linkedin, Github, Instagram, Mail, ArrowRight, ArrowUpRight, Phone, Sparkles, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/language-context'

export function Footer() {
  const { language } = useLanguage()
  const year = new Date().getFullYear()

  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  const product = [
    { label: 'Attendance', href: '/features/attendance' },
    { label: 'Admissions', href: '/features/student-management' },
    { label: 'Homework', href: '/homework' },
    { label: 'Report Cards', href: '/features/exam-results' },
  ]

  const solutions = [
    { label: 'Fee Management', href: '/features/fees' },
    { label: 'Student Portal', href: '/student-portal' },
    { label: 'Transport', href: '/transport' },
    { label: 'Communication', href: '/features/parent-communication' },
  ]

  const company = [
    { label: 'About Us', href: '/about' },
    { label: 'Our Team', href: '/our-team' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ]

  const legal = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ]

  const socials = [
    { icon: Linkedin, href: 'https://www.linkedin.com/company/revenex-ventures', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/Revenex-Ventures/Revenex-', label: 'GitHub' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Mail, href: 'mailto:team@revenex.in', label: 'Email' },
  ]

  const handleJoin = (e: FormEvent) => {
    e.preventDefault()
    if (email.trim()) setJoined(true)
  }

  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[#18120E]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-10">

        {/* ── Pre-Footer CTA Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="relative mb-16 rounded-3xl bg-gradient-to-br from-[#281E18] to-[#1C140F] border border-white/5 overflow-hidden"
        >
          <div className="absolute -top-24 right-10 w-[420px] h-[420px] bg-[#D49A58]/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-10 w-[360px] h-[360px] bg-[#D49A58]/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(212, 154, 88, 0.6) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

          <div className="relative flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12 p-8 sm:p-12 lg:p-14">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-5">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D49A58]/25 bg-[#D49A58]/5">
                  <Sparkles className="h-3 w-3 text-[#D49A58]" />
                  <span className="text-[11px] font-semibold text-[#D49A58] tracking-widest uppercase">REVENEX</span>
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#F9F6F0] font-medium leading-tight mb-3">
                Ready to automate your school operations?
              </h2>
              <p className="max-w-xl text-sm sm:text-base text-white/50 leading-relaxed mb-0">
                Experience hassle-free admissions, instant fee collection, and automated attendance with REVENEX.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 lg:flex-col xl:flex-row">
              <Link href="/book-demo">
                <span className="inline-flex items-center justify-center gap-2 bg-[#D49A58] text-[#18120E] font-semibold px-7 py-3.5 rounded-xl text-sm transition-all hover:bg-[#E0AA6E] hover:shadow-[0_0_24px_rgba(212,154,88,0.35)] cursor-pointer">
                  Schedule a Demo <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
              <a
                href="tel:+919021744355"
                className="inline-flex items-center justify-center gap-2 border border-white/15 text-white/80 font-semibold px-7 py-3.5 rounded-xl text-sm transition-all hover:border-[#D49A58]/50 hover:text-[#D49A58]"
              >
                <Phone className="h-4 w-4" /> Call Sales
              </a>
            </div>
          </div>
        </motion.div>

        {/* ── 5-Column Grid ── */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-6">

          {/* Col 1 — Brand */}
          <div className="col-span-2 lg:col-span-2 space-y-5">
            <div>
              <img src="/logo.png" alt="REVENEX" className="h-8 sm:h-9 w-auto object-contain" />
              <p className="text-[11px] text-white/40 font-medium uppercase tracking-widest mt-2">
                Ventures Private Limited
              </p>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              {language === 'en'
                ? 'India\'s modern School ERP platform built for educators.'
                : 'भारत का आधुनिक स्कूल ERP प्लेटफॉर्म।'}
            </p>
            <div className="flex items-center gap-2.5">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-sm flex items-center justify-center text-white/50 hover:text-[#D49A58] hover:border-[#D49A58]/40 hover:bg-[#D49A58]/10 hover:shadow-[0_0_16px_rgba(212,154,88,0.2)] transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Product */}
          <div>
            <h4 className="text-xs font-black text-[#D49A58] uppercase tracking-widest mb-5">Product</h4>
            <ul className="space-y-3">
              {product.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href}>
                    <span className="text-sm text-white/50 hover:text-[#F9F6F0] transition-colors cursor-pointer">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Solutions */}
          <div>
            <h4 className="text-xs font-black text-[#D49A58] uppercase tracking-widest mb-5">Solutions</h4>
            <ul className="space-y-3">
              {solutions.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href}>
                    <span className="text-sm text-white/50 hover:text-[#F9F6F0] transition-colors cursor-pointer">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Company */}
          <div>
            <h4 className="text-xs font-black text-[#D49A58] uppercase tracking-widest mb-5">Company</h4>
            <ul className="space-y-3">
              {company.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href}>
                    <span className="text-sm text-white/50 hover:text-[#F9F6F0] transition-colors cursor-pointer">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5 — Contact & Newsletter */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xs font-black text-[#D49A58] uppercase tracking-widest mb-5">Stay Updated</h4>
            <form onSubmit={handleJoin} className="mb-6">
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.06] border border-white/10 focus-within:border-[#D49A58]/50 transition-colors">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter school email..."
                  disabled={joined}
                  className="flex-1 bg-transparent outline-none text-sm text-[#F9F6F0] placeholder:text-white/30 px-3 py-2 min-w-0 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={joined}
                  className="shrink-0 inline-flex items-center gap-1.5 bg-[#D49A58] text-[#18120E] font-semibold text-xs px-4 py-2.5 rounded-lg transition-all hover:bg-[#E0AA6E] disabled:bg-green-500/20 disabled:text-green-400"
                >
                  {joined ? <Check className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                  {joined ? 'Joined' : 'Join'}
                </button>
              </div>
              {joined && (
                <p className="text-[11px] text-green-400 mt-2">You're on the list — we'll be in touch.</p>
              )}
            </form>
            <ul className="space-y-3">
              <li>
                <a href="mailto:team@revenex.in" className="text-sm text-white/50 hover:text-[#D49A58] transition-colors">
                  team@revenex.in
                </a>
              </li>
              <li>
                <a href="tel:+919021744355" className="text-sm text-white/50 hover:text-[#D49A58] transition-colors">
                  +91 90217 44355
                </a>
              </li>
              <li>
                <p className="text-sm text-white/50">Pune &amp; Sangamner, Maharashtra</p>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="relative mt-16 pt-6 border-t border-white/10 overflow-hidden">
          <span
            aria-hidden
            className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10rem] sm:text-[14rem] font-black text-white opacity-[0.03] tracking-widest select-none pointer-events-none"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            REVENEX
          </span>

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40 text-center lg:text-left">
              &copy; {year} REVENEX VENTURES PRIVATE LIMITED. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-5">
                {legal.map(({ label, href }) => (
                  <Link key={href} href={href}>
                    <span className="text-xs text-white/40 hover:text-[#D49A58] transition-colors cursor-pointer">{label}</span>
                  </Link>
                ))}
              </div>
              <span className="hidden sm:inline h-3.5 w-px bg-white/10" />
              <span className="text-xs text-white/40">
                Built by <span className="text-white/70 font-semibold">Prasanna Mate</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/25">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-[11px] font-semibold text-green-400">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
