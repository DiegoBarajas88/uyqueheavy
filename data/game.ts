import { editionMap, editions, type CardItem, type EditionCategory, type EditionKey } from './cards'

export type GameStage = 'home' | 'setup' | 'reveal-cards' | 'conversation-round' | 'voting' | 'results'
export type RevealState = 'handoff' | 'visible'
export type VotingState = 'handoff' | 'choosing'
export type GameModeKey = 'conversation' | 'impostor' | 'intense' | 'familiar'

export type GameMode = {
  key: GameModeKey
  label: string
  shortLabel: string
  description: string
  roundInstruction: string
  resultTone: string
  usesImpostor: boolean
}

export type EditionVisual = {
  image: string
  mood: string
  spotlight: string
}

export type SetupState = {
  editionKey: EditionKey
  modeKey: GameModeKey
  categoryKey: string
  playerCount: number
  playerNames: string[]
}

export type PlayerAssignment = {
  id: string
  name: string
  isImpostor: boolean
  secretTitle: string
  secretPrompt: string
  privateHint: string
}

export type GameSession = {
  editionKey: EditionKey
  modeKey: GameModeKey
  categoryKey: string
  hasImpostor: boolean
  roundPrompts: CardItem[]
  closingCard: CardItem | null
  players: PlayerAssignment[]
}

export type VoteSummary = {
  playerId: string
  playerName: string
  votes: number
  isImpostor: boolean
}

export const MIN_PLAYERS = 2
export const MAX_PLAYERS = 8
export const DEFAULT_PLAYER_COUNT = 2

export const gameModes: GameMode[] = [
  {
    key: 'conversation',
    label: 'Conversacion',
    shortLabel: 'Suave',
    description: 'Cada persona recibe una carta propia y la ronda avanza por turnos, sin votacion ni roles ocultos.',
    roundInstruction: 'Respondan con calma y escuchen sin interrumpir. Aqui importa la conversacion, no acertar nada.',
    resultTone: 'Cierre suave',
    usesImpostor: false
  },
  {
    key: 'impostor',
    label: 'Impostor',
    shortLabel: 'Clasico',
    description: 'Todas las personas menos una ven la misma pregunta. Al final, el grupo vota quien improviso.',
    roundInstruction: 'Respondan como si conocieran bien la pregunta. Escuchen con atencion cada detalle.',
    resultTone: 'Revelacion',
    usesImpostor: true
  },
  {
    key: 'intense',
    label: 'Intenso',
    shortLabel: 'Profundo',
    description: 'Cada persona recibe una carta mas directa. La ronda busca respuestas mas honestas y menos superficiales.',
    roundInstruction: 'Vayan al punto y digan algo real. No hace falta explicar todo, pero si dejar verdad.',
    resultTone: 'Cierre profundo',
    usesImpostor: false
  },
  {
    key: 'familiar',
    label: 'Familiar',
    shortLabel: 'Calido',
    description: 'Turnos privados con un tono cuidado. Ideal para jugar desde 2 personas sin que se sienta agresivo.',
    roundInstruction: 'Hablen desde el cuidado. La ronda esta hecha para acercarse, no para presionarse.',
    resultTone: 'Cierre calido',
    usesImpostor: false
  }
]

export const gameModeMap: Record<GameModeKey, GameMode> = Object.fromEntries(
  gameModes.map((mode) => [mode.key, mode])
) as Record<GameModeKey, GameMode>

export const editionVisuals: Record<EditionKey, EditionVisual> = {
  love: {
    image: '/lookbook/love-cover.jpg',
    mood: 'Complicidad intima',
    spotlight: 'Una ronda para parejas que quieren abrir lo que normalmente se queda por dentro.'
  },
  friends: {
    image: '/lookbook/friends-cover.jpg',
    mood: 'Mesa compartida',
    spotlight: 'Una energia de amigos hablando con verdad, humor y un poco de riesgo.'
  },
  forever: {
    image: '/lookbook/forever-cover.jpg',
    mood: 'Intimidad adulta',
    spotlight: 'Una atmosfera mas profunda para hablar de deseo, futuro y cercania.'
  },
  family: {
    image: '/lookbook/family-cover.jpg',
    mood: 'Objeto ritual',
    spotlight: 'La edicion familiar se siente como un ritual simple: una baraja, una mesa y una pregunta honesta.'
  }
}

export function createInitialSetup(): SetupState {
  const defaultEdition = editions[0]

  return {
    editionKey: defaultEdition.key,
    modeKey: 'conversation',
    categoryKey: defaultEdition.categories[0]?.key ?? '',
    playerCount: DEFAULT_PLAYER_COUNT,
    playerNames: syncPlayerNames(DEFAULT_PLAYER_COUNT, [])
  }
}

export function syncPlayerNames(playerCount: number, currentNames: string[]) {
  return Array.from({ length: playerCount }, (_, index) => currentNames[index] ?? '')
}

export function getCategory(editionKey: EditionKey, categoryKey: string) {
  const edition = editionMap[editionKey]
  return edition.categories.find((category) => category.key === categoryKey) ?? edition.categories[0]
}

