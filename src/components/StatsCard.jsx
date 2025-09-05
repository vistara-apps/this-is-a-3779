import React from 'react'

const StatsCard = ({ title, value, change, icon: Icon, color }) => {
  const isPositive = change.startsWith('+')
  
  return (
    <div className="bg-dark-surface rounded-lg p-6 border border-dark-border card-hover">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-opacity-20 flex items-center justify-center ${
          color === 'text-blue-400' ? 'bg-blue-500' :
          color === 'text-green-400' ? 'bg-green-500' :
          color === 'text-purple-400' ? 'bg-purple-500' :
          'bg-yellow-500'
        }`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <span className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </span>
      </div>
      <h3 className="text-2xl font-bold mb-1">{value}</h3>
      <p className="text-dark-muted text-sm">{title}</p>
    </div>
  )
}

export default StatsCard