import React from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity,
  Animated, Dimensions, TouchableWithoutFeedback, useRef, useEffect,
} from 'react-native';
import { LogOutIcon } from '../icons';
import { Colors, Fonts, Radius, Spacing } from '../../constants/theme';

const { height } = Dimensions.get('window');

export function SignOutModal({ visible, onClose, onConfirm }) {
  const slideAnim = React.useRef(new Animated.Value(300)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, tension: 70, friction: 12, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 300, duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>

      {/* Sheet */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Icon */}
        <View style={styles.iconCircle}>
          <LogOutIcon size={28} color={Colors.crimson} />
        </View>

        <Text style={styles.title}>Sign Out</Text>
        <Text style={styles.message}>
          Are you sure you want to sign out of CineVault?{'\n'}Your saved favorites and watchlist will be waiting when you return.
        </Text>

        {/* Gold divider */}
        <View style={styles.divider} />

        {/* Confirm (destructive) */}
        <TouchableOpacity style={styles.signOutBtn} onPress={onConfirm} activeOpacity={0.85}>
          <LogOutIcon size={16} color="#fff" />
          <Text style={styles.signOutBtnText}>Yes, Sign Out</Text>
        </TouchableOpacity>

        {/* Cancel */}
        <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.85}>
          <Text style={styles.cancelBtnText}>Stay Signed In</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7, 8, 15, 0.85)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(192, 57, 43, 0.3)',
    paddingHorizontal: Spacing.lg,
    paddingBottom: 44,
    paddingTop: 12,
    alignItems: 'center',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.glassBorder,
    marginBottom: 24,
  },
  iconCircle: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: 'rgba(192, 57, 43, 0.12)',
    borderWidth: 1.5, borderColor: 'rgba(192, 57, 43, 0.35)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 24,
    marginBottom: 10,
  },
  message: {
    color: Colors.textMuted,
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  divider: {
    width: 48, height: 2,
    backgroundColor: 'rgba(192, 57, 43, 0.4)',
    borderRadius: 1, marginBottom: 20,
  },
  signOutBtn: {
    width: '100%',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.crimson,
    borderRadius: Radius.md,
    paddingVertical: 14,
    marginBottom: 10,
  },
  signOutBtnText: {
    color: '#fff',
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
  },
  cancelBtn: {
    width: '100%',
    backgroundColor: Colors.glass,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  cancelBtnText: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 15,
  },
});
