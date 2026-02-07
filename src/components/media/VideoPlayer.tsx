import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Maximize, Minimize, ChevronLeft, Settings2, Subtitles,
  FastForward, PictureInPicture2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLibraryStore } from '@/stores/useLibraryStore'
import type { Episode } from '@/lib/types'

interface VideoPlayerProps {
  episode: Episode
  episodes: Episode[]             // full episode list
  seriesTitle: string
  onBack: () => void
  onEpisodeChange?: (ep: Episode) => void
}

export function VideoPlayer({
  episode,
  episodes,
  seriesTitle,
  onBack,
  onEpisodeChange,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const volumeRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [volume, setVolume] = useState(80)
  const [muted, setMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showUI, setShowUI] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSkipIntro, setShowSkipIntro] = useState(false)
  const [showNextEpisode, setShowNextEpisode] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)

  const { updateVideoProgress } = useLibraryStore()

  // Episode navigation
  const currentIdx = episodes.findIndex((e) => e.id === episode.id)
  const nextEpisode = currentIdx < episodes.length - 1 ? episodes[currentIdx + 1] : null
  const prevEpisode = currentIdx > 0 ? episodes[currentIdx - 1] : null

  // Auto-hide UI
  const resetHideTimer = useCallback(() => {
    setShowUI(true)
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    hideTimeoutRef.current = setTimeout(() => {
      if (playing) setShowUI(false)
    }, 3000)
  }, [playing])

  useEffect(() => { resetHideTimer() }, [resetHideTimer])

  // Sync playback
  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    if (playing) vid.play().catch(() => setPlaying(false))
    else vid.pause()
  }, [playing])

  // Volume sync
  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    vid.volume = muted ? 0 : volume / 100
    vid.muted = muted
  }, [volume, muted])

  // Playback rate
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackRate
  }, [playbackRate])

  // Auto-play
  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    vid.volume = volume / 100
    vid.play().then(() => setPlaying(true)).catch(() => {})
  }, [episode.id])

  // Save progress periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentTime > 0) {
        updateVideoProgress(episode.seriesId, episode.number, currentTime)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [currentTime, episode.seriesId, episode.number, updateVideoProgress])

  // Time update handler
  const handleTimeUpdate = useCallback(() => {
    const vid = videoRef.current
    if (!vid || !vid.duration) return
    setCurrentTime(vid.currentTime)
    setDuration(vid.duration)
    setProgress((vid.currentTime / vid.duration) * 100)

    // Buffer progress
    if (vid.buffered.length > 0) {
      setBuffered((vid.buffered.end(vid.buffered.length - 1) / vid.duration) * 100)
    }

    // Skip Intro logic
    if (episode.hasIntro && episode.introEnd) {
      setShowSkipIntro(vid.currentTime > 2 && vid.currentTime < episode.introEnd)
    }

    // "Next Episode" shows in last 15 seconds
    if (nextEpisode && vid.duration - vid.currentTime < 15) {
      setShowNextEpisode(true)
    } else {
      setShowNextEpisode(false)
    }
  }, [episode.hasIntro, episode.introEnd, nextEpisode])

  // Progress bar click
  const handleProgressClick = (e: React.MouseEvent) => {
    if (!progressRef.current || !videoRef.current) return
    const rect = progressRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    setProgress(pct)
    videoRef.current.currentTime = (pct / 100) * videoRef.current.duration
  }

  // Volume bar click
  const handleVolumeClick = (e: React.MouseEvent) => {
    if (!volumeRef.current) return
    const rect = volumeRef.current.getBoundingClientRect()
    const v = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    setVolume(v)
    if (v > 0) setMuted(false)
  }

  const skipBy = (sec: number) => {
    const vid = videoRef.current
    if (!vid) return
    vid.currentTime = Math.max(0, Math.min(vid.duration, vid.currentTime + sec))
  }

  const skipIntro = () => {
    const vid = videoRef.current
    if (!vid || !episode.introEnd) return
    vid.currentTime = episode.introEnd
    setShowSkipIntro(false)
  }

  const goToNextEpisode = () => {
    if (nextEpisode) onEpisodeChange?.(nextEpisode)
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'k') { e.preventDefault(); setPlaying((p) => !p) }
      if (e.key === 'ArrowRight') skipBy(10)
      if (e.key === 'ArrowLeft') skipBy(-10)
      if (e.key === 'ArrowUp') { e.preventDefault(); setVolume((v) => Math.min(100, v + 5)) }
      if (e.key === 'ArrowDown') { e.preventDefault(); setVolume((v) => Math.max(0, v - 5)) }
      if (e.key === 'f') toggleFullscreen()
      if (e.key === 'm') setMuted((m) => !m)
      if (e.key === 'n' && nextEpisode) goToNextEpisode()
      if (e.key === 'Escape') onBack()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [nextEpisode, onBack])

  const formatTime = (sec: number) =>
    `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black flex flex-col"
      onMouseMove={resetHideTimer}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={episode.videoUrl}
        poster={episode.thumbnail}
        className="absolute inset-0 w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => { setPlaying(false); if (nextEpisode) setShowNextEpisode(true) }}
        onLoadedMetadata={() => { if (videoRef.current) setDuration(videoRef.current.duration) }}
        onClick={() => setPlaying(!playing)}
        playsInline
      />

      {/* ─── Skip Intro Overlay ─── */}
      <AnimatePresence>
        {showSkipIntro && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="absolute bottom-28 right-6 z-30"
          >
            <Button
              onClick={skipIntro}
              className="h-10 px-5 text-sm font-semibold bg-white/15 backdrop-blur-md border border-white/20 text-white hover:bg-white/25 gap-2 shadow-2xl"
            >
              <FastForward className="w-4 h-4" />
              Skip Intro
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Next Episode Overlay ─── */}
      <AnimatePresence>
        {showNextEpisode && nextEpisode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-28 right-6 z-30"
          >
            <div className="bg-black/70 backdrop-blur-xl rounded-xl border border-white/10 p-4 w-72 shadow-2xl">
              <p className="text-[10px] text-white/40 mb-1 uppercase tracking-wide">Up Next</p>
              <div className="flex gap-3 mb-3">
                {nextEpisode.thumbnail && (
                  <div className="w-20 h-12 rounded-lg overflow-hidden shrink-0 bg-white/5">
                    <img src={nextEpisode.thumbnail} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{nextEpisode.title}</p>
                  <p className="text-[10px] text-white/40">
                    EP {nextEpisode.number} · {nextEpisode.duration}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={goToNextEpisode}
                  className="flex-1 h-8 text-xs font-semibold bg-white text-black hover:bg-white/90 gap-1.5"
                >
                  <Play className="w-3 h-3" fill="currentColor" />
                  Play Next
                </Button>
                <Button
                  onClick={() => setShowNextEpisode(false)}
                  variant="outline"
                  className="h-8 px-3 text-xs border-white/10 text-white/50"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Center Play Button ─── */}
      <AnimatePresence>
        {!playing && showUI && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setPlaying(true)}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/90 hover:scale-110 transition-all border border-white/20">
              <Play className="w-7 h-7 ml-1" fill="currentColor" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ─── Controls Overlay ─── */}
      <AnimatePresence>
        {showUI && (
          <>
            {/* Top gradient & info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 left-0 right-0 z-20 h-20 bg-gradient-to-b from-black/70 to-transparent p-4 flex items-start justify-between"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={onBack}
                  className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div>
                  <p className="text-[10px] text-white/40">{seriesTitle}</p>
                  <p className="text-sm font-semibold">
                    EP {episode.number} · {episode.title}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Bottom controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10"
            >
              {/* Progress bar */}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] text-white/40 w-10 text-right font-mono">
                  {formatTime(currentTime)}
                </span>
                <div
                  ref={progressRef}
                  onClick={handleProgressClick}
                  className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer group relative"
                >
                  {/* Buffered */}
                  <div
                    className="absolute h-full bg-white/10 rounded-full"
                    style={{ width: `${buffered}%` }}
                  />
                  {/* Progress */}
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-[#ff2d78] to-[#a855f7] transition-[width] duration-100"
                    style={{ width: `${progress}%` }}
                  />
                  {/* Scrub handle */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `calc(${progress}% - 6px)` }}
                  />
                </div>
                <span className="text-[10px] text-white/40 w-10 font-mono">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Bottom row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Prev episode */}
                  <button
                    onClick={() => prevEpisode && onEpisodeChange?.(prevEpisode)}
                    disabled={!prevEpisode}
                    className="text-white/40 hover:text-white disabled:opacity-20 transition-all"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  {/* Skip back */}
                  <button onClick={() => skipBy(-10)} className="text-white/40 hover:text-white transition-all">
                    <SkipBack className="w-4 h-4" />
                  </button>

                  {/* Play/Pause */}
                  <button
                    onClick={() => setPlaying(!playing)}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-all"
                  >
                    {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" fill="currentColor" />}
                  </button>

                  {/* Skip forward */}
                  <button onClick={() => skipBy(10)} className="text-white/40 hover:text-white transition-all">
                    <SkipForward className="w-4 h-4" />
                  </button>

                  {/* Next episode */}
                  <button
                    onClick={goToNextEpisode}
                    disabled={!nextEpisode}
                    className="text-white/40 hover:text-white disabled:opacity-20 transition-all"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>

                  {/* Volume */}
                  <div className="flex items-center gap-1.5 ml-2">
                    <button onClick={() => setMuted(!muted)} className="text-white/40 hover:text-white transition-all">
                      {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <div
                      ref={volumeRef}
                      onClick={handleVolumeClick}
                      className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer group relative"
                    >
                      <div className="h-full bg-white/40 rounded-full" style={{ width: muted ? '0%' : `${volume}%` }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Playback speed */}
                  <button
                    onClick={() => {
                      const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]
                      const idx = speeds.indexOf(playbackRate)
                      setPlaybackRate(speeds[(idx + 1) % speeds.length])
                    }}
                    className="text-[10px] font-mono text-white/40 hover:text-white/70 px-2 py-1 rounded bg-white/5 transition-all"
                  >
                    {playbackRate}x
                  </button>

                  {/* Fullscreen */}
                  <button onClick={toggleFullscreen} className="text-white/40 hover:text-white transition-all">
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
