import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Animated, Easing, StyleSheet, Pressable, Platform, LayoutChangeEvent } from 'react-native';
import * as Haptics from 'expo-haptics';
import { fonts, EditionTheme } from '../theme/theme';
import PrintedCard, { CARD_RATIO } from './PrintedCard';

type Props = {
  editionId: string;
  /** La pregunta YA seleccionada por la lógica anti-repetición. */
  question: string;
  theme: EditionTheme;
  /** Se dispara cuando la carta terminó de girar y la pregunta quedó visible. */
  onRevealed: () => void;
};

/**
 * Baraja física sobre la mesa (prototipo aprobado por Erika, 2026-09-09).
 *
 *   mazo (abajo-izq, boca abajo, con canto)  →  cartas vuelan en arco dando una vuelta
 *   en el aire  →  caen boca abajo en la pila (abajo-der). Arranca lento, llega a 8
 *   cartas/s. A los 2.3 s frena solo; si el jugador toca la mesa antes, frena en ese
 *   instante: salen 4 cartas más, cada una más lenta, y la quinta es la elegida.
 *   La elegida sube al centro, queda flotando boca abajo con un balanceo, crece y gira
 *   180° para revelar la pregunta.
 *
 * REGLA FUNDAMENTAL: la pregunta llega por props, elegida ANTES de animar. El toque
 * cambia cuándo frena, nunca qué sale.
 *
 * Todo corre con Animated + native driver (solo transforms y opacity).
 */

const RATE = 8;            // cartas/s a plena velocidad
const RAMP = 350;          // ms hasta velocidad plena
const AUTO_STOP = 2300;    // ms: si nadie tocó, frena solo
const MIN_TAP = 450;       // ms: antes de esto el toque se ignora
const FLIGHT = 500;        // ms de vuelo de una carta
const BRAKE = [160, 270, 420, 660]; // intervalos crecientes al frenar; luego la elegida
const DECK_SHEETS = 14;
const PILE_MAX = 26;

type Flight = { id: number; chosen: boolean; tilt1: number; front: boolean };

