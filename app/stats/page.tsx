'use client'

import dynamic from 'next/dynamic'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useStats } from '@/lib/hooks/useStats'
import { formatAmount, formatTime } from '@/lib/utils'
import type { Ride } from '@/types'

const WeeklyChart = dynamic(() => import('@/components/WeeklyChart'), { ssr: false })

async function downloadWeekPDF(
  weekRides: Ride[],
  weekFrom: string,
  weekTo: string
) {
  const { default: jsPDF } = await import('jspdf')
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const fromLabel = format(parseISO(weekFrom), "d 'de' MMMM", { locale: es })
  const toLabel = format(parseISO(weekTo), "d 'de' MMMM 'de' yyyy", { locale: es })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('FakeTaxi – Resumen semanal', 14, 20)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(120)
  doc.text(`${fromLabel} – ${toLabel}`, 14, 28)
  doc.setTextColor(0)

  let y = 38

  // Group rides by date
  const byDate = new Map<string, Ride[]>()
  for (const ride of weekRides) {
    if (!byDate.has(ride.date)) byDate.set(ride.date, [])
    byDate.get(ride.date)!.push(ride)
  }

  // Sort days
  const sortedDays = Array.from(byDate.entries()).sort(([a], [b]) => a.localeCompare(b))

  for (const [date, rides] of sortedDays) {
    if (y > 260) { doc.addPage(); y = 20 }

    const dayLabel = format(parseISO(date), "EEEE d 'de' MMMM", { locale: es })
    const dayTotal = rides.reduce((s, r) => s + Number(r.amount), 0)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text(dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1), 14, y)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(80)
    doc.text(`${rides.length} carreras · Total ${formatAmount(dayTotal)}`, 14, y + 6)
    doc.setTextColor(0)
    y += 13

    for (const ride of rides.sort((a, b) => a.created_at.localeCompare(b.created_at))) {
      if (y > 270) { doc.addPage(); y = 20 }
      const payment = ride.payment_method === 'cash' ? 'Efectivo' : 'Tarjeta'
      const notes = ride.notes ? `  ${ride.notes}` : ''
      doc.setFontSize(10)
      doc.text(`${formatTime(ride.created_at)}`, 18, y)
      doc.setFont('helvetica', 'bold')
      doc.text(`${formatAmount(Number(ride.amount))}`, 38, y)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100)
      doc.text(`${payment}${notes}`, 70, y)
      doc.setTextColor(0)
      y += 7
    }

    // Day divider
    doc.setDrawColor(200)
    doc.line(14, y, 196, y)
    y += 6
  }

  // Week total
  const weekTotal = weekRides.reduce((s, r) => s + Number(r.amount), 0)
  if (y > 265) { doc.addPage(); y = 20 }
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text(`Total semana: ${formatAmount(weekTotal)}`, 14, y + 4)

  doc.save(`faketaxi-semana-${weekFrom}.pdf`)
}

export default function StatsPage() {
  const { weekStats, weekRides, monthStats, week, month, isLoading } = useStats(new Date())

  const weekTotal = weekStats.reduce((s, d) => s + d.total_amount, 0)
  const weekRidesCount = weekStats.reduce((s, d) => s + d.total_rides, 0)

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
            {weekRidesCount} carreras
          </span>
        </p>
        {isLoading ? (
          <div className="h-44 animate-pulse rounded-xl bg-[#21262d]" />
        ) : (
          <WeeklyChart data={weekStats} />
        )}

        {/* PDF download button */}
        <button
          type="button"
          disabled={isLoading || weekRides.length === 0}
          onClick={() => downloadWeekPDF(weekRides, week.from, week.to)}
          className={`mt-4 w-full rounded-xl py-3 text-sm font-semibold transition-all active:scale-[0.98] ${
            weekRides.length > 0
              ? 'bg-[#f5c518] text-[#0d1117]'
              : 'bg-[#21262d] text-[#30363d]'
          }`}
        >
          Descargar PDF de la semana
        </button>
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
