import { analyticsService } from '@/lib/services/analyticsService'

export async function GET(request) {
  try {
    const data = await analyticsService.getCurrentHourAnalysis()
    return Response.json(data)
  } catch (error) {
    console.error('Hourly Analytics Error:', error)
    return Response.json({ error: 'Failed to fetch hourly analytics' }, { status: 500 })
  }
} 