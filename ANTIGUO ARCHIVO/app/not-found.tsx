import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20 text-center sm:px-8 lg:px-10">
      <div className="inline-flex rounded-[2rem] border border-brand-wine/10 bg-white/95 p-10 shadow-soft">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.32em] text-brand-violet">No encontrado</p>
          <h1 className="text-4xl font-semibold text-brand-soft sm:text-5xl">No pudimos encontrar esa edición.</h1>
          <p className="mx-auto max-w-2xl text-base leading-8 text-[#544b45]">
            Regresa al inicio y elige la edición que mejor acompañe la conversación que quieres tener.
          </p>
          <Link href="/" className="inline-flex items-center justify-center rounded-full bg-brand-wine px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#4e1c32]">
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  )
}
