import axios from 'axios'

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const IMAGINE_ART_API_KEY = import.meta.env.VITE_IMAGINE_ART_API_KEY

// OpenAI API client
const openaiClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  }
})

// ImagineArt API client
const imagineArtClient = axios.create({
  baseURL: 'https://api.imagine.art/v2',
  headers: {
    'Authorization': `Bearer ${IMAGINE_ART_API_KEY}`,
    'Content-Type': 'application/json'
  }
})

export const aiService = {
  // Generate ad copy variations using OpenAI
  generateAdCopy: async (productDescription, platform, style = 'engaging') => {
    try {
      const prompt = `Create ${platform} ad copy for: ${productDescription}. 
      Style: ${style}. 
      Requirements:
      - Engaging and platform-appropriate
      - Include relevant emojis
      - Call-to-action
      - Under ${platform === 'tiktok' ? '150' : '200'} characters
      - Generate 3 variations`

      const response = await openaiClient.post('/chat/completions', {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert social media copywriter specializing in ${platform} ads. Create compelling, conversion-focused ad copy.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.8
      })

      const content = response.data.choices[0].message.content
      // Parse the response to extract individual variations
      const variations = content.split('\n').filter(line => line.trim()).slice(0, 3)
      
      return {
        success: true,
        variations: variations.map((text, index) => ({
          id: index + 1,
          text: text.replace(/^\d+\.\s*/, '').trim(),
          platform,
          style
        }))
      }
    } catch (error) {
      console.error('OpenAI API Error:', error)
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Failed to generate ad copy'
      }
    }
  },

  // Generate image variations using OpenAI DALL-E
  generateImageVariations: async (originalImageUrl, style, platform) => {
    try {
      const prompt = `Create a ${style} style product image optimized for ${platform} advertising. 
      Make it eye-catching, professional, and suitable for social media marketing.`

      const response = await openaiClient.post('/images/generations', {
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: platform === 'instagram' ? '1024x1024' : '1024x1792',
        quality: 'standard'
      })

      return {
        success: true,
        imageUrl: response.data.data[0].url,
        prompt
      }
    } catch (error) {
      console.error('DALL-E API Error:', error)
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Failed to generate image'
      }
    }
  },

  // Generate enhanced images using ImagineArt
  enhanceImage: async (imageUrl, style = 'professional') => {
    try {
      const response = await imagineArtClient.post('/image/generations', {
        prompt: `Enhance this product image with ${style} style, make it more appealing for advertising`,
        image_url: imageUrl,
        style: style,
        enhance: true,
        upscale: true
      })

      return {
        success: true,
        imageUrl: response.data.data.url,
        taskId: response.data.task_id
      }
    } catch (error) {
      console.error('ImagineArt API Error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to enhance image'
      }
    }
  },

  // Remove background using ImagineArt
  removeBackground: async (imageUrl) => {
    try {
      const response = await imagineArtClient.post('/image/background-removal', {
        image_url: imageUrl
      })

      return {
        success: true,
        imageUrl: response.data.data.url,
        taskId: response.data.task_id
      }
    } catch (error) {
      console.error('Background removal error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to remove background'
      }
    }
  },

  // Generate complete ad variations (copy + image)
  generateAdVariations: async (productImage, productDescription, platforms, count = 3) => {
    const variations = []
    const styles = ['modern', 'bold', 'professional', 'playful', 'minimalist']

    try {
      for (let i = 0; i < count; i++) {
        const style = styles[i % styles.length]
        const platform = platforms[i % platforms.length]

        // Generate ad copy
        const copyResult = await aiService.generateAdCopy(productDescription, platform, style)
        
        // Generate image variation
        const imageResult = await aiService.generateImageVariations(productImage, style, platform)

        if (copyResult.success && imageResult.success) {
          variations.push({
            id: i + 1,
            prompt: `${style} style for ${platform}`,
            generatedText: copyResult.variations[0]?.text || '',
            generatedImageURL: imageResult.imageUrl,
            platform,
            style,
            status: 'generated',
            performanceMetrics: {
              impressions: 0,
              clicks: 0,
              engagementRate: 0
            },
            createdAt: new Date().toISOString()
          })
        }
      }

      return {
        success: true,
        variations
      }
    } catch (error) {
      console.error('Error generating ad variations:', error)
      return {
        success: false,
        error: 'Failed to generate ad variations',
        variations: []
      }
    }
  },

  // Analyze ad performance and provide insights
  analyzePerformance: async (adVariations) => {
    try {
      const performanceData = adVariations.map(ad => ({
        id: ad.id,
        text: ad.generatedText,
        platform: ad.platform,
        metrics: ad.performanceMetrics
      }))

      const prompt = `Analyze these ad performance metrics and provide insights:
      ${JSON.stringify(performanceData, null, 2)}
      
      Provide:
      1. Top performing ad and why
      2. Platform-specific insights
      3. Recommendations for improvement
      4. Key success factors`

      const response = await openaiClient.post('/chat/completions', {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert digital marketing analyst. Provide actionable insights based on ad performance data.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.3
      })

      return {
        success: true,
        insights: response.data.choices[0].message.content
      }
    } catch (error) {
      console.error('Performance analysis error:', error)
      return {
        success: false,
        error: 'Failed to analyze performance'
      }
    }
  }
}

