import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
  Dimensions, ActivityIndicator,
} from 'react-native';
import { AuthPromptModal } from '../../components/ui/AuthPromptModal';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import { tmdb } from '../../lib/tmdb';
import { favoritesService, watchlistService } from '../../lib/supabaseService';
import { ArrowLeftIcon, StarIcon, HeartIcon, BookmarkIcon, PlayIcon, CalendarIcon } from '../../components/icons';
import { MovieCard } from '../../components/ui/MovieCard';
import { Colors, Fonts, Spacing, Radius } from '../../constants/theme';

const { width } = Dimensions.get('window');
const BACKDROP_H = width * 0.6;

export default function TVDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user, isGuest } = useAuth();

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [isWl, setIsWl] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [wlLoading, setWlLoading] = useState(false);
  const [authModal, setAuthModal] = useState(false);

  const fetch = useCallback(async () => {
    try {
      const data = await tmdb.getTVDetails(id);
      setShow(data);
      if (user) {
        const [fav, wl] = await Promise.all([
          favoritesService.isFavorite(user.id, Number(id)),
          watchlistService.isInWatchlist(user.id, Number(id)),
        ]);
        setIsFav(fav);
        setIsWl(wl);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [id, user]);

  useEffect(() => { fetch(); }, [fetch]);

  const requireAuth = () => {
    if (isGuest || !user) {
      setAuthModal(true);
      return false;
    }
    return true;
  };

  const toggleFavorite = async () => {
    if (!requireAuth()) return;
    setFavLoading(true);
    try {
      const tvItem = { ...show, media_type: 'tv' };
      if (isFav) { await favoritesService.remove(user.id, show.id); setIsFav(false); }
      else { await favoritesService.add(user.id, tvItem); setIsFav(true); }
    } catch (e) { Alert.alert('Error', e.message); }
    finally { setFavLoading(false); }
  };

  const toggleWatchlist = async () => {
    if (!requireAuth()) return;
    setWlLoading(true);
    try {
      const tvItem = { ...show, media_type: 'tv' };
      if (isWl) { await watchlistService.remove(user.id, show.id); setIsWl(false); }
      else { await watchlistService.add(user.id, tvItem); setIsWl(true); }
    } catch (e) { Alert.alert('Error', e.message); }
    finally { setWlLoading(false); }
  };

  const trailer = show?.videos?.results?.find(
    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  );

  if (loading) return <View style={styles.loader}><ActivityIndicator color={Colors.gold} size="large" /></View>;
  if (!show) return null;

  const backdrop = tmdb.backdrop(show.backdrop_path);
  const poster = tmdb.poster(show.poster_path, 'w342');
  const genres = show.genres?.slice(0, 3) || [];
  const cast = show.credits?.cast?.slice(0, 15) || [];
  const similar = show.similar?.results?.slice(0, 10) || [];

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.backdropContainer}>
          {backdrop && <Image source={{ uri: backdrop }} style={styles.backdrop} resizeMode="cover" />}
          <LinearGradient
            colors={['rgba(7,8,15,0.2)', 'rgba(7,8,15,0.7)', Colors.background]}
            locations={[0, 0.6, 1]}
            style={StyleSheet.absoluteFill}
          />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeftIcon size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.metaRow}>
          <Image source={{ uri: poster }} style={styles.poster} resizeMode="cover" />
          <View style={styles.metaInfo}>
            <Text style={styles.title} numberOfLines={3}>{show.name}</Text>
            <View style={styles.ratingRow}>
              <StarIcon size={15} color={Colors.gold} />
              <Text style={styles.ratingText}>{show.vote_average?.toFixed(1)}</Text>
              <Text style={styles.voteCount}>({(show.vote_count || 0).toLocaleString()})</Text>
            </View>
            <View style={styles.detailRow}>
              <CalendarIcon size={13} color={Colors.textMuted} />
              <Text style={styles.detailText}>{show.first_air_date?.slice(0, 4) || '—'}</Text>
            </View>
            {show.number_of_seasons && (
              <Text style={styles.detailText}>{show.number_of_seasons} Season{show.number_of_seasons > 1 ? 's' : ''} · {show.number_of_episodes} Episodes</Text>
            )}
            <View style={styles.genres}>
              {genres.map((g) => (
                <View key={g.id} style={styles.genreChip}>
                  <Text style={styles.genreText}>{g.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.playBtn}
            onPress={() => router.push(
              `/player?tmdbId=${show.id}&mediaType=tv&title=${encodeURIComponent(show.name)}&trailerKey=${trailer?.key || ''}`
            )}
          >
            <PlayIcon size={17} color={Colors.background} />
            <Text style={styles.playBtnText}>Watch Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, isFav && styles.iconBtnActive]} onPress={toggleFavorite} disabled={favLoading}>
            {favLoading ? <ActivityIndicator size={18} color={Colors.crimson} /> : <HeartIcon size={20} color={isFav ? Colors.crimson : Colors.textPrimary} filled={isFav} />}
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, isWl && styles.iconBtnGold]} onPress={toggleWatchlist} disabled={wlLoading}>
            {wlLoading ? <ActivityIndicator size={18} color={Colors.gold} /> : <BookmarkIcon size={20} color={isWl ? Colors.gold : Colors.textPrimary} filled={isWl} />}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.overview}>{show.overview || 'No overview available.'}</Text>
        </View>

        {cast.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cast</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.castScroll}>
              {cast.map((actor) => (
                <TouchableOpacity key={actor.id} style={styles.actorCard} onPress={() => router.push(`/actor/${actor.id}`)}>
                  <Image source={{ uri: tmdb.profile(actor.profile_path) || 'https://via.placeholder.com/80x100' }} style={styles.actorPhoto} resizeMode="cover" />
                  <Text style={styles.actorName} numberOfLines={2}>{actor.name}</Text>
                  <Text style={styles.actorChar} numberOfLines={1}>{actor.character}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {similar.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Similar Shows</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.castScroll}>
              {similar.map((item) => <MovieCard key={item.id} item={item} mediaType="tv" />)}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      <AuthPromptModal
        visible={authModal}
        onClose={() => setAuthModal(false)}
        message="Sign in to save this show to your Favorites and Watchlist."
      />
    </View>
  );
}


const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  loader: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },
  content: { paddingBottom: 40 },
  backdropContainer: { height: BACKDROP_H },
  backdrop: { width: '100%', height: '100%' },
  backBtn: {
    position: 'absolute', top: 48, left: 16, width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(7,8,15,0.6)', borderWidth: 1, borderColor: Colors.glassBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  metaRow: { flexDirection: 'row', paddingHorizontal: Spacing.md, marginTop: -60, gap: 14, alignItems: 'flex-end' },
  poster: { width: 110, height: 165, borderRadius: Radius.md, borderWidth: 2, borderColor: Colors.goldBorder },
  metaInfo: { flex: 1, paddingBottom: 4 },
  title: { color: Colors.textPrimary, fontFamily: Fonts.display, fontSize: 20, lineHeight: 26, marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 },
  ratingText: { color: Colors.gold, fontFamily: Fonts.bodyBold, fontSize: 16 },
  voteCount: { color: Colors.textMuted, fontFamily: Fonts.body, fontSize: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 },
  detailText: { color: Colors.textMuted, fontFamily: Fonts.body, fontSize: 13, marginBottom: 4 },
  genres: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 4 },
  genreChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full, backgroundColor: Colors.goldGlow, borderWidth: 1, borderColor: Colors.goldBorder },
  genreText: { color: Colors.gold, fontFamily: Fonts.body, fontSize: 11 },
  actions: { flexDirection: 'row', paddingHorizontal: Spacing.md, marginTop: Spacing.md, gap: 10 },
  playBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.gold, borderRadius: Radius.md, paddingVertical: 12 },
  playBtnText: { color: Colors.background, fontFamily: Fonts.bodyMedium, fontSize: 15 },
  iconBtn: { width: 48, height: 48, borderRadius: Radius.md, backgroundColor: Colors.glass, borderWidth: 1, borderColor: Colors.glassBorder, alignItems: 'center', justifyContent: 'center' },
  iconBtnActive: { backgroundColor: 'rgba(192,57,43,0.15)', borderColor: 'rgba(192,57,43,0.4)' },
  iconBtnGold: { backgroundColor: Colors.goldGlow, borderColor: Colors.goldBorder },
  section: { paddingHorizontal: Spacing.md, marginTop: Spacing.lg },
  sectionTitle: { color: Colors.textPrimary, fontFamily: Fonts.display, fontSize: 18, marginBottom: 12, paddingLeft: 10, borderLeftWidth: 3, borderLeftColor: Colors.gold },
  overview: { color: Colors.textSecondary, fontFamily: Fonts.body, fontSize: 14, lineHeight: 22 },
  castScroll: { gap: 12, paddingBottom: 4 },
  actorCard: { width: 80, alignItems: 'center' },
  actorPhoto: { width: 72, height: 96, borderRadius: Radius.md, backgroundColor: Colors.surface, marginBottom: 6 },
  actorName: { color: Colors.textPrimary, fontFamily: Fonts.bodyMedium, fontSize: 11, textAlign: 'center' },
  actorChar: { color: Colors.textMuted, fontFamily: Fonts.body, fontSize: 10, textAlign: 'center' },
});
