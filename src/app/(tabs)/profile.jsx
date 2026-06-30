import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
  Image, ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { profilesService, favoritesService, watchlistService } from '../../lib/supabaseService';
import { MovieCard } from '../../components/ui/MovieCard';
import { GoldButton } from '../../components/ui/GoldButton';
import { SignOutModal } from '../../components/ui/SignOutModal';
import { CineVaultLogo, LogOutIcon, HeartIcon, BookmarkIcon, UserIcon, EditIcon } from '../../components/icons';
import { Colors, Fonts, Spacing, Radius } from '../../constants/theme';

const TABS = ['Favorites', 'Watchlist'];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isGuest, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [signOutModal, setSignOutModal] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [prof, favs, wl] = await Promise.all([
        profilesService.getProfile(user.id),
        favoritesService.getAll(user.id),
        watchlistService.getAll(user.id),
      ]);
      setProfile(prof);
      setFavorites(favs);
      setWatchlist(wl);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Re-fetch every time this screen comes into focus
  // (includes navigating back from edit-profile)
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleSignOut = () => setSignOutModal(true);

  const confirmSignOut = async () => {
    setSignOutModal(false);
    await signOut();
    router.replace('/(auth)/login');
  };

  // Convert Supabase DB row → TMDB-compatible object for MovieCard
  const toCardItem = (row) => ({
    id: row.tmdb_movie_id,
    title: row.media_type === 'movie' ? row.movie_title : undefined,
    name: row.media_type !== 'movie' ? row.movie_title : undefined,
    poster_path: row.poster_path,
    vote_average: row.vote_average,
    release_date: row.release_date,
    media_type: row.media_type,
  });

  if (isGuest) {
    return (
      <View style={styles.guestScreen}>
        <SafeAreaView style={styles.guestInner}>
          <CineVaultLogo size={60} color={Colors.gold} />
          <Text style={styles.guestTitle}>Join CineVault</Text>
          <Text style={styles.guestSub}>Sign in to save favorites, build your watchlist, and track your cinema journey.</Text>
          <GoldButton title="Sign In" onPress={() => router.replace('/(auth)/login')} style={styles.guestBtn} />
          <GoldButton title="Create Account" variant="outline" onPress={() => router.replace('/(auth)/signup')} />
        </SafeAreaView>
      </View>
    );
  }

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  // Add cache-buster so React Native doesn't serve a stale cached image
  const avatarUrl = profile?.avatar_url
    ? `${profile.avatar_url}?t=${profile.updated_at || Date.now()}`
    : null;
  const currentList = activeTab === 0 ? favorites : watchlist;

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <SafeAreaView style={styles.topBar}>
          <Text style={styles.screenTitle}>Profile</Text>
          <View style={styles.topActions}>
            <TouchableOpacity onPress={() => router.push('/edit-profile')} style={styles.actionBtn}>
              <EditIcon size={18} color={Colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignOut} style={styles.actionBtn}>
              <LogOutIcon size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Avatar & Name */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <UserIcon size={36} color={Colors.gold} />
              </View>
            )}
          </View>
          <Text style={styles.name}>{displayName}</Text>
          {profile?.username ? <Text style={styles.username}>@{profile.username}</Text> : null}
          {profile?.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}

          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <HeartIcon size={18} color={Colors.crimson} filled />
              <Text style={styles.statValue}>{favorites.length}</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <BookmarkIcon size={18} color={Colors.gold} filled />
              <Text style={styles.statValue}>{watchlist.length}</Text>
              <Text style={styles.statLabel}>Watchlist</Text>
            </View>
          </View>
        </View>

        {/* List Tabs */}
        <View style={styles.listTabRow}>
          {TABS.map((tab, i) => (
            <TouchableOpacity
              key={tab}
              style={[styles.listTab, activeTab === i && styles.listTabActive]}
              onPress={() => setActiveTab(i)}
            >
              {i === 0
                ? <HeartIcon size={15} color={activeTab === i ? Colors.background : Colors.textMuted} />
                : <BookmarkIcon size={15} color={activeTab === i ? Colors.background : Colors.textMuted} />}
              <Text style={[styles.listTabText, activeTab === i && styles.listTabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Grid */}
        {loading ? (
          <ActivityIndicator color={Colors.gold} style={{ marginTop: 40 }} />
        ) : currentList.length === 0 ? (
          <View style={styles.emptyState}>
            {activeTab === 0
              ? <HeartIcon size={48} color={Colors.glassBorder} />
              : <BookmarkIcon size={48} color={Colors.glassBorder} />}
            <Text style={styles.emptyTitle}>
              {activeTab === 0 ? 'No Favorites Yet' : 'Watchlist is Empty'}
            </Text>
            <Text style={styles.emptySubtitle}>
              Browse movies and TV shows to add them here.
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {currentList.map((row) => (
              <MovieCard
                key={row.id}
                item={toCardItem(row)}
                mediaType={row.media_type}
                width={105}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <SignOutModal
        visible={signOutModal}
        onClose={() => setSignOutModal(false)}
        onConfirm={confirmSignOut}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 100 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: 48,
    paddingBottom: 12,
  },
  screenTitle: { color: Colors.textPrimary, fontFamily: Fonts.display, fontSize: 26 },
  topActions: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.glass, borderWidth: 1, borderColor: Colors.glassBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  profileCard: {
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatarContainer: { marginBottom: 12 },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: Colors.goldBorder },
  avatarFallback: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: Colors.goldGlow,
    borderWidth: 2, borderColor: Colors.goldBorder, alignItems: 'center', justifyContent: 'center',
  },
  name: { color: Colors.textPrimary, fontFamily: Fonts.display, fontSize: 22, marginBottom: 2 },
  username: { color: Colors.textMuted, fontFamily: Fonts.body, fontSize: 14, marginBottom: 6 },
  bio: { color: Colors.textSecondary, fontFamily: Fonts.body, fontSize: 13, textAlign: 'center', lineHeight: 18 },
  stats: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.md, gap: 24 },
  statItem: { alignItems: 'center', gap: 4 },
  statValue: { color: Colors.textPrimary, fontFamily: Fonts.bodyBold, fontSize: 22 },
  statLabel: { color: Colors.textMuted, fontFamily: Fonts.body, fontSize: 12 },
  statDivider: { width: 1, height: 40, backgroundColor: Colors.glassBorder },
  listTabRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    padding: 4,
    gap: 4,
  },
  listTab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 9, borderRadius: Radius.sm, gap: 6,
  },
  listTabActive: { backgroundColor: Colors.gold },
  listTabText: { color: Colors.textMuted, fontFamily: Fonts.bodyMedium, fontSize: 13 },
  listTabTextActive: { color: Colors.background },
  emptyState: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  emptyTitle: { color: Colors.textMuted, fontFamily: Fonts.display, fontSize: 18 },
  emptySubtitle: { color: Colors.textMuted, fontFamily: Fonts.body, fontSize: 13, textAlign: 'center', paddingHorizontal: 32 },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: Spacing.md, gap: 12,
  },
  guestScreen: { flex: 1, backgroundColor: Colors.background },
  guestInner: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl, gap: 14 },
  guestTitle: { color: Colors.textPrimary, fontFamily: Fonts.display, fontSize: 28 },
  guestSub: { color: Colors.textMuted, fontFamily: Fonts.body, fontSize: 14, textAlign: 'center', lineHeight: 22 },
  guestBtn: { width: '100%' },
});
