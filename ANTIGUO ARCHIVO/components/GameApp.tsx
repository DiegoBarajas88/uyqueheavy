'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { editionMap, editions } from '@/data/cards'
import {
  MAX_PLAYERS,
  MIN_PLAYERS,
  createGameSession,
  createInitialSetup,
  editionVisuals,
  getCategory,
  syncPlayerNames,
  type GameSession,
  type GameStage,
  type RevealState,
  type SetupState
} from '@/data/game'

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

type ActionConfig = {
  label: string
  onClick: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
}

export default function GameApp() {
  const [stage, setStage] = useState<GameStage>('home')
  const [setup, setSetup] = useState<SetupState>(() => createInitialSetup())
  const [session, setSession] = useState<GameSession | null>(null)
  const [showHowTo, setShowHowTo] = useState(false)
  const [revealIndex, setRevealIndex] = useState(0)
  const [revealState, setRevealState] = useState<RevealState>('handoff')
  const [conversationIndex, setConversationIndex] = useState(0)

  const currentEdition = editionMap[setup.editionKey]
  const currentCategory = getCategory(setup.editionKey, setup.categoryKey)
  const sessionEdition = session ? editionMap[session.editionKey] : currentEdition
  const sessionCategory = session ? getCategory(session.editionKey, session.categoryKey) : currentCategory
  const activeVisual = editionVisuals[session?.editionKey ?? setup.editionKey]
  const currentRevealPlayer = session?.players[revealIndex] ?? null
  const currentConversationPlayer = session?.players[conversationIndex] ?? null

  const setupError = useMemo(() => {
    const trimmedNames = setup.playerNames.map((name) => name.trim())

    if (trimmedNames.some((name) => !name)) {
      return 'Todas las personas necesitan un nombre antes de empezar.'
    }

    const normalized = trimmedNames.map((name) => name.toLowerCase())
    const hasDuplicates = normalized.some((name, index) => normalized.indexOf(name) !== index)

    if (hasDuplicates) {
      return 'Cada participante necesita un nombre distinto para que los turnos sean claros.'
    }

    return ''
  }, [setup.playerNames])

  const homeActions: ActionConfig[] = [
    {
      label: 'Crear partida',
      onClick: () => setStage('setup'),
      variant: 'primary'
    },
    {
      label: 'Elegir edicion',
      onClick: () => setStage('setup'),
      variant: 'secondary'
    },
    {
      label: 'Como jugar',
      onClick: () => setShowHowTo(true),
      variant: 'ghost'
    }
  ]

  const setupActions: ActionConfig[] = [
    {
      label: 'Volver',
      onClick: () => setStage('home'),
      variant: 'ghost'
    },
    {
      label: 'Iniciar ronda',
      onClick: handleStartGame,
      disabled: Boolean(setupError),
      variant: 'primary'
    }
  ]

  const revealActions: ActionConfig[] = currentRevealPlayer
    ? revealState === 'handoff'
      ? [
          {
            label: 'Cancelar partida',
            onClick: resetToSetup,
            variant: 'ghost'
          },
          {
            label: 'Ver mi carta',
            onClick: () => setRevealState('visible'),
            variant: 'primary'
          }
        ]
      : [
          {
            label: revealIndex === (session?.players.length ?? 1) - 1 ? 'Ocultar y empezar ronda' : 'Ocultar y continuar',
            onClick: handleAdvanceReveal,
            variant: 'primary'
          }
        ]
    : []

  const conversationActions: ActionConfig[] = currentConversationPlayer
    ? [
        {
          label: 'Salir',
          onClick: resetToSetup,
          variant: 'ghost'
        },
        {
          label: conversationIndex === (session?.players.length ?? 1) - 1 ? 'Ver cierre' : 'Siguiente jugador',
          onClick: handleAdvanceConversation,
          variant: 'primary'
        }
      ]
    : []

  const resultActions: ActionConfig[] = [
    {
      label: 'Nueva partida',
      onClick: handleRematch,
      variant: 'primary'
    },
    {
      label: 'Volver al inicio',
      onClick: handleBackHome,
      variant: 'secondary'
    }
  ]

  return (
    <>
      <main className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(174,127,88,0.14),transparent_28%),linear-gradient(180deg,#f7efe8_0%,#efe3d8_54%,#f6ede6_100%)] text-brand-soft">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(95,32,54,0.08),transparent_24%),radial-gradient(circle_at_80%_0%,rgba(123,79,135,0.1),transparent_20%)]" />

        <div className="relative mx-auto grid min-h-screen max-w-6xl gap-6 px-4 pb-36 pt-4 sm:px-6 lg:grid-cols-[minmax(0,520px)_minmax(340px,1fr)] lg:items-stretch lg:pb-12 lg:pt-6">
          <section className="relative flex min-h-[calc(100vh-2rem)] flex-col lg:min-h-[calc(100vh-3rem)]">
            <div className="rounded-[2rem] border border-brand-wine/10 bg-white/80 p-4 shadow-soft backdrop-blur-xl sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-brand-violet">UY QUE HEAVY</p>
                  <h1 className="mt-2 text-2xl font-semibold leading-tight text-brand-soft">
                    {stage === 'home' && 'Ronda conversacional'}
                    {stage === 'setup' && 'Configura tu ronda'}
                    {stage === 'reveal-cards' && 'Cartas privadas'}
                    {stage === 'conversation-round' && 'Empieza la conversacion'}
                    {stage === 'results' && 'Lo que deja la ronda'}
                  </h1>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHowTo(true)}
                  className="inline-flex rounded-full border border-brand-wine/10 bg-brand-cream/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-wine transition hover:border-brand-wine/20"
                >
                  Guia
                </button>
              </div>

              {stage === 'home' ? <HomeScreen visualKey={setup.editionKey} /> : null}

              {stage === 'setup' ? (
                <SetupScreen
                  setup={setup}
                  currentCategoryLabel={currentCategory.label}
                  onEditionChange={(editionKey) => {
                    const nextEdition = editionMap[editionKey]
                    setSetup((currentSetup) => ({
                      ...currentSetup,
                      editionKey,
                      categoryKey: nextEdition.categories.some((category) => category.key === currentSetup.categoryKey)
                        ? currentSetup.categoryKey
                        : nextEdition.categories[0]?.key ?? ''
                    }))
                  }}
                  onCategoryChange={(categoryKey) => setSetup((currentSetup) => ({ ...currentSetup, categoryKey }))}
                  onPlayerCountChange={(playerCount) =>
                    setSetup((currentSetup) => ({
                      ...currentSetup,
                      playerCount,
                      playerNames: syncPlayerNames(playerCount, currentSetup.playerNames)
                    }))
                  }
                  onNameChange={(index, value) =>
                    setSetup((currentSetup) => ({
                      ...currentSetup,
                      playerNames: currentSetup.playerNames.map((name, currentIndex) => (currentIndex === index ? value : name))
                    }))
                  }
                  errorMessage={setupError}
                />
              ) : null}

              {stage === 'reveal-cards' && session && currentRevealPlayer ? (
                <RevealScreen
                  player={currentRevealPlayer}
                  revealIndex={revealIndex}
                  playerCount={session.players.length}
                  editionTitle={sessionEdition.title}
                  categoryLabel={sessionCategory.label}
                  revealState={revealState}
                  visual={activeVisual}
                />
              ) : null}

              {stage === 'conversation-round' && session && currentConversationPlayer ? (
                <ConversationScreen
                  player={currentConversationPlayer}
                  playerIndex={conversationIndex}
                  playerCount={session.players.length}
                  categoryLabel={sessionCategory.label}
                  editionTitle={sessionEdition.title}
                />
              ) : null}

              {stage === 'results' && session ? <ResultScreen session={session} /> : null}
            </div>
          </section>

          <aside className="hidden lg:block">
            <DesktopPreview
              stage={stage}
              editionKey={session?.editionKey ?? setup.editionKey}
              categoryLabel={session?.categoryKey ? getCategory(session.editionKey, session.categoryKey).label : currentCategory.label}
            />
          </aside>
        </div>

        <BottomActionBar
          actions={
            stage === 'home'
              ? homeActions
              : stage === 'setup'
                ? setupActions
                : stage === 'reveal-cards'
                  ? revealActions
                  : stage === 'conversation-round'
                    ? conversationActions
                    : resultActions
          }
        />
      </main>

      {showHowTo ? <HowToOverlay onClose={() => setShowHowTo(false)} /> : null}
    </>
  )

  function handleStartGame() {
    if (setupError) {
      return
    }

    const nextSession = createGameSession(setup)
    setSession(nextSession)
    setStage('reveal-cards')
    setRevealIndex(0)
    setRevealState('handoff')
    setConversationIndex(0)
  }

  function handleAdvanceReveal() {
    if (!session) {
      return
    }

    if (revealIndex === session.players.length - 1) {
      setStage('conversation-round')
      setRevealState('handoff')
      setConversationIndex(0)
      return
    }

    setRevealIndex((currentIndex) => currentIndex + 1)
    setRevealState('handoff')
  }

  function handleAdvanceConversation() {
    if (!session) {
      return
    }

    if (conversationIndex === session.players.length - 1) {
      setStage('results')
      return
    }

    setConversationIndex((currentIndex) => currentIndex + 1)
  }

  function resetToSetup() {
    setStage('setup')
    setSession(null)
    setRevealIndex(0)
    setRevealState('handoff')
    setConversationIndex(0)
  }

  function handleRematch() {
    setStage('setup')
    setSession(null)
    setRevealIndex(0)
    setRevealState('handoff')
    setConversationIndex(0)
  }

  function handleBackHome() {
    setStage('home')
    setSession(null)
    setRevealIndex(0)
    setRevealState('handoff')
    setConversationIndex(0)
    setShowHowTo(false)
  }
}

