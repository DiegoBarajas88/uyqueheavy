import { editionMap, editions, type CardItem, type EditionKey } from './cards'

export type GameStage = 'home' | 'setup' | 'reveal-cards' | 'conversation-round' | 'results'
export type RevealState = 'handoff' | 'visible'

export type EditionVisual = {
  image: string
  mood: string
  spotlight: string
}

export type SetupState = {
  editionKey: EditionKey
  categoryKey: string
  playerCount: number
  playerNames: string[]
}

export type PlayerAssignment = {
  id: string
  name: string
  secretTitle: string
  secretPrompt: string
  privateHint: string
}

export type GameSession = {
  editionKey: EditionKey
  categoryKey: string
  roundPrompts: CardItem[]
  closingCard: CardItem | null
  players: PlayerAssignment[]
}

export const MIN_PLAYERS = 2
export const MAX_PLAYERS = 8
export const DEFAULT_PLAYER_COUNT = 2

export const editionVisuals: Record<EditionKey, EditionVisual> = {
  love: {
    image: '/lookbook/love-cover.jpg',
    mood: 'Complicidad intima',
    spotlight: 'Cartas para parejas que quieren hablar con mas verdad, mas cuidado y mas cercania.'
  },
  friends: {
    image: '/lookbook/friends-cover.jpg',
    mood: 'Mesa compartida',
    spotlight: 'Preguntas para amigos que quieren ir mas alla del chiste y entrar en conversaciones reales.'
  },
  forever: {
    image: '/lookbook/forever-cover.jpg',
    mood: 'Pareja profunda',
    spotlight: 'Una atmosfera mas profunda para conversaciones de pareja sobre intimidad, dinero, deseo y futuro compartido.'
  },
  family: {
    image: '/lookbook/family-cover.jpg',
    mood: 'Objeto ritual',
    spotlight: 'Una ronda para familia: mas ritual que juego, mas escucha que dinamica social.'
  }
}

export function createInitialSetup(): SetupState {
  const defaultEdition = editions[0]

  return {
    editionKey: defaultEdition.key,
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
  const category = getCategory(setup.editionKey, setup.categoryKey)
  const categoryCards = edition.cards.filter((card) => card.category === category.key)
  const promptPool = categoryCards.length ? categoryCards : edition.cards
  const normalizedNames = syncPlayerNames(setup.playerCount, setup.playerNames).map((name, index) => {
    const trimmed = name.trim()
    return trimmed || `Jugador ${index + 1}`
  })

  const roundPrompts = pickCards(promptPool, normalizedNames.length, edition.cards)
  const closingCard = pickClosingCard(promptPool, roundPrompts, edition.cards)

  const players = normalizedNames.map((name, index) => {
    const assignedPrompt = roundPrompts[index] ?? roundPrompts[0] ?? edition.cards[0]

    return {
      id: `player-${index + 1}`,
      name,
      secretTitle: `${edition.title} · ${category.label}`,
      secretPrompt: assignedPrompt.text,
      privateHint: buildPlayerHint(edition.key)
    }
  })

  return {
    editionKey: edition.key,
    categoryKey: category.key,
    roundPrompts,
    closingCard,
    players
  }
}

function buildPlayerHint(editionKey: EditionKey) {
  if (editionKey === 'love') {
    return 'Respira antes de responder y habla con cariño. No busques hacerlo perfecto, busca estar presente.'
  }

  if (editionKey === 'friends') {
    return 'Puedes responder con humor, pero no te quedes solo en la broma. Deja algo real en la mesa.'
  }

  if (editionKey === 'family') {
    return 'Cuida el tono y habla con calma. La idea es abrir, no poner a nadie a la defensiva.'
  }

  if (editionKey === 'forever') {
    return 'Habla con honestidad y mucho cuidado. Esta edicion esta pensada para conversaciones de pareja mas sensibles y profundas.'
  }

  return 'Habla desde lo honesto. Esta ronda esta pensada para tocar temas mas profundos sin forzarlos.'
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
