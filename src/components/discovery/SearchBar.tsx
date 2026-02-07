import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, TrendingUp, Clock, Play, BookOpen } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useApp } from '@/lib/context'
import { useI18n } from '@/lib/i18n'
import { SHORTS } from '@/lib/data'
import type { Short } from '@/lib/types'

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

interface SearchBarProps {
  className?: string
}

export function SearchBar({ className }: SearchBarProps) {
  const { handleWatch } = useApp()
  const { t } = useI18n()
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const debouncedQuery = useDebounce(query, 150)

  // Fuzzy match — title, titleJP, creator, genre
  const suggestions = useMemo(() => {
    if (debouncedQuery.length < 1) return []
    const q = debouncedQuery.toLowerCase()
    return SHORTS.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.titleJP.includes(debouncedQuery) ||
        s.creator.toLowerCase().includes(q) ||
        s.genre.toLowerCase().includes(q)
    ).slice(0, 8)
  }, [debouncedQuery])

  // Trending suggestions (shown when empty)
  const trendingSuggestions = useMemo(
    () => SHORTS.filter((s) => s.isHot).slice(0, 4),
    []
  )

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const items = suggestions.length > 0 ? suggestions : (isOpen ? trendingSuggestions : [])
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIdx((i) => Math.min(i + 1, items.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIdx((i) => Math.max(i - 1, -1))
      }
      if (e.key === 'Enter' && selectedIdx >= 0 && items[selectedIdx]) {
        handleWatch(items[selectedIdx])
        setIsOpen(false)
        setQuery('')
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    },
    [suggestions, trendingSuggestions, selectedIdx, handleWatch, isOpen]
  )

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Reset selection when suggestions change
  useEffect(() => { setSelectedIdx(-1) }, [debouncedQuery])

  const showDropdown = isOpen && (suggestions.length > 0 || query.length === 0)

  return (
    <div ref={containerRef} className={`relative ${className || ''}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true) }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={t('search.shorts')}
          className="bg-white/5 border-white/5 pl-9 pr-8 h-9 text-sm placeholder:text-white/25 focus:border-white/15 focus:ring-0"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setIsOpen(false) }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-[#12121f]/95 backdrop-blur-xl border border-white/10 py-2 max-h-[400px] overflow-auto z-50 shadow-2xl"
          >
            {/* Type-ahead results */}
            {suggestions.length > 0 ? (
              <>
                <p className="px-3 py-1 text-[10px] text-white/30 uppercase tracking-wider font-medium">
                  Results
                </p>
                {suggestions.map((s, i) => (
                  <SuggestionItem
                    key={s.id}
                    short={s}
                    isSelected={i === selectedIdx}
                    query={debouncedQuery}
                    onClick={() => {
                      handleWatch(s)
                      setIsOpen(false)
                      setQuery('')
                    }}
                  />
                ))}
              </>
            ) : query.length > 0 ? (
              <div className="px-4 py-6 text-center">
                <Search className="w-6 h-6 text-white/10 mx-auto mb-2" />
                <p className="text-xs text-white/30">
                  No results for "<span className="text-white/50">{query}</span>"
                </p>
              </div>
            ) : (
              /* Trending suggestions when input is empty */
              <>
                <p className="px-3 py-1 text-[10px] text-white/30 uppercase tracking-wider font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />Trending
                </p>
                {trendingSuggestions.map((s, i) => (
                  <SuggestionItem
                    key={s.id}
                    short={s}
                    isSelected={i === selectedIdx}
                    query=""
                    onClick={() => {
                      handleWatch(s)
                      setIsOpen(false)
                    }}
                  />
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Suggestion Item with highlight ─────────────────────
function SuggestionItem({
  short,
  isSelected,
  query,
  onClick,
}: {
  short: Short
  isSelected: boolean
  query: string
  onClick: () => void
}) {
  // Highlight matching text
  const highlight = (text: string) => {
    if (!query) return text
    const idx = text.toLowerCase().indexOf(query.toLowerCase())
    if (idx === -1) return text
    return (
      <>
        {text.slice(0, idx)}
        <span className="text-[#ff2d78] font-semibold">{text.slice(idx, idx + query.length)}</span>
        {text.slice(idx + query.length)}
      </>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all ${
        isSelected ? 'bg-[#ff2d78]/10' : 'hover:bg-white/5'
      }`}
    >
      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-white/5">
        {short.thumbnail ? (
          <img src={short.thumbnail} alt="" className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${short.color1}, ${short.color2})` }}
          >
            {short.avatar}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{highlight(short.title)}</p>
        <p className="text-[10px] text-white/40 flex items-center gap-1.5">
          <span>{highlight(short.creator)}</span>
          <span className="text-white/20">·</span>
          <span>{short.genre}</span>
          <span className="text-white/20">·</span>
          <span>{short.duration}</span>
        </p>
      </div>
      {isSelected && (
        <span className="text-[9px] text-white/20 px-1.5 py-0.5 rounded bg-white/5 font-mono">↵</span>
      )}
    </button>
  )
}
