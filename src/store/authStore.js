/* ============================================
   CIGGY — Admin Auth Store (Supabase Auth)

   - No credentials in frontend code ever
   - Login verified server-side by Supabase
   - Only a short-lived JWT session token stored
     in memory by Supabase SDK (not localStorage)
   ============================================ */

import { create } from 'zustand'
import { supabase } from '../lib/supabase'

let listenerRegistered = false

const useAuthStore = create((set) => ({
  authed: false,
  session: null,
  loading: true,

  // Called once on admin mount — checks existing Supabase session
  init: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    set({ authed: !!session, session, loading: false })

    // Register auth state listener only once
    if (!listenerRegistered) {
      listenerRegistered = true
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ authed: !!session, session })
      })
    }
  },

  // Login — password goes to Supabase server, never stored here
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    set({ authed: true, session: data.session })
    return { success: true }
  },

  // Logout — invalidates session on Supabase server
  logout: async () => {
    await supabase.auth.signOut()
    set({ authed: false, session: null, loading: false })
  },
}))

export default useAuthStore
