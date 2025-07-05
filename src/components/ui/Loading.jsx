import React from 'react'

const Loading = ({ type = 'cards' }) => {
  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glass-effect rounded-3xl p-6 animate-pulse">
            <div className="shimmer-bg h-48 w-full rounded-2xl mb-4"></div>
            <div className="shimmer-bg h-6 w-3/4 rounded-full mb-2"></div>
            <div className="shimmer-bg h-4 w-1/2 rounded-full"></div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'dashboard') {
    return (
      <div className="p-6 space-y-6">
        <div className="glass-effect rounded-3xl p-6 animate-pulse">
          <div className="shimmer-bg h-8 w-1/3 rounded-full mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="shimmer-bg h-16 w-16 rounded-full mx-auto"></div>
                <div className="shimmer-bg h-4 w-full rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="glass-effect rounded-3xl p-6 animate-pulse">
              <div className="shimmer-bg h-6 w-1/2 rounded-full mb-4"></div>
              <div className="shimmer-bg h-32 w-full rounded-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
    </div>
  )
}

export default Loading