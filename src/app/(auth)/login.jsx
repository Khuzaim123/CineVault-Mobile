import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import { GoldButton } from '../../components/ui/GoldButton';
import { CineVaultLogo, MailIcon, LockIcon, AlertTriangleIcon } from '../../components/icons';
import { Colors, Fonts, Spacing, Radius } from '../../constants/theme';

const { height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, continueAsGuest, supabaseError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (e) {
      setError(e.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    router.replace('/(tabs)');
  };

  return (
    <LinearGradient
      colors={[Colors.background, '#0C0E1A', Colors.background]}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoArea}>
            <View style={styles.logoCircle}>
              <CineVaultLogo size={40} color={Colors.gold} />
            </View>
            <Text style={styles.logoText}>CineVault</Text>
            <Text style={styles.tagline}>Your Premium Cinema Companion</Text>
          </View>

          {/* Offline / Supabase paused banner */}
          {supabaseError && (
            <View style={styles.offlineBanner}>
              <View style={styles.offlineBannerHeader}>
                <AlertTriangleIcon size={16} color={Colors.gold} />
                <Text style={styles.offlineBannerText}>Backend unreachable</Text>
              </View>
              <Text style={styles.offlineBannerSub}>
                Your Supabase project may be paused. Visit supabase.com/dashboard to resume it, then reload the app.
              </Text>
            </View>
          )}

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome Back</Text>
            <Text style={styles.cardSubtitle}>Sign in to continue your journey</Text>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Email */}
            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <MailIcon size={18} color={Colors.textMuted} />
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor={Colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <LockIcon size={18} color={Colors.textMuted} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={Colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Forgot password */}
            <TouchableOpacity
              onPress={() => router.push('/(auth)/forgot-password')}
              style={styles.forgotBtn}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <GoldButton title="Sign In" onPress={handleLogin} loading={loading} />

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Guest */}
            <GoldButton
              title="Continue as Guest"
              variant="outline"
              onPress={handleGuest}
            />

            {/* Sign up link */}
            <View style={styles.signupRow}>
              <Text style={styles.signupLabel}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  kav: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xxl,
    minHeight: height,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.goldGlow,
    borderWidth: 1.5,
    borderColor: Colors.goldBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  logoText: {
    color: Colors.gold,
    fontFamily: Fonts.display,
    fontSize: 32,
    letterSpacing: 1,
  },
  tagline: {
    color: Colors.textMuted,
    fontFamily: Fonts.body,
    fontSize: 13,
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    padding: Spacing.lg,
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 24,
    marginBottom: 6,
  },
  cardSubtitle: {
    color: Colors.textMuted,
    fontFamily: Fonts.body,
    fontSize: 14,
    marginBottom: Spacing.lg,
  },
  errorBox: {
    backgroundColor: 'rgba(192, 57, 43, 0.15)',
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(192, 57, 43, 0.4)',
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  errorText: {
    color: '#E74C3C',
    fontFamily: Fonts.body,
    fontSize: 13,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    paddingHorizontal: Spacing.md,
    paddingVertical: 13,
    gap: 10,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontFamily: Fonts.body,
    fontSize: 15,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.md,
  },
  forgotText: {
    color: Colors.gold,
    fontFamily: Fonts.body,
    fontSize: 13,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.glassBorder,
  },
  dividerText: {
    color: Colors.textMuted,
    fontFamily: Fonts.body,
    fontSize: 13,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  signupLabel: {
    color: Colors.textMuted,
    fontFamily: Fonts.body,
    fontSize: 14,
  },
  signupLink: {
    color: Colors.gold,
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
  },
  offlineBanner: {
    backgroundColor: 'rgba(232,184,75,0.1)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  offlineBannerText: {
    color: Colors.gold,
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    marginBottom: 4,
  },
  offlineBannerSub: {
    color: Colors.textMuted,
    fontFamily: Fonts.body,
    fontSize: 12,
    lineHeight: 18,
  },
  offlineBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
});


