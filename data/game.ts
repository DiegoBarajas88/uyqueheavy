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
  impostorInstruction: string
  resultTone: string
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
  sharedCard: CardItem
  closingCard: CardItem | null
  players: PlayerAssignment[]
}

export type VoteSummary = {
  playerId: string
  playerName: string
  votes: number
  isImpostor: boolean
}

export const MIN_PLAYERS = 3
export const MAX_PLAYERS = 8
export const DEFAULT_PLAYER_COUNT = 4

export const gameModes: GameMode[] = [
  {
    key: 'conversation',
    label: 'Conversacion',
    shortLabel: 'Suave',
    description: 'La ronda arranca ligera y emocional. Todo el grupo comparte desde la calma.',
    roundInstruction: 'Hablen con calma, sin correr. La idea es sonar genuino, no perfecto.',
    impostorInstruction: 'No tienes la pregunta exacta. Improvisa con honestidad sobre el tono de la categoria y mezcla tu respuesta con suavidad.',
    resultTone: 'Cierre suave'
  },
  {
    key: 'impostor',
    label: 'Impostor',
    shortLabel: 'Clasico',
    description: 'Una persona no conoce la pregunta real. El grupo debe detectarla al final.',
    roundInstruction: 'Respondan como si conocieran bien la pregunta. Escuchen con atencion cada detalle.',
    impostorInstruction: 'Eres el impostor. No conoces la pregunta real. Escucha, improvisa y trata de mezclarte.',
    resultTone: 'Revelacion'
  },
  {
    key: 'intense',
    label: 'Intenso',
    shortLabel: 'Profundo',
    description: 'Misma dinamica, pero con respuestas mas directas, vulnerables y menos obvias.',
    roundInstruction: 'Vayan al punto y compartan algo real. Entre mas honestidad, mas dificil sera esconderse.',
    impostorInstruction: 'Eres el impostor. No conoces la pregunta real. Responde con profundidad sobre la categoria para no delatarte.',
    resultTone: 'Cierre profundo'
  },
  {
    key: 'familiar',
    label: 'Familiar',
    shortLabel: 'Calido',
    description: 'La ronda cuida el tono. Ideal para grupos mixtos o conversaciones que necesitan suavidad.',
    roundInstruction: 'Hablen desde el cuidado. La idea es dejar una buena conversacion, no exponer a nadie.',
    impostorInstruction: 'Eres el impostor. No conoces la pregunta real. Mantente cercano, amable y conectado al tema general.',
    resultTone: 'Cierre calido'
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
    modeKey: 'impostor',
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
  const sharedCard = pickRandom(categoryCards) ?? edition.cards[0]
  const closingCard = pickRandom(categoryCards.filter((card) => card.id !== sharedCard.id)) ?? null
  const normalizedNames = syncPlayerNames(setup.playerCount, setup.playerNames).map((name, index) => {
    const trimmed = name.trim()
    return trimmed || `Jugador ${index + 1}`
  })
  const impostorIndex = Math.floor(Math.random() * normalizedNames.length)

  const players = normalizedNames.map((name, index) => {
    const isImpostor = index === impostorIndex

    if (isImpostor) {
      return {
        id: `player-${index + 1}`,
        name,
        isImpostor,
        secretTitle: `Rol secreto · ${mode.shortLabel}`,
        secretPrompt: buildImpostorPrompt(category, mode),
        privateHint: 'Escucha antes de hablar. Tu meta es sonar presente sin revelar que no viste la carta real.'
      }
    }

    return {
      id: `player-${index + 1}`,
      name,
      isImpostor,
      secretTitle: `${edition.title} · ${category.label}`,
      secretPrompt: sharedCard.text,
      privateHint: 'Respira, guarda la pregunta para ti y responde con naturalidad cuando llegue tu turno.'
    }
  })

  return {
    editionKey: edition.key,
    modeKey: mode.key,
    categoryKey: category.key,
    sharedCard,
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

function buildImpostorPrompt(category: EditionCategory, mode: GameMode) {
  return `${mode.impostorInstruction} Habla desde ${category.label.toLowerCase()} y usa la descripcion general como brujula: ${category.description}`
}

function pickRandom<T>(items: T[]) {
  if (!items.length) {
    return null
  }

  return items[Math.floor(Math.random() * items.length)]
}
