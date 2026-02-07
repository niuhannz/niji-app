import { type ReactNode, type ComponentType, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, X, Check, Sparkles, Zap, Shield, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/useAuthStore'
import type { SubscriptionTier } from '@/lib/types'

// ─── Premium Modal ──────────────────────────────────────
export function PremiumModal() {
  const { premiumModalOpen, premiumModalReason, closePremiumModal, setSubscription } = useAuthStore()

  const handleSubscribe = useCallback((tier: SubscriptionTier) => {
    setSubscription(tier)
    closePremiumModal()
  }, [setSubscription, closePremiumModal])

  return (
    <AnimatePresence>
      {premiumModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={closePremiumModal}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-[520px] max-h-[90vh] overflow-auto rounded-2xl border border-white/10 bg-[#0d0d1a] shadow-2xl"
          >
            {/* Header glow */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#ff2d78]/15 via-[#a855f7]/10 to-transparent pointer-events-none" />

            {/* Close */}
            <button
              onClick={closePremiumModal}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white/70 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative p-8 pt-10">
              {/* Crown icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff2d78] to-[#a855f7] flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#ff2d78]/25"
              >
                <Crown className="w-8 h-8 text-white" />
              </motion.div>

              <h2
                className="text-2xl font-black text-center mb-2"
                style={{ fontFamily: 'Outfit' }}
              >
                Unlock Premium
              </h2>
              <p className="text-sm text-white/40 text-center mb-2 max-w-xs mx-auto">
                {premiumModalReason}
              </p>

              {/* Plans */}
              <div className="grid grid-cols-2 gap-3 mt-8">
                {/* Basic Plan */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-5 relative overflow-hidden group hover:border-[#00d4ff]/30 transition-all"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-[#00d4ff]" />
                    <span className="text-sm font-bold">Basic</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-2xl font-black">$4.99</span>
                    <span className="text-xs text-white/30">/mo</span>
                  </div>
                  <ul className="space-y-2 mb-5">
                    {[
                      'Ad-free viewing',
                      'HD streaming',
                      'Offline reading',
                      '5 manga downloads',
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-white/50">
                        <Check className="w-3 h-3 text-[#00d4ff] shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleSubscribe('basic')}
                    className="w-full h-9 text-xs font-semibold bg-[#00d4ff]/15 text-[#00d4ff] border border-[#00d4ff]/30 hover:bg-[#00d4ff]/25"
                    variant="outline"
                  >
                    Choose Basic
                  </Button>
                </motion.div>

                {/* Premium Plan */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl border border-[#ff2d78]/30 bg-gradient-to-b from-[#ff2d78]/5 to-transparent p-5 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-[#ff2d78] to-[#a855f7] text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">
                    RECOMMENDED
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="w-4 h-4 text-[#ff2d78]" />
                    <span className="text-sm font-bold">Premium</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-2xl font-black">$9.99</span>
                    <span className="text-xs text-white/30">/mo</span>
                  </div>
                  <ul className="space-y-2 mb-5">
                    {[
                      'Everything in Basic',
                      '4K streaming',
                      'Unlimited downloads',
                      'Early access chapters',
                      'Creator tools PRO',
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-white/50">
                        <Check className="w-3 h-3 text-[#ff2d78] shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleSubscribe('premium')}
                    className="w-full h-9 text-xs font-semibold bg-gradient-to-r from-[#ff2d78] to-[#a855f7] hover:opacity-90 border-0"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    Go Premium
                  </Button>
                </motion.div>
              </div>

              {/* Trust signals */}
              <div className="flex items-center justify-center gap-6 mt-6 text-[10px] text-white/25">
                <span className="flex items-center gap-1"><Shield className="w-3 h-3" />Cancel anytime</span>
                <span className="flex items-center gap-1"><Star className="w-3 h-3" />7-day free trial</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Subscription Guard HOC ─────────────────────────────
// Wraps any component to gate premium-only content.
// If user is not subscribed, renders a blurred overlay with CTA.
export function withSubscriptionGuard<P extends object>(
  WrappedComponent: ComponentType<P>,
  options?: {
    requiredTier?: SubscriptionTier
    blurContent?: boolean
    reason?: string
  }
) {
  const {
    requiredTier = 'basic',
    blurContent = true,
    reason = 'Unlock this content with a Premium subscription.',
  } = options || {}

  return function GuardedComponent(props: P) {
    const { user, openPremiumModal } = useAuthStore()

    const tierLevel: Record<SubscriptionTier, number> = {
      free: 0,
      basic: 1,
      premium: 2,
    }

    const userLevel = tierLevel[user?.subscription ?? 'free']
    const requiredLevel = tierLevel[requiredTier]
    const hasAccess = userLevel >= requiredLevel

    if (hasAccess) {
      return <WrappedComponent {...props} />
    }

    return (
      <div className="relative">
        {/* Blurred or hidden content */}
        <div className={blurContent ? 'blur-md pointer-events-none select-none' : 'hidden'}>
          <WrappedComponent {...props} />
        </div>

        {/* Premium overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0f]/80 backdrop-blur-sm rounded-xl"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="text-center max-w-xs"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff2d78]/20 to-[#a855f7]/20 border border-[#ff2d78]/30 flex items-center justify-center mx-auto mb-4">
              <Crown className="w-7 h-7 text-[#ff2d78]" />
            </div>
            <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'Outfit' }}>
              Premium Content
            </h3>
            <p className="text-xs text-white/40 mb-4">{reason}</p>
            <Button
              onClick={() => openPremiumModal(reason)}
              className="h-9 px-5 text-xs font-semibold bg-gradient-to-r from-[#ff2d78] to-[#a855f7] hover:opacity-90 border-0 gap-1.5"
            >
              <Crown className="w-3.5 h-3.5" />
              Unlock Premium
            </Button>
          </motion.div>
        </motion.div>
      </div>
    )
  }
}

// ─── Inline Subscription Guard ──────────────────────────
// Declarative component alternative to the HOC
export function SubscriptionGuard({
  children,
  requiredTier = 'basic',
  blurContent = true,
  reason = 'Unlock this content with a Premium subscription.',
  fallback,
}: {
  children: ReactNode
  requiredTier?: SubscriptionTier
  blurContent?: boolean
  reason?: string
  fallback?: ReactNode
}) {
  const { user, openPremiumModal } = useAuthStore()

  const tierLevel: Record<SubscriptionTier, number> = {
    free: 0,
    basic: 1,
    premium: 2,
  }

  const userLevel = tierLevel[user?.subscription ?? 'free']
  const requiredLevel = tierLevel[requiredTier]
  const hasAccess = userLevel >= requiredLevel

  if (hasAccess) {
    return <>{children}</>
  }

  if (fallback) return <>{fallback}</>

  return (
    <div className="relative">
      <div className={blurContent ? 'blur-md pointer-events-none select-none' : 'hidden'}>
        {children}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0f]/80 backdrop-blur-sm rounded-xl"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20 }}
          className="text-center max-w-xs"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff2d78]/20 to-[#a855f7]/20 border border-[#ff2d78]/30 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-7 h-7 text-[#ff2d78]" />
          </div>
          <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'Outfit' }}>
            Premium Content
          </h3>
          <p className="text-xs text-white/40 mb-4">{reason}</p>
          <Button
            onClick={() => openPremiumModal(reason)}
            className="h-9 px-5 text-xs font-semibold bg-gradient-to-r from-[#ff2d78] to-[#a855f7] hover:opacity-90 border-0 gap-1.5"
          >
            <Crown className="w-3.5 h-3.5" />
            Unlock Premium
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
