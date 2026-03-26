import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, Radius, FontSize, Spacing } from '../../constants/theme';

interface ButtonProps {
  onPress?: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export function Button({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'ghost' ? Colors.text2 : Colors.bg}
        />
      ) : (
        <Text style={[styles.text, styles[`text_${variant}`], styles[`textSize_${size}`], textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.45 },

  // Variants
  primary: { backgroundColor: Colors.green },
  secondary: { backgroundColor: Colors.bg3, borderWidth: 1, borderColor: Colors.border2 },
  ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.border2 },
  danger: { backgroundColor: '#ef4444' },

  // Sizes
  size_sm: { paddingHorizontal: Spacing.sm, paddingVertical: 6 },
  size_md: { paddingHorizontal: Spacing.md, paddingVertical: 12 },
  size_lg: { paddingHorizontal: Spacing.lg, paddingVertical: 15 },

  // Text
  text: { fontWeight: '600' },
  text_primary: { color: '#111' },
  text_secondary: { color: Colors.text },
  text_ghost: { color: Colors.text2 },
  text_danger: { color: '#fff' },

  textSize_sm: { fontSize: FontSize.sm },
  textSize_md: { fontSize: FontSize.md },
  textSize_lg: { fontSize: FontSize.lg },
});
