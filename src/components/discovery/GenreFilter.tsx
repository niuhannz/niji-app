import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown, ArrowUpDown, TrendingUp, Star, Clock, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { GENRES, SHORTS } from '@/lib/data'
import type { Short, SortOption } from '@/lib/types'

interface GenreFilterProps {
  onFilterChange: (filtered: Short[]) => void
  className?: string
}

const SORT_OPTIONS: { value: SortOption; label: string; icon: typeof TrendingUp }[] = [
  { value: 'trending', label: 'Trending', icon: TrendingUp },
  { value: 'top-rated', label: 'Top Rated', icon: Star },
  { value: 'latest', label: 'Latest', icon: Clock },
  { value: 'most-viewed', label: 'Most Viewed', icon: Eye },
]

export function GenreFilter({ onFilterChange, className }: GenreFilterProps) {
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<SortOption>('trending')
  const [showSort, setShowSort] = useState(false)

  const toggleGenre = useCallback(
    (genre: string) => {
      setSelectedGenres((prev) => {
        const next = new Set(prev)
        if (genre === 'All') {
          next.clear()
        } else if (next.has(genre)) {
          next.delete(genre)
        } else {
          next.add(genre)
        }

        // Apply filter + sort
        let filtered = SHORTS
        if (next.size > 0) {
          filtered = filtered.filter((s) => next.has(s.genre))
        }
        filtered = sortShorts(filtered, sortBy)
        onFilterChange(filtered)

        return next
      })
    },
    [sortBy, onFilterChange]
  )

  const changeSort = useCallback(
    (option: SortOption) => {
      setSortBy(option)
      setShowSort(false)

      let filtered = SHORTS
      if (selectedGenres.size > 0) {
        filtered = filtered.filter((s) => selectedGenres.has(s.genre))
      }
      filtered = sortShorts(filtered, option)
      onFilterChange(filtered)
    },
    [selectedGenres, onFilterChange]
  )

  const clearAll = useCallback(() => {
    setSelectedGenres(new Set())
    setSortBy('trending')
    onFilterChange(sortShorts(SHORTS, 'trending'))
  }, [onFilterChange])

  const activeSort = SORT_OPTIONS.find((s) => s.value === sortBy)!

  return (
    <div className={`${className || ''}`}>
      <div className="flex items-center gap-2 flex-wrap">
        {/* Genre chips — multi-select */}
        {GENRES.map((g) => {
          const isAll = g === 'All'
          const isActive = isAll ? selectedGenres.size === 0 : selectedGenres.has(g)
          const count = isAll ? SHORTS.length : SHORTS.filter((s) => s.genre === g).length

          return (
            <motion.button
              key={g}
              onClick={() => toggleGenre(g)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border
                ${isActive
                  ? 'bg-[#ff2d78]/15 text-[#ff2d78] border-[#ff2d78]/30'
                  : 'bg-white/5 text-white/40 border-transparent hover:text-white/60 hover:bg-white/8'
                }`}
            >
              {g}
              {isActive && !isAll && (
                <span className="ml-1 text-[10px] opacity-60">({count})</span>
              )}
            </motion.button>
          )
        })}

        {/* Active filter badges */}
        {selectedGenres.size > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={clearAll}
            className="px-2 py-1 rounded-full text-[10px] text-white/40 hover:text-white/60 bg-white/5 flex items-center gap-1 transition-all"
          >
            <X className="w-3 h-3" />
            Clear ({selectedGenres.size})
          </motion.button>
        )}

        {/* Sort dropdown */}
        <div className="relative ml-auto">
          <button
            onClick={() => setShowSort(!showSort)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 text-white/50 border border-transparent hover:text-white/70 hover:bg-white/8 transition-all"
          >
            <ArrowUpDown className="w-3 h-3" />
            {activeSort.label}
            <ChevronDown className={`w-3 h-3 transition-transform ${showSort ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showSort && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute top-full right-0 mt-1 w-44 rounded-xl bg-[#12121f]/95 backdrop-blur-xl border border-white/10 py-1 z-50 shadow-2xl"
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => changeSort(opt.value)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-all ${
                      sortBy === opt.value
                        ? 'bg-[#ff2d78]/10 text-[#ff2d78]'
                        : 'text-white/50 hover:bg-white/5 hover:text-white/70'
                    }`}
                  >
                    <opt.icon className="w-3.5 h-3.5" />
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// ─── Sort helper ────────────────────────────────────────
function sortShorts(shorts: Short[], sort: SortOption): Short[] {
  const copy = [...shorts]
  switch (sort) {
    case 'trending':
      return copy.sort((a, b) => (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0))
    case 'top-rated':
      return copy.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    case 'latest':
      return copy.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    case 'most-viewed':
      return copy.sort((a, b) => parseViews(b.views) - parseViews(a.views))
    default:
      return copy
  }
}

function parseViews(str: string): number {
  const num = parseFloat(str)
  if (str.includes('M')) return num * 1_000_000
  if (str.includes('K')) return num * 1_000
  return num
}
