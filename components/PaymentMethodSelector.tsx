'use client'

import type { PaymentMethod } from '@/types'

interface Props {
  value: PaymentMethod | null
  onChange: (method: PaymentMethod) => void
}

export default function PaymentMethodSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      <button
        type="button"
        onClick={() => onChange('cash')}
        className={`flex flex-col items-center justify-center gap-2 rounded-2xl py-5 font-bold text-lg transition-all active:scale-95 ${
          value === 'cash'
            ? 'bg-[#3fb950] text-white shadow-lg shadow-[#3fb950]/30'
            : 'bg-[#21262d] text-[#8b949e]'
        }`}
        style={{ minHeight: 88 }}
      >
        <span className="text-3xl">💵</span>
        <span>Efectivo</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('card')}
        className={`flex flex-col items-center justify-center gap-2 rounded-2xl py-5 font-bold text-lg transition-all active:scale-95 ${
          value === 'card'
            ? 'bg-[#58a6ff] text-white shadow-lg shadow-[#58a6ff]/30'
            : 'bg-[#21262d] text-[#8b949e]'
        }`}
        style={{ minHeight: 88 }}
      >
        <span className="text-3xl">💳</span>
        <span>Tarjeta</span>
      </button>
    </div>
  )
}
