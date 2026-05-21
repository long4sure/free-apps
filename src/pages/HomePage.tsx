import { useNavigate } from 'react-router-dom'
import { Boxes, ShoppingCart, Users, Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useSystem } from '@/contexts/SystemContext'
import { SystemCard } from '@/components/SystemCard'
import type { SystemType } from '@/types'

export function HomePage() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const { setSelectedSystem } = useSystem()

  const choose = (system: SystemType) => {
    setSelectedSystem(system)
    if (session) {
      navigate(`/${system}`)
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-brand-950/40 to-slate-950 px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1 text-sm text-brand-300">
            <Sparkles className="h-4 w-4" />
            ERP · POS · CRM in one platform
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Choose your system
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            Select ERP, POS, or CRM to get started. You will sign in or create an account before
            accessing your workspace.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-12 md:grid-cols-3">
        <SystemCard
          title="ERP"
          description="Inventory, products, and supply chain for your business operations."
          icon={Boxes}
          accent="bg-violet-500/20 text-violet-300"
          onSelect={() => choose('erp')}
        />
        <SystemCard
          title="POS"
          description="Point of sale — record transactions and track daily sales."
          icon={ShoppingCart}
          accent="bg-emerald-500/20 text-emerald-300"
          onSelect={() => choose('pos')}
        />
        <SystemCard
          title="CRM"
          description="Manage contacts, leads, and customer relationships."
          icon={Users}
          accent="bg-amber-500/20 text-amber-300"
          onSelect={() => choose('crm')}
        />
      </div>
    </div>
  )
}
