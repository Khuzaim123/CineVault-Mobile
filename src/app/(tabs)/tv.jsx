import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { MovieRow } from '../../components/ui/MovieRow';
import { tmdb } from '../../lib/tmdb';
import { TvIcon, StarIcon, SignalIcon } from '../../components/icons';
import { Colors, Fonts, Spacing, Radius } from '../../constants/theme';

const CATEGORIES = [
  { label: 'Popular', fetchFn: () => tmdb.getPopularTV() },
  { label: 'Top Rated', fetchFn: () => tmdb.getTopRatedTV() },
  { label: 'Airing Today', fetchFn: () => tmdb.getAiringTodayTV() },
  { label: 'On Air', fetchFn: () => tmdb.getOnAirTV() },
];

export default function TVScreen() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.header}>
        <Text style={styles.screenTitle}>TV Shows</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
        >
          {CATEGORIES.map((cat, i) => (
            <TouchableOpacity
              key={cat.label}
              style={[styles.tab, activeTab === i && styles.tabActive]}
              onPress={() => setActiveTab(i)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <MovieRow
          key={activeTab}
          title={CATEGORIES[activeTab].label}
          fetchFn={CATEGORIES[activeTab].fetchFn}
          mediaType="tv"
        />
        <MovieRow
          title="Trending TV This Week"
          icon={<SignalIcon size={16} color={Colors.gold} />}
          fetchFn={() => tmdb.getTrending('tv', 'week')}
          mediaType="tv"
        />
        <MovieRow
          title="Top Rated Series"
          icon={<StarIcon size={15} color={Colors.gold} />}
          fetchFn={() => tmdb.getTopRatedTV()}
          mediaType="tv"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingTop: 48,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
    backgroundColor: Colors.background,
  },
  screenTitle: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 26,
    paddingHorizontal: Spacing.md,
    marginBottom: 12,
  },
  tabs: { paddingHorizontal: Spacing.md, gap: 8 },
  tab: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: Radius.full,
    borderWidth: 1, borderColor: Colors.glassBorder, backgroundColor: Colors.glass,
  },
  tabActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  tabText: { color: Colors.textMuted, fontFamily: Fonts.bodyMedium, fontSize: 13 },
  tabTextActive: { color: Colors.background },
  scroll: { flex: 1 },
  content: { paddingTop: Spacing.lg, paddingBottom: 90 },
});
