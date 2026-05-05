export interface Ride {
  id: string
  created_at: string
  date: string
  amount: number
  payment_method: 'cash' | 'card'
  notes: string | null
}

export interface DailySummary {
  date: string
  total_rides: number
  total_amount: number
  cash_amount: number
  card_amount: number
}

export interface WeekStat {
  date: string
  label: string
  total_amount: number
  total_rides: number
}

export type PaymentMethod = 'cash' | 'card'

export interface DailyKm {
  date: string
  km: number
}
