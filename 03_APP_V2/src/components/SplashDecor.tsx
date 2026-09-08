import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import { fonts } from '../theme/theme';

/**
 * Recursos gráficos del splash — recreados en vector a partir del mockup 2
 * de Erika (`01_RECURSOS_ERIKA/mockups/2.png`):
 *   · tres trazos diagonales arriba a la derecha,
 *   · blobs orgánicos entrando por los costados,
 *   · www.uyqueheavy.com sobre una onda blanca y una franja rosa al pie,
 *   · tres trazos horizontales cortos bajo la onda.
 *
 * El viewBox es 1080×1920 (9:16, la proporción del mockup) con
 * preserveAspectRatio="xMidYMid slice": cubre la pantalla como un fondo.
 * OJO: un iPhone es MÁS ANGOSTO que 9:16 (390×844 ≈ 0.46 vs 0.5625), así que
 * el slice recorta ~96 unidades por lado. Por eso los blobs entran más hacia
 * el centro que en el mockup — pegados al borde desaparecerían en el teléfono.
 */

const CREAM = '#EFE0D8';   // trazos claros
const ROSE = '#B5726E';    // blobs y franja del pie
const WHITE = '#FFFFFF';   // onda del pie

export default function SplashDecor() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
        {/* Blob izquierdo */}
        <Path
          d="M0 260 C 120 285, 205 400, 196 520 C 188 640, 120 700, 128 800 C 136 905, 215 960, 205 1075 C 196 1180, 90 1240, 0 1300 Z"
          fill={ROSE}
        />
        {/* Blob derecho */}
        <Path
          d="M1080 560 C 960 585, 880 660, 890 780 C 900 900, 985 950, 975 1060 C 965 1170, 880 1215, 890 1320 C 898 1400, 1000 1440, 1080 1450 Z"
          fill={ROSE}
        />

        {/* Tres trazos diagonales arriba a la derecha */}
        <Path
          d="M742 52 C 758 46, 772 56, 768 74 L 706 240 C 700 256, 682 260, 672 248 C 664 238, 664 228, 668 218 L 730 62 Z"
          fill={CREAM}
        />
        <Path
          d="M936 148 C 950 158, 950 174, 936 184 L 780 300 C 766 310, 750 306, 744 292 C 738 280, 742 266, 754 258 L 918 148 Z"
          fill={CREAM}
        />
        <Path
          d="M1010 356 C 1026 364, 1028 382, 1014 392 C 1006 398, 996 400, 986 402 L 810 432 C 794 434, 782 424, 782 410 C 782 396, 792 386, 806 384 L 992 354 Z"
          fill={CREAM}
        />

        {/* URL sobre el pie */}
        <SvgText
          x="540"
          y="1552"
          fill="rgba(239,224,216,0.85)"
          fontFamily={fonts.body}
          fontSize="34"
          letterSpacing="4"
          textAnchor="middle"
        >
          www.uyqueheavy.com
        </SvgText>

        {/* Pie: franja rosa + onda blanca por encima */}
        <Path d="M0 1660 C 220 1600, 420 1706, 640 1690 C 830 1676, 950 1620, 1080 1596 L 1080 1920 L 0 1920 Z" fill={ROSE} />
        <Path
          d="M0 1660 C 220 1600, 420 1706, 640 1690 C 830 1676, 950 1620, 1080 1596 L 1080 1636 C 950 1660, 830 1716, 640 1730 C 420 1746, 220 1640, 0 1700 Z"
          fill={WHITE}
        />

        {/* Tres trazos horizontales bajo la onda */}
        <Path d="M344 1742 C 344 1730, 354 1722, 366 1722 L 748 1722 C 760 1722, 770 1730, 770 1742 C 770 1754, 760 1762, 748 1762 L 366 1762 C 354 1762, 344 1754, 344 1742 Z" fill={CREAM} />
        <Path d="M446 1800 C 446 1788, 456 1780, 468 1780 L 694 1780 C 706 1780, 716 1788, 716 1800 C 716 1812, 706 1820, 694 1820 L 468 1820 C 456 1820, 446 1812, 446 1800 Z" fill={CREAM} />
        <Path d="M534 1856 C 534 1844, 544 1836, 556 1836 L 610 1836 C 622 1836, 632 1844, 632 1856 C 632 1868, 622 1876, 610 1876 L 556 1876 C 544 1876, 534 1868, 534 1856 Z" fill={CREAM} />
      </Svg>
    </View>
  );
}
