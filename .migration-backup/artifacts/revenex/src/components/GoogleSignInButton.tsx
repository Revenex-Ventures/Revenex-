import { useState } from 'react'
import { motion } from 'framer-motion'
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google'
import { AlertCircle, ExternalLink, Settings } from 'lucide-react'

const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ?? ''

interface Props {
  onSuccess: (email: string, name: string, googleId: string) => void
  onError: (msg: string) => void
  mode?: 'signin' | 'signup'
}

function GoogleIcon() {
  return (
    <svg width='18' height='18' viewBox='0 0 24 24' aria-hidden='true'>
      <path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' fill='#4285F4'/>
      <path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' fill='#34A853'/>
      <path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z' fill='#FBBC05'/>
      <path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' fill='#EA4335'/>
    </svg>
  )
}

function GoogleButton({ onSuccess, onError, mode = 'signin' }: Props) {
  const [loading, setLoading] = useState(false)
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true)
      try {
        const u = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(r => r.json()) as { email?: string; name?: string; sub?: string }
        onSuccess(u.email ?? '', u.name ?? '', u.sub ?? '')
      } catch { onError('Google sign-in failed. Please try again.') }
      finally { setLoading(false) }
    },
    onError: (err) => {
      const s = JSON.stringify(err ?? {}).toLowerCase()
      const isOrigin = s.includes('origin') || s.includes('not_allowed') || s.includes('idpiframe') || s.includes('disallowed_useragent')
      onError(isOrigin ? 'ORIGIN_MISMATCH' : 'Google sign-in was cancelled.')
    },
    onNonOAuthError: (err) => {
      const s = JSON.stringify(err ?? {}).toLowerCase()
      if (s.includes('popup_closed') || s.includes('popup_failed')) onError('Sign-in window was closed. Please try again.')
      else onError('ORIGIN_MISMATCH')
    },
  })
  return (
    <motion.button type='button' disabled={loading} onClick={() => login()}
      whileHover={!loading ? { scale: 1.01 } : {}} whileTap={!loading ? { scale: 0.99 } : {}}
      className='w-full flex items-center justify-center gap-3 border border-white/10 bg-white/5 text-white/80 font-semibold py-3.5 rounded-2xl hover:bg-white/8 hover:border-white/20 transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed'>
      {loading ? (<><motion.div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full' animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} />{mode === 'signin' ? 'Signing in...' : 'Creating account...'}</>) : (<><GoogleIcon />{mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}</>)}
    </motion.button>
  )
}

function OriginMismatchHelp() {
  const origin = window.location.origin
  return (
    <div className='rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-3'>
      <div className='flex items-center gap-2 font-semibold text-amber-300 text-sm'><AlertCircle className='h-4 w-4 flex-shrink-0' />One-time Google setup required</div>
      <ol className='text-xs text-amber-200/80 space-y-1.5 list-decimal list-inside leading-relaxed'>
        <li>Open <a href='https://console.cloud.google.com/apis/credentials' target='_blank' rel='noopener noreferrer' className='text-amber-300 underline underline-offset-2 inline-flex items-center gap-0.5'>Google Cloud Console <ExternalLink className='h-3 w-3' /></a></li>
        <li>Click your OAuth 2.0 Client ID</li>
        <li>Under <strong>Authorized JavaScript origins</strong> click <strong>+ ADD URI</strong></li>
        <li>Paste exactly: <code className='bg-amber-500/20 px-1.5 py-0.5 rounded font-mono text-amber-200 select-all'>{origin}</code></li>
        <li>Click <strong>SAVE</strong> and wait 5 minutes, then refresh</li>
      </ol>
      <p className='text-amber-200/50 text-xs'>Email/password sign-in works right now.</p>
    </div>
  )
}

function NotConfigured({ mode }: { mode: 'signin' | 'signup' }) {
  return (
    <div className='w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-white/8 bg-white/3 text-white/25 text-sm cursor-not-allowed select-none'>
      <Settings className='h-4 w-4' />
      {mode === 'signin' ? 'Google sign-in' : 'Google sign-up'} — see GOOGLE-OAUTH-SETUP.md to enable
    </div>
  )
}

export default function GoogleSignInButton({ onSuccess, onError: parentOnError, mode = 'signin' }: Props) {
  const [showHelp, setShowHelp] = useState(false)
  if (!GOOGLE_CLIENT_ID) return <NotConfigured mode={mode} />
  const handleError = (msg: string) => {
    if (msg === 'ORIGIN_MISMATCH') setShowHelp(true)
    else parentOnError(msg)
  }
  return (
    <div className='space-y-3'>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <GoogleButton onSuccess={onSuccess} onError={handleError} mode={mode} />
      </GoogleOAuthProvider>
      {showHelp && <OriginMismatchHelp />}
    </div>
  )
}
