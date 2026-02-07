export type View = 'home' | 'discover' | 'player' | 'library' | 'studio' | 'ai-gen' | 'char-lab' | 'timeline' | 'profile' | 'settings'
export type Mode = 'watch' | 'create'

// ─── Content Types ─────────────────────────────────────
export interface Short {
  id: string; title: string; titleJP: string; creator: string; avatar: string
  views: string; likes: string; duration: string; genre: string
  color1: string; color2: string; ep?: string; isNew?: boolean; isHot?: boolean
  thumbnail?: string; videoUrl?: string
  isPremium?: boolean
  rating?: number
  releaseDate?: string
}

export interface MangaSeries {
  id: string
  title: string
  titleJP: string
  creator: string
  avatar: string
  coverImage: string
  genres: string[]
  description: string
  rating: number
  totalChapters: number
  status: 'ongoing' | 'completed' | 'hiatus'
  isPremium?: boolean
  color1: string
  color2: string
}

export interface MangaChapter {
  id: string
  seriesId: string
  number: number
  title: string
  pages: string[]       // array of image URLs for each page
  releaseDate: string
  isPremium?: boolean
}

export interface Episode {
  id: string
  seriesId: string
  number: number
  title: string
  titleJP?: string
  thumbnail?: string
  videoUrl: string
  duration: string
  hasIntro?: boolean
  introEnd?: number     // seconds where intro ends for "Skip Intro"
  isPremium?: boolean
}

// ─── User & Auth Types ─────────────────────────────────
export type SubscriptionTier = 'free' | 'basic' | 'premium'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  subscription: SubscriptionTier
  joinedDate: string
}

export interface UserProgress {
  contentId: string
  contentType: 'manga' | 'video'
  // Manga progress
  lastChapter?: number
  lastPage?: number
  // Video progress
  lastEpisode?: number
  lastTimestamp?: number
  // Common
  updatedAt: string
  completed?: boolean
}

export interface MyListItem {
  contentId: string
  contentType: 'manga' | 'video'
  addedAt: string
}

// ─── Discovery Types ───────────────────────────────────
export type SortOption = 'trending' | 'top-rated' | 'latest' | 'most-viewed'

export interface SearchSuggestion {
  id: string
  title: string
  type: 'series' | 'manga' | 'creator'
  thumbnail?: string
  subtitle?: string
}

// ─── Existing Types (preserved) ────────────────────────
export interface Project {
  id: string; title: string; scenes: number; duration: string
  status: 'draft' | 'rendering' | 'published'; progress?: number
  color1: string; color2: string; lastEdited: string
}

export interface Scene {
  id: number; label: string; duration: number; color: string; visible?: boolean
}

export interface Character {
  id: string; name: string; role: string; color: string
  traits: string[]; expression: string; pose: string; description: string
}

export interface Comment {
  id: string; user: string; text: string; time: string; likes: number; liked: boolean
}

export interface Toast {
  id: string; message: string; type: 'success' | 'info' | 'error'; icon?: string
}

export interface GenHistory {
  id: string; prompt: string; style: string; duration: number; timestamp: string
  scenes: { label: string; color: string }[]
}
