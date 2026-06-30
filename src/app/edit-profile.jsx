import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Image, ActivityIndicator,
  KeyboardAvoidingView, Platform, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { profilesService } from '../lib/supabaseService';
import { GoldButton } from '../components/ui/GoldButton';
import {
  ArrowLeftIcon, UserIcon, CineVaultLogo,
  CheckIcon, CameraIcon,
} from '../components/icons';
import { Colors, Fonts, Spacing, Radius } from '../constants/theme';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUri, setAvatarUri] = useState(null);   // local picked URI
  const [avatarUrl, setAvatarUrl] = useState(null);   // current remote URL
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // ── Load current profile ────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    profilesService.getProfile(user.id)
      .then((p) => {
        if (p) {
          setFullName(p.full_name || '');
          setUsername(p.username || '');
          setBio(p.bio || '');
          setAvatarUrl(p.avatar_url || null);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  // ── Pick photo from library ─────────────────────────────────
  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setError('Permission to access photos is required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  // ── Take photo with camera ──────────────────────────────────
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setError('Camera permission is required.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  // ── Save profile ────────────────────────────────────────────
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError('');
    try {
      let newAvatarUrl = avatarUrl;

      // Upload new photo if selected
      if (avatarUri) {
        setUploadingPhoto(true);
        const asset = avatarUri;
        const ext = asset.split('.').pop()?.toLowerCase() || 'jpg';
        const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
        newAvatarUrl = await profilesService.uploadAvatar(user.id, asset, mimeType);
        setUploadingPhoto(false);
        setAvatarUri(null);
        setAvatarUrl(newAvatarUrl);
      }

      await profilesService.updateProfile(user.id, {
        full_name: fullName.trim(),
        username: username.trim().toLowerCase().replace(/\s+/g, '_') || null,
        bio: bio.trim() || null,
        avatar_url: newAvatarUrl,
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.back();
      }, 1200);
    } catch (e) {
      setError(e.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
      setUploadingPhoto(false);
    }
  };

  const displayAvatar = avatarUri || avatarUrl;

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={Colors.gold} size="large" />
      </View>
    );
  }

  return (
    <LinearGradient colors={[Colors.background, '#0C0E1A', Colors.background]} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeftIcon size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          {success ? (
            <View style={styles.savedChip}>
              <CheckIcon size={14} color={Colors.background} />
              <Text style={styles.savedText}>Saved</Text>
            </View>
          ) : (
            <View style={{ width: 36 }} />
          )}
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* ── Avatar ──────────────────────────────────── */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                {displayAvatar ? (
                  <Image source={{ uri: displayAvatar }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarFallback}>
                    <UserIcon size={44} color={Colors.gold} />
                  </View>
                )}
                {uploadingPhoto && (
                  <View style={styles.avatarLoading}>
                    <ActivityIndicator color={Colors.gold} />
                  </View>
                )}
                {avatarUri && (
                  <View style={styles.avatarNewBadge}>
                    <Text style={styles.avatarNewText}>New</Text>
                  </View>
                )}
              </View>
              <View style={styles.photoActions}>
                <TouchableOpacity style={styles.photoBtn} onPress={pickPhoto} activeOpacity={0.8}>
                  <CameraIcon size={16} color={Colors.gold} />
                  <Text style={styles.photoBtnText}>Choose Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoBtn} onPress={takePhoto} activeOpacity={0.8}>
                  <CameraIcon size={16} color={Colors.textMuted} />
                  <Text style={[styles.photoBtnText, { color: Colors.textMuted }]}>Take Photo</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ── Error ───────────────────────────────────── */}
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* ── Form Card ───────────────────────────────── */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Personal Info</Text>

              <Field
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Your display name"
                autoCapitalize="words"
              />
              <Field
                label="Username"
                value={username}
                onChangeText={setUsername}
                placeholder="e.g. cinephile_42"
                autoCapitalize="none"
                prefix="@"
              />
              <Field
                label="Bio"
                value={bio}
                onChangeText={setBio}
                placeholder="Tell the world about your taste in films…"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* ── Save ────────────────────────────────────── */}
            <GoldButton
              title={saving ? 'Saving…' : 'Save Changes'}
              onPress={handleSave}
              loading={saving}
              style={{ marginTop: Spacing.lg }}
            />

            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ── Reusable field component ─────────────────────────────────
function Field({ label, value, onChangeText, placeholder, multiline, numberOfLines, autoCapitalize, prefix }) {
  return (
    <View style={fieldStyles.group}>
      <Text style={fieldStyles.label}>{label}</Text>
      <View style={[fieldStyles.wrapper, multiline && fieldStyles.wrapperMulti]}>
        {prefix && <Text style={fieldStyles.prefix}>{prefix}</Text>}
        <TextInput
          style={[fieldStyles.input, multiline && fieldStyles.inputMulti]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          autoCapitalize={autoCapitalize || 'sentences'}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
      </View>
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  group: { marginBottom: Spacing.md },
  label: { color: Colors.textMuted, fontFamily: Fonts.bodyMedium, fontSize: 12, letterSpacing: 0.8, marginBottom: 6 },
  wrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.glassBorder,
    paddingHorizontal: Spacing.md, paddingVertical: 13, gap: 4,
  },
  wrapperMulti: { alignItems: 'flex-start', paddingVertical: 12 },
  prefix: { color: Colors.textMuted, fontFamily: Fonts.body, fontSize: 15 },
  input: { flex: 1, color: Colors.textPrimary, fontFamily: Fonts.body, fontSize: 15 },
  inputMulti: { minHeight: 72 },
});

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  loader: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: Spacing.md,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.glass, borderWidth: 1, borderColor: Colors.glassBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { color: Colors.textPrimary, fontFamily: Fonts.display, fontSize: 20 },
  savedChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.gold, borderRadius: Radius.full,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  savedText: { color: Colors.background, fontFamily: Fonts.bodyMedium, fontSize: 12 },

  content: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md },

  // Avatar
  avatarSection: { alignItems: 'center', marginBottom: Spacing.xl },
  avatarContainer: { position: 'relative', marginBottom: Spacing.md },
  avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 2.5, borderColor: Colors.goldBorder },
  avatarFallback: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: Colors.goldGlow, borderWidth: 2.5, borderColor: Colors.goldBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarLoading: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 55, backgroundColor: 'rgba(7,8,15,0.6)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarNewBadge: {
    position: 'absolute', bottom: 4, right: 4,
    backgroundColor: Colors.gold, borderRadius: Radius.full,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  avatarNewText: { color: Colors.background, fontFamily: Fonts.bodyBold, fontSize: 9 },
  photoActions: { flexDirection: 'row', gap: 10 },
  photoBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.goldBorder,
  },
  photoBtnText: { color: Colors.gold, fontFamily: Fonts.bodyMedium, fontSize: 13 },

  // Error
  errorBox: {
    backgroundColor: 'rgba(192,57,43,0.12)', borderRadius: Radius.md,
    borderWidth: 1, borderColor: 'rgba(192,57,43,0.35)',
    padding: Spacing.md, marginBottom: Spacing.md,
  },
  errorText: { color: '#E74C3C', fontFamily: Fonts.body, fontSize: 13 },

  // Card
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.glassBorder,
    padding: Spacing.lg, marginBottom: Spacing.lg,
  },
  cardTitle: {
    color: Colors.textPrimary, fontFamily: Fonts.display, fontSize: 18,
    marginBottom: Spacing.lg, paddingLeft: 10,
    borderLeftWidth: 3, borderLeftColor: Colors.gold,
  },
});
