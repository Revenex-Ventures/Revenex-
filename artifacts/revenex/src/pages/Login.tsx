import { useState } from 'react'
  import { Link, useLocation } from 'wouter'
  import { motion, AnimatePresence } from 'framer-motion'
  import { Eye, EyeOff, Mail, Lock, ArrowRight, LogIn, AlertCircle, X, CheckCircle2 } from 'lucide-react'
  import GoogleSignInButton from '@/components/GoogleSignInButton'
  import { useAuth } from '@/lib/auth-context'

  export default function Login() {
    const [, navigate] = useLocation()
    const { login } = useAuth()
    const [form, setForm] = useState({ email: '', password: '' })
    const [showPass, setShowPass] = useState(false)
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})
    const [loading, setLoading] = useState(false)
    const [showForgot, setShowForgot] = useState(false)
    const [forgotEmail, setForgotEmail] = useState('')
    const [forgotLoading, setForgotLoading] = useState(false)
    const [forgotSuccess, setForgotSuccess] = useState(false)
    const [forgotError, setForgotError] = useState('')

    const handleForgotPassword = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!forgotEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) { setForgotError('Please enter a valid email address'); return }
      setForgotError(''); setForgotLoading(true)
      try {
        await fetch('/api/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: forgotEmail }) })
        setForgotSuccess(true)
      } catch { setForgotError('Connection error. Please try again.') }
      finally { setForgotLoading(false) }
    }

    const validate = () => {
      const e: typeof errors = {}
      if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Please enter a valid email'
      if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
      return e
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      const errs = validate()
      if (Object.keys(errs).length > 0) { setErrors(errs); return }
      setErrors({}); setLoading(true)
      try {
        const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.email, password: form.password }) })
        const data = await res.json() as { token?: string; user?: { id: number; name: string; email: string; role?: string }; message?: string }
        if (!res.ok) { setErrors({ general: data.message ?? 'Invalid email or password.' }); setLoading(false); return }
        login(data.token ?? '', { id: data.user?.id ?? 0, name: data.user?.name ?? '', email: data.user?.email ?? '', role: data.user?.role ?? 'user' })
        navigate(data.user?.role === 'admin' ? '/admin' : '/')
      } catch { setErrors({ general: 'Connection error. Please try again.' }); setLoading(false) }
    }

    const handleGoogleSuccess = async (email: string, name: string, googleId: string) => {
      try {
        const res = await fetch('/api/auth/google', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, name, googleId }) })
        const data = await res.json() as { token?: string; user?: { id: number; name: string; email: string; role?: string }; message?: string }
        if (!res.ok) { setErrors({ general: data.message ?? 'Google sign-in failed.' }); return }
        login(data.token ?? '', { id: data.user?.id ?? 0, name: data.user?.name ?? '', email: data.user?.email ?? '', role: data.user?.role ?? 'user' })
        navigate(data.user?.role === 'admin' ? '/admin' : '/')
      } catch { setErrors({ general: 'Google sign-in failed. Please try again.' }) }
    }

    const inputClass = (err?: string) =>
      `w-full rounded-xl border ${err ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 bg-white/5'} pl-10 pr-4 py-3.5 text-white placeholder-white/25 outline-none focus:border-aqua/50 transition-all text-sm`

    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden">
        <div className="absolute inset-0 hero-glow pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#7C4DFF]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#00E5C3]/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <Link href="/" className="flex justify-center mb-8">
            <span className="text-2xl font-black"><span className="text-white">REVEN</span><span className="text-aqua">EX</span></span>
          </Link>

          <div className="glass-card animated-border rounded-3xl overflow-hidden">
            <div className="h-1 w-full gradient-bg" />
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="mx-auto mb-4 w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center">
                  <LogIn className="h-7 w-7 text-black" />
                </div>
                <h1 className="text-2xl font-black text-white mb-1">Welcome back</h1>
                <p className="text-sm text-white/40">Sign in to your REVENEX account</p>
              </div>

              {errors.general && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6">
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                  <p className="text-sm text-red-400">{errors.general}</p>
                </motion.div>
              )}

              <GoogleSignInButton mode="signin" onSuccess={handleGoogleSuccess} onError={(msg) => setErrors({ general: msg })} />

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/8" /></div>
                <div className="relative flex justify-center text-xs"><span className="px-3 bg-transparent text-white/25 font-medium">or continue with email</span></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                    <input type="email" placeholder="your@email.com" required autoComplete="email" value={form.email}
                      onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: undefined, general: undefined })) }}
                      className={inputClass(errors.email)} />
                  </div>
                  {errors.email && <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.email}</p>}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-white/60">Password</label>
                    <button type="button" onClick={() => { setShowForgot(true); setForgotSuccess(false); setForgotError(''); setForgotEmail('') }} className="text-xs text-aqua hover:underline">Forgot password?</button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                    <input type={showPass ? 'text' : 'password'} placeholder="••••••••" required autoComplete="current-password" value={form.password}
                      onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: undefined, general: undefined })) }}
                      className={`${inputClass(errors.password)} pr-12`} />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.password}</p>}
                </div>

                <motion.button type="submit" disabled={loading} whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 30px rgba(0,229,195,0.3)' } : {}} whileTap={!loading ? { scale: 0.98 } : {}}
                  className="w-full gradient-bg text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2">
                  {loading ? (
                    <><motion.div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} />Signing in...</>
                  ) : (<>Sign In<ArrowRight className="h-4 w-4" /></>)}
                </motion.button>
              </form>

              <div className="mt-6 pt-6 border-t border-white/5 text-center">
                <p className="text-sm text-white/40">Don't have an account?{' '}
                  <Link href="/signup"><span className="text-aqua font-semibold hover:underline cursor-pointer">Create one</span></Link>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/"><span className="text-xs text-white/30 hover:text-white/60 transition-colors cursor-pointer">← Back to home</span></Link>
          </div>
        </motion.div>

        <AnimatePresence>
          {showForgot && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
              style={{ background: 'rgba(5,8,22,0.85)', backdropFilter: 'blur(8px)' }}>
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-sm glass-card rounded-3xl overflow-hidden">
                <div className="h-1 w-full gradient-bg" />
                <div className="p-7">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-white">Reset Password</h2>
                      <p className="text-xs text-white/40 mt-1">We'll send a reset link to your email</p>
                    </div>
                    <button onClick={() => setShowForgot(false)} className="text-white/30 hover:text-white/70 transition-colors"><X className="h-5 w-5" /></button>
                  </div>
                  {forgotSuccess ? (
                    <div className="flex flex-col items-center gap-4 py-4 text-center">
                      <CheckCircle2 className="h-12 w-12 text-aqua" />
                      <p className="text-white font-semibold">Reset link sent!</p>
                      <p className="text-sm text-white/50">Check your inbox and click the link to reset your password. The link expires in 1 hour.</p>
                      <button onClick={() => setShowForgot(false)} className="text-xs text-aqua hover:underline mt-2">Close</button>
                    </div>
                  ) : (
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                          <input type="email" placeholder="your@email.com" value={forgotEmail}
                            onChange={e => { setForgotEmail(e.target.value); setForgotError('') }}
                            className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3.5 text-white placeholder-white/25 outline-none focus:border-aqua/50 transition-all text-sm" />
                        </div>
                        {forgotError && <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{forgotError}</p>}
                      </div>
                      <motion.button type="submit" disabled={forgotLoading} whileHover={!forgotLoading ? { scale: 1.02 } : {}} whileTap={!forgotLoading ? { scale: 0.98 } : {}}
                        className="w-full gradient-bg text-black font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm disabled:opacity-60">
                        {forgotLoading ? (
                          <><motion.div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} />Sending...</>
                        ) : 'Send Reset Link'}
                      </motion.button>
                    </form>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    )
  }
  