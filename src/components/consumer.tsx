import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Play, Bookmark, Heart, Eye, ChevronRight, Zap, Clock, TrendingUp,
  Star, Crown, Flame, Trophy, Award, Globe, Sparkles, Share2,
  MessageCircle, Send, ChevronLeft, SkipBack, SkipForward, Pause,
  Volume2, VolumeX, Maximize, Plus, User, BookOpen,
  Settings, Bell, Shield, Monitor, Languages, Film, Trash2,
  ExternalLink, LogOut, ChevronDown, Mail, Calendar, CreditCard,
  Palette, PlayCircle, BellRing, Info, FileText, Lock, Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useApp } from '@/lib/context'
import { useI18n } from '@/lib/i18n'
import { SHORTS, GENRES, CREATORS } from '@/lib/data'
import { VideoCard, MangaCard } from './shared'
import { MANGA_SERIES } from '@/lib/mock-data'
import { useAuthStore } from '@/stores/useAuthStore'
import { useLibraryStore } from '@/stores/useLibraryStore'
import type { Short, SubscriptionTier } from '@/lib/types'

// ─── Home Feed ───────────────────────────────────────
export function HomeFeed() {
  const { handleWatch } = useApp()
  const { t, lang } = useI18n()
  const [genre, setGenre] = useState('All')
  const [heroIdx, setHeroIdx] = useState(0)
  const heroShorts = SHORTS.filter(s => s.isHot)

  useEffect(() => {
    const iv = setInterval(() => setHeroIdx(i => (i + 1) % heroShorts.length), 5000)
    return () => clearInterval(iv)
  }, [heroShorts.length])

  const filtered = genre === 'All' ? SHORTS : SHORTS.filter(s => s.genre === genre)
  const hero = heroShorts[heroIdx]

  return (
    <ScrollArea className="h-full">
      <div className="p-6 pb-24">
        {/* Hero - auto rotating */}
        <div className="relative rounded-2xl overflow-hidden mb-8 h-[200px] niji-gradient-border cursor-pointer"
          onClick={() => handleWatch(hero)}>
          {hero.thumbnail ? (
            <img src={hero.thumbnail} alt={hero.title} className="absolute inset-0 w-full h-full object-cover transition-all duration-700" key={`img-${hero.id}`} />
          ) : (
            <div className="absolute inset-0 transition-all duration-700" style={{ background: `linear-gradient(135deg, ${hero.color1}25, ${hero.color2}25)` }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080f] via-[#08080f]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 transition-all duration-500" key={hero.id}>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-[#ff2d78]/20 text-[#ff2d78] border-[#ff2d78]/30 text-[10px]"><Flame className="w-3 h-3 mr-1" />{t('home.trendingNow')}</Badge>
              <Badge className="bg-white/10 text-white/50 border-0 text-[10px]">{hero.genre}</Badge>
            </div>
            <h1 className="text-2xl font-black mb-1 animate-fade-in-up" style={{ fontFamily: 'Outfit' }}>{hero.title}</h1>
            <p className="text-xs text-white/40 mb-3">{lang === 'ja' ? hero.title : hero.titleJP} — {t('common.by')} {hero.creator}</p>
            <div className="flex gap-2">
              <Button size="sm" className="h-8 px-4 text-xs font-semibold bg-[#ff2d78] hover:bg-[#ff2d78]/80 border-0 gap-1.5">
                <Play className="w-3.5 h-3.5" fill="currentColor" />{t('home.watchNow')}
              </Button>
              <Button size="sm" variant="outline" className="h-8 px-4 text-xs border-white/10 text-white/60 hover:bg-white/5 gap-1.5">
                <Plus className="w-3.5 h-3.5" />Library
              </Button>
            </div>
          </div>
          <div className="absolute top-4 right-6 flex items-center gap-3 text-xs text-white/40">
            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{hero.views}</span>
            <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{hero.likes}</span>
          </div>
          {/* Dots */}
          <div className="absolute bottom-3 right-6 flex gap-1">
            {heroShorts.map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setHeroIdx(i) }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === heroIdx ? 'bg-[#ff2d78] w-4' : 'bg-white/20'}`} />
            ))}
          </div>
        </div>

        {/* Genre Filter */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
          {GENRES.map(g => (
            <button key={g} onClick={() => setGenre(g)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all
                ${genre === g ? 'bg-[#ff2d78]/20 text-[#ff2d78] border border-[#ff2d78]/30'
                  : 'bg-white/5 text-white/40 border border-transparent hover:text-white/60 hover:bg-white/8'}`}>
              {g}{genre === g && g !== 'All' ? ` (${SHORTS.filter(s => s.genre === g).length})` : ''}
            </button>
          ))}
        </div>

        {/* Sections */}
        {[
          { label: t('home.trending'), icon: TrendingUp, color: '#ff2d78', items: filtered.slice(0, 4), size: 'lg' as const },
          { label: t('home.newReleases'), icon: Zap, color: '#00d4ff', items: filtered.slice(4, 8), size: 'md' as const },
          { label: t('home.continueWatching'), icon: Clock, color: '#a855f7', items: filtered.slice(8, 12), size: 'md' as const },
        ].map(section => section.items.length > 0 && (
          <div key={section.label} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <section.icon className="w-4 h-4" style={{ color: section.color }} />
                <h2 className="text-lg font-bold" style={{ fontFamily: 'Outfit' }}>{section.label}</h2>
                <Badge className="bg-white/5 text-white/30 border-0 text-[9px]">{section.items.length}</Badge>
              </div>
              <button className="text-xs text-white/40 hover:text-white/60 flex items-center gap-1">{t('home.viewAll')} <ChevronRight className="w-3 h-3" /></button>
            </div>
            <div className="grid grid-cols-4 gap-3 stagger-children">
              {section.items.map(s => <VideoCard key={s.id} short={s} size={section.size} />)}
            </div>
          </div>
        ))}

        {/* Manga Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#00ffaa]" />
              <h2 className="text-lg font-bold" style={{ fontFamily: 'Outfit' }}>Popular Manga</h2>
              <Badge className="bg-white/5 text-white/30 border-0 text-[9px]">{MANGA_SERIES.length}</Badge>
            </div>
            <button className="text-xs text-white/40 hover:text-white/60 flex items-center gap-1">{t('home.viewAll')} <ChevronRight className="w-3 h-3" /></button>
          </div>
          <div className="grid grid-cols-4 gap-3 stagger-children">
            {MANGA_SERIES.map(m => <MangaCard key={m.id} manga={m} />)}
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

// ─── Discover ────────────────────────────────────────
export function Discover() {
  const { followedCreators, toggleFollow, addToast, handleWatch } = useApp()
  const { t, lang } = useI18n()
  const [activeGenre, setActiveGenre] = useState<string | null>(null)
  const genreShorts = activeGenre ? SHORTS.filter(s => s.genre === activeGenre) : []

  const genreCards = [
    { name: 'Action', nameJP: 'アクション', icon: Zap, color: '#ff2d78', count: SHORTS.filter(s => s.genre === 'Action').length },
    { name: 'Romance', nameJP: '恋愛', icon: Heart, color: '#ff8fab', count: SHORTS.filter(s => s.genre === 'Romance').length },
    { name: 'Sci-Fi', nameJP: 'SF', icon: Globe, color: '#00d4ff', count: SHORTS.filter(s => s.genre === 'Sci-Fi').length },
    { name: 'Fantasy', nameJP: '幻想', icon: Sparkles, color: '#a855f7', count: SHORTS.filter(s => s.genre === 'Fantasy').length },
    { name: 'Comedy', nameJP: '喜劇', icon: Star, color: '#ffd600', count: SHORTS.filter(s => s.genre === 'Comedy').length },
  ]

  return (
    <ScrollArea className="h-full">
      <div className="p-6 pb-24">
        <div className="mb-6">
          <h1 className="text-2xl font-black mb-1 niji-gradient-text" style={{ fontFamily: 'Outfit' }}>{t('discover.title')}</h1>
          <p className="text-sm text-white/40">{t('discover.subtitle')}</p>
        </div>

        {/* Genre Cards - clickable */}
        <div className="grid grid-cols-5 gap-3 mb-8 stagger-children">
          {genreCards.map(g => (
            <div key={g.name} onClick={() => setActiveGenre(activeGenre === g.name ? null : g.name)}
              className={`relative rounded-xl overflow-hidden cursor-pointer group h-24 niji-gradient-border transition-all ${activeGenre === g.name ? 'ring-2 scale-[1.02]' : ''}`}
              style={activeGenre === g.name ? { ringColor: g.color } : {}}>
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${g.color}${activeGenre === g.name ? '25' : '12'}, ${g.color}05)` }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 group-hover:scale-105 transition-transform">
                <g.icon className="w-5 h-5" style={{ color: g.color }} />
                <span className="text-xs font-semibold text-white/80">{lang === 'ja' ? g.nameJP : g.name}</span>
                <span className="text-[9px] text-white/30">{g.count} {t('discover.shorts')}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Genre filter results */}
        {activeGenre && (
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ fontFamily: 'Outfit' }}>{activeGenre} Shorts</h2>
              <button onClick={() => setActiveGenre(null)} className="text-xs text-white/40 hover:text-white/60">{t('discover.clearFilter')}</button>
            </div>
            <div className="grid grid-cols-4 gap-3 stagger-children">
              {genreShorts.map(s => <VideoCard key={s.id} short={s} size="md" />)}
            </div>
          </div>
        )}

        {/* Top Creators - with follow */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-4 h-4 text-[#ffd600]" />
            <h2 className="text-lg font-bold" style={{ fontFamily: 'Outfit' }}>{t('discover.topCreators')}</h2>
          </div>
          <div className="flex gap-3 stagger-children">
            {CREATORS.map((c, i) => {
              const isFollowing = followedCreators.has(c.name)
              return (
                <div key={c.name} className="flex-1 rounded-xl p-4 glass hover:bg-white/[0.04] cursor-pointer transition-all group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}88)` }}>{c.avatar}</div>
                      {i < 3 && <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#08080f] flex items-center justify-center">
                        <Trophy className="w-3 h-3" style={{ color: i === 0 ? '#ffd600' : i === 1 ? '#c0c0c0' : '#cd7f32' }} />
                      </div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{c.name}</p>
                      <p className="text-[10px] text-white/40">{c.followers} followers</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-white/30 mb-2">{c.bio}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/30">{c.works} works</span>
                    <Button size="sm" variant={isFollowing ? 'default' : 'outline'}
                      onClick={() => { toggleFollow(c.name); addToast(isFollowing ? `Unfollowed ${c.name}` : `Following ${c.name}!`, isFollowing ? 'info' : 'success', isFollowing ? '👋' : '✨') }}
                      className={`h-6 px-2 text-[10px] ${isFollowing ? 'bg-[#ff2d78]/20 text-[#ff2d78] border-[#ff2d78]/30 hover:bg-[#ff2d78]/30' : 'border-white/10 text-white/50 hover:border-white/20'}`}>
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Editor's Picks */}
        {!activeGenre && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-[#00ffaa]" />
              <h2 className="text-lg font-bold" style={{ fontFamily: 'Outfit' }}>{t('discover.editorsPicks')}</h2>
            </div>
            <div className="grid grid-cols-3 gap-3 stagger-children">
              {SHORTS.slice(2, 8).map(s => <VideoCard key={s.id} short={s} size="lg" />)}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}

// ─── Player ──────────────────────────────────────────
export function Player() {
  const { watchingShort: short, handleBack, likedShorts, toggleLike, savedShorts, toggleSave,
    comments, addComment, toggleCommentLike, addToast, setShareModalOpen, followedCreators, toggleFollow } = useApp()
  const { t, lang } = useI18n()
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(75)
  const [muted, setMuted] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [isFollowing, setIsFollowing] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)
  const progressRef = useRef<HTMLDivElement>(null)
  const volumeRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  if (!short) return null
  const liked = likedShorts.has(short.id)
  const saved = savedShorts.has(short.id)
  const creatorFollowed = followedCreators.has(short.creator)

  // Sync video play state
  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    if (playing) { vid.play().catch(() => setPlaying(false)) } else { vid.pause() }
  }, [playing])

  // Sync volume
  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    vid.volume = muted ? 0 : volume / 100
    vid.muted = muted
  }, [volume, muted])

  // Auto-play on mount
  useEffect(() => {
    const vid = videoRef.current
    if (!vid || !short.videoUrl) return
    vid.volume = volume / 100
    vid.play().then(() => setPlaying(true)).catch(() => {})
  }, [short.id])

  const handleTimeUpdate = () => {
    const vid = videoRef.current
    if (!vid || !vid.duration) return
    setCurrentTime(vid.currentTime)
    setVideoDuration(vid.duration)
    setProgress((vid.currentTime / vid.duration) * 100)
  }

  const handleProgressClick = (e: React.MouseEvent) => {
    if (!progressRef.current || !videoRef.current) return
    const rect = progressRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    setProgress(pct)
    videoRef.current.currentTime = (pct / 100) * videoRef.current.duration
  }

  const handleVolumeClick = (e: React.MouseEvent) => {
    if (!volumeRef.current) return
    const rect = volumeRef.current.getBoundingClientRect()
    const v = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    setVolume(v); if (v > 0) setMuted(false)
  }

  const handleComment = () => {
    if (!commentText.trim()) return
    addComment({ id: `cm${Date.now()}`, user: 'Han', text: commentText, time: 'now', likes: 0, liked: false })
    setCommentText('')
    addToast('Comment posted!', 'success', '💬')
  }

  const skipBy = (sec: number) => {
    const vid = videoRef.current
    if (!vid) return
    vid.currentTime = Math.max(0, Math.min(vid.duration, vid.currentTime + sec))
  }

  const displayTime = videoDuration > 0 ? currentTime : 0
  const displayDuration = videoDuration > 0 ? videoDuration : (() => { const p = short.duration.split(':'); return parseInt(p[0]) * 60 + parseInt(p[1]) })()
  const timeStr = `${Math.floor(displayTime / 60)}:${String(Math.floor(displayTime % 60)).padStart(2, '0')}`
  const durStr = `${Math.floor(displayDuration / 60)}:${String(Math.floor(displayDuration % 60)).padStart(2, '0')}`

  return (
    <div className="h-full flex animate-fade-in">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 relative bg-black">
          {short.videoUrl ? (
            <video
              ref={videoRef}
              src={short.videoUrl}
              poster={short.thumbnail}
              className="absolute inset-0 w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setPlaying(false)}
              onLoadedMetadata={() => { if (videoRef.current) setVideoDuration(videoRef.current.duration) }}
              loop={false}
              playsInline
            />
          ) : (
            <>
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${short.color1}15, ${short.color2}15)` }} />
              <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${short.color1}10, transparent 70%)` }} />
            </>
          )}
          <button onClick={handleBack} className="absolute top-4 left-4 z-10 w-8 h-8 rounded-full glass flex items-center justify-center text-white/60 hover:text-white transition-all"><ChevronLeft className="w-4 h-4" /></button>
          <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={() => setPlaying(!playing)}>
            {!playing && (
              <button className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/90 hover:scale-110 transition-all border border-white/20">
                <Play className="w-7 h-7 ml-1" fill="currentColor" />
              </button>
            )}
          </div>
          <div className="absolute bottom-20 left-6 pointer-events-none">
            <p className="text-xs text-white/50 mb-1 drop-shadow-lg">{lang === 'ja' ? short.title : short.titleJP}</p>
            <h2 className="text-xl font-black drop-shadow-lg" style={{ fontFamily: 'Outfit' }}>{short.title}</h2>
          </div>

          {/* Progress bar - clickable */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-white/40 w-8 text-right font-mono">{timeStr}</span>
              <div ref={progressRef} onClick={handleProgressClick} className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer group relative">
                <div className="h-full rounded-full transition-[width] duration-100" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${short.color1}, ${short.color2})` }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `calc(${progress}% - 6px)` }} />
              </div>
              <span className="text-[10px] text-white/40 w-8 font-mono">{durStr}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <button onClick={() => skipBy(-10)} className="text-white/40 hover:text-white transition-all"><SkipBack className="w-4 h-4" /></button>
                <button onClick={() => setPlaying(!playing)} className="text-white/80 hover:text-white transition-all">
                  {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" fill="currentColor" />}
                </button>
                <button onClick={() => skipBy(10)} className="text-white/40 hover:text-white transition-all"><SkipForward className="w-4 h-4" /></button>
                <div className="flex items-center gap-1.5 ml-2">
                  <button onClick={() => setMuted(!muted)} className="text-white/40 hover:text-white transition-all">
                    {muted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                  <div ref={volumeRef} onClick={handleVolumeClick} className="w-20 h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer group relative">
                    <div className="h-full bg-white/40 rounded-full" style={{ width: muted ? '0%' : `${volume}%` }} />
                    <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `calc(${muted ? 0 : volume}% - 5px)` }} />
                  </div>
                </div>
              </div>
              <button className="text-white/40 hover:text-white transition-all"><Maximize className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <div className="w-[320px] glass-strong flex flex-col">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: `linear-gradient(135deg, ${short.color1}, ${short.color2})` }}>{short.avatar}</div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{short.creator}</p>
              <p className="text-[10px] text-white/40">243K followers</p>
            </div>
            <Button size="sm" onClick={() => { toggleFollow(short.creator); addToast(creatorFollowed ? `Unfollowed ${short.creator}` : `Following ${short.creator}!`, creatorFollowed ? 'info' : 'success') }}
              className={`h-7 px-3 text-[10px] border-0 ${creatorFollowed ? 'bg-white/10 text-white/60' : 'bg-[#ff2d78] hover:bg-[#ff2d78]/80'}`}>
              {creatorFollowed ? t('player.following') : t('player.follow')}
            </Button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { toggleLike(short.id); if (!liked) addToast('Liked!', 'success', '❤️') }}
              className={`flex-1 h-9 rounded-lg flex items-center justify-center gap-1.5 text-xs font-medium transition-all ${liked ? 'bg-[#ff2d78]/20 text-[#ff2d78]' : 'bg-white/5 text-white/50 hover:bg-white/8'}`}>
              <Heart className="w-3.5 h-3.5" fill={liked ? 'currentColor' : 'none'} />{liked ? t('player.liked') : t('player.like')}
            </button>
            <button onClick={() => setShareModalOpen(true)}
              className="flex-1 h-9 rounded-lg flex items-center justify-center gap-1.5 text-xs font-medium bg-white/5 text-white/50 hover:bg-white/8 transition-all">
              <Share2 className="w-3.5 h-3.5" />{t('player.share')}
            </button>
            <button onClick={() => { toggleSave(short.id); addToast(saved ? 'Removed from Library' : 'Saved!', saved ? 'info' : 'success', saved ? '📂' : '🔖') }}
              className={`flex-1 h-9 rounded-lg flex items-center justify-center gap-1.5 text-xs font-medium transition-all ${saved ? 'bg-[#ffd600]/20 text-[#ffd600]' : 'bg-white/5 text-white/50 hover:bg-white/8'}`}>
              <Bookmark className="w-3.5 h-3.5" fill={saved ? 'currentColor' : 'none'} />{saved ? t('player.saved') : t('player.save')}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-white/40" />{t('player.comments')} <span className="text-white/30">· {comments.length}</span>
              </h3>
              {comments.map(c => (
                <div key={c.id} className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold ${c.user === 'Han' ? 'bg-gradient-to-br from-[#ff2d78] to-[#a855f7]' : 'bg-white/10'}`}>{c.user[0]}</div>
                    <span className="text-xs font-medium">{c.user}</span>
                    <span className="text-[10px] text-white/30">{c.time}</span>
                  </div>
                  <p className="text-xs text-white/60 ml-8 mb-1">{c.text}</p>
                  <div className="ml-8 flex items-center gap-2">
                    <button onClick={() => toggleCommentLike(c.id)}
                      className={`text-[10px] flex items-center gap-1 transition-all ${c.liked ? 'text-[#ff2d78]' : 'text-white/30 hover:text-white/50'}`}>
                      <Heart className="w-3 h-3" fill={c.liked ? 'currentColor' : 'none'} />{c.likes}
                    </button>
                    <button className="text-[10px] text-white/30 hover:text-white/50">{t('player.reply')}</button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="p-3 border-t border-white/5">
          <div className="flex gap-2">
            <Input value={commentText} onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleComment()}
              placeholder={t('player.addComment')} className="h-9 bg-white/5 border-white/5 text-xs placeholder:text-white/20" />
            <Button onClick={handleComment} disabled={!commentText.trim()} size="sm" className="h-9 w-9 p-0 bg-[#ff2d78] hover:bg-[#ff2d78]/80 border-0 disabled:opacity-30">
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Library ─────────────────────────────────────────
export function Library() {
  const { likedShorts, savedShorts, watchHistory } = useApp()
  const { t } = useI18n()
  const [tab, setTab] = useState<'saved' | 'liked' | 'history'>('saved')

  const savedItems = SHORTS.filter(s => savedShorts.has(s.id))
  const likedItems = SHORTS.filter(s => likedShorts.has(s.id))
  const historyItems = watchHistory.map(id => SHORTS.find(s => s.id === id)).filter(Boolean) as Short[]
  const items = tab === 'saved' ? savedItems : tab === 'liked' ? likedItems : historyItems

  return (
    <ScrollArea className="h-full">
      <div className="p-6 pb-24">
        <h1 className="text-2xl font-black mb-1 niji-gradient-text" style={{ fontFamily: 'Outfit' }}>{t('library.title')}</h1>
        <p className="text-sm text-white/40 mb-5">{t('library.subtitle')}</p>
        <div className="flex gap-2 mb-6">
          {([['saved', 'Saved', savedItems.length], ['liked', 'Liked', likedItems.length], ['history', 'History', historyItems.length]] as const).map(([id, label, count]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2
                ${tab === id ? 'bg-[#ff2d78]/15 text-[#ff2d78] border border-[#ff2d78]/30' : 'bg-white/5 text-white/40 border border-transparent hover:bg-white/8'}`}>
              {label}
              <span className={`text-[9px] px-1.5 rounded-full ${tab === id ? 'bg-[#ff2d78]/20' : 'bg-white/10'}`}>{count}</span>
            </button>
          ))}
        </div>
        {items.length > 0 ? (
          <div className="grid grid-cols-4 gap-3 stagger-children">
            {items.map(s => <VideoCard key={s.id} short={s} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <Bookmark className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-sm text-white/30 mb-1">No {tab} items yet</p>
            <p className="text-xs text-white/20">Start watching and {tab === 'saved' ? 'saving' : tab === 'liked' ? 'liking' : 'watching'} shorts!</p>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}

// ─── Profile ─────────────────────────────────────────
export function ProfileView() {
  const { followedCreators, likedShorts, savedShorts, projects, watchHistory, setView, addToast } = useApp()
  const { t } = useI18n()
  const { user, openPremiumModal } = useAuthStore()
  const [editingName, setEditingName] = useState(false)
  const [nameValue, setNameValue] = useState(user?.name || 'Han')

  const tierColor = user?.subscription === 'premium' ? '#ffd600' : user?.subscription === 'basic' ? '#00d4ff' : '#ffffff'
  const tierLabel = user?.subscription === 'premium' ? t('profile.premium') : user?.subscription === 'basic' ? t('profile.basic') : t('profile.free')

  const stats = [
    { label: t('profile.liked'), value: likedShorts.size, color: '#ff2d78', icon: Heart },
    { label: t('profile.saved'), value: savedShorts.size, color: '#ffd600', icon: Bookmark },
    { label: t('profile.following'), value: followedCreators.size, color: '#a855f7', icon: User },
    { label: t('profile.projects'), value: projects.length, color: '#00d4ff', icon: Film },
    { label: t('profile.watched'), value: watchHistory.length, color: '#00ffaa', icon: Eye },
  ]

  return (
    <ScrollArea className="h-full">
      <div className="p-6 pb-24 max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="rounded-2xl overflow-hidden mb-6">
          {/* Banner */}
          <div className="h-32 relative" style={{ background: 'linear-gradient(135deg, #ff2d7830, #a855f730, #00d4ff30)' }}>
            <div className="absolute inset-0 backdrop-blur-3xl" />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
          </div>
          <div className="px-6 pb-5 -mt-12 relative">
            <div className="flex items-end gap-5 mb-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl niji-gradient flex items-center justify-center text-3xl font-black text-white ring-4 ring-[#0a0a0f]">
                  {user?.name?.[0] || 'H'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold border-2 border-[#0a0a0f]"
                  style={{ background: `${tierColor}20`, color: tierColor, borderColor: '#0a0a0f' }}>
                  {user?.subscription === 'premium' ? <Crown className="w-3.5 h-3.5" /> : user?.subscription === 'basic' ? <Star className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </div>
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-3">
                  {editingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={nameValue}
                        onChange={e => setNameValue(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xl font-black outline-none focus:border-[#ff2d78]/50"
                        style={{ fontFamily: 'Outfit' }}
                        autoFocus
                        onKeyDown={e => { if (e.key === 'Enter') { setEditingName(false); addToast('Profile updated!', 'success', '✅') } }}
                      />
                      <button onClick={() => { setEditingName(false); addToast('Profile updated!', 'success', '✅') }}
                        className="w-7 h-7 rounded-lg bg-[#00ffaa]/20 text-[#00ffaa] flex items-center justify-center hover:bg-[#00ffaa]/30">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <h1 className="text-2xl font-black cursor-pointer hover:text-white/80 transition-colors" style={{ fontFamily: 'Outfit' }}
                      onClick={() => setEditingName(true)}>{nameValue}</h1>
                  )}
                  <Badge className="text-[9px] px-2 py-0 border-0 font-semibold" style={{ background: `${tierColor}20`, color: tierColor }}>
                    {tierLabel}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{user?.email || 'niuhan@gmail.com'}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{t('profile.memberSince')} {user?.joinedDate ? new Date(user.joinedDate).toLocaleDateString('en', { month: 'short', year: 'numeric' }) : 'Jan 2026'}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditingName(true)}
                  className="h-8 px-3 text-xs border-white/10 text-white/50 hover:bg-white/5 gap-1.5">
                  {t('profile.editProfile')}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setView('settings')}
                  className="h-8 px-3 text-xs border-white/10 text-white/50 hover:bg-white/5 gap-1.5">
                  <Settings className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {stats.map(s => (
            <div key={s.label} className="rounded-xl p-3.5 text-center transition-all hover:scale-[1.02] cursor-default"
              style={{ background: `${s.color}08`, border: `1px solid ${s.color}15` }}>
              <s.icon className="w-4 h-4 mx-auto mb-1.5" style={{ color: s.color }} />
              <p className="text-lg font-black" style={{ fontFamily: 'Outfit', color: s.color }}>{s.value}</p>
              <p className="text-[10px] text-white/40 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Subscription Card */}
        {user?.subscription === 'free' && (
          <div className="rounded-2xl p-5 mb-6 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #ff2d7815, #a855f715)', border: '1px solid #ff2d7825' }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #ff2d78, transparent)' }} />
            <div className="relative flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-4 h-4 text-[#ffd600]" />
                  <h3 className="text-sm font-bold">{t('profile.upgrade')}</h3>
                </div>
                <p className="text-xs text-white/40 max-w-md">Unlock premium manga chapters, ad-free viewing, 4K quality, and early access to new releases.</p>
              </div>
              <Button size="sm" onClick={() => openPremiumModal()}
                className="h-9 px-5 text-xs font-semibold bg-gradient-to-r from-[#ff2d78] to-[#a855f7] hover:opacity-90 border-0 gap-1.5 shrink-0">
                <Crown className="w-3.5 h-3.5" />Upgrade
              </Button>
            </div>
          </div>
        )}

        {/* Recently Watched */}
        {watchHistory.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#a855f7]" />
                <h2 className="text-sm font-bold">{t('profile.recentlyWatched')}</h2>
                <Badge className="bg-white/5 text-white/30 border-0 text-[9px]">{watchHistory.length}</Badge>
              </div>
              <button onClick={() => setView('library')} className="text-xs text-white/40 hover:text-white/60 flex items-center gap-1">View All <ChevronRight className="w-3 h-3" /></button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {watchHistory.slice(0, 8).map(id => { const s = SHORTS.find(sh => sh.id === id); return s ? <VideoCard key={s.id} short={s} size="sm" /> : null })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {watchHistory.length === 0 && (
          <div className="text-center py-16 rounded-2xl" style={{ background: 'linear-gradient(135deg, #ffffff05, #ffffff02)' }}>
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Play className="w-7 h-7 text-white/15" />
            </div>
            <p className="text-sm text-white/40 mb-1">No watch history yet</p>
            <p className="text-xs text-white/25 mb-4">{t('profile.startWatching')}</p>
            <Button size="sm" onClick={() => setView('home')}
              className="h-8 px-4 text-xs font-semibold bg-[#ff2d78] hover:bg-[#ff2d78]/80 border-0 gap-1.5">
              <Play className="w-3 h-3" fill="currentColor" />Start Exploring
            </Button>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}

// ─── Settings ───────────────────────────────────────
function SettingsToggle({ enabled, onToggle, color = '#00ffaa' }: { enabled: boolean; onToggle: () => void; color?: string }) {
  return (
    <button onClick={onToggle}
      className="w-10 h-5.5 rounded-full relative transition-all duration-200 shrink-0"
      style={{ background: enabled ? `${color}30` : 'rgba(255,255,255,0.08)', border: `1px solid ${enabled ? `${color}40` : 'rgba(255,255,255,0.1)'}` }}>
      <div className="absolute top-[2px] w-4 h-4 rounded-full transition-all duration-200"
        style={{ left: enabled ? '21px' : '2px', background: enabled ? color : 'rgba(255,255,255,0.3)' }} />
    </button>
  )
}

function SettingsRow({ icon: Icon, label, desc, children, color = '#ffffff' }: {
  icon: any; label: string; desc?: string; children: React.ReactNode; color?: string
}) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}10` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white/80">{label}</p>
          {desc && <p className="text-[10px] text-white/30 mt-0.5">{desc}</p>}
        </div>
      </div>
      <div className="ml-3 shrink-0">{children}</div>
    </div>
  )
}

export function SettingsView() {
  const { setView, addToast } = useApp()
  const { t, lang, setLang } = useI18n()
  const { user, setSubscription, openPremiumModal, logout } = useAuthStore()

  const [autoplay, setAutoplay] = useState(true)
  const [skipIntro, setSkipIntro] = useState(false)
  const [quality, setQuality] = useState('auto')
  const [notifEpisodes, setNotifEpisodes] = useState(true)
  const [notifRecs, setNotifRecs] = useState(true)
  const [notifCreators, setNotifCreators] = useState(true)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

  const tierColor = user?.subscription === 'premium' ? '#ffd600' : user?.subscription === 'basic' ? '#00d4ff' : '#ffffff'
  const tierLabel = user?.subscription === 'premium' ? t('profile.premium') : user?.subscription === 'basic' ? t('profile.basic') : t('profile.free')

  const handleClearHistory = () => {
    if (!confirmClear) { setConfirmClear(true); return }
    addToast('Watch history cleared', 'success', '🗑️')
    setConfirmClear(false)
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 pb-24 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
            <Settings className="w-5 h-5 text-white/50" />
          </div>
          <div>
            <h1 className="text-2xl font-black" style={{ fontFamily: 'Outfit' }}>{t('settings.title')}</h1>
            <p className="text-xs text-white/30">Customize your niji.app experience</p>
          </div>
        </div>

        {/* Account Card */}
        <div className="rounded-2xl p-4 mb-5 glass hover:bg-white/[0.03] transition-all cursor-pointer" onClick={() => setView('profile')}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl niji-gradient flex items-center justify-center text-lg font-bold text-white">
              {user?.name?.[0] || 'H'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold">{user?.name || 'Han'}</p>
                <Badge className="text-[8px] px-1.5 py-0 border-0 font-semibold" style={{ background: `${tierColor}20`, color: tierColor }}>
                  {tierLabel}
                </Badge>
              </div>
              <p className="text-[10px] text-white/40">{user?.email || 'niuhan@gmail.com'}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-white/20" />
          </div>
        </div>

        {/* Appearance */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1 px-1">
            <Palette className="w-3.5 h-3.5 text-[#a855f7]" />
            <h2 className="text-xs font-bold text-white/40 uppercase tracking-wider">{t('settings.appearance')}</h2>
          </div>
          <div className="rounded-xl glass divide-y divide-white/5 px-4">
            <SettingsRow icon={Monitor} label={t('settings.darkMode')} desc={t('settings.darkModeDesc')} color="#a855f7">
              <SettingsToggle enabled={true} onToggle={() => addToast('Dark mode is always on!', 'info', '🌙')} color="#a855f7" />
            </SettingsRow>
            <SettingsRow icon={Sparkles} label={t('settings.reduceMotion')} desc={t('settings.reduceMotionDesc')} color="#a855f7">
              <SettingsToggle enabled={reduceMotion} onToggle={() => { setReduceMotion(!reduceMotion); addToast(reduceMotion ? 'Animations enabled' : 'Animations reduced', 'success') }} color="#a855f7" />
            </SettingsRow>
            <SettingsRow icon={Languages} label={t('settings.language')} desc={t('settings.languageDesc')} color="#a855f7">
              <div className="flex gap-1">
                {(['en', 'ja'] as const).map(l => (
                  <button key={l} onClick={() => setLang(l)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${lang === l ? 'bg-[#a855f7]/20 text-[#a855f7]' : 'bg-white/5 text-white/40 hover:text-white/60'}`}>
                    {l === 'en' ? 'English' : '日本語'}
                  </button>
                ))}
              </div>
            </SettingsRow>
          </div>
        </div>

        {/* Playback */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1 px-1">
            <PlayCircle className="w-3.5 h-3.5 text-[#00d4ff]" />
            <h2 className="text-xs font-bold text-white/40 uppercase tracking-wider">{t('settings.playback')}</h2>
          </div>
          <div className="rounded-xl glass divide-y divide-white/5 px-4">
            <SettingsRow icon={Play} label={t('settings.autoplay')} desc={t('settings.autoplayDesc')} color="#00d4ff">
              <SettingsToggle enabled={autoplay} onToggle={() => { setAutoplay(!autoplay); addToast(autoplay ? 'Autoplay disabled' : 'Autoplay enabled', 'success') }} color="#00d4ff" />
            </SettingsRow>
            <SettingsRow icon={SkipForward} label={t('settings.skipIntro')} desc={t('settings.skipIntroDesc')} color="#00d4ff">
              <SettingsToggle enabled={skipIntro} onToggle={() => { setSkipIntro(!skipIntro); addToast(skipIntro ? 'Auto-skip disabled' : 'Auto-skip enabled', 'success') }} color="#00d4ff" />
            </SettingsRow>
            <SettingsRow icon={Monitor} label={t('settings.defaultQuality')} color="#00d4ff">
              <select value={quality} onChange={e => { setQuality(e.target.value); addToast(`Quality set to ${e.target.value}`, 'success') }}
                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white/70 outline-none cursor-pointer">
                <option value="auto">Auto</option>
                <option value="1080p">1080p</option>
                <option value="720p">720p</option>
                <option value="480p">480p</option>
              </select>
            </SettingsRow>
          </div>
        </div>

        {/* Notifications */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1 px-1">
            <BellRing className="w-3.5 h-3.5 text-[#ff2d78]" />
            <h2 className="text-xs font-bold text-white/40 uppercase tracking-wider">{t('settings.notifications')}</h2>
          </div>
          <div className="rounded-xl glass divide-y divide-white/5 px-4">
            <SettingsRow icon={Bell} label={t('settings.newEpisodes')} desc={t('settings.newEpisodesDesc')} color="#ff2d78">
              <SettingsToggle enabled={notifEpisodes} onToggle={() => setNotifEpisodes(!notifEpisodes)} color="#ff2d78" />
            </SettingsRow>
            <SettingsRow icon={Star} label={t('settings.recommendations')} desc={t('settings.recommendationsDesc')} color="#ff2d78">
              <SettingsToggle enabled={notifRecs} onToggle={() => setNotifRecs(!notifRecs)} color="#ff2d78" />
            </SettingsRow>
            <SettingsRow icon={User} label={t('settings.creatorUpdates')} desc={t('settings.creatorUpdatesDesc')} color="#ff2d78">
              <SettingsToggle enabled={notifCreators} onToggle={() => setNotifCreators(!notifCreators)} color="#ff2d78" />
            </SettingsRow>
          </div>
        </div>

        {/* Subscription */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1 px-1">
            <CreditCard className="w-3.5 h-3.5 text-[#ffd600]" />
            <h2 className="text-xs font-bold text-white/40 uppercase tracking-wider">{t('settings.manageSubscription')}</h2>
          </div>
          <div className="rounded-xl glass px-4">
            <div className="py-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-white/80">Current Plan</p>
                  <p className="text-xs text-white/30 mt-0.5">{user?.subscription === 'free' ? 'Limited access to content' : user?.subscription === 'basic' ? 'Ad-free viewing + basic premium' : 'Full access to all content'}</p>
                </div>
                <Badge className="text-xs px-3 py-1 border-0 font-bold" style={{ background: `${tierColor}20`, color: tierColor }}>
                  {tierLabel}
                </Badge>
              </div>
              <div className="flex gap-2">
                {user?.subscription !== 'premium' && (
                  <Button size="sm" onClick={() => openPremiumModal()}
                    className="h-8 px-4 text-xs font-semibold bg-gradient-to-r from-[#ff2d78] to-[#a855f7] hover:opacity-90 border-0 gap-1.5">
                    <Crown className="w-3.5 h-3.5" />{t('profile.upgrade')}
                  </Button>
                )}
                {user?.subscription !== 'free' && (
                  <Button size="sm" variant="outline" onClick={() => { setSubscription('free'); addToast('Downgraded to Free plan', 'info') }}
                    className="h-8 px-3 text-xs border-white/10 text-white/40 hover:bg-white/5">
                    Cancel Plan
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1 px-1">
            <Shield className="w-3.5 h-3.5 text-[#00ffaa]" />
            <h2 className="text-xs font-bold text-white/40 uppercase tracking-wider">{t('settings.dataPrivacy')}</h2>
          </div>
          <div className="rounded-xl glass divide-y divide-white/5 px-4">
            <SettingsRow icon={Trash2} label={t('settings.clearHistory')} desc={t('settings.clearHistoryDesc')} color="#00ffaa">
              <button onClick={handleClearHistory}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${confirmClear ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/5 text-white/40 hover:text-white/60'}`}>
                {confirmClear ? 'Confirm Clear' : 'Clear'}
              </button>
            </SettingsRow>
          </div>
        </div>

        {/* About */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1 px-1">
            <Info className="w-3.5 h-3.5 text-white/30" />
            <h2 className="text-xs font-bold text-white/40 uppercase tracking-wider">{t('settings.about')}</h2>
          </div>
          <div className="rounded-xl glass divide-y divide-white/5 px-4">
            <SettingsRow icon={Info} label={t('settings.version')} color="#ffffff">
              <span className="text-xs text-white/30">2.0.0</span>
            </SettingsRow>
            <SettingsRow icon={FileText} label={t('settings.terms')} color="#ffffff">
              <ExternalLink className="w-3.5 h-3.5 text-white/20" />
            </SettingsRow>
            <SettingsRow icon={Lock} label={t('settings.privacy')} color="#ffffff">
              <ExternalLink className="w-3.5 h-3.5 text-white/20" />
            </SettingsRow>
          </div>
        </div>

        {/* Sign Out */}
        <button onClick={() => { addToast('Signed out', 'info', '👋') }}
          className="w-full rounded-xl glass px-4 py-3.5 flex items-center justify-center gap-2 text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-all">
          <LogOut className="w-4 h-4" />
          {t('settings.signOut')}
        </button>
      </div>
    </ScrollArea>
  )
}
