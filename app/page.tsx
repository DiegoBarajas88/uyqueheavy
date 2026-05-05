import Link from 'next/link'
import { editions } from '@/data/cards'

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 pb-20 pt-10 sm:px-8 lg:px-10">
      <section className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-16">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full border border-brand-wine/20 bg-brand-cream px-4 py-2 text-sm uppercase tracking-[0.28em] text-brand-wine">
            Conversaciones con intención
          </span>
          <h1 className="mt-7 max-w-2xl text-4xl font-semibold leading-[1.05] text-brand-soft sm:text-5xl">
            Un espacio digital para abrir la conversación y reconectar con quienes amas.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#4a433f] sm:text-xl">
            Una experiencia móvil, elegante y simple que guía cada encuentro emocional sin parecer un juego. Cada carta invita a hablar con calma, escuchar de verdad y sentir más cerca.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link href="/editions" className="inline-flex items-center justify-center rounded-full bg-brand-wine px-8 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-[#4e1c32]">
              Empezar experiencia
            </Link>
            <a href="#editions" className="inline-flex items-center justify-center rounded-full border border-brand-wine/10 bg-white/90 px-8 py-3 text-sm font-semibold text-brand-soft transition hover:border-brand-wine">
              Ver ediciones
            </a>
            <a href="#" className="inline-flex items-center justify-center rounded-full border border-brand-wine/10 bg-brand-cream px-8 py-3 text-sm font-semibold text-brand-wine transition hover:bg-brand-wine/5">
              Comprar producto físico
            </a>
          </div>
        </div>
        <div className="rounded-[2rem] border border-brand-wine/10 bg-white/85 p-8 shadow-soft backdrop-blur-sm sm:p-10">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.32em] text-brand-violet">Cómo funciona</p>
            <div className="space-y-5 text-sm text-[#584f4a] sm:text-base">
              <div className="grid gap-3 rounded-3xl border border-brand-wine/10 bg-brand-cream/80 p-5">
                <strong className="text-brand-soft">1. Elige una edición</strong>
                <span>Selecciona el tono que mejor encaja con la relación que quieres nutrir.</span>
              </div>
              <div className="grid gap-3 rounded-3xl border border-brand-wine/10 bg-brand-cream/80 p-5">
                <strong className="text-brand-soft">2. Abre una carta</strong>
                <span>Recibe una pregunta clara y profunda en cada paso.</span>
              </div>
              <div className="grid gap-3 rounded-3xl border border-brand-wine/10 bg-brand-cream/80 p-5">
                <strong className="text-brand-soft">3. Conversa sin protocolo</strong>
                <span>Escucha, siente y comparte con tranquilidad. Sin ruido digital, solo conexión real.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="editions" className="mt-20">
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-brand-wine/10 pb-5">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-violet">Ediciones</p>
            <h2 className="mt-3 text-3xl font-semibold text-brand-soft sm:text-4xl">Escoge el tono que quieres para esta charla.</h2>
          </div>
          <Link href="/editions" className="hidden rounded-full border border-brand-wine/10 bg-white/90 px-5 py-2 text-sm font-semibold text-brand-soft transition hover:border-brand-wine sm:inline-flex">
            Ver todas las ediciones
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {editions.map((edition) => (
            <article key={edition.key} className="rounded-[2rem] border border-brand-wine/10 bg-white/90 px-6 py-8 shadow-soft transition hover:-translate-y-1 hover:border-brand-violet/20">
              <p className="text-xs uppercase tracking-[0.32em] text-brand-violet">{edition.theme}</p>
              <h3 className="mt-4 text-2xl font-semibold text-brand-soft">{edition.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#4f443f]">{edition.description}</p>
              <Link href={`/experience/${edition.key}`} className="mt-8 inline-flex items-center rounded-full border border-brand-wine/10 bg-brand-wine px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4e1c32]">
                Iniciar
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
