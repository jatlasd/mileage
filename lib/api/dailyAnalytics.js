export const fetchMostRecentTrip = async (selectedDay, dayMapping) => {
  try {
    const response = await fetch('/api/entry')
    const data = await response.json()
    if(selectedDay === "all") {
      return data[0]
    }
    return data.find(trip => trip.dayOfWeek === dayMapping[selectedDay])
  } catch (error) {
    console.error('Failed to fetch most recent trip:', error)
    return null
  }
}

export const fetchDailyStats = async (selectedDay) => {
  try {
    const response = await fetch(`/api/analytics/daily?day=${selectedDay}`)
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch daily stats:', error)
    return null
  }
}

export const fetchDailyHourlyBreakdown = async (fullDayName) => {
  try {
    const response = await fetch(`/api/analytics/daily/hourly?day=${fullDayName}`)
    const data = await response.json()
    return data.hourlyStats
  } catch (error) {
    console.error('Failed to fetch daily hourly breakdown:', error)
    return null
  }
}

export const fetchTimeData = async (fullDayName) => {
  try {
    const response = await fetch(`/api/analytics/daily/time?day=${fullDayName}`)
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch time data:', error)
    return null
  }
} 