export default function CardDeckDraw({ editionId, question, theme, onRevealed }: Props) {
  const [stage, setStage] = useState({ w: 0, h: 0 });
  const [flights, setFlights] = useState<Flight[]>([]);
  const [pile, setPile] = useState<number[]>([]);
  const [dealt, setDealt] = useState(0);
  const [hintOn, setHintOn] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const phase = useRef<'idle' | 'spin' | 'brake' | 'chosen' | 'done'>('idle');
  const t0 = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const brakeIdx = useRef(-1);
  const nextId = useRef(1);

  const geo = useMemo(() => {
    const cw = Math.min(stage.w * 0.4, 170);
    return {
      cw,
      ch: cw / CARD_RATIO,
      deck: { x: -stage.w * 0.27, y: stage.h * 0.19 },
      pile: { x: stage.w * 0.27, y: stage.h * 0.19 },
      apex: { x: 0, y: -stage.h * 0.1 },
      ctrlY: -stage.h * 0.1 - stage.h * 0.22,
      // al revelar, la carta baja al centro de la mesa y crece hasta casi todo el ancho
      revealShift: stage.h * 0.1,
      revealScale: Math.min(stage.w * 0.92, (stage.h - 8) * CARD_RATIO) / (cw * 1.28),
      revealWidth: Math.min(stage.w * 0.92, (stage.h - 8) * CARD_RATIO),
    };
  }, [stage]);

  const haptic = useCallback((kind: 'tick' | 'land') => {
    if (Platform.OS === 'web') return;
    (kind === 'tick' ? Haptics.selectionAsync() : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)).catch(() => {});
  }, []);

  const launch = useCallback(
    (chosen: boolean) => {
      setFlights((f) => [...f, { id: nextId.current++, chosen, tilt1: Math.random() * 16 - 8, front: !chosen }]);
      setDealt((d) => d + 1);
      haptic('tick');
    },
    [haptic],
  );

  const schedule = useCallback((ms: number, fn: () => void) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(fn, ms);
  }, []);

  const brakeStep = useCallback(() => {
    brakeIdx.current += 1;
    if (brakeIdx.current < BRAKE.length) {
      launch(false);
      schedule(BRAKE[brakeIdx.current], brakeStep);
    } else {
      phase.current = 'chosen';
      launch(true);
    }
  }, [launch, schedule]);

  const requestStop = useCallback(() => {
    if (phase.current !== 'spin') return;
    phase.current = 'brake';
    setHintOn(false);
    brakeIdx.current = -1;
    schedule(50, brakeStep);
  }, [brakeStep, schedule]);

  const spinStep = useCallback(() => {
    if (phase.current !== 'spin') return;
    const t = Date.now() - t0.current;
    if (t >= AUTO_STOP) {
      requestStop();
      return;
    }
    launch(false);
    const ramp = Math.min(1, t / RAMP);
    const rate = RATE * (0.25 + 0.75 * (1 - Math.pow(1 - ramp, 2)));
    schedule(1000 / rate, spinStep);
  }, [launch, requestStop, schedule]);

  // Arranque: cuando ya conocemos el tamaño del escenario.
  useEffect(() => {
    if (!stage.w || phase.current !== 'idle') return;
    phase.current = 'spin';
    t0.current = Date.now();
    const hint = setTimeout(() => setHintOn(true), 500);
    schedule(0, spinStep);
    return () => {
      clearTimeout(hint);
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage.w]);

  const onTap = useCallback(() => {
    if (phase.current !== 'spin') return;
    if (Date.now() - t0.current < MIN_TAP) return;
    requestStop();
  }, [requestStop]);

  const onLanded = useCallback((f: Flight) => {
    setFlights((list) => list.filter((x) => x.id !== f.id));
    setPile((p) => [...p, f.tilt1].slice(-PILE_MAX));
  }, []);

  // Al terminar el giro, la carta en vuelo (con rotación 3D) se reemplaza por una vista
  // plana en la misma posición y tamaño. iOS ordena mal las capas giradas en 3D y dibujaba
  // el mazo y la pila encima de la carta revelada; en reposo no debe depender de eso.
  const onChosenRevealed = useCallback(() => {
    if (phase.current === 'done') return;
    phase.current = 'done';
    setFlights((list) => list.filter((x) => !x.chosen));
    setRevealed(true);
    onRevealed();
  }, [onRevealed]);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== stage.w || height !== stage.h) setStage({ w: width, h: height });
  };

  const deckSheets = Math.max(3, DECK_SHEETS - Math.floor(dealt / 2));

  return (
    <Pressable style={styles.stage} onLayout={onLayout} onPress={onTap} accessibilityLabel="Mesa de juego; toca para detener la baraja">
      {stage.w > 0 && (
        <>
          {/* Capas contenedoras planas: iOS ordena mal las vistas hermanas con transformaciones 3D
              (dibujaba el mazo encima de la carta revelada). Cada capa es una vista sin transformar,
              y entre capas el orden sí se respeta: mesa < vuelo < carta revelada. */}
          <View style={styles.layer} pointerEvents="none">
            <Stack editionId={editionId} pos={geo.deck} tilt={-6} sheets={deckSheets} cw={geo.cw} ch={geo.ch} />
            <Stack editionId={editionId} pos={geo.pile} tilt={5} sheets={pile.length} tilts={pile} cw={geo.cw} ch={geo.ch} />
          </View>
          <View style={[styles.layer, { zIndex: 10 }]} pointerEvents="none">
          {flights.map((f) => (
            <FlyingCard
              key={f.id}
              flight={f}
              editionId={editionId}
              question={question}
              geo={geo}
              onLanded={onLanded}
              onRevealed={onChosenRevealed}
              haptic={haptic}
            />
          ))}
          </View>
          {revealed && (
            <View style={[styles.layer, { zIndex: 20 }]} pointerEvents="none">
              <View
                style={[
                  styles.anchored,
                  styles.chosenShadow,
                  { width: geo.revealWidth, height: geo.revealWidth / CARD_RATIO, marginLeft: -geo.revealWidth / 2, marginTop: -geo.revealWidth / CARD_RATIO / 2 },
                ]}
              >
                <PrintedCard editionId={editionId} width={geo.revealWidth} side="front" question={question} />
              </View>
            </View>
          )}
          {!revealed && (
            <Text style={[styles.hint, { color: theme.accent, opacity: hintOn ? 0.9 : 0 }]}>Toca la mesa para detener</Text>
          )}
        </>
      )}
    </Pressable>
  );
}

