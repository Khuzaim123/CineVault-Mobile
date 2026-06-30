import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system/legacy';

// ── Profiles ────────────────────────────────────────────────
export const profilesService = {
  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  updateProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  uploadAvatar: async (userId, fileUri, mimeType = 'image/jpeg') => {
    const ext = fileUri.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${userId}/avatar.${ext}`;

    // expo-file-system uploadAsync works at the native layer —
    // bypasses all Hermes Blob / FormData JS limitations entirely.
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token;
    if (!accessToken) throw new Error('Not authenticated');

    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;

    const result = await FileSystem.uploadAsync(
      `${supabaseUrl}/storage/v1/object/avatars/${fileName}`,
      fileUri,
      {
        httpMethod: 'PUT',
        uploadType: 0, // FileSystemUploadType.BINARY_CONTENT = 0
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': mimeType,
          'x-upsert': 'true',
        },
      }
    );

    if (result.status !== 200 && result.status !== 201) {
      throw new Error(`Upload failed (${result.status}): ${result.body}`);
    }

    const { data: publicData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return publicData.publicUrl;
  },

};

// ── Favorites ───────────────────────────────────────────────
export const favoritesService = {
  getAll: async (userId) => {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .order('added_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  add: async (userId, item) => {
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        tmdb_movie_id: item.id,
        movie_title: item.title || item.name,
        poster_path: item.poster_path,
        vote_average: item.vote_average,
        release_date: item.release_date || item.first_air_date,
        media_type: item.media_type || (item.title ? 'movie' : 'tv'),
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  remove: async (userId, tmdbMovieId) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('tmdb_movie_id', tmdbMovieId);
    if (error) throw error;
  },

  isFavorite: async (userId, tmdbMovieId) => {
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('tmdb_movie_id', tmdbMovieId)
      .maybeSingle();
    return !!data;
  },
};

// ── Watchlist ────────────────────────────────────────────────
export const watchlistService = {
  getAll: async (userId) => {
    const { data, error } = await supabase
      .from('watchlist')
      .select('*')
      .eq('user_id', userId)
      .order('added_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  add: async (userId, item) => {
    const { data, error } = await supabase
      .from('watchlist')
      .insert({
        user_id: userId,
        tmdb_movie_id: item.id,
        movie_title: item.title || item.name,
        poster_path: item.poster_path,
        vote_average: item.vote_average,
        release_date: item.release_date || item.first_air_date,
        media_type: item.media_type || (item.title ? 'movie' : 'tv'),
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  remove: async (userId, tmdbMovieId) => {
    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', userId)
      .eq('tmdb_movie_id', tmdbMovieId);
    if (error) throw error;
  },

  isInWatchlist: async (userId, tmdbMovieId) => {
    const { data } = await supabase
      .from('watchlist')
      .select('id')
      .eq('user_id', userId)
      .eq('tmdb_movie_id', tmdbMovieId)
      .maybeSingle();
    return !!data;
  },
};
