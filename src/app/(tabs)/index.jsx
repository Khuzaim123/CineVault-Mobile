import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity,
  Text, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { HeroSection } from '../../components/ui/HeroSection';
import { MovieRow } from '../../components/ui/MovieRow';
import {
  SearchIcon, CineVaultLogo, FilmIcon, TvIcon, StarIcon,
  CalendarIcon, SignalIcon,
} from '../../components/icons';
import { tmdb } from '../../lib/tmdb';
import { Colors, Fonts, Spacing } from '../../constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const [hero, setHero] = useState(null);

  useEffect(() => {
    tmdb.getTrending('movie', 'week')
      .then((data) => {
        const results = data.results || [];
        // Pick a random movie from top 5 as hero
        setHero(results[Math.floor(Math.random() * Math.min(5, results.length))]);
      })
      .catch(console.error);
  }, []);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Top Bar */}
        <SafeAreaView style={styles.topBar}>
          <View style={styles.logoRow}>
            <CineVaultLogo size={28} color={Colors.gold} />
            <Text style={styles.logoText}>CineVault</Text>
          </View>
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => router.push('/search')}
          >
            <SearchIcon size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </SafeAreaView>

        {/* Hero */}
        <HeroSection item={hero} mediaType="movie" />

        {/* Rows */}
        <View style={styles.rows}>
          <MovieRow
            title="Trending This Week"
            icon={<SignalIcon size={16} color={Colors.gold} />}
            fetchFn={() => tmdb.getTrending('movie', 'week')}
            mediaType="movie"
          />
          <MovieRow
            title="Now Playing"
            icon={<FilmIcon size={16} color={Colors.gold} />}
            fetchFn={() => tmdb.getNowPlaying()}
            mediaType="movie"
          />
          <MovieRow
            title="Top Rated Movies"
            icon={<StarIcon size={15} color={Colors.gold} />}
            fetchFn={() => tmdb.getTopRatedMovies()}
            mediaType="movie"
          />
          <MovieRow
            title="Trending TV"
            icon={<TvIcon size={16} color={Colors.gold} />}
            fetchFn={() => tmdb.getTrending('tv', 'week')}
            mediaType="tv"
          />
          <MovieRow
            title="Upcoming"
            icon={<CalendarIcon size={16} color={Colors.gold} />}
            fetchFn={() => tmdb.getUpcomingMovies()}
            mediaType="movie"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: { flex: 1 },
  content: { paddingBottom: 90 },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: 48,
    paddingBottom: 12,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    color: Colors.gold,
    fontFamily: Fonts.display,
    fontSize: 20,
    letterSpacing: 0.5,
  },
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rows: {
    paddingTop: 16,
  },
});
