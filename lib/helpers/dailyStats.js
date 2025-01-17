export const dayMapping = {
  'Mon': 'Monday',
  'Tue': 'Tuesday',
  'Wed': 'Wednesday',
  'Thu': 'Thursday',
  'Fri': 'Friday',
  'Sat': 'Saturday',
  'Sun': 'Sunday',
  'all': 'all'
}

export const formatDayDisplay = (day) => {
  const reverseMapping = {
    'Monday': 'Mon',
    'Tuesday': 'Tue',
    'Wednesday': 'Wed',
    'Thursday': 'Thu',
    'Friday': 'Fri',
    'Saturday': 'Sat',
    'Sunday': 'Sun'
  }
  return reverseMapping[day] || day
}

export const getFullDayName = (shortDay) => {
  return dayMapping[shortDay] || shortDay
}

export const calculateDailyAverage = (dailyStats, selectedDay) => {
  if (!dailyStats) return '0'
  
  if (selectedDay === 'all') {
    const totalAverage = dailyStats.reduce((sum, stat) => sum + stat.averageOrders, 0) / dailyStats.length
    return totalAverage.toFixed(1)
  }
  
  const dayStats = dailyStats.find(stat => stat.day === getFullDayName(selectedDay))
  return dayStats ? dayStats.averageOrders.toString() : '0'
}

export const calculateTotalCount = (timeData, selectedDay) => {
  if (!timeData?.timeStats || timeData.timeStats.length === 0) return '0'
  
  const dayStats = timeData.timeStats
  if (!dayStats || dayStats.length === 0) return '0'
  
  return dayStats.reduce((sum, stat) => sum + (stat.tripCount || 0), 0).toString()
}

export const formatBestTimeValue = (bestTime) => {
  if (!bestTime) return 'Loading...'
  return bestTime.hour === 'No data' ? 'No data' : `${bestTime.hour} (${bestTime.averageOrders}/hr)`
}

export const getBestTimeSubtitle = (selectedDay, busiestDay) => {
  if (selectedDay === 'all' && busiestDay) {
    return `Peak time (${formatDayDisplay(busiestDay.day)}s avg: ${busiestDay.averageOrders}/day)`
  }
  return selectedDay === 'all' ? 'Overall peak' : `Peak on ${getFullDayName(selectedDay)}s`
}

export const formatAcceptanceRate = (acceptanceRate) => {
  if (acceptanceRate === null) return '0%'
  return `${acceptanceRate}%`
}

export const getAcceptanceRateSubtitle = (selectedDay) => {
  return selectedDay === 'all' ? 'Overall average' : `${getFullDayName(selectedDay)}s only`
} 