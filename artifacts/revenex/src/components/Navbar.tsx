import { useState, useEffect, useRef } from 'react'
  import { Link, useLocation } from 'wouter'
  import { motion, AnimatePresence } from 'framer-motion'
  import { Menu, X, Globe, LogIn, LogOut, User, ChevronDown, Shield, GraduationCap, Phone, House, Sparkles, CalendarCheck, Mail, ArrowRight } from 'lucide-react'
  import { useLanguage } from '@/lib/language-context'
  import { useAuth } from '@/lib/auth-context'

  const productColumns = [
    {
      title: 'School ERP',
      icon: GraduationCap,
      items: [
        { label: 'Principal Dashboard', href: '/#principal-dashboard' },
        { label: 'Teacher Dashboard', href: '/#teacher-dashboard' },
        { label: 'Parent Dashboard', href: '/#parent-dashboard' },
      ],
    },
  ]

  function ProductsMenu({ closeMobile }: { closeMobile?: () => void }) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const [location, navigate] = useLocation()

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
          className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer text-[#D4C9BD] hover:text-white"
        >
          Products
          <ChevronDown className={`h-3.5 w-3.5 text-[#D4C9BD] transition-transform ${open ? 'rotate-180' : ''}`} />
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
                        <span 
                          onClick={(e) => {
                            e.preventDefault()
                            setOpen(false)
                            closeMobile?.()
                            const targetAnchor = it.label.toLowerCase().replace(/\s+/g, '-')
                            if (location === '/') {
                              scrollToSection(targetAnchor)
                            } else {
                              navigate('/')
                              setTimeout(() => scrollToSection(targetAnchor), 400)
                            }
                          }}
                          className="block rounded-lg px-2 py-1.5 text-sm text-[#6B5D52] hover:text-[#1A1410] hover:bg-[#F0E8DC] transition-colors cursor-pointer"
                        >
                          {it.label}
                        </span>
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
      <header className="fixed inset-x-0 bottom-3 z-50 flex flex-col items-center lg:top-5 lg:inset-x-3 lg:bottom-auto">
        <nav className="w-full max-w-md lg:max-w-7xl">
          <div className={`relative hidden lg:flex h-12 md:h-14 items-center justify-between pl-4 pr-2 sm:pl-5 rounded-full transition-all duration-500 border border-[#3D2810] ${isScrolled ? 'bg-[#241D15]/70 backdrop-blur-2xl shadow-[0_14px_44px_-14px_rgba(0,0,0,0.55)]' : 'bg-[#241D15] shadow-[0_10px_32px_-14px_rgba(0,0,0,0.35)]'}`}>
            <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-[#E3B581]/40 to-transparent" />
            <Link href="/" className="flex items-center shrink-0">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E3B581] to-[#8B4513] flex items-center justify-center shadow-[0_4px_14px_-4px_rgba(227,181,129,0.6)]">
                  <GraduationCap className="h-5 w-5 text-white" />
                </span>
                <span className="text-xl font-black lg:text-2xl tracking-tight">
                  <span className="text-white">REVEN</span><span className="text-[#E3B581]">EX</span>
                </span>
              </motion.div>
            </Link>

            <div className="hidden lg:flex items-center gap-1 rounded-full bg-white/[0.04] border border-white/[0.06] p-1">
              {navItems[0] && (
                <Link href={navItems[0].href}>
                  <motion.span whileHover={{ y: -1 }}
                    className={`relative inline-block rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 cursor-pointer ${location === navItems[0].href ? 'text-[#E3B581]' : 'text-[#D4C9BD] hover:text-white'}`}>
                    {location === navItems[0].href && <motion.div layoutId="nav-indicator" className="absolute inset-0 rounded-full bg-[#E3B581]/15" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                    <span className="relative z-10">{navItems[0].label}</span>
                  </motion.span>
                </Link>
              )}
              <ProductsMenu />
              {navItems.slice(1).map((item) =>
                item.isAnchor ? (
                  <motion.button key={item.label} whileHover={{ y: -1 }} onClick={item.onClick}
                    className="relative rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 cursor-pointer text-[#D4C9BD] hover:text-white">
                    {item.label}
                  </motion.button>
                ) : (
                  <Link key={item.href} href={item.href}>
                    <motion.span whileHover={{ y: -1 }}
                      className={`relative inline-block rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 cursor-pointer ${location === item.href ? 'text-[#E3B581]' : 'text-[#D4C9BD] hover:text-white'}`}>
                      {location === item.href && <motion.div layoutId="nav-indicator" className="absolute inset-0 rounded-full bg-[#E3B581]/15" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                      <span className="relative z-10">{item.label}</span>
                    </motion.span>
                  </Link>
                )
              )}
            </div>

            <div className="hidden lg:block h-6 w-px bg-gradient-to-b from-transparent via-[#E3B581]/30 to-transparent" />

            <div className="flex items-center gap-2">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-[#D4C9BD] transition-all hover:bg-white/5 hover:text-white border border-white/10">
                <Globe className="h-4 w-4 text-[#E3B581]" />
                <span className="hidden sm:inline font-semibold">{language === 'en' ? 'EN' : 'हिं'}</span>
              </motion.button>

              {user ? (
                <UserMenu />
              ) : (
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="hidden sm:block">
                  <Link href="/login">
                    <span className="inline-flex items-center gap-1.5 border border-white/10 text-[#D4C9BD] font-semibold px-4 py-2.5 rounded-full text-sm transition-all hover:bg-white/5 hover:text-white cursor-pointer">
                      <LogIn className="h-3.5 w-3.5 text-[#E3B581]" />
                      Sign In
                    </span>
                  </Link>
                </motion.div>
              )}

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="hidden sm:block">
                <Link href="/book-demo">
                  <span className="inline-flex items-center gap-2 bg-gradient-to-br from-[#E3B581] to-[#8B4513] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all hover:brightness-110 cursor-pointer shadow-[0_8px_20px_-8px_rgba(139,69,19,0.9)]">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </motion.div>

              {/* Phone Hover/Reveal Button */}
              <motion.a
                href="tel:+919021744355"
                onMouseEnter={() => setIsPhoneHovered(true)}
                onMouseLeave={() => setIsPhoneHovered(false)}
                className="hidden sm:flex items-center h-10 rounded-full border border-[#3D2810] bg-white text-[#1A1410] overflow-hidden cursor-pointer shadow-sm ml-3 hover:border-[#D4A26A] hover:bg-[#F5F0E8] transition-colors duration-200 group"
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
            </div>
          </div>

          <div className="lg:hidden relative flex items-end justify-around rounded-full bg-[#241D15]/90 backdrop-blur-2xl border border-[#3D2810] px-3 pb-1 pt-1 shadow-[0_10px_32px_-10px_rgba(0,0,0,0.5)] w-full max-w-sm">
            <Link href="/" className="flex flex-col items-center gap-0.5 cursor-pointer">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${location === '/' ? 'bg-[#E3B581]/15 text-[#E3B581]' : 'text-[#C9BBA9] hover:text-white'}`}>
                <House className="h-3.5 w-3.5" />
              </span>
              <span className={`text-[8px] font-semibold ${location === '/' ? 'text-[#E3B581]' : 'text-[#C9BBA9]'}`}>Home</span>
            </Link>

            <button onClick={handleFeaturesClick} className="flex flex-col items-center gap-0.5 cursor-pointer">
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-[#C9BBA9] hover:text-white transition-all">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <span className="text-[8px] font-semibold text-[#C9BBA9]">Features</span>
            </button>

            <Link href="/book-demo" className="flex flex-col items-center gap-0.5 -mt-3 cursor-pointer">
              <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E3B581] to-[#8B4513] text-white flex items-center justify-center shadow-[0_6px_18px_-4px_rgba(227,181,129,0.55)]">
                <CalendarCheck className="h-4 w-4" />
              </span>
              <span className="text-[8px] font-bold text-[#E3B581]">Demo</span>
            </Link>

            <Link href="/contact" className="flex flex-col items-center gap-0.5 cursor-pointer">
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-[#C9BBA9] hover:text-white transition-all">
                <Mail className="h-3.5 w-3.5" />
              </span>
              <span className="text-[8px] font-semibold text-[#C9BBA9]">Contact</span>
            </Link>

            <button onClick={() => setIsMobileMenuOpen(v => !v)} className="flex flex-col items-center gap-0.5 cursor-pointer">
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-[#C9BBA9] hover:text-white transition-all">
                {isMobileMenuOpen ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
              </span>
              <span className="text-[8px] font-semibold text-[#C9BBA9]">Menu</span>
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} transition={{ duration: 0.25 }}
              className="order-1 mb-2 bg-[#241D15] lg:hidden rounded-3xl border border-[#3D2810] shadow-2xl overflow-hidden w-full max-w-md">
              <div className="space-y-1 px-4 pb-6 pt-3">
                {navItems.map((item, i) => (
                  <motion.div key={item.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    {item.isAnchor ? (
                      <button onClick={item.onClick} className="block w-full text-left rounded-xl px-4 py-3 text-base font-medium text-[#E8E0D4] hover:bg-[#2A2119] hover:text-white transition-all">
                        {item.label}
                      </button>
                    ) : (
                      <Link href={item.href}>
                        <span className={`block rounded-xl px-4 py-3 text-base font-medium transition-all cursor-pointer ${location === item.href ? 'bg-[#2A2119] text-[#E3B581] border border-[#3D2810]' : 'text-[#E8E0D4] hover:bg-[#2A2119] hover:text-white'}`}>
                          {item.label}
                        </span>
                      </Link>
                    )}
                    {i === 0 && (
                      <div className="pl-4 mt-1 space-y-0.5">
                        {productColumns.flatMap(c => c.items).map((it) => (
                          <span 
                            key={it.label}
                            onClick={(e) => {
                              e.preventDefault()
                              setIsMobileMenuOpen(false)
                              const targetAnchor = it.label.toLowerCase().replace(/\s+/g, '-')
                              if (location === '/') {
                                scrollToSection(targetAnchor)
                              } else {
                                navigate('/')
                                setTimeout(() => scrollToSection(targetAnchor), 400)
                              }
                            }}
                            className="block rounded-lg px-4 py-2 text-sm text-[#C9BBA9] hover:text-white hover:bg-[#2A2119] transition-colors cursor-pointer"
                          >
                            {it.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
                {user ? (
                  <>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: navItems.length * 0.05 }}>
                      <div className="flex items-center gap-3 px-4 py-3 border border-[#3D2810] rounded-xl mb-1">
                        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                          {user.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                          <p className="text-xs text-[#C9BBA9] truncate">{user.email}</p>
                        </div>
                      </div>
                    </motion.div>
                    {user.role === 'admin' && (
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (navItems.length + 1) * 0.05 }}>
                        <Link href="/admin">
                          <span onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 rounded-xl px-4 py-3 text-base font-medium text-[#E3B581] hover:bg-[#2A2119] transition-all cursor-pointer border border-[#3D2810] mb-1">
                            <Shield className="h-4 w-4" />
                            Admin Dashboard
                          </span>
                        </Link>
                      </motion.div>
                    )}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (navItems.length + 2) * 0.05 }}>
                      <button onClick={() => { setIsMobileMenuOpen(false); void logout().then(() => navigate('/')) }}
                        className="flex items-center gap-2 w-full rounded-xl px-4 py-3 text-base font-medium text-[#E8E0D4] hover:bg-[#2A2119] hover:text-white transition-all">
                        <LogOut className="h-4 w-4 text-red-400" />
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: navItems.length * 0.05 }}>
                    <Link href="/login">
                      <span className="flex items-center gap-2 rounded-xl px-4 py-3 text-base font-medium text-[#E8E0D4] hover:bg-[#2A2119] hover:text-white transition-all cursor-pointer border border-[#3D2810] mb-2">
                        <LogIn className="h-4 w-4 text-[#E3B581]" />
                        Sign In
                      </span>
                    </Link>
                  </motion.div>
                )}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (navItems.length + 3) * 0.05 }} className="pt-1">
                  <Link href="/book-demo">
                    <span className="block bg-[#F5F0E8] text-[#1A1410] font-bold px-4 py-3 rounded-xl text-center cursor-pointer">Get Started →</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    )
  }
  