import { useState, useEffect } from 'react'
  import { Link, useLocation } from 'wouter'
  import { motion } from 'framer-motion'
  import { Eye, EyeOff, Lock, ArrowRight, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react'

  export default function ResetPassword() {
    const [, navigate] = useLocation()
    const [token, setToken] = useState('')
    const [form, setForm] = useState({ password: '', confirm: '' })
    const [showPass, setShowPass] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
      const params = new URLSearchParams(window.location.search)
      const t = params.get('token')
      if (!t) {
        setError('Invalid or missing reset token. Please request a new password reset.')
      } else {
        setToken(t)
      }
    }, [])

    const validate = () => {
      if (form.password.length < 8) return 'Password must be at least 8 characters'
      if (form.password !== form.confirm) return 'Passwords do not match'
      return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      const err = validate()
      if (err) { setError(err); return }
      setError(''); setLoading(true)
      try {
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, password: form.password }),
        })
        const data = await res.json() as { message?: string }
        if (!res.ok) { setError(data.message ?? 'Password reset failed. The link may have expired.'); setLoading(false); return }
        setSuccess(true)
        setTimeout(() => navigate('/login'), 3000)
      } catch { setError('Connection error. Please try again.') }
      finally { setLoading(false) }
    }

    const passwordStrength = () => {
      const p = form.password
      if (!p) return null
      if (p.length >= 12 && /[A-Z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p)) return { label: 'Strong', color: 'bg-green-400', width: 'w-full' }
      if (p.length >= 8 && (/[A-Z]/.test(p) || /[0-9]/.test(p))) return { label: 'Good', color: 'bg-yellow-400', width: 'w-2/3' }
      return { label: 'Weak', color: 'bg-red-400', width: 'w-1/3' }
    }

    const inputClass = `w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-12 py-3.5 text-white placeholder-white/25 outline-none focus:border-aqua/50 transition-all text-sm`

    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden">
        <div className="absolute inset-0 hero-glow pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#7C4DFF]/5 rounded-full blur-[140px] pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <Link href="/" className="flex justify-center mb-8">
            <span className="text-2xl font-black"><span className="text-white">REVEN</span><span className="text-aqua">EX</span></span>
          </Link>

          <div className="glass-card animated-border rounded-3xl overflow-hidden">
            <div className="h-1 w-full gradient-bg" />
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="mx-auto mb-4 w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center">
                  <KeyRound className="h-7 w-7 text-black" />
                </div>
                <h1 className="text-2xl font-black text-white mb-1">Set New Password</h1>
                <p className="text-sm text-white/40">Enter your new password below</p>
              </div>

              {success ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                  <CheckCircle2 className="h-16 w-16 text-aqua mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-white mb-2">Password Updated!</h2>
                  <p className="text-white/50 text-sm mb-1">Your password has been reset successfully.</p>
                  <p className="text-white/30 text-xs">A confirmation email has been sent. Redirecting to sign in...</p>
                </motion.div>
              ) : (
                <>
                  {!token ? (
                    <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-4 mb-6">
                      <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-red-400 font-medium">Invalid Reset Link</p>
                        <p className="text-xs text-red-300/70 mt-1">{error}</p>
                        <Link href="/login"><span className="text-xs text-aqua hover:underline cursor-pointer mt-2 inline-block">← Back to Sign In</span></Link>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {error && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                          <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                          <p className="text-sm text-red-400">{error}</p>
                        </motion.div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                          <input type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters" required autoComplete="new-password"
                            value={form.password} onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setError('') }}
                            className={inputClass} />
                          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60">
                            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {passwordStrength() && (
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all ${passwordStrength()!.color} ${passwordStrength()!.width}`} />
                            </div>
                            <span className="text-xs text-white/40">{passwordStrength()!.label}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                          <input type={showConfirm ? 'text' : 'password'} placeholder="Re-enter password" required autoComplete="new-password"
                            value={form.confirm} onChange={e => { setForm(f => ({ ...f, confirm: e.target.value })); setError('') }}
                            className={inputClass} />
                          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60">
                            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <motion.button type="submit" disabled={loading} whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 30px rgba(0,229,195,0.3)' } : {}} whileTap={!loading ? { scale: 0.98 } : {}}
                        className="w-full gradient-bg text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2">
                        {loading ? (
                          <><motion.div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} />Updating password...</>
                        ) : (<>Update Password<ArrowRight className="h-4 w-4" /></>)}
                      </motion.button>

                      <p className="text-center text-xs text-white/30">
                        <Link href="/login"><span className="text-aqua/70 hover:text-aqua cursor-pointer hover:underline">← Back to Sign In</span></Link>
                      </p>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    )
  }
  