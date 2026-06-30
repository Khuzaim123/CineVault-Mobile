const TMDB_KEY = process.env.EXPO_PUBLIC_TMDB_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const tmdb = {
  // ── Images ──────────────────────────────────────────────
  poster: (path, size = 'w500') =>
    path ? `${IMAGE_BASE}/${size}${path}` : null,
  backdrop: (path, size = 'w1280') =>
    path ? `${IMAGE_BASE}/${size}${path}` : null,
  profile: (path, size = 'w185') =>
    path ? `${IMAGE_BASE}/${size}${path}` : null,

  // ── Fetch helper ────────────────────────────────────────
  _get: async (endpoint, params = {}) => {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', TMDB_KEY);
    url.searchParams.append('language', 'en-US');
    Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
    return res.json();
  },

  // ── Movies ──────────────────────────────────────────────
  getTrending: (mediaType = 'movie', timeWindow = 'week') =>
    tmdb._get(`/trending/${mediaType}/${timeWindow}`),

  getNowPlaying: () => tmdb._get('/movie/now_playing'),
  getPopularMovies: (page = 1) =>
    tmdb._get('/movie/popular', { page }),
  getTopRatedMovies: (page = 1) =>
    tmdb._get('/movie/top_rated', { page }),
  getUpcomingMovies: (page = 1) =>
    tmdb._get('/movie/upcoming', { page }),

  getMovieDetails: (id) =>
    tmdb._get(`/movie/${id}`, {
      append_to_response: 'credits,videos,similar,recommendations',
    }),

  // ── TV ──────────────────────────────────────────────────
  getPopularTV: (page = 1) =>
    tmdb._get('/tv/popular', { page }),
  getTopRatedTV: (page = 1) =>
    tmdb._get('/tv/top_rated', { page }),
  getAiringTodayTV: (page = 1) =>
    tmdb._get('/tv/airing_today', { page }),
  getOnAirTV: (page = 1) =>
    tmdb._get('/tv/on_the_air', { page }),

  getTVDetails: (id) =>
    tmdb._get(`/tv/${id}`, {
      append_to_response: 'credits,videos,similar,recommendations',
    }),

  // ── People ──────────────────────────────────────────────
  getPersonDetails: (id) =>
    tmdb._get(`/person/${id}`, {
      append_to_response: 'movie_credits,tv_credits',
    }),

  // ── Search ──────────────────────────────────────────────
  searchMulti: (query, page = 1) =>
    tmdb._get('/search/multi', { query, page }),

  // ── Genres ──────────────────────────────────────────────
  getMovieGenres: () => tmdb._get('/genre/movie/list'),
  getTVGenres: () => tmdb._get('/genre/tv/list'),

  // ── TV Season Episodes ───────────────────────────────────
  getTVSeason: (tvId, seasonNumber) =>
    tmdb._get(`/tv/${tvId}/season/${seasonNumber}`),
};

