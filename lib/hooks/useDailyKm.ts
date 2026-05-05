'use client'

import useSWR from 'swr'
import { fetchDailyKm, upsertDailyKm } from '@/lib/supabase'

export function useDailyKm(date: string) {
  const key = date ? `daily-km-${date}` : null

  const { data, isLoading, mutate } = useSWR<number | null>(
    key,
    () => fetchDailyKm(date),
    { revalidateOnFocus: false }
  )

  async function setKm(km: number) {
    // Update cache optimistically, then upsert, then revalidate
    await mutate(km, { revalidate: false })
    await upsertDailyKm(date, km)
  }

  return {
    km: data ?? null,
    isLoading,
    setKm,
  }
}
