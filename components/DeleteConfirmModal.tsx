'use client'

interface Props {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirmModal({ open, onConfirm, onCancel }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-8">
      <div className="w-full max-w-sm rounded-2xl bg-[#161b22] p-6 shadow-2xl">
        <h2 className="mb-2 text-lg font-bold text-[#f0f6fc]">¿Borrar carrera?</h2>
        <p className="mb-6 text-sm text-[#8b949e]">Esta acción no se puede deshacer.</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl bg-[#21262d] py-3 font-semibold text-[#f0f6fc] active:bg-[#30363d]"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-[#f85149] py-3 font-semibold text-white active:bg-[#da3633]"
          >
            Borrar
          </button>
        </div>
      </div>
    </div>
  )
}
