import React from 'react'
import { Home, Plus, BarChart3, Settings, Zap, Users, CreditCard } from 'lucide-react'

const Sidebar = ({ activeView, onViewChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'create', label: 'Create Project', icon: Plus },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <>
      {/* Mobile sidebar toggle would go here */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-dark-surface border-r border-dark-border hidden lg:block">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">AdSpark AI</span>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeView === item.id
                      ? 'bg-primary text-white'
                      : 'text-dark-muted hover:bg-dark-border hover:text-dark-text'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Subscription Status */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="glass-effect rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CreditCard className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Pro Plan</span>
            </div>
            <div className="text-xs text-dark-muted mb-3">
              142/200 generations used
            </div>
            <div className="w-full bg-dark-border rounded-full h-2">
              <div className="bg-accent h-2 rounded-full" style={{ width: '71%' }}></div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar