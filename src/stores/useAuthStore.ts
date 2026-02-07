import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, SubscriptionTier } from '@/lib/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  premiumModalOpen: boolean
  premiumModalReason: string

  // Actions
  login: (user: User) => void
  logout: () => void
  setSubscription: (tier: SubscriptionTier) => void
  openPremiumModal: (reason?: string) => void
  closePremiumModal: () => void
  isPremiumUser: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Default mock user for demo
      user: {
        id: 'u1',
        name: 'Han',
        email: 'niuhan@gmail.com',
        subscription: 'free' as SubscriptionTier,
        joinedDate: '2026-01-15',
      },
      isAuthenticated: true,
      premiumModalOpen: false,
      premiumModalReason: '',

      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),

      setSubscription: (tier) =>
        set((state) => ({
          user: state.user ? { ...state.user, subscription: tier } : null,
        })),

      openPremiumModal: (reason = 'This content requires a Premium subscription.') =>
        set({ premiumModalOpen: true, premiumModalReason: reason }),

      closePremiumModal: () =>
        set({ premiumModalOpen: false, premiumModalReason: '' }),

      isPremiumUser: () => {
        const { user } = get()
        return user?.subscription === 'premium' || user?.subscription === 'basic'
      },
    }),
    {
      name: 'niji-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
