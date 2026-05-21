import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useSystem } from '@/contexts/SystemContext'
import type { SystemType } from '@/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireSystem?: boolean
  allowedSystem?: SystemType
  requireAdmin?: boolean
}

export function ProtectedRoute({
  children,
  requireSystem = false,
  allowedSystem,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { session, loading, isAdmin } = useAuth()
  const { selectedSystem } = useSystem()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />
  }

  if (requireSystem && !selectedSystem) {
    return <Navigate to="/" replace />
  }

  if (allowedSystem && selectedSystem !== allowedSystem) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
