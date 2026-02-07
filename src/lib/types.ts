export type View = 'home' | 'discover' | 'player' | 'library' | 'studio' | 'ai-gen' | 'char-lab' | 'timeline' | 'profile'
export type Mode = 'watch' | 'create'

export interface Short {
  id: string; title: string; titleJP: string; creator: string; avatar: string
  views: string; likes: string; duration: string; genre: string
  color1: string; color2: string; ep?: string; isNew?: boolean; isHot?: boolean
}

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
