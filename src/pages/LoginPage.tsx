import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn, Mail, ArrowLeft } from 'lucide-react'
import { sendOtpEmail } from '@/lib/auth'
import { useSystem } from '@/contexts/SystemContext'

export function LoginPage() {
  const navigate = useNavigate()
  const { selectedSystem } = useSystem()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await sendOtpEmail(email.trim(), false)
      sessionStorage.setItem('otp_email', email.trim())
      sessionStorage.setItem('otp_mode', 'login')
      navigate('/verify-otp')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to systems
        </Link>
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-brand-500/20 p-3">
            <LogIn className="h-6 w-6 text-brand-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Sign in</h1>
            <p className="text-sm text-slate-400">
              {selectedSystem
                ? `Access your ${selectedSystem.toUpperCase()} workspace`
                : 'We will email you a one-time code'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="label">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                id="email"
                type="email"
                required
                className="input pl-10"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Sending code…' : 'Send verification code'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          No account?{' '}
          <Link to="/register" className="font-semibold text-brand-400 hover:text-brand-300">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
