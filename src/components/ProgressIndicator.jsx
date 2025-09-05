import React from 'react'

const ProgressIndicator = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between text-sm text-dark-muted mb-2">
        <span>Analyzing image...</span>
        <span>85%</span>
      </div>
      <div className="w-full bg-dark-border rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
          style={{ width: '85%' }}
        ></div>
      </div>
    </div>
  )
}

export default ProgressIndicator