// Fallback mock service for development/testing
export const mockAiService = {
  generateAdVariations: async (productImage, productDescription, platforms, count = 3) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    const styles = ['Modern minimalist', 'Bold and energetic', 'Professional and trustworthy', 'Playful and fun', 'Elegant and sophisticated']
    const copyTemplates = {
      instagram: [
        "🚀 Revolutionize your daily routine with this game-changing product! ✨ Don't miss out on the trend everyone's talking about. #Innovation #Lifestyle",
        "✨ Premium quality meets unbeatable style! Transform your experience today. Limited time offer - swipe up now! 💫 #Quality #Style",
        "🌟 Join thousands of satisfied customers who made the smart choice. Experience the difference for yourself! #Trusted #Premium"
      ],
      tiktok: [
        "⚡ GAME CHANGER ALERT! This is what you've been waiting for! Swipe up NOW before it's gone! 🔥 #Viral #MustHave",
        "🤯 POV: You discover the product that changes everything! Don't scroll past this! #GameChanger #Trending",
        "🚨 This is your sign to upgrade your life! Trust me, you need this! #LifeHack #Trending"
      ]
    }

    const variations = []
    for (let i = 0; i < count; i++) {
      const platform = platforms[i % platforms.length]
      const style = styles[i % styles.length]
      const copyOptions = copyTemplates[platform] || copyTemplates.instagram
      
      variations.push({
        id: i + 1,
        prompt: style,
        generatedText: copyOptions[i % copyOptions.length],
        generatedImageURL: productImage,
        platform,
        style,
        status: 'generated',
        performanceMetrics: {
          impressions: Math.floor(Math.random() * 20000) + 5000,
          clicks: Math.floor(Math.random() * 1500) + 200,
          engagementRate: Math.round((Math.random() * 10 + 3) * 10) / 10
        },
        createdAt: new Date().toISOString()
      })
    }

    return {
      success: true,
      variations
    }
  },

  analyzePerformance: async (adVariations) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      success: true,
      insights: `Based on your ad performance data:

1. **Top Performer**: Your TikTok ads are showing 35% higher engagement rates compared to Instagram, particularly the bold and energetic style variations.

2. **Platform Insights**: 
   - TikTok: Short, punchy copy with trending hashtags performs best
   - Instagram: Visual-first approach with lifestyle messaging resonates well

3. **Recommendations**:
   - Increase TikTok ad spend by 25% based on superior performance
   - Test more video content for Instagram Stories
   - A/B test different call-to-action phrases

4. **Key Success Factors**:
   - Emojis increase engagement by 15%
   - Time-sensitive language ("limited time", "now") drives urgency
   - Platform-native content style is crucial for performance`
    }
  }
}
