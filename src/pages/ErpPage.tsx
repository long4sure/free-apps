import { FormEvent, useCallback, useEffect, useState } from 'react'
import { Boxes, Plus, Trash2 } from 'lucide-react'
import { Layout } from '@/components/Layout'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { ErpProduct } from '@/types'

export function ErpPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<ErpProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [unitPrice, setUnitPrice] = useState(0)

  const load = useCallback(async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('erp_products')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setProducts(data as ErpProduct[])
    setLoading(false)
  }, [user])

  useEffect(() => {
    load()
  }, [load])

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return
    const { error } = await supabase.from('erp_products').insert({
      user_id: user.id,
      name: name.trim(),
      sku: sku.trim(),
      quantity,
      unit_price: unitPrice,
    })
    if (!error) {
      setName('')
      setSku('')
      setQuantity(0)
      setUnitPrice(0)
      load()
    }
  }

  const handleDelete = async (id: string) => {
    await supabase.from('erp_products').delete().eq('id', id)
    load()
  }

  return (
    <Layout system="erp" title="ERP — Inventory">
      <div className="mb-8 flex items-center gap-3">
        <Boxes className="h-8 w-8 text-violet-400" />
        <p className="text-slate-400">Manage your products and stock. Only you can see this data.</p>
      </div>

      <form onSubmit={handleAdd} className="card mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <input className="input" placeholder="Product name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="input" placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} required />
        <input className="input" type="number" min={0} placeholder="Qty" value={quantity || ''} onChange={(e) => setQuantity(Number(e.target.value))} required />
        <input className="input" type="number" min={0} step="0.01" placeholder="Unit price" value={unitPrice || ''} onChange={(e) => setUnitPrice(Number(e.target.value))} required />
        <button type="submit" className="btn-primary">
          <Plus className="h-4 w-4" />
          Add product
        </button>
      </form>

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : products.length === 0 ? (
        <p className="text-slate-400">No products yet. Add your first item above.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/80 text-slate-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Unit price</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-slate-800">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-slate-400">{p.sku}</td>
                  <td className="px-4 py-3">{p.quantity}</td>
                  <td className="px-4 py-3">${Number(p.unit_price).toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300">
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
