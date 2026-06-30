import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { XIcon } from '../components/icons';
import { Colors, Fonts } from '../constants/theme';

// Web version: use a plain iframe instead of react-native-youtube-iframe
export default function PlayerScreenWeb() {
  const { videoId, title } = useLocalSearchParams();
  const router = useRouter();

  if (!videoId) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorText}>No trailer available.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <XIcon size={22} color={Colors.textPrimary} />
      </TouchableOpacity>
      {title && (
        <Text style={styles.title} numberOfLines={2}>
          {decodeURIComponent(title)}
        </Text>
      )}
      {/* Native iframe for web */}
      <View style={styles.iframeContainer}>
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{ border: 'none' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000', padding: 16 },
  closeBtn: {
    alignSelf: 'flex-start',
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12, marginTop: 40,
  },
  title: {
    color: Colors.textPrimary, fontFamily: Fonts.display,
    fontSize: 18, marginBottom: 16,
  },
  iframeContainer: { flex: 1 },
  error: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', gap: 16 },
  errorText: { color: Colors.textMuted, fontFamily: Fonts.body, fontSize: 16 },
  back: { color: Colors.gold, fontFamily: Fonts.bodyMedium, fontSize: 15 },
});
