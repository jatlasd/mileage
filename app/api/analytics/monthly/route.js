import { analyticsService } from '@/lib/services/analyticsService'

export async function GET(request) {
  try {
    const data = await analyticsService.getMonthlyStats()
    return Response.json(data)
  } catch (error) {
    console.error('Monthly Analytics Error:', error)
    return Response.json({ error: 'Failed to fetch monthly analytics' }, { status: 500 })
  }
} 