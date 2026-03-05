"use client"

import ValidationWarnings from '../ValidationWarnings'

const ValidationTab = ({ validation, year, isLoading }) => {
  if (isLoading) {
    return <div className="text-text/60">Loading validation...</div>
  }

  const formatNumber = (num) => {
    return num ? num.toLocaleString() : '0'
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="bg-gradient-to-br from-background/80 to-background/40 border border-border rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
          <span>🔍</span>
          Data Quality Summary
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-background/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-primary">{formatNumber(validation.stats.totalTrips)}</div>
            <div className="text-sm text-text/60 mt-1">Total Trips</div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">{formatNumber(validation.stats.validTrips)}</div>
            <div className="text-sm text-text/60 mt-1">Valid Trips</div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-400">{formatNumber(validation.stats.suspiciousTrips)}</div>
            <div className="text-sm text-text/60 mt-1">Suspicious Trips</div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-400">{formatNumber(validation.stats.tripsWithoutMileage)}</div>
            <div className="text-sm text-text/60 mt-1">Missing Data</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-background/20 rounded-lg">
          <div className="text-sm text-text/70">
            <p className="mb-2">
              <span className="font-semibold">Total Issues Found:</span> {validation.warnings.length}
            </p>
            <p className="text-text/50">
              Trips with mileage over 500 miles are flagged as suspicious and may indicate data entry errors.
              Review these trips in your mileage log to ensure accuracy for tax reporting.
            </p>
          </div>
        </div>
      </div>

      {/* Warnings List */}
      <div className="bg-gradient-to-br from-background/80 to-background/40 border border-border rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
          <span>⚠️</span>
          Data Quality Warnings
        </h2>

        <ValidationWarnings warnings={validation.warnings} />
      </div>
    </div>
  )
}

export default ValidationTab
