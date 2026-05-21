import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useSystem } from '@/contexts/SystemContext'

/** Handles magic-link redirects from Supabase email (OTP link). */
export function AuthCallbackPage() {
  const navigate = useNavigate()
  const { selectedSystem } = useSystem()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate(selectedSystem ? `/${selectedSystem}` : '/', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    })
  }, [navigate, selectedSystem])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
    </div>
  )
}
