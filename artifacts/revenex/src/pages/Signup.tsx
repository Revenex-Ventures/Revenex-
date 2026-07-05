import { useState } from 'react'
  import { Link, useLocation } from 'wouter'
  import { motion } from 'framer-motion'
  import { Eye, EyeOff, Mail, Lock, ArrowRight, User, Phone, Building2, AlertCircle, CheckCircle2, UserPlus } from 'lucide-react'
  import GoogleSignInButton from '@/components/GoogleSignInButton'
  import { useAuth } from '@/lib/auth-context'

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
      if (p.length >= 12 && /[A-Z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p)) return { label: 'Strong', color: 'bg-green-400', width: 'w-full' }
      if (p.length >= 8 && (/[A-Z]/.test(p) || /[0-9]/.test(p))) return { label: 'Good', color: 'bg-yellow-400', width: 'w-2/3' }
      return { label: 'Weak', color: 'bg-red-400', width: 'w-1/3' }
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
      `w-full rounded-xl border ${err ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 bg-white/5'} pl-10 pr-4 py-3.5 text-white placeholder-white/25 outline-none focus:border-aqua/50 transition-all text-sm`

    if (done) return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
          <div className="w-20 h-20 gradient-bg rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-black" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Welcome, {googleName.split(' ')[0]}!</h1>
          <p className="text-white/50 text-sm mb-2">Your account has been created successfully.</p>
          <p className="text-white/30 text-xs">Redirecting you home...</p>
        </motion.div>
      </main>
    )

    const strength = passwordStrength()
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden">
        <div className="absolute inset-0 hero-glow pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <Link href="/" className="flex justify-center mb-8">
            <span className="text-2xl font-black"><span className="text-white">REVEN</span><span className="text-aqua">EX</span></span>
          </Link>
          <div className="glass-card animated-border rounded-3xl overflow-hidden">
            <div className="h-1 w-full gradient-bg" />
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="mx-auto mb-4 w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center">
                  <UserPlus className="h-7 w-7 text-black" />
                </div>
                <h1 className="text-2xl font-black text-white mb-1">Create Account</h1>
                <p className="text-sm text-white/40">Join REVENEX — India's School ERP Platform</p>
              </div>
              {(errors as { general?: string }).general && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6">
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                  <p className="text-sm text-red-400">{(errors as { general?: string }).general}</p>
                </motion.div>
              )}
              <GoogleSignInButton mode="signup" onSuccess={handleGoogleSuccess} onError={(msg) => setErrors({ general: msg } as typeof errors)} />
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/8" /></div>
                <div className="relative flex justify-center text-xs"><span className="px-3 bg-transparent text-white/25 font-medium">or sign up with email</span></div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { key: 'name', label: 'Full Name', icon: User, placeholder: 'Your full name', type: 'text', autoComplete: 'name' },
                  { key: 'email', label: 'Email Address', icon: Mail, placeholder: 'your@email.com', type: 'email', autoComplete: 'email' },
                  { key: 'phone', label: 'Mobile Number', icon: Phone, placeholder: '9XXXXXXXXX (10 digits)', type: 'tel', autoComplete: 'tel' },
                  { key: 'school', label: 'School / Institution', icon: Building2, placeholder: 'Name of your institution', type: 'text', autoComplete: 'organization' },
                ].map(({ key, label, icon: Icon, placeholder, type, autoComplete }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-white/60 mb-2">{label}</label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                      <input type={type} placeholder={placeholder} required autoComplete={autoComplete}
                        value={form[key as keyof typeof form]} onChange={set(key as keyof typeof form)}
                        className={inputClass(errors[key as keyof typeof errors])} />
                    </div>
                    {errors[key as keyof typeof errors] && <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors[key as keyof typeof errors]}</p>}
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                    <input type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters" required autoComplete="new-password" value={form.password}
                      onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: undefined })) }}
                      className={`${inputClass(errors.password)} pr-12`} />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {strength && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                      </div>
                      <span className="text-xs text-white/40">{strength.label}</span>
                    </div>
                  )}
                  {errors.password && <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                    <input type={showConfirm ? 'text' : 'password'} placeholder="Re-enter password" required autoComplete="new-password" value={form.confirm}
                      onChange={e => { setForm(f => ({ ...f, confirm: e.target.value })); setErrors(er => ({ ...er, confirm: undefined })) }}
                      className={`${inputClass(errors.confirm)} pr-12`} />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60">
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirm && <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.confirm}</p>}
                </div>
                <motion.button type="submit" disabled={loading} whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 30px rgba(0,229,195,0.3)' } : {}} whileTap={!loading ? { scale: 0.98 } : {}}
                  className="w-full gradient-bg text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-sm disabled:opacity-60 mt-2">
                  {loading ? (
                    <><motion.div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} />Creating Account...</>
                  ) : (<>Create Account<ArrowRight className="h-4 w-4" /></>)}
                </motion.button>
              </form>
              <div className="mt-6 pt-6 border-t border-white/5 text-center">
                <p className="text-sm text-white/40">Already have an account?{' '}
                  <Link href="/login"><span className="text-aqua font-semibold hover:underline cursor-pointer">Sign in</span></Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    )
  }
  