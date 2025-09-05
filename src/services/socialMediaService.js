import axios from 'axios'

// Social media platform configurations
const INSTAGRAM_API_BASE = 'https://graph.facebook.com/v18.0'
const TIKTOK_API_BASE = 'https://open-api.tiktok.com/v1.3'

export const socialMediaService = {
  // Instagram Business API integration
  instagram: {
    // Get user's Instagram business accounts
    getBusinessAccounts: async (accessToken) => {
      try {
        const response = await axios.get(`${INSTAGRAM_API_BASE}/me/accounts`, {
          params: {
            access_token: accessToken,
            fields: 'id,name,instagram_business_account'
          }
        })

        const businessAccounts = response.data.data
          .filter(account => account.instagram_business_account)
          .map(account => ({
            id: account.instagram_business_account.id,
            name: account.name,
            platform: 'instagram'
          }))

        return { success: true, accounts: businessAccounts }
      } catch (error) {
        console.error('Instagram API Error:', error)
        return { success: false, error: error.response?.data?.error?.message || 'Failed to fetch Instagram accounts' }
      }
    },

    // Post content to Instagram
    postContent: async (accessToken, accountId, content) => {
      try {
        const { imageUrl, caption, scheduledTime } = content

        // Step 1: Create media object
        const mediaResponse = await axios.post(`${INSTAGRAM_API_BASE}/${accountId}/media`, {
          image_url: imageUrl,
          caption: caption,
          access_token: accessToken
        })

        const mediaId = mediaResponse.data.id

        // Step 2: Publish the media (or schedule if scheduledTime is provided)
        const publishParams = {
          creation_id: mediaId,
          access_token: accessToken
        }

        if (scheduledTime) {
          publishParams.published = false
          publishParams.scheduled_publish_time = Math.floor(new Date(scheduledTime).getTime() / 1000)
        }

        const publishResponse = await axios.post(`${INSTAGRAM_API_BASE}/${accountId}/media_publish`, publishParams)

        return {
          success: true,
          postId: publishResponse.data.id,
          scheduled: !!scheduledTime
        }
      } catch (error) {
        console.error('Instagram posting error:', error)
        return {
          success: false,
          error: error.response?.data?.error?.message || 'Failed to post to Instagram'
        }
      }
    },

    // Get post insights/metrics
    getPostInsights: async (accessToken, postId) => {
      try {
        const response = await axios.get(`${INSTAGRAM_API_BASE}/${postId}/insights`, {
          params: {
            metric: 'impressions,reach,likes,comments,shares,saves',
            access_token: accessToken
          }
        })

        const insights = response.data.data.reduce((acc, metric) => {
          acc[metric.name] = metric.values[0].value
          return acc
        }, {})

        return { success: true, insights }
      } catch (error) {
        console.error('Instagram insights error:', error)
        return { success: false, error: 'Failed to fetch post insights' }
      }
    }
  },

  // TikTok Business API integration
  tiktok: {
    // Get user's TikTok business accounts
    getBusinessAccounts: async (accessToken) => {
      try {
        const response = await axios.post(`${TIKTOK_API_BASE}/business/get/`, {
          access_token: accessToken
        })

        const accounts = response.data.data.list.map(account => ({
          id: account.advertiser_id,
          name: account.advertiser_name,
          platform: 'tiktok'
        }))

        return { success: true, accounts }
      } catch (error) {
        console.error('TikTok API Error:', error)
        return { success: false, error: 'Failed to fetch TikTok accounts' }
      }
    },

    // Post content to TikTok
    postContent: async (accessToken, accountId, content) => {
      try {
        const { videoUrl, caption, scheduledTime } = content

        const postData = {
          access_token: accessToken,
          advertiser_id: accountId,
          video_url: videoUrl,
          text: caption,
          privacy_level: 'PUBLIC_TO_EVERYONE'
        }

        if (scheduledTime) {
          postData.schedule_time = Math.floor(new Date(scheduledTime).getTime() / 1000)
        }

        const response = await axios.post(`${TIKTOK_API_BASE}/post/publish/`, postData)

        return {
          success: true,
          postId: response.data.data.item_id,
          scheduled: !!scheduledTime
        }
      } catch (error) {
        console.error('TikTok posting error:', error)
        return {
          success: false,
          error: error.response?.data?.message || 'Failed to post to TikTok'
        }
      }
    },

    // Get post analytics
    getPostAnalytics: async (accessToken, accountId, postId) => {
      try {
        const response = await axios.get(`${TIKTOK_API_BASE}/business/get/`, {
          params: {
            access_token: accessToken,
            advertiser_id: accountId,
            item_id: postId,
            fields: 'play_count,like_count,comment_count,share_count'
          }
        })

        return { success: true, analytics: response.data.data }
      } catch (error) {
        console.error('TikTok analytics error:', error)
        return { success: false, error: 'Failed to fetch post analytics' }
      }
    }
  },

  // Generic posting function that handles multiple platforms
  postToMultiplePlatforms: async (adVariation, socialAccounts, scheduledTime = null) => {
    const results = []

    for (const account of socialAccounts) {
      try {
        let result

        if (account.platform === 'instagram') {
          result = await socialMediaService.instagram.postContent(
            account.accessToken,
            account.accountId,
            {
              imageUrl: adVariation.generatedImageURL,
              caption: adVariation.generatedText,
              scheduledTime
            }
          )
        } else if (account.platform === 'tiktok') {
          result = await socialMediaService.tiktok.postContent(
            account.accessToken,
            account.accountId,
            {
              videoUrl: adVariation.generatedImageURL, // For TikTok, this would be a video
              caption: adVariation.generatedText,
              scheduledTime
            }
          )
        }

        results.push({
          platform: account.platform,
          accountName: account.name,
          ...result
        })
      } catch (error) {
        results.push({
          platform: account.platform,
          accountName: account.name,
          success: false,
          error: error.message
        })
      }
    }

    return results
  },

  // OAuth URL generators for social platform connections
  getOAuthUrls: {
    instagram: (clientId, redirectUri) => {
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: 'instagram_basic,instagram_content_publish,pages_show_list',
        response_type: 'code'
      })
      return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`
    },

    tiktok: (clientId, redirectUri) => {
      const params = new URLSearchParams({
        client_key: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'user.info.basic,video.list,video.upload'
      })
      return `https://www.tiktok.com/auth/authorize/?${params.toString()}`
    }
  },

  // Exchange OAuth code for access token
  exchangeCodeForToken: async (platform, code, clientId, clientSecret, redirectUri) => {
    try {
      let tokenUrl, tokenData

      if (platform === 'instagram') {
        tokenUrl = 'https://graph.facebook.com/v18.0/oauth/access_token'
        tokenData = {
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          code: code
        }
      } else if (platform === 'tiktok') {
        tokenUrl = 'https://open-api.tiktok.com/oauth/access_token/'
        tokenData = {
          client_key: clientId,
          client_secret: clientSecret,
          code: code,
          grant_type: 'authorization_code'
        }
      }

      const response = await axios.post(tokenUrl, tokenData)
      
      return {
        success: true,
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in
      }
    } catch (error) {
      console.error('Token exchange error:', error)
      return {
        success: false,
        error: error.response?.data?.error_description || 'Failed to exchange code for token'
      }
    }
  }
}

