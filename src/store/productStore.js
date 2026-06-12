/* ============================================
   CIGGY — Product Store (Supabase)
   All products stored in Supabase DB.
   localStorage used only as a loading cache.
   ============================================ */

import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const CACHE_KEY = 'ciggy_products_cache'

// Map Supabase row → app product shape
const fromRow = (row) => ({
  id: row.id,
  name: row.name,
  price: row.price,
  category: row.category || '',
  color: row.color || '',
  sizes: row.sizes || [],
  stock: row.stock || 'in_stock',
  description: row.description || '',
  details: row.details || [],
  care: row.care || [],
  mainImage: row.main_image || '',
  extraImages: row.extra_images || [],
  createdAt: row.created_at,
})

// Map app product → Supabase row shape
const toRow = (p) => ({
  id: p.id,
  name: p.name,
  price: p.price,
  category: p.category || '',
  color: p.color || '',
  sizes: p.sizes || [],
  stock: p.stock || 'in_stock',
  description: p.description || '',
  details: p.details || [],
  care: p.care || [],
  main_image: p.mainImage || '',
  extra_images: p.extraImages || [],
})

// Load cached products (for instant render while fetching)
const loadCache = () => {
  try {
    const d = localStorage.getItem(CACHE_KEY)
    return d ? JSON.parse(d) : []
  } catch { return [] }
}

const saveCache = (list) => {
  try {
    // Strip base64 from cache to keep it small
    const slim = list.map((p) => ({
      ...p,
      mainImage: p.mainImage?.startsWith('data:') ? '' : p.mainImage,
      extraImages: (p.extraImages || []).filter((i) => !i?.startsWith('data:')),
    }))
    localStorage.setItem(CACHE_KEY, JSON.stringify(slim))
  } catch {}
}

const useProductStore = create((set, get) => ({
  products: loadCache(),
  loading: false,
  error: null,

  // Fetch all products from Supabase
  fetchProducts: async () => {
    set({ loading: true, error: null })
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('CIGGY: fetch products error', error)
      set({ loading: false, error: error.message })
      return
    }
    const products = (data || []).map(fromRow)
    saveCache(products)
    set({ products, loading: false })
  },

  // Add a new product
  addProduct: async (product) => {
    const { data, error } = await supabase
      .from('products')
      .insert([toRow(product)])
      .select()
      .single()

    if (error) {
      console.error('CIGGY: add product error', error)
      return { error }
    }
    const newProduct = fromRow(data)
    const updated = [newProduct, ...get().products]
    saveCache(updated)
    set({ products: updated })
    return { data: newProduct }
  },

  // Update existing product
  updateProduct: async (id, product) => {
    const { data, error } = await supabase
      .from('products')
      .update(toRow({ ...product, id }))
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('CIGGY: update product error', error)
      return { error }
    }
    const updated = get().products.map((p) =>
      p.id === id ? fromRow(data) : p
    )
    saveCache(updated)
    set({ products: updated })
    return { data: fromRow(data) }
  },

  // Delete a product
  deleteProduct: async (id) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('CIGGY: delete product error', error)
      return { error }
    }
    const updated = get().products.filter((p) => p.id !== id)
    saveCache(updated)
    set({ products: updated })
    return {}
  },

  getProduct: (id) => get().products.find((p) => p.id === id),

  // Reload from Supabase (replaces old localStorage reload)
  reload: async () => {
    await get().fetchProducts()
  },
}))

export default useProductStore

export const formatPrice = (price) =>
  `₹${Number(price).toLocaleString('en-IN')}`

export const generateId = () =>
  `p_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
