import Link from 'next/link'
import { editions } from '@/data/cards'
import EditionSelector from '@/components/EditionSelector'

export default function EditionsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 pb-20 pt-10 sm:px-8 lg:px-10">
      <section className="space-y-6">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-violet">Ediciones</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.05] text-brand-soft sm:text-5xl">
            Escoge la edición que mejor acompañe la conversación que buscas tener.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#544c46]">
            Cada edición tiene un ritmo y un propósito diferente. Desde el amor íntimo hasta la conexión familiar profunda, todas invitan a hablar con presencia.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {editions.map((edition) => (
            <EditionSelector key={edition.key} edition={edition} />
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-[2rem] border border-brand-wine/10 bg-brand-cream/90 p-8 shadow-soft sm:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-violet">App premium</p>
            <h2 className="mt-3 text-3xl font-semibold text-brand-soft">Sencilla, emocional y pensada para el móvil.</h2>
          </div>
          <Link href="/" className="inline-flex items-center rounded-full border border-brand-wine/10 bg-white px-5 py-3 text-sm font-semibold text-brand-soft transition hover:border-brand-wine">
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  )
}
