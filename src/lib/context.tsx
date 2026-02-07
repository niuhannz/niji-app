import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react'
import type { View, Mode, Short, Project, Scene, Character, Comment, Toast, GenHistory } from './types'
import { INITIAL_PROJECTS, INITIAL_SCENES, INITIAL_CHARACTERS, INITIAL_COMMENTS } from './data'

interface AppState {
  view: View; setView: (v: View) => void
  mode: Mode; setMode: (m: Mode) => void
  watchingShort: Short | null; setWatchingShort: (s: Short | null) => void
  searchQuery: string; setSearchQuery: (q: string) => void
  searchOpen: boolean; setSearchOpen: (o: boolean) => void

  likedShorts: Set<string>; toggleLike: (id: string) => void
  savedShorts: Set<string>; toggleSave: (id: string) => void
  followedCreators: Set<string>; toggleFollow: (name: string) => void
  watchHistory: string[]; addToHistory: (id: string) => void

  projects: Project[]; addProject: (p: Project) => void; deleteProject: (id: string) => void
  scenes: Scene[]; setScenes: (s: Scene[]) => void; addScene: (s: Scene) => void; deleteScene: (id: number) => void; updateScene: (id: number, updates: Partial<Scene>) => void
  characters: Character[]; setCharacters: (c: Character[]) => void; addCharacter: (c: Character) => void; updateCharacter: (id: string, updates: Partial<Character>) => void; deleteCharacter: (id: string) => void
  comments: Comment[]; addComment: (c: Comment) => void; toggleCommentLike: (id: string) => void
  genHistory: GenHistory[]; addGenHistory: (g: GenHistory) => void

  toasts: Toast[]; addToast: (message: string, type?: Toast['type'], icon?: string) => void; removeToast: (id: string) => void

  handleWatch: (s: Short) => void; handleBack: () => void
  shareModalOpen: boolean; setShareModalOpen: (o: boolean) => void
  newProjectModalOpen: boolean; setNewProjectModalOpen: (o: boolean) => void
}

const AppContext = createContext<AppState | null>(null)

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>('home')
  const [mode, setMode] = useState<Mode>('watch')
  const [watchingShort, setWatchingShort] = useState<Short | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  const [likedShorts, setLikedShorts] = useState<Set<string>>(new Set())
  const [savedShorts, setSavedShorts] = useState<Set<string>>(new Set())
  const [followedCreators, setFollowedCreators] = useState<Set<string>>(new Set())
  const [watchHistory, setWatchHistory] = useState<string[]>([])

  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS)
  const [scenes, setScenes] = useState<Scene[]>(INITIAL_SCENES)
  const [characters, setCharacters] = useState<Character[]>(INITIAL_CHARACTERS)
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS)
  const [genHistory, setGenHistory] = useState<GenHistory[]>([])
  const [toasts, setToasts] = useState<Toast[]>([])
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false)
  const toastIdRef = useRef(0)

  const addToast = useCallback((message: string, type: Toast['type'] = 'success', icon?: string) => {
    const id = `t${++toastIdRef.current}`
    setToasts(prev => [...prev, { id, message, type, icon }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])
  const removeToast = useCallback((id: string) => setToasts(prev => prev.filter(t => t.id !== id)), [])

  const toggleLike = useCallback((id: string) => {
    setLikedShorts(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }, [])
  const toggleSave = useCallback((id: string) => {
    setSavedShorts(prev => { const n = new Set(prev); if (n.has(id)) { n.delete(id) } else { n.add(id) }; return n })
  }, [])
  const toggleFollow = useCallback((name: string) => {
    setFollowedCreators(prev => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n })
  }, [])
  const addToHistory = useCallback((id: string) => {
    setWatchHistory(prev => [id, ...prev.filter(h => h !== id)].slice(0, 50))
  }, [])

  const addProject = useCallback((p: Project) => setProjects(prev => [p, ...prev]), [])
  const deleteProject = useCallback((id: string) => setProjects(prev => prev.filter(p => p.id !== id)), [])

  const addScene = useCallback((s: Scene) => setScenes(prev => [...prev, s]), [])
  const deleteScene = useCallback((id: number) => setScenes(prev => prev.filter(s => s.id !== id)), [])
  const updateScene = useCallback((id: number, updates: Partial<Scene>) => {
    setScenes(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
  }, [])

  const addCharacter = useCallback((c: Character) => setCharacters(prev => [...prev, c]), [])
  const updateCharacter = useCallback((id: string, updates: Partial<Character>) => {
    setCharacters(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
  }, [])
  const deleteCharacter = useCallback((id: string) => setCharacters(prev => prev.filter(c => c.id !== id)), [])

  const addComment = useCallback((c: Comment) => setComments(prev => [c, ...prev]), [])
  const toggleCommentLike = useCallback((id: string) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c))
  }, [])
  const addGenHistory = useCallback((g: GenHistory) => setGenHistory(prev => [g, ...prev]), [])

  const handleWatch = useCallback((short: Short) => {
    setWatchingShort(short); setView('player'); addToHistory(short.id)
  }, [addToHistory])

  const handleBack = useCallback(() => {
    setWatchingShort(null); setView('home')
  }, [])

  return (
    <AppContext.Provider value={{
      view, setView, mode, setMode, watchingShort, setWatchingShort,
      searchQuery, setSearchQuery, searchOpen, setSearchOpen,
      likedShorts, toggleLike, savedShorts, toggleSave,
      followedCreators, toggleFollow, watchHistory, addToHistory,
      projects, addProject, deleteProject,
      scenes, setScenes, addScene, deleteScene, updateScene,
      characters, setCharacters, addCharacter, updateCharacter, deleteCharacter,
      comments, addComment, toggleCommentLike,
      genHistory, addGenHistory, toasts, addToast, removeToast,
      handleWatch, handleBack,
      shareModalOpen, setShareModalOpen, newProjectModalOpen, setNewProjectModalOpen,
    }}>
      {children}
    </AppContext.Provider>
  )
}
