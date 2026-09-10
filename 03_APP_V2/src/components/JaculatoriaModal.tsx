import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { brand, fonts, EditionTheme } from '../theme/theme';
import ScriptText from './ScriptText';

type Props = {
  visible: boolean;
  onClose: () => void;
  editionName: string;
  jaculatoria: string;
  theme: EditionTheme;
};

/** Overlay de la Jaculatoria (Brief §6-C): oración corta de la edición + cerrar. */
export default function JaculatoriaModal({ visible, onClose, editionName, jaculatoria, theme }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.sheet, { backgroundColor: theme.cardSoft }]} onPress={() => {}}>
          <Text style={[styles.eyebrow, { color: theme.accent }]}>Jaculatoria</Text>
          <ScriptText size={30} color={theme.accent}>{editionName}</ScriptText>
          <Text style={[styles.body, { color: theme.questionInk }]}>{jaculatoria}</Text>
          <Pressable onPress={onClose} style={[styles.close, { borderColor: theme.accent }]}>
            <Text style={[styles.closeText, { color: theme.accent }]}>Cerrar</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(44,23,25,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 26,
  },
  sheet: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    paddingVertical: 34,
    paddingHorizontal: 28,
    alignItems: 'center',
    gap: 10,
  },
  eyebrow: {
    fontFamily: fonts.body,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  body: {
    fontFamily: fonts.body,
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'center',
    marginVertical: 8,
  },
  close: { marginTop: 10, borderWidth: 1.5, borderRadius: 999, paddingVertical: 11, paddingHorizontal: 30 },
  closeText: { fontFamily: fonts.body, fontWeight: '700', fontSize: 15 },
});
