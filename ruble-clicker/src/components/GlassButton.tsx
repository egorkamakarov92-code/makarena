import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { Colors, BorderRadius } from '../constants/theme';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'default' | 'buy' | 'sell' | 'danger';
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
}

export function GlassButton({
  title,
  onPress,
  disabled = false,
  variant = 'default',
  style,
  textStyle,
  icon,
}: GlassButtonProps) {
  const variantStyles = {
    default: { bg: Colors.glass, border: Colors.glassBorder },
    buy: { bg: 'rgba(52, 199, 89, 0.15)', border: 'rgba(52, 199, 89, 0.3)' },
    sell: { bg: 'rgba(255, 59, 48, 0.15)', border: 'rgba(255, 59, 48, 0.3)' },
    danger: { bg: 'rgba(255, 59, 48, 0.15)', border: 'rgba(255, 59, 48, 0.3)' },
  };

  const v = variantStyles[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          opacity: disabled ? 0.3 : 1,
        },
        style,
      ]}
    >
      <Text style={[styles.text, textStyle]}>
        {icon ? icon + ' ' : ''}{title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
});
