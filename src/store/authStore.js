import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { auth, db } from '../services/supabase'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      profile: null,
      isLoading: false,
      isAuthenticated: false,
      subscription: null,
      socialAccounts: [],

      // Actions
      signUp: async (email, password, userData) => {
        set({ isLoading: true })
        try {
          const { data, error } = await auth.signUp(email, password, userData)
          
          if (error) throw error

          if (data.user) {
            // Create user profile in database
            const profileData = {
              user_id: data.user.id,
              email: data.user.email,
              subscription_tier: 'starter',
              ...userData
            }
            
            const { error: profileError } = await db.createUser(profileData)
            if (profileError) console.error('Profile creation error:', profileError)
          }

          set({ 
            user: data.user,
            isAuthenticated: !!data.user,
            isLoading: false 
          })

          return { success: true, user: data.user }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.message }
        }
      },

      signIn: async (email, password) => {
        set({ isLoading: true })
        try {
          const { data, error } = await auth.signIn(email, password)
          
          if (error) throw error

          // Fetch user profile
          if (data.user) {
            const { data: profile } = await db.getUser(data.user.id)
            set({ 
              user: data.user,
              profile,
              isAuthenticated: true,
              isLoading: false 
            })
          }

          return { success: true, user: data.user }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.message }
        }
      },

      signOut: async () => {
        set({ isLoading: true })
        try {
          const { error } = await auth.signOut()
          if (error) throw error

          set({ 
            user: null,
            profile: null,
            isAuthenticated: false,
            subscription: null,
            socialAccounts: [],
            isLoading: false 
          })

          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.message }
        }
      },

      updateProfile: async (updates) => {
        const { user } = get()
        if (!user) return { success: false, error: 'Not authenticated' }

        set({ isLoading: true })
        try {
          const { data, error } = await db.updateUser(user.id, updates)
          
          if (error) throw error

          set({ 
            profile: { ...get().profile, ...updates },
            isLoading: false 
          })

          return { success: true, profile: data }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.message }
        }
      },

      fetchProfile: async () => {
        const { user } = get()
        if (!user) return

        try {
          const { data, error } = await db.getUser(user.id)
          if (!error && data) {
            set({ profile: data })
          }
        } catch (error) {
          console.error('Fetch profile error:', error)
        }
      },

      fetchSocialAccounts: async () => {
        const { user } = get()
        if (!user) return

        try {
          const { data, error } = await db.getUserSocialAccounts(user.id)
          if (!error && data) {
            set({ socialAccounts: data })
          }
        } catch (error) {
          console.error('Fetch social accounts error:', error)
        }
      },

      addSocialAccount: async (accountData) => {
        const { user } = get()
        if (!user) return { success: false, error: 'Not authenticated' }

        try {
          const { data, error } = await db.createSocialAccount({
            ...accountData,
            user_id: user.id
          })
          
          if (error) throw error

          set({ 
            socialAccounts: [...get().socialAccounts, data[0]]
          })

          return { success: true, account: data[0] }
        } catch (error) {
          return { success: false, error: error.message }
        }
      },

      removeSocialAccount: async (accountId) => {
        try {
          const { error } = await db.deleteSocialAccount(accountId)
          
          if (error) throw error

          set({ 
            socialAccounts: get().socialAccounts.filter(acc => acc.id !== accountId)
          })

          return { success: true }
        } catch (error) {
          return { success: false, error: error.message }
        }
      },

      setSubscription: (subscription) => {
        set({ subscription })
      },

      // Initialize auth state
      initialize: async () => {
        set({ isLoading: true })
        try {
          const { user } = await auth.getCurrentUser()
          
          if (user) {
            const { data: profile } = await db.getUser(user.id)
            const { data: socialAccounts } = await db.getUserSocialAccounts(user.id)
            
            set({ 
              user,
              profile,
              socialAccounts: socialAccounts || [],
              isAuthenticated: true,
              isLoading: false 
            })
          } else {
            set({ isLoading: false })
          }
        } catch (error) {
          console.error('Auth initialization error:', error)
          set({ isLoading: false })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
        subscription: state.subscription
      })
    }
  )
)
