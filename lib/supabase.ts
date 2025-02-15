import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type User = {
  id: string
  name: string
  created_at?: string
}

export type CheckIn = {
  id?: string
  created_at?: string
  user_id: string
  user_name: string
  mood: 'happy' | 'neutral' | 'sad'
  stress_level: number
  productivity_level: number
  notes: string
}

// Add this code temporarily to test the connection
supabase
  .from('check_ins')
  .select('*')
  .limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.error('Supabase connection error:', error)
    } else {
      console.log('Supabase connection successful:', data)
    }
  }) 