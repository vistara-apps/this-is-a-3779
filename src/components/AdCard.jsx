import React from 'react'
import { Instagram, Share, Copy, ExternalLink } from 'lucide-react'

const AdCard = ({ ad }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(ad.generatedText)
  }

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-4 h-4" />
      case 'tiktok':
        return <div className="w-4 h-4 bg-white rounded-sm"></div>
      default:
        return <Share className="w-4 h-4" />
    }
  }

  return (
    <div className="bg-dark-surface rounded-lg border border-dark-border card-hover overflow-hidden">
      <div className="relative">
        <img
          src={ad.generatedImageURL}
          alt="Ad variation"
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-xs flex items-center space-x-1">
          {getPlatformIcon(ad.platform)}
          <span className="capitalize">{ad.platform}</span>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-sm text-dark-text mb-4 line-clamp-3">
          {ad.generatedText}
        </p>
        
        <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
          <div className="text-center">
            <div className="font-medium">{ad.performanceMetrics?.impressions?.toLocaleString() || '0'}</div>
            <div className="text-dark-muted">Impressions</div>
          </div>
          <div className="text-center">
            <div className="font-medium">{ad.performanceMetrics?.clicks?.toLocaleString() || '0'}</div>
            <div className="text-dark-muted">Clicks</div>
          </div>
          <div className="text-center">
            <div className="font-medium">{ad.performanceMetrics?.engagementRate || '0'}%</div>
            <div className="text-dark-muted">Engagement</div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            className="flex-1 bg-dark-border hover:bg-dark-text hover:text-dark-bg text-dark-muted px-3 py-2 rounded-md text-xs flex items-center justify-center space-x-1 transition-colors"
          >
            <Copy className="w-3 h-3" />
            <span>Copy</span>
          </button>
          <button className="flex-1 bg-primary hover:bg-blue-600 text-white px-3 py-2 rounded-md text-xs flex items-center justify-center space-x-1 transition-colors">
            <ExternalLink className="w-3 h-3" />
            <span>Post</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdCard