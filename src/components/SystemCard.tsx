import type { LucideIcon } from 'lucide-react'
import { ChevronRight } from 'lucide-react'

interface SystemCardProps {
  title: string
  description: string
  icon: LucideIcon
  accent: string
  onSelect: () => void
}

export function SystemCard({ title, description, icon: Icon, accent, onSelect }: SystemCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="card group w-full text-left transition hover:border-brand-500/50 hover:bg-slate-800/80"
    >
      <div className={`mb-4 inline-flex rounded-xl p-3 ${accent}`}>
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">{description}</p>
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-400 group-hover:gap-2 transition-all">
        Continue
        <ChevronRight className="h-4 w-4" />
      </span>
    </button>
  )
}
