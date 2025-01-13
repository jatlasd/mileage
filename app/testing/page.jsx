"use client"

import React from 'react'

const Testing = () => {
  const fetchData = async () => {
    try {
      const response = await fetch('/api/analytics/daily/hourly?day=Monday')
      const data = await response.json()
      console.log('API Response:', data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return (
    <div className="p-4">
      <button 
        onClick={fetchData}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Test Hourly Analytics API
      </button>
    </div>
  )
}

export default Testing