import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { brand } from '../src/theme/theme';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpicyWasabi: require('../assets/fonts/SpicyWasabi.ttf'),
    Sieroty: require('../assets/fonts/Sieroty.ttf'),
    Quicksand: require('../assets/fonts/Quicksand.otf'),
  });

  // Fondo de marca mientras cargan las fuentes (evita "flash" de fuente por defecto)
  if (!loaded) {
    return <View style={{ flex: 1, backgroundColor: brand.wine }} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: brand.cream },
          animation: 'fade',
        }}
      />
    </SafeAreaProvider>
  );
}
