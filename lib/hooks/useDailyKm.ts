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
    await mutate(
      async () => {
        await upsertDailyKm(date, km)
        return km
      },
      {
        optimisticData: km,
        rollbackOnError: true,
        revalidate: false,
      }
    )
  }

  return {
    km: data ?? null,
    isLoading,
    setKm,
  }
}
