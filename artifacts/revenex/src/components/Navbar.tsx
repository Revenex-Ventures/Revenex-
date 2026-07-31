import { useState, useEffect, useRef } from 'react'
  import { Link, useLocation } from 'wouter'
  import { motion, AnimatePresence } from 'framer-motion'
  import { Menu, X, Globe, LogIn, LogOut, User, ChevronDown, Shield, GraduationCap, Phone } from 'lucide-react'
  import { useLanguage } from '@/lib/language-context'
  import { useAuth } from '@/lib/auth-context'

  const productColumns = [
    {
      title: 'School ERP',
      icon: GraduationCap,
      items: [
        { label: 'Principal Dashboard', href: '/#products' },
        { label: 'Teacher Dashboard', href: '/#products' },
        { label: 'Parent Dashboard', href: '/#products' },
      ],
    },
  ]

  function ProductsMenu({ closeMobile }: { closeMobile?: () => void }) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
      function handler(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
      <div className="relative" ref={ref}>
        <motion.button
          whileHover={{ y: -1 }}
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer text-[#3D3128] hover:text-[#1A1410]"
        >
          Products
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
        </motion.button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="absolute left-1/2 -translate-x-1/2 mt-3 w-[240px] glass rounded-2xl border border-[#E8E0D4] shadow-2xl p-5 flex flex-col gap-4 z-50"
            >
              {productColumns.map((col) => (
                <div key={col.title}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-[#F0E8DC] flex items-center justify-center shrink-0">
                      <col.icon className="h-3.5 w-3.5 text-[#7C3D0F]" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-[#1A1410]">{col.title}</span>
                  </div>
                  <ul className="space-y-1">
                    {col.items.map((it) => (
                      <li key={it.label}>
                        <Link href={it.href}>
                          <span onClick={() => { setOpen(false); closeMobile?.() }} className="block rounded-lg px-2 py-1.5 text-sm text-[#6B5D52] hover:text-[#1A1410] hover:bg-[#F0E8DC] transition-colors cursor-pointer">
                            {it.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  function scrollToSection(id: string) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function UserMenu() {
    const { user, logout } = useAuth()
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const [, navigate] = useLocation()

    // Close on outside click
    useEffect(() => {
      function handler(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }, [])

    if (!user) return null

    const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

    const handleLogout = async () => {
      setOpen(false)
      await logout()
      navigate('/')
    }

    return (
      <div className="relative hidden sm:block" ref={ref}>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-2 border border-[#E8E0D4] bg-[#F0E8DC] px-3 py-2 rounded-xl text-sm font-medium text-[#6B5D52] hover:bg-[#F0E8DC] hover:border-[#E8E0D4] transition-all"
        >
          <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center text-white text-xs font-black">
            {initials}
          </div>
          <span className="max-w-[120px] truncate">{user.name.split(' ')[0]}</span>
          <ChevronDown className={`h-3.5 w-3.5 text-[#3D3128] transition-transform ${open ? 'rotate-180' : ''}`} />
        </motion.button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-52 glass rounded-2xl border border-[#E8E0D4] overflow-hidden shadow-2xl z-50"
            >
              <div className="px-4 py-3 border-b border-[#E8E0D4]">
                <p className="text-sm font-semibold text-[#1A1410] truncate">{user.name}</p>
                <p className="text-xs text-[#6B5D52] truncate mt-0.5">{user.email}</p>
              </div>
              <div className="py-1">
                {user.role === 'admin' && (
                  <Link href="/admin">
                    <button onClick={() => setOpen(false)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-aqua hover:bg-[#F0E8DC] transition-colors text-left">
                      <Shield className="h-4 w-4" />
                      Admin Dashboard
                    </button>
                  </Link>
                )}
                <button
                  onClick={() => void handleLogout()}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#3D3128] hover:bg-[#F0E8DC] hover:text-[#1A1410] transition-colors text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { language, setLanguage, t } = useLanguage()
    const { user, logout } = useAuth()
    const [location, navigate] = useLocation()
    const [isPhoneHovered, setIsPhoneHovered] = useState(false)

    useEffect(() => {
      const handleScroll = () => setIsScrolled(window.scrollY > 20)
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => { setIsMobileMenuOpen(false) }, [location])

    function handleFeaturesClick(e: React.MouseEvent) {
      e.preventDefault()
      setIsMobileMenuOpen(false)
      if (location === '/') scrollToSection('features')
      else { navigate('/'); setTimeout(() => scrollToSection('features'), 400) }
    }

    const navItems = [
      { label: t('nav.home'), href: '/', isAnchor: false },
      { label: 'Features', href: '#features', isAnchor: true, onClick: handleFeaturesClick },
      { label: t('nav.contact'), href: '/contact', isAnchor: false },
    ]

    return (
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'glass shadow-2xl' : 'bg-transparent'}`}>
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            <Link href="/" className="flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-1">
                <span className="text-xl font-black lg:text-2xl tracking-tight">
                  <span className="text-[#1A1410]">REVEN</span><span className="text-aqua">EX</span>
                </span>
              </motion.div>
            </Link>

            <div className="hidden items-center gap-1 lg:flex">
              {navItems[0] && (
                <Link href={navItems[0].href}>
                  <motion.span whileHover={{ y: -1 }}
                    className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer inline-block ${location === navItems[0].href ? 'text-aqua' : 'text-[#3D3128] hover:text-[#1A1410]'}`}>
                    {navItems[0].label}
                    {location === navItems[0].href && <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-aqua rounded-full" />}
                  </motion.span>
                </Link>
              )}
              <ProductsMenu />
              {navItems.slice(1).map((item) =>
                item.isAnchor ? (
                  <motion.button key={item.label} whileHover={{ y: -1 }} onClick={item.onClick}
                    className="relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer text-[#3D3128] hover:text-[#1A1410]">
                    {item.label}
                  </motion.button>
                ) : (
                  <Link key={item.href} href={item.href}>
                    <motion.span whileHover={{ y: -1 }}
                      className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer inline-block ${location === item.href ? 'text-aqua' : 'text-[#3D3128] hover:text-[#1A1410]'}`}>
                      {item.label}
                      {location === item.href && <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-aqua rounded-full" />}
                    </motion.span>
                  </Link>
                )
              )}
            </div>

            <div className="flex items-center gap-2">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-[#3D3128] transition-all hover:bg-[#F0E8DC] hover:text-[#1A1410] border border-[#E8E0D4] hover:border-[#E8E0D4]">
                <Globe className="h-4 w-4 text-aqua" />
                <span className="hidden sm:inline font-semibold">{language === 'en' ? 'EN' : 'हिं'}</span>
              </motion.button>

              {user ? (
                <UserMenu />
              ) : (
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="hidden sm:block">
                  <Link href="/login">
                    <span className="inline-flex items-center gap-1.5 border border-[#E8E0D4] text-[#6B5D52] font-semibold px-4 py-2.5 rounded-xl text-sm transition-all hover:bg-[#F0E8DC] hover:border-[#E8E0D4] cursor-pointer">
                      <LogIn className="h-3.5 w-3.5" />
                      Sign In
                    </span>
                  </Link>
                </motion.div>
              )}

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="hidden sm:block">
                <Link href="/book-demo">
                  <span className="inline-flex items-center gap-2 gradient-bg text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all hover:opacity-90 glow-aqua cursor-pointer">
                    Get Started →
                  </span>
                </Link>
              </motion.div>

              {/* Phone Hover/Reveal Button */}
              <motion.a
                href="tel:+919021744355"
                onMouseEnter={() => setIsPhoneHovered(true)}
                onMouseLeave={() => setIsPhoneHovered(false)}
                className="hidden sm:flex items-center h-10 rounded-full border border-[#D4B896] bg-white text-[#1A1410] overflow-hidden cursor-pointer shadow-sm ml-3 hover:border-[#8B4513] hover:bg-[#1A1410] transition-colors duration-200 group"
                animate={{ width: isPhoneHovered ? 165 : 40 }}
                transition={{ type: 'spring', stiffness: 380, damping: 26 }}
              >
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 text-[#8B4513] group-hover:text-white transition-colors duration-200" />
                </div>
                <AnimatePresence>
                  {isPhoneHovered && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-xs font-bold text-[#8B4513] group-hover:text-white transition-colors duration-200 whitespace-nowrap pr-4"
                    >
                      +91 90217 44355
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.a>

              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-xl p-2 text-[#6B5D52] hover:bg-[#F0E8DC] lg:hidden border border-[#E8E0D4]">
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </nav>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
              className="glass lg:hidden border-t border-[#E8E0D4] overflow-hidden">
              <div className="space-y-1 px-4 pb-6 pt-3">
                {navItems.map((item, i) => (
                  <motion.div key={item.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    {item.isAnchor ? (
                      <button onClick={item.onClick} className="block w-full text-left rounded-xl px-4 py-3 text-base font-medium text-[#3D3128] hover:bg-[#F0E8DC] hover:text-[#1A1410] transition-all">
                        {item.label}
                      </button>
                    ) : (
                      <Link href={item.href}>
                        <span className={`block rounded-xl px-4 py-3 text-base font-medium transition-all cursor-pointer ${location === item.href ? 'bg-[#F0E8DC] text-aqua border border-aqua/20' : 'text-[#3D3128] hover:bg-[#F0E8DC] hover:text-[#1A1410]'}`}>
                          {item.label}
                        </span>
                      </Link>
                    )}
                    {i === 0 && (
                      <div className="pl-4 mt-1 space-y-0.5">
                        {productColumns.flatMap(c => c.items).map((it) => (
                          <Link key={it.label} href={it.href}>
                            <span onClick={() => setIsMobileMenuOpen(false)} className="block rounded-lg px-4 py-2 text-sm text-[#6B5D52] hover:text-[#1A1410] hover:bg-[#F0E8DC] transition-colors cursor-pointer">
                              {it.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
                {user ? (
                  <>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: navItems.length * 0.05 }}>
                      <div className="flex items-center gap-3 px-4 py-3 border border-[#E8E0D4] rounded-xl mb-1">
                        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                          {user.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#1A1410] truncate">{user.name}</p>
                          <p className="text-xs text-[#6B5D52] truncate">{user.email}</p>
                        </div>
                      </div>
                    </motion.div>
                    {user.role === 'admin' && (
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (navItems.length + 1) * 0.05 }}>
                        <Link href="/admin">
                          <span onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 rounded-xl px-4 py-3 text-base font-medium text-aqua hover:bg-[#F0E8DC] transition-all cursor-pointer border border-aqua/20 mb-1">
                            <Shield className="h-4 w-4" />
                            Admin Dashboard
                          </span>
                        </Link>
                      </motion.div>
                    )}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (navItems.length + 2) * 0.05 }}>
                      <button onClick={() => { setIsMobileMenuOpen(false); void logout().then(() => navigate('/')) }}
                        className="flex items-center gap-2 w-full rounded-xl px-4 py-3 text-base font-medium text-[#3D3128] hover:bg-[#F0E8DC] hover:text-[#1A1410] transition-all">
                        <LogOut className="h-4 w-4 text-red-400" />
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: navItems.length * 0.05 }}>
                    <Link href="/login">
                      <span className="flex items-center gap-2 rounded-xl px-4 py-3 text-base font-medium text-[#3D3128] hover:bg-[#F0E8DC] hover:text-[#1A1410] transition-all cursor-pointer border border-[#E8E0D4] mb-2">
                        <LogIn className="h-4 w-4 text-aqua" />
                        Sign In
                      </span>
                    </Link>
                  </motion.div>
                )}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (navItems.length + 3) * 0.05 }} className="pt-1">
                  <Link href="/book-demo">
                    <span className="block gradient-bg text-white font-bold px-4 py-3 rounded-xl text-center cursor-pointer">Get Started →</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    )
  }
  