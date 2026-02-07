import { useState, useRef, useEffect } from 'react'
import {
  Play, Sparkles, Users2, Film, Settings, Heart, Eye, Plus, Zap,
  Folder, LayoutGrid, Grid3X3, Scissors, Copy, Download, Upload,
  Redo, Undo, Bot, Palette, Layers, Type, Mic, Music, Send, X,
  SkipBack, SkipForward, Pause, Frame, Check, Loader2, PenTool,
  Shapes, Trash2, ChevronDown, Volume2, Image as ImageIcon, Wand2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useApp } from '@/lib/context'
import { useI18n } from '@/lib/i18n'
import { ART_STYLES, EXPRESSIONS, POSES } from '@/lib/data'

// ─── Studio Dashboard ────────────────────────────────
export function StudioDashboard() {
  const { projects, deleteProject, addToast, setView, setNewProjectModalOpen } = useApp()
  const { t } = useI18n()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return (
    <ScrollArea className="h-full">
      <div className="p-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black mb-1" style={{ fontFamily: 'Outfit' }}><span className="niji-gradient-text">Creator Studio</span></h1>
            <p className="text-sm text-white/40">{t('studio.welcome')}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-8 stagger-children">
          {[
            { label: t('studio.totalViews'), value: '24.8K', change: '+12%', icon: Eye, color: '#ff2d78' },
            { label: t('studio.followers'), value: '1,240', change: '+8%', icon: Users2, color: '#a855f7' },
            { label: t('studio.likes'), value: '5.6K', change: '+15%', icon: Heart, color: '#00d4ff' },
            { label: t('studio.projects'), value: String(projects.length), change: '', icon: Folder, color: '#00ffaa' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4 glass hover:bg-white/[0.04] transition-all">
              <div className="flex items-center justify-between mb-2">
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
                {s.change && <span className="text-[10px] text-[#00ffaa] font-medium">{s.change}</span>}
              </div>
              <p className="text-xl font-bold" style={{ fontFamily: 'Outfit' }}>{s.value}</p>
              <p className="text-[10px] text-white/40 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold mb-3 text-white/60">{t('studio.quickCreate')}</h2>
          <div className="grid grid-cols-3 gap-3 stagger-children">
            {[
              { label: 'Text → Animation', desc: 'Generate from prompt', icon: Sparkles, gradient: 'from-[#ff2d78] to-[#a855f7]', view: 'ai-gen' as const },
              { label: 'New Character', desc: 'AI character design', icon: Users2, gradient: 'from-[#00d4ff] to-[#6366f1]', view: 'char-lab' as const },
              { label: 'Import Script', desc: 'Upload & storyboard', icon: Upload, gradient: 'from-[#00ffaa] to-[#00d4ff]', view: 'timeline' as const },
            ].map(a => (
              <div key={a.label} onClick={() => setView(a.view)}
                className="rounded-xl p-4 cursor-pointer group hover:scale-[1.02] transition-all niji-gradient-border glass">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <a.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-semibold mb-0.5">{a.label}</h3>
                <p className="text-[10px] text-white/40">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white/60">{t('studio.yourProjects')} ({projects.length})</h2>
            <div className="flex gap-1">
              <button onClick={() => setViewMode('grid')} className={`w-7 h-7 rounded-lg flex items-center justify-center ${viewMode === 'grid' ? 'bg-white/5 text-white/40' : 'text-white/20 hover:bg-white/5'}`}><LayoutGrid className="w-3.5 h-3.5" /></button>
              <button onClick={() => setViewMode('list')} className={`w-7 h-7 rounded-lg flex items-center justify-center ${viewMode === 'list' ? 'bg-white/5 text-white/40' : 'text-white/20 hover:bg-white/5'}`}><Grid3X3 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3 stagger-children' : 'space-y-2 stagger-children'}>
            {projects.map(p => (
              <div key={p.id} className={`rounded-xl overflow-hidden glass hover:bg-white/[0.04] cursor-pointer transition-all group ${viewMode === 'list' ? 'flex items-center' : ''}`}>
                <div className={`${viewMode === 'list' ? 'w-20 h-16' : 'h-28'} relative shrink-0`} style={{ background: `linear-gradient(135deg, ${p.color1}20, ${p.color2}20)` }}>
                  <div className="absolute inset-0 opacity-30" style={{ background: `linear-gradient(135deg, ${p.color1}, ${p.color2})` }} />
                  <div className="absolute inset-0 flex items-center justify-center"><Film className={`${viewMode === 'list' ? 'w-5 h-5' : 'w-8 h-8'} text-white/20`} /></div>
                  {viewMode === 'grid' && <div className="absolute top-2 right-2">
                    <Badge className={`text-[9px] px-1.5 py-0 border-0 ${p.status === 'published' ? 'bg-[#00ffaa]/20 text-[#00ffaa]' : p.status === 'rendering' ? 'bg-[#ffd600]/20 text-[#ffd600]' : 'bg-white/10 text-white/50'}`}>
                      {p.status === 'rendering' && <Loader2 className="w-2.5 h-2.5 mr-1 animate-spin" />}{p.status}
                    </Badge>
                  </div>}
                </div>
                <div className="p-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold mb-0.5 group-hover:text-white transition-colors">{p.title}</h3>
                    <button onClick={(e) => { e.stopPropagation(); deleteProject(p.id); addToast(`"${p.title}" deleted`, 'info', '🗑️') }}
                      className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg flex items-center justify-center text-white/30 hover:text-[#ff2d78] hover:bg-[#ff2d78]/10 transition-all">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-white/40">
                    <span>{p.scenes} scenes · {p.duration}</span>
                    {viewMode === 'list' && <Badge className={`text-[9px] px-1.5 py-0 border-0 ${p.status === 'published' ? 'bg-[#00ffaa]/20 text-[#00ffaa]' : p.status === 'rendering' ? 'bg-[#ffd600]/20 text-[#ffd600]' : 'bg-white/10 text-white/50'}`}>{p.status}</Badge>}
                    <span className="ml-auto">{p.lastEdited}</span>
                  </div>
                  {p.status === 'rendering' && p.progress && (
                    <div className="mt-2"><Progress value={p.progress} className="h-1 bg-white/5" /><span className="text-[9px] text-white/30 mt-0.5">{p.progress}%</span></div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {projects.length === 0 && (
            <div className="text-center py-16">
              <Film className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-sm text-white/30 mb-3">{t('studio.noProjects')}</p>
              <Button onClick={() => setNewProjectModalOpen(true)} size="sm" className="bg-gradient-to-r from-[#ff2d78] to-[#a855f7] border-0 gap-1.5 text-xs">
                <Plus className="w-3.5 h-3.5" />{t('studio.createFirst')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  )
}

// ─── AI Generator ────────────────────────────────────
export function AIGenerator() {
  const { addToast, addGenHistory, genHistory, setView } = useApp()
  const { t } = useI18n()
  const [prompt, setPrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState('')
  const [style, setStyle] = useState('cinematic')
  const [ratio, setRatio] = useState('16:9')
  const [duration, setDuration] = useState([30])
  const [quality, setQuality] = useState('standard')
  const [fps, setFps] = useState(24)
  const [negPrompt, setNegPrompt] = useState('')
  const [seed, setSeed] = useState('')
  const [resultScenes, setResultScenes] = useState<{label: string; color: string}[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const stages = [
    { pct: 15, label: '🎨 Analyzing prompt & style...' },
    { pct: 30, label: '📝 Creating storyboard...' },
    { pct: 50, label: '🎭 Generating characters...' },
    { pct: 70, label: '🖼️ Rendering backgrounds...' },
    { pct: 85, label: '🎬 Animating scenes...' },
    { pct: 95, label: '🎵 Adding audio & effects...' },
    { pct: 100, label: '✨ Finalizing...' },
  ]

  const startGenerate = () => {
    if (!prompt) return
    setGenerating(true); setProgress(0); setResultScenes([])
    let p = 0
    const iv = setInterval(() => {
      p += 1.5
      setProgress(Math.min(p, 100))
      const s = stages.find(s => p < s.pct) || stages[stages.length - 1]
      setStage(s.label)
      if (p >= 100) {
        clearInterval(iv)
        const colors = ['#ff2d78','#a855f7','#00d4ff','#ffd600','#ff6b2b','#00ffaa','#6366f1','#f472b6']
        const scenes = Array.from({ length: Math.floor(duration[0] / 4) + 1 }, (_, i) => ({
          label: ['Opening','Build Up','Tension','Climax','Cool Down','Resolution','Epilogue','Credits'][i % 8],
          color: colors[i % colors.length],
        }))
        setResultScenes(scenes)
        setGenerating(false)
        addToast('Animation generated successfully!', 'success', '🎬')
        addGenHistory({
          id: `g${Date.now()}`, prompt, style, duration: duration[0],
          timestamp: new Date().toLocaleTimeString(), scenes,
        })
      }
    }, 80)
  }

  return (
    <div className="h-full flex">
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff2d78]/10 border border-[#ff2d78]/20 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#ff2d78]" />
              <span className="text-xs font-medium text-[#ff2d78]">AI Animation Engine v2.0</span>
            </div>
            <h1 className="text-3xl font-black mb-2" style={{ fontFamily: 'Outfit' }}><span className="niji-gradient-text">Text → Animation</span></h1>
            <p className="text-sm text-white/40">{t('aiGen.subtitle')}</p>
          </div>

          {/* Prompt Box */}
          <div className="rounded-2xl glass-strong p-5 mb-4 niji-gradient-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2"><Bot className="w-4 h-4 text-[#a855f7]" /><span className="text-xs font-semibold text-white/60">Prompt</span></div>
              {genHistory.length > 0 && (
                <button onClick={() => setShowHistory(!showHistory)} className="text-[10px] text-white/30 hover:text-white/50">
                  {t('aiGen.history')} ({genHistory.length})
                </button>
              )}
            </div>
            <Textarea value={prompt} onChange={e => setPrompt(e.target.value)}
              placeholder="A lone samurai stands on a moonlit cliff, cherry blossoms swirling in the wind. Camera slowly zooms in as lightning cracks across the sky. The samurai draws their blade with a flash of steel..."
              className="min-h-[100px] bg-transparent border-0 p-0 text-sm placeholder:text-white/20 resize-none focus-visible:ring-0" />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
              <div className="flex gap-1.5">
                {['🎬 Scene','🗣️ Dialogue','🎵 Music','📷 Camera','⚡ Action'].map(t => (
                  <button key={t} onClick={() => setPrompt(prev => prev + `\n[${t.split(' ')[1]}]: `)}
                    className="px-2 py-1 rounded-md bg-white/5 text-[10px] text-white/40 hover:text-white/60 hover:bg-white/8 transition-all">{t}</button>
                ))}
              </div>
              <span className={`text-[10px] ${prompt.length > 1800 ? 'text-[#ff2d78]' : 'text-white/20'}`}>{prompt.length}/2000</span>
            </div>
          </div>

          {/* History dropdown */}
          {showHistory && genHistory.length > 0 && (
            <div className="rounded-xl glass-strong mb-4 overflow-hidden animate-fade-in-up">
              <div className="p-3 border-b border-white/5"><span className="text-xs font-semibold text-white/50">{t('aiGen.history')}</span></div>
              {genHistory.slice(0, 5).map(g => (
                <button key={g.id} onClick={() => { setPrompt(g.prompt); setShowHistory(false) }}
                  className="w-full text-left px-3 py-2.5 hover:bg-white/5 transition-all border-b border-white/5 last:border-0">
                  <p className="text-xs text-white/70 truncate">{g.prompt}</p>
                  <p className="text-[10px] text-white/30">{g.style} · {g.duration}s · {g.timestamp}</p>
                </button>
              ))}
            </div>
          )}

          {/* Templates */}
          <div className="mb-4">
            <p className="text-[10px] text-white/30 mb-2">{t('aiGen.templates')}</p>
            <div className="flex gap-2 flex-wrap">
              {['Epic sword battle in the rain','Quiet café conversation at sunset','Spaceship chase through asteroid field','Magical girl transformation sequence','Emotional farewell at cherry blossom station','Robot awakens in abandoned factory'].map(t => (
                <button key={t} onClick={() => setPrompt(t)} className="px-3 py-1.5 rounded-full bg-white/5 text-[10px] text-white/40 hover:text-white/60 hover:bg-white/8 border border-white/5 hover:border-white/10 transition-all">{t}</button>
              ))}
            </div>
          </div>

          {/* Generate / Result */}
          {generating ? (
            <div className="rounded-2xl glass-strong p-6 text-center animate-fade-in-up">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full niji-gradient animate-spin-slow opacity-30" />
                <div className="absolute inset-[3px] rounded-full bg-[#08080f] flex items-center justify-center"><Sparkles className="w-6 h-6 text-[#ff2d78] animate-pulse" /></div>
              </div>
              <p className="text-sm font-semibold mb-1">{t('aiGen.generating')}</p>
              <p className="text-xs text-white/40 mb-4">{stage}</p>
              <Progress value={progress} className="h-1.5 bg-white/5 mb-2" />
              <div className="flex justify-between text-[10px] text-white/30"><span>{stage}</span><span>{Math.floor(progress)}%</span></div>
            </div>
          ) : resultScenes.length > 0 ? (
            <div className="rounded-2xl overflow-hidden animate-fade-in-up">
              <div className="p-4 glass-strong mb-1 rounded-t-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Check className="w-5 h-5 text-[#00ffaa]" />
                  <span className="text-sm font-semibold">{t('aiGen.generated')}</span>
                  <span className="text-xs text-white/40 ml-auto">{resultScenes.length} scenes · {duration[0]}s · {fps}fps</span>
                </div>
                {/* Scene strip preview */}
                <div className="flex gap-1 mb-3">
                  {resultScenes.map((s, i) => (
                    <div key={i} className="flex-1 h-14 rounded-lg flex items-end p-1.5" style={{ background: `linear-gradient(180deg, ${s.color}30, ${s.color}10)` }}>
                      <span className="text-[8px] text-white/50">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Button className="flex-1 h-10 bg-[#ff2d78] hover:bg-[#ff2d78]/80 border-0 gap-2 font-semibold text-sm"><Play className="w-4 h-4" fill="currentColor" />Preview</Button>
                <Button onClick={() => { setView('timeline'); addToast('Opened in Timeline Editor', 'success', '🎬') }} variant="outline" className="flex-1 h-10 border-white/10 text-white/60 gap-2 text-sm"><Film className="w-4 h-4" />Edit in Timeline</Button>
                <Button variant="outline" className="h-10 w-10 p-0 border-white/10 text-white/40"><Download className="w-4 h-4" /></Button>
              </div>
              <Button onClick={() => { setProgress(0); setResultScenes([]) }} variant="ghost" className="w-full mt-2 text-xs text-white/30 hover:text-white/50 h-8">
                {t('aiGen.generateAnother')}
              </Button>
            </div>
          ) : (
            <Button onClick={startGenerate} disabled={!prompt.trim()} className="w-full h-12 text-sm font-bold bg-gradient-to-r from-[#ff2d78] via-[#a855f7] to-[#00d4ff] hover:opacity-90 border-0 gap-2 animate-gradient-x disabled:opacity-30">
              <Sparkles className="w-4 h-4" />{t('aiGen.generate')}
            </Button>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      <div className="w-[280px] glass-strong p-5 overflow-auto">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Settings className="w-4 h-4 text-white/40" />{t('aiGen.settings')}</h3>
        <div className="mb-5">
          <label className="text-[10px] text-white/40 font-medium mb-2 block">{t('aiGen.artStyle')}</label>
          <div className="grid grid-cols-2 gap-2">
            {ART_STYLES.map(s => (
              <button key={s.id} onClick={() => setStyle(s.id)}
                className={`h-14 rounded-lg text-left px-2.5 transition-all ${style === s.id ? 'border-2' : 'border border-white/5 hover:bg-white/5'}`}
                style={style === s.id ? { borderColor: s.color, background: `${s.color}12` } : {}}>
                <p className={`text-xs font-medium ${style === s.id ? '' : 'text-white/50'}`} style={style === s.id ? { color: s.color } : {}}>{s.label}</p>
                <p className="text-[8px] text-white/30 mt-0.5">{s.desc}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="mb-5">
          <label className="text-[10px] text-white/40 font-medium mb-2 block">ASPECT RATIO</label>
          <div className="flex gap-2">
            {['16:9','9:16','1:1','4:3'].map(r => (
              <button key={r} onClick={() => setRatio(r)}
                className={`flex-1 h-9 rounded-lg text-xs font-medium transition-all ${ratio === r ? 'bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/30' : 'bg-white/5 text-white/40 border border-transparent hover:bg-white/8'}`}>{r}</button>
            ))}
          </div>
        </div>
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] text-white/40 font-medium">{t('aiGen.duration')}</label>
            <span className="text-xs font-semibold text-[#00d4ff]">{duration[0]}s</span>
          </div>
          <Slider value={duration} onValueChange={setDuration} min={5} max={120} step={5} />
        </div>
        <div className="mb-5">
          <label className="text-[10px] text-white/40 font-medium mb-2 block">QUALITY</label>
          <div className="flex gap-2">
            {[{ id:'draft', label:'Draft', desc:'Fast' },{ id:'standard', label:'Standard', desc:'Balanced' },{ id:'ultra', label:'Ultra', desc:'4K' }].map(q => (
              <button key={q.id} onClick={() => setQuality(q.id)}
                className={`flex-1 rounded-lg py-2 transition-all ${quality === q.id ? 'bg-[#ff2d78]/15 border border-[#ff2d78]/30' : 'bg-white/5 border border-transparent hover:bg-white/8'}`}>
                <p className={`text-xs font-medium ${quality === q.id ? 'text-[#ff2d78]' : 'text-white/50'}`}>{q.label}</p>
                <p className="text-[9px] text-white/30">{q.desc}</p>
              </button>
            ))}
          </div>
        </div>
        <Separator className="bg-white/5 my-4" />
        <div className="space-y-3">
          <div><label className="text-[10px] text-white/40 font-medium mb-1.5 block">NEGATIVE PROMPT</label>
            <Input value={negPrompt} onChange={e => setNegPrompt(e.target.value)} placeholder="Low quality, blurry..." className="h-8 bg-white/5 border-white/5 text-xs placeholder:text-white/15" /></div>
          <div><label className="text-[10px] text-white/40 font-medium mb-1.5 block">SEED</label>
            <Input value={seed} onChange={e => setSeed(e.target.value)} placeholder="Random" className="h-8 bg-white/5 border-white/5 text-xs placeholder:text-white/15" /></div>
          <div className="flex items-center justify-between">
            <label className="text-[10px] text-white/40 font-medium">FPS</label>
            <div className="flex gap-1">
              {[12,24,30,60].map(f => (
                <button key={f} onClick={() => setFps(f)} className={`px-2 py-1 rounded text-[10px] ${fps === f ? 'bg-[#a855f7]/20 text-[#a855f7]' : 'bg-white/5 text-white/30 hover:bg-white/8'}`}>{f}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Character Lab ───────────────────────────────────
export function CharacterLab() {
  const { characters, addCharacter, updateCharacter, deleteCharacter, addToast } = useApp()
  const { t } = useI18n()
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [descInput, setDescInput] = useState('')
  const [regenerating, setRegenerating] = useState(false)
  const ch = characters[selectedIdx]

  const expressionEmojis: Record<string, string> = { neutral:'😐', happy:'😊', angry:'😠', sad:'😢', shocked:'😲', smirk:'😏', blush:'😳', determined:'😤' }
  const poseLabels: Record<string, string> = { standing:'🧍', action:'⚔️', sitting:'🪑', running:'🏃', flying:'🦅', dramatic:'🎭' }

  useEffect(() => { if (ch) setDescInput(ch.description) }, [selectedIdx, ch?.id])

  const handleNewChar = () => {
    const names = ['Kai','Luna','Zero','Mika','Sora','Jin','Emi','Taro']
    const roles = ['Fighter','Healer','Scout','Scholar']
    const colors = ['#ff2d78','#00d4ff','#a855f7','#00ffaa','#ffd600','#ff6b2b']
    const n = names[Math.floor(Math.random() * names.length)]
    addCharacter({
      id: `c${Date.now()}`, name: n, role: roles[Math.floor(Math.random() * roles.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      traits: ['New','Custom'], expression: 'neutral', pose: 'standing',
      description: `A new character waiting to be designed...`,
    })
    setSelectedIdx(characters.length)
    addToast(`Character "${n}" created!`, 'success', '🎭')
  }

  const handleRegenerate = () => {
    if (!ch) return
    setRegenerating(true)
    updateCharacter(ch.id, { description: descInput })
    setTimeout(() => {
      const newTraits = [['Bold','Fierce','Loyal'],['Wise','Calm','Noble'],['Dark','Swift','Cunning'],['Bright','Playful','Warm']]
      updateCharacter(ch.id, { traits: newTraits[Math.floor(Math.random() * newTraits.length)] })
      setRegenerating(false)
      addToast('Character regenerated with AI!', 'success', '✨')
    }, 2000)
  }

  if (!ch) return <div className="h-full flex items-center justify-center text-white/30">No characters</div>

  return (
    <div className="h-full flex">
      <div className="w-[240px] glass-strong p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2"><Users2 className="w-4 h-4 text-[#00d4ff]" />Characters ({characters.length})</h3>
          <button onClick={handleNewChar} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/8 flex items-center justify-center text-white/40 transition-all"><Plus className="w-3.5 h-3.5" /></button>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-1.5">
            {characters.map((c, i) => (
              <div key={c.id} onClick={() => setSelectedIdx(i)}
                className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all group ${i === selectedIdx ? 'glass-strong' : 'hover:bg-white/5'}`}
                style={i === selectedIdx ? { borderLeft: `2px solid ${c.color}` } : {}}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: `linear-gradient(135deg, ${c.color}40, ${c.color}15)` }}>
                  {expressionEmojis[c.expression] || '😐'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{c.name}</p>
                  <p className="text-[10px] text-white/40">{c.role}</p>
                </div>
                {characters.length > 1 && (
                  <button onClick={(e) => { e.stopPropagation(); deleteCharacter(c.id); if (selectedIdx >= characters.length - 1) setSelectedIdx(Math.max(0, selectedIdx - 1)); addToast(`"${c.name}" deleted`, 'info', '🗑️') }}
                    className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-[#ff2d78] transition-all"><Trash2 className="w-3 h-3" /></button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <Button onClick={handleNewChar} className="w-full h-9 mt-3 text-xs bg-gradient-to-r from-[#00d4ff] to-[#a855f7] hover:opacity-90 border-0 gap-1.5 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />{t('charLab.generateNew')}
        </Button>
      </div>

      {/* Preview */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center animate-fade-in-up" key={`${ch.id}-${ch.expression}-${ch.pose}`}>
          <div className="relative inline-block mb-6">
            <div className="w-52 h-72 rounded-2xl relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${ch.color}30, ${ch.color}05)` }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full" style={{ background: `linear-gradient(135deg, ${ch.color}, ${ch.color}44)`, filter: 'blur(35px)' }} />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <span className="text-7xl">{expressionEmojis[ch.expression]}</span>
                <span className="text-2xl">{poseLabels[ch.pose]}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-lg font-bold">{ch.name}</p>
                <p className="text-xs text-white/50">{ch.role} · {ch.expression} · {ch.pose}</p>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: ch.color }}>
              {regenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'AI'}
            </div>
          </div>
          <div className="flex gap-1.5 justify-center mb-4 flex-wrap">
            {ch.traits.map(t => <Badge key={t} variant="outline" className="text-[10px] border-white/10 text-white/50">{t}</Badge>)}
          </div>
          <div className="flex gap-2 justify-center">
            <Button size="sm" className="h-8 px-4 text-xs bg-white/5 border border-white/10 text-white/60 hover:bg-white/8 gap-1.5"><Copy className="w-3.5 h-3.5" />{t('charLab.clone')}</Button>
          </div>
        </div>
      </div>

      {/* Properties */}
      <div className="w-[280px] glass-strong p-5 overflow-auto">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Palette className="w-4 h-4 text-white/40" />{t('charLab.properties')}</h3>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] text-white/40 font-medium mb-1.5 block">NAME</label>
            <Input value={ch.name} onChange={e => updateCharacter(ch.id, { name: e.target.value })} className="h-8 bg-white/5 border-white/5 text-sm" />
          </div>
          <div>
            <label className="text-[10px] text-white/40 font-medium mb-1.5 block">ROLE</label>
            <Input value={ch.role} onChange={e => updateCharacter(ch.id, { role: e.target.value })} className="h-8 bg-white/5 border-white/5 text-sm" />
          </div>
          <div>
            <label className="text-[10px] text-white/40 font-medium mb-1.5 block">AI DESCRIPTION</label>
            <Textarea value={descInput} onChange={e => setDescInput(e.target.value)} placeholder="Describe appearance, personality..." className="min-h-[80px] bg-white/5 border-white/5 text-xs placeholder:text-white/15 resize-none" />
          </div>
          <Separator className="bg-white/5" />
          <div>
            <label className="text-[10px] text-white/40 font-medium mb-2 block">{t('charLab.expressions')}</label>
            <div className="grid grid-cols-4 gap-1.5">
              {EXPRESSIONS.map(e => (
                <button key={e} onClick={() => updateCharacter(ch.id, { expression: e })}
                  className={`h-10 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all ${ch.expression === e ? 'ring-1' : 'bg-white/5 hover:bg-white/8'}`}
                  style={ch.expression === e ? { ringColor: ch.color, background: `${ch.color}15` } : {}}>
                  <span className="text-sm">{expressionEmojis[e]}</span>
                  <span className="text-[7px] text-white/40">{e}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] text-white/40 font-medium mb-2 block">{t('charLab.poses')}</label>
            <div className="grid grid-cols-3 gap-1.5">
              {POSES.map(p => (
                <button key={p} onClick={() => updateCharacter(ch.id, { pose: p })}
                  className={`h-10 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all ${ch.pose === p ? 'ring-1' : 'bg-white/5 hover:bg-white/8'}`}
                  style={ch.pose === p ? { ringColor: ch.color, background: `${ch.color}15` } : {}}>
                  <span className="text-sm">{poseLabels[p]}</span>
                  <span className="text-[7px] text-white/40">{p}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] text-white/40 font-medium mb-2 block">{t('charLab.voice')}</label>
            <div className="grid grid-cols-2 gap-2">
              {[{ label:'Deep Male', icon:Mic },{ label:'Soft Female', icon:Mic },{ label:'Young', icon:Mic },{ label:'AI Custom', icon:Sparkles }].map(v => (
                <button key={v.label} className="h-9 rounded-lg bg-white/5 text-[10px] text-white/40 hover:bg-white/8 flex items-center justify-center gap-1.5 transition-all">
                  <v.icon className="w-3 h-3" />{v.label}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={handleRegenerate} disabled={regenerating} className="w-full h-9 text-xs bg-gradient-to-r from-[#a855f7] to-[#ff2d78] hover:opacity-90 border-0 gap-1.5 font-semibold disabled:opacity-50">
            {regenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {regenerating ? t('charLab.regenerating') : t('charLab.regenerate')}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Timeline Editor ─────────────────────────────────
export function TimelineEditor() {
  const { scenes, addScene, deleteScene, updateScene, addToast } = useApp()
  const { t } = useI18n()
  const [selectedScene, setSelectedScene] = useState(0)
  const [playheadPos, setPlayheadPos] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [layerVis, setLayerVis] = useState({ bg: true, chars: true, fx: true, dialogue: true, audio: true })
  const [zoom, setZoom] = useState(100)
  const trackRef = useRef<HTMLDivElement>(null)
  const playRef = useRef<number>()
  const totalDuration = scenes.reduce((a, s) => a + s.duration, 0)

  useEffect(() => {
    if (isPlaying) {
      playRef.current = window.setInterval(() => {
        setPlayheadPos(p => p >= 100 ? (setIsPlaying(false), 0) : p + (100 / totalDuration / 10))
      }, 100)
    }
    return () => clearInterval(playRef.current)
  }, [isPlaying, totalDuration])

  const handleTrackClick = (e: React.MouseEvent) => {
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    setPlayheadPos(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)))
  }

  const handleAddScene = () => {
    const colors = ['#ff2d78','#a855f7','#00d4ff','#ffd600','#ff6b2b','#00ffaa','#6366f1']
    const id = Math.max(...scenes.map(s => s.id), 0) + 1
    addScene({ id, label: `Scene ${id}`, duration: 4, color: colors[id % colors.length], visible: true })
    addToast('Scene added!', 'success', '🎬')
  }

  const currentSec = Math.floor(totalDuration * playheadPos / 100)
  const scene = scenes[selectedScene]

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="h-12 flex items-center justify-between px-4 glass-strong border-b border-white/5">
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/50 hover:bg-white/5"><Undo className="w-4 h-4" /></button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/50 hover:bg-white/5"><Redo className="w-4 h-4" /></button>
          <Separator orientation="vertical" className="h-5 bg-white/5 mx-1" />
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/50 hover:bg-white/5"><Scissors className="w-4 h-4" /></button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/50 hover:bg-white/5"><Copy className="w-4 h-4" /></button>
          <button onClick={handleAddScene} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#00ffaa]/60 hover:text-[#00ffaa] hover:bg-[#00ffaa]/10"><Plus className="w-4 h-4" /></button>
          {scene && <button onClick={() => { if (scenes.length <= 1) return; deleteScene(scene.id); setSelectedScene(Math.max(0, selectedScene - 1)); addToast('Scene deleted', 'info', '🗑️') }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/20 hover:text-[#ff2d78] hover:bg-[#ff2d78]/10"><Trash2 className="w-4 h-4" /></button>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40 font-mono">
            {Math.floor(currentSec / 60)}:{String(currentSec % 60).padStart(2, '0')} / {Math.floor(totalDuration / 60)}:{String(totalDuration % 60).padStart(2, '0')}
          </span>
          <Separator orientation="vertical" className="h-5 bg-white/5" />
          <button onClick={() => setPlayheadPos(0)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/50 hover:bg-white/5"><SkipBack className="w-4 h-4" /></button>
          <button onClick={() => setIsPlaying(!isPlaying)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:bg-white/10 bg-white/5">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" fill="currentColor" />}
          </button>
          <button onClick={() => setPlayheadPos(100)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/50 hover:bg-white/5"><SkipForward className="w-4 h-4" /></button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/30">{scenes.length} scenes</span>
          <Button size="sm" className="h-8 px-3 text-xs bg-[#00ffaa]/20 text-[#00ffaa] border border-[#00ffaa]/30 hover:bg-[#00ffaa]/30 gap-1.5 font-medium"><Download className="w-3.5 h-3.5" />{t('timeline.export')}</Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Preview */}
        <div className="flex-1 relative" style={{ background: scene ? `linear-gradient(135deg, ${scene.color}10, transparent)` : undefined }}>
          <div className="absolute inset-0 flex items-center justify-center">
            {scene ? (
              <div className="text-center">
                <div className="w-32 h-32 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${scene.color}30, ${scene.color}10)` }}>
                  <Frame className="w-12 h-12" style={{ color: scene.color, opacity: 0.5 }} />
                </div>
                <p className="text-sm font-semibold">Scene {selectedScene + 1}: {scene.label}</p>
                <p className="text-xs text-white/40 mt-1">{scene.duration}s</p>
              </div>
            ) : <p className="text-white/30">No scene selected</p>}
          </div>
        </div>

        {/* Properties */}
        <div className="w-[260px] glass-strong p-4 overflow-auto">
          <h3 className="text-xs font-semibold text-white/60 mb-3">{t('timeline.sceneProps')}</h3>
          {scene && (
            <div className="space-y-3">
              <div><label className="text-[10px] text-white/30 block mb-1">Name</label>
                <Input value={scene.label} onChange={e => updateScene(scene.id, { label: e.target.value })} className="h-7 bg-white/5 border-white/5 text-xs" /></div>
              <div>
                <label className="text-[10px] text-white/30 block mb-1">Duration ({scene.duration}s)</label>
                <Slider value={[scene.duration]} onValueChange={([v]) => updateScene(scene.id, { duration: v })} min={1} max={30} step={1} />
              </div>
              <Separator className="bg-white/5" />
              <div>
                <label className="text-[10px] text-white/30 block mb-2">{t('timeline.layers')}</label>
                {Object.entries(layerVis).map(([key, vis], i) => (
                  <div key={key} onClick={() => setLayerVis(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                    className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: ['#00d4ff','#ff2d78','#a855f7','#ffd600','#00ffaa'][i], opacity: vis ? 1 : 0.3 }} />
                      <span className={`text-[10px] ${vis ? 'text-white/60' : 'text-white/20 line-through'}`}>
                        {['Background','Characters','Effects','Dialogue','Audio'][i]}
                      </span>
                    </div>
                    <Eye className={`w-3 h-3 ${vis ? 'text-white/40' : 'text-white/10'}`} />
                  </div>
                ))}
              </div>
              <Button size="sm" className="w-full h-8 text-[10px] bg-gradient-to-r from-[#a855f7] to-[#00d4ff] hover:opacity-90 border-0 gap-1.5 font-semibold">
                <Sparkles className="w-3 h-3" />{t('timeline.aiEnhance')}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="h-[180px] glass-strong border-t border-white/5 flex flex-col">
        <div className="h-8 flex items-center px-4 border-b border-white/5">
          <div className="flex items-center gap-2"><Film className="w-3.5 h-3.5 text-white/30" /><span className="text-[10px] text-white/40 font-medium">{t('timeline.title')}</span></div>
          <div className="ml-auto flex items-center gap-2 text-[10px] text-white/30">
            <button onClick={() => setZoom(z => Math.max(50, z - 25))} className="hover:text-white/50">−</button>
            <span>{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(200, z + 25))} className="hover:text-white/50">+</button>
          </div>
        </div>
        <div className="flex-1 flex">
          <div className="w-[100px] border-r border-white/5 py-2">
            {['Scenes','Audio','Effects','Dialogue'].map(l => (
              <div key={l} className="h-8 flex items-center px-3 text-[10px] text-white/30">{l}</div>
            ))}
          </div>
          <div ref={trackRef} onClick={handleTrackClick} className="flex-1 relative py-2 overflow-x-auto cursor-crosshair" style={{ minWidth: `${zoom}%` }}>
            <div className="absolute top-0 bottom-0 w-px bg-[#ff2d78] z-10 transition-[left] duration-100" style={{ left: `${playheadPos}%` }}>
              <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#ff2d78] rounded-full border-2 border-[#08080f]" />
            </div>
            <div className="h-8 flex items-center gap-0.5 px-2">
              {scenes.map((sc, i) => (
                <div key={sc.id} onClick={(e) => { e.stopPropagation(); setSelectedScene(i) }}
                  className={`h-6 rounded-md flex items-center px-2 cursor-pointer transition-all text-[9px] font-medium shrink-0 ${i === selectedScene ? 'ring-1 ring-white/30' : 'hover:brightness-125'}`}
                  style={{ width: `${(sc.duration / totalDuration) * 100}%`, background: `${sc.color}40`, color: sc.color, minWidth: 40 }}>
                  {sc.label}
                </div>
              ))}
            </div>
            <div className="h-8 flex items-center px-2">
              {layerVis.audio && <div className="h-5 rounded-md bg-[#00ffaa]/15 flex items-center px-2 text-[9px] text-[#00ffaa]/60" style={{ width: '80%' }}>
                <Music className="w-3 h-3 mr-1" />BGM Track
              </div>}
            </div>
            <div className="h-8 flex items-center px-2 gap-1">
              {layerVis.fx && <>
                <div className="h-4 rounded bg-[#a855f7]/20 w-[15%]" style={{ marginLeft: '10%' }} />
                <div className="h-4 rounded bg-[#ffd600]/20 w-[10%]" style={{ marginLeft: '5%' }} />
                <div className="h-4 rounded bg-[#ff2d78]/20 w-[20%]" style={{ marginLeft: '8%' }} />
              </>}
            </div>
            <div className="h-8 flex items-center px-2 gap-1">
              {layerVis.dialogue && <>
                <div className="h-4 rounded bg-[#00d4ff]/15 flex items-center px-1.5 text-[8px] text-[#00d4ff]/50" style={{ width: '12%', marginLeft: '5%' }}><Type className="w-2.5 h-2.5 mr-0.5" />A</div>
                <div className="h-4 rounded bg-[#ff8fab]/15 flex items-center px-1.5 text-[8px] text-[#ff8fab]/50" style={{ width: '15%', marginLeft: '15%' }}><Type className="w-2.5 h-2.5 mr-0.5" />B</div>
              </>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