function HomeScreen({ visualKey }: { visualKey: keyof typeof editionVisuals }) {
  return (
    <div className="space-y-5 pb-2">
      <PhotoMosaic />

      <article className="overflow-hidden rounded-[1.8rem] border border-brand-wine/10 bg-gradient-to-br from-[#fcfaf8] via-[#f6eee8] to-[#efe0d4] p-5">
        <p className="text-xs uppercase tracking-[0.34em] text-brand-violet">Base jugable</p>
        <h2 className="mt-3 text-[2rem] font-semibold leading-[0.98] text-brand-soft">
          Una experiencia pensada para abrir conversaciones profundas entre dos o mas personas.
        </h2>
        <p className="mt-4 text-base leading-7 text-[#5b5049]">
          La edicion define el tono de la relacion y la categoria define el tipo de conversacion. Cada persona recibe una carta privada y la ronda avanza con cuidado, sin prisa, sin votacion y sin dinamicas de sospecha.
        </p>
      </article>

      <div className="grid gap-3 sm:grid-cols-3">
        <QuickFact label="Minimo" value="2 personas" />
        <QuickFact label="Flujo" value="Cartas privadas" />
        <QuickFact label="Visual" value={editionVisuals[visualKey].mood} />
      </div>

      <article className="rounded-[1.8rem] border border-brand-wine/10 bg-white/90 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-brand-violet">Lo que hace</p>
            <h3 className="mt-3 text-xl font-semibold text-brand-soft">Edicion primero, categoria despues</h3>
          </div>
          <span className="rounded-full border border-brand-wine/10 bg-brand-cream px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-brand-wine">
            MVP
          </span>
        </div>
        <div className="mt-4 space-y-3 text-sm leading-6 text-[#5f534b]">
          <p>Love, Friends, Forever y Family tienen categorias distintas porque cada relacion necesita preguntas diferentes.</p>
          <p>No hay impostores ni modos de sospecha. La app solo organiza el ritual para que la conversacion entre mejor.</p>
        </div>
      </article>
    </div>
  )
}

