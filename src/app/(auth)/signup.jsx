import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Image, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../contexts/AuthContext';
import { profilesService } from '../../lib/supabaseService';
import { GoldButton } from '../../components/ui/GoldButton';
import {
  CineVaultLogo, MailIcon, LockIcon, UserIcon,
  ArrowLeftIcon, CameraIcon,
} from '../../components/icons';
import { Colors, Fonts, Spacing, Radius } from '../../constants/theme';

export default function SignupScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatarUri, setAvatarUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // ── Photo picker ────────────────────────────────────────────
  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { setError('Photo library access required.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]) setAvatarUri(result.assets[0].uri);
  };

  // ── Sign up ─────────────────────────────────────────────────
  const handleSignup = async () => {
    if (!fullName || !email || !password) { setError('Please fill in all fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    setError('');
    try {
      const { user } = await signUp(email, password, fullName);

      // Upload avatar if one was chosen (best-effort — don't fail signup)
      if (avatarUri && user?.id) {
        try {
          const ext = avatarUri.split('.').pop()?.toLowerCase() || 'jpg';
          const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
          const avatarUrl = await profilesService.uploadAvatar(user.id, avatarUri, mimeType);
          await profilesService.updateProfile(user.id, { avatar_url: avatarUrl });
        } catch (avatarErr) {
          console.warn('Avatar upload failed (non-fatal):', avatarErr.message);
        }
      }

      setSuccess(true);
    } catch (e) {
      setError(e.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[Colors.background, '#0C0E1A', Colors.background]} style={styles.gradient}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Back */}
          <TouchableOpacity style={styles.back} onPress={() => router.back()}>
            <ArrowLeftIcon size={20} color={Colors.textMuted} />
            <Text style={styles.backText}>Back to Login</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.logoArea}>
            <View style={styles.logoCircle}>
              <CineVaultLogo size={36} color={Colors.gold} />
            </View>
            <Text style={styles.logoText}>Create Account</Text>
            <Text style={styles.tagline}>Join CineVault for free</Text>
          </View>

          <View style={styles.card}>
            {success ? (
              <View style={styles.successBox}>
                <Text style={styles.successTitle}>Account Created!</Text>
                <Text style={styles.successMsg}>
                  Check your email for a confirmation link, then sign in.
                </Text>
                <GoldButton title="Go to Login" onPress={() => router.replace('/(auth)/login')} style={{ marginTop: 16 }} />
              </View>
            ) : (
              <>
                {error ? (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                {/* ── Avatar picker ───────────────────────── */}
                <View style={styles.avatarSection}>
                  <TouchableOpacity style={styles.avatarTouch} onPress={pickPhoto} activeOpacity={0.8}>
                    {avatarUri ? (
                      <Image source={{ uri: avatarUri }} style={styles.avatarPreview} />
                    ) : (
                      <View style={styles.avatarFallback}>
                        <UserIcon size={32} color={Colors.gold} />
                      </View>
                    )}
                    <View style={styles.cameraBadge}>
                      <CameraIcon size={14} color={Colors.background} />
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.avatarHint}>
                    {avatarUri ? 'Photo selected  (tap to change)' : 'Add profile photo (optional)'}
                  </Text>
                </View>

                {/* Full name */}
                <View style={styles.inputGroup}>
                  <View style={styles.inputWrapper}>
                    <UserIcon size={18} color={Colors.textMuted} />
                    <TextInput
                      style={styles.input}
                      placeholder="Full name"
                      placeholderTextColor={Colors.textMuted}
                      value={fullName}
                      onChangeText={setFullName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

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
                    />
                  </View>
                </View>

                {/* Password */}
                <View style={styles.inputGroup}>
                  <View style={styles.inputWrapper}>
                    <LockIcon size={18} color={Colors.textMuted} />
                    <TextInput
                      style={styles.input}
                      placeholder="Password (min 6 characters)"
                      placeholderTextColor={Colors.textMuted}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                    />
                  </View>
                </View>

                <GoldButton title={loading ? 'Creating account…' : 'Create Account'} onPress={handleSignup} loading={loading} />

                <View style={styles.loginRow}>
                  <Text style={styles.loginLabel}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                    <Text style={styles.loginLink}>Sign In</Text>
                  </TouchableOpacity>
                </View>
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

  // Avatar
  avatarSection: { alignItems: 'center', marginBottom: Spacing.lg },
  avatarTouch: { position: 'relative', marginBottom: 8 },
  avatarPreview: {
    width: 88, height: 88, borderRadius: 44,
    borderWidth: 2, borderColor: Colors.goldBorder,
  },
  avatarFallback: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: Colors.goldGlow, borderWidth: 2, borderColor: Colors.goldBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: Colors.gold, borderWidth: 2, borderColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarHint: { color: Colors.textMuted, fontFamily: Fonts.body, fontSize: 12 },

  errorBox: {
    backgroundColor: 'rgba(192,57,43,0.15)', borderRadius: Radius.sm,
    borderWidth: 1, borderColor: 'rgba(192,57,43,0.4)', padding: Spacing.sm, marginBottom: Spacing.md,
  },
  errorText: { color: '#E74C3C', fontFamily: Fonts.body, fontSize: 13 },

  successBox: { alignItems: 'center', padding: Spacing.md },
  successTitle: { color: Colors.gold, fontFamily: Fonts.display, fontSize: 22, marginBottom: 10 },
  successMsg: { color: Colors.textSecondary, fontFamily: Fonts.body, fontSize: 14, textAlign: 'center', lineHeight: 20 },

  inputGroup: { marginBottom: Spacing.md },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background,
    borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.glassBorder,
    paddingHorizontal: Spacing.md, paddingVertical: 13, gap: 10,
  },
  input: { flex: 1, color: Colors.textPrimary, fontFamily: Fonts.body, fontSize: 15 },

  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.md },
  loginLabel: { color: Colors.textMuted, fontFamily: Fonts.body, fontSize: 14 },
  loginLink: { color: Colors.gold, fontFamily: Fonts.bodyMedium, fontSize: 14 },
});
