interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-[#655d55]">
        <span>Carta {current} de {total}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-brand-cream">
        <div className="h-full rounded-full bg-brand-wine transition-all" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
