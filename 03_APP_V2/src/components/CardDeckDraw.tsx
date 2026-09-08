import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, StyleSheet, useWindowDimensions } from 'react-native';
import { fonts, EditionTheme, scriptLineHeight, scriptSidePadding } from '../theme/theme';
import PlayingCard from './PlayingCard';

type Props = {
  editionName: string;
  tagline: string;
  /** La pregunta YA seleccionada por la lógica anti-repetición. */
  question: string;
  theme: EditionTheme;
  /** Se dispara cuando la carta terminó de girar y la pregunta quedó visible. */
  onRevealed: () => void;
};

/**
 * Animación de selección de carta (spec de Erika). Simula una baraja física:
 *
 *   0.0–1.5s  cartas de la edición pasando rápido de DERECHA a IZQUIERDA
 *   1.5–2.5s  desaceleración progresiva (ease-out)
 *   2.5–3.0s  una carta queda detenida y de frente al usuario
 *   3.0–3.3s  esa carta se eleva, separándose de la baraja
 *   3.3–3.8s  giro 3D de 180° sobre el eje vertical
 *   3.8s      queda de frente mostrando la pregunta
 *
 * REGLA FUNDAMENTAL: la pregunta se elige ANTES de montar este componente y
 * llega por props. La carta que se detiene es siempre esa pregunta — la
 * animación nunca elige una carta y luego le asigna otra.
 *
 * Geometría: todas las cartas se anclan al CENTRO del escenario
 * (left/top 50% + margen negativo de media carta) y se separan con
 * translateX. Así el mazo entero se mueve con un solo translateX animado.
 */

const PASSING = 7;         // cartas que desfilan antes de la elegida
const CARD_RATIO = 0.62;   // mismo naipe que PlayingCard
const TILT = '-26deg';     // perfil de las cartas en movimiento

