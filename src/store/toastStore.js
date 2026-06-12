import { create } from 'zustand'

let n = 0

const useToastStore = create((set, get) => ({
  toasts: [],
  addToast: (message, duration = 2800) => {
    const id = ++n
    set((s) => ({ toasts: [...s.toasts, { id, message }] }))
    setTimeout(() => get().removeToast(id), duration)
  },
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export default useToastStore
