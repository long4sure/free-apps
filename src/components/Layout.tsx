import { Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogOut, Shield } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import type { SystemType } from '@/types'

const systemLabels: Record<SystemType, string> = {
  erp: 'ERP',
  pos: 'POS',
  crm: 'CRM',
}

interface LayoutProps {
  children: React.ReactNode
  system?: SystemType
  title: string
}

export function Layout({ children, system, title }: LayoutProps) {
  const { profile, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-6 w-6 text-brand-400" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {system ? systemLabels[system] : 'Business Suite'}
              </p>
              <h1 className="text-lg font-bold text-white">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-400 sm:inline">
              {profile?.full_name || profile?.email}
            </span>
            {isAdmin && (
              <Link to="/admin" className="btn-secondary py-2 text-sm">
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
            <button type="button" onClick={handleSignOut} className="btn-secondary py-2 text-sm">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}
