'use client'

import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { todayISO } from '@/lib/utils'
import { useRides } from '@/lib/hooks/useRides'
import { useDailySummary } from '@/lib/hooks/useDailySummary'
import { useDailyKm } from '@/lib/hooks/useDailyKm'
import DayNavigator from '@/components/DayNavigator'
import SummaryCards from '@/components/SummaryCards'
import RideCard from '@/components/RideCard'
import DeleteConfirmModal from '@/components/DeleteConfirmModal'
import RideFormModal from '@/components/RideFormModal'
import type { Ride, PaymentMethod } from '@/types'

export default function HistorialPage() {
  const [date, setDate] = useState(todayISO())
  const { rides, isLoading, addRide, editRide, removeRide } = useRides(date)
  const { summary } = useDailySummary(date)
  const { km, setKm } = useDailyKm(date)

  const [pendingDelete, setPendingDelete] = useState<string | null>(null)
  const [editingRide, setEditingRide] = useState<Ride | null>(null)
  const [addingRide, setAddingRide] = useState(false)

  // km inline edit
  const [kmEditing, setKmEditing] = useState(false)
  const [kmInput, setKmInput] = useState('')
  const kmSavingRef = useRef(false)

  function openKmEdit() {
    setKmInput(km !== null ? String(km) : '')
    setKmEditing(true)
  }

  async function handleKmSave() {
    if (kmSavingRef.current || !kmEditing) return
    kmSavingRef.current = true
    setKmEditing(false)
    const val = parseFloat(kmInput.replace(',', '.'))
    if (!isNaN(val) && val >= 0) {
      try {
        await setKm(val)
      } catch {
        toast.error('Error al guardar km')
      }
    }
    kmSavingRef.current = false
  }

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

  const modalKey = editingRide ? `edit-${editingRide.id}` : `add-${date}`
  const modalOpen = addingRide || !!editingRide

  async function handleModalSave(amount: number, payment: PaymentMethod) {
    if (editingRide) {
      await editRide(editingRide.id, { amount, payment_method: payment })
      toast.success('Carrera actualizada')
    } else {
      await addRide({ amount, payment_method: payment })
      toast.success('Carrera guardada')
    }
    setAddingRide(false)
    setEditingRide(null)
  }

  return (
    <div className="flex flex-col gap-4 pt-4">
      <div className="flex items-center justify-between px-4">
        <h1 className="text-2xl font-bold text-[#f0f6fc]">Historial</h1>
        <button
          type="button"
          onClick={() => setAddingRide(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5c518] text-[#0d1117] text-xl font-bold active:scale-95 transition-transform"
        >
          +
        </button>
      </div>

      <DayNavigator date={date} onChange={setDate} />

      <SummaryCards summary={summary} />

      {/* Km del día */}
      <div className="px-4">
        <div className="flex items-center gap-3 rounded-2xl bg-[#161b22] px-4 py-3">
          <span className="shrink-0 text-sm text-[#8b949e]">Km del día</span>
          {kmEditing ? (
            <>
              <input
                type="number"
                inputMode="decimal"
                autoFocus
                value={kmInput}
                onChange={(e) => setKmInput(e.target.value)}
                onBlur={handleKmSave}
                onKeyDown={(e) => e.key === 'Enter' && handleKmSave()}
                className="flex-1 bg-transparent text-right text-lg font-bold text-[#f0f6fc] outline-none"
                placeholder="0"
              />
              <span className="text-sm text-[#8b949e]">km</span>
              <button
                type="button"
                onPointerDown={(e) => e.preventDefault()}
                onClick={handleKmSave}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3fb950] text-white font-bold"
              >
                ✓
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={openKmEdit}
              className="flex flex-1 items-center justify-end gap-2 text-right"
            >
              <span className="text-lg font-bold text-[#f0f6fc]">
                {km !== null ? `${km} km` : '— km'}
              </span>
              <span className="text-xs text-[#8b949e]">✎</span>
            </button>
          )}
        </div>
      </div>

      <div className="px-4">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#8b949e]">
          Carreras del día
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-[#161b22]" />
            ))}
          </div>
        ) : rides.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-[#8b949e]">
            <span className="text-5xl">🚕</span>
            <p className="text-sm">Sin carreras este día</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {/* Efectivo column */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#3fb950]">Efectivo</p>
              {rides.filter((r) => r.payment_method === 'cash').length === 0 ? (
                <p className="text-xs text-[#8b949e]">—</p>
              ) : (
                rides
                  .filter((r) => r.payment_method === 'cash')
                  .map((ride) => (
                    <RideCard
                      key={ride.id}
                      ride={ride}
                      onDelete={(id) => setPendingDelete(id)}
                      onEdit={(r) => setEditingRide(r)}
                      hideBadge
                    />
                  ))
              )}
            </div>

            {/* Tarjeta column */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#58a6ff]">Tarjeta</p>
              {rides.filter((r) => r.payment_method !== 'cash').length === 0 ? (
                <p className="text-xs text-[#8b949e]">—</p>
              ) : (
                rides
                  .filter((r) => r.payment_method !== 'cash')
                  .map((ride) => (
                    <RideCard
                      key={ride.id}
                      ride={ride}
                      onDelete={(id) => setPendingDelete(id)}
                      onEdit={(r) => setEditingRide(r)}
                      hideBadge
                    />
                  ))
              )}
            </div>
          </div>
        )}
      </div>

      <DeleteConfirmModal
        open={!!pendingDelete}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      <RideFormModal
        key={modalKey}
        open={modalOpen}
        title={editingRide ? 'Editar carrera' : 'Nueva carrera'}
        initialAmount={editingRide ? Number(editingRide.amount) : 0}
        initialPayment={editingRide?.payment_method ?? null}
        onClose={() => { setAddingRide(false); setEditingRide(null) }}
        onSave={handleModalSave}
      />
    </div>
  )
}
