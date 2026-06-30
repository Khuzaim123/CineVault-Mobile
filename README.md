# CineVault

A cross-platform movie and TV discovery app built with **React Native** and **Expo**. Browse trending films and series, explore cast and crew, save favorites and watchlists, and watch trailers — all wrapped in a dark, cinema-inspired UI.

Runs on **iOS**, **Android**, and **Web**.

---

## Features

### Browse & Discover
- **Home feed** with a rotating hero banner and curated rows (trending, now playing, top rated, upcoming)
- Dedicated **Movies** and **TV** tabs with category browsing
- **Search** across movies, TV shows, and actors
- Rich **detail pages** with backdrops, ratings, cast, trailers, and similar titles
- **Actor profiles** with filmography

### Watch
- Built-in **player** with multiple streaming sources for movies and TV episodes
- **YouTube trailer** playback
- Season and episode picker for TV series

### Your Library
- **Favorites** and **watchlist** synced to your account
- **Profile** with display name and avatar
- **Guest mode** — browse without signing in (saving requires an account)

### Auth
- Email sign-up and sign-in via **Supabase**
- Password reset flow
- Graceful offline fallback when Supabase is unreachable

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Expo SDK 56](https://docs.expo.dev/) · React Native 0.85 · React 19 |
| Navigation | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing) |
| Backend | [Supabase](https://supabase.com/) — Auth, Postgres, Storage |
| Movie data | [The Movie Database (TMDB)](https://www.themoviedb.org/) API |
| Video | `expo-video`, `react-native-webview`, `react-native-youtube-iframe` |
| Fonts | Playfair Display · DM Sans |

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm (or yarn / pnpm)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — included via `npx expo`
- A [TMDB API key](https://www.themoviedb.org/settings/api) (free)
- A [Supabase](https://supabase.com/) project with the tables and storage bucket described below

For native development you will also need:
- **Android** — [Android Studio](https://developer.android.com/studio) with an emulator, or a physical device
- **iOS** — macOS with [Xcode](https://developer.apple.com/xcode/) (iOS simulator or device)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<Khuzaim123>/CineVaultApp.git
cd CineVaultApp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_TMDB_KEY=your_tmdb_api_key
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Note:** Never commit `.env` to version control. These keys are prefixed with `EXPO_PUBLIC_` so Expo can expose them to the client at build time.

### 4. Set up Supabase

Your Supabase project needs the following:

**Tables**

- `profiles` — `id` (uuid, FK to auth.users), `full_name`, `avatar_url`, `updated_at`
- `favorites` — `user_id`, `tmdb_movie_id`, `movie_title`, `poster_path`, `vote_average`, `release_date`, `media_type`, `added_at`
- `watchlist` — same shape as `favorites`

**Storage**

- Bucket: `avatars` (public read) for profile pictures

Enable Row Level Security and policies so users can only read/write their own rows.

### 5. Start the development server

```bash
npx expo start
```

Then press:
- `a` — open on Android emulator / device
- `i` — open on iOS simulator (macOS only)
- `w` — open in the browser

Or use the platform-specific scripts:

```bash
npm run android
npm run ios
npm run web
```

---

## Project Structure

```
src/
├── app/                  # Expo Router screens
│   ├── (auth)/           # Login, sign-up, forgot password
│   ├── (tabs)/           # Home, Movies, TV, Profile
│   ├── movie/[id].jsx    # Movie detail
│   ├── tv/[id].jsx       # TV show detail
│   ├── actor/[id].jsx    # Actor detail
│   ├── search.jsx        # Global search
│   ├── player.jsx        # Video player (native)
│   └── edit-profile.jsx  # Profile editor
├── components/
│   ├── icons/            # SVG icon set
│   └── ui/               # Reusable UI components
├── contexts/
│   └── AuthContext.jsx   # Auth state & Supabase session
├── lib/
│   ├── tmdb.js           # TMDB API client
│   ├── supabase.js       # Supabase client
│   └── supabaseService.js# Profiles, favorites, watchlist
└── constants/
    └── theme.js          # Colors, fonts, spacing
```

---

## Building for Production

This project includes [EAS Build](https://docs.expo.dev/build/introduction/) configuration in `eas.json`.

```bash
# Install EAS CLI globally (once)
npm install -g eas-cli

# Log in and configure
eas login
eas build --profile preview    # internal APK
eas build --profile production
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the Expo dev server |
| `npm run android` | Start and open on Android |
| `npm run ios` | Start and open on iOS |
| `npm run web` | Start and open in the browser |
| `npm run lint` | Run ESLint |

---

## Disclaimer

- Movie and TV metadata is provided by [TMDB](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB.
- Streaming embeds in the player are third-party sources. Availability and legality vary by region. Use responsibly.

