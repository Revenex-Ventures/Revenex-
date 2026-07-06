import { Link } from 'wouter'
import { Linkedin, Github, Instagram, Mail, ExternalLink } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

export function Footer() {
  const { language } = useLanguage()
  const year = new Date().getFullYear()

  const product = [
    { label: 'Features', href: '/#features' },
    { label: 'Book a Demo', href: '/book-demo' },
    { label: 'Login', href: '/login' },
  ]

  const company = [
    { label: 'About', href: '/about' },
    { label: 'Our Story', href: '/our-story' },
    { label: 'Founders', href: '/founders' },
    { label: 'Contact', href: '/contact' },
  ]

  const legal = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ]

  const socials = [
    { icon: Linkedin, href: 'https://www.linkedin.com/company/revenex-ventures', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Mail, href: 'mailto:team@revenex.in', label: 'Email' },
  ]

  return (
    <footer className="border-t border-[#E8E0D4] bg-[#EDE8DC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">

          {/* Col 1 — Brand */}
          <div className="col-span-2 lg:col-span-1 space-y-5">
            <div>
              <span className="text-xl font-black">
                <span className="text-[#1A1410]">REVEN</span>
                <span className="text-aqua">EX</span>
              </span>
              <p className="text-[11px] text-[#6B5D52] font-medium uppercase tracking-widest mt-0.5">
                Ventures Private Limited
              </p>
            </div>
            <p className="text-sm text-[#6B5D52] leading-relaxed max-w-xs">
              {language === 'en'
                ? 'India\'s modern School ERP platform — built for educators, not accountants.'
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
                  className="w-9 h-9 rounded-xl bg-[#F0E8DC] border border-[#E8E0D4] flex items-center justify-center text-[#6B5D52] hover:text-aqua hover:border-aqua/30 hover:bg-aqua/5 transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Product */}
          <div>
            <h4 className="text-xs font-black text-[#6B5D52] uppercase tracking-widest mb-5">Product</h4>
            <ul className="space-y-3">
              {product.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href}>
                    <span className="text-sm text-[#6B5D52] hover:text-[#1A1410] transition-colors cursor-pointer">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Company */}
          <div>
            <h4 className="text-xs font-black text-[#6B5D52] uppercase tracking-widest mb-5">Company</h4>
            <ul className="space-y-3">
              {company.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href}>
                    <span className="text-sm text-[#6B5D52] hover:text-[#1A1410] transition-colors cursor-pointer">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Legal */}
          <div>
            <h4 className="text-xs font-black text-[#6B5D52] uppercase tracking-widest mb-5">Legal</h4>
            <ul className="space-y-3">
              {legal.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href}>
                    <span className="text-sm text-[#6B5D52] hover:text-[#1A1410] transition-colors cursor-pointer">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 space-y-2">
              <p className="text-xs text-[#6B5D52]">Contact</p>
              <a href="mailto:team@revenex.in" className="text-sm text-[#6B5D52] hover:text-aqua transition-colors block">
                team@revenex.in
              </a>
              <a href="tel:+919021744355" className="text-sm text-[#6B5D52] hover:text-aqua transition-colors block">
                +91 90217 44355
              </a>
              <p className="text-sm text-[#6B5D52]">Pune, Maharashtra, India</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#E8E0D4] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6B5D52]">
            &copy; {year} REVENEX VENTURES PRIVATE LIMITED. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#6B5D52]">
              Built by{' '}
              <span className="text-[#6B5D52] font-semibold">Prasanna Mate</span>
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B4513]/10 border border-[#8B4513]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B4513] animate-pulse" />
              <span className="text-[11px] font-semibold text-[#8B4513]">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
