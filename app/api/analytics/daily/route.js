import { analyticsService } from '@/lib/services/analyticsService'

// Day mapping helper
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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    let selectedDay = searchParams.get('day')
    selectedDay = dayMapping[selectedDay] || selectedDay

    const data = await analyticsService.getDailyStats(selectedDay)
    return Response.json(data)
  } catch (error) {
    console.error('Daily Analytics Error:', error)
    return Response.json({ error: 'Failed to fetch daily analytics' }, { status: 500 })
  }
} 