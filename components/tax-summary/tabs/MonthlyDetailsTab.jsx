"use client"

import MonthlyBreakdownTable from '../MonthlyBreakdownTable'

const MonthlyDetailsTab = ({ monthlyBreakdown, year, isLoading }) => {
  if (isLoading) {
    return <div className="text-text/60">Loading monthly details...</div>
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-background/80 to-background/40 border border-border rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-text mb-2 flex items-center gap-2">
          <span>📅</span>
          Monthly Breakdown
        </h2>
        <p className="text-text/60 text-sm mb-4">
          Detailed month-by-month breakdown of trips, mileage, and odometer readings.
          Click column headers to sort. Click a month row to expand and see all trips.
        </p>
      </div>

      <MonthlyBreakdownTable monthlyBreakdown={monthlyBreakdown} year={year} />
    </div>
  )
}

export default MonthlyDetailsTab
