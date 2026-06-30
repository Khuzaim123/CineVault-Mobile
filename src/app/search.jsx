import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TextInput, ScrollView,
  TouchableOpacity, SafeAreaView, ActivityIndicator, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { tmdb } from '../lib/tmdb';
import { SearchIcon, ArrowLeftIcon, StarIcon, FilmIcon, TvIcon, UserIcon } from '../components/icons';
import { Colors, Fonts, Spacing, Radius } from '../constants/theme';

const TYPE_ICONS = {
  movie: FilmIcon,
  tv: TvIcon,
  person: UserIcon,
};

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async (text) => {
    setQuery(text);
    if (!text.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true);
    try {
      const data = await tmdb.searchMulti(text);
      setResults(data.results?.filter((r) => r.media_type !== 'person' || r.profile_path) || []);
      setSearched(true);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  const handlePress = (item) => {
    if (item.media_type === 'movie') router.push(`/movie/${item.id}`);
    else if (item.media_type === 'tv') router.push(`/tv/${item.id}`);
    else if (item.media_type === 'person') router.push(`/actor/${item.id}`);
  };

  const getPoster = (item) => {
    if (item.media_type === 'person') return tmdb.profile(item.profile_path);
    return tmdb.poster(item.poster_path, 'w185');
  };

  const getTitle = (item) => item.title || item.name || 'Unknown';
  const getYear = (item) => (item.release_date || item.first_air_date || '').slice(0, 4);

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeftIcon size={20} color={Colors.textMuted} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <SearchIcon size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Search movies, shows, actors..."
            placeholderTextColor={Colors.textMuted}
            value={query}
            onChangeText={handleSearch}
            autoFocus
            returnKeyType="search"
            selectionColor={Colors.gold}
          />
          {loading && <ActivityIndicator size="small" color={Colors.gold} />}
        </View>
      </SafeAreaView>

      {!searched && !loading && (
        <View style={styles.emptyState}>
          <SearchIcon size={56} color={Colors.glassBorder} />
          <Text style={styles.emptyTitle}>Discover Content</Text>
          <Text style={styles.emptySubtitle}>Search for movies, TV shows, and actors</Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list} keyboardShouldPersistTaps="handled">
        {results.map((item) => {
          const poster = getPoster(item);
          const title = getTitle(item);
          const year = getYear(item);
          const TypeIcon = TYPE_ICONS[item.media_type] || FilmIcon;

          return (
            <TouchableOpacity
              key={`${item.media_type}-${item.id}`}
              style={styles.resultItem}
              onPress={() => handlePress(item)}
              activeOpacity={0.75}
            >
              <Image
                source={poster ? { uri: poster } : null}
                style={styles.resultPoster}
                resizeMode="cover"
              />
              <View style={styles.resultInfo}>
                <View style={styles.resultTypeBadge}>
                  <TypeIcon size={12} color={Colors.gold} />
                  <Text style={styles.resultTypeText}>{item.media_type?.toUpperCase()}</Text>
                </View>
                <Text style={styles.resultTitle} numberOfLines={2}>{title}</Text>
                <View style={styles.resultMeta}>
                  {year ? <Text style={styles.resultYear}>{year}</Text> : null}
                  {item.vote_average ? (
                    <View style={styles.resultRating}>
                      <StarIcon size={11} color={Colors.gold} />
                      <Text style={styles.resultRatingText}>{item.vote_average.toFixed(1)}</Text>
                    </View>
                  ) : null}
                </View>
                {item.overview ? (
                  <Text style={styles.resultOverview} numberOfLines={2}>{item.overview}</Text>
                ) : null}
              </View>
            </TouchableOpacity>
          );
        })}

        {searched && results.length === 0 && !loading && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>No results for "{query}"</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: Spacing.md, paddingTop: 48, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.glassBorder,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.glass, borderWidth: 1, borderColor: Colors.glassBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  searchBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.glassBorder,
    paddingHorizontal: 12, paddingVertical: 10,
  },
  input: { flex: 1, color: Colors.textPrimary, fontFamily: Fonts.body, fontSize: 15 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 80 },
  emptyTitle: { color: Colors.textMuted, fontFamily: Fonts.display, fontSize: 20 },
  emptySubtitle: { color: Colors.textMuted, fontFamily: Fonts.body, fontSize: 13 },
  list: { paddingVertical: Spacing.md, gap: 2 },
  resultItem: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingHorizontal: Spacing.md, paddingVertical: 10, gap: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.glassBorder,
  },
  resultPoster: {
    width: 60, height: 90, borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
  },
  resultInfo: { flex: 1, paddingTop: 2 },
  resultTypeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.goldGlow, borderRadius: Radius.full,
    paddingHorizontal: 7, paddingVertical: 2,
    alignSelf: 'flex-start', marginBottom: 6,
  },
  resultTypeText: { color: Colors.gold, fontFamily: Fonts.bodyMedium, fontSize: 9 },
  resultTitle: { color: Colors.textPrimary, fontFamily: Fonts.bodyMedium, fontSize: 15, marginBottom: 4 },
  resultMeta: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  resultYear: { color: Colors.textMuted, fontFamily: Fonts.body, fontSize: 12 },
  resultRating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  resultRatingText: { color: Colors.gold, fontFamily: Fonts.bodyMedium, fontSize: 12 },
  resultOverview: { color: Colors.textMuted, fontFamily: Fonts.body, fontSize: 12, lineHeight: 17 },
  noResults: { alignItems: 'center', paddingVertical: 40 },
  noResultsText: { color: Colors.textMuted, fontFamily: Fonts.body, fontSize: 14 },
});
