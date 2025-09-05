import React, { useState } from 'react'
import { Upload, X, Wand2, Image as ImageIcon, Type, Palette } from 'lucide-react'
import ImageUploader from './ImageUploader'
import ProgressIndicator from './ProgressIndicator'

const ProjectCreator = ({ onProjectCreated, onCancel }) => {
  const [step, setStep] = useState(1)
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    productImage: null,
    targetPlatforms: [],
    adVariations: []
  })
  const [isGenerating, setIsGenerating] = useState(false)

  const platforms = [
    { id: 'instagram', name: 'Instagram', color: 'bg-gradient-to-br from-purple-500 to-pink-500' },
    { id: 'tiktok', name: 'TikTok', color: 'bg-gradient-to-br from-black to-gray-800' },
  ]

  const handleImageUpload = (imageUrl) => {
    setProjectData(prev => ({ ...prev, productImage: imageUrl }))
  }

  const togglePlatform = (platformId) => {
    setProjectData(prev => ({
      ...prev,
      targetPlatforms: prev.targetPlatforms.includes(platformId)
        ? prev.targetPlatforms.filter(p => p !== platformId)
        : [...prev.targetPlatforms, platformId]
    }))
  }

  const generateAdVariations = async () => {
    setIsGenerating(true)
    setStep(3)

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000))

    const variations = [
      {
        id: 1,
        prompt: 'Modern minimalist style',
        generatedText: "🚀 Revolutionize your daily routine with this game-changing product! ✨ Don't miss out on the trend everyone's talking about. #Innovation #Lifestyle",
        generatedImageURL: projectData.productImage,
        platform: 'instagram',
        status: 'generated',
        performanceMetrics: {
          impressions: 12500,
          clicks: 890,
          engagementRate: 7.1
        }
      },
      {
        id: 2,
        prompt: 'Bold and energetic style',
        generatedText: "⚡ GAME CHANGER ALERT! This is what you've been waiting for! Swipe up NOW before it's gone! 🔥 #Viral #MustHave",
        generatedImageURL: projectData.productImage,
        platform: 'tiktok',
        status: 'generated',
        performanceMetrics: {
          impressions: 8900,
          clicks: 1200,
          engagementRate: 13.5
        }
      },
      {
        id: 3,
        prompt: 'Professional and trustworthy',
        generatedText: "Experience premium quality like never before. Join thousands of satisfied customers who made the smart choice. Limited time offer!",
        generatedImageURL: projectData.productImage,
        platform: 'instagram',
        status: 'generated',
        performanceMetrics: {
          impressions: 6700,
          clicks: 456,
          engagementRate: 6.8
        }
      }
    ]

    setProjectData(prev => ({
      ...prev,
      adVariations: variations,
      createdAt: new Date().toLocaleDateString()
    }))

    setIsGenerating(false)
    setStep(4)
  }

  const handleSubmit = () => {
    onProjectCreated(projectData)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Create New Project</h1>
            <p className="text-dark-muted">Generate AI-powered ad variations from your product image</p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-dark-border rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4].map((num) => (
            <React.Fragment key={num}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                step >= num ? 'bg-primary text-white' : 'bg-dark-border text-dark-muted'
              }`}>
                {num}
              </div>
              {num < 4 && (
                <div className={`w-16 h-1 ${step > num ? 'bg-primary' : 'bg-dark-border'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-dark-surface rounded-lg p-6 sm:p-8 border border-dark-border">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Project Details</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Project Name</label>
                  <input
                    type="text"
                    value={projectData.name}
                    onChange={(e) => setProjectData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Summer Collection Launch"
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={projectData.description}
                    onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your product and target audience..."
                    rows={4}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
                <button
                  onClick={() => setStep(2)}
                  disabled={!projectData.name.trim()}
                  className="w-full sm:w-auto bg-primary hover:bg-blue-600 disabled:bg-dark-border disabled:text-dark-muted text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Upload Product Image & Select Platforms</h2>
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium mb-4">Product Image</label>
                  <ImageUploader onImageUpload={handleImageUpload} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-4">Target Platforms</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {platforms.map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => togglePlatform(platform.id)}
                        className={`p-6 rounded-lg border-2 transition-all ${
                          projectData.targetPlatforms.includes(platform.id)
                            ? 'border-primary bg-primary bg-opacity-10'
                            : 'border-dark-border hover:border-dark-muted'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-lg ${platform.color} mb-4 mx-auto`}></div>
                        <h3 className="font-medium">{platform.name}</h3>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border border-dark-border rounded-lg hover:bg-dark-border transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={generateAdVariations}
                    disabled={!projectData.productImage || projectData.targetPlatforms.length === 0}
                    className="flex-1 sm:flex-none bg-primary hover:bg-blue-600 disabled:bg-dark-border disabled:text-dark-muted text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Wand2 className="w-5 h-5" />
                    <span>Generate Ad Variations</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wand2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              <h2 className="text-xl font-semibold mb-4">Generating Ad Variations</h2>
              <p className="text-dark-muted mb-6">Our AI is creating multiple engaging ad variations for your product...</p>
              <ProgressIndicator />
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Generated Ad Variations</h2>
              <div className="space-y-6 mb-8">
                {projectData.adVariations.map((ad) => (
                  <div key={ad.id} className="bg-dark-bg rounded-lg p-6 border border-dark-border">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="lg:w-1/3">
                        <img
                          src={ad.generatedImageURL}
                          alt="Generated ad"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                      <div className="lg:w-2/3">
                        <div className="flex items-center justify-between mb-4">
                          <span className="bg-primary bg-opacity-20 text-primary px-3 py-1 rounded-full text-sm">
                            {ad.platform}
                          </span>
                          <span className="text-sm text-dark-muted">{ad.prompt}</span>
                        </div>
                        <p className="text-dark-text mb-4">{ad.generatedText}</p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-dark-muted">Impressions</span>
                            <div className="font-medium">{ad.performanceMetrics.impressions.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-dark-muted">Clicks</span>
                            <div className="font-medium">{ad.performanceMetrics.clicks.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-dark-muted">Engagement</span>
                            <div className="font-medium">{ad.performanceMetrics.engagementRate}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border border-dark-border rounded-lg hover:bg-dark-border transition-colors"
                >
                  Generate More
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 sm:flex-none bg-accent hover:bg-green-500 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Save Project
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectCreator