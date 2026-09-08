import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fonts, EditionTheme, scriptLineHeight, scriptSidePadding } from '../theme/theme';

type Props = {
  editionName: string;
  question: string;
  theme: EditionTheme;
  compact?: boolean;
};

/**
 * Carta tipo naipe físico: relleno claro de la edición, marco interior,
 * nombre de la edición en script arriba, la pregunta como protagonista al centro.
 * (Brief §8 y mockup 4.)
 */
export default function PlayingCard({ editionName, question, theme, compact }: Props) {
  return (
    <View style={[styles.card, { backgroundColor: theme.cardSoft }]}>
      <View style={[styles.frame, { borderColor: withAlpha(theme.accent, 0.35) }]}>
        <Text style={[styles.name, { color: theme.accent }]}>{editionName}</Text>
        <View style={styles.center}>
          <Text style={[styles.question, { color: theme.questionInk }, compact && { fontSize: 22 }]}>
            {question}
          </Text>
        </View>
        <Text style={[styles.url, { color: withAlpha(theme.questionInk, 0.5) }]}>www.uyqueheavy.com</Text>
      </View>
    </View>
  );
}

function withAlpha(hex: string, a: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    aspectRatio: 0.62,
    borderRadius: 26,
    padding: 14,
    shadowColor: '#2C1719',
    shadowOpacity: 0.16,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
  frame: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 18,
    paddingVertical: 26,
    paddingHorizontal: 22,
    justifyContent: 'space-between',
  },
  name: {
    fontFamily: fonts.script,
    fontSize: 34,
    textAlign: 'center',
    lineHeight: scriptLineHeight(34),
    paddingHorizontal: scriptSidePadding(34),
  },
  center: { flex: 1, justifyContent: 'center', paddingVertical: 12 },
  question: {
    fontFamily: fonts.body,
    fontWeight: '600',
    fontSize: 26,
    lineHeight: 34,
    textAlign: 'center',
  },
  url: {
    fontFamily: fonts.body,
    fontWeight: '500',
    fontSize: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
