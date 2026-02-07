import { AppProvider, useApp } from '@/lib/context'
import { ToastContainer, ShareModal, NewProjectModal, Sidebar, TopBar } from '@/components/shared'
import { HomeFeed, Discover, Player, Library, ProfileView } from '@/components/consumer'
import { StudioDashboard, AIGenerator, CharacterLab, TimelineEditor } from '@/components/studio'
import { TooltipProvider } from '@/components/ui/tooltip'

function AppContent() {
  const { view, mode } = useApp()

  const renderView = () => {
    switch (view) {
      case 'home': return <HomeFeed />
      case 'discover': return <Discover />
      case 'player': return <Player />
      case 'library': return <Library />
      case 'profile': return <ProfileView />
      case 'studio': return <StudioDashboard />
      case 'ai-gen': return <AIGenerator />
      case 'char-lab': return <CharacterLab />
      case 'timeline': return <TimelineEditor />
      default: return <HomeFeed />
    }
  }

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto scroll-smooth">
          {renderView()}
        </main>
      </div>
      <ToastContainer />
      <ShareModal />
      <NewProjectModal />
    </div>
  )
}

export default function App() {
  return (
    <TooltipProvider delayDuration={200}>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </TooltipProvider>
  )
}
