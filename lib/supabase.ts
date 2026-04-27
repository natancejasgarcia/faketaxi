import { createClient } from '@supabase/supabase-js'
import type { Ride, DailySummary } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function fetchRidesByDate(date: string): Promise<Ride[]> {
  const { data, error } = await supabase
    .from('rides')
    .select('*')
    .eq('date', date)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function fetchDailySummary(date: string): Promise<DailySummary | null> {
  const { data, error } = await supabase
    .from('daily_summaries')
    .select('*')
    .eq('date', date)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data ?? null
}

export async function insertRide(ride: {
  date: string
  amount: number
  payment_method: 'cash' | 'card'
  notes?: string | null
}): Promise<Ride> {
  const { data, error } = await supabase
    .from('rides')
    .insert([ride])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteRide(id: string): Promise<void> {
  const { error } = await supabase.from('rides').delete().eq('id', id)
  if (error) throw error
}

export async function fetchRidesInRange(from: string, to: string): Promise<Ride[]> {
  const { data, error } = await supabase
    .from('rides')
    .select('*')
    .gte('date', from)
    .lte('date', to)
    .order('date', { ascending: true })

  if (error) throw error
  return data ?? []
}
