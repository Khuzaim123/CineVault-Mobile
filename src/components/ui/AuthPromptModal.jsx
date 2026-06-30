import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity,
  Animated, Dimensions, TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CineVaultLogo, UserIcon, ArrowLeftIcon } from '../icons';
import { Colors, Fonts, Radius, Spacing } from '../../constants/theme';

const { height } = Dimensions.get('window');

export function AuthPromptModal({ visible, onClose, message }) {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleSignIn = () => {
    onClose();
    router.push('/(auth)/login');
  };

  const handleSignUp = () => {
    onClose();
    router.push('/(auth)/signup');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>

      {/* Card */}
      <Animated.View
        style={[styles.cardWrapper, { transform: [{ translateY: slideAnim }] }]}
        pointerEvents="box-none"
      >
        <View style={styles.card}>
          {/* Handle bar */}
          <View style={styles.handle} />

          {/* Close button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <ArrowLeftIcon size={18} color={Colors.textMuted} />
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoRow}>
            <View style={styles.logoCircle}>
              <CineVaultLogo size={32} color={Colors.gold} />
            </View>
          </View>

          {/* Lock icon badge */}
          <View style={styles.lockBadge}>
            <UserIcon size={28} color={Colors.gold} />
          </View>

          <Text style={styles.title}>Sign In Required</Text>
          <Text style={styles.message}>
            {message || 'Create a free account to save your favorites, build your watchlist, and track your cinema journey.'}
          </Text>

          {/* Gold divider */}
          <View style={styles.divider} />

          {/* Buttons */}
          <TouchableOpacity style={styles.primaryBtn} onPress={handleSignIn} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.outlineBtn} onPress={handleSignUp} activeOpacity={0.85}>
            <Text style={styles.outlineBtnText}>Create Free Account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dismissBtn} onPress={onClose}>
            <Text style={styles.dismissText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7, 8, 15, 0.85)',
  },
  cardWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  card: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderBottomWidth: 0,
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
    paddingTop: 12,
    alignItems: 'center',
    // Gold top accent line
    borderTopColor: Colors.goldBorder,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.glassBorder,
    borderRadius: 2,
    marginBottom: 16,
  },
  closeBtn: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRow: {
    marginBottom: 16,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.goldGlow,
    borderWidth: 1.5,
    borderColor: Colors.goldBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockBadge: {
    position: 'absolute',
    top: 64,
    right: Spacing.lg + 8,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.goldBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
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
    width: 48,
    height: 2,
    backgroundColor: Colors.gold,
    borderRadius: 1,
    marginBottom: 20,
    opacity: 0.6,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: Colors.gold,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryBtnText: {
    color: Colors.background,
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    letterSpacing: 0.3,
  },
  outlineBtn: {
    width: '100%',
    backgroundColor: Colors.glass,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    marginBottom: 14,
  },
  outlineBtnText: {
    color: Colors.gold,
    fontFamily: Fonts.bodyMedium,
    fontSize: 15,
  },
  dismissBtn: {
    paddingVertical: 6,
  },
  dismissText: {
    color: Colors.textMuted,
    fontFamily: Fonts.body,
    fontSize: 13,
  },
});