export default function CardDeckDraw({ editionName, tagline, question, theme, onRevealed }: Props) {
  const { width, height } = useWindowDimensions();

  const cardW = Math.min(width - 96, (height - 320) * CARD_RATIO, 280);
  const cardH = cardW / CARD_RATIO;
  const spacing = cardW * 0.58;              // superposición: se ve el canto de la de atrás
  const startX = spacing * 1.5;              // el mazo entra desde la derecha
  const endX = -spacing * PASSING;           // al final, la elegida queda centrada

  const scroll = useRef(new Animated.Value(0)).current;
  const settle = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(0)).current;
  const flip = useRef(new Animated.Value(0)).current;
  const done = useRef(false);

  useEffect(() => {
    const seq = Animated.sequence([
      // ETAPA 1 — movimiento rápido y constante
      Animated.timing(scroll, { toValue: 0.62, duration: 1500, easing: Easing.linear, useNativeDriver: true }),
      // ETAPA 2 — desaceleración natural hasta detenerse
      Animated.timing(scroll, { toValue: 1, duration: 1000, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      // SELECCIÓN — la carta se endereza y queda un instante quieta
      Animated.timing(settle, { toValue: 1, duration: 500, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      // ELEVACIÓN — se extrae de la baraja
      Animated.timing(lift, { toValue: 1, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      // GIRO 3D
      Animated.timing(flip, { toValue: 1, duration: 500, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
    ]);

    seq.start(({ finished }) => {
      if (finished && !done.current) {
        done.current = true;
        onRevealed();
      }
    });
    return () => seq.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deckX = scroll.interpolate({ inputRange: [0, 1], outputRange: [startX, endX] });
  // Al detenerse, el resto del mazo se desvanece: queda solo la elegida.
  const deckFade = settle.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

  const settleRotate = settle.interpolate({ inputRange: [0, 1], outputRange: [TILT, '0deg'] });
  const liftY = lift.interpolate({ inputRange: [0, 1], outputRange: [0, -26] });
  const liftScale = lift.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });
  const frontRotate = flip.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backRotate = flip.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });

  const anchor = { width: cardW, height: cardH, marginLeft: -cardW / 2, marginTop: -cardH / 2 };

  return (
    <View style={styles.stage} pointerEvents="none">
      <Animated.View style={[styles.deck, { transform: [{ translateX: deckX }] }]}>
        {/* Cartas que desfilan */}
        {Array.from({ length: PASSING }).map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.anchored,
              anchor,
              { opacity: deckFade, transform: [{ perspective: 1000 }, { translateX: i * spacing }, { rotateY: TILT }] },
            ]}
          >
            <EditionFace name={editionName} tagline={tagline} theme={theme} w={cardW} h={cardH} />
          </Animated.View>
        ))}

        {/* La elegida: se endereza, se eleva y gira sobre su eje vertical */}
        <Animated.View
          style={[
            styles.anchored,
            anchor,
            {
              transform: [
                { perspective: 1000 },
                { translateX: PASSING * spacing },
                { translateY: liftY },
                { scale: liftScale },
                { rotateY: settleRotate },
              ],
            },
          ]}
        >
          <Animated.View style={[styles.face, { transform: [{ perspective: 1000 }, { rotateY: frontRotate }] }]}>
            <EditionFace name={editionName} tagline={tagline} theme={theme} w={cardW} h={cardH} />
          </Animated.View>
          <Animated.View style={[styles.face, { transform: [{ perspective: 1000 }, { rotateY: backRotate }] }]}>
            <PlayingCard editionName={editionName} question={question} theme={theme} compact />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

/**
 * Frente identificativo de la edición: color, nombre en script y su copy.
 * Cuando Erika entregue los elementos gráficos por edición se enchufan aquí,
 * sin tocar la animación.
 */
function EditionFace({
  name,
  tagline,
  theme,
  w,
  h,
}: {
  name: string;
  tagline: string;
  theme: EditionTheme;
  w: number;
  h: number;
}) {
  return (
    <View style={{ width: w, height: h }}>
      {/* Canto: da la sensación de grosor físico al verse de perfil */}
      <View style={[styles.edge, { backgroundColor: shade(theme.card, 0.72) }]} />
      <View style={[styles.front, { backgroundColor: theme.card }]}>
        <View style={[styles.frontFrame, { borderColor: rgba(theme.onCard, 0.4) }]}>
          <Text style={[styles.frontName, { color: theme.onCard }]} numberOfLines={2} adjustsFontSizeToFit>
            {name}
          </Text>
          <Text style={[styles.frontTag, { color: rgba(theme.onCard, 0.85) }]} numberOfLines={3}>
            {tagline}
          </Text>
        </View>
      </View>
    </View>
  );
}

function rgba(hex: string, a: number): string {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.substring(i, i + 2), 16));
  return `rgba(${r},${g},${b},${a})`;
}

/** Oscurece un hex para simular el canto de la carta. */
function shade(hex: string, k: number): string {
  const h = hex.replace('#', '');
  const c = [0, 2, 4].map((i) => Math.round(parseInt(h.substring(i, i + 2), 16) * k));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

const styles = StyleSheet.create({
  stage: { flex: 1, width: '100%', overflow: 'hidden' },
  deck: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
  anchored: { position: 'absolute', top: '50%', left: '50%' },
  face: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backfaceVisibility: 'hidden' },
  edge: { position: 'absolute', left: -7, top: 6, bottom: 6, width: 7, borderTopLeftRadius: 4, borderBottomLeftRadius: 4 },
  front: {
    flex: 1,
    borderRadius: 26,
    padding: 14,
    shadowColor: '#2C1719',
    shadowOpacity: 0.22,
    shadowRadius: 20,
    shadowOffset: { width: -6, height: 12 },
    elevation: 10,
  },
  frontFrame: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 18,
    paddingVertical: 24,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  frontName: { fontFamily: fonts.script, fontSize: 26, textAlign: 'center', lineHeight: scriptLineHeight(26), paddingHorizontal: scriptSidePadding(26) },
  frontTag: { fontFamily: fonts.body, fontWeight: '600', fontSize: 12.5, textAlign: 'center', lineHeight: 18 },
});
