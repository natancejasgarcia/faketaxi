'use client'

import dynamic from 'next/dynamic'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useStats } from '@/lib/hooks/useStats'
import { formatAmount } from '@/lib/utils'

const WeeklyChart = dynamic(() => import('@/components/WeeklyChart'), { ssr: false })

export default function StatsPage() {
  const { weekStats, monthStats, week, month, isLoading } = useStats(new Date())

  const weekTotal = weekStats.reduce((s, d) => s + d.total_amount, 0)
  const weekRides = weekStats.reduce((s, d) => s + d.total_rides, 0)

  return (
    <div className="flex flex-col gap-5 pt-6 pb-4">
      <div className="px-4">
        <h1 className="text-2xl font-bold text-[#f0f6fc]">Estadísticas</h1>
      </div>

      {/* Weekly bar chart */}
      <div className="mx-4 rounded-2xl bg-[#161b22] p-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#8b949e]">
          Esta semana
        </p>
        <p className="mb-4 text-2xl font-bold text-[#f5c518]">
          {isLoading ? '…' : formatAmount(weekTotal)}
          <span className="ml-2 text-sm font-normal text-[#8b949e]">
            {weekRides} carreras
          </span>
        </p>
        {isLoading ? (
          <div className="h-44 animate-pulse rounded-xl bg-[#21262d]" />
        ) : (
          <WeeklyChart data={weekStats} />
        )}
      </div>

      {/* Monthly summary */}
      <div className="mx-4 rounded-2xl bg-[#161b22] p-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#8b949e]">
          {format(new Date(), 'MMMM yyyy', { locale: es })}
        </p>
        {isLoading || !monthStats ? (
          <div className="h-24 animate-pulse rounded-xl bg-[#21262d]" />
        ) : (
          <>
            <p className="mb-4 text-2xl font-bold text-[#f5c518]">
              {formatAmount(monthStats.total)}
              <span className="ml-2 text-sm font-normal text-[#8b949e]">
                {monthStats.count} carreras
              </span>
            </p>

            {/* Cash vs card percentage bar */}
            <CashCardBar total={monthStats.total} cash={monthStats.cash} card={monthStats.card} />

            <div className="mt-3 grid grid-cols-2 gap-3">
              <MiniStat label="Efectivo" value={formatAmount(monthStats.cash)} color="green" />
              <MiniStat label="Tarjeta" value={formatAmount(monthStats.card)} color="blue" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function CashCardBar({ total, cash, card }: { total: number; cash: number; card: number }) {
  const cashPct = total > 0 ? Math.round((cash / total) * 100) : 0
  const cardPct = 100 - cashPct

  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full">
        <div className="bg-[#3fb950] transition-all" style={{ width: `${cashPct}%` }} />
        <div className="bg-[#58a6ff] transition-all" style={{ width: `${cardPct}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-xs text-[#8b949e]">
        <span>Efectivo {cashPct}%</span>
        <span>Tarjeta {cardPct}%</span>
      </div>
    </div>
  )
}

function MiniStat({ label, value, color }: { label: string; value: string; color: 'green' | 'blue' }) {
  const colorMap = { green: 'text-[#3fb950]', blue: 'text-[#58a6ff]' }
  return (
    <div className="rounded-xl bg-[#21262d] p-3">
      <p className="text-xs text-[#8b949e]">{label}</p>
      <p className={`mt-0.5 text-lg font-bold ${colorMap[color]}`}>{value}</p>
    </div>
  )
}
