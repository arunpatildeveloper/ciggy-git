/* ============================================
   CIGGY — Admin Auth Store
   Simple hardcoded credentials for now.
   Change ADMIN_USER and ADMIN_PASS below.
   Replace with real auth when going live.
   ============================================ */

import { create } from 'zustand'

const SESSION_KEY = 'ciggy_admin_auth'

// ← Edit these credentials
const ADMIN_USER = 'ciggy'
const ADMIN_PASS = 'ciggy2025'

const isAuthed = () => {
  try { return localStorage.getItem(SESSION_KEY) === 'true' } catch { return false }
}

const useAuthStore = create((set) => ({
  authed: isAuthed(),

  login: (username, password) => {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem(SESSION_KEY, 'true')
      set({ authed: true })
      return true
    }
    return false
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY)
    set({ authed: false })
  },
}))

export default useAuthStore
