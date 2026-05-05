'use client'

import { useState } from 'react'
import PaymentMethodSelector from './PaymentMethodSelector'
import NumericKeypad, { centsToDisplay } from './NumericKeypad'
import type { PaymentMethod } from '@/types'

interface Props {
  open: boolean
  title?: string
  initialAmount?: number
  initialPayment?: PaymentMethod | null
  onClose: () => void
  onSave: (amount: number, payment: PaymentMethod) => Promise<void>
}

export default function RideFormModal({
  open,
  title = 'Nueva carrera',
  initialAmount = 0,
  initialPayment = null,
  onClose,
  onSave,
}: Props) {
  const [cents, setCents] = useState(() => Math.round(initialAmount * 100))
  const [payment, setPayment] = useState<PaymentMethod | null>(initialPayment)
  const [saving, setSaving] = useState(false)

  if (!open) return null

  async function handleSave() {
    if (!payment || cents === 0 || saving) return
    setSaving(true)
    try {
      await onSave(cents / 100, payment)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Sheet */}
      <div className="relative flex flex-col gap-4 rounded-t-3xl bg-[#0d1117] pt-5 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between px-4">
          <h2 className="text-lg font-bold text-[#f0f6fc]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#21262d] text-[#8b949e]"
          >
            ✕
          </button>
        </div>

        {/* Amount display */}
        <div className="px-4 text-center">
          <span className="text-5xl font-bold text-[#f5c518]">
            {centsToDisplay(cents)}
          </span>
        </div>

        <PaymentMethodSelector value={payment} onChange={setPayment} />

        <NumericKeypad cents={cents} onChange={setCents} />

        <div className="px-4">
          <button
            type="button"
            disabled={!payment || cents === 0 || saving}
            onClick={handleSave}
            className="w-full rounded-2xl bg-[#f5c518] py-4 text-lg font-bold text-[#0d1117] transition-all active:scale-[0.98] disabled:opacity-30"
          >
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
