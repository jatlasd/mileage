import React from 'react'
import AnalyticsContainer from '@/components/analytics/AnalyticsContainer'

const Analytics = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      <AnalyticsContainer />
    </div>
  )
}

export default Analytics