'use client'

import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import NumericKeypad, { centsToDisplay } from '@/components/NumericKeypad'
import PaymentMethodSelector from '@/components/PaymentMethodSelector'
import { useRides } from '@/lib/hooks/useRides'
import { useShift } from '@/lib/hooks/useShift'
import { LAST_PAYMENT_KEY, todayISO } from '@/lib/utils'
import type { PaymentMethod } from '@/types'

export default function NuevaCarreraPage() {
  const { shift, startShift, endShift, mounted } = useShift()
  const rideDate = shift?.startDate ?? todayISO()
  const { addRide } = useRides(rideDate)

  const [cents, setCents] = useState(0)
  const [payment, setPayment] = useState<PaymentMethod | null>(null)
  const [saving, setSaving] = useState(false)
  const [confirm, setConfirm] = useState<'start' | 'end' | null>(null)

  useEffect(() => {
    const last = localStorage.getItem(LAST_PAYMENT_KEY()) as PaymentMethod | null
    if (last) setPayment(last)
  }, [])

  const canSave = payment !== null && cents > 0

  const handlePaymentChange = useCallback((method: PaymentMethod) => {
    setPayment(method)
    localStorage.setItem(LAST_PAYMENT_KEY(), method)
  }, [])

  async function handleSave() {
    if (!canSave || saving) return
    setSaving(true)
    try {
      await addRide({ amount: cents / 100, payment_method: payment!, notes: null })
      toast.success('Carrera guardada ✓')
      setCents(0)
    } catch {
      toast.error('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  function handleConfirm() {
    if (confirm === 'start') startShift()
    else if (confirm === 'end') endShift()
    setConfirm(null)
  }

  function formatShiftStart(iso: string) {
    return new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }

  const shiftButton = mounted ? (
    shift ? (
      <button
        type="button"
        onClick={() => setConfirm('end')}
        className="flex flex-col items-center justify-center gap-0.5 rounded-2xl bg-[#f85149]/20 text-[#f85149] active:bg-[#f85149]/30 active:scale-95 transition-all"
        style={{ height: 64 }}
      >
        <span className="text-xl leading-none">■</span>
        <span className="text-[10px] font-semibold leading-none">Turno</span>
      </button>
    ) : (
      <button
        type="button"
        onClick={() => setConfirm('start')}
        className="flex flex-col items-center justify-center gap-0.5 rounded-2xl bg-[#3fb950]/20 text-[#3fb950] active:bg-[#3fb950]/30 active:scale-95 transition-all"
        style={{ height: 64 }}
      >
        <span className="text-xl leading-none">▶</span>
        <span className="text-[10px] font-semibold leading-none">Turno</span>
      </button>
    )
  ) : <div style={{ height: 64 }} />

  return (
    <div className="flex flex-col gap-5 pt-6">
      {/* Header */}
      <div className="px-4">
        <h1 className="text-2xl font-bold text-[#f0f6fc]">Nueva carrera</h1>
        {mounted && shift ? (
          <p className="text-sm text-[#3fb950]">
            Turno activo desde las {formatShiftStart(shift.startedAt)}
          </p>
        ) : (
          <p className="text-sm text-[#8b949e]">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        )}
      </div>

      {/* Payment method */}
      <PaymentMethodSelector value={payment} onChange={handlePaymentChange} />

      {/* Amount display */}
      <div className="mx-4 flex items-center justify-center rounded-2xl bg-[#161b22] py-6">
        <span
          className={`text-5xl font-bold tabular-nums transition-colors ${
            cents > 0 ? 'text-[#f5c518]' : 'text-[#30363d]'
          }`}
        >
          {centsToDisplay(cents)}
        </span>
      </div>

      {/* Numeric keypad with shift button in bottom-left slot */}
      <NumericKeypad cents={cents} onChange={setCents} leftSlot={shiftButton} />

      {/* Save button */}
      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave || saving}
          className={`w-full rounded-2xl py-4 text-lg font-bold transition-all active:scale-[0.98] ${
            canSave
              ? 'bg-[#f5c518] text-[#0d1117] shadow-lg shadow-[#f5c518]/20'
              : 'bg-[#21262d] text-[#30363d]'
          }`}
        >
          {saving ? 'Guardando…' : 'Guardar carrera'}
        </button>
      </div>

      {/* Confirmation modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 pb-8 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#161b22] p-6">
            <p className="mb-1 text-lg font-bold text-[#f0f6fc]">
              {confirm === 'start' ? '¿Iniciar turno?' : '¿Terminar turno?'}
            </p>
            <p className="mb-6 text-sm text-[#8b949e]">
              {confirm === 'start'
                ? 'Las carreras de esta sesión se guardarán bajo la fecha de hoy.'
                : 'El turno quedará cerrado. Podrás descargar el resumen en Stats.'}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirm(null)}
                className="flex-1 rounded-xl bg-[#21262d] py-3 font-semibold text-[#8b949e] active:bg-[#30363d]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className={`flex-1 rounded-xl py-3 font-semibold ${
                  confirm === 'start'
                    ? 'bg-[#3fb950] text-black'
                    : 'bg-[#f85149] text-white'
                }`}
              >
                {confirm === 'start' ? 'Iniciar' : 'Terminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
