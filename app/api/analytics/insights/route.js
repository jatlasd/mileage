import { analyticsService } from '@/lib/services/analyticsService'

export async function GET(request) {
  try {
    const insights = await analyticsService.getQuickInsights()
    return Response.json({ insights })
  } catch (error) {
    console.error('Insights Error:', error)
    return Response.json({ error: 'Failed to fetch insights' }, { status: 500 })
  }
}
