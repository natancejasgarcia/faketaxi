'use client'

import useSWR from 'swr'
import { fetchDailySummary } from '@/lib/supabase'
import type { DailySummary } from '@/types'

export function useDailySummary(date: string) {
  const { data, error, isLoading, mutate } = useSWR<DailySummary | null>(
    date ? `summary-${date}` : null,
    () => fetchDailySummary(date),
    { revalidateOnFocus: false }
  )

  return { summary: data ?? null, isLoading, error, mutate }
}
