import React from 'react';
import Svg, { Circle, Path, Rect, Polygon, Line, Polyline } from 'react-native-svg';


// ── Play ────────────────────────────────────────────────────
export const PlayIcon = ({ size = 24, color = '#F0EDE8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <Path d="M10 8L16 12L10 16V8Z" fill={color} />
  </Svg>
);

// ── Star ────────────────────────────────────────────────────
export const StarIcon = ({ size = 24, color = '#E8B84B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill={color}
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </Svg>
);

// ── Heart ───────────────────────────────────────────────────
export const HeartIcon = ({ size = 24, color = '#F0EDE8', filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      fill={filled ? color : 'none'}
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ── Bookmark ────────────────────────────────────────────────
export const BookmarkIcon = ({ size = 24, color = '#F0EDE8', filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
      fill={filled ? color : 'none'}
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ── Search ──────────────────────────────────────────────────
export const SearchIcon = ({ size = 24, color = '#F0EDE8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="1.5" />
    <Path d="m21 21-4.35-4.35" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

// ── User ────────────────────────────────────────────────────
export const UserIcon = ({ size = 24, color = '#F0EDE8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="1.5" />
  </Svg>
);

// ── Home ────────────────────────────────────────────────────
export const HomeIcon = ({ size = 24, color = '#F0EDE8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 22V12h6v10"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ── Film ────────────────────────────────────────────────────
export const FilmIcon = ({ size = 24, color = '#F0EDE8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" stroke={color} strokeWidth="1.5" />
    <Path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

// ── TV ──────────────────────────────────────────────────────
export const TvIcon = ({ size = 24, color = '#F0EDE8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="7" width="20" height="15" rx="2" ry="2" stroke={color} strokeWidth="1.5" />
    <Path d="M17 2l-5 5-5-5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ── LogOut ──────────────────────────────────────────────────
export const LogOutIcon = ({ size = 24, color = '#F0EDE8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 17l5-5-5-5M21 12H9"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ── Info ────────────────────────────────────────────────────
export const InfoIcon = ({ size = 24, color = '#F0EDE8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <Path d="M12 8v4M12 16h.01" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

// ── Arrow Left ──────────────────────────────────────────────
export const ArrowLeftIcon = ({ size = 24, color = '#F0EDE8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M12 19l-7-7 7-7"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ── Calendar ────────────────────────────────────────────────
export const CalendarIcon = ({ size = 24, color = '#6B6875' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth="1.5" />
    <Path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

// ── Clock ───────────────────────────────────────────────────
export const ClockIcon = ({ size = 24, color = '#6B6875' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

// ── X / Close ───────────────────────────────────────────────
export const XIcon = ({ size = 24, color = '#F0EDE8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18M6 6l12 12"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
);

// ── Mail ────────────────────────────────────────────────────
export const MailIcon = ({ size = 24, color = '#6B6875' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M22 6l-10 7L2 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

// ── Lock ────────────────────────────────────────────────────
export const LockIcon = ({ size = 24, color = '#6B6875' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke={color} strokeWidth="1.5" />
    <Path
      d="M7 11V7a5 5 0 0 1 10 0v4"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ── Cine Vault Logo ─────────────────────────────────────────
export const CineVaultLogo = ({ size = 32, color = '#E8B84B' }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path
      d="M4 8h2v2H4zM4 14h2v2H4zM4 20h2v2H4zM26 8h2v2h-2zM26 14h2v2h-2zM26 20h2v2h-2z"
      fill={color}
    />
    <Rect x="7" y="6" width="18" height="20" rx="1" stroke={color} strokeWidth="1.5" />
    <Path d="M13 12l6 4-6 4V12z" fill={color} />
  </Svg>
);

// ── Alert Triangle (replaces ⚠️) ────────────────────────────
export const AlertTriangleIcon = ({ size = 24, color = '#E8B84B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    />
    <Path d="M12 9v4M12 17h.01" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

// ── Chevron Down ─────────────────────────────────────────────
export const ChevronDownIcon = ({ size = 24, color = '#F0EDE8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ── Chevron Up ───────────────────────────────────────────────
export const ChevronUpIcon = ({ size = 24, color = '#F0EDE8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 15l-6-6-6 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ── Chevron Right ────────────────────────────────────────────
export const ChevronRightIcon = ({ size = 24, color = '#F0EDE8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ── TV Season ────────────────────────────────────────────────
export const TvSeasonIcon = ({ size = 24, color = '#F0EDE8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="18" height="14" rx="2" stroke={color} strokeWidth="1.5" />
    <Path d="M8 21h8M12 17v4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M8 10l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ── Episodes / List ──────────────────────────────────────────
export const EpisodesIcon = ({ size = 24, color = '#F0EDE8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ── Circle Dot (live/streaming) ──────────────────────────────
export const CircleDotIcon = ({ size = 24, color = '#C0392B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <Circle cx="12" cy="12" r="3" fill={color} />
  </Svg>
);

// ── Signal / Stream ──────────────────────────────────────────
export const SignalIcon = ({ size = 24, color = '#F0EDE8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M1 6C1 6 5 2 12 2s11 4 11 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M5 10s2-3 7-3 7 3 7 3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M9 14s1-1 3-1 3 1 3 1" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Circle cx="12" cy="18" r="1.5" fill={color} />
  </Svg>
);

// ── Camera ───────────────────────────────────────────────────
export const CameraIcon = ({ size = 24, color = '#F0EDE8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    />
    <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth="1.5" />
  </Svg>
);

// ── Check ────────────────────────────────────────────────────
export const CheckIcon = ({ size = 24, color = '#F0EDE8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 6L9 17l-5-5"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
);

// ── Edit / Pencil ─────────────────────────────────────────────
export const EditIcon = ({ size = 24, color = '#F0EDE8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    />
    <Path
      d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
);


