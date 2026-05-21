export type SystemType = 'erp' | 'pos' | 'crm'

export type UserRole = 'user' | 'admin'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  created_at: string
}

export interface ErpProduct {
  id: string
  user_id: string
  name: string
  sku: string
  quantity: number
  unit_price: number
  created_at: string
}

export interface PosSale {
  id: string
  user_id: string
  item_name: string
  quantity: number
  total: number
  created_at: string
}

export interface CrmContact {
  id: string
  user_id: string
  name: string
  email: string | null
  phone: string | null
  company: string | null
  status: string
  created_at: string
}
