import { create } from 'zustand'
import { db, storage } from '../services/supabase'
import { mockAiService } from '../services/aiService'
import { mockSocialMediaService } from '../services/socialMediaService'

export const useProjectsStore = create((set, get) => ({
  // State
  projects: [],
  currentProject: null,
  isLoading: false,
  isGenerating: false,
  error: null,

  // Actions
  fetchProjects: async (userId) => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await db.getUserProjects(userId)
      
      if (error) throw error

      set({ 
        projects: data || [],
        isLoading: false 
      })

      return { success: true, projects: data }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.message 
      })
      return { success: false, error: error.message }
    }
  },

  createProject: async (projectData, userId) => {
    set({ isLoading: true, error: null })
    try {
      // Upload product image if it's a file
      let productImageUrl = projectData.productImage
      if (projectData.productImage instanceof File) {
        const { data: uploadData, error: uploadError } = await storage.uploadImage(projectData.productImage)
        if (uploadError) throw uploadError
        productImageUrl = uploadData.publicUrl
      }

      // Create project in database
      const newProject = {
        ...projectData,
        user_id: userId,
        product_image_url: productImageUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await db.createProject(newProject)
      
      if (error) throw error

      const project = data[0]

      // Add to local state
      set({ 
        projects: [project, ...get().projects],
        currentProject: project,
        isLoading: false 
      })

      return { success: true, project }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.message 
      })
      return { success: false, error: error.message }
    }
  },

  generateAdVariations: async (projectId, productImage, productDescription, platforms, count = 3) => {
    set({ isGenerating: true, error: null })
    try {
      // Use mock AI service for now (replace with real service when API keys are available)
      const result = await mockAiService.generateAdVariations(
        productImage, 
        productDescription, 
        platforms, 
        count
      )

      if (!result.success) {
        throw new Error(result.error)
      }

      // Save ad variations to database
      const adVariationsData = result.variations.map(variation => ({
        ...variation,
        project_id: projectId,
        created_at: new Date().toISOString()
      }))

      const savedVariations = []
      for (const adData of adVariationsData) {
        const { data, error } = await db.createAdVariation(adData)
        if (!error && data) {
          savedVariations.push(data[0])
        }
      }

      // Update project with ad variations
      const updatedProjects = get().projects.map(project => 
        project.project_id === projectId 
          ? { ...project, ad_variations: savedVariations }
          : project
      )

      set({ 
        projects: updatedProjects,
        isGenerating: false 
      })

      return { success: true, variations: savedVariations }
    } catch (error) {
      set({ 
        isGenerating: false, 
        error: error.message 
      })
      return { success: false, error: error.message }
    }
  },

  updateProject: async (projectId, updates) => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await db.updateProject(projectId, {
        ...updates,
        updated_at: new Date().toISOString()
      })
      
      if (error) throw error

      const updatedProject = data[0]

      // Update local state
      const updatedProjects = get().projects.map(project => 
        project.project_id === projectId ? updatedProject : project
      )

      set({ 
        projects: updatedProjects,
        currentProject: get().currentProject?.project_id === projectId ? updatedProject : get().currentProject,
        isLoading: false 
      })

      return { success: true, project: updatedProject }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.message 
      })
      return { success: false, error: error.message }
    }
  },

  deleteProject: async (projectId) => {
    set({ isLoading: true, error: null })
    try {
      const { error } = await db.deleteProject(projectId)
      
      if (error) throw error

      // Remove from local state
      const updatedProjects = get().projects.filter(project => project.project_id !== projectId)

      set({ 
        projects: updatedProjects,
        currentProject: get().currentProject?.project_id === projectId ? null : get().currentProject,
        isLoading: false 
      })

      return { success: true }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.message 
      })
      return { success: false, error: error.message }
    }
  },

  setCurrentProject: (project) => {
    set({ currentProject: project })
  },

  postAdVariation: async (adVariation, socialAccounts, scheduledTime = null) => {
    try {
      // Use mock social media service for now
      const results = await mockSocialMediaService.postToMultiplePlatforms(
        adVariation, 
        socialAccounts, 
        scheduledTime
      )

      // Update ad variation with posting results
      const updates = {
        status: 'posted',
        posted_at: new Date().toISOString(),
        posting_results: results
      }

      const { error } = await db.updateAdVariation(adVariation.ad_variation_id, updates)
      
      if (error) throw error

      // Update local state
      const updatedProjects = get().projects.map(project => ({
        ...project,
        ad_variations: project.ad_variations?.map(ad => 
          ad.ad_variation_id === adVariation.ad_variation_id 
            ? { ...ad, ...updates }
            : ad
        )
      }))

      set({ projects: updatedProjects })

      return { success: true, results }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  updateAdVariationMetrics: async (adVariationId, metrics) => {
    try {
      const updates = {
        performance_metrics: metrics,
        updated_at: new Date().toISOString()
      }

      const { error } = await db.updateAdVariation(adVariationId, updates)
      
      if (error) throw error

      // Update local state
      const updatedProjects = get().projects.map(project => ({
        ...project,
        ad_variations: project.ad_variations?.map(ad => 
          ad.ad_variation_id === adVariationId 
            ? { ...ad, performance_metrics: metrics }
            : ad
        )
      }))

      set({ projects: updatedProjects })

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Analytics and insights
  getProjectAnalytics: async (projectId) => {
    try {
      const project = get().projects.find(p => p.project_id === projectId)
      if (!project || !project.ad_variations) {
        return { success: false, error: 'Project not found or no ad variations' }
      }

      // Calculate analytics from ad variations
      const totalImpressions = project.ad_variations.reduce((sum, ad) => 
        sum + (ad.performance_metrics?.impressions || 0), 0
      )
      
      const totalClicks = project.ad_variations.reduce((sum, ad) => 
        sum + (ad.performance_metrics?.clicks || 0), 0
      )
      
      const avgEngagement = project.ad_variations.reduce((sum, ad) => 
        sum + (ad.performance_metrics?.engagementRate || 0), 0
      ) / project.ad_variations.length

      const platformBreakdown = project.ad_variations.reduce((acc, ad) => {
        const platform = ad.platform
        if (!acc[platform]) {
          acc[platform] = { impressions: 0, clicks: 0, count: 0 }
        }
        acc[platform].impressions += ad.performance_metrics?.impressions || 0
        acc[platform].clicks += ad.performance_metrics?.clicks || 0
        acc[platform].count += 1
        return acc
      }, {})

      const analytics = {
        totalImpressions,
        totalClicks,
        avgEngagement: Math.round(avgEngagement * 10) / 10,
        clickThroughRate: totalImpressions > 0 ? (totalClicks / totalImpressions * 100) : 0,
        platformBreakdown,
        topPerforming: project.ad_variations
          .sort((a, b) => (b.performance_metrics?.engagementRate || 0) - (a.performance_metrics?.engagementRate || 0))
          .slice(0, 3)
      }

      return { success: true, analytics }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null })
  },

  // Reset store
  reset: () => {
    set({
      projects: [],
      currentProject: null,
      isLoading: false,
      isGenerating: false,
      error: null
    })
  }
}))
