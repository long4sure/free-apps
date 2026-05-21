import { AlertTriangle } from 'lucide-react'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
const isPlaceholder =
  !url ||
  !key ||
  url.includes('YOUR_PROJECT') ||
  url.includes('placeholder') ||
  key === 'placeholder-key'

export function ConfigBanner() {
  if (!isPlaceholder) return null

  return (
    <div className="border-b border-amber-500/40 bg-amber-500/15 px-4 py-3 text-center text-sm text-amber-100">
      <p className="inline-flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        Supabase is not configured. Add GitHub secrets{' '}
        <code className="rounded bg-black/30 px-1">VITE_SUPABASE_URL</code> and{' '}
        <code className="rounded bg-black/30 px-1">VITE_SUPABASE_ANON_KEY</code>, then re-run the
        deploy workflow.
      </p>
    </div>
  )
}
