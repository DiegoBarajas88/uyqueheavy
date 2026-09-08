import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { brand, fonts } from '../src/theme/theme';
import BrandText from '../src/components/BrandText';

const MODOS = [
  {
    n: '01',
    title: 'Cada uno responde',
    body:
      'El primer jugador toma una tarjeta, lee la pregunta en voz alta y la responde.\n' +
      'Luego, el turno pasa a la persona que está a su derecha, quien toma una nueva tarjeta, lee la pregunta y responde.\n' +
      'Continúen de esta manera hasta que todos hayan participado o hasta que decidan que es momento de terminar.',
  },
  {
    n: '02',
    title: 'Elige quién responde',
    body:
      'El jugador toma una tarjeta, lee la pregunta y elige quién debe responderla.\n' +
      'Puede entregarle el celular a la persona elegida o simplemente indicarle que es su turno.\n' +
      'Una vez respondida la pregunta, el turno pasa al siguiente jugador, quien toma una nueva tarjeta y elige quién responde.',
  },
  {
    n: '03',
    title: 'Todos responden',
    body:
      'Una persona toma una tarjeta y lee la pregunta en voz alta.\n' +
      'Esta vez, todos responden la misma pregunta, compartiendo sus propias experiencias, opiniones o historias.\n' +
      'No hay un orden establecido: pueden responder uno por uno o dejar que la conversación fluya.',
  },
];

export default function Instrucciones() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable hitSlop={12} onPress={() => router.back()} accessibilityLabel="Volver">
          <Text style={styles.back}>‹  Volver</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        <BrandText style={styles.h1}>¿Cómo jugar?</BrandText>
        <Text style={styles.lead}>
          Tienes 3 opciones diferentes para jugar Uy Qué Heavy. Elijan la dinámica que más se adapte al
          momento, al grupo y a las ganas que tengan de conversar.
        </Text>

        {MODOS.map((m) => (
          <View key={m.n} style={styles.modo}>
            <View style={styles.badge}><Text style={styles.badgeText}>{m.n}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.modoTitle}>{m.title}</Text>
              <Text style={styles.modoBody}>{m.body}</Text>
            </View>
          </View>
        ))}

        <View style={styles.note}>
          <Text style={styles.noteTitle}>Y RECUERDA...</Text>
          <Text style={styles.noteText}>
            No hay respuestas correctas ni incorrectas.{'\n'}
            La idea es escucharse, conocerse, reírse, recordar y, sobre todo, tener esas conversaciones que
            normalmente no tenemos.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: brand.cream },
  header: { backgroundColor: brand.wine, paddingHorizontal: 20, paddingBottom: 16 },
  back: { color: '#F0DCC9', fontFamily: fonts.body, fontWeight: '700', fontSize: 16 },
  content: { padding: 24, width: '100%', maxWidth: 620, alignSelf: 'center' },
  h1: { fontFamily: fonts.display, color: brand.wine, fontSize: 34, letterSpacing: 0.5 },
  lead: { fontFamily: fonts.body, fontWeight: '600', color: brand.inkSoft, fontSize: 16, lineHeight: 24, marginTop: 10, marginBottom: 22 },
  modo: { flexDirection: 'row', gap: 16, alignItems: 'flex-start', backgroundColor: '#FFFDF7', borderWidth: 1, borderColor: brand.line, borderRadius: 18, padding: 18, marginBottom: 14 },
  badge: { width: 44, height: 44, borderRadius: 22, backgroundColor: brand.wine, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontFamily: fonts.display, color: brand.white, fontSize: 17 },
  modoTitle: { fontFamily: fonts.body, fontWeight: '700', color: brand.ink, fontSize: 18 },
  modoBody: { fontFamily: fonts.body, fontWeight: '500', color: brand.inkSoft, fontSize: 15, lineHeight: 23, marginTop: 6 },
  note: { marginTop: 12, backgroundColor: brand.creamSoft, borderLeftWidth: 3, borderLeftColor: brand.wine, borderRadius: 12, padding: 18 },
  noteTitle: { fontFamily: fonts.body, fontWeight: '700', color: brand.wine, fontSize: 14, letterSpacing: 1.6, marginBottom: 8 },
  noteText: { fontFamily: fonts.body, fontWeight: '700', color: brand.wine, fontSize: 17, lineHeight: 26 },
});
