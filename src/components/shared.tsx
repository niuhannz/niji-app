import { useState, useRef } from 'react'
import {
  Home, Compass, Play, Bookmark, User, Sparkles, Wand2, Users2,
  Film, Settings, Heart, Eye, Search, Bell, Plus, X, Check,
  Clapperboard, Flame, Copy, Link, Twitter, MessageCircle,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useApp } from '@/lib/context'
import { SHORTS } from '@/lib/data'
import type { View, Mode, Short, Toast as ToastType } from '@/lib/types'

// ─── Toast System ────────────────────────────────────
export function ToastContainer() {
  const { toasts, removeToast } = useApp()
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`animate-fade-in-up flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium shadow-xl backdrop-blur-xl border
            ${t.type === 'success' ? 'bg-[#00ffaa]/10 border-[#00ffaa]/20 text-[#00ffaa]' :
              t.type === 'error' ? 'bg-[#ff2d78]/10 border-[#ff2d78]/20 text-[#ff2d78]' :
              'bg-white/10 border-white/10 text-white/80'}`}
        >
          {t.icon && <span>{t.icon}</span>}
          <span>{t.message}</span>
          <button onClick={() => removeToast(t.id)} className="ml-2 opacity-50 hover:opacity-100"><X className="w-3 h-3" /></button>
        </div>
      ))}
    </div>
  )
}

