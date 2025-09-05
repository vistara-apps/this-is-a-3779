import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table names
export const TABLES = {
  USERS: 'users',
  PROJECTS: 'projects', 
  AD_VARIATIONS: 'ad_variations',
  SOCIAL_ACCOUNTS: 'social_accounts',
  SUBSCRIPTIONS: 'subscriptions'
}

// Auth helpers
export const auth = {
  signUp: async (email, password, userData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helpers
export const db = {
  // Users
  createUser: async (userData) => {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .insert([userData])
      .select()
    return { data, error }
  },

  getUser: async (userId) => {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('user_id', userId)
      .single()
    return { data, error }
  },

  updateUser: async (userId, updates) => {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update(updates)
      .eq('user_id', userId)
      .select()
    return { data, error }
  },

  // Projects
  createProject: async (projectData) => {
    const { data, error } = await supabase
      .from(TABLES.PROJECTS)
      .insert([projectData])
      .select()
    return { data, error }
  },

  getUserProjects: async (userId) => {
    const { data, error } = await supabase
      .from(TABLES.PROJECTS)
      .select(`
        *,
        ad_variations (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  updateProject: async (projectId, updates) => {
    const { data, error } = await supabase
      .from(TABLES.PROJECTS)
      .update(updates)
      .eq('project_id', projectId)
      .select()
    return { data, error }
  },

  deleteProject: async (projectId) => {
    const { data, error } = await supabase
      .from(TABLES.PROJECTS)
      .delete()
      .eq('project_id', projectId)
    return { data, error }
  },

  // Ad Variations
  createAdVariation: async (adData) => {
    const { data, error } = await supabase
      .from(TABLES.AD_VARIATIONS)
      .insert([adData])
      .select()
    return { data, error }
  },

  getProjectAdVariations: async (projectId) => {
    const { data, error } = await supabase
      .from(TABLES.AD_VARIATIONS)
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  updateAdVariation: async (adId, updates) => {
    const { data, error } = await supabase
      .from(TABLES.AD_VARIATIONS)
      .update(updates)
      .eq('ad_variation_id', adId)
      .select()
    return { data, error }
  },

  // Social Accounts
  createSocialAccount: async (accountData) => {
    const { data, error } = await supabase
      .from(TABLES.SOCIAL_ACCOUNTS)
      .insert([accountData])
      .select()
    return { data, error }
  },

  getUserSocialAccounts: async (userId) => {
    const { data, error } = await supabase
      .from(TABLES.SOCIAL_ACCOUNTS)
      .select('*')
      .eq('user_id', userId)
    return { data, error }
  },

  updateSocialAccount: async (accountId, updates) => {
    const { data, error } = await supabase
      .from(TABLES.SOCIAL_ACCOUNTS)
      .update(updates)
      .eq('id', accountId)
      .select()
    return { data, error }
  },

  deleteSocialAccount: async (accountId) => {
    const { data, error } = await supabase
      .from(TABLES.SOCIAL_ACCOUNTS)
      .delete()
      .eq('id', accountId)
    return { data, error }
  }
}

// File storage helpers
export const storage = {
  uploadImage: async (file, bucket = 'product-images') => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file)
    
    if (error) return { data: null, error }
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)
    
    return { data: { ...data, publicUrl }, error: null }
  },

  deleteImage: async (fileName, bucket = 'product-images') => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([fileName])
    return { data, error }
  }
}
