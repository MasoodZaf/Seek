import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, FontSize } from '../../constants/theme';

type BadgeVariant = 'beginner' | 'intermediate' | 'advanced' | 'primary' | 'default';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

const variantColors: Record<BadgeVariant, { bg: string; text: string }> = {
  beginner:     { bg: 'rgba(110,231,183,0.15)', text: Colors.green },
  intermediate: { bg: 'rgba(251,191,36,0.15)',  text: Colors.amber },
  advanced:     { bg: 'rgba(252,165,165,0.15)', text: Colors.red },
  primary:      { bg: 'rgba(99,102,241,0.15)',  text: Colors.primary },
  default:      { bg: Colors.bg3,               text: Colors.text2 },
};

export function Badge({ label, variant = 'default', style }: BadgeProps) {
  const { bg, text } = variantColors[variant];
  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