/* ---------- mazo / pila: cartas apiladas con canto visible ---------- */
function Stack({
  editionId, pos, tilt, sheets, tilts, cw, ch,
}: { editionId: string; pos: { x: number; y: number }; tilt: number; sheets: number; tilts?: number[]; cw: number; ch: number }) {
  if (sheets <= 0) return null;
  const r = cw * 0.05;
  return (
    <View
      pointerEvents="none"
      style={[
        styles.anchored,
        { width: cw, height: ch, marginLeft: -cw / 2, marginTop: -ch / 2, zIndex: 0 },
        { transform: [{ perspective: 900 }, { translateX: pos.x }, { translateY: pos.y }, { rotateX: '38deg' }, { rotateZ: `${tilt}deg` }] },
      ]}
    >
      {/* sombra de contacto del mazo sobre la mesa */}
      <View style={[styles.stackShadow, { borderRadius: r, width: cw, height: ch }]} />
      {Array.from({ length: sheets }).map((_, i) => (
        <View key={i} style={[StyleSheet.absoluteFill, { transform: [{ translateY: -i * 1.15 }, { rotateZ: `${tilts ? tilts[i] - tilt : 0}deg` }] }]}>
          <View style={[styles.sheetEdge, { borderRadius: r }]} />
          <PrintedCard editionId={editionId} width={cw} side="back" />
        </View>
      ))}
    </View>
  );
}

