import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, ChevronUp, ChevronDown,
  BookOpen, Columns, ArrowLeft, Settings2,
  ZoomIn, ZoomOut, Maximize, List, Sun, Moon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLibraryStore } from '@/stores/useLibraryStore'
import type { MangaChapter } from '@/lib/types'

export type ReadingMode = 'vertical' | 'horizontal'
type FitMode = 'width' | 'height' | 'original'

interface MangaReaderProps {
  chapter: MangaChapter
  chapters: MangaChapter[]       // full chapter list for navigation
  seriesTitle: string
  onClose: () => void
  onChapterChange?: (chapter: MangaChapter) => void
}

// ─── Lazy Image with placeholder ────────────────────────
function LazyPage({
  src,
  alt,
  className,
  onLoad,
}: {
  src: string
  alt: string
  className?: string
  onLoad?: () => void
}) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const el = imgRef.current
    if (!el) return
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observerRef.current?.disconnect()
        }
      },
      { rootMargin: '600px' } // preload 600px ahead
    )
    observerRef.current.observe(el)
    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <div ref={imgRef} className={`relative ${className || ''}`}>
      {/* Skeleton placeholder */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-white/5 animate-pulse rounded flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-white/10" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 bg-white/5 rounded flex flex-col items-center justify-center gap-2">
          <BookOpen className="w-8 h-8 text-white/10" />
          <span className="text-xs text-white/30">Failed to load</span>
        </div>
      )}
      {shouldLoad && (
        <img
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} w-full h-auto`}
          onLoad={() => { setLoaded(true); onLoad?.() }}
          onError={() => setError(true)}
          draggable={false}
        />
      )}
    </div>
  )
}

// ─── Progress Bar ───────────────────────────────────────
function ReaderProgressBar({
  currentPage,
  totalPages,
  onPageClick,
}: {
  currentPage: number
  totalPages: number
  onPageClick: (page: number) => void
}) {
  const progressRef = useRef<HTMLDivElement>(null)
  const progress = totalPages > 0 ? ((currentPage + 1) / totalPages) * 100 : 0

  const handleClick = (e: React.MouseEvent) => {
    if (!progressRef.current) return
    const rect = progressRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const page = Math.floor(pct * totalPages)
    onPageClick(Math.min(page, totalPages - 1))
  }

  return (
    <div className="flex items-center gap-3 w-full">
      <span className="text-[10px] text-white/50 font-mono w-8 text-right">
        {currentPage + 1}
      </span>
      <div
        ref={progressRef}
        onClick={handleClick}
        className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer group relative"
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#ff2d78] to-[#a855f7]"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${progress}% - 6px)` }}
        />
      </div>
      <span className="text-[10px] text-white/50 font-mono w-8">
        {totalPages}
      </span>
    </div>
  )
}

