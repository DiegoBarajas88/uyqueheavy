interface ModeSelectorProps {
  modes: string[]
  selected: string
  onSelect: (mode: string) => void
}

export default function ModeSelector({ modes, selected, onSelect }: ModeSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {modes.map((mode) => {
        const isActive = mode === selected
        return (
          <button
            key={mode}
            type="button"
            onClick={() => onSelect(mode)}
            aria-pressed={isActive}
            className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${isActive ? 'border-brand-wine bg-brand-wine text-white shadow-soft' : 'border-brand-wine/10 bg-white text-brand-soft hover:border-brand-violet/20 hover:bg-brand-cream/80'}`}
          >
            {mode}
          </button>
        )
      })}
    </div>
  )
}
