'use client'

import { useRef, useState } from 'react'
import type { Ride } from '@/types'
import { formatTime, formatAmount } from '@/lib/utils'

interface Props {
  ride: Ride
  onDelete: (id: string) => void
}

export default function RideCard({ ride, onDelete }: Props) {
  const [swiped, setSwiped] = useState(false)
  const startX = useRef<number | null>(null)

  function handleTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (startX.current === null) return
    const dx = startX.current - e.changedTouches[0].clientX
    if (dx > 60) setSwiped(true)
    else if (dx < -20) setSwiped(false)
    startX.current = null
  }

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Delete button revealed on swipe */}
      <div
        className={`absolute inset-y-0 right-0 flex items-center justify-center bg-[#f85149] transition-all duration-200 ${
          swiped ? 'w-20 opacity-100' : 'w-0 opacity-0'
        }`}
      >
        <button
          type="button"
          onClick={() => onDelete(ride.id)}
          className="flex h-full w-20 items-center justify-center text-white font-semibold text-sm"
        >
          Borrar
        </button>
      </div>

      {/* Card body */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => swiped && setSwiped(false)}
        className={`flex items-center gap-3 rounded-2xl bg-[#161b22] p-4 transition-transform duration-200 ${
          swiped ? '-translate-x-20' : 'translate-x-0'
        }`}
      >
        {/* Time */}
        <span className="w-12 shrink-0 text-sm text-[#8b949e]">
          {formatTime(ride.created_at)}
        </span>

        {/* Amount */}
        <span className="flex-1 text-xl font-bold text-[#f0f6fc]">
          {formatAmount(Number(ride.amount))}
        </span>

        {/* Payment badge */}
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold ${
            ride.payment_method === 'cash'
              ? 'bg-[#3fb950]/20 text-[#3fb950]'
              : 'bg-[#58a6ff]/20 text-[#58a6ff]'
          }`}
        >
          {ride.payment_method === 'cash' ? 'Efectivo' : 'Tarjeta'}
        </span>
      </div>

      {/* Notes row */}
      {ride.notes && (
        <div
          className={`-mt-1 rounded-b-2xl bg-[#161b22] px-4 pb-3 text-sm text-[#8b949e] transition-transform duration-200 ${
            swiped ? '-translate-x-20' : 'translate-x-0'
          }`}
        >
          {ride.notes}
        </div>
      )}
    </div>
  )
}
