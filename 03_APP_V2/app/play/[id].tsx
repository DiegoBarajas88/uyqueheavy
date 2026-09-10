import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getEdition, Question } from '../../src/data/editions';
import { editionThemes, brand, fonts } from '../../src/theme/theme';
import { drawNextQuestion } from '../../src/lib/storage';
import CardDeckDraw from '../../src/components/CardDeckDraw';
import BrandButton from '../../src/components/BrandButton';
import ScriptText from '../../src/components/ScriptText';

type Phase = 'drawing' | 'animating' | 'question' | 'exhausted';

/**
 * Flujo JUGAR (Brief §7–12).
 *
 * ORDEN OBLIGATORIO (spec de animación de Erika):
 *   1. Elegir la pregunta válida con la lógica anti-repetición
 *   2. Asociarla a la carta
 *   3. Ejecutar la animación de baraja
 *   4. Detenerse en esa carta → elevarla → girarla 180°
 *   5. Revelar ESA MISMA pregunta
 *
 * Por eso `drawNextQuestion` corre ANTES de montar <CardDeckDraw />, nunca después.
 */
export default function Play() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const edition = getEdition(String(id));
  const [phase, setPhase] = useState<Phase>('drawing');
  const [question, setQuestion] = useState<Question | null>(null);
  const [round, setRound] = useState(0); // fuerza remount de la animación

  // Una pregunta por ronda: si el efecto se vuelve a invocar (StrictMode en dev,
  // remontajes), no debe consumir otra pregunta del pozo del día.
  const drawnRound = useRef(-1);

  // Paso 1 y 2: la pregunta se elige antes de animar nada.
  useEffect(() => {
    if (!edition || phase !== 'drawing') return;
    if (drawnRound.current === round) return;
    drawnRound.current = round;
    let cancelled = false;
    (async () => {
      const res = await drawNextQuestion(edition);
      if (cancelled) return;
      if (res.done) {
        setPhase('exhausted');
      } else {
        setQuestion(res.question);
        setPhase('animating');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [edition, phase, round]);

  const otraPregunta = useCallback(() => {
    setQuestion(null);
    setRound((r) => r + 1);
    setPhase('drawing');
  }, []);

  if (!edition) {
    return (
      <View style={[styles.root, { backgroundColor: brand.cream, alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ fontFamily: fonts.body }}>Edición no encontrada.</Text>
      </View>
    );
  }
  const t = editionThemes[edition.id];

  return (
    <View style={[styles.root, { backgroundColor: t.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable hitSlop={12} onPress={() => router.push(`/edition/${edition.id}`)} accessibilityLabel="Volver a la edición">
          <Text style={styles.back}>‹  {edition.name}</Text>
        </Pressable>
      </View>

      <View style={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
        {/* Paso 3, 4 y 5: la baraja recibe la pregunta ya elegida, la revela y se queda
            mostrándola (no se desmonta: así la carta no salta de sitio al aparecer el botón). */}
        {(phase === 'animating' || phase === 'question') && question && (
          <>
            <CardDeckDraw
              key={round}
              editionId={edition.id}
              question={question.text}
              theme={t}
              onRevealed={() => setPhase('question')}
            />
            {/* El bloque de acciones ocupa su sitio desde el inicio para que la mesa no cambie de tamaño. */}
            <View style={[styles.actions, phase !== 'question' && styles.actionsHidden]} pointerEvents={phase === 'question' ? 'auto' : 'none'}>
              <BrandButton label="Otra pregunta" bg={t.card} color={t.onCard} onPress={otraPregunta} />
              {/* Compartir en Instagram → Fase 2 del roadmap (§20). Sin aviso "próximamente": Apple lo rechaza (Guideline 2.1). */}
            </View>
          </>
        )}

        {phase === 'exhausted' && (
          <View style={styles.center}>
            <ScriptText size={40} color={t.accent}>¡Wow! Hoy sí hablaron de todo 🧡</ScriptText>
            <Text style={[styles.wowSub, { color: t.questionInk }]}>
              Ya no quedan preguntas nuevas de {edition.name} por hoy. Mañana vuelven a estar disponibles.
            </Text>
            <View style={{ height: 22 }} />
            <BrandButton label="Volver al inicio" bg={t.card} color={t.onCard} onPress={() => router.push('/home')} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { backgroundColor: brand.wine, paddingHorizontal: 20, paddingBottom: 16 },
  back: { color: '#F0DCC9', fontFamily: fonts.body, fontWeight: '700', fontSize: 16 },
  body: { flex: 1, paddingHorizontal: 26, width: '100%', maxWidth: 480, alignSelf: 'center', justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  actions: { gap: 12, paddingBottom: 6, paddingTop: 10 },
  actionsHidden: { opacity: 0 },
  shareHint: { fontFamily: fonts.body, fontWeight: '700', fontSize: 13, textAlign: 'center', letterSpacing: 0.4, opacity: 0.8 },
  wowSub: { fontFamily: fonts.body, fontWeight: '600', fontSize: 16, lineHeight: 24, textAlign: 'center', marginTop: 14, maxWidth: 340 },
});
