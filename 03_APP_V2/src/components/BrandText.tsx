import React from 'react';
import { View, Text, StyleSheet, StyleProp, TextStyle } from 'react-native';

type Props = {
  children: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
};

/**
 * Texto en las tipografías de marca, resolviendo dos huecos de esas fuentes:
 *
 * 1. TILDES — SpicyWasabi mapea "ó" pero su glifo NO dibuja la tilde (medido:
 *    la tinta de "ó" es idéntica a la de "o"). Aquí se dibuja el acento como
 *    una barrita vectorial encima de la letra base.
 *
 * 2. "¿" y "¡" — ni SpicyWasabi ni Sieroty los incluyen, así que el sistema
 *    los sustituía por una serif (se veían de otra tipografía). Se resuelven
 *    girando 180° el "?" y el "!" de la PROPIA fuente, que es exactamente lo
 *    que esos signos son.
 *
 * Geometría (medida sobre SpicyWasabi a 100px, en fracciones de em):
 *    altura de mayúscula 0.737 · borde superior de la caja a la mayúscula 0.030
 *
 * LIMITACIÓN: parte el texto en segmentos dentro de una fila, así que NO hace
 * salto de línea automático. Pensado para títulos y logo (textos cortos de una
 * línea). Para párrafos, usar <Text> normal con Quicksand, que sí trae todo.
 */

/** Vocales acentuadas → letra base. */
const ACCENTED: Record<string, string> = {
  á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u',
  Á: 'A', É: 'E', Í: 'I', Ó: 'O', Ú: 'U',
};

/** Signos de apertura → el signo de cierre que se gira 180°. */
const ROTATED: Record<string, string> = { '¿': '?', '¡': '!' };

/**
 * Cada fuente recibe SOLO el parche de lo que le falta de verdad (verificado
 * leyendo el cmap y midiendo la tinta de cada glifo):
 *   · SpicyWasabi — mapea las vocales acentuadas pero su glifo no dibuja el
 *     acento, y no trae "¿" ni "¡".
 *   · Sieroty     — dibuja bien los acentos; solo le faltan "¿" y "¡".
 *   · Quicksand   — cobertura completa: no necesita nada.
 * Parchear de más es un bug: a Sieroty le salía una tilde postiza sobre la "í".
 */
const SIN_ACENTOS = new Set(['SpicyWasabi']);
const SIN_SIGNOS_ESPANOLES = new Set(['SpicyWasabi', 'Sieroty']);

type Token = { kind: 'plain' | 'accent' | 'rotate'; text: string };

function tokenize(s: string, acentos: boolean, signos: boolean): Token[] {
  const out: Token[] = [];
  let buf = '';
  const flush = () => {
    if (buf) out.push({ kind: 'plain', text: buf });
    buf = '';
  };
  for (const ch of s) {
    if (acentos && ACCENTED[ch]) {
      flush();
      out.push({ kind: 'accent', text: ACCENTED[ch] });
    } else if (signos && ROTATED[ch]) {
      flush();
      out.push({ kind: 'rotate', text: ROTATED[ch] });
    } else {
      buf += ch;
    }
  }
  flush();
  return out;
}

export default function BrandText({ children, style, numberOfLines }: Props) {
  const flat = (StyleSheet.flatten(style) || {}) as TextStyle;
  const size = typeof flat.fontSize === 'number' ? flat.fontSize : 16;
  const color = (flat.color as string) || '#000';
  const family = (flat.fontFamily as string) || '';

  const tokens = tokenize(children, SIN_ACENTOS.has(family), SIN_SIGNOS_ESPANOLES.has(family));
  // Sin caracteres especiales no hay nada que compensar: un <Text> normal,
  // que además conserva el salto de línea.
  if (!tokens.some((t) => t.kind !== 'plain')) {
    return (
      <Text style={style} numberOfLines={numberOfLines}>
        {children}
      </Text>
    );
  }

  // Barrita del acento agudo, proporcional al cuerpo de la fuente.
  const accentH = size * 0.13;
  const accentW = Math.max(2, size * 0.075);
  const accentGap = size * 0.02;   // aire entre el acento y el alto de mayúscula

  const justify =
    flat.textAlign === 'center' ? 'center' : flat.textAlign === 'right' ? 'flex-end' : 'flex-start';

  return (
    <View style={[styles.row, { justifyContent: justify }]}>
      {tokens.map((t, i) => {
        if (t.kind === 'plain') {
          return (
            <Text key={i} style={style}>
              {t.text}
            </Text>
          );
        }

        if (t.kind === 'rotate') {
          return (
            <Text key={i} style={[style, styles.rotated]}>
              {t.text}
            </Text>
          );
        }

        // Letra + tilde dibujada encima
        return (
          <View key={i} style={styles.stack}>
            <View
              style={{
                width: accentW,
                height: accentH,
                borderRadius: accentW,
                backgroundColor: color,
                transform: [{ rotate: '24deg' }],
                marginBottom: accentGap,
                marginLeft: size * 0.05, // el agudo va ligeramente a la derecha
              }}
            />
            <Text style={style}>{t.text}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // `flex-end` alinea todos los segmentos por abajo: como comparten fuente y
  // cuerpo, sus cajas miden lo mismo y las líneas base coinciden.
  row: { flexDirection: 'row', alignItems: 'flex-end', flexWrap: 'wrap' },
  stack: { alignItems: 'center' },
  rotated: { transform: [{ rotate: '180deg' }] },
});
