import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { brand, fonts } from '../src/theme/theme';
import SplashDecor from '../src/components/SplashDecor';
import BrandText from '../src/components/BrandText';

/**
 * Splash Screen (Brief §3): logo centrado, animación sutil premium, ~3s,
 * y transición suave hacia el Home. Refleja el mockup 2 de Erika
 * (los recursos gráficos viven en <SplashDecor />).
 */
export default function Splash() {
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(14)).current;
  const glow = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(rise, { toValue: 0, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0.6, duration: 1400, useNativeDriver: true }),
      ]),
    ).start();

    const t = setTimeout(() => router.replace('/home'), 3000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.root}>
      <SplashDecor />
      <Animated.View style={{ opacity: fade, transform: [{ translateY: rise }], alignItems: 'center', paddingHorizontal: 28, maxWidth: 440 }}>
        <Animated.View style={{ opacity: glow }}>
          <BrandText style={styles.logo}>UY QUÉ HEAVY</BrandText>
        </Animated.View>
        <Text style={styles.tagline}>Conectando un mundo desconectado</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: brand.wine, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  logo: { fontFamily: fonts.display, color: '#F7EFE2', fontSize: 44, letterSpacing: 2, textAlign: 'center' },
  tagline: {
    fontFamily: fonts.body,
    color: 'rgba(247,239,226,0.78)',
    fontSize: 15,
    letterSpacing: 0.6,
    marginTop: 12,
    textAlign: 'center',
  },
});
