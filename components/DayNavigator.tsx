'use client'

import { useState } from 'react'
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  setYear,
  getYear,
  isSameDay,
  isSameMonth,
  isAfter,
  startOfDay,
} from 'date-fns'
import { es } from 'date-fns/locale'

interface Props {
  date: string
  onChange: (date: string) => void
}

export default function DayNavigator({ date, onChange }: Props) {
  const selected = parseISO(date)
  const today = startOfDay(new Date())
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(selected))
  const [pickingYear, setPickingYear] = useState(false)

  const currentYear = getYear(today)
  const years = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i)

  function buildGrid() {
    const start = startOfWeek(startOfMonth(viewMonth), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(viewMonth), { weekStartsOn: 1 })
    const days: Date[] = []
    let cur = start
    while (!isAfter(cur, end)) {
      days.push(cur)
      cur = addDays(cur, 1)
    }
    return days
  }

  const days = buildGrid()
  const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

  function select(day: Date) {
    if (isAfter(startOfDay(day), today)) return
    onChange(format(day, 'yyyy-MM-dd'))
  }

  function selectYear(year: number) {
    const next = setYear(viewMonth, year)
    setViewMonth(isAfter(next, today) ? startOfMonth(today) : next)
    setPickingYear(false)
  }

  return (
    <div className="mx-4 rounded-2xl bg-[#161b22] p-4">
      {/* Month / year header */}
      <div className="mb-3 flex items-center justify-between">
        {!pickingYear && (
          <button
            type="button"
            onClick={() => setViewMonth((m) => subMonths(m, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#21262d] text-[#f0f6fc] active:bg-[#30363d]"
          >
            ‹
          </button>
        )}

        <button
          type="button"
          onClick={() => setPickingYear((v) => !v)}
          className="flex flex-1 items-center justify-center gap-1 text-sm font-semibold capitalize text-[#f0f6fc]"
        >
          {pickingYear
            ? 'Selecciona año'
            : format(viewMonth, 'MMMM yyyy', { locale: es })}
          <span className="text-xs text-[#8b949e]">{pickingYear ? '▲' : '▼'}</span>
        </button>

        {!pickingYear && (
          <button
            type="button"
            onClick={() => setViewMonth((m) => addMonths(m, 1))}
            disabled={isSameMonth(viewMonth, today)}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-[#f0f6fc] transition-opacity ${
              isSameMonth(viewMonth, today)
                ? 'opacity-20'
                : 'bg-[#21262d] active:bg-[#30363d]'
            }`}
          >
            ›
          </button>
        )}
      </div>

      {pickingYear ? (
        /* Year grid */
        <div className="grid grid-cols-4 gap-2">
          {years.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => selectYear(y)}
              className={`rounded-xl py-2 text-sm font-medium transition-colors ${
                y === getYear(viewMonth)
                  ? 'bg-[#f5c518] font-bold text-black'
                  : 'bg-[#21262d] text-[#f0f6fc] active:bg-[#30363d]'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      ) : (
        <>
          {/* Week day labels */}
          <div className="mb-1 grid grid-cols-7 text-center">
            {weekDays.map((d) => (
              <span key={d} className="text-xs font-medium text-[#8b949e]">
                {d}
              </span>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-y-1 text-center">
            {days.map((day, i) => {
              const isSelected = isSameDay(day, selected)
              const isToday = isSameDay(day, today)
              const inMonth = isSameMonth(day, viewMonth)
              const future = isAfter(startOfDay(day), today)

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => select(day)}
                  disabled={future}
                  className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors
                    ${isSelected ? 'bg-[#f5c518] font-bold text-black' : ''}
                    ${!isSelected && isToday ? 'border border-[#f5c518] text-[#f5c518]' : ''}
                    ${!isSelected && !isToday && inMonth && !future ? 'text-[#f0f6fc] hover:bg-[#21262d]' : ''}
                    ${!inMonth ? 'text-[#30363d]' : ''}
                    ${future ? 'cursor-default text-[#30363d]' : ''}
                  `}
                >
                  {format(day, 'd')}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
