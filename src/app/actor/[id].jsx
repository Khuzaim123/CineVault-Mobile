import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
  Dimensions, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { tmdb } from '../../lib/tmdb';
import { ArrowLeftIcon, StarIcon, CalendarIcon } from '../../components/icons';
import { MovieCard } from '../../components/ui/MovieCard';
import { Colors, Fonts, Spacing, Radius } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function ActorDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tmdb.getPersonDetails(id)
      .then((data) => setPerson(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <View style={styles.loader}><ActivityIndicator color={Colors.gold} size="large" /></View>;
  if (!person) return null;

  const photo = tmdb.profile(person.profile_path, 'h632');
  const movieCredits = person.movie_credits?.cast
    ?.filter((m) => m.poster_path)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 15) || [];
  const tvCredits = person.tv_credits?.cast
    ?.filter((t) => t.poster_path)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 10) || [];

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerBg}>
          {photo && (
            <Image source={{ uri: photo }} style={styles.photoBg} resizeMode="cover" blurRadius={15} />
          )}
          <LinearGradient
            colors={['rgba(7,8,15,0.4)', Colors.background]}
            style={StyleSheet.absoluteFill}
          />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeftIcon size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            {photo && <Image source={{ uri: photo }} style={styles.photo} resizeMode="cover" />}
            <Text style={styles.name}>{person.name}</Text>
            {person.known_for_department && (
              <Text style={styles.dept}>{person.known_for_department}</Text>
            )}
            <View style={styles.metaPills}>
              {person.birthday && (
                <View style={styles.pill}>
                  <CalendarIcon size={12} color={Colors.textMuted} />
                  <Text style={styles.pillText}>{person.birthday}</Text>
                </View>
              )}
              {person.popularity && (
                <View style={styles.pill}>
                  <StarIcon size={12} color={Colors.gold} />
                  <Text style={styles.pillText}>{person.popularity.toFixed(0)} popularity</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Bio */}
        {person.biography ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Biography</Text>
            <Text style={styles.bio} numberOfLines={8}>{person.biography}</Text>
          </View>
        ) : null}

        {/* Movie credits */}
        {movieCredits.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Movies</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.creditsScroll}>
              {movieCredits.map((item) => (
                <MovieCard key={`${item.id}-${item.character}`} item={item} mediaType="movie" />
              ))}
            </ScrollView>
          </View>
        )}

        {/* TV credits */}
        {tvCredits.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TV Shows</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.creditsScroll}>
              {tvCredits.map((item) => (
                <MovieCard key={`${item.id}-${item.character}`} item={item} mediaType="tv" />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  loader: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },
  content: { paddingBottom: 40 },
  headerBg: { height: 340, justifyContent: 'flex-end' },
  photoBg: { ...StyleSheet.absoluteFillObject },
  backBtn: {
    position: 'absolute', top: 48, left: 16,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(7,8,15,0.6)', borderWidth: 1, borderColor: Colors.glassBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  headerContent: { alignItems: 'center', paddingBottom: Spacing.lg },
  photo: {
    width: 120, height: 120, borderRadius: 60,
    borderWidth: 3, borderColor: Colors.gold, marginBottom: 12,
  },
  name: { color: Colors.textPrimary, fontFamily: Fonts.display, fontSize: 26, marginBottom: 4 },
  dept: { color: Colors.gold, fontFamily: Fonts.bodyMedium, fontSize: 13, marginBottom: 10 },
  metaPills: { flexDirection: 'row', gap: 10 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.glass, borderRadius: Radius.full,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: Colors.glassBorder,
  },
  pillText: { color: Colors.textMuted, fontFamily: Fonts.body, fontSize: 12 },
  section: { paddingHorizontal: Spacing.md, marginTop: Spacing.lg },
  sectionTitle: {
    color: Colors.textPrimary, fontFamily: Fonts.display, fontSize: 18,
    marginBottom: 12, paddingLeft: 10,
    borderLeftWidth: 3, borderLeftColor: Colors.gold,
  },
  bio: { color: Colors.textSecondary, fontFamily: Fonts.body, fontSize: 14, lineHeight: 22 },
  creditsScroll: { gap: 12, paddingBottom: 4 },
});
