import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  STARTER: {
    id: 'starter',
    name: 'Starter',
    price: 19,
    priceId: 'price_starter_monthly', // Stripe price ID
    features: [
      '50 ad generations per month',
      '2 connected social accounts',
      'Basic analytics',
      'Email support'
    ],
    limits: {
      adGenerations: 50,
      socialAccounts: 2,
      analytics: 'basic'
    }
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 49,
    priceId: 'price_pro_monthly', // Stripe price ID
    features: [
      '200 ad generations per month',
      '5 connected social accounts',
      'Advanced analytics',
      'Priority support',
      'Auto-posting & scheduling'
    ],
    limits: {
      adGenerations: 200,
      socialAccounts: 5,
      analytics: 'advanced'
    },
    popular: true
  },
  AGENCY: {
    id: 'agency',
    name: 'Agency',
    price: 99,
    priceId: 'price_agency_monthly', // Stripe price ID
    features: [
      'Unlimited ad generations',
      '10 connected social accounts',
      'Advanced analytics',
      'Priority support',
      'Auto-posting & scheduling',
      'Team collaboration',
      'White-label options'
    ],
    limits: {
      adGenerations: -1, // Unlimited
      socialAccounts: 10,
      analytics: 'advanced'
    }
  }
}

export const paymentService = {
  // Create a checkout session for subscription
  createCheckoutSession: async (planId, userId, successUrl, cancelUrl) => {
    try {
      const plan = SUBSCRIPTION_PLANS[planId.toUpperCase()]
      if (!plan) {
        throw new Error('Invalid plan selected')
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          userId,
          successUrl,
          cancelUrl
        })
      })

      const session = await response.json()
      
      if (!response.ok) {
        throw new Error(session.error || 'Failed to create checkout session')
      }

      const stripe = await stripePromise
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id
      })

      if (error) {
        throw new Error(error.message)
      }

      return { success: true, sessionId: session.id }
    } catch (error) {
      console.error('Checkout session error:', error)
      return { success: false, error: error.message }
    }
  },

  // Create a customer portal session for managing subscription
  createPortalSession: async (customerId, returnUrl) => {
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl
        })
      })

      const session = await response.json()
      
      if (!response.ok) {
        throw new Error(session.error || 'Failed to create portal session')
      }

      return { success: true, url: session.url }
    } catch (error) {
      console.error('Portal session error:', error)
      return { success: false, error: error.message }
    }
  },

  // Get subscription details
  getSubscription: async (subscriptionId) => {
    try {
      const response = await fetch(`/api/subscription/${subscriptionId}`)
      const subscription = await response.json()
      
      if (!response.ok) {
        throw new Error(subscription.error || 'Failed to fetch subscription')
      }

      return { success: true, subscription }
    } catch (error) {
      console.error('Get subscription error:', error)
      return { success: false, error: error.message }
    }
  },

  // Cancel subscription
  cancelSubscription: async (subscriptionId) => {
    try {
      const response = await fetch(`/api/subscription/${subscriptionId}/cancel`, {
        method: 'POST'
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to cancel subscription')
      }

      return { success: true, subscription: result.subscription }
    } catch (error) {
      console.error('Cancel subscription error:', error)
      return { success: false, error: error.message }
    }
  },

  // Update subscription plan
  updateSubscription: async (subscriptionId, newPriceId) => {
    try {
      const response = await fetch(`/api/subscription/${subscriptionId}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: newPriceId
        })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update subscription')
      }

      return { success: true, subscription: result.subscription }
    } catch (error) {
      console.error('Update subscription error:', error)
      return { success: false, error: error.message }
    }
  },

  // Get usage statistics for current billing period
  getUsageStats: async (userId) => {
    try {
      const response = await fetch(`/api/usage/${userId}`)
      const usage = await response.json()
      
      if (!response.ok) {
        throw new Error(usage.error || 'Failed to fetch usage stats')
      }

      return { success: true, usage }
    } catch (error) {
      console.error('Get usage stats error:', error)
      return { success: false, error: error.message }
    }
  },

  // Check if user has reached plan limits
  checkPlanLimits: async (userId, action) => {
    try {
      const response = await fetch(`/api/check-limits/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to check plan limits')
      }

      return { 
        success: true, 
        allowed: result.allowed,
        remaining: result.remaining,
        limit: result.limit
      }
    } catch (error) {
      console.error('Check plan limits error:', error)
      return { success: false, error: error.message }
    }
  }
}

