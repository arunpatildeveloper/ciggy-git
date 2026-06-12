import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://iqnuxhhdkrrjbmpupodb.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_YgEWJtty_3Hfq-zOaU_K7A_8MyYki9X'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
