import type { DailySummary } from '@/types'
import { formatAmount } from '@/lib/utils'

interface Props {
  summary: DailySummary | null
}

export default function SummaryCards({ summary }: Props) {
  const s = summary ?? { total_rides: 0, total_amount: 0, cash_amount: 0, card_amount: 0 }

  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      <StatCard label="Carreras" value={String(s.total_rides)} color="yellow" />
      <StatCard label="Total" value={formatAmount(Number(s.total_amount))} color="yellow" />
      <StatCard label="Efectivo" value={formatAmount(Number(s.cash_amount))} color="green" />
      <StatCard label="Tarjeta" value={formatAmount(Number(s.card_amount))} color="blue" />
    </div>
  )
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color: 'yellow' | 'green' | 'blue'
}) {
  const colorMap = {
    yellow: 'text-[#f5c518]',
    green: 'text-[#3fb950]',
    blue: 'text-[#58a6ff]',
  }

  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-[#161b22] p-4">
      <span className="text-xs font-medium uppercase tracking-wide text-[#8b949e]">{label}</span>
      <span className={`text-xl font-bold ${colorMap[color]}`}>{value}</span>
    </div>
  )
}
