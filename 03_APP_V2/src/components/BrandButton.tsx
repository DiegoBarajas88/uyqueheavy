import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { brand, fonts } from '../theme/theme';

type Props = {
  label: string;
  onPress: () => void;
  bg?: string;
  color?: string;
  variant?: 'solid' | 'outline';
  outlineColor?: string;
  style?: StyleProp<ViewStyle>;
};

export default function BrandButton({
  label,
  onPress,
  bg = brand.wine,
  color = brand.white,
  variant = 'solid',
  outlineColor,
  style,
}: Props) {
  const isOutline = variant === 'outline';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.base,
        isOutline
          ? { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: outlineColor ?? bg }
          : { backgroundColor: bg },
        pressed && { transform: [{ scale: 0.97 }], opacity: 0.92 },
        style,
      ]}
    >
      <Text style={[styles.label, { color: isOutline ? (outlineColor ?? bg) : color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 16,
    paddingHorizontal: 26,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  label: {
    fontFamily: fonts.body,
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.3,
  },
});
