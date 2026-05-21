import { FormEvent, useCallback, useEffect, useState } from 'react'
import { Users, Plus, Trash2 } from 'lucide-react'
import { Layout } from '@/components/Layout'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { CrmContact } from '@/types'

export function CrmPage() {
  const { user } = useAuth()
  const [contacts, setContacts] = useState<CrmContact[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [status, setStatus] = useState('lead')

  const load = useCallback(async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('crm_contacts')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setContacts(data as CrmContact[])
    setLoading(false)
  }, [user])

  useEffect(() => {
    load()
  }, [load])

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return
    const { error } = await supabase.from('crm_contacts').insert({
      user_id: user.id,
      name: name.trim(),
      email: email.trim() || null,
      phone: phone.trim() || null,
      company: company.trim() || null,
      status,
    })
    if (!error) {
      setName('')
      setEmail('')
      setPhone('')
      setCompany('')
      setStatus('lead')
      load()
    }
  }

  const handleDelete = async (id: string) => {
    await supabase.from('crm_contacts').delete().eq('id', id)
    load()
  }

  return (
    <Layout system="crm" title="CRM — Contacts">
      <div className="mb-8 flex items-center gap-3">
        <Users className="h-8 w-8 text-amber-400" />
        <p className="text-slate-400">Your private contact list and pipeline.</p>
      </div>

      <form onSubmit={handleAdd} className="card mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input className="input" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="lead">Lead</option>
          <option value="qualified">Qualified</option>
          <option value="customer">Customer</option>
        </select>
        <button type="submit" className="btn-primary sm:col-span-2 lg:col-span-1">
          <Plus className="h-4 w-4" />
          Add contact
        </button>
      </form>

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : contacts.length === 0 ? (
        <p className="text-slate-400">No contacts yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {contacts.map((c) => (
            <div key={c.id} className="card flex justify-between gap-4">
              <div>
                <h3 className="font-bold text-white">{c.name}</h3>
                {c.company && <p className="text-sm text-slate-400">{c.company}</p>}
                {c.email && <p className="text-sm text-slate-500">{c.email}</p>}
                <span className="mt-2 inline-block rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-300 capitalize">
                  {c.status}
                </span>
              </div>
              <button type="button" onClick={() => handleDelete(c.id)} className="text-red-400 hover:text-red-300">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}