// Mock payment service for development/testing
export const mockPaymentService = {
  createCheckoutSession: async (planId, userId, successUrl, cancelUrl) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simulate successful checkout session creation
    const sessionId = `cs_mock_${Date.now()}`
    
    // In a real app, this would redirect to Stripe
    console.log(`Mock checkout session created for plan: ${planId}`)
    console.log(`Session ID: ${sessionId}`)
    console.log(`Success URL: ${successUrl}`)
    
    return { success: true, sessionId }
  },

  createPortalSession: async (customerId, returnUrl) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return { 
      success: true, 
      url: `https://billing.stripe.com/p/session/mock_${Date.now()}`
    }
  },

  getSubscription: async (subscriptionId) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      success: true,
      subscription: {
        id: subscriptionId,
        status: 'active',
        current_period_start: Math.floor(Date.now() / 1000) - 86400 * 15, // 15 days ago
        current_period_end: Math.floor(Date.now() / 1000) + 86400 * 15, // 15 days from now
        plan: {
          id: 'pro',
          nickname: 'Pro Plan',
          amount: 4900, // $49.00 in cents
          currency: 'usd',
          interval: 'month'
        },
        customer: {
          id: 'cus_mock_customer',
          email: 'user@example.com'
        }
      }
    }
  },

  cancelSubscription: async (subscriptionId) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      success: true,
      subscription: {
        id: subscriptionId,
        status: 'canceled',
        canceled_at: Math.floor(Date.now() / 1000),
        current_period_end: Math.floor(Date.now() / 1000) + 86400 * 15
      }
    }
  },

  updateSubscription: async (subscriptionId, newPriceId) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const planName = newPriceId.includes('starter') ? 'Starter' : 
                    newPriceId.includes('pro') ? 'Pro' : 'Agency'
    
    return {
      success: true,
      subscription: {
        id: subscriptionId,
        status: 'active',
        plan: {
          id: newPriceId,
          nickname: `${planName} Plan`,
          amount: planName === 'Starter' ? 1900 : planName === 'Pro' ? 4900 : 9900,
          currency: 'usd',
          interval: 'month'
        }
      }
    }
  },

  getUsageStats: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      success: true,
      usage: {
        adGenerations: {
          used: Math.floor(Math.random() * 150) + 50,
          limit: 200,
          resetDate: new Date(Date.now() + 86400 * 15 * 1000).toISOString()
        },
        socialAccounts: {
          used: Math.floor(Math.random() * 3) + 1,
          limit: 5
        }
      }
    }
  },

  checkPlanLimits: async (userId, action) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const mockLimits = {
      adGeneration: { allowed: true, remaining: 45, limit: 200 },
      socialAccount: { allowed: true, remaining: 3, limit: 5 }
    }
    
    const result = mockLimits[action] || { allowed: true, remaining: 100, limit: 200 }
    
    return {
      success: true,
      ...result
    }
  }
}

// Utility functions
export const formatPrice = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export const getPlanByPriceId = (priceId) => {
  return Object.values(SUBSCRIPTION_PLANS).find(plan => plan.priceId === priceId)
}

export const isFeatureAvailable = (userPlan, feature) => {
  const plan = SUBSCRIPTION_PLANS[userPlan?.toUpperCase()]
  if (!plan) return false
  
  return plan.features.some(f => f.toLowerCase().includes(feature.toLowerCase()))
}
