'use client'

interface Props {
  cents: number
  onChange: (cents: number) => void
  maxCents?: number
  leftSlot?: React.ReactNode
}

const MAX_CENTS = 999999 // 9999.99 €

export default function NumericKeypad({ cents, onChange, maxCents = MAX_CENTS, leftSlot }: Props) {
  function press(digit: number) {
    const next = cents * 10 + digit
    if (next <= maxCents) onChange(next)
  }

  function backspace() {
    onChange(Math.floor(cents / 10))
  }

  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  return (
    <div className="grid grid-cols-3 gap-3 px-4">
      {keys.map((k) => (
        <button
          key={k}
          type="button"
          onPointerDown={() => press(k)}
          className="flex items-center justify-center rounded-2xl bg-[#21262d] text-2xl font-semibold text-[#f0f6fc] active:bg-[#30363d] active:scale-95 transition-all"
          style={{ height: 64 }}
        >
          {k}
        </button>
      ))}

      {/* Bottom row: leftSlot | 0 | backspace */}
      {leftSlot ?? <div />}

      <button
        type="button"
        onPointerDown={() => press(0)}
        className="flex items-center justify-center rounded-2xl bg-[#21262d] text-2xl font-semibold text-[#f0f6fc] active:bg-[#30363d] active:scale-95 transition-all"
        style={{ height: 64 }}
      >
        0
      </button>

      <button
        type="button"
        onPointerDown={backspace}
        className="flex items-center justify-center rounded-2xl bg-[#21262d] text-2xl text-[#8b949e] active:bg-[#30363d] active:scale-95 transition-all"
        style={{ height: 64 }}
      >
        ⌫
      </button>
    </div>
  )
}

export function centsToDisplay(cents: number): string {
  const euros = Math.floor(cents / 100)
  const centsPart = cents % 100
  return `${euros},${String(centsPart).padStart(2, '0')} €`
}