// Mock service for development/testing
export const mockSocialMediaService = {
  instagram: {
    getBusinessAccounts: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return {
        success: true,
        accounts: [
          { id: 'ig_account_1', name: 'My Business Page', platform: 'instagram' }
        ]
      }
    },

    postContent: async (accessToken, accountId, content) => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      return {
        success: true,
        postId: `ig_post_${Date.now()}`,
        scheduled: !!content.scheduledTime
      }
    },

    getPostInsights: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return {
        success: true,
        insights: {
          impressions: Math.floor(Math.random() * 10000) + 1000,
          reach: Math.floor(Math.random() * 8000) + 800,
          likes: Math.floor(Math.random() * 500) + 50,
          comments: Math.floor(Math.random() * 100) + 10,
          shares: Math.floor(Math.random() * 50) + 5,
          saves: Math.floor(Math.random() * 200) + 20
        }
      }
    }
  },

  tiktok: {
    getBusinessAccounts: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return {
        success: true,
        accounts: [
          { id: 'tt_account_1', name: 'My TikTok Business', platform: 'tiktok' }
        ]
      }
    },

    postContent: async (accessToken, accountId, content) => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      return {
        success: true,
        postId: `tt_post_${Date.now()}`,
        scheduled: !!content.scheduledTime
      }
    },

    getPostAnalytics: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return {
        success: true,
        analytics: {
          play_count: Math.floor(Math.random() * 50000) + 5000,
          like_count: Math.floor(Math.random() * 2000) + 200,
          comment_count: Math.floor(Math.random() * 300) + 30,
          share_count: Math.floor(Math.random() * 100) + 10
        }
      }
    }
  },

  postToMultiplePlatforms: async (adVariation, socialAccounts, scheduledTime = null) => {
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    return socialAccounts.map(account => ({
      platform: account.platform,
      accountName: account.name,
      success: true,
      postId: `${account.platform}_post_${Date.now()}`,
      scheduled: !!scheduledTime
    }))
  },

  exchangeCodeForToken: async (platform, code) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      success: true,
      accessToken: `mock_access_token_${platform}_${Date.now()}`,
      refreshToken: `mock_refresh_token_${platform}_${Date.now()}`,
      expiresIn: 3600
    }
  }
}
