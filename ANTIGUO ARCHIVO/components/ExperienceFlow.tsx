'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { editionMap, type EditionKey } from '@/data/cards'
import Card from './Card'
import CategorySelector from './CategorySelector'
import ProgressBar from './ProgressBar'

interface ExperienceFlowProps {
  editionKey: string
}

export default function ExperienceFlow({ editionKey }: ExperienceFlowProps) {
  const edition = editionMap[editionKey as EditionKey]
  const [selectedCategory, setSelectedCategory] = useState(edition.categories[0]?.key ?? '')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [finished, setFinished] = useState(false)
  const [shareStatus, setShareStatus] = useState('')

  const filteredCards = useMemo(
    () => edition.cards.filter((card) => card.category === selectedCategory),
    [edition.cards, selectedCategory]
  )

  const totalCards = filteredCards.length
  const currentCard = filteredCards[currentIndex]

  useEffect(() => {
    setSelectedCategory(edition.categories[0]?.key ?? '')
    setCurrentIndex(0)
    setFinished(false)
    setShareStatus('')
  }, [editionKey, edition.categories])

  const handleNext = () => {
    if (currentIndex + 1 >= totalCards) {
      setFinished(true)
      return
    }
    setCurrentIndex((state) => state + 1)
    setShareStatus('')
  }

  const handleRestart = () => {
    setFinished(false)
    setCurrentIndex(0)
    setShareStatus('')
  }

  const handleChangeCategory = () => {
    const currentCategoryIndex = edition.categories.findIndex((category) => category.key === selectedCategory)
    const nextCategory = edition.categories[(currentCategoryIndex + 1) % edition.categories.length]
    setSelectedCategory(nextCategory.key)
    setCurrentIndex(0)
    setShareStatus('')
  }

  const handleShare = async () => {
    const shareText = `UY QUE HEAVY – ${edition.title}: ${currentCard?.text ?? 'Una carta para conectar.'}`
    if (navigator.share) {
      try {
        await navigator.share({ title: edition.title, text: shareText })
        setShareStatus('Compartido con éxito')
      } catch {
        setShareStatus('No se compartió')
      }
      return
    }

    try {
      await navigator.clipboard.writeText(shareText)
      setShareStatus('Texto copiado al portapapeles')
    } catch {
      setShareStatus('No se pudo copiar el texto')
    }
  }

  if (finished) {
    return (
      <section className="space-y-8 rounded-[2rem] border border-brand-wine/10 bg-white/95 p-8 shadow-soft sm:p-10">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.32em] text-brand-violet">Fin de la experiencia</p>
          <h2 className="text-3xl font-semibold text-brand-soft">Gracias por permitir que la conversación sucediera.</h2>
          <p className="text-base leading-8 text-[#564d47]">
            Esta experiencia está pensada para dejar una sensación de calma, cercanía y una conexión más auténtica con la otra persona.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <button onClick={handleRestart} className="rounded-full bg-brand-wine px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4e1c32]">
            Reiniciar
          </button>
          <button onClick={handleShare} className="rounded-full border border-brand-wine/10 bg-white px-5 py-3 text-sm font-semibold text-brand-soft transition hover:border-brand-violet/20">
            Compartir experiencia
          </button>
          <Link href="/editions" className="rounded-full border border-brand-wine/10 bg-brand-cream px-5 py-3 text-sm font-semibold text-brand-soft transition hover:border-brand-violet/20">
            Elegir otra edición
          </Link>
        </div>
        {shareStatus ? <p className="text-sm text-[#6f625b]">{shareStatus}</p> : null}
      </section>
    )
  }

  return (
    <section className="space-y-8 rounded-[2rem] border border-brand-wine/10 bg-white/95 p-8 shadow-soft sm:p-10">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-brand-violet">{edition.title}</p>
            <h2 className="mt-3 text-3xl font-semibold text-brand-soft">Elige una categoría dentro de esta edición.</h2>
          </div>
          <div className="rounded-3xl bg-brand-cream/90 px-4 py-3 text-sm text-[#574f49] shadow-sm">
            <span className="font-semibold">{totalCards}</span> cartas disponibles en esta categoría
          </div>
        </div>
        <p className="text-base leading-7 text-[#564d47]">
          Cada edición tiene sus propias categorías para acompañar un tipo de relación distinto. Aquí no hay modos extra: la edición define el tono y la categoría abre la conversación.
        </p>
        <CategorySelector
          categories={edition.categories}
          selected={selectedCategory}
          onSelect={(key) => {
            setSelectedCategory(key)
            setCurrentIndex(0)
            setShareStatus('')
          }}
        />
      </div>

      <div className="space-y-6">
        {currentCard ? (
          <div className="animate-fade-in">
            <Card text={currentCard.text} category={currentCard.category} />
            <div className="mt-6">
              <ProgressBar current={currentIndex + 1} total={totalCards} />
            </div>
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-brand-wine/10 bg-brand-cream/90 p-8 text-[#564d47]">No hay cartas para esta categoría aún. Elige otra categoría para continuar.</div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <button type="button" onClick={handleNext} className="rounded-full bg-brand-wine px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4e1c32]">
          {currentIndex + 1 >= totalCards ? 'Finalizar' : 'Siguiente'}
        </button>
        <button type="button" onClick={handleChangeCategory} className="rounded-full border border-brand-wine/10 bg-white px-5 py-3 text-sm font-semibold text-brand-soft transition hover:border-brand-violet/20">
          Cambiar categoría
        </button>
        <Link href="/" className="rounded-full border border-brand-wine/10 bg-brand-cream px-5 py-3 text-sm font-semibold text-brand-soft transition hover:border-brand-violet/20">
          Salir
        </Link>
      </div>
      {shareStatus ? (
        <p className="text-sm text-[#6f625b]" role="status" aria-live="polite">
          {shareStatus}
        </p>
      ) : null}
    </section>
  )
}
