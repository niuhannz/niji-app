import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Play, Bookmark, Heart, Eye, ChevronRight, Zap, Clock, TrendingUp,
  Star, Crown, Flame, Trophy, Award, Globe, Sparkles, Share2,
  MessageCircle, Send, ChevronLeft, SkipBack, SkipForward, Pause,
  Volume2, VolumeX, Maximize, Plus, User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useApp } from '@/lib/context'
import { useI18n } from '@/lib/i18n'
import { SHORTS, GENRES, CREATORS } from '@/lib/data'
import { VideoCard } from './shared'
import type { Short } from '@/lib/types'

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
  const { followedCreators, likedShorts, savedShorts, projects, watchHistory } = useApp()
  const { t } = useI18n()
  return (
    <ScrollArea className="h-full">
      <div className="p-6 pb-24">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-2xl niji-gradient flex items-center justify-center text-2xl font-black text-white">H</div>
          <div>
            <h1 className="text-2xl font-black" style={{ fontFamily: 'Outfit' }}>Han</h1>
            <p className="text-sm text-white/40 mb-2">Creator & Viewer · Joined 2026</p>
            <div className="flex gap-4 text-xs text-white/50">
              <span><strong className="text-white">{followedCreators.size}</strong> following</span>
              <span><strong className="text-white">{likedShorts.size}</strong> liked</span>
              <span><strong className="text-white">{savedShorts.size}</strong> saved</span>
              <span><strong className="text-white">{projects.length}</strong> projects</span>
            </div>
          </div>
        </div>
        {watchHistory.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-white/60 mb-3">{t('profile.recentlyWatched')}</h2>
            <div className="grid grid-cols-4 gap-3 stagger-children">
              {watchHistory.slice(0, 4).map(id => { const s = SHORTS.find(sh => sh.id === id); return s ? <VideoCard key={s.id} short={s} /> : null })}
            </div>
          </div>
        )}
        {watchHistory.length === 0 && (
          <div className="text-center py-16">
            <User className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-sm text-white/30">{t('profile.startWatching')}</p>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
