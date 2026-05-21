import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyRound, RefreshCw } from 'lucide-react'
import { sendOtpEmail, upsertProfile, verifyOtp } from '@/lib/auth'
import { useAuth } from '@/contexts/AuthContext'
import { useSystem } from '@/contexts/SystemContext'

export function VerifyOtpPage() {
  const navigate = useNavigate()
  const { refreshProfile } = useAuth()
  const { selectedSystem } = useSystem()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('otp_email')
    const storedMode = sessionStorage.getItem('otp_mode')
    if (!storedEmail) {
      navigate('/login')
      return
    }
    setEmail(storedEmail)
    if (storedMode === 'register') setMode('register')
  }, [navigate])

  const redirectAfterAuth = () => {
    const target = selectedSystem ? `/${selectedSystem}` : '/'
    navigate(target, { replace: true })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await verifyOtp(email, code.trim())
      if (mode === 'register') {
        const fullName = sessionStorage.getItem('pending_full_name') ?? ''
        await upsertProfile(fullName, email)
        sessionStorage.removeItem('pending_full_name')
      }
      await refreshProfile()
      sessionStorage.removeItem('otp_email')
      sessionStorage.removeItem('otp_mode')
      redirectAfterAuth()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid or expired code')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setError('')
    try {
      await sendOtpEmail(email, mode === 'register')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not resend code')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-amber-500/20 p-3">
            <KeyRound className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Verify your email</h1>
            <p className="text-sm text-slate-400">
              Enter the 6-digit code sent to <span className="text-slate-200">{email}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="code" className="label">
              Verification code
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              maxLength={8}
              className="input text-center text-2xl tracking-[0.3em]"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Verifying…' : 'Verify and continue'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="mt-4 flex w-full items-center justify-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <RefreshCw className={`h-4 w-4 ${resending ? 'animate-spin' : ''}`} />
          Resend code
        </button>
      </div>
    </div>
  )
}
