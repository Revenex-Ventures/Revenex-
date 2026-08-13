import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight, LogIn, AlertCircle, X, CheckCircle2 } from 'lucide-react'
import GoogleSignInButton from '@/components/GoogleSignInButton'
import { useAuth } from '@/lib/auth-context'
import OrbitalHero from '@/components/OrbitalHero3D'

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
    `w-full rounded-xl border ${err ? 'border-red-500/50 bg-red-500/5 focus:ring-red-500/10 focus:border-red-500' : 'border-[#E8E0D4] bg-[#FCFAF7] focus:border-[#7C3D0F] focus:ring-[#7C3D0F]/10'} pl-11 pr-4 py-2.5 text-[#1A1410] placeholder-[#9C8E83] outline-none focus:ring-4 transition-all text-sm font-medium`

  return (
    <main className="h-screen flex flex-col lg:flex-row bg-[#F5F0E8] overflow-hidden relative">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#8B4513]/3 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-[#7C3D0F]/3 rounded-full blur-[120px] pointer-events-none" />

      {/* Left Column: Form Section */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-between p-6 lg:p-8 xl:p-12 h-screen relative z-10 bg-white/40 backdrop-blur-md border-r border-[#E8E0D4]/30 overflow-y-auto">
        {/* Upper section: Logo */}
        <div className="flex justify-between items-center mb-4 lg:mb-0">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tight transition-all duration-300 group-hover:opacity-90">
              <span className="text-[#1A1410]">REVEN</span><span className="text-aqua">EX</span>
            </span>
          </Link>
        </div>

        {/* Middle section: Sign-in card (centered) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          className="w-full max-w-md mx-auto my-auto py-2"
        >
          <div className="glass-card animated-border rounded-3xl overflow-hidden shadow-xl shadow-[#8B4513]/5">
            <div className="h-1.5 w-full gradient-bg" />
            <div className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="mx-auto mb-3 w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center shadow-md shadow-[#1A1410]/20">
                  <LogIn className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-black text-[#1A1410] tracking-tight mb-1">Welcome Back</h1>
                <p className="text-sm text-[#6B5D52] font-medium">Sign in to your REVENEX account</p>
              </div>

              {errors.general && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 mb-4">
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                  <p className="text-sm text-red-700 font-medium">{errors.general}</p>
                </motion.div>
              )}

              <GoogleSignInButton mode="signin" onSuccess={handleGoogleSuccess} onError={(msg) => setErrors({ general: msg })} />

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E8E0D4]" /></div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-[#FCFAF7] text-[#6B5D52] font-semibold tracking-wider uppercase">or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#3D3128] mb-1.5 tracking-wide">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B5D52] group-focus-within:text-[#7C3D0F] transition-colors" />
                    <input type="email" placeholder="your@email.com" required autoComplete="email" value={form.email}
                      onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: undefined, general: undefined })) }}
                      className={inputClass(errors.email)} />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium"><AlertCircle className="h-3 w-3" />{errors.email}</p>}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-sm font-bold text-[#3D3128] tracking-wide">Password</label>
                    <button type="button" onClick={() => { setShowForgot(true); setForgotSuccess(false); setForgotError(''); setForgotEmail('') }} className="text-xs font-bold text-[#7C3D0F] hover:underline transition-all">Forgot password?</button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B5D52] group-focus-within:text-[#7C3D0F] transition-colors" />
                    <input type={showPass ? 'text' : 'password'} placeholder="••••••••" required autoComplete="current-password" value={form.password}
                      onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: undefined, general: undefined })) }}
                      className={`${inputClass(errors.password)} pr-12`} />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B5D52] hover:text-[#3D3128] transition-colors">
                      {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium"><AlertCircle className="h-3 w-3" />{errors.password}</p>}
                </div>

                <motion.button type="submit" disabled={loading} whileHover={!loading ? { scale: 1.01, translateY: -1 } : {}} whileTap={!loading ? { scale: 0.99 } : {}}
                  className="w-full gradient-bg text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2 shadow-md shadow-[#1A1410]/20 hover:shadow-[#1A1410]/35 transition-all duration-300">
                  {loading ? (
                    <><motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} />Signing in...</>
                  ) : (<>Sign In <ArrowRight className="h-4 w-4" /></>)}
                </motion.button>
              </form>

              <div className="mt-6 pt-5 border-t border-[#E8E0D4] text-center">
                <p className="text-sm text-[#6B5D52] font-medium">Don't have an account?{' '}
                  <Link href="/signup"><span className="text-[#7C3D0F] font-bold hover:underline cursor-pointer">Create one</span></Link>
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
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] flex-col items-center justify-center h-screen relative overflow-hidden bg-gradient-to-br from-[#F5F0E8] via-[#EDE5D8] to-[#E3D8C6] border-l border-[#E8E0D4]/30">
        <div className="absolute inset-0 opacity-[0.02] noise-overlay" />
        
        {/* Subtle background graphics/glows */}
        <div className="absolute top-1/10 right-1/10 w-[500px] h-[500px] bg-[#8B4513]/4 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-1/10 left-1/10 w-[400px] h-[400px] bg-[#7C3D0F]/4 rounded-full blur-[140px] pointer-events-none" />

        {/* orbital component */}
        <div className="w-full max-w-[640px] transform scale-85 xl:scale-95 transition-transform duration-500">
          <OrbitalHero />
        </div>
      </div>

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
                    <h2 className="text-lg font-bold text-[#1A1410]">Reset Password</h2>
                    <p className="text-xs text-[#6B5D52] mt-1">We'll send a reset link to your email</p>
                  </div>
                  <button onClick={() => setShowForgot(false)} className="text-[#6B5D52] hover:text-[#1A1410] transition-colors"><X className="h-5 w-5" /></button>
                </div>
                {forgotSuccess ? (
                  <div className="flex flex-col items-center gap-4 py-4 text-center">
                    <CheckCircle2 className="h-12 w-12 text-[#7C3D0F]" />
                    <p className="text-[#1A1410] font-semibold">Reset link sent!</p>
                    <p className="text-sm text-[#3D3128]">Check your inbox and click the link to reset your password. The link expires in 1 hour.</p>
                    <button onClick={() => setShowForgot(false)} className="text-xs text-[#7C3D0F] hover:underline mt-2">Close</button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#3D3128] mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B5D52]" />
                        <input type="email" placeholder="your@email.com" value={forgotEmail}
                          onChange={e => { setForgotEmail(e.target.value); setForgotError('') }}
                          className="w-full rounded-xl border border-[#E8E0D4] bg-[#FCFAF7] pl-10 pr-4 py-3.5 text-[#1A1410] placeholder-[#6B5D52] outline-none focus:border-[#7C3D0F] focus:ring-4 focus:ring-[#7C3D0F]/10 transition-all text-sm" />
                      </div>
                      {forgotError && <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{forgotError}</p>}
                    </div>
                    <motion.button type="submit" disabled={forgotLoading} whileHover={!forgotLoading ? { scale: 1.02 } : {}} whileTap={!forgotLoading ? { scale: 0.98 } : {}}
                      className="w-full gradient-bg text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm disabled:opacity-60">
                      {forgotLoading ? (
                        <><motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} />Sending...</>
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