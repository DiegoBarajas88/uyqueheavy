import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { editions, Edition } from '../src/data/editions';
import { editionThemes, brand, fonts } from '../src/theme/theme';
import BrandText from '../src/components/BrandText';
import ScriptText from '../src/components/ScriptText';

/**
 * Home (Brief §4): header de marca + las 5 ediciones como bandas visuales,
 * y acceso a Instrucciones. Refleja el mockup 3.
 */
export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable hitSlop={12} onPress={() => router.push('/instrucciones')} accessibilityLabel="Instrucciones">
          <Text style={styles.icon}>≡</Text>
        </Pressable>
        <BrandText style={styles.brandTitle}>UY QUÉ HEAVY</BrandText>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>♥</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 28 }} showsVerticalScrollIndicator={false}>
        <View style={styles.centerCol}>
          {editions.map((ed) => (
            <EditionBand key={ed.id} edition={ed} onPress={() => router.push(`/edition/${ed.id}`)} />
          ))}

          <Pressable style={styles.instr} onPress={() => router.push('/instrucciones')}>
            <Text style={styles.instrText}>Instrucciones y modos de juego</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function EditionBand({ edition, onPress }: { edition: Edition; onPress: () => void }) {
  const t = editionThemes[edition.id];
  return (
    <View style={[styles.band, { backgroundColor: t.band }]}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: t.card },
          pressed && { transform: [{ scale: 0.985 }], opacity: 0.95 },
        ]}
        accessibilityRole="button"
        accessibilityLabel={edition.name}
      >
        <ScriptText size={40} color={t.onCard}>{edition.name}</ScriptText>
        <Text style={[styles.cardTag, { color: t.onCard }]}>{edition.tagline}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: brand.cream },
  header: {
    backgroundColor: brand.wine,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: { color: '#F0DCC9', fontSize: 30, lineHeight: 30 },
  brandTitle: { fontFamily: fonts.display, color: '#E7C9B4', fontSize: 20, letterSpacing: 1.5 },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#F0DCC9', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: brand.wine, fontSize: 16 },
  centerCol: { width: '100%', maxWidth: 560, alignSelf: 'center' },
  band: { paddingVertical: 26, paddingHorizontal: 22 },
  card: {
    borderRadius: 20,
    paddingVertical: 34,
    paddingHorizontal: 24,
    minHeight: 150,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#2C1719',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  cardTag: { fontFamily: fonts.body, fontWeight: '600', fontSize: 13.5, textAlign: 'center', opacity: 0.9 },
  instr: {
    marginTop: 22,
    marginHorizontal: 22,
    borderWidth: 1.5,
    borderColor: brand.line,
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center',
  },
  instrText: { fontFamily: fonts.body, fontWeight: '700', color: brand.inkSoft, fontSize: 15 },
});
