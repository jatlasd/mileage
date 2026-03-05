import { taxSummaryService } from '@/lib/services/taxSummaryService'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year') || new Date().getFullYear().toString()

    // Validate year parameter
    const yearNum = parseInt(year)
    if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
      return Response.json(
        { error: 'Invalid year parameter' },
        { status: 400 }
      )
    }

    const [yearSummary, monthlyBreakdown, validation] = await Promise.all([
      taxSummaryService.getYearSummary(yearNum),
      taxSummaryService.getMonthlyBreakdown(yearNum),
      taxSummaryService.validateYearData(yearNum)
    ])

    // If no trips found for the year
    if (!yearSummary) {
      return Response.json({
        yearSummary: null,
        monthlyBreakdown: [],
        validation: {
          warnings: [],
          stats: {
            totalTrips: 0,
            validTrips: 0,
            suspiciousTrips: 0,
            tripsWithoutMileage: 0
          }
        }
      })
    }

    return Response.json({
      yearSummary,
      monthlyBreakdown,
      validation
    })
  } catch (error) {
    console.error('Tax Summary API Error:', error)
    return Response.json(
      { error: 'Failed to fetch tax summary data' },
      { status: 500 }
    )
  }
}
