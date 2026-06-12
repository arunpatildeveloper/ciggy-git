/* ============================================
   CIGGY — Admin Auth Store (Supabase Auth)
   
   Credentials are NEVER stored in frontend code.
   Login is verified by Supabase on their server.
   Only a JWT session token is stored locally.
   ============================================ */

import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const useAuthStore = create((set, get) => ({
  authed: false,
  session: null,
  loading: true, // true while checking existing session on load

  // Check if a session already exists (called on app mount)
  init: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    set({ authed: !!session, session, loading: false })

    // Listen for auth state changes (logout from another tab, token refresh, etc.)
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ authed: !!session, session })
    })
  },

  // Login — password is sent directly to Supabase, never stored in frontend
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) return { error: error.message }
    set({ authed: true, session: data.session })
    return { success: true }
  },

  // Logout — clears the Supabase session
  logout: async () => {
    await supabase.auth.signOut()
    set({ authed: false, session: null })
  },
}))

export default useAuthStore
