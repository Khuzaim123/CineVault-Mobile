import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MovieCard } from './MovieCard';
import { MovieCardSkeleton } from './SkeletonLoader';
import { Colors, Fonts, Spacing } from '../../constants/theme';

/**
 * MovieRow
 * @param {string}      title     - Section title (no emoji — use icon prop)
 * @param {ReactNode}   icon      - Optional SVG icon to render before the title
 * @param {Function}    fetchFn   - Async fn returning { results: [] }
 * @param {'movie'|'tv'} mediaType
 */
export function MovieRow({ title, icon, fetchFn, mediaType = 'movie' }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchFn()
      .then((data) => {
        if (!cancelled) setItems(data.results || []);
      })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleAccent} />
        {icon && <View style={styles.iconWrap}>{icon}</View>}
        <Text style={styles.title}>{title}</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <MovieCardSkeleton key={i} />)
          : items.map((item) => (
              <MovieCard key={item.id} item={item} mediaType={mediaType} />
            ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: 8,
  },
  titleAccent: {
    width: 3,
    height: 20,
    backgroundColor: Colors.gold,
    borderRadius: 2,
  },
  iconWrap: {
    opacity: 0.9,
  },
  title: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 19,
    letterSpacing: 0.3,
    flex: 1,
  },
  scroll: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 4,
  },
});
