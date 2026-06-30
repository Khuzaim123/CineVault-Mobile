import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, ActivityIndicator, ScrollView, Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import YoutubeIframe from 'react-native-youtube-iframe';
import { StatusBar } from 'expo-status-bar';
import { tmdb } from '../lib/tmdb';
import {
  ArrowLeftIcon, TvSeasonIcon, EpisodesIcon,
  CircleDotIcon, InfoIcon, SignalIcon, ChevronRightIcon,
} from '../components/icons';
import { Colors, Fonts, Radius, Spacing } from '../constants/theme';

const { width, height } = Dimensions.get('window');
const PLAYER_H = Math.round(height * 0.38); // 38% of screen = much larger

// ─── URL builders ─────────────────────────────────────────────────────────
const buildUrl = (source, tmdbId, mediaType, season, episode) => {
  const isTV = mediaType === 'tv';
  switch (source) {
    case 0:
      return isTV
        ? `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`
        : `https://vidsrc.to/embed/movie/${tmdbId}`;
    case 1:
      return isTV
        ? `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`
        : `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`;
    case 2:
      return isTV
        ? `https://multiembed.mov/?tmdb=1&video_id=${tmdbId}&tmdb_type=tv&s=${season}&e=${episode}`
        : `https://multiembed.mov/?tmdb=1&video_id=${tmdbId}&tmdb_type=movie`;
    default:
      return null;
  }
};

const STREAM_SOURCES = [
  { id: 0, label: 'Source 1', short: 'S1' },
  { id: 1, label: 'Source 2', short: 'S2' },
  { id: 2, label: 'Source 3', short: 'S3' },
];

