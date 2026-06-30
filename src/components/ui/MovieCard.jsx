import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { tmdb } from '../../lib/tmdb';
import { StarIcon } from '../icons';
import { Colors, Fonts, Radius } from '../../constants/theme';

export function MovieCard({ item, mediaType = 'movie', width = 130 }) {
  const router = useRouter();
  const poster = tmdb.poster(item.poster_path, 'w342');
  const title = item.title || item.name || 'Unknown';
  const rating = item.vote_average ? item.vote_average.toFixed(1) : '?';
  const type = mediaType === 'movie' || item.title ? 'movie' : 'tv';

  const handlePress = () => {
    router.push(`/${type}/${item.id}`);
  };

  return (
    <TouchableOpacity style={[styles.card, { width }]} onPress={handlePress} activeOpacity={0.75}>
      <View style={[styles.posterContainer, { width, height: width * 1.5 }]}>
        {poster ? (
          <Image
            source={{ uri: poster }}
            style={styles.poster}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noPoster}>
            <Text style={styles.noPosterText}>No Image</Text>
          </View>
        )}
        <View style={styles.ratingBadge}>
          <StarIcon size={10} color={Colors.gold} />
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
      </View>
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginRight: 12,
  },
  posterContainer: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  noPoster: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  noPosterText: {
    color: Colors.textMuted,
    fontFamily: Fonts.body,
    fontSize: 12,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(7, 8, 15, 0.85)',
    borderRadius: Radius.full,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
  },
  ratingText: {
    color: Colors.gold,
    fontFamily: Fonts.bodyMedium,
    fontSize: 10,
  },
  title: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    marginTop: 7,
    lineHeight: 16,
  },
});
