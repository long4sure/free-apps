import { useCallback, useEffect, useState } from 'react'
import { Shield, Users, Boxes, ShoppingCart, Contact } from 'lucide-react'
import { Layout } from '@/components/Layout'
import { supabase } from '@/lib/supabase'

interface AdminStats {
  users: number
  erpProducts: number
  posSales: number
  crmContacts: number
}

interface UserRow {
  id: string
  email: string
  full_name: string | null
  role: string
  created_at: string
}

export function AdminPage() {
  const [stats, setStats] = useState<AdminStats>({ users: 0, erpProducts: 0, posSales: 0, crmContacts: 0 })
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const [profiles, erp, pos, crm] = await Promise.all([
      supabase.from('profiles').select('id, email, full_name, role, created_at').order('created_at', { ascending: false }),
      supabase.from('erp_products').select('id', { count: 'exact', head: true }),
      supabase.from('pos_sales').select('id', { count: 'exact', head: true }),
      supabase.from('crm_contacts').select('id', { count: 'exact', head: true }),
    ])

    if (profiles.data) setUsers(profiles.data as UserRow[])
    setStats({
      users: profiles.data?.length ?? 0,
      erpProducts: erp.count ?? 0,
      posSales: pos.count ?? 0,
      crmContacts: crm.count ?? 0,
    })
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const statCards = [
    { label: 'Registered users', value: stats.users, icon: Users, color: 'text-brand-400' },
    { label: 'ERP products (all)', value: stats.erpProducts, icon: Boxes, color: 'text-violet-400' },
    { label: 'POS sales (all)', value: stats.posSales, icon: ShoppingCart, color: 'text-emerald-400' },
    { label: 'CRM contacts (all)', value: stats.crmContacts, icon: Contact, color: 'text-amber-400' },
  ]

  return (
    <Layout title="Admin dashboard">
      <div className="mb-8 flex items-center gap-3">
        <Shield className="h-8 w-8 text-brand-400" />
        <p className="text-slate-400">
          Monitor all users and aggregate activity. Row-level security still protects user data in the app;
          admins see counts and user list via elevated policies.
        </p>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="card">
                <Icon className={`mb-2 h-6 w-6 ${color}`} />
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-sm text-slate-400">{label}</p>
              </div>
            ))}
          </div>

          <div className="card">
            <h2 className="mb-4 text-lg font-bold text-white">All users</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-slate-400">
                  <tr>
                    <th className="pb-2 pr-4">Name</th>
                    <th className="pb-2 pr-4">Email</th>
                    <th className="pb-2 pr-4">Role</th>
                    <th className="pb-2">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t border-slate-800">
                      <td className="py-3 pr-4 font-medium">{u.full_name || '—'}</td>
                      <td className="py-3 pr-4 text-slate-400">{u.email}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            u.role === 'admin'
                              ? 'bg-brand-500/20 text-brand-300'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 text-slate-500">{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Layout>
  )
}
