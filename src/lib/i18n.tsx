import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type Lang = 'en' | 'ja'

const translations = {
  // Sidebar
  'nav.home': { en: 'Home', ja: 'ホーム' },
  'nav.discover': { en: 'Discover', ja: '探索' },
  'nav.library': { en: 'Library', ja: 'ライブラリ' },
  'nav.profile': { en: 'Profile', ja: 'プロフィール' },
  'nav.studio': { en: 'Studio', ja: 'スタジオ' },
  'nav.aiGen': { en: 'AI Generate', ja: 'AI生成' },
  'nav.characters': { en: 'Characters', ja: 'キャラクター' },
  'nav.timeline': { en: 'Timeline', ja: 'タイムライン' },

  // Logo
  'logo': { en: 'niji', ja: '虹' },

  // Search
  'search.shorts': { en: 'Search shorts...', ja: '漫剧を検索...' },
  'search.projects': { en: 'Search projects...', ja: 'プロジェクトを検索...' },
  'search.noResults': { en: 'No results found for', ja: '検索結果なし:' },

  // Share modal
  'share.title': { en: 'Share', ja: '共有' },
  'share.copied': { en: 'Link copied to clipboard!', ja: 'リンクをコピーしました！' },

  // New Project modal
  'newProject.title': { en: 'New Project', ja: '新規プロジェクト' },
  'newProject.nameLabel': { en: 'PROJECT NAME', ja: 'プロジェクト名' },
  'newProject.template': { en: 'TEMPLATE', ja: 'テンプレート' },
  'newProject.create': { en: 'Create Project', ja: 'プロジェクト作成' },

  // Home sections
  'home.trending': { en: 'Trending', ja: 'トレンド 人気' },
  'home.newReleases': { en: 'New Releases', ja: '新着リリース' },
  'home.continueWatching': { en: 'Continue Watching', ja: '視聴を続ける' },
  'home.trendingNow': { en: 'TRENDING NOW', ja: '今トレンド' },
  'home.watchNow': { en: 'Watch Now', ja: '今すぐ視聴' },
  'home.viewAll': { en: 'View All', ja: 'すべて見る' },

  // Discover
  'discover.title': { en: 'Discover', ja: '探索' },
  'discover.subtitle': { en: 'Find your next favorite animated short', ja: 'お気に入りの漫剧を見つけよう' },
  'discover.topCreators': { en: 'Top Creators', ja: 'トップクリエイター' },
  'discover.editorsPicks': { en: "Editor's Picks", ja: '編集者のおすすめ' },
  'discover.clearFilter': { en: 'Clear filter', ja: 'フィルターを解除' },
  'discover.shorts': { en: 'shorts', ja: '作品' },

  // Genres
  'genre.action': { en: 'Action', ja: 'アクション' },
  'genre.romance': { en: 'Romance', ja: '恋愛' },
  'genre.scifi': { en: 'Sci-Fi', ja: 'SF' },
  'genre.fantasy': { en: 'Fantasy', ja: '幻想' },
  'genre.comedy': { en: 'Comedy', ja: '喜劇' },

  // Library
  'library.title': { en: 'Library', ja: 'ライブラリ' },
  'library.subtitle': { en: 'Your saved and liked content', ja: '保存・いいねしたコンテンツ' },
  'library.saved': { en: 'Saved', ja: '保存済み' },
  'library.liked': { en: 'Liked', ja: 'いいね' },
  'library.history': { en: 'History', ja: '履歴' },
  'library.noItems': { en: 'No {tab} items yet', ja: 'まだ{tab}はありません' },
  'library.startWatching': { en: 'Start watching and {action} shorts!', ja: 'ショートを{action}しよう！' },

  // Profile
  'profile.recentlyWatched': { en: 'Recently Watched', ja: '最近視聴' },
  'profile.startWatching': { en: 'Start watching to build your profile!', ja: '視聴してプロフィールを充実させよう！' },

  // Studio
  'studio.title': { en: 'Creator Studio', ja: 'クリエイタースタジオ' },
  'studio.welcome': { en: "Welcome back, Han. Let's create something amazing.", ja: 'おかえりなさい、Han。素晴らしいものを作ろう。' },
  'studio.quickCreate': { en: 'Quick Create', ja: 'クイック作成' },
  'studio.yourProjects': { en: 'Your Projects', ja: 'プロジェクト一覧' },
  'studio.noProjects': { en: 'No projects yet', ja: 'プロジェクトがありません' },
  'studio.createFirst': { en: 'Create Your First Project', ja: '最初のプロジェクトを作成' },
  'studio.totalViews': { en: 'Total Views', ja: '総再生回数' },
  'studio.followers': { en: 'Followers', ja: 'フォロワー' },
  'studio.likes': { en: 'Likes', ja: 'いいね数' },
  'studio.projects': { en: 'Projects', ja: 'プロジェクト' },
  'studio.textToAnim': { en: 'Text → Animation', ja: 'テキスト→アニメーション' },
  'studio.generatePrompt': { en: 'Generate from prompt', ja: 'プロンプトから生成' },
  'studio.newChar': { en: 'New Character', ja: '新キャラクター' },
  'studio.aiCharDesign': { en: 'AI character design', ja: 'AIキャラクターデザイン' },
  'studio.importScript': { en: 'Import Script', ja: 'スクリプト読込' },
  'studio.uploadStoryboard': { en: 'Upload & storyboard', ja: 'アップロード＆絵コンテ' },

  // AI Generator
  'aiGen.badge': { en: 'AI Animation Engine v2.0', ja: 'AIアニメーションエンジン v2.0' },
  'aiGen.title': { en: 'Text → Animation', ja: 'テキスト→アニメーション' },
  'aiGen.subtitle': { en: 'Describe your vision and let AI bring it to life', ja: 'テキストからアニメーションへ' },
  'aiGen.templates': { en: 'TEMPLATES', ja: 'テンプレート' },
  'aiGen.generate': { en: 'Generate Animation', ja: 'アニメーション生成' },
  'aiGen.generating': { en: 'Generating your animation...', ja: 'アニメーションを生成中...' },
  'aiGen.generated': { en: 'Animation Generated!', ja: 'アニメーション完成！' },
  'aiGen.generateAnother': { en: 'Generate Another', ja: '別のものを生成' },
  'aiGen.artStyle': { en: 'ART STYLE', ja: 'アートスタイル' },
  'aiGen.duration': { en: 'DURATION', ja: '長さ' },
  'aiGen.quality': { en: 'QUALITY', ja: '品質' },
  'aiGen.settings': { en: 'Settings', ja: '設定' },
  'aiGen.negPrompt': { en: 'NEGATIVE PROMPT', ja: 'ネガティブプロンプト' },
  'aiGen.history': { en: 'Generation History', ja: '生成履歴' },

  // Character Lab
  'charLab.characters': { en: 'Characters', ja: 'キャラクター' },
  'charLab.generateNew': { en: 'Generate New', ja: '新規生成' },
  'charLab.properties': { en: 'Properties', ja: 'プロパティ' },
  'charLab.expressions': { en: 'EXPRESSIONS', ja: '表情' },
  'charLab.poses': { en: 'POSES', ja: 'ポーズ' },
  'charLab.voice': { en: 'VOICE', ja: '声' },
  'charLab.regenerate': { en: 'Regenerate with AI', ja: 'AIで再生成' },
  'charLab.regenerating': { en: 'Regenerating...', ja: '再生成中...' },
  'charLab.clone': { en: 'Clone', ja: '複製' },

  // Timeline
  'timeline.title': { en: 'TIMELINE', ja: 'タイムライン' },
  'timeline.sceneProps': { en: 'SCENE PROPERTIES', ja: 'シーンプロパティ' },
  'timeline.layers': { en: 'LAYERS', ja: 'レイヤー' },
  'timeline.aiEnhance': { en: 'AI Enhance Scene', ja: 'AIでシーン強化' },
  'timeline.export': { en: 'Export', ja: 'エクスポート' },

  // Player
  'player.comments': { en: 'Comments', ja: 'コメント' },
  'player.addComment': { en: 'Add a comment...', ja: 'コメントを追加...' },
  'player.follow': { en: 'Follow', ja: 'フォロー' },
  'player.following': { en: 'Following', ja: 'フォロー中' },
  'player.like': { en: 'Like', ja: 'いいね' },
  'player.liked': { en: 'Liked', ja: 'いいね済み' },
  'player.share': { en: 'Share', ja: '共有' },
  'player.save': { en: 'Save', ja: '保存' },
  'player.saved': { en: 'Saved', ja: '保存済み' },
  'player.reply': { en: 'Reply', ja: '返信' },

  // Common
  'common.followers': { en: 'followers', ja: 'フォロワー' },
  'common.following': { en: 'following', ja: 'フォロー中' },
  'common.works': { en: 'works', ja: '作品' },
  'common.scenes': { en: 'scenes', ja: 'シーン' },
  'common.newProject': { en: 'New Project', ja: '新規プロジェクト' },
  'common.by': { en: 'by', ja: '制作' },
} as const

type TranslationKey = keyof typeof translations

interface I18nState {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nState | null>(null)

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be inside I18nProvider')
  return ctx
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const t = useCallback((key: TranslationKey) => {
    const entry = translations[key]
    return entry ? entry[lang] : key
  }, [lang])

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}
