/**
 * Sistema anti-repetición diario (Brief §9–10).
 * - No repite una pregunta el mismo día dentro de una misma edición.
 * - Reinicia automáticamente el historial cuando cambia el día.
 * - Selecciona aleatoriamente entre las preguntas restantes.
 * - Persistencia local (AsyncStorage → localStorage en web). Sin backend.
 *
 * Preparado para escalar: aquí vivirá también el contador Freemium
 * (3 gratis por edición, §30) en la Fase 3, sin tocar las pantallas.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Edition, Question } from '../data/editions';

type UsedState = { day: string; ids: string[] };

const keyFor = (editionId: string) => `uqh:used:${editionId}`;

function todayKey(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

async function readUsed(editionId: string): Promise<UsedState> {
  try {
    const raw = await AsyncStorage.getItem(keyFor(editionId));
    if (raw) {
      const parsed = JSON.parse(raw) as UsedState;
      if (parsed.day === todayKey()) return parsed;
    }
  } catch {
    /* estado corrupto o vacío → arrancamos limpio */
  }
  return { day: todayKey(), ids: [] };
}

async function writeUsed(editionId: string, state: UsedState): Promise<void> {
  try {
    await AsyncStorage.setItem(keyFor(editionId), JSON.stringify(state));
  } catch {
    /* si falla la persistencia, el juego sigue en memoria */
  }
}

export type DrawResult =
  | { done: false; question: Question; remaining: number }
  | { done: true; question: null; remaining: 0 };

/**
 * Devuelve la siguiente pregunta no usada hoy para la edición,
 * la marca como usada y reporta cuántas quedan.
 */
export async function drawNextQuestion(edition: Edition): Promise<DrawResult> {
  const state = await readUsed(edition.id);
  const remainingPool = edition.questions.filter((q) => !state.ids.includes(q.id));

  if (remainingPool.length === 0) {
    return { done: true, question: null, remaining: 0 };
  }

  const pick = remainingPool[Math.floor(Math.random() * remainingPool.length)];
  const next: UsedState = { day: state.day, ids: [...state.ids, pick.id] };
  await writeUsed(edition.id, next);

  return { done: false, question: pick, remaining: remainingPool.length - 1 };
}

/** Cuántas preguntas quedan hoy sin haberse usado (para UI). */
export async function remainingToday(edition: Edition): Promise<number> {
  const state = await readUsed(edition.id);
  return edition.questions.filter((q) => !state.ids.includes(q.id)).length;
}

/** Reinicia manualmente el historial diario de una edición (debug/QA). */
export async function resetEdition(editionId: string): Promise<void> {
  await writeUsed(editionId, { day: todayKey(), ids: [] });
}
