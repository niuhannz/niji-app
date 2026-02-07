/**
 * API Layer — React Query fetchers
 *
 * Currently backed by local mock data. When you connect a real backend (Supabase, etc.),
 * swap each fetcher to hit the actual API endpoint. The React Query hooks
 * and component code won't need to change.
 */
import { SHORTS, GENRES, CREATORS } from './data'
import { MANGA_SERIES, MANGA_CHAPTERS, MOCK_EPISODES } from './mock-data'
import type { Short, MangaSeries, MangaChapter, Episode } from './types'

// Simulate network latency (remove in production)
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

// ─── Shorts / Series ───────────────────────────────────
export async function fetchTrending(): Promise<Short[]> {
  await delay(200)
  return SHORTS.filter((s) => s.isHot)
}

export async function fetchNewReleases(): Promise<Short[]> {
  await delay(200)
  return SHORTS.filter((s) => s.isNew).concat(SHORTS.slice(4, 8))
}

export async function fetchAllShorts(): Promise<Short[]> {
  await delay(100)
  return SHORTS
}

export async function fetchShortById(id: string): Promise<Short | null> {
  await delay(100)
  return SHORTS.find((s) => s.id === id) ?? null
}

export async function fetchShortsByGenre(genre: string): Promise<Short[]> {
  await delay(150)
  return genre === 'All' ? SHORTS : SHORTS.filter((s) => s.genre === genre)
}

// ─── Manga ─────────────────────────────────────────────
export async function fetchMangaSeries(): Promise<MangaSeries[]> {
  await delay(200)
  return MANGA_SERIES
}

export async function fetchMangaSeriesById(id: string): Promise<MangaSeries | null> {
  await delay(100)
  return MANGA_SERIES.find((s) => s.id === id) ?? null
}

export async function fetchChapters(seriesId: string): Promise<MangaChapter[]> {
  await delay(150)
  return MANGA_CHAPTERS.filter((ch) => ch.seriesId === seriesId)
}

export async function fetchChapterById(chapterId: string): Promise<MangaChapter | null> {
  await delay(100)
  return MANGA_CHAPTERS.find((ch) => ch.id === chapterId) ?? null
}

// ─── Episodes ──────────────────────────────────────────
export async function fetchEpisodes(seriesId: string): Promise<Episode[]> {
  await delay(150)
  return MOCK_EPISODES.filter((e) => e.seriesId === seriesId)
}

// ─── Search ────────────────────────────────────────────
export async function searchContent(query: string): Promise<{
  shorts: Short[]
  manga: MangaSeries[]
}> {
  await delay(100)
  const q = query.toLowerCase()
  return {
    shorts: SHORTS.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.titleJP.includes(query) ||
        s.creator.toLowerCase().includes(q)
    ),
    manga: MANGA_SERIES.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.titleJP.includes(query) ||
        m.creator.toLowerCase().includes(q)
    ),
  }
}

// ─── Creators ──────────────────────────────────────────
export async function fetchCreators() {
  await delay(100)
  return CREATORS
}

export async function fetchGenres() {
  return GENRES
}
