/**
 * Mock data for Manga and Episodes.
 * Uses placeholder images from picsum.photos for manga pages.
 */
import type { MangaSeries, MangaChapter, Episode } from './types'
import { TEST_VIDEO_URL, SHORTS } from './data'

// ─── Manga Series ──────────────────────────────────────
export const MANGA_SERIES: MangaSeries[] = [
  {
    id: 'manga-1',
    title: 'Moonlit Blade',
    titleJP: '月光の刃',
    creator: 'AkiraStudio',
    avatar: 'A',
    coverImage: SHORTS[0].thumbnail || '',
    genres: ['Action', 'Fantasy'],
    description: 'A young samurai discovers an ancient blade that glows under moonlight, granting incredible power — but at a terrible cost.',
    rating: 4.8,
    totalChapters: 24,
    status: 'ongoing',
    color1: '#ff2d78',
    color2: '#a855f7',
  },
  {
    id: 'manga-2',
    title: 'Cherry Blossom Station',
    titleJP: '桜の駅',
    creator: 'SakuraManga',
    avatar: 'S',
    coverImage: SHORTS[1].thumbnail || '',
    genres: ['Romance', 'Slice of Life'],
    description: 'Every spring, two strangers meet at the same train platform beneath the cherry blossoms. A gentle story of missed connections and second chances.',
    rating: 4.6,
    totalChapters: 18,
    status: 'completed',
    color1: '#ff8fab',
    color2: '#ffc2d1',
  },
  {
    id: 'manga-3',
    title: 'Neon Ronin 2099',
    titleJP: 'ネオン浪人2099',
    creator: 'CyberInk',
    avatar: 'C',
    coverImage: SHORTS[2].thumbnail || '',
    genres: ['Sci-Fi', 'Action'],
    description: 'In a rain-soaked megacity, a disgraced cyber-samurai hunts corrupt corporations while protecting the last free hackers.',
    rating: 4.9,
    totalChapters: 32,
    status: 'ongoing',
    isPremium: true,
    color1: '#00d4ff',
    color2: '#a855f7',
  },
  {
    id: 'manga-4',
    title: 'Dragon Summit',
    titleJP: '竜の頂上',
    creator: 'MythForge',
    avatar: 'M',
    coverImage: SHORTS[10].thumbnail || '',
    genres: ['Fantasy', 'Action'],
    description: 'The last dragon rider must ascend the forbidden mountain to prevent an ancient evil from awakening.',
    rating: 4.7,
    totalChapters: 15,
    status: 'ongoing',
    color1: '#dc2626',
    color2: '#f97316',
  },
]

// Generate placeholder pages for chapters
function generatePages(count: number, seed: number): string[] {
  return Array.from({ length: count }, (_, i) =>
    `https://picsum.photos/seed/${seed * 100 + i}/800/1200`
  )
}

// ─── Manga Chapters ────────────────────────────────────
export const MANGA_CHAPTERS: MangaChapter[] = [
  // Moonlit Blade chapters
  { id: 'ch-1-1', seriesId: 'manga-1', number: 1, title: 'The Awakening', pages: generatePages(18, 1), releaseDate: '2026-01-01' },
  { id: 'ch-1-2', seriesId: 'manga-1', number: 2, title: 'First Blood', pages: generatePages(20, 2), releaseDate: '2026-01-08' },
  { id: 'ch-1-3', seriesId: 'manga-1', number: 3, title: 'Crimson Moon', pages: generatePages(22, 3), releaseDate: '2026-01-15', isPremium: true },
  { id: 'ch-1-4', seriesId: 'manga-1', number: 4, title: 'Shadow Dojo', pages: generatePages(19, 4), releaseDate: '2026-01-22', isPremium: true },

  // Cherry Blossom Station chapters
  { id: 'ch-2-1', seriesId: 'manga-2', number: 1, title: 'Platform 7', pages: generatePages(16, 5), releaseDate: '2026-01-05' },
  { id: 'ch-2-2', seriesId: 'manga-2', number: 2, title: 'Spring Rain', pages: generatePages(18, 6), releaseDate: '2026-01-12' },
  { id: 'ch-2-3', seriesId: 'manga-2', number: 3, title: 'The Letter', pages: generatePages(15, 7), releaseDate: '2026-01-19' },

  // Neon Ronin chapters
  { id: 'ch-3-1', seriesId: 'manga-3', number: 1, title: 'Rain City', pages: generatePages(24, 8), releaseDate: '2026-01-03' },
  { id: 'ch-3-2', seriesId: 'manga-3', number: 2, title: 'Ghost in the Wire', pages: generatePages(22, 9), releaseDate: '2026-01-10', isPremium: true },
  { id: 'ch-3-3', seriesId: 'manga-3', number: 3, title: 'Neon Requiem', pages: generatePages(26, 10), releaseDate: '2026-01-17', isPremium: true },

  // Dragon Summit chapters
  { id: 'ch-4-1', seriesId: 'manga-4', number: 1, title: 'The Calling', pages: generatePages(20, 11), releaseDate: '2026-01-07' },
  { id: 'ch-4-2', seriesId: 'manga-4', number: 2, title: 'Ascent', pages: generatePages(18, 12), releaseDate: '2026-01-14' },
]

// ─── Episodes ──────────────────────────────────────────
export const MOCK_EPISODES: Episode[] = SHORTS.map((s, i) => ({
  id: `ep-${s.id}`,
  seriesId: s.id,
  number: i + 1,
  title: s.title,
  titleJP: s.titleJP,
  thumbnail: s.thumbnail,
  videoUrl: s.videoUrl || TEST_VIDEO_URL,
  duration: s.duration,
  hasIntro: i < 6,           // first 6 have "intros"
  introEnd: 15,               // intro ends at 15 seconds
  isPremium: i >= 8,          // last 4 are premium
}))