function SetupScreen({
  setup,
  currentCategoryLabel,
  onEditionChange,
  onCategoryChange,
  onPlayerCountChange,
  onNameChange,
  errorMessage
}: {
  setup: SetupState
  currentCategoryLabel: string
  onEditionChange: (editionKey: keyof typeof editionMap) => void
  onCategoryChange: (categoryKey: string) => void
  onPlayerCountChange: (playerCount: number) => void
  onNameChange: (index: number, value: string) => void
  errorMessage: string
}) {
  const edition = editionMap[setup.editionKey]
  const visual = editionVisuals[setup.editionKey]

  return (
    <div className="space-y-5 pb-2">
      <HeroStrip image={visual.image} eyebrow={visual.mood} title={edition.title} description={visual.spotlight} />

      <SectionCard title="1. Elige la edicion" caption="La relacion define el tono general de la ronda.">
        <div className="grid gap-3 sm:grid-cols-2">
          {editions.map((editionOption) => {
            const isSelected = editionOption.key === setup.editionKey
            const optionVisual = editionVisuals[editionOption.key]

            return (
              <button
                key={editionOption.key}
                type="button"
                onClick={() => onEditionChange(editionOption.key)}
                className={cn(
                  'group overflow-hidden rounded-[1.7rem] border text-left transition',
                  isSelected
                    ? 'border-brand-wine bg-brand-wine text-white shadow-soft'
                    : 'border-brand-wine/10 bg-white hover:-translate-y-0.5 hover:border-brand-violet/20'
                )}
              >
                <div className="relative h-32">
                  <Image
                    src={optionVisual.image}
                    alt={editionOption.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className={cn('absolute inset-0 bg-gradient-to-t from-[#1f1a17]/65 via-[#1f1a17]/15 to-transparent', isSelected && 'from-[#5f2036]/75')} />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/80">{editionOption.theme}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{editionOption.title}</h3>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </SectionCard>

      <SectionCard title="2. Elige la categoria" caption={`Categoria activa: ${currentCategoryLabel}. Cada edicion trae sus propias categorias.`}>
        <div className="grid gap-3">
          {edition.categories.map((category) => {
            const isSelected = category.key === setup.categoryKey

            return (
              <button
                key={category.key}
                type="button"
                onClick={() => onCategoryChange(category.key)}
                className={cn(
                  'rounded-[1.5rem] border px-4 py-4 text-left transition',
                  isSelected
                    ? 'border-brand-wine bg-brand-wine text-white shadow-soft'
                    : 'border-brand-wine/10 bg-white hover:border-brand-violet/20 hover:bg-brand-cream/70'
                )}
              >
                <p className={cn('text-sm font-semibold uppercase tracking-[0.24em]', isSelected ? 'text-white/75' : 'text-brand-violet')}>{category.label}</p>
                <p className={cn('mt-2 text-sm leading-6', isSelected ? 'text-white/80' : 'text-[#655a53]')}>{category.description}</p>
              </button>
            )
          })}
        </div>
      </SectionCard>

      <SectionCard title="3. Jugadores" caption="La experiencia funciona desde 2 personas y reparte una carta privada a cada una.">
        <div className="rounded-[1.5rem] border border-brand-wine/10 bg-brand-cream/70 p-4">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onPlayerCountChange(Math.max(MIN_PLAYERS, setup.playerCount - 1))}
              className="h-12 w-12 rounded-full border border-brand-wine/10 bg-white text-2xl text-brand-soft transition hover:border-brand-violet/20"
            >
              -
            </button>
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-brand-violet">Personas</p>
              <p className="mt-1 text-3xl font-semibold text-brand-soft">{setup.playerCount}</p>
            </div>
            <button
              type="button"
              onClick={() => onPlayerCountChange(Math.min(MAX_PLAYERS, setup.playerCount + 1))}
              className="h-12 w-12 rounded-full border border-brand-wine/10 bg-white text-2xl text-brand-soft transition hover:border-brand-violet/20"
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          {setup.playerNames.map((name, index) => (
            <label key={`player-name-${index}`} className="grid gap-2 rounded-[1.4rem] border border-brand-wine/10 bg-white/90 p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-violet">Jugador {index + 1}</span>
              <input
                value={name}
                onChange={(event) => onNameChange(index, event.target.value)}
                placeholder={`Nombre de jugador ${index + 1}`}
                className="w-full rounded-2xl border border-brand-wine/10 bg-brand-cream/40 px-4 py-3 text-base text-brand-soft outline-none transition focus:border-brand-wine"
              />
            </label>
          ))}
        </div>

        {errorMessage ? (
          <p className="mt-4 rounded-2xl border border-[#c98f8f]/30 bg-[#fff2f0] px-4 py-3 text-sm leading-6 text-[#8d4646]">
            {errorMessage}
          </p>
        ) : null}
      </SectionCard>
    </div>
  )
}

function RevealScreen({
  player,
  revealIndex,
  playerCount,
  editionTitle,
  categoryLabel,
  revealState,
  visual
}: {
  player: GameSession['players'][number]
  revealIndex: number
  playerCount: number
  editionTitle: string
  categoryLabel: string
  revealState: RevealState
  visual: (typeof editionVisuals)[keyof typeof editionVisuals]
}) {
  return (
    <div className="space-y-5 pb-2">
      <HeroStrip
        image={visual.image}
        eyebrow={`Carta privada ${revealIndex + 1} de ${playerCount}`}
        title={editionTitle}
        description={`Categoria ${categoryLabel}. Nadie mas debe ver esta carta.`}
      />

      {revealState === 'handoff' ? (
        <article className="rounded-[1.9rem] border border-brand-wine/10 bg-white/92 p-5">
          <p className="text-xs uppercase tracking-[0.34em] text-brand-violet">Pasa el celular</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-brand-soft">{player.name}</h2>
          <p className="mt-4 text-base leading-7 text-[#5f534b]">
            Toma el celular con calma y abre tu carta sin que nadie mas la vea.
          </p>
        </article>
      ) : (
        <article className="overflow-hidden rounded-[2rem] border border-brand-wine/10 bg-gradient-to-br from-white via-[#f7efea] to-[#f0e1d6] p-5 shadow-soft">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-brand-violet">Solo para {player.name}</p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight text-brand-soft">{player.secretTitle}</h2>
          </div>

          <div className="mt-5 rounded-[1.6rem] border border-brand-wine/10 bg-white/80 p-4">
            <p className="text-lg leading-8 text-brand-soft">{player.secretPrompt}</p>
          </div>

          <p className="mt-4 text-sm leading-6 text-[#665851]">{player.privateHint}</p>
        </article>
      )}
    </div>
  )
}

function ConversationScreen({
  player,
  playerIndex,
  playerCount,
  categoryLabel,
  editionTitle
}: {
  player: GameSession['players'][number]
  playerIndex: number
  playerCount: number
  categoryLabel: string
  editionTitle: string
}) {
  return (
    <div className="space-y-5 pb-2">
      <article className="overflow-hidden rounded-[2rem] border border-brand-wine/10 bg-gradient-to-br from-[#fdf9f6] via-[#f6ede6] to-[#efe1d6] p-5">
        <p className="text-xs uppercase tracking-[0.34em] text-brand-violet">Empieza la conversacion</p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight text-brand-soft">{player.name}</h2>
        <p className="mt-4 text-base leading-7 text-[#5c514a]">
          Ya viste tu carta. Ahora es tu turno de responder en voz alta y abrir la conversacion desde ahi.
        </p>
      </article>

      <div className="grid gap-3 sm:grid-cols-2">
        <QuickFact label="Edicion" value={editionTitle} />
        <QuickFact label="Categoria" value={categoryLabel} />
      </div>

      <article className="rounded-[1.9rem] border border-brand-wine/10 bg-white/92 p-5">
        <p className="text-xs uppercase tracking-[0.34em] text-brand-violet">Guia de ronda</p>
        <p className="mt-3 text-base leading-7 text-[#5f534b]">
          Habla sin prisa, escucha sin interrumpir y deja que la pregunta haga su trabajo. No se trata de responder bien sino de responder con verdad.
        </p>
      </article>

      <div className="rounded-[1.6rem] border border-brand-wine/10 bg-brand-cream/70 p-4">
        <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.24em] text-brand-violet">
          <span>Orden</span>
          <span>
            {playerIndex + 1} / {playerCount}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/80">
          <div
            className="h-full rounded-full bg-brand-wine transition-all"
            style={{ width: `${((playerIndex + 1) / playerCount) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function ResultScreen({ session }: { session: GameSession }) {
  const edition = editionMap[session.editionKey]
  const category = getCategory(session.editionKey, session.categoryKey)

  return (
    <div className="space-y-5 pb-2">
      <article className="overflow-hidden rounded-[2rem] border border-brand-wine/15 bg-gradient-to-br from-[#fffaf7] via-[#f6ede6] to-[#efded2] p-5 shadow-soft">
        <p className="text-xs uppercase tracking-[0.34em] text-brand-violet">Cierre de la ronda</p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight text-brand-soft">La conversacion ya esta abierta.</h2>
        <p className="mt-4 text-base leading-7 text-[#5f534b]">
          Terminaron una ronda de {edition.title} en la categoria {category.label}. Ahora la idea es recoger lo que se movio y dejar una ultima pregunta que mantenga la cercania.
        </p>
      </article>

      <article className="rounded-[1.9rem] border border-brand-wine/10 bg-white/92 p-5">
        <p className="text-xs uppercase tracking-[0.34em] text-brand-violet">Cartas de la ronda</p>
        <h3 className="mt-3 text-2xl font-semibold leading-tight text-brand-soft">{category.label}</h3>
        <div className="mt-4 grid gap-3">
          {session.players.map((player) => (
            <div key={player.id} className="rounded-[1.4rem] border border-brand-wine/10 bg-brand-cream/50 px-4 py-4">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-violet">{player.name}</p>
              <p className="mt-3 text-base leading-7 text-brand-soft">{player.secretPrompt}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-[1.9rem] border border-brand-wine/10 bg-white/92 p-5">
        <p className="text-xs uppercase tracking-[0.34em] text-brand-violet">Lo que deja</p>
        <p className="mt-4 text-base leading-7 text-[#5f534b]">
          Si algo quedo resonando, este es el momento para decirlo sin filtro. La ronda no tiene que resolverlo todo; solo abrir una puerta mejor.
        </p>
      </article>

      <article className="overflow-hidden rounded-[1.9rem] border border-brand-wine/10 bg-gradient-to-br from-white via-[#f5ece4] to-[#eeded1] p-5">
        <p className="text-xs uppercase tracking-[0.34em] text-brand-violet">Pregunta de cierre</p>
        <p className="mt-4 text-lg leading-8 text-brand-soft">
          {session.closingCard?.text ?? `Antes de cerrar, cuenten una verdad breve sobre ${category.label.toLowerCase()} que no haya salido todavia.`}
        </p>
      </article>
    </div>
  )
}

function HowToOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-[#1b1311]/60 px-4 pb-4 pt-20 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6">
      <div className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-[#fffaf6] shadow-soft">
        <div className="border-b border-brand-wine/10 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.34em] text-brand-violet">Como jugar</p>
          <h2 className="mt-3 text-2xl font-semibold text-brand-soft">Una ronda privada, por turnos, con cierre emocional.</h2>
        </div>
        <div className="space-y-4 px-5 py-5 text-sm leading-7 text-[#5f534b]">
          <p>1. Elige la edicion segun el tipo de relacion: pareja, amigos, familia o conversaciones de pareja mas profundas.</p>
          <p>2. Elige una categoria dentro de esa edicion. Cada edicion tiene categorias distintas.</p>
          <p>3. Pasa el celular para que cada persona vea su carta en privado.</p>
          <p>4. La ronda avanza por turnos y termina con una pregunta de cierre para seguir la conversacion con amor.</p>
          <p>5. No hay impostor, puntos ni votacion: solo una estructura simple para hablar mejor.</p>
        </div>
        <div className="border-t border-brand-wine/10 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full bg-brand-wine px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#4e1c32]"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}

function PhotoMosaic() {
  const images = [
    '/lookbook/love-cover.jpg',
    '/lookbook/friends-cover.jpg',
    '/lookbook/forever-cover.jpg',
    '/lookbook/family-cover.jpg'
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="relative col-span-2 h-40 overflow-hidden rounded-[1.8rem]">
        <Image src={images[0]} alt="Love Edition" fill sizes="(max-width: 768px) 66vw, 33vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f1a17]/50 to-transparent" />
      </div>
      <div className="grid gap-3">
        {images.slice(1).map((image) => (
          <div key={image} className="relative h-[4.6rem] overflow-hidden rounded-[1.2rem]">
            <Image src={image} alt="Look and feel UY QUE HEAVY" fill sizes="(max-width: 768px) 33vw, 16vw" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  )
}

function HeroStrip({
  image,
  eyebrow,
  title,
  description
}: {
  image: string
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="relative overflow-hidden rounded-[1.9rem] border border-brand-wine/10">
      <div className="relative h-44">
        <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1412] via-[#1c1412]/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-xs uppercase tracking-[0.34em] text-white/80">{eyebrow}</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight text-white">{title}</h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-white/80">{description}</p>
        </div>
      </div>
    </div>
  )
}

function SectionCard({
  title,
  caption,
  children
}: {
  title: string
  caption: string
  children: React.ReactNode
}) {
  return (
    <article className="rounded-[1.9rem] border border-brand-wine/10 bg-white/92 p-5">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-brand-soft">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-[#6a5d55]">{caption}</p>
      </div>
      {children}
    </article>
  )
}

function QuickFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-brand-wine/10 bg-white/90 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.28em] text-brand-violet">{label}</p>
      <p className="mt-2 text-base font-semibold text-brand-soft">{value}</p>
    </div>
  )
}

function BottomActionBar({ actions }: { actions: ActionConfig[] }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4 sm:px-6">
      <div className="mx-auto max-w-[520px] rounded-[1.8rem] border border-brand-wine/10 bg-white/92 p-3 shadow-soft backdrop-blur-xl">
        <div className="grid gap-3">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              disabled={action.disabled}
              className={cn(
                'min-h-[3.6rem] rounded-full px-5 text-sm font-semibold transition',
                action.variant === 'secondary' && 'border border-brand-wine/10 bg-brand-cream text-brand-soft hover:border-brand-wine/20',
                action.variant === 'ghost' && 'border border-brand-wine/10 bg-white text-brand-soft hover:border-brand-wine/20',
                action.variant !== 'secondary' && action.variant !== 'ghost' && 'bg-brand-wine text-white hover:bg-[#4e1c32]',
                action.disabled && 'cursor-not-allowed border-transparent bg-[#d7c2cb] text-white hover:bg-[#d7c2cb]'
              )}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function DesktopPreview({
  stage,
  editionKey,
  categoryLabel
}: {
  stage: GameStage
  editionKey: keyof typeof editionVisuals
  categoryLabel: string
}) {
  const visual = editionVisuals[editionKey]

  return (
    <div className="sticky top-6 flex min-h-[calc(100vh-3rem)] flex-col gap-5 rounded-[2.3rem] border border-brand-wine/10 bg-white/70 p-5 shadow-soft backdrop-blur-xl">
      <div className="relative min-h-[360px] overflow-hidden rounded-[2rem]">
        <Image src={visual.image} alt={editionKey} fill sizes="40vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f1a17]/75 via-[#1f1a17]/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <p className="text-xs uppercase tracking-[0.34em] text-white/70">{visual.mood}</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-white">{visual.spotlight}</h2>
        </div>
      </div>

      <div className="grid gap-3">
        <QuickFact label="Pantalla" value={stage.replace('-', ' ')} />
        <QuickFact label="Categoria" value={categoryLabel} />
        <QuickFact label="Experiencia" value="Ronda privada" />
      </div>

      <div className="rounded-[1.8rem] border border-brand-wine/10 bg-brand-cream/70 p-5 text-sm leading-7 text-[#5f534b]">
        <p className="text-xs uppercase tracking-[0.34em] text-brand-violet">Direccion visual</p>
        <p className="mt-3">
          Fondo beige, tarjetas blancas, vino tinto y fotos reales de referencia para que la app se sienta intima, premium y pensada para abrir conversaciones con cuidado.
        </p>
      </div>
    </div>
  )
}
