export const SubscriptionService = {
  // Get current subscription details
  getCurrentSubscription: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const subscription = JSON.parse(localStorage.getItem('userSubscription') || '{}')
    
    // Default to basic if no subscription found
    if (!subscription.tier) {
      const defaultSubscription = {
        tier: 'basic',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days
        features: ['basic-exercises', 'progress-tracking'],
        status: 'active'
      }
      localStorage.setItem('userSubscription', JSON.stringify(defaultSubscription))
      return defaultSubscription
    }

    return subscription
  },

  // Get available subscription tiers
  getAvailableTiers: async () => {
    await new Promise(resolve => setTimeout(resolve, 150))
    return {
      basic: {
        name: 'Basic',
        price: 0,
        features: ['basic-exercises', 'progress-tracking'],
        description: 'Essential skincare exercises and progress tracking'
      },
      premium: {
        name: 'Premium',
        price: 9.99,
        features: ['basic-exercises', 'progress-tracking', 'advanced-exercises', 'personalized-plans'],
        description: 'Advanced exercises with personalized skincare plans'
      },
      pro: {
        name: 'Pro',
        price: 19.99,
        features: ['basic-exercises', 'progress-tracking', 'advanced-exercises', 'personalized-plans', 'nutrition-plans', 'priority-support'],
        description: 'Complete wellness package with nutrition and priority support'
      }
    }
  },

  // Upgrade subscription
  upgradeSubscription: async (newTier) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const tiers = await SubscriptionService.getAvailableTiers()
    const selectedTier = tiers[newTier]
    
    if (!selectedTier) {
      throw new Error('Invalid subscription tier')
    }

    const subscription = {
      tier: newTier,
      features: selectedTier.features,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year
      status: 'active',
      upgradedAt: new Date().toISOString(),
      price: selectedTier.price
    }

    localStorage.setItem('userSubscription', JSON.stringify(subscription))
    return subscription
  },

  // Check if user has access to a specific feature
  hasFeatureAccess: async (feature) => {
    const subscription = await SubscriptionService.getCurrentSubscription()
    return subscription.features.includes(feature)
  },

  // Check if subscription is active
  isSubscriptionActive: async () => {
    const subscription = await SubscriptionService.getCurrentSubscription()
    const expirationDate = new Date(subscription.expiresAt)
    const now = new Date()
    
    return subscription.status === 'active' && expirationDate > now
  },

  // Get subscription usage statistics
  getUsageStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const completedExercises = JSON.parse(localStorage.getItem('completedExercises') || '[]')
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}')
    
    return {
      exercisesCompleted: completedExercises.length,
      daysActive: Math.floor((new Date() - new Date(userProfile.joinDate || new Date())) / (1000 * 60 * 60 * 24)),
      currentStreak: 0, // Would calculate based on daily activity
      totalSessions: completedExercises.length
    }
  }
}