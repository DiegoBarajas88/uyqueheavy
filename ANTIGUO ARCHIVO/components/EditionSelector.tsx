import Link from 'next/link'
import type { Edition } from '@/data/cards'

interface EditionSelectorProps {
  edition: Edition
}

export default function EditionSelector({ edition }: EditionSelectorProps) {
  return (
    <article className="group rounded-[2rem] border border-brand-wine/10 bg-white/90 p-6 shadow-soft transition hover:-translate-y-1 hover:border-brand-violet/20">
      <div className="space-y-3">
        <div className="inline-flex rounded-full border border-brand-wine/10 bg-brand-cream/90 px-3 py-1 text-xs uppercase tracking-[0.28em] text-brand-violet">
          {edition.theme}
        </div>
        <h2 className="text-2xl font-semibold text-brand-soft">{edition.title}</h2>
        <p className="text-sm leading-7 text-[#554b45]">{edition.description}</p>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {edition.categories.slice(0, 3).map((category) => (
          <span key={category.key} className="rounded-full border border-brand-wine/10 bg-brand-cream/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-brand-soft">
            {category.label}
          </span>
        ))}
      </div>
      <Link href={`/experience/${edition.key}`} className="mt-8 inline-flex items-center rounded-full border border-brand-wine/10 bg-brand-wine px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4e1c32]">
        Iniciar
      </Link>
    </article>
  )
}
