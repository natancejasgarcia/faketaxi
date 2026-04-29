'use client'

import { useState, useEffect } from 'react'
import { todayISO } from '@/lib/utils'

const SHIFT_KEY = 'ft_active_shift'

export interface Shift {
  startDate: string   // YYYY-MM-DD — all rides during this shift get this date
  startedAt: string   // ISO timestamp for display
}

export function useShift() {
  const [shift, setShift] = useState<Shift | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(SHIFT_KEY)
    if (stored) setShift(JSON.parse(stored))
    setMounted(true)
  }, [])

  function startShift() {
    const s: Shift = { startDate: todayISO(), startedAt: new Date().toISOString() }
    localStorage.setItem(SHIFT_KEY, JSON.stringify(s))
    setShift(s)
  }

  function endShift() {
    localStorage.removeItem(SHIFT_KEY)
    setShift(null)
  }

  return { shift, startShift, endShift, mounted }
}
