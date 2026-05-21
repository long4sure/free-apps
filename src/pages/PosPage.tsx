import { FormEvent, useCallback, useEffect, useState } from 'react'
import { ShoppingCart, Plus, Trash2 } from 'lucide-react'
import { Layout } from '@/components/Layout'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { PosSale } from '@/types'

export function PosPage() {
  const { user } = useAuth()
  const [sales, setSales] = useState<PosSale[]>([])
  const [loading, setLoading] = useState(true)
  const [itemName, setItemName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [total, setTotal] = useState(0)

  const load = useCallback(async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('pos_sales')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setSales(data as PosSale[])
    setLoading(false)
  }, [user])

  useEffect(() => {
    load()
  }, [load])

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return
    const { error } = await supabase.from('pos_sales').insert({
      user_id: user.id,
      item_name: itemName.trim(),
      quantity,
      total,
    })
    if (!error) {
      setItemName('')
      setQuantity(1)
      setTotal(0)
      load()
    }
  }

  const handleDelete = async (id: string) => {
    await supabase.from('pos_sales').delete().eq('id', id)
    load()
  }

  const salesTotal = sales.reduce((sum, s) => sum + Number(s.total), 0)

  return (
    <Layout system="pos" title="POS — Sales">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShoppingCart className="h-8 w-8 text-emerald-400" />
          <p className="text-slate-400">Record point-of-sale transactions.</p>
        </div>
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
          <span className="text-sm text-slate-400">Total sales: </span>
          <span className="text-lg font-bold text-emerald-300">${salesTotal.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleAdd} className="card mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <input className="input" placeholder="Item name" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
        <input className="input" type="number" min={1} placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required />
        <input className="input" type="number" min={0} step="0.01" placeholder="Total ($)" value={total || ''} onChange={(e) => setTotal(Number(e.target.value))} required />
        <button type="submit" className="btn-primary">
          <Plus className="h-4 w-4" />
          Record sale
        </button>
      </form>

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : sales.length === 0 ? (
        <p className="text-slate-400">No sales recorded yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/80 text-slate-400">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id} className="border-t border-slate-800">
                  <td className="px-4 py-3 font-medium">{s.item_name}</td>
                  <td className="px-4 py-3">{s.quantity}</td>
                  <td className="px-4 py-3 text-emerald-300">${Number(s.total).toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-500">{new Date(s.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}
