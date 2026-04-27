'use client'

import useSWR from 'swr'
import { fetchRidesInRange } from '@/lib/supabase'
import { getWeekRange, getMonthRange, buildWeekStats } from '@/lib/utils'
import type { Ride, WeekStat } from '@/types'

function computeMonthStats(rides: Ride[]) {
  const total = rides.reduce((s, r) => s + Number(r.amount), 0)
  const cash = rides.filter((r) => r.payment_method === 'cash').reduce((s, r) => s + Number(r.amount), 0)
  const card = rides.filter((r) => r.payment_method === 'card').reduce((s, r) => s + Number(r.amount), 0)
  return { total, cash, card, count: rides.length }
}

export function useStats(referenceDate: Date = new Date()) {
  const week = getWeekRange(referenceDate)
  const month = getMonthRange(referenceDate)

  const { data: weekRides, isLoading: weekLoading } = useSWR<Ride[]>(
    `rides-week-${week.from}`,
    () => fetchRidesInRange(week.from, week.to),
    { revalidateOnFocus: false }
  )

  const { data: monthRides, isLoading: monthLoading } = useSWR<Ride[]>(
    `rides-month-${month.from}`,
    () => fetchRidesInRange(month.from, month.to),
    { revalidateOnFocus: false }
  )

  const weekStats: WeekStat[] = weekRides
    ? buildWeekStats(weekRides, week.from, week.to)
    : []

  const monthStats = monthRides ? computeMonthStats(monthRides) : null

  return {
    weekStats,
    monthStats,
    week,
    month,
    isLoading: weekLoading || monthLoading,
  }
}