/* ---------- una carta en vuelo (o la elegida) ---------- */
function FlyingCard({
  flight, editionId, question, geo, onLanded, onRevealed, haptic,
}: {
  flight: Flight;
  editionId: string;
  question: string;
  geo: { cw: number; ch: number; deck: { x: number; y: number }; pile: { x: number; y: number }; apex: { x: number; y: number }; ctrlY: number; revealShift: number; revealScale: number; revealWidth: number };
  onLanded: (f: Flight) => void;
  onRevealed: () => void;
  haptic: (k: 'tick' | 'land') => void;
}) {
  const p = useRef(new Animated.Value(0)).current;     // progreso del vuelo (eased para la elegida)
  const flip = useRef(new Animated.Value(0)).current;  // 0..1 giro de revelado
  const wob = useRef(new Animated.Value(0)).current;   // balanceo al quedar flotando
  const { cw, ch } = geo;

  // Trayectoria: Bézier cuadrática mazo → (encima del centro) → pila, muestreada en 21 puntos.
  const path = useMemo(() => {
    const N = 20;
    const input: number[] = [], xs: number[] = [], ys: number[] = [];
    for (let i = 0; i <= N; i++) {
      const u = flight.chosen ? (i / N) * 0.5 : i / N; // la elegida solo recorre la mitad: se queda en el centro
      const x = (1 - u) * (1 - u) * geo.deck.x + 2 * (1 - u) * u * geo.apex.x + u * u * geo.pile.x;
      const y = (1 - u) * (1 - u) * geo.deck.y + 2 * (1 - u) * u * geo.ctrlY + u * u * geo.pile.y;
      input.push(i / N); xs.push(x); ys.push(y);
    }
    return { input, xs, ys };
  }, [geo, flight.chosen]);

  useEffect(() => {
    if (!flight.chosen) {
      Animated.timing(p, { toValue: 1, duration: FLIGHT, easing: Easing.linear, useNativeDriver: true }).start(({ finished }) => {
        if (finished) onLanded(flight);
      });
      return;
    }
    Animated.sequence([
      Animated.timing(p, { toValue: 1, duration: 750, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      // balanceo amortiguado, como carta que queda flotando
      Animated.sequence([
        Animated.timing(wob, { toValue: 1, duration: 110, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(wob, { toValue: -0.6, duration: 160, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(wob, { toValue: 0.25, duration: 170, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(wob, { toValue: 0, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
      Animated.timing(flip, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) onRevealed();
    });
    const landTimer = setTimeout(() => haptic('land'), 750);
    return () => clearTimeout(landTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lift = flight.chosen ? [0, 1] : [0, 0.5, 1];
  const translateX = p.interpolate({ inputRange: path.input, outputRange: path.xs });
  const translateY = Animated.add(
    p.interpolate({ inputRange: path.input, outputRange: path.ys }),
    flip.interpolate({ inputRange: [0, 1], outputRange: [0, geo.revealShift] }),
  );
  const scale = Animated.multiply(
    p.interpolate({ inputRange: lift, outputRange: flight.chosen ? [1, 1.28] : [1, 1.28, 1] }),
    flip.interpolate({ inputRange: [0, 1], outputRange: [1, geo.revealScale] }),
  );
  const rotateX = p.interpolate({ inputRange: lift, outputRange: flight.chosen ? ['38deg', '0deg'] : ['38deg', '0deg', '38deg'] });
  const rotateZ = Animated.add(
    p.interpolate({ inputRange: [0, 1], outputRange: [-6, flight.chosen ? 0 : flight.tilt1] }),
    Animated.multiply(wob, 4),
  ).interpolate({ inputRange: [-30, 30], outputRange: ['-30deg', '30deg'] });
  // una vuelta completa en el aire (360°) + 180° del revelado
  const angle = Animated.add(Animated.multiply(p, 360), Animated.multiply(flip, 180));
  const rotateY = angle.interpolate({ inputRange: [0, 540], outputRange: ['0deg', '540deg'] });
  // Qué cara se ve, decidido por el ángulo (no por backfaceVisibility: el navegador no lo
  // respeta en caras anidadas y mostraba el reverso en espejo). El frente va pre-espejado
  // (scaleX -1) para leerse bien cuando la carta está a 180°.
  const backOpacity = angle.interpolate({ inputRange: [0, 89.9, 90, 270, 270.1, 449.9, 450, 540], outputRange: [1, 1, 0, 0, 1, 1, 0, 0] });
  const frontOpacity = angle.interpolate({ inputRange: [0, 89.9, 90, 270, 270.1, 449.9, 450, 540], outputRange: [0, 0, 1, 1, 0, 0, 1, 1] });

  // sombra en la mesa: se aleja y se aclara cuando la carta sube
  const shX = Animated.add(translateX, p.interpolate({ inputRange: lift, outputRange: flight.chosen ? [10, 32] : [10, 32, 10] }));
  const shY = Animated.add(
    p.interpolate({ inputRange: path.input, outputRange: path.ys.map((y) => y + ch * 0.42) }),
    p.interpolate({ inputRange: lift, outputRange: flight.chosen ? [0, 26] : [0, 26, 0] }),
  );
  const shOpacity = Animated.multiply(
    p.interpolate({ inputRange: lift, outputRange: flight.chosen ? [0.8, 0.28] : [0.8, 0.28, 0.8] }),
    flip.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0, 0] }),
  );
  const glossOpacity = flip.interpolate({ inputRange: [0, 0.4], outputRange: [1, 0], extrapolate: 'clamp' });
  const shScale = p.interpolate({ inputRange: lift, outputRange: flight.chosen ? [1, 1.5] : [1, 1.5, 1] });
  // brillo que recorre el papel al girar
  const gloss = p.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [-cw, cw, -cw, cw, -cw] });

  const anchor = { width: cw, height: ch, marginLeft: -cw / 2, marginTop: -ch / 2 };

  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.anchored,
          styles.floorShadow,
          { width: cw * 1.1, height: ch * 0.5, marginLeft: -cw * 0.55, marginTop: -ch * 0.25, borderRadius: cw },
          { opacity: shOpacity, zIndex: 1, transform: [{ translateX: shX }, { translateY: shY }, { rotateX: '70deg' }, { scale: shScale }] },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.anchored,
          anchor,
          flight.chosen && styles.chosenShadow,
          { zIndex: 2, transform: [{ perspective: 900 }, { translateX }, { translateY }, { rotateX }, { rotateZ }, { rotateY }, { scale }] },
        ]}
      >
        {/* reverso (visible entre -90° y 90°) */}
        <Animated.View style={[styles.face, { opacity: backOpacity }]}>
          <PrintedCard editionId={editionId} width={cw} side="back" />
          <Animated.View style={[styles.gloss, { width: cw * 0.5, height: ch * 1.6, opacity: glossOpacity, transform: [{ translateX: gloss }, { rotateZ: '18deg' }] }]} />
        </Animated.View>
        {/* frente (visible entre 90° y 270°), pre-espejado */}
        <Animated.View style={[styles.face, { opacity: frontOpacity, transform: [{ scaleX: -1 }] }]}>
          <PrintedCard editionId={editionId} width={cw} side="front" question={flight.chosen ? question : undefined} />
          <Animated.View style={[styles.gloss, { width: cw * 0.5, height: ch * 1.6, opacity: glossOpacity, transform: [{ translateX: Animated.multiply(gloss, -1) }, { rotateZ: '18deg' }] }]} />
        </Animated.View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1, width: '100%', overflow: 'hidden' },
  layer: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
  anchored: { position: 'absolute', top: '50%', left: '50%' },
  face: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'hidden' },
  gloss: { position: 'absolute', top: '-30%', left: 0, backgroundColor: 'rgba(255,255,255,0.16)' },
  floorShadow: { backgroundColor: '#2C1719' },
  // sombra suave propia de la carta elegida (queda al revelar; la elíptica de vuelo se apaga)
  chosenShadow: {
    shadowColor: '#2C1719',
    shadowOpacity: 0.32,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  stackShadow: {
    position: 'absolute',
    top: 6,
    left: 4,
    backgroundColor: 'rgba(44,23,25,0.38)',
    shadowColor: '#2C1719',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 6, height: 8 },
  },
  sheetEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: -1.2,
    backgroundColor: '#E9DFCF',
  },
  hint: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 14,
    textAlign: 'center',
    fontFamily: fonts.body,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.4,
  },
});
