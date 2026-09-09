import React from 'react';
import { View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { fonts } from '../theme/theme';

/**
 * Carta física impresa. Los fondos (`assets/cards/*_front.jpg`) son el arte real de
 * imprenta de Uy Qué Heavy sin la pregunta: patrón, marco, ícono y nombre en script.
 * Friends/Love/Forever salen del archivo de imprenta; Family/Storytime se generaron
 * con la misma plantilla (`design/cartas/make_cards_family_storytime.py`).
 *
 * Geometría medida sobre la plantilla de 961×1402 px (65.5×95.5 mm):
 *   - marco: 15.4 % de ancho por lado
 *   - bloque de pregunta: centrado al 52 % de alto, Quicksand 40/961 de ancho, interlínea 51/961
 */
export const CARD_RATIO = 960 / 1401;

const FRONT: Record<string, ImageSourcePropType> = {
  friends: require('../../assets/cards/friends_front.jpg'),
  love: require('../../assets/cards/love_front.jpg'),
  forever: require('../../assets/cards/forever_front.jpg'),
  family: require('../../assets/cards/family_front.jpg'),
  storytime: require('../../assets/cards/storytime_front.jpg'),
};
const BACK: Record<string, ImageSourcePropType> = {
  friends: require('../../assets/cards/friends_back.jpg'),
  love: require('../../assets/cards/love_back.jpg'),
  forever: require('../../assets/cards/forever_back.jpg'),
  family: require('../../assets/cards/family_back.jpg'),
  storytime: require('../../assets/cards/storytime_back.jpg'),
};

export function cardImage(editionId: string, side: 'front' | 'back'): ImageSourcePropType {
  const table = side === 'front' ? FRONT : BACK;
  return table[editionId] ?? table.friends;
}

type Props = {
  editionId: string;
  width: number;
  side?: 'front' | 'back';
  /** Solo para `side="front"`. Si falta, se muestra el fondo sin pregunta. */
  question?: string;
};

export default function PrintedCard({ editionId, width, side = 'front', question }: Props) {
  const h = width / CARD_RATIO;
  const r = width * 0.05; // radio de esquina de una carta real (~3 mm sobre 63 mm)
  return (
    <View style={[styles.card, { width, height: h, borderRadius: r }]}>
      <Image source={cardImage(editionId, side)} style={{ width, height: h }} resizeMode="cover" fadeDuration={0} />
      {side === 'front' && question ? (
        <View style={[styles.textBand, { left: width * 0.17, right: width * 0.17, top: h * 0.395, height: h * 0.25 }]}>
          <Text
            style={[styles.question, { fontSize: width * 0.0417, lineHeight: width * 0.053 }]}
            numberOfLines={6}
            adjustsFontSizeToFit
            minimumFontScale={0.72}
          >
            {question}
          </Text>
        </View>
      ) : null}
      {/* Canto del papel: filo claro donde se ve el núcleo blanco de la cartulina */}
      <View pointerEvents="none" style={[styles.edge, { borderRadius: r }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { overflow: 'hidden', backgroundColor: '#3a2a2c' },
  textBand: { position: 'absolute', justifyContent: 'center' },
  question: { fontFamily: fonts.body, fontWeight: '600', color: '#FFFFFF', textAlign: 'center' },
  edge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.32)',
  },
});
