import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import { GoldButton } from '../../components/ui/GoldButton';
import { CineVaultLogo, MailIcon, ArrowLeftIcon } from '../../components/icons';
import { Colors, Fonts, Spacing, Radius } from '../../constants/theme';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email) { setError('Please enter your email.'); return; }
    setLoading(true);
    setError('');
    try {
      await resetPassword(email);
      setSent(true);
    } catch (e) {
      setError(e.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[Colors.background, '#0C0E1A', Colors.background]} style={styles.gradient}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.back} onPress={() => router.back()}>
            <ArrowLeftIcon size={20} color={Colors.textMuted} />
            <Text style={styles.backText}>Back to Login</Text>
          </TouchableOpacity>

          <View style={styles.logoArea}>
            <View style={styles.logoCircle}>
              <CineVaultLogo size={36} color={Colors.gold} />
            </View>
            <Text style={styles.logoText}>Reset Password</Text>
            <Text style={styles.tagline}>We'll send a reset link to your email</Text>
          </View>

          <View style={styles.card}>
            {sent ? (
              <View style={styles.sentBox}>
                <Text style={styles.sentTitle}>Email Sent!</Text>
                <Text style={styles.sentMsg}>
                  Check your inbox for a password reset link.
                </Text>
                <GoldButton title="Back to Login" onPress={() => router.replace('/(auth)/login')} style={{ marginTop: 20 }} />
              </View>
            ) : (
              <>
                {error ? (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}
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
                    />
                  </View>
                </View>
                <GoldButton title="Send Reset Link" onPress={handleReset} loading={loading} />
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  kav: { flex: 1 },
  container: { flexGrow: 1, padding: Spacing.md, paddingTop: 60 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.xl },
  backText: { color: Colors.textMuted, fontFamily: Fonts.body, fontSize: 14 },
  logoArea: { alignItems: 'center', marginBottom: Spacing.xl },
  logoCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.goldGlow, borderWidth: 1.5, borderColor: Colors.goldBorder,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  logoText: { color: Colors.textPrimary, fontFamily: Fonts.display, fontSize: 26 },
  tagline: { color: Colors.textMuted, fontFamily: Fonts.body, fontSize: 13, marginTop: 4 },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.glassBorder, padding: Spacing.lg,
  },
  errorBox: {
    backgroundColor: 'rgba(192,57,43,0.15)', borderRadius: Radius.sm,
    borderWidth: 1, borderColor: 'rgba(192,57,43,0.4)', padding: Spacing.sm, marginBottom: Spacing.md,
  },
  errorText: { color: '#E74C3C', fontFamily: Fonts.body, fontSize: 13 },
  sentBox: { alignItems: 'center', padding: Spacing.md },
  sentTitle: { color: Colors.gold, fontFamily: Fonts.display, fontSize: 22, marginBottom: 10 },
  sentMsg: { color: Colors.textSecondary, fontFamily: Fonts.body, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  inputGroup: { marginBottom: Spacing.md },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background,
    borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.glassBorder,
    paddingHorizontal: Spacing.md, paddingVertical: 13, gap: 10,
  },
  input: { flex: 1, color: Colors.textPrimary, fontFamily: Fonts.body, fontSize: 15 },
});
