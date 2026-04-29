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

export function useWeekStats(weekDate: Date) {
  const week = getWeekRange(weekDate)

  const { data: weekRides, isLoading } = useSWR<Ride[]>(
    `rides-week-${week.from}`,
    () => fetchRidesInRange(week.from, week.to),
    { revalidateOnFocus: false }
  )

  const weekStats: WeekStat[] = weekRides
    ? buildWeekStats(weekRides, week.from, week.to)
    : []

  return {
    weekStats,
    weekRides: weekRides ?? [],
    week,
    isLoading,
  }
}

export function useMonthStats(monthDate: Date) {
  const month = getMonthRange(monthDate)

  const { data: monthRides, isLoading } = useSWR<Ride[]>(
    `rides-month-${month.from}`,
    () => fetchRidesInRange(month.from, month.to),
    { revalidateOnFocus: false }
  )

  const monthStats = monthRides ? computeMonthStats(monthRides) : null

  return { monthStats, month, isLoading }
}

// Keep original export for backwards compat
export function useStats(referenceDate: Date = new Date()) {
  const weekResult = useWeekStats(referenceDate)
  const monthResult = useMonthStats(referenceDate)

  return {
    ...weekResult,
    ...monthResult,
    isLoading: weekResult.isLoading || monthResult.isLoading,
  }
}
