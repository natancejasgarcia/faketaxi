'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { WeekStat } from '@/types'
import { todayISO } from '@/lib/utils'

interface Props {
  data: WeekStat[]
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload as WeekStat
  return (
    <div className="rounded-xl bg-[#21262d] px-3 py-2 text-sm shadow-lg border border-[#30363d]">
      <p className="font-bold text-[#f0f6fc]">{d.total_amount.toFixed(2)} €</p>
      <p className="text-[#8b949e]">{d.total_rides} carreras</p>
    </div>
  )
}

export default function WeeklyChart({ data }: Props) {
  const today = todayISO()

  if (!data.length) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-[#8b949e]">
        Sin datos esta semana
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <XAxis
          dataKey="label"
          tick={{ fill: '#8b949e', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#8b949e', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}€`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#30363d', radius: 8 }} />
        <Bar dataKey="total_amount" radius={[6, 6, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.date}
              fill={entry.date === today ? '#f5c518' : '#58a6ff'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
