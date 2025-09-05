import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, TrendingDown, Target, Zap } from 'lucide-react'

const Analytics = ({ projects }) => {
  const mockData = [
    { date: '2024-01-01', impressions: 12000, clicks: 840, engagement: 7.0 },
    { date: '2024-01-02', impressions: 15000, clicks: 1200, engagement: 8.0 },
    { date: '2024-01-03', impressions: 18000, clicks: 1440, engagement: 8.0 },
    { date: '2024-01-04', impressions: 14000, clicks: 980, engagement: 7.0 },
    { date: '2024-01-05', impressions: 22000, clicks: 1760, engagement: 8.0 },
    { date: '2024-01-06', impressions: 25000, clicks: 2000, engagement: 8.0 },
    { date: '2024-01-07', impressions: 28000, clicks: 2520, engagement: 9.0 },
  ]

  const platformData = [
    { name: 'Instagram', value: 60, color: '#E4405F' },
    { name: 'TikTok', value: 40, color: '#000000' },
  ]

  const topAds = [
    { id: 1, text: '🚀 Revolutionize your daily routine...', impressions: 25000, engagement: 9.2, platform: 'Instagram' },
    { id: 2, text: '⚡ GAME CHANGER ALERT! This is what...', impressions: 22000, engagement: 8.8, platform: 'TikTok' },
    { id: 3, text: 'Experience premium quality like never...', impressions: 18000, engagement: 7.5, platform: 'Instagram' },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-dark-muted">Track performance and optimize your ad campaigns</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex items-center text-green-400 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              12%
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">124K</h3>
          <p className="text-dark-muted text-sm">Total Impressions</p>
        </div>

        <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex items-center text-green-400 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              8.2%
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">9.8K</h3>
          <p className="text-dark-muted text-sm">Total Clicks</p>
        </div>

        <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex items-center text-red-400 text-sm">
              <TrendingDown className="w-4 h-4 mr-1" />
              2.1%
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">7.9%</h3>
          <p className="text-dark-muted text-sm">Avg. Engagement</p>
        </div>

        <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex items-center text-green-400 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              15%
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">$2.1K</h3>
          <p className="text-dark-muted text-sm">Revenue Generated</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Performance Trend */}
        <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
          <h2 className="text-lg font-semibold mb-4">Performance Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="impressions" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="clicks" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Platform Distribution */}
        <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
          <h2 className="text-lg font-semibold mb-4">Platform Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={platformData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {platformData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-6 mt-4">
            {platformData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-dark-muted">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Ads */}
      <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
        <h2 className="text-lg font-semibold mb-6">Top Performing Ads</h2>
        <div className="space-y-4">
          {topAds.map((ad, index) => (
            <div key={ad.id} className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="bg-primary bg-opacity-20 text-primary px-2 py-1 rounded-full text-xs">
                    #{index + 1}
                  </span>
                  <span className="bg-gray-600 text-white px-2 py-1 rounded-full text-xs">
                    {ad.platform}
                  </span>
                </div>
                <p className="text-dark-text text-sm mb-2 truncate">{ad.text}</p>
              </div>
              <div className="flex space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-medium">{ad.impressions.toLocaleString()}</div>
                  <div className="text-dark-muted">Impressions</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-green-400">{ad.engagement}%</div>
                  <div className="text-dark-muted">Engagement</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Analytics