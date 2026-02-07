import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Star, Clock, ArrowLeft, Plus, Heart,
  Check, Crown, ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MangaReader } from '@/components/media/MangaReader'
import { SubscriptionGuard } from '@/components/premium/SubscriptionGuard'
import { useLibraryStore } from '@/stores/useLibraryStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { MANGA_SERIES, MANGA_CHAPTERS } from '@/lib/mock-data'
import type { MangaChapter } from '@/lib/types'

export function MangaPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isInMyList, addToMyList, removeFromMyList, getProgress } = useLibraryStore()
  const { isPremiumUser, openPremiumModal } = useAuthStore()

  const [activeChapter, setActiveChapter] = useState<MangaChapter | null>(null)

  const series = MANGA_SERIES.find((s) => s.id === id)
  const chapters = MANGA_CHAPTERS.filter((ch) => ch.seriesId === id).sort((a, b) => a.number - b.number)
  const progress = id ? getProgress(id) : null
  const inMyList = id ? isInMyList(id) : false

  const openReader = useCallback((ch: MangaChapter) => {
    if (ch.isPremium && !isPremiumUser()) {
      openPremiumModal(`Chapter ${ch.number} requires a Premium subscription.`)
      return
    }
    setActiveChapter(ch)
  }, [isPremiumUser, openPremiumModal])

  if (!series) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-white/40">Manga not found</p>
      </div>
    )
  }

  return (
    <>
      <ScrollArea className="h-full">
        <div className="pb-24">
          {/* Hero */}
          <div className="relative h-[280px] overflow-hidden">
            {series.coverImage ? (
              <img src={series.coverImage} alt={series.title} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${series.color1}30, ${series.color2}30)` }} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />

            <button onClick={() => navigate(-1)} className="absolute top-4 left-4 z-10 w-9 h-9 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white transition-all">
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-2">
                {series.genres.map((g) => (
                  <Badge key={g} className="bg-white/10 text-white/60 border-0 text-[10px]">{g}</Badge>
                ))}
                <div className="flex items-center gap-1 text-[10px] text-[#ffd600]">
                  <Star className="w-3 h-3" fill="currentColor" />
                  {series.rating}
                </div>
                <Badge className={`text-[10px] border-0 ${
                  series.status === 'ongoing' ? 'bg-[#00ffaa]/15 text-[#00ffaa]' :
                  series.status === 'completed' ? 'bg-[#00d4ff]/15 text-[#00d4ff]' :
                  'bg-[#ffd600]/15 text-[#ffd600]'
                }`}>
                  {series.status}
                </Badge>
                {series.isPremium && (
                  <Badge className="bg-[#ffd600]/15 text-[#ffd600] border-0 text-[10px] gap-1">
                    <Crown className="w-3 h-3" />Premium
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-black mb-1" style={{ fontFamily: 'Outfit' }}>{series.title}</h1>
              <p className="text-xs text-white/40 mb-1">{series.titleJP} · by {series.creator}</p>
              <p className="text-xs text-white/30 mb-4 max-w-lg line-clamp-2">{series.description}</p>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    const ch = progress?.lastChapter
                      ? chapters.find((c) => c.number === progress.lastChapter)
                      : chapters[0]
                    if (ch) openReader(ch)
                  }}
                  className="h-10 px-5 text-sm font-semibold bg-[#ff2d78] hover:bg-[#ff2d78]/80 border-0 gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  {progress ? `Continue Ch. ${progress.lastChapter}` : 'Start Reading'}
                </Button>
                <Button
                  onClick={() => id && (inMyList ? removeFromMyList(id) : addToMyList(id, 'manga'))}
                  variant="outline"
                  className={`h-10 px-4 text-sm border-white/10 gap-2 ${inMyList ? 'bg-white/10 text-white' : 'text-white/60'}`}
                >
                  {inMyList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {inMyList ? 'In My List' : 'My List'}
                </Button>
              </div>
            </div>
          </div>

          {/* Chapter List */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ fontFamily: 'Outfit' }}>
                Chapters <span className="text-white/30 text-sm font-normal">({chapters.length})</span>
              </h2>
            </div>

            <div className="space-y-2">
              {chapters.map((ch, i) => {
                const isRead = progress?.lastChapter ? ch.number <= progress.lastChapter : false
                const isCurrent = progress?.lastChapter === ch.number

                return (
                  <motion.div
                    key={ch.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    {ch.isPremium && !isPremiumUser() ? (
                      <div className="relative rounded-xl overflow-hidden">
                        <SubscriptionGuard requiredTier="basic" blurContent={true} reason={`Chapter ${ch.number} requires Premium`}>
                          <ChapterRow ch={ch} isRead={isRead} isCurrent={isCurrent} onClick={() => {}} />
                        </SubscriptionGuard>
                      </div>
                    ) : (
                      <ChapterRow ch={ch} isRead={isRead} isCurrent={isCurrent} onClick={() => openReader(ch)} />
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Full-screen Manga Reader */}
      <AnimatePresence>
        {activeChapter && (
          <MangaReader
            chapter={activeChapter}
            chapters={chapters}
            seriesTitle={series.title}
            onClose={() => setActiveChapter(null)}
            onChapterChange={(ch) => setActiveChapter(ch)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function ChapterRow({ ch, isRead, isCurrent, onClick }: {
  ch: MangaChapter; isRead: boolean; isCurrent: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all text-left group ${
        isCurrent ? 'bg-[#ff2d78]/10 border border-[#ff2d78]/20' :
        isRead ? 'opacity-60 hover:opacity-80 border border-transparent' :
        'hover:bg-white/5 border border-transparent'
      }`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
        isCurrent ? 'bg-[#ff2d78]/20 text-[#ff2d78]' :
        isRead ? 'bg-white/5 text-white/30' :
        'bg-white/5 text-white/50'
      }`}>
        {String(ch.number).padStart(2, '0')}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${isCurrent ? 'text-[#ff2d78]' : ''}`}>{ch.title}</p>
        <p className="text-[10px] text-white/30 mt-0.5 flex items-center gap-2">
          <span>{ch.pages.length} pages</span>
          <span>·</span>
          <span>{new Date(ch.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          {ch.isPremium && <Crown className="w-3 h-3 text-[#ffd600]" />}
        </p>
      </div>
      {isRead && !isCurrent && <Check className="w-4 h-4 text-[#00ffaa]/50" />}
      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" />
    </button>
  )
}
