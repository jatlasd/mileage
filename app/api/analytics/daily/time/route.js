import { analyticsService } from '@/lib/services/analyticsService'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const selectedDay = searchParams.get('day')

    if (!selectedDay) {
      return NextResponse.json({ error: 'Day parameter is required' }, { status: 400 })
    }

    const data = await analyticsService.getTimeAnalysis(selectedDay)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Time Analytics Error:', error)
    return NextResponse.json({ error: 'Failed to fetch time analytics' }, { status: 500 })
  }
} 