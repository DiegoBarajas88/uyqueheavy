interface CardProps {
  text: string
  category: string
}

export default function Card({ text, category }: CardProps) {
  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-brand-wine/10 bg-gradient-to-br from-white via-[#f6eee8] to-[#f8f0e9] p-8 text-[#4f453f] shadow-soft">
      <div className="absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle_at_top,_rgba(155,87,112,0.12),transparent_45%)]" />
      <div className="relative space-y-4">
        <span className="inline-flex rounded-full border border-brand-wine/10 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.28em] text-brand-violet shadow-sm">
          {category}
        </span>
        <p className="text-xl leading-9 text-brand-soft sm:text-2xl">{text}</p>
      </div>
    </article>
  )
}
