import { notFound } from 'next/navigation'
import { editionMap } from '@/data/cards'
import ExperienceFlow from '@/components/ExperienceFlow'

interface ExperiencePageProps {
  params: { edition: string }
}

export default function ExperiencePage({ params }: ExperiencePageProps) {
  const edition = editionMap[params.edition as keyof typeof editionMap]

  if (!edition) {
    notFound()
  }

  return (
    <main className="mx-auto max-w-6xl px-6 pb-20 pt-10 sm:px-8 lg:px-10">
      <section className="space-y-8">
        <div className="rounded-[2rem] border border-brand-wine/10 bg-white/95 p-8 shadow-soft sm:p-10">
          <p className="text-sm uppercase tracking-[0.32em] text-brand-violet">{edition.theme}</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.05] text-brand-soft sm:text-5xl">{edition.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#514844]">{edition.description}</p>
        </div>
        <ExperienceFlow editionKey={edition.key} />
      </section>
    </main>
  )
}