// ─── Share Modal ─────────────────────────────────────
export function ShareModal() {
  const { shareModalOpen, setShareModalOpen, watchingShort, addToast } = useApp()
  const [copied, setCopied] = useState(false)
  if (!shareModalOpen) return null

  const url = `https://niji.app/watch/${watchingShort?.id || '1'}`
  const handleCopy = () => {
    navigator.clipboard?.writeText(url).catch(() => {})
    setCopied(true)
    addToast('Link copied to clipboard!', 'success', '📋')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShareModalOpen(false)} />
      <div className="relative w-[400px] rounded-2xl glass-strong p-6 animate-fade-in-up">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold" style={{ fontFamily: 'Outfit' }}>Share 共有</h3>
          <button onClick={() => setShareModalOpen(false)} className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/40"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex gap-3 mb-5">
          {[
            { label: 'Twitter', icon: Twitter, color: '#1DA1F2', bg: '#1DA1F2' },
            { label: 'Copy Link', icon: Link, color: '#00ffaa', bg: '#00ffaa' },
            { label: 'Message', icon: MessageCircle, color: '#a855f7', bg: '#a855f7' },
          ].map(s => (
            <button key={s.label} onClick={s.label === 'Copy Link' ? handleCopy : () => addToast(`Shared to ${s.label}!`, 'success', '🎉')}
              className="flex-1 h-16 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-105"
              style={{ background: `${s.bg}12`, border: `1px solid ${s.bg}25` }}>
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
              <span className="text-[10px] text-white/60">{s.label}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={url} readOnly className="h-9 bg-white/5 border-white/5 text-xs text-white/50 flex-1" />
          <Button onClick={handleCopy} size="sm" className="h-9 px-3 text-xs bg-[#00ffaa]/20 text-[#00ffaa] border border-[#00ffaa]/30 hover:bg-[#00ffaa]/30 gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── New Project Modal ───────────────────────────────
export function NewProjectModal() {
  const { newProjectModalOpen, setNewProjectModalOpen, addProject, addToast, setView } = useApp()
  const [name, setName] = useState('')
  const [template, setTemplate] = useState('blank')
  if (!newProjectModalOpen) return null

  const colors = ['#ff2d78','#00d4ff','#a855f7','#00ffaa','#ffd600','#ff6b2b']
  const handleCreate = () => {
    if (!name.trim()) return
    const c = colors[Math.floor(Math.random() * colors.length)]
    addProject({
      id: `p${Date.now()}`, title: name, scenes: template === 'blank' ? 0 : 5,
      duration: '0:00', status: 'draft',
      color1: c, color2: colors[(colors.indexOf(c) + 2) % colors.length],
      lastEdited: 'Just now',
    })
    addToast(`Project "${name}" created!`, 'success', '🎬')
    setName(''); setNewProjectModalOpen(false); setView('timeline')
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setNewProjectModalOpen(false)} />
      <div className="relative w-[480px] rounded-2xl glass-strong p-6 animate-fade-in-up">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold" style={{ fontFamily: 'Outfit' }}>New Project 新規プロジェクト</h3>
          <button onClick={() => setNewProjectModalOpen(false)} className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/40"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] text-white/40 font-medium mb-1.5 block">PROJECT NAME</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="My Amazing Animation..." className="h-10 bg-white/5 border-white/5 text-sm placeholder:text-white/20" autoFocus />
          </div>
          <div>
            <label className="text-[10px] text-white/40 font-medium mb-2 block">TEMPLATE テンプレート</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'blank', label: 'Blank', desc: 'Start from scratch', color: '#a855f7' },
                { id: 'action', label: 'Action', desc: '5 scene template', color: '#ff2d78' },
                { id: 'story', label: 'Story', desc: '8 scene narrative', color: '#00d4ff' },
              ].map(t => (
                <button key={t.id} onClick={() => setTemplate(t.id)}
                  className={`rounded-xl p-3 text-left transition-all ${template === t.id ? 'ring-2' : 'bg-white/5 hover:bg-white/8'}`}
                  style={template === t.id ? { ringColor: t.color, background: `${t.color}12` } : {}}>
                  <p className="text-xs font-semibold mb-0.5" style={template === t.id ? { color: t.color } : { color: 'rgba(255,255,255,0.7)' }}>{t.label}</p>
                  <p className="text-[10px] text-white/40">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <Button onClick={handleCreate} disabled={!name.trim()} className="w-full h-10 text-sm font-semibold bg-gradient-to-r from-[#ff2d78] to-[#a855f7] hover:opacity-90 border-0 gap-2 disabled:opacity-30">
            <Plus className="w-4 h-4" />Create Project
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Video Card ──────────────────────────────────────
export function VideoCard({ short, size = 'md' }: { short: Short; size?: 'sm' | 'md' | 'lg' }) {
  const { handleWatch, likedShorts, toggleLike, savedShorts, toggleSave, addToast } = useApp()
  const [hovered, setHovered] = useState(false)
  const h = size === 'lg' ? 'h-[280px]' : size === 'md' ? 'h-[200px]' : 'h-[160px]'
  const isLiked = likedShorts.has(short.id)
  const isSaved = savedShorts.has(short.id)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleLike(short.id)
    if (!isLiked) addToast('Added to Liked', 'success', '❤️')
  }
  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleSave(short.id)
    addToast(isSaved ? 'Removed from Library' : 'Saved to Library', isSaved ? 'info' : 'success', isSaved ? '📂' : '🔖')
  }

  return (
    <div
      className={`group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${hovered ? 'scale-[1.02] z-10' : ''}`}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={() => handleWatch(short)}
    >
      <div className={`${h} relative`} style={{ background: `linear-gradient(135deg, ${short.color1}22, ${short.color2}22)` }}>
        <div className="absolute inset-0 opacity-40" style={{ background: `linear-gradient(135deg, ${short.color1}, ${short.color2})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full opacity-20" style={{ background: `linear-gradient(135deg, ${short.color1}, ${short.color2})`, filter: 'blur(20px)' }} />
            <Play className="absolute inset-0 m-auto w-8 h-8 text-white/60 group-hover:text-white group-hover:scale-110 transition-all" fill="currentColor" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          {short.isHot && <Badge className="bg-[#ff2d78]/90 text-white border-0 text-[10px] px-1.5 py-0 font-semibold gap-1"><Flame className="w-2.5 h-2.5" />HOT</Badge>}
          {short.isNew && <Badge className="bg-[#00d4ff]/90 text-white border-0 text-[10px] px-1.5 py-0 font-semibold">NEW</Badge>}
        </div>

        {/* Hover actions */}
        {hovered && (
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 animate-fade-in">
            <button onClick={handleLike} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${isLiked ? 'bg-[#ff2d78]/30 text-[#ff2d78]' : 'bg-black/40 text-white/60 hover:text-white'}`}>
              <Heart className="w-3.5 h-3.5" fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            <button onClick={handleSave} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${isSaved ? 'bg-[#ffd600]/30 text-[#ffd600]' : 'bg-black/40 text-white/60 hover:text-white'}`}>
              <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>
        )}

        {!hovered && (
          <div className="absolute top-2.5 right-2.5">
            <span className="text-[10px] bg-black/60 text-white/80 px-1.5 py-0.5 rounded font-medium">{short.duration}</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-[10px] text-white/40 font-medium mb-0.5">{short.titleJP}</p>
          <h3 className="text-sm font-bold text-white leading-tight mb-1.5">{short.title}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: `linear-gradient(135deg, ${short.color1}, ${short.color2})` }}>{short.avatar}</div>
              <span className="text-[11px] text-white/60">{short.creator}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-white/40">
              <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{short.views}</span>
              <span className="flex items-center gap-0.5"><Heart className="w-3 h-3" fill={isLiked ? '#ff2d78' : 'none'} style={isLiked ? { color: '#ff2d78' } : {}} />{short.likes}</span>
            </div>
          </div>
        </div>

        {hovered && <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: `inset 0 0 30px ${short.color1}20, 0 0 40px ${short.color1}15` }} />}
      </div>
    </div>
  )
}

// ─── Sidebar ─────────────────────────────────────────
export function Sidebar() {
  const { view, setView, mode, setMode } = useApp()
  const watchItems = [
    { id: 'home' as View, icon: Home, label: 'Home', labelJP: 'ホーム' },
    { id: 'discover' as View, icon: Compass, label: 'Discover', labelJP: '探索' },
    { id: 'library' as View, icon: Bookmark, label: 'Library', labelJP: 'ライブラリ' },
    { id: 'profile' as View, icon: User, label: 'Profile', labelJP: 'プロフィール' },
  ]
  const createItems = [
    { id: 'studio' as View, icon: Clapperboard, label: 'Studio', labelJP: 'スタジオ' },
    { id: 'ai-gen' as View, icon: Sparkles, label: 'AI Generate', labelJP: 'AI生成' },
    { id: 'char-lab' as View, icon: Users2, label: 'Characters', labelJP: 'キャラクター' },
    { id: 'timeline' as View, icon: Film, label: 'Timeline', labelJP: 'タイムライン' },
  ]
  const items = mode === 'watch' ? watchItems : createItems

  return (
    <div className="w-[72px] h-full glass-strong flex flex-col items-center py-4 gap-1 z-50">
      <div className="mb-3">
        <div className="relative w-10 h-10 cursor-pointer" onClick={() => { setMode('watch'); setView('home') }}>
          <div className="absolute inset-0 rounded-xl niji-gradient animate-spin-slow opacity-80" />
          <div className="absolute inset-[2px] rounded-[10px] bg-[#08080f] flex items-center justify-center">
            <span className="text-sm font-black niji-gradient-text">虹</span>
          </div>
        </div>
      </div>
      <div className="w-11 rounded-full p-0.5 bg-white/5 mb-3 flex flex-col gap-0.5">
        <button onClick={() => { setMode('watch'); setView('home') }}
          className={`w-10 h-8 rounded-full flex items-center justify-center transition-all ${mode === 'watch' ? 'bg-[#ff2d78]/20 text-[#ff2d78]' : 'text-white/30 hover:text-white/50'}`}>
          <Play className="w-3.5 h-3.5" fill={mode === 'watch' ? 'currentColor' : 'none'} />
        </button>
        <button onClick={() => { setMode('create'); setView('studio') }}
          className={`w-10 h-8 rounded-full flex items-center justify-center transition-all ${mode === 'create' ? 'bg-[#00d4ff]/20 text-[#00d4ff]' : 'text-white/30 hover:text-white/50'}`}>
          <Wand2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <Separator className="w-8 bg-white/5 mb-1" />
      <div className="flex-1 flex flex-col gap-0.5">
        {items.map(item => {
          const active = view === item.id
          return (
            <TooltipProvider key={item.id} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => setView(item.id)}
                    className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-200
                      ${active ? mode === 'watch' ? 'bg-[#ff2d78]/15 text-[#ff2d78]' : 'bg-[#00d4ff]/15 text-[#00d4ff]'
                        : 'text-white/30 hover:text-white/60 hover:bg-white/5'}`}>
                    <item.icon className="w-4 h-4" strokeWidth={active ? 2.5 : 2} />
                    <span className="text-[8px] font-medium leading-none">{item.labelJP}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-[#1a1a2e] border-white/10 text-xs">{item.label}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>
      <button className="w-11 h-11 rounded-xl flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-all">
        <Settings className="w-4 h-4" />
      </button>
    </div>
  )
}

// ─── Top Bar ─────────────────────────────────────────
export function TopBar() {
  const { mode, searchQuery, setSearchQuery, searchOpen, setSearchOpen, setNewProjectModalOpen } = useApp()
  const filteredShorts = searchQuery.length > 1 ? SHORTS.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.titleJP.includes(searchQuery) ||
    s.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.genre.toLowerCase().includes(searchQuery.toLowerCase())
  ) : []

  return (
    <div className="h-14 flex items-center justify-between px-5 glass-strong z-40 relative">
      <div className="flex items-center gap-3">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true) }}
            onFocus={() => searchQuery && setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
            placeholder={mode === 'watch' ? '漫剧を検索... Search shorts...' : 'Search projects...'}
            className="bg-white/5 border-white/5 pl-9 pr-8 h-9 text-sm placeholder:text-white/25 focus:border-white/15 focus:ring-0" />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); setSearchOpen(false) }} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"><X className="w-3.5 h-3.5" /></button>
          )}
          {searchOpen && filteredShorts.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-xl glass-strong border border-white/10 py-2 max-h-[300px] overflow-auto z-50">
              {filteredShorts.map(s => (
                <SearchResult key={s.id} short={s} />
              ))}
            </div>
          )}
          {searchOpen && searchQuery.length > 1 && filteredShorts.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-xl glass-strong border border-white/10 p-4 text-center z-50">
              <p className="text-xs text-white/40">No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {mode === 'create' && (
          <Button onClick={() => setNewProjectModalOpen(true)} size="sm" className="h-8 px-3 text-xs font-semibold bg-gradient-to-r from-[#ff2d78] to-[#a855f7] hover:opacity-90 border-0 gap-1.5">
            <Plus className="w-3.5 h-3.5" />New Project
          </Button>
        )}
        <button className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/5 transition-all relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ff2d78]" />
        </button>
        <button className="w-9 h-9 rounded-xl overflow-hidden niji-gradient-border">
          <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#ff2d78] to-[#a855f7] flex items-center justify-center text-xs font-bold text-white">H</div>
        </button>
      </div>
    </div>
  )
}

function SearchResult({ short }: { short: Short }) {
  const { handleWatch, setSearchOpen, setSearchQuery } = useApp()
  return (
    <button onClick={() => { handleWatch(short); setSearchOpen(false); setSearchQuery('') }}
      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-all text-left">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0"
        style={{ background: `linear-gradient(135deg, ${short.color1}, ${short.color2})` }}>{short.avatar}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{short.title}</p>
        <p className="text-[10px] text-white/40">{short.creator} · {short.genre}</p>
      </div>
      <span className="text-[10px] text-white/30">{short.duration}</span>
    </button>
  )
}
