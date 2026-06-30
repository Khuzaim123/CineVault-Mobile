import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { tmdb } from '../../lib/tmdb';
import { PlayIcon, InfoIcon, StarIcon } from '../icons';
import { Colors, Fonts, Spacing, Radius } from '../../constants/theme';
import { SkeletonLoader } from './SkeletonLoader';

const { width, height } = Dimensions.get('window');
const HERO_HEIGHT = height * 0.62;

export function HeroSection({ item, mediaType = 'movie' }) {
  const router = useRouter();
  const backdrop = tmdb.backdrop(item?.backdrop_path);
  const title = item?.title || item?.name || '';
  const overview = item?.overview || '';
  const rating = item?.vote_average?.toFixed(1) || '?';
  const type = mediaType === 'movie' || item?.title ? 'movie' : 'tv';
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (item) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [item]);

  if (!item) {
    return (
      <View style={[styles.hero, { backgroundColor: Colors.surface }]}>
        <SkeletonLoader width={width} height={HERO_HEIGHT} borderRadius={0} />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.hero, { opacity: fadeAnim }]}>
      <ImageBackground
        source={{ uri: backdrop }}
        style={styles.backdrop}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(7,8,15,0.6)', Colors.background]}
          locations={[0, 0.5, 1]}
          style={styles.gradient}
        >
          <View style={styles.content}>
            {/* Genre pills */}
            <View style={styles.meta}>
              <View style={styles.ratingPill}>
                <StarIcon size={13} color={Colors.gold} />
                <Text style={styles.rating}>{rating}</Text>
              </View>
              <Text style={styles.year}>
                {(item.release_date || item.first_air_date || '').slice(0, 4)}
              </Text>
            </View>

            <Text style={styles.title} numberOfLines={2}>{title}</Text>
            <Text style={styles.overview} numberOfLines={3}>{overview}</Text>

            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.playBtn}
                onPress={() => router.push(`/player?id=${item.id}&type=${type}`)}
                activeOpacity={0.85}
              >
                <PlayIcon size={18} color={Colors.background} />
                <Text style={styles.playBtnText}>Play Trailer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.infoBtn}
                onPress={() => router.push(`/${type}/${item.id}`)}
                activeOpacity={0.85}
              >
                <InfoIcon size={18} color={Colors.textPrimary} />
                <Text style={styles.infoBtnText}>More Info</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: HERO_HEIGHT,
    marginBottom: 4,
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.goldGlow,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
  },
  rating: {
    color: Colors.gold,
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
  },
  year: {
    color: Colors.textMuted,
    fontFamily: Fonts.body,
    fontSize: 13,
  },
  title: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 36,
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  overview: {
    color: Colors.textSecondary,
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.gold,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: Radius.md,
    flex: 1,
    justifyContent: 'center',
  },
  playBtnText: {
    color: Colors.background,
    fontFamily: Fonts.bodyMedium,
    fontSize: 15,
  },
  infoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: Radius.md,
    flex: 1,
    justifyContent: 'center',
  },
  infoBtnText: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 15,
  },
});
