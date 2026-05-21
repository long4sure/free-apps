import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, Mail, User, ArrowLeft } from 'lucide-react'
import { sendOtpEmail } from '@/lib/auth'
import { useSystem } from '@/contexts/SystemContext'

export function RegisterPage() {
  const navigate = useNavigate()
  const { selectedSystem } = useSystem()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      sessionStorage.setItem('pending_full_name', fullName.trim())
      await sendOtpEmail(email.trim(), true)
      sessionStorage.setItem('otp_email', email.trim())
      sessionStorage.setItem('otp_mode', 'register')
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
          <div className="rounded-xl bg-emerald-500/20 p-3">
            <UserPlus className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Create account</h1>
            <p className="text-sm text-slate-400">
              {selectedSystem
                ? `Register to use ${selectedSystem.toUpperCase()}`
                : 'Verify your email with a one-time code'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="label">
              Full name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                id="fullName"
                type="text"
                required
                className="input pl-10"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>
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
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-400 hover:text-brand-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
