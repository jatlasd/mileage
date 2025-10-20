import { useState, useEffect } from 'react'

// Shared hook for fetching analytics data with loading states
export const useAnalytics = (endpoint, params = {}) => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const queryParams = new URLSearchParams(params).toString()
        const url = queryParams ? `${endpoint}?${queryParams}` : endpoint

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`)
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        console.error(`Error fetching ${endpoint}:`, err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [endpoint, JSON.stringify(params)])

  return { data, isLoading, error }
}

// Specialized hooks for different analytics views
export const useHourlyAnalytics = () => {
  return useAnalytics('/api/analytics/hourly')
}

export const useMonthlyAnalytics = () => {
  return useAnalytics('/api/analytics/monthly')
}

export const useDailyAnalytics = (selectedDay = 'all') => {
  return useAnalytics('/api/analytics/daily', { day: selectedDay })
}

export const useDailyHourlyBreakdown = (selectedDay) => {
  const { data, isLoading, error } = useAnalytics(
    '/api/analytics/daily/hourly',
    selectedDay && selectedDay !== 'all' ? { day: selectedDay } : null
  )

  return {
    hourlyStats: data?.hourlyStats,
    day: data?.day,
    isLoading,
    error
  }
}

export const useTimeAnalysis = (selectedDay = 'all') => {
  const { data, isLoading, error } = useAnalytics('/api/analytics/daily/time', { day: selectedDay })

  return {
    timeStats: data?.timeStats,
    isLoading,
    error
  }
}

// Hook that fetches all data needed for DailyView in parallel
export const useDailyViewData = (selectedDay = 'all') => {
  const [data, setData] = useState({
    dailyStats: null,
    bestTime: null,
    busiestDay: null,
    acceptanceRate: null,
    typeData: null,
    dailyHourlyData: null,
    timeData: null,
    mostRecent: null
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)

      try {
        // Convert day format for API calls
        const dayMapping = {
          'Mon': 'Monday',
          'Tue': 'Tuesday',
          'Wed': 'Wednesday',
          'Thu': 'Thursday',
          'Fri': 'Friday',
          'Sat': 'Saturday',
          'Sun': 'Sunday',
          'all': 'all'
        }
        const fullDayName = selectedDay === 'all' ? 'all' : (dayMapping[selectedDay] || selectedDay)

        // Fetch all data in parallel
        const [statsData, hourlyData, timeData, tripsData] = await Promise.all([
          fetch(`/api/analytics/daily?day=${selectedDay}`).then(r => r.json()),
          fullDayName !== 'all'
            ? fetch(`/api/analytics/daily/hourly?day=${fullDayName}`).then(r => r.json())
            : Promise.resolve({ hourlyStats: null }),
          fetch(`/api/analytics/daily/time?day=${fullDayName}`).then(r => r.json()),
          fetch('/api/entry').then(r => r.json())
        ])

        // Find most recent trip
        let mostRecent = null
        if (selectedDay === 'all') {
          mostRecent = tripsData[0]
        } else {
          mostRecent = tripsData.find(trip => trip.dayOfWeek === fullDayName)
        }

        setData({
          dailyStats: statsData.dailyStats,
          bestTime: statsData.bestTime,
          busiestDay: statsData.busiestDay,
          acceptanceRate: statsData.acceptanceRate,
          typeData: statsData.typeStats,
          dailyHourlyData: hourlyData.hourlyStats,
          timeData: timeData,
          mostRecent
        })
      } catch (error) {
        console.error('Error loading daily view data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [selectedDay])

  return { ...data, isLoading }
}
