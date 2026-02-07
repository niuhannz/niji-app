import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProgress, MyListItem } from '@/lib/types'

interface LibraryState {
  // My List
  myList: MyListItem[]
  addToMyList: (contentId: string, contentType: 'manga' | 'video') => void
  removeFromMyList: (contentId: string) => void
  isInMyList: (contentId: string) => boolean

  // User Progress
  progress: Record<string, UserProgress>
  updateMangaProgress: (contentId: string, chapter: number, page: number) => void
  updateVideoProgress: (contentId: string, episode: number, timestamp: number) => void
  getProgress: (contentId: string) => UserProgress | null
  markCompleted: (contentId: string) => void

  // Continue Reading/Watching
  getContinueItems: (type: 'manga' | 'video') => UserProgress[]

  // Liked & Saved (migrated from context)
  likedShorts: Set<string>
  savedShorts: Set<string>
  followedCreators: Set<string>
  watchHistory: string[]
  toggleLike: (id: string) => void
  toggleSave: (id: string) => void
  toggleFollow: (name: string) => void
  addToHistory: (id: string) => void
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      myList: [],
      progress: {},
      likedShorts: new Set<string>(),
      savedShorts: new Set<string>(),
      followedCreators: new Set<string>(),
      watchHistory: [],

      addToMyList: (contentId, contentType) =>
        set((state) => {
          if (state.myList.some((item) => item.contentId === contentId)) return state
          return {
            myList: [
              { contentId, contentType, addedAt: new Date().toISOString() },
              ...state.myList,
            ],
          }
        }),

      removeFromMyList: (contentId) =>
        set((state) => ({
          myList: state.myList.filter((item) => item.contentId !== contentId),
        })),

      isInMyList: (contentId) => get().myList.some((item) => item.contentId === contentId),

      updateMangaProgress: (contentId, chapter, page) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [contentId]: {
              contentId,
              contentType: 'manga',
              lastChapter: chapter,
              lastPage: page,
              updatedAt: new Date().toISOString(),
              completed: state.progress[contentId]?.completed ?? false,
            },
          },
        })),

      updateVideoProgress: (contentId, episode, timestamp) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [contentId]: {
              contentId,
              contentType: 'video',
              lastEpisode: episode,
              lastTimestamp: timestamp,
              updatedAt: new Date().toISOString(),
              completed: state.progress[contentId]?.completed ?? false,
            },
          },
        })),

      getProgress: (contentId) => get().progress[contentId] ?? null,

      markCompleted: (contentId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [contentId]: {
              ...state.progress[contentId],
              completed: true,
              updatedAt: new Date().toISOString(),
            },
          },
        })),

      getContinueItems: (type) =>
        Object.values(get().progress)
          .filter((p) => p.contentType === type && !p.completed)
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),

      toggleLike: (id) =>
        set((state) => {
          const n = new Set(state.likedShorts)
          n.has(id) ? n.delete(id) : n.add(id)
          return { likedShorts: n }
        }),

      toggleSave: (id) =>
        set((state) => {
          const n = new Set(state.savedShorts)
          n.has(id) ? n.delete(id) : n.add(id)
          return { savedShorts: n }
        }),

      toggleFollow: (name) =>
        set((state) => {
          const n = new Set(state.followedCreators)
          n.has(name) ? n.delete(name) : n.add(name)
          return { followedCreators: n }
        }),

      addToHistory: (id) =>
        set((state) => ({
          watchHistory: [id, ...state.watchHistory.filter((h) => h !== id)].slice(0, 50),
        })),
    }),
    {
      name: 'niji-library',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          const parsed = JSON.parse(str)
          // Rehydrate Sets from arrays
          if (parsed?.state) {
            if (Array.isArray(parsed.state.likedShorts))
              parsed.state.likedShorts = new Set(parsed.state.likedShorts)
            if (Array.isArray(parsed.state.savedShorts))
              parsed.state.savedShorts = new Set(parsed.state.savedShorts)
            if (Array.isArray(parsed.state.followedCreators))
              parsed.state.followedCreators = new Set(parsed.state.followedCreators)
          }
          return parsed
        },
        setItem: (name, value) => {
          // Serialize Sets as arrays
          const serialized = {
            ...value,
            state: {
              ...value.state,
              likedShorts: Array.from(value.state.likedShorts || []),
              savedShorts: Array.from(value.state.savedShorts || []),
              followedCreators: Array.from(value.state.followedCreators || []),
            },
          }
          localStorage.setItem(name, JSON.stringify(serialized))
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
)
