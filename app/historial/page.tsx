'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { todayISO } from '@/lib/utils'
import { useRides } from '@/lib/hooks/useRides'
import { useDailySummary } from '@/lib/hooks/useDailySummary'
import DayNavigator from '@/components/DayNavigator'
import SummaryCards from '@/components/SummaryCards'
import RideCard from '@/components/RideCard'
import DeleteConfirmModal from '@/components/DeleteConfirmModal'

export default function HistorialPage() {
  const [date, setDate] = useState(todayISO())
  const { rides, isLoading, removeRide } = useRides(date)
  const { summary } = useDailySummary(date)

  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  async function confirmDelete() {
    if (!pendingDelete) return
    const id = pendingDelete
    setPendingDelete(null)
    try {
      await removeRide(id)
      toast.success('Carrera eliminada')
    } catch {
      toast.error('Error al eliminar')
    }
  }

  return (
    <div className="flex flex-col gap-4 pt-4">
      <div className="px-4">
        <h1 className="text-2xl font-bold text-[#f0f6fc]">Historial</h1>
      </div>

      <DayNavigator date={date} onChange={setDate} />

      <SummaryCards summary={summary} />

      <div className="px-4">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#8b949e]">
          Carreras del día
        </h2>

        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-[#161b22]" />
            ))}
          </div>
        ) : rides.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-[#8b949e]">
            <span className="text-5xl">🚕</span>
            <p className="text-sm">Sin carreras este día</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {rides.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
                onDelete={(id) => setPendingDelete(id)}
              />
            ))}
          </div>
        )}
      </div>

      <DeleteConfirmModal
        open={!!pendingDelete}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