// ─── Vertical Scroll Mode ───────────────────────────────
function VerticalReader({
  pages,
  currentPage,
  onPageChange,
  zoom,
}: {
  pages: string[]
  currentPage: number
  onPageChange: (page: number) => void
  zoom: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  const isScrollingProgrammatically = useRef(false)

  // Track which page is in view
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingProgrammatically.current) return
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const pageIdx = Number(entry.target.getAttribute('data-page'))
            if (!isNaN(pageIdx)) onPageChange(pageIdx)
          }
        }
      },
      { root: container, threshold: 0.5 }
    )

    pageRefs.current.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [pages.length, onPageChange])

  // Scroll to page when currentPage changes externally (e.g. progress bar click)
  const scrollToPage = useCallback((pageIdx: number) => {
    const el = pageRefs.current.get(pageIdx)
    if (!el) return
    isScrollingProgrammatically.current = true
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTimeout(() => { isScrollingProgrammatically.current = false }, 500)
  }, [])

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth"
      style={{ scrollBehavior: 'smooth' }}
    >
      <div className="flex flex-col items-center gap-1 py-4" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
        {pages.map((src, idx) => (
          <div
            key={idx}
            ref={(el) => { if (el) pageRefs.current.set(idx, el) }}
            data-page={idx}
            className="w-full max-w-3xl"
          >
            <LazyPage
              src={src}
              alt={`Page ${idx + 1}`}
              className="min-h-[200px]"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Horizontal Page-Flip Mode ──────────────────────────
function HorizontalReader({
  pages,
  currentPage,
  onPageChange,
  zoom,
}: {
  pages: string[]
  currentPage: number
  onPageChange: (page: number) => void
  zoom: number
}) {
  const x = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const goTo = useCallback(
    (page: number) => {
      const clamped = Math.max(0, Math.min(pages.length - 1, page))
      onPageChange(clamped)
    },
    [pages.length, onPageChange]
  )

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    const threshold = 50
    if (info.offset.x < -threshold) {
      goTo(currentPage + 1)
    } else if (info.offset.x > threshold) {
      goTo(currentPage - 1)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'd') goTo(currentPage + 1)
      if (e.key === 'ArrowLeft' || e.key === 'a') goTo(currentPage - 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [currentPage, goTo])

  return (
    <div ref={containerRef} className="flex-1 relative flex items-center justify-center overflow-hidden select-none">
      {/* Previous page button */}
      {currentPage > 0 && (
        <button
          onClick={() => goTo(currentPage - 1)}
          className="absolute left-4 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:bg-black/60 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Page with swipe gesture */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          style={{ x, scale: zoom }}
          className="max-w-3xl max-h-full cursor-grab active:cursor-grabbing"
        >
          <LazyPage
            src={pages[currentPage]}
            alt={`Page ${currentPage + 1}`}
            className="min-h-[300px]"
          />
        </motion.div>
      </AnimatePresence>

      {/* Next page button */}
      {currentPage < pages.length - 1 && (
        <button
          onClick={() => goTo(currentPage + 1)}
          className="absolute right-4 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:bg-black/60 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Page indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
        {pages.length <= 20 &&
          pages.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === currentPage ? 'bg-[#ff2d78] w-4' : 'bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
      </div>
    </div>
  )
}

// ─── Chapter Sidebar ────────────────────────────────────
function ChapterList({
  chapters,
  currentChapter,
  onSelect,
  onClose,
}: {
  chapters: MangaChapter[]
  currentChapter: MangaChapter
  onSelect: (ch: MangaChapter) => void
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="absolute top-0 left-0 bottom-0 w-72 bg-[#0d0d1a]/95 backdrop-blur-xl border-r border-white/5 z-20 flex flex-col"
    >
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <h3 className="text-sm font-bold">Chapters</h3>
        <button onClick={onClose} className="text-white/40 hover:text-white/70">
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chapters.map((ch) => (
          <button
            key={ch.id}
            onClick={() => onSelect(ch)}
            className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all ${
              ch.id === currentChapter.id
                ? 'bg-[#ff2d78]/10 border-l-2 border-[#ff2d78]'
                : 'hover:bg-white/5 border-l-2 border-transparent'
            }`}
          >
            <span
              className={`text-xs font-mono ${
                ch.id === currentChapter.id ? 'text-[#ff2d78]' : 'text-white/30'
              }`}
            >
              {String(ch.number).padStart(3, '0')}
            </span>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium truncate ${
                ch.id === currentChapter.id ? 'text-white' : 'text-white/60'
              }`}>
                {ch.title}
              </p>
              <p className="text-[10px] text-white/30">{ch.pages.length} pages</p>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════
//  MANGA READER — Main Component
// ═══════════════════════════════════════════════════════════
export function MangaReader({
  chapter,
  chapters,
  seriesTitle,
  onClose,
  onChapterChange,
}: MangaReaderProps) {
  const [mode, setMode] = useState<ReadingMode>('vertical')
  const [currentPage, setCurrentPage] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [showUI, setShowUI] = useState(true)
  const [showChapters, setShowChapters] = useState(false)
  const [darkBg, setDarkBg] = useState(true)
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const { updateMangaProgress } = useLibraryStore()

  // Auto-save reading progress
  useEffect(() => {
    updateMangaProgress(chapter.seriesId, chapter.number, currentPage)
  }, [currentPage, chapter.seriesId, chapter.number, updateMangaProgress])

  // Auto-hide UI
  const resetHideTimer = useCallback(() => {
    setShowUI(true)
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    hideTimeoutRef.current = setTimeout(() => setShowUI(false), 3000)
  }, [])

  useEffect(() => {
    resetHideTimer()
    return () => { if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current) }
  }, [resetHideTimer])

  // Chapter navigation
  const currentChapterIdx = chapters.findIndex((c) => c.id === chapter.id)
  const hasNextChapter = currentChapterIdx < chapters.length - 1
  const hasPrevChapter = currentChapterIdx > 0

  const goToChapter = useCallback(
    (ch: MangaChapter) => {
      setCurrentPage(0)
      onChapterChange?.(ch)
    },
    [onChapterChange]
  )

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    resetHideTimer()
  }, [resetHideTimer])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'f') setMode((m) => (m === 'vertical' ? 'horizontal' : 'vertical'))
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(2, z + 0.1))
      if (e.key === '-') setZoom((z) => Math.max(0.5, z - 0.1))
      if (e.key === '0') setZoom(1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[80] flex flex-col ${darkBg ? 'bg-[#0a0a0f]' : 'bg-[#f0f0f0]'}`}
      onMouseMove={resetHideTimer}
      onClick={resetHideTimer}
    >
      {/* ─── Top Bar ─── */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute top-0 left-0 right-0 z-30 h-14 flex items-center justify-between px-4 bg-gradient-to-b from-black/80 to-transparent"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <p className="text-xs text-white/40">{seriesTitle}</p>
                <p className="text-sm font-semibold">
                  Ch. {chapter.number} — {chapter.title}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Chapter list toggle */}
              <button
                onClick={() => setShowChapters(!showChapters)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  showChapters ? 'bg-[#ff2d78]/20 text-[#ff2d78]' : 'bg-white/10 text-white/50 hover:text-white/70'
                }`}
              >
                <List className="w-4 h-4" />
              </button>

              {/* Reading mode toggle */}
              <button
                onClick={() => setMode(mode === 'vertical' ? 'horizontal' : 'vertical')}
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/50 hover:text-white/70 transition-all"
                title={mode === 'vertical' ? 'Switch to page flip' : 'Switch to scroll'}
              >
                {mode === 'vertical' ? <Columns className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
              </button>

              {/* Zoom controls */}
              <button
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/50 hover:text-white/70 transition-all"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[10px] text-white/40 font-mono w-8 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/50 hover:text-white/70 transition-all"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              {/* Dark/light bg */}
              <button
                onClick={() => setDarkBg(!darkBg)}
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/50 hover:text-white/70 transition-all"
              >
                {darkBg ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Chapter List Sidebar ─── */}
      <AnimatePresence>
        {showChapters && (
          <ChapterList
            chapters={chapters}
            currentChapter={chapter}
            onSelect={(ch) => { goToChapter(ch); setShowChapters(false) }}
            onClose={() => setShowChapters(false)}
          />
        )}
      </AnimatePresence>

      {/* ─── Reader Content ─── */}
      {mode === 'vertical' ? (
        <VerticalReader
          pages={chapter.pages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          zoom={zoom}
        />
      ) : (
        <HorizontalReader
          pages={chapter.pages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          zoom={zoom}
        />
      )}

      {/* ─── Bottom Bar ─── */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/80 to-transparent p-4 pt-8"
          >
            {/* Progress bar */}
            <ReaderProgressBar
              currentPage={currentPage}
              totalPages={chapter.pages.length}
              onPageClick={(page) => {
                setCurrentPage(page)
                // In vertical mode, scroll to the page
                if (mode === 'vertical') {
                  const el = document.querySelector(`[data-page="${page}"]`)
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
            />

            {/* Chapter navigation */}
            <div className="flex items-center justify-between mt-3">
              <Button
                onClick={() => hasPrevChapter && goToChapter(chapters[currentChapterIdx - 1])}
                disabled={!hasPrevChapter}
                variant="outline"
                size="sm"
                className="h-8 px-3 text-[10px] border-white/10 text-white/50 disabled:opacity-20 gap-1"
              >
                <ChevronLeft className="w-3 h-3" />
                Prev Chapter
              </Button>

              <span className="text-[10px] text-white/40">
                Page {currentPage + 1} of {chapter.pages.length}
              </span>

              <Button
                onClick={() => hasNextChapter && goToChapter(chapters[currentChapterIdx + 1])}
                disabled={!hasNextChapter}
                variant="outline"
                size="sm"
                className="h-8 px-3 text-[10px] border-white/10 text-white/50 disabled:opacity-20 gap-1"
              >
                Next Chapter
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
