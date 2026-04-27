'use client'

import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import NumericKeypad, { centsToDisplay } from '@/components/NumericKeypad'
import PaymentMethodSelector from '@/components/PaymentMethodSelector'
import { useRides } from '@/lib/hooks/useRides'
import { LAST_PAYMENT_KEY, todayISO } from '@/lib/utils'
import type { PaymentMethod } from '@/types'

export default function NuevaCarreraPage() {
  const today = todayISO()
  const { addRide } = useRides(today)

  const [cents, setCents] = useState(0)
  const [payment, setPayment] = useState<PaymentMethod | null>(null)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  // Restore last payment method
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
      await addRide({
        amount: cents / 100,
        payment_method: payment!,
        notes: notes.trim() || null,
      })
      toast.success('Carrera guardada ✓')
      setCents(0)
      setNotes('')
    } catch {
      toast.error('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-5 pt-6">
      {/* Header */}
      <div className="px-4">
        <h1 className="text-2xl font-bold text-[#f0f6fc]">Nueva carrera</h1>
        <p className="text-sm text-[#8b949e]">
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
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

      {/* Numeric keypad */}
      <NumericKeypad cents={cents} onChange={setCents} />

      {/* Notes field */}
      <div className="px-4">
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notas (opcional)"
          maxLength={120}
          className="w-full rounded-2xl bg-[#161b22] px-4 py-3 text-sm text-[#f0f6fc] placeholder-[#8b949e] outline-none focus:ring-2 focus:ring-[#f5c518]/40"
        />
      </div>

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
    </div>
  )
}
