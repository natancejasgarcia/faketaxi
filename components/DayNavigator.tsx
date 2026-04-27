'use client'

import { format, parseISO, addDays, subDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatDateLabel, todayISO } from '@/lib/utils'

interface Props {
  date: string
  onChange: (date: string) => void
}

export default function DayNavigator({ date, onChange }: Props) {
  const isToday = date === todayISO()

  function prev() {
    onChange(format(subDays(parseISO(date), 1), 'yyyy-MM-dd'))
  }

  function next() {
    if (!isToday) onChange(format(addDays(parseISO(date), 1), 'yyyy-MM-dd'))
  }

  function goToday() {
    onChange(todayISO())
  }

  return (
    <div className="flex items-center justify-between px-4 py-4">
      <button
        type="button"
        onClick={prev}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#21262d] text-xl text-[#f0f6fc] active:bg-[#30363d]"
      >
        ←
      </button>

      <button
        type="button"
        onClick={goToday}
        className="flex flex-col items-center"
      >
        <span className="text-base font-semibold capitalize text-[#f0f6fc]">
          {formatDateLabel(date)}
        </span>
        {!isToday && (
          <span className="text-xs text-[#f5c518]">Toca para ir a hoy</span>
        )}
      </button>

      <button
        type="button"
        onClick={next}
        disabled={isToday}
        className={`flex h-12 w-12 items-center justify-center rounded-full text-xl transition-colors ${
          isToday
            ? 'bg-[#21262d]/40 text-[#30363d]'
            : 'bg-[#21262d] text-[#f0f6fc] active:bg-[#30363d]'
        }`}
      >
        →
      </button>
    </div>
  )
}
