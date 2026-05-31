import { historyService } from '@/lib/services/historyService'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year')

    if (year) {
      const yearNum = parseInt(year)
      if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
        return Response.json({ error: 'Invalid year parameter' }, { status: 400 })
      }
    }

    const data = await historyService.getComparisonData(year || null)
    return Response.json(data)
  } catch (error) {
    console.error('History API Error:', error)
    return Response.json({ error: 'Failed to fetch history comparison data' }, { status: 500 })
  }
}
