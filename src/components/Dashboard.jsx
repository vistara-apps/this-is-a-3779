import React from 'react'
import { Plus, TrendingUp, Users, DollarSign, Eye } from 'lucide-react'
import AdCard from './AdCard'
import StatsCard from './StatsCard'

const Dashboard = ({ projects, onCreateProject }) => {
  const mockStats = [
    { title: 'Total Impressions', value: '1.2M', change: '+12%', icon: Eye, color: 'text-blue-400' },
    { title: 'Engagement Rate', value: '8.4%', change: '+2.1%', icon: TrendingUp, color: 'text-green-400' },
    { title: 'Ad Variations', value: '156', change: '+23', icon: Users, color: 'text-purple-400' },
    { title: 'Revenue Generated', value: '$12,450', change: '+18%', icon: DollarSign, color: 'text-yellow-400' },
  ]

  const recentAds = projects.flatMap(project => 
    project.adVariations || []
  ).slice(0, 6)

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back! 👋</h1>
          <p className="text-dark-muted">Here's what's happening with your ad campaigns today.</p>
        </div>
        <button
          onClick={onCreateProject}
          className="mt-4 sm:mt-0 bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Project</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {mockStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Projects */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
        {projects.length === 0 ? (
          <div className="bg-dark-surface rounded-lg p-8 text-center border border-dark-border">
            <div className="w-16 h-16 bg-dark-border rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-dark-muted" />
            </div>
            <h3 className="text-lg font-medium mb-2">No projects yet</h3>
            <p className="text-dark-muted mb-4">Create your first project to start generating AI-powered ads</p>
            <button
              onClick={onCreateProject}
              className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-dark-surface rounded-lg p-6 border border-dark-border card-hover">
                <img 
                  src={project.productImage} 
                  alt={project.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold mb-2">{project.name}</h3>
                <p className="text-dark-muted text-sm mb-4">{project.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-dark-muted">
                    {project.adVariations?.length || 0} variations
                  </span>
                  <span className="text-xs text-accent">
                    {project.createdAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Ad Variations */}
      {recentAds.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Ad Variations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {recentAds.map((ad, index) => (
              <AdCard key={index} ad={ad} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard