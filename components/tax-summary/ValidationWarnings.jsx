"use client"

import Link from 'next/link'

export default function ValidationWarnings({ warnings }) {
  if (!warnings || warnings.length === 0) {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <span className="text-3xl">✅</span>
          <div>
            <h3 className="font-semibold text-green-200 text-lg mb-1">All Clear!</h3>
            <p className="text-text/70">No data quality issues detected. Your mileage data looks accurate.</p>
          </div>
        </div>
      </div>
    )
  }

  // Group warnings by severity
  const highWarnings = warnings.filter(w => w.severity === 'high')
  const mediumWarnings = warnings.filter(w => w.severity === 'medium')
  const lowWarnings = warnings.filter(w => w.severity === 'low')

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatNumber = (num) => {
    return num ? num.toLocaleString() : '0'
  }

  const WarningCard = ({ warning, severityColor, severityIcon }) => {
    return (
      <div
        className={`bg-${severityColor}-500/10 border border-${severityColor}-500/30 rounded-lg p-4 transition-all hover:scale-[1.01]`}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">{severityIcon}</span>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className={`font-semibold text-${severityColor}-200`}>{warning.message}</h4>
                {warning.date && (
                  <p className="text-text/50 text-sm mt-1">Date: {formatDate(warning.date)}</p>
                )}
              </div>
            </div>

            {warning.data && (
              <div className="mt-2 space-y-1 text-sm text-text/70">
                {warning.type === 'suspicious_trip' && (
                  <>
                    <div>Trip Miles: <span className="font-semibold">{formatNumber(warning.data.tripMiles)}</span></div>
                    <div>Start: {formatNumber(warning.data.startMileage)} → End: {formatNumber(warning.data.endMileage)}</div>
                    {warning.data.zone && <div>Zone: {warning.data.zone}</div>}
                  </>
                )}
                {warning.type === 'missing_mileage' && (
                  <>
                    <div>Start: {formatNumber(warning.data.startMileage)}</div>
                    <div>End: {formatNumber(warning.data.endMileage)}</div>
                  </>
                )}
                {warning.type === 'odometer_mismatch' && (
                  <>
                    <div>Total Business Miles: <span className="font-semibold">{formatNumber(warning.data.totalBusinessMiles)}</span></div>
                    <div>Odometer Difference: <span className="font-semibold">{formatNumber(warning.data.odometerDifference)}</span></div>
                    <div>Discrepancy: <span className="font-semibold">{formatNumber(warning.data.discrepancy)} miles</span></div>
                  </>
                )}
              </div>
            )}

            {warning.tripId && (
              <div className="mt-3 flex gap-2">
                <Link
                  href={`/mileage`}
                  className="text-sm px-3 py-1 bg-primary/20 hover:bg-primary/30 rounded-md transition-colors"
                >
                  View in Log
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* High Priority Warnings */}
      {highWarnings.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
            <span>🚨</span>
            High Priority ({highWarnings.length})
          </h3>
          {highWarnings.map((warning, index) => (
            <WarningCard
              key={`high-${index}`}
              warning={warning}
              severityColor="red"
              severityIcon="⛔"
            />
          ))}
        </div>
      )}

      {/* Medium Priority Warnings */}
      {mediumWarnings.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-yellow-400 flex items-center gap-2">
            <span>⚠️</span>
            Medium Priority ({mediumWarnings.length})
          </h3>
          {mediumWarnings.map((warning, index) => (
            <WarningCard
              key={`medium-${index}`}
              warning={warning}
              severityColor="yellow"
              severityIcon="⚠️"
            />
          ))}
        </div>
      )}

      {/* Low Priority Warnings */}
      {lowWarnings.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2">
            <span>ℹ️</span>
            Low Priority ({lowWarnings.length})
          </h3>
          {lowWarnings.map((warning, index) => (
            <WarningCard
              key={`low-${index}`}
              warning={warning}
              severityColor="blue"
              severityIcon="ℹ️"
            />
          ))}
        </div>
      )}
    </div>
  )
}
