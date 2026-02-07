import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProvider, useApp } from '@/lib/context'
import { I18nProvider } from '@/lib/i18n'
import { ToastContainer, ShareModal, NewProjectModal, Sidebar, TopBar } from '@/components/shared'
import { HomeFeed, Discover, Player, Library, ProfileView, SettingsView } from '@/components/consumer'
import { StudioDashboard, AIGenerator, CharacterLab, TimelineEditor } from '@/components/studio'
import { PremiumModal } from '@/components/premium/SubscriptionGuard'
import { SeriesPage } from '@/pages/SeriesPage'
import { MangaPage } from '@/pages/MangaPage'
import { TooltipProvider } from '@/components/ui/tooltip'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,    // 5 minutes
      gcTime: 1000 * 60 * 30,       // 30 minutes (previously cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

// Layout shell for pages that use the sidebar + topbar
function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#0a0a0f] text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto scroll-smooth">
          {children}
        </main>
      </div>
      <ToastContainer />
      <ShareModal />
      <NewProjectModal />
      <PremiumModal />
    </div>
  )
}

// The view-based content renderer (preserves existing nav for main pages)
function ViewRouter() {
  const { view } = useApp()

  switch (view) {
    case 'home': return <HomeFeed />
    case 'discover': return <Discover />
    case 'player': return <Player />
    case 'library': return <Library />
    case 'profile': return <ProfileView />
    case 'settings': return <SettingsView />
    case 'studio': return <StudioDashboard />
    case 'ai-gen': return <AIGenerator />
    case 'char-lab': return <CharacterLab />
    case 'timeline': return <TimelineEditor />
    default: return <HomeFeed />
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <I18nProvider>
          <TooltipProvider delayDuration={200}>
            <AppProvider>
              <Routes>
                {/* Dynamic routes for content pages */}
                <Route path="/series/:id" element={<AppShell><SeriesPage /></AppShell>} />
                <Route path="/manga/:id" element={<AppShell><MangaPage /></AppShell>} />

                {/* Main app — uses the existing view state system */}
                <Route path="/*" element={<AppShell><ViewRouter /></AppShell>} />
              </Routes>
            </AppProvider>
          </TooltipProvider>
        </I18nProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
