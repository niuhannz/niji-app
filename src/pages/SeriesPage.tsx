import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Play, Plus, Heart, Star, Clock, ChevronRight,
  BookOpen, Eye, Crown, ArrowLeft, Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SubscriptionGuard } from '@/components/premium/SubscriptionGuard'
import { useLibraryStore } from '@/stores/useLibraryStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { SHORTS } from '@/lib/data'
import { MOCK_EPISODES } from '@/lib/mock-data'
import type { Short, Episode } from '@/lib/types'

export function SeriesPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isInMyList, addToMyList, removeFromMyList, likedShorts, toggleLike, getProgress } = useLibraryStore()
  const { isPremiumUser, openPremiumModal } = useAuthStore()

  const series = SHORTS.find((s) => s.id === id)
  const episodes = MOCK_EPISODES.filter((e) => e.seriesId === id)
  const progress = id ? getProgress(id) : null
  const inMyList = id ? isInMyList(id) : false
  const isLiked = id ? likedShorts.has(id) : false

  if (!series) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-white/40">Series not found</p>
      </div>
    )
  }

  const handlePlayEpisode = (ep: Episode) => {
    if (ep.isPremium && !isPremiumUser()) {
      openPremiumModal('This episode requires a Premium subscription.')
      return
    }
    navigate(`/watch/${series.id}?ep=${ep.number}`)
  }

  return (
    <ScrollArea className="h-full">
      <div className="pb-24">
        {/* Hero banner */}
        <div className="relative h-[300px] overflow-hidden">
          {series.thumbnail ? (
            <img src={series.thumbnail} alt={series.title} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${series.color1}30, ${series.color2}30)` }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />

          {/* Back button */}
          <button onClick={() => navigate(-1)} className="absolute top-4 left-4 z-10 w-9 h-9 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Series info */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-[#ff2d78]/20 text-[#ff2d78] border-[#ff2d78]/30 text-[10px]">{series.genre}</Badge>
              <div className="flex items-center gap-1 text-[10px] text-[#ffd600]">
                <Star className="w-3 h-3" fill="currentColor" />
                4.8
              </div>
              <span className="text-[10px] text-white/30">{episodes.length} Episodes</span>
            </div>
            <h1 className="text-3xl font-black mb-1" style={{ fontFamily: 'Outfit' }}>{series.title}</h1>
            <p className="text-xs text-white/40 mb-4">{series.titleJP} · by {series.creator}</p>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  const ep = progress?.lastEpisode
                    ? episodes.find((e) => e.number === progress.lastEpisode)
                    : episodes[0]
                  if (ep) handlePlayEpisode(ep)
                }}
                className="h-10 px-5 text-sm font-semibold bg-[#ff2d78] hover:bg-[#ff2d78]/80 border-0 gap-2"
              >
                <Play className="w-4 h-4" fill="currentColor" />
                {progress ? 'Continue' : 'Watch Now'}
              </Button>
              <Button
                onClick={() => id && (inMyList ? removeFromMyList(id) : addToMyList(id, 'video'))}
                variant="outline"
                className={`h-10 px-4 text-sm border-white/10 gap-2 ${inMyList ? 'bg-white/10 text-white' : 'text-white/60'}`}
              >
                {inMyList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {inMyList ? 'In My List' : 'My List'}
              </Button>
              <Button
                onClick={() => id && toggleLike(id)}
                variant="outline"
                className={`h-10 w-10 p-0 border-white/10 ${isLiked ? 'bg-[#ff2d78]/20 text-[#ff2d78] border-[#ff2d78]/30' : 'text-white/60'}`}
              >
                <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
              </Button>
            </div>
          </div>
        </div>

        {/* Episode list */}
        <div className="p-6">
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'Outfit' }}>Episodes</h2>
          <div className="space-y-2">
            {episodes.map((ep, i) => {
              const isActive = progress?.lastEpisode === ep.number
              return (
                <motion.div
                  key={ep.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {ep.isPremium && !isPremiumUser() ? (
                    <div className="relative rounded-xl overflow-hidden">
                      <SubscriptionGuard
                        requiredTier="basic"
                        blurContent={true}
                        reason={`Episode ${ep.number} requires Premium`}
                      >
                        <EpisodeRow ep={ep} isActive={isActive} onClick={() => {}} />
                      </SubscriptionGuard>
                    </div>
                  ) : (
                    <EpisodeRow ep={ep} isActive={isActive} onClick={() => handlePlayEpisode(ep)} />
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

function EpisodeRow({ ep, isActive, onClick }: { ep: Episode; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all text-left group ${
        isActive ? 'bg-[#ff2d78]/10 border border-[#ff2d78]/20' : 'hover:bg-white/5 border border-transparent'
      }`}
    >
      <div className="w-28 h-16 rounded-lg overflow-hidden shrink-0 bg-white/5 relative">
        {ep.thumbnail && <img src={ep.thumbnail} alt="" className="w-full h-full object-cover" />}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
          <Play className="w-5 h-5 text-white" fill="currentColor" />
        </div>
        {ep.isPremium && (
          <div className="absolute top-1 right-1">
            <Crown className="w-3.5 h-3.5 text-[#ffd600]" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${isActive ? 'text-[#ff2d78]' : ''}`}>
          EP {ep.number} · {ep.title}
        </p>
        <p className="text-[10px] text-white/40 mt-0.5">{ep.duration}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" />
    </button>
  )
}