export default function PlayerScreen() {
  const { tmdbId, mediaType, title, trailerKey } = useLocalSearchParams();
  const router = useRouter();
  const isTV = mediaType === 'tv';

  // ── Source state ──────────────────────────────────────────
  const [activeSource, setActiveSource] = useState(0); // 0,1,2 = stream; 3 = trailer
  const [webviewKey, setWebviewKey] = useState(0);
  const [webviewLoading, setWebviewLoading] = useState(true);
  const autoTimer = useRef(null);

  // ── TV season/episode state ───────────────────────────────
  const [seasons, setSeasons] = useState([]);
  const [activeSeason, setActiveSeason] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [activeEpisode, setActiveEpisode] = useState(1);
  const [seasonLoading, setSeasonLoading] = useState(false);

  // ── Fetch seasons on mount (TV only) ─────────────────────
  useEffect(() => {
    if (!isTV || !tmdbId) return;
    tmdb.getTVDetails(tmdbId).then((data) => {
      const valid = (data.seasons || []).filter((s) => s.season_number > 0);
      setSeasons(valid);
      if (valid.length > 0) loadEpisodes(valid[0].season_number);
    }).catch(console.error);
  }, [tmdbId, isTV]);

  const loadEpisodes = async (seasonNum) => {
    setSeasonLoading(true);
    try {
      const data = await tmdb.getTVSeason(tmdbId, seasonNum);
      setEpisodes(data.episodes || []);
      setActiveEpisode(1);
    } catch (e) { console.error(e); }
    finally { setSeasonLoading(false); }
  };

  const selectSeason = (seasonNum) => {
    setActiveSeason(seasonNum);
    loadEpisodes(seasonNum);
    refreshPlayer();
  };

  const selectEpisode = (epNum) => {
    setActiveEpisode(epNum);
    refreshPlayer();
  };

  // ── Auto-advance ──────────────────────────────────────────
  const clearTimer = () => { if (autoTimer.current) clearTimeout(autoTimer.current); };

  const refreshPlayer = useCallback(() => {
    clearTimer();
    setWebviewLoading(true);
    setWebviewKey((k) => k + 1);
  }, []);

  const scheduleAdvance = useCallback(() => {
    clearTimer();
    if (activeSource < 2) {
      autoTimer.current = setTimeout(() => {
        setActiveSource((s) => s + 1);
        setWebviewKey((k) => k + 1);
        setWebviewLoading(true);
      }, 14000);
    }
  }, [activeSource]);

  useEffect(() => {
    if (activeSource < 3) scheduleAdvance();
    return clearTimer;
  }, [activeSource, webviewKey]);

  const handleLoad = () => { clearTimer(); setWebviewLoading(false); };
  const handleError = () => { clearTimer(); if (activeSource < 2) { setActiveSource((s) => s + 1); setWebviewKey((k) => k + 1); } };
  const handleHttpError = ({ nativeEvent }) => { if (nativeEvent.statusCode >= 400) handleError(); };

  const selectSource = (idx) => {
    clearTimer();
    setActiveSource(idx);
    setWebviewKey((k) => k + 1);
    setWebviewLoading(true);
  };

  // ── Current stream URL ────────────────────────────────────
  const streamUrl = activeSource < 3
    ? buildUrl(activeSource, tmdbId, mediaType, activeSeason, activeEpisode)
    : null;

  const isTrailer = activeSource === 3 && !!trailerKey;

  const sources = [
    ...STREAM_SOURCES,
    ...(trailerKey ? [{ id: 3, label: 'Trailer', short: 'YT' }] : []),
  ];

  if (!tmdbId) {
    return (
      <View style={styles.errorScreen}>
        <InfoIcon size={40} color={Colors.textMuted} />
        <Text style={styles.errorText}>No content available.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.errorBack}>
          <Text style={styles.errorBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      {/* ── Player ──────────────────────────────────────────── */}
      <View style={styles.playerBox}>
        {isTrailer ? (
          <YoutubeIframe
            height={PLAYER_H}
            width={width}
            videoId={trailerKey}
            play
            webViewProps={{ allowsInlineMediaPlayback: true, mediaPlaybackRequiresUserAction: false }}
          />
        ) : (
          <>
            <WebView
              key={`wv-${webviewKey}-${activeSource}-${activeSeason}-${activeEpisode}`}
              source={{ uri: streamUrl }}
              style={styles.webview}
              javaScriptEnabled
              allowsFullscreenVideo
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserGesture={false}
              onLoad={handleLoad}
              onError={handleError}
              onHttpError={handleHttpError}
              userAgent="Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
            />
            {webviewLoading && (
              <View style={styles.loadingOverlay}>
                <SignalIcon size={36} color={Colors.gold} />
                <Text style={styles.loadingText}>Loading stream…</Text>
                <Text style={styles.loadingSubText}>Auto-switching if unavailable</Text>
              </View>
            )}
          </>
        )}

        {/* Back button overlay */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeftIcon size={18} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* ── Scrollable controls ──────────────────────────────── */}
      <ScrollView style={styles.controls} showsVerticalScrollIndicator={false}>

        {/* Title */}
        <Text style={styles.titleText} numberOfLines={2}>
          {title ? decodeURIComponent(title) : 'Now Playing'}
          {isTV && ` · S${activeSeason} E${activeEpisode}`}
        </Text>

        {/* ── TV: Season selector ─────────────────────────── */}
        {isTV && seasons.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TvSeasonIcon size={15} color={Colors.gold} />
              <Text style={styles.sectionLabel}>SEASONS</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {seasons.map((s) => {
                const active = s.season_number === activeSeason;
                return (
                  <TouchableOpacity
                    key={s.season_number}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => selectSeason(s.season_number)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      S{s.season_number}
                    </Text>
                    {s.episode_count > 0 && (
                      <Text style={[styles.chipSub, active && styles.chipSubActive]}>
                        {s.episode_count}ep
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* ── TV: Episode selector ─────────────────────────── */}
        {isTV && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <EpisodesIcon size={15} color={Colors.gold} />
              <Text style={styles.sectionLabel}>EPISODES</Text>
              {seasonLoading && <ActivityIndicator size="small" color={Colors.gold} style={{ marginLeft: 8 }} />}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.episodeRow}>
              {episodes.map((ep) => {
                const active = ep.episode_number === activeEpisode;
                const still = ep.still_path ? tmdb.poster(ep.still_path, 'w300') : null;
                return (
                  <TouchableOpacity
                    key={ep.episode_number}
                    style={[styles.episodeCard, active && styles.episodeCardActive]}
                    onPress={() => selectEpisode(ep.episode_number)}
                    activeOpacity={0.8}
                  >
                    {still ? (
                      <Image source={{ uri: still }} style={styles.episodeThumb} resizeMode="cover" />
                    ) : (
                      <View style={[styles.episodeThumb, styles.episodeThumbPlaceholder]}>
                        <TvSeasonIcon size={20} color={Colors.textMuted} />
                      </View>
                    )}
                    <View style={styles.episodeInfo}>
                      <Text style={[styles.episodeNum, active && styles.episodeNumActive]}>
                        E{ep.episode_number}
                      </Text>
                      <Text style={styles.episodeName} numberOfLines={1}>
                        {ep.name || `Episode ${ep.episode_number}`}
                      </Text>
                    </View>
                    {active && <View style={styles.episodeActiveDot} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* ── Source selector ──────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SignalIcon size={15} color={Colors.gold} />
            <Text style={styles.sectionLabel}>STREAMING SOURCES</Text>
          </View>
          <View style={styles.sourceGrid}>
            {sources.map((src) => {
              const active = src.id === activeSource;
              const isYT = src.id === 3;
              return (
                <TouchableOpacity
                  key={src.id}
                  style={[styles.sourceBtn, active && (isYT ? styles.sourceBtnYTActive : styles.sourceBtnActive)]}
                  onPress={() => selectSource(src.id)}
                  activeOpacity={0.75}
                >
                  {isYT && <View style={[styles.ytDot, active && { backgroundColor: '#fff' }]} />}
                  <Text style={[styles.sourceBtnText, active && styles.sourceBtnTextActive]}>
                    {src.label}
                  </Text>
                  {active && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Info card ────────────────────────────────────── */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <CircleDotIcon size={14} color={Colors.crimson} />
            <Text style={styles.liveText}>STREAMING</Text>
            <ChevronRightIcon size={12} color={Colors.glassBorder} />
            <Text style={styles.sourceIndicator}>
              {sources.find((s) => s.id === activeSource)?.label}
              {isTV ? ` · S${activeSeason}E${activeEpisode}` : ''}
            </Text>
          </View>
          <View style={styles.infoTip}>
            <InfoIcon size={14} color={Colors.textMuted} />
            <Text style={styles.infoNote}>
              Sources auto-switch if unavailable. Tap any source to switch manually.
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },

  // Player
  playerBox: {
    width,
    height: PLAYER_H,
    backgroundColor: '#000',
    position: 'relative',
  },
  webview: { flex: 1, backgroundColor: '#000' },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: { color: Colors.textPrimary, fontFamily: Fonts.bodyMedium, fontSize: 15, marginTop: 8 },
  loadingSubText: { color: Colors.textMuted, fontFamily: Fonts.body, fontSize: 12 },
  backBtn: {
    position: 'absolute',
    top: 12, left: 12,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },

  // Controls
  controls: { flex: 1, paddingHorizontal: Spacing.md, paddingTop: Spacing.md },
  titleText: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 17,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },

  // Section
  section: { marginBottom: Spacing.md },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginBottom: 10,
  },
  sectionLabel: {
    color: Colors.textMuted,
    fontFamily: Fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 1.4,
  },

  // Season chips
  chipRow: { gap: 8, paddingBottom: 2 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.glassBorder,
    alignItems: 'center',
  },
  chipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  chipText: { color: Colors.textMuted, fontFamily: Fonts.bodyMedium, fontSize: 13 },
  chipTextActive: { color: Colors.background },
  chipSub: { color: Colors.textMuted, fontFamily: Fonts.body, fontSize: 10, marginTop: 1 },
  chipSubActive: { color: 'rgba(7,8,15,0.7)' },

  // Episode cards
  episodeRow: { gap: 10, paddingBottom: 4 },
  episodeCard: {
    width: 130,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    overflow: 'hidden',
    position: 'relative',
  },
  episodeCardActive: { borderColor: Colors.gold, borderWidth: 1.5 },
  episodeThumb: { width: '100%', height: 72, backgroundColor: Colors.glass },
  episodeThumbPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  episodeInfo: { padding: 6 },
  episodeNum: { color: Colors.textMuted, fontFamily: Fonts.bodyMedium, fontSize: 10 },
  episodeNumActive: { color: Colors.gold },
  episodeName: { color: Colors.textPrimary, fontFamily: Fonts.bodyMedium, fontSize: 11, marginTop: 1 },
  episodeActiveDot: {
    position: 'absolute', top: 6, right: 6,
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: Colors.gold,
  },

  // Sources grid
  sourceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sourceBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.glassBorder,
  },
  sourceBtnActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  sourceBtnYTActive: { backgroundColor: '#FF0000', borderColor: '#FF0000' },
  ytDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF0000' },
  sourceBtnText: { color: Colors.textMuted, fontFamily: Fonts.bodyMedium, fontSize: 13 },
  sourceBtnTextActive: { color: Colors.background },
  activeIndicator: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: Colors.background, opacity: 0.6 },

  // Info
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    padding: Spacing.md,
    gap: 10,
    marginBottom: Spacing.md,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveText: { color: Colors.crimson, fontFamily: Fonts.bodyMedium, fontSize: 11, letterSpacing: 0.6 },
  sourceIndicator: { color: Colors.textMuted, fontFamily: Fonts.body, fontSize: 12, flex: 1 },
  infoTip: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  infoNote: { color: Colors.textMuted, fontFamily: Fonts.body, fontSize: 12, lineHeight: 17, flex: 1 },

  // Error
  errorScreen: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', gap: 16 },
  errorText: { color: Colors.textMuted, fontFamily: Fonts.body, fontSize: 16 },
  errorBack: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: Colors.goldGlow, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.goldBorder },
  errorBackText: { color: Colors.gold, fontFamily: Fonts.bodyMedium, fontSize: 15 },
});
