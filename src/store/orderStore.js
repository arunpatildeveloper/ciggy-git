/* ============================================
   CIGGY — Order Store (Supabase)
   ============================================ */

import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const ORDER_STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']

const fromRow = (row) => ({
  orderNumber: row.order_number,
  customerName: row.customer_name,
  email: row.email,
  phone: row.phone,
  address: row.address,
  items: row.items || [],
  subtotal: row.subtotal,
  shipping: row.shipping,
  total: row.total,
  payment: row.payment,
  status: row.status || 'Pending',
  placedAt: row.placed_at,
})

const toRow = (o) => ({
  order_number: o.orderNumber,
  customer_name: o.customerName,
  email: o.email,
  phone: o.phone,
  address: o.address,
  items: o.items,
  subtotal: o.subtotal,
  shipping: o.shipping,
  total: o.total,
  payment: o.payment,
  status: o.status || 'Pending',
  placed_at: o.placedAt,
})

const useOrderStore = create((set, get) => ({
  orders: [],
  loading: false,

  // Fetch all orders (admin)
  fetchOrders: async () => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('placed_at', { ascending: false })

    if (error) {
      console.error('CIGGY: fetch orders error', error)
      set({ loading: false })
      return
    }
    set({ orders: (data || []).map(fromRow), loading: false })
  },

  // Called from checkout
  addOrder: async (order) => {
    const { data, error } = await supabase
      .from('orders')
      .insert([toRow(order)])
      .select()
      .single()

    if (error) {
      console.error('CIGGY: add order error', error)
      return { error }
    }
    const newOrder = fromRow(data)
    set({ orders: [newOrder, ...get().orders] })
    return { data: newOrder }
  },

  // Admin: update status
  updateStatus: async (orderNumber, status) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('order_number', orderNumber)

    if (error) { console.error('CIGGY: update status error', error); return }
    set({
      orders: get().orders.map((o) =>
        o.orderNumber === orderNumber ? { ...o, status } : o
      ),
    })
  },

  // Admin: delete order
  deleteOrder: async (orderNumber) => {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('order_number', orderNumber)

    if (error) { console.error('CIGGY: delete order error', error); return }
    set({ orders: get().orders.filter((o) => o.orderNumber !== orderNumber) })
  },

  reload: async () => { await get().fetchOrders() },
}))

export default useOrderStore
