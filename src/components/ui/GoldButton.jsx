import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Fonts, Radius } from '../../constants/theme';

export function GoldButton({ title, onPress, loading = false, variant = 'filled', style, textStyle, icon }) {
  const isFilled = variant === 'filled';

  return (
    <TouchableOpacity
      style={[
        styles.base,
        isFilled ? styles.filled : styles.outline,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={isFilled ? Colors.background : Colors.gold} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, isFilled ? styles.textFilled : styles.textOutline, icon && styles.textWithIcon, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: Radius.md,
    gap: 8,
  },
  filled: {
    backgroundColor: Colors.gold,
  },
  outline: {
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
  },
  text: {
    fontSize: 15,
    fontFamily: Fonts.bodyMedium,
    letterSpacing: 0.3,
  },
  textFilled: {
    color: Colors.background,
  },
  textOutline: {
    color: Colors.textPrimary,
  },
  textWithIcon: {
    marginLeft: 4,
  },
});
