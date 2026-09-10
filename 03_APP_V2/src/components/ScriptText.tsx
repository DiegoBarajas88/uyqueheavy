import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, Platform } from 'react-native';
import { fonts, scriptLineHeight, scriptSidePadding } from '../theme/theme';

type Props = {
  children: string;
  size: number;
  color: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Texto en Sieroty (nombres de edición) que se ve igual en iOS, Android y web.
 *
 * Sieroty se desborda de su caja: 2.17em de alto y hasta 0.33em a la IZQUIERDA del
 * origen (la "E" de "Edition" arranca con un remate largo). Compensarlo con
 * `paddingHorizontal` en el propio <Text> funcionaba en iOS, pero en Android el
 * padding del Text no entra en la medición: el texto se medía a un ancho y se
 * dibujaba a otro más angosto, saltaba de línea al dibujar y la segunda línea
 * quedaba recortada ("Love" sin "Edition"), o un remate se colaba en el texto de
 * abajo. Aquí el aire va en una View envolvente, que sí se mide bien en todas partes,
 * y el <Text> no lleva padding.
 */
export default function ScriptText({ children, size, color, style }: Props) {
  const pad = scriptSidePadding(size);
  return (
    <View style={[styles.wrap, { paddingHorizontal: pad }, style]}>
      <Text
        style={[
          styles.text,
          { fontSize: size, lineHeight: scriptLineHeight(size), color },
          Platform.OS === 'android' && styles.android,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'stretch', alignItems: 'center' },
  text: { fontFamily: fonts.script, textAlign: 'center' },
  // Android: sin el relleno extra que agrega por encima/debajo de la fuente;
  // el alto lo fija lineHeight igual que en iOS.
  android: { includeFontPadding: false, textAlignVertical: 'center' },
});