export function createGameSession(setup: SetupState): GameSession {
  const edition = editionMap[setup.editionKey]
  const mode = gameModeMap[setup.modeKey]
  const category = getCategory(setup.editionKey, setup.categoryKey)
  const categoryCards = edition.cards.filter((card) => card.category === category.key)
  const promptPool = categoryCards.length ? categoryCards : edition.cards
  const normalizedNames = syncPlayerNames(setup.playerCount, setup.playerNames).map((name, index) => {
    const trimmed = name.trim()
    return trimmed || `Jugador ${index + 1}`
  })

  const roundPrompts = mode.usesImpostor
    ? [pickRandom(promptPool) ?? edition.cards[0]]
    : pickCards(promptPool, normalizedNames.length, edition.cards)

  const primaryPrompt = roundPrompts[0] ?? edition.cards[0]
  const closingCard = pickClosingCard(promptPool, roundPrompts, edition.cards)
  const impostorIndex = mode.usesImpostor ? Math.floor(Math.random() * normalizedNames.length) : -1

  const players = normalizedNames.map((name, index) => {
    const isImpostor = index === impostorIndex
    const assignedPrompt = mode.usesImpostor ? primaryPrompt : roundPrompts[index] ?? primaryPrompt

    if (isImpostor) {
      return {
        id: `player-${index + 1}`,
        name,
        isImpostor,
        secretTitle: `Rol secreto · ${mode.shortLabel}`,
        secretPrompt: buildImpostorPrompt(category),
        privateHint: 'No viste la carta real. Escucha primero y responde con naturalidad para no regalarte.'
      }
    }

    return {
      id: `player-${index + 1}`,
      name,
      isImpostor,
      secretTitle: `${edition.title} · ${category.label}`,
      secretPrompt: assignedPrompt.text,
      privateHint: buildPlayerHint(mode)
    }
  })

  return {
    editionKey: edition.key,
    modeKey: mode.key,
    categoryKey: category.key,
    hasImpostor: mode.usesImpostor,
    roundPrompts,
    closingCard,
    players
  }
}

export function summarizeVotes(session: GameSession, votes: Record<string, string>) {
  const voteCount = Object.values(votes).reduce<Record<string, number>>((accumulator, selectedPlayerId) => {
    accumulator[selectedPlayerId] = (accumulator[selectedPlayerId] ?? 0) + 1
    return accumulator
  }, {})

  const tallies = session.players
    .map((player) => ({
      playerId: player.id,
      playerName: player.name,
      votes: voteCount[player.id] ?? 0,
      isImpostor: player.isImpostor
    }))
    .sort((left, right) => right.votes - left.votes || left.playerName.localeCompare(right.playerName)) satisfies VoteSummary[]

  const topVoteCount = tallies[0]?.votes ?? 0
  const leaders = tallies.filter((summary) => summary.votes === topVoteCount)
  const impostor = session.players.find((player) => player.isImpostor)
  const caught = Boolean(impostor && topVoteCount > 0 && leaders.some((leader) => leader.playerId === impostor.id))

  return {
    tallies,
    caught,
    topVoteCount,
    impostor
  }
}

function buildImpostorPrompt(category: EditionCategory) {
  return `No conoces la pregunta real. Improvisa desde ${category.label.toLowerCase()} y usa esta idea como brujula: ${category.description}`
}

function buildPlayerHint(mode: GameMode) {
  if (mode.key === 'intense') {
    return 'Ve a lo real. No hace falta decir mucho, pero si decir algo que tenga peso.'
  }

  if (mode.key === 'familiar') {
    return 'Cuida el tono. Responde con honestidad, pero deja espacio para que la mesa se sienta segura.'
  }

  if (mode.key === 'conversation') {
    return 'Guarda la carta para ti y responde con calma cuando llegue tu turno.'
  }

  return 'Respira, guarda la pregunta para ti y responde con naturalidad cuando llegue tu turno.'
}

function pickClosingCard(promptPool: CardItem[], roundPrompts: CardItem[], editionCards: CardItem[]) {
  const usedPromptIds = new Set(roundPrompts.map((card) => card.id))
  return (
    pickRandom(promptPool.filter((card) => !usedPromptIds.has(card.id))) ??
    pickRandom(editionCards.filter((card) => !usedPromptIds.has(card.id))) ??
    null
  )
}

function pickCards(primaryPool: CardItem[], count: number, fallbackPool: CardItem[]) {
  const source = primaryPool.length ? [...primaryPool] : [...fallbackPool]
  const shuffled = shuffle(source)

  if (shuffled.length >= count) {
    return shuffled.slice(0, count)
  }

  return Array.from({ length: count }, (_, index) => shuffled[index % shuffled.length] ?? fallbackPool[index % fallbackPool.length])
}

function shuffle<T>(items: T[]) {
  const clone = [...items]

  for (let index = clone.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[clone[index], clone[randomIndex]] = [clone[randomIndex], clone[index]]
  }

  return clone
}

function pickRandom<T>(items: T[]) {
  if (!items.length) {
    return null
  }

  return items[Math.floor(Math.random() * items.length)]
}
