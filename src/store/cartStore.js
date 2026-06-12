/* ============================================
   CIGGY — Cart Store (Zustand + localStorage)
   ============================================ */

import { create } from 'zustand'

const CART_KEY = 'ciggy_cart'
export const SHIPPING_THRESHOLD = 2000
export const SHIPPING_COST = 80

const loadCart = () => {
  try {
    const d = localStorage.getItem(CART_KEY)
    return d ? JSON.parse(d) : []
  } catch { return [] }
}

const saveCart = (items) => {
  try { localStorage.setItem(CART_KEY, JSON.stringify(items)) } catch {}
}

const useCartStore = create((set, get) => ({
  items: loadCart(),

  addItem: (product, size, quantity = 1) => {
    const items = get().items
    const existing = items.find((i) => i.id === product.id && i.size === size)
    let updated
    if (existing) {
      updated = items.map((i) =>
        i.id === product.id && i.size === size
          ? { ...i, quantity: i.quantity + quantity }
          : i
      )
    } else {
      updated = [
        ...items,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          category: product.category,
          image: product.mainImage || null,
          size,
          quantity,
        },
      ]
    }
    saveCart(updated)
    set({ items: updated })
  },

  updateQuantity: (id, size, quantity) => {
    if (quantity < 1) return
    const updated = get().items.map((i) =>
      i.id === id && i.size === size ? { ...i, quantity } : i
    )
    saveCart(updated)
    set({ items: updated })
  },

  removeItem: (id, size) => {
    const updated = get().items.filter((i) => !(i.id === id && i.size === size))
    saveCart(updated)
    set({ items: updated })
  },

  clearCart: () => { saveCart([]); set({ items: [] }) },
}))

export default useCartStore
