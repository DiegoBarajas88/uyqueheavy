import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getEdition } from '../../src/data/editions';
import { editionThemes, brand, fonts } from '../../src/theme/theme';
import ScriptText from '../../src/components/ScriptText';
import BrandButton from '../../src/components/BrandButton';
import JaculatoriaModal from '../../src/components/JaculatoriaModal';

/**
 * Pantalla de edición (Brief §6): nombre, copy, botón Jaculatoria y botón Jugar.
 * Respeta por completo el color de la edición.
 */
export default function EditionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [jacOpen, setJacOpen] = useState(false);

  const edition = getEdition(String(id));
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
        <Pressable hitSlop={12} onPress={() => router.push('/home')} accessibilityLabel="Volver al inicio">
          <Text style={styles.back}>‹  Inicio</Text>
        </Pressable>
      </View>

      <View style={[styles.body, { paddingBottom: insets.bottom + 28 }]}>
        <View style={styles.top}>
          <ScriptText size={52} color={t.accent}>{edition.name}</ScriptText>
          <Text style={[styles.audience, { color: t.questionInk }]}>{edition.audience}</Text>
          <Text style={[styles.copy, { color: t.questionInk }]}>{edition.description}</Text>
        </View>

        <View style={styles.actions}>
          <BrandButton
            label="Jaculatoria"
            variant="outline"
            outlineColor={t.accent}
            onPress={() => setJacOpen(true)}
          />
          <BrandButton
            label="Jugar"
            bg={t.card}
            color={t.onCard}
            onPress={() => router.push(`/play/${edition.id}`)}
          />
        </View>
      </View>

      <JaculatoriaModal
        visible={jacOpen}
        onClose={() => setJacOpen(false)}
        editionName={edition.name}
        jaculatoria={edition.jaculatoria}
        theme={t}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { backgroundColor: brand.wine, paddingHorizontal: 20, paddingBottom: 16 },
  back: { color: '#F0DCC9', fontFamily: fonts.body, fontWeight: '700', fontSize: 16 },
  body: { flex: 1, paddingHorizontal: 28, justifyContent: 'space-between', width: '100%', maxWidth: 560, alignSelf: 'center' },
  top: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  audience: { fontFamily: fonts.body, fontWeight: '700', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.7 },
  copy: { fontFamily: fonts.body, fontWeight: '600', fontSize: 19, lineHeight: 27, textAlign: 'center', maxWidth: 380, marginTop: 6 },
  actions: { gap: 12 },
});
