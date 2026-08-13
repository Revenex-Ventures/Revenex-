import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight, User, Phone, Building2, AlertCircle, CheckCircle2, UserPlus } from 'lucide-react'
import GoogleSignInButton from '@/components/GoogleSignInButton'
import { useAuth } from '@/lib/auth-context'
import OrbitalHero from '@/components/OrbitalHero3D'

export default function Signup() {
  const [, navigate] = useLocation()
  const { login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', phone: '', school: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState<Partial<typeof form & { general: string }>>({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [googleName, setGoogleName] = useState('')

  const validate = () => {
    const e: typeof errors = {}
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Full name required (min 2 chars)'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
    if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = 'Valid 10-digit Indian mobile required'
    if (!form.school.trim()) e.school = 'Institution name required'
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const passwordStrength = () => {
    const p = form.password
    if (!p) return null
    if (p.length >= 12 && /[A-Z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p)) return { label: 'Strong', color: 'bg-green-500', width: 'w-full' }
    if (p.length >= 8 && (/[A-Z]/.test(p) || /[0-9]/.test(p))) return { label: 'Good', color: 'bg-amber-500', width: 'w-2/3' }
    return { label: 'Weak', color: 'bg-red-500', width: 'w-1/3' }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({}); setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, school: form.school, password: form.password }),
      })
      const data = await res.json() as { token?: string; user?: { id: number; name: string; email: string; role?: string }; message?: string }
      if (!res.ok) {
        setLoading(false)
        if (res.status === 409) setErrors({ email: data.message ?? 'An account with this email already exists.' })
        else setErrors({ general: data.message ?? 'Something went wrong.' } as typeof errors)
        return
      }
      login(data.token ?? '', { id: data.user?.id ?? 0, name: data.user?.name ?? form.name, email: data.user?.email ?? form.email, role: data.user?.role ?? 'user' })
      setLoading(false); setGoogleName(data.user?.name ?? form.name); setDone(true)
      setTimeout(() => navigate('/'), 2500)
    } catch { setLoading(false); setErrors({ general: 'Connection error. Please try again.' } as typeof errors) }
  }

  const handleGoogleSuccess = async (email: string, name: string, googleId: string) => {
    try {
      const res = await fetch('/api/auth/google', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, name, googleId }) })
      const data = await res.json() as { token?: string; user?: { id: number; name: string; email: string; role?: string }; message?: string }
      if (!res.ok) { setErrors({ general: data.message ?? 'Google sign-up failed.' } as typeof errors); return }
      login(data.token ?? '', { id: data.user?.id ?? 0, name: data.user?.name ?? name, email: data.user?.email ?? email, role: data.user?.role ?? 'user' })
      setGoogleName(data.user?.name ?? name); setDone(true)
      setTimeout(() => navigate('/'), 2500)
    } catch { setErrors({ general: 'Google sign-up failed. Please try again.' } as typeof errors) }
  }

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: undefined }))
  }

  const inputClass = (err?: string) =>
    `w-full rounded-xl border ${err ? 'border-red-500/50 bg-red-500/5 focus:ring-red-500/10 focus:border-red-500' : 'border-[#E8E0D4] bg-[#FCFAF7] focus:border-[#7C3D0F] focus:ring-[#7C3D0F]/10'} pl-11 pr-4 py-2.5 text-[#1A1410] placeholder-[#9C8E83] outline-none focus:ring-4 transition-all text-sm font-medium`

  if (done) return (
    <main className="min-h-screen flex items-center justify-center bg-[#F5F0E8] px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
        <div className="w-20 h-20 gradient-bg rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#1A1410]/20">
          <CheckCircle2 className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-2xl font-black text-[#1A1410] mb-2">Welcome, {googleName.split(' ')[0]}!</h1>
        <p className="text-[#3D3128] text-sm mb-2 font-medium">Your account has been created successfully.</p>
        <p className="text-[#6B5D52] text-xs font-semibold">Redirecting you home...</p>
      </motion.div>
    </main>
  )

  const strength = passwordStrength()

  return (
    <main className="h-screen flex flex-col lg:flex-row bg-gradient-to-br from-[#F5F0E8] via-[#EDE5D8] to-[#E3D8C6] overflow-hidden relative">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#8B4513]/3 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-[#7C3D0F]/3 rounded-full blur-[120px] pointer-events-none" />

      {/* Left Column: Form Section */}
      <div className="w-full lg:w-[50%] xl:w-[45%] flex flex-col justify-between p-6 lg:p-8 xl:p-12 h-screen relative z-10 bg-transparent border-r border-[#E8E0D4]/30 overflow-y-auto">
        {/* Upper section: Logo */}
        <div className="flex justify-between items-center mb-4 lg:mb-0">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tight transition-all duration-300 group-hover:opacity-90">
              <span className="text-[#1A1410]">REVEN</span><span className="text-aqua">EX</span>
            </span>
          </Link>
        </div>

        {/* Middle section: Sign-up card (centered) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          className="w-full max-w-xl mx-auto my-auto py-2"
        >
          <div className="glass-card animated-border rounded-3xl overflow-hidden shadow-xl shadow-[#8B4513]/5">
            <div className="h-1.5 w-full gradient-bg" />
            <div className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="mx-auto mb-3 w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center shadow-md shadow-[#1A1410]/20">
                  <UserPlus className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#1A1410] tracking-tight mb-1">Create Account</h1>
                <p className="text-sm text-[#6B5D52] font-medium">Join REVENEX — India's School ERP Platform</p>
              </div>

              {(errors as { general?: string }).general && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 mb-4">
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                  <p className="text-sm text-red-700 font-medium">{(errors as { general?: string }).general}</p>
                </motion.div>
              )}

              <GoogleSignInButton mode="signup" onSuccess={handleGoogleSuccess} onError={(msg) => setErrors({ general: msg } as typeof errors)} />

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E8E0D4]" /></div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-[#FCFAF7] text-[#6B5D52] font-semibold tracking-wider uppercase">or sign up with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-bold text-[#3D3128] mb-1.5 tracking-wide">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B5D52] group-focus-within:text-[#7C3D0F] transition-colors" />
                      <input type="text" placeholder="Your full name" required autoComplete="name"
                        value={form.name} onChange={set('name')}
                        className={inputClass(errors.name)} />
                    </div>
                    {errors.name && <p className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium"><AlertCircle className="h-3 w-3" />{errors.name}</p>}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-sm font-bold text-[#3D3128] mb-1.5 tracking-wide">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B5D52] group-focus-within:text-[#7C3D0F] transition-colors" />
                      <input type="email" placeholder="your@email.com" required autoComplete="email"
                        value={form.email} onChange={set('email')}
                        className={inputClass(errors.email)} />
                    </div>
                    {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium"><AlertCircle className="h-3 w-3" />{errors.email}</p>}
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-sm font-bold text-[#3D3128] mb-1.5 tracking-wide">Mobile Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B5D52] group-focus-within:text-[#7C3D0F] transition-colors" />
                      <input type="tel" placeholder="9XXXXXXXXX" required autoComplete="tel"
                        value={form.phone} onChange={set('phone')}
                        className={inputClass(errors.phone)} />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium"><AlertCircle className="h-3 w-3" />{errors.phone}</p>}
                  </div>

                  {/* School / Institution */}
                  <div>
                    <label className="block text-sm font-bold text-[#3D3128] mb-1.5 tracking-wide">School / Institution</label>
                    <div className="relative group">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B5D52] group-focus-within:text-[#7C3D0F] transition-colors" />
                      <input type="text" placeholder="Name of institution" required autoComplete="organization"
                        value={form.school} onChange={set('school')}
                        className={inputClass(errors.school)} />
                    </div>
                    {errors.school && <p className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium"><AlertCircle className="h-3 w-3" />{errors.school}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-bold text-[#3D3128] mb-1.5 tracking-wide">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B5D52] group-focus-within:text-[#7C3D0F] transition-colors" />
                      <input type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters" required autoComplete="new-password" value={form.password}
                        onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: undefined })) }}
                        className={`${inputClass(errors.password)} pr-12`} />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B5D52] hover:text-[#3D3128] transition-colors">
                        {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {strength && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[#E8E0D4] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                        </div>
                        <span className="text-xs font-semibold text-[#6B5D52]">{strength.label}</span>
                      </div>
                    )}
                    {errors.password && <p className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium"><AlertCircle className="h-3 w-3" />{errors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-bold text-[#3D3128] mb-1.5 tracking-wide">Confirm Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B5D52] group-focus-within:text-[#7C3D0F] transition-colors" />
                      <input type={showConfirm ? 'text' : 'password'} placeholder="Re-enter password" required autoComplete="new-password" value={form.confirm}
                        onChange={e => { setForm(f => ({ ...f, confirm: e.target.value })); setErrors(er => ({ ...er, confirm: undefined })) }}
                        className={`${inputClass(errors.confirm)} pr-12`} />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B5D52] hover:text-[#3D3128] transition-colors">
                        {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.confirm && <p className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium"><AlertCircle className="h-3 w-3" />{errors.confirm}</p>}
                  </div>
                </div>

                <motion.button type="submit" disabled={loading} whileHover={!loading ? { scale: 1.01, translateY: -1 } : {}} whileTap={!loading ? { scale: 0.99 } : {}}
                  className="w-full gradient-bg text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2 shadow-md shadow-[#1A1410]/20 hover:shadow-[#1A1410]/35 transition-all duration-300">
                  {loading ? (
                    <><motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} />Creating Account...</>
                  ) : (<>Create Account<ArrowRight className="h-4 w-4" /></>)}
                </motion.button>
              </form>

              <div className="mt-6 pt-5 border-t border-[#E8E0D4] text-center">
                <p className="text-sm text-[#6B5D52] font-medium">Already have an account?{' '}
                  <Link href="/login"><span className="text-[#7C3D0F] font-bold hover:underline cursor-pointer">Sign in</span></Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lower section: Footer link */}
        <div className="text-center">
          <Link href="/"><span className="text-xs text-[#6B5D52] font-semibold hover:text-[#1A1410] transition-colors cursor-pointer">← Back to home</span></Link>
        </div>
      </div>

      {/* Right Column: 3D Orbital Model Visual */}
      <div className="hidden lg:flex lg:w-[50%] xl:w-[55%] flex-col items-center justify-center h-screen relative overflow-hidden bg-transparent border-l border-[#E8E0D4]/30">
        <div className="absolute inset-0 opacity-[0.02] noise-overlay" />
        
        {/* Subtle background graphics/glows */}
        <div className="absolute top-1/10 right-1/10 w-[500px] h-[500px] bg-[#8B4513]/4 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-1/10 left-1/10 w-[400px] h-[400px] bg-[#7C3D0F]/4 rounded-full blur-[140px] pointer-events-none" />

        {/* orbital component */}
        <div className="w-full max-w-[640px] transform scale-85 xl:scale-95 transition-transform duration-500">
          <OrbitalHero />
        </div>
      </div>
    </main>
  )
}