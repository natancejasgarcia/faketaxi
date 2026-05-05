'use client'

import useSWR from 'swr'
import { fetchRidesByDate, insertRide, deleteRide, updateRide } from '@/lib/supabase'
import type { Ride, PaymentMethod } from '@/types'

export function useRides(date: string) {
  const key = date ? `rides-${date}` : null

  const { data, error, isLoading, mutate } = useSWR<Ride[]>(
    key,
    () => fetchRidesByDate(date),
    { revalidateOnFocus: false }
  )

  async function addRide(params: {
    amount: number
    payment_method: PaymentMethod
    notes?: string | null
  }) {
    const optimistic: Ride = {
      id: `tmp-${Date.now()}`,
      created_at: new Date().toISOString(),
      date,
      amount: params.amount,
      payment_method: params.payment_method,
      notes: params.notes ?? null,
    }

    await mutate(
      async (current = []) => {
        const saved = await insertRide({ date, ...params })
        return [saved, ...current]
      },
      {
        optimisticData: (current = []) => [optimistic, ...current],
        rollbackOnError: true,
        revalidate: false,
      }
    )
  }

  async function editRide(id: string, updates: { amount?: number; payment_method?: PaymentMethod }) {
    await mutate(
      async (current = []) => {
        const updated = await updateRide(id, updates)
        return (current ?? []).map((r) => (r.id === id ? updated : r))
      },
      {
        optimisticData: (current = []) =>
          (current ?? []).map((r) => (r.id === id ? { ...r, ...updates } : r)),
        rollbackOnError: true,
        revalidate: false,
      }
    )
  }

  async function removeRide(id: string) {
    await mutate(
      async (current = []) => {
        await deleteRide(id)
        return current.filter((r) => r.id !== id)
      },
      {
        optimisticData: (current = []) => (current ?? []).filter((r) => r.id !== id),
        rollbackOnError: true,
        revalidate: false,
      }
    )
  }

  return {
    rides: data ?? [],
    isLoading,
    error,
    addRide,
    editRide,
    removeRide,
    mutate,
  }
}
