"use client"

import { useState, useEffect } from 'react'

const QuickInsights = () => {
  const [insights, setInsights] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch('/api/analytics/insights')
        const data = await response.json()
        setInsights(data.insights || [])
      } catch (error) {
        console.error('Failed to fetch insights:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInsights()
  }, [])

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/40 shadow-green-500/10'
      case 'warning':
        return 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-500/40 shadow-yellow-500/10'
      case 'info':
      default:
        return 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/40 shadow-blue-500/10'
    }
  }

  const getIconBg = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20'
      case 'warning':
        return 'bg-yellow-500/20'
      case 'info':
      default:
        return 'bg-blue-500/20'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/20 animate-pulse" />
          <h2 className="text-xl md:text-2xl font-bold text-primary">Quick Insights</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="p-4 rounded-xl border border-border bg-background/50 animate-pulse shadow-lg">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-text/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-text/10 rounded w-20"></div>
                  <div className="h-4 bg-text/10 rounded w-full"></div>
                  <div className="h-3 bg-text/10 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (insights.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💡</span>
          <h2 className="text-xl md:text-2xl font-bold text-primary">Quick Insights</h2>
        </div>
        <div className="p-8 rounded-xl border border-border bg-gradient-to-br from-background/80 to-background/50 text-center shadow-lg">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-text/60 text-sm">No insights available yet. Keep tracking your trips!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-2xl">💡</span>
        <h2 className="text-xl md:text-2xl font-bold text-primary">Quick Insights</h2>
      </div>

      {/* Mobile: Horizontal scroll, Desktop: Grid */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4 md:overflow-visible md:mx-0 md:px-0">
        <div className="flex gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 min-w-full">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`
                flex-shrink-0 w-[85vw] md:w-auto
                p-4 rounded-xl border-2
                transition-all duration-300
                hover:scale-[1.02] active:scale-[0.98]
                shadow-lg hover:shadow-xl
                ${getTypeStyles(insight.type)}
              `}
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
              }}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  flex items-center justify-center
                  w-12 h-12 rounded-xl
                  text-2xl flex-shrink-0
                  ${getIconBg(insight.type)}
                `}>
                  {insight.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xs uppercase tracking-wider mb-1 text-text/70">
                    {insight.title}
                  </h3>
                  <p className="font-bold text-base md:text-lg mb-1.5 text-text leading-tight">
                    {insight.fact}
                  </p>
                  <p className="text-xs text-text/60 leading-relaxed">
                    {insight.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator for mobile */}
      <div className="flex justify-center gap-1 md:hidden mt-2">
        {insights.map((_, index) => (
          <div key={index} className="w-1.5 h-1.5 rounded-full bg-primary/30" />
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default QuickInsights
