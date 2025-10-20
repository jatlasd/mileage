import { analyticsService } from '@/lib/services/analyticsService'
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const selectedDay = searchParams.get("day")

    const data = await analyticsService.getDailyHourlyBreakdown(selectedDay)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Daily Hourly Analytics Error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch hourly analytics" },
      { status: error.message ? 400 : 500 }
    )
  }
}
