import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { SystemType } from '@/types'

const STORAGE_KEY = 'selected_system'

interface SystemContextValue {
  selectedSystem: SystemType | null
  setSelectedSystem: (system: SystemType | null) => void
  clearSelectedSystem: () => void
}

const SystemContext = createContext<SystemContextValue | null>(null)

function readStored(): SystemType | null {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (raw === 'erp' || raw === 'pos' || raw === 'crm') return raw
  return null
}

export function SystemProvider({ children }: { children: ReactNode }) {
  const [selectedSystem, setState] = useState<SystemType | null>(readStored)

  const setSelectedSystem = useCallback((system: SystemType | null) => {
    setState(system)
    if (system) sessionStorage.setItem(STORAGE_KEY, system)
    else sessionStorage.removeItem(STORAGE_KEY)
  }, [])

  const clearSelectedSystem = useCallback(() => setSelectedSystem(null), [setSelectedSystem])

  const value = useMemo(
    () => ({ selectedSystem, setSelectedSystem, clearSelectedSystem }),
    [selectedSystem, setSelectedSystem, clearSelectedSystem]
  )

  return <SystemContext.Provider value={value}>{children}</SystemContext.Provider>
}

export function useSystem() {
  const ctx = useContext(SystemContext)
  if (!ctx) throw new Error('useSystem must be used within SystemProvider')
  return ctx
}
