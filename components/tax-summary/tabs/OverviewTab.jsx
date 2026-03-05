"use client"

import StatCard from '@/components/analytics/StatCard'
import OdometerDisplay from '../OdometerDisplay'
import MonthlyMilesChart from '../charts/MonthlyMilesChart'

const OverviewTab = ({ yearSummary, monthlyBreakdown, isLoading }) => {
  if (isLoading || !yearSummary) {
    return <div className="text-text/60">Loading overview...</div>
  }

  // Format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Format numbers with commas
  const formatNumber = (num) => {
    return num ? num.toLocaleString() : '0'
  }

  // Format currency
  const formatCurrency = (num) => {
    return num ? `$${num.toFixed(2).toLocaleString()}` : '$0.00'
  }

  return (
    <div className="space-y-6">
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <StatCard
          title="Total Business Miles"
          value={formatNumber(yearSummary.totalBusinessMiles)}
          subtitle={`Tracked across ${yearSummary.totalTrips} trips`}
          icon="🚗"
        />

        <StatCard
          title="Total Trips"
          value={formatNumber(yearSummary.totalTrips)}
          subtitle={`Average ${yearSummary.averageMilesPerTrip} miles per trip`}
          icon="📍"
        />

        <StatCard
          title="Avg Miles/Trip"
          value={yearSummary.averageMilesPerTrip}
          subtitle={`Based on ${yearSummary.totalTrips} completed trips`}
          icon="📊"
        />

        <StatCard
          title="First Trip"
          value={formatDate(yearSummary.firstTripDate)}
          subtitle={`Started at ${formatNumber(yearSummary.startOdometer)} miles`}
          icon="📅"
        />

        <StatCard
          title="Last Trip"
          value={formatDate(yearSummary.lastTripDate)}
          subtitle={`Ended at ${formatNumber(yearSummary.endOdometer)} miles`}
          icon="🏁"
        />

        <StatCard
          title="Odometer Change"
          value={formatNumber(yearSummary.odometerDifference)}
          subtitle="Total miles on vehicle"
          icon="⏱️"
        />
      </div>

      {/* Odometer Range Display */}
      <OdometerDisplay
        startOdometer={yearSummary.startOdometer}
        endOdometer={yearSummary.endOdometer}
        odometerDifference={yearSummary.odometerDifference}
        totalBusinessMiles={yearSummary.totalBusinessMiles}
      />

      {/* Charts Section */}
      <MonthlyMilesChart monthlyBreakdown={monthlyBreakdown} />

      {/* Tax Calculation Section */}
      <div className="bg-gradient-to-br from-background/80 to-background/40 border border-border rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
          <span>📋</span>
          Tax Deduction Estimate
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-border/30">
            <span className="text-text/70">Standard Mileage Rate (2025)</span>
            <span className="text-text font-semibold">$0.70 per mile</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border/30">
            <span className="text-text/70">Total Business Miles</span>
            <span className="text-text font-semibold">{formatNumber(yearSummary.totalBusinessMiles)}</span>
          </div>
          <div className="flex justify-between items-center py-3 bg-primary/10 rounded-lg px-4">
            <span className="text-text font-bold">Estimated Deduction</span>
            <span className="text-primary font-bold text-xl">
              {formatCurrency(yearSummary.totalBusinessMiles * 0.70)}
            </span>
          </div>
          <p className="text-xs text-text/50 mt-2">
            This is an estimate based on the IRS standard mileage rate. Consult a tax professional for accurate calculations.
          </p>
        </div>
      </div>
    </div>
  )
}

export default OverviewTab
