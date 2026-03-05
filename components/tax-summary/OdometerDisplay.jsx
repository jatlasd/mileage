"use client"

const OdometerDisplay = ({ startOdometer, endOdometer, odometerDifference, totalBusinessMiles }) => {
  const formatNumber = (num) => {
    return num ? num.toLocaleString() : '0'
  }

  // Calculate discrepancy
  const discrepancy = Math.abs(odometerDifference - totalBusinessMiles)
  const hasLargeDiscrepancy = discrepancy > 50

  return (
    <div className="bg-gradient-to-br from-background/80 to-background/40 border border-border rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
        <span>🔢</span>
        Odometer Range
      </h2>

      <div className="space-y-6">
        {/* Visual Odometer Display */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center">
            <div className="text-sm text-text/50 mb-2 font-semibold uppercase tracking-wide">Start</div>
            <div className="text-3xl md:text-4xl font-bold text-primary">
              {formatNumber(startOdometer)}
            </div>
            <div className="text-xs text-text/40 mt-1">miles</div>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-4xl mb-2">→</div>
            <div className="text-xs text-text/50 font-semibold">
              {formatNumber(odometerDifference)}
            </div>
            <div className="text-xs text-text/40">miles driven</div>
          </div>

          <div className="flex-1 text-center">
            <div className="text-sm text-text/50 mb-2 font-semibold uppercase tracking-wide">End</div>
            <div className="text-3xl md:text-4xl font-bold text-primary">
              {formatNumber(endOdometer)}
            </div>
            <div className="text-xs text-text/40 mt-1">miles</div>
          </div>
        </div>

        {/* Stats Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/30">
          <div className="bg-background/30 rounded-lg p-4">
            <div className="text-xs text-text/50 mb-1 uppercase tracking-wide">Odometer Difference</div>
            <div className="text-2xl font-bold text-text">{formatNumber(odometerDifference)}</div>
            <div className="text-xs text-text/40">Total miles on odometer</div>
          </div>

          <div className="bg-background/30 rounded-lg p-4">
            <div className="text-xs text-text/50 mb-1 uppercase tracking-wide">Business Miles Tracked</div>
            <div className="text-2xl font-bold text-text">{formatNumber(totalBusinessMiles)}</div>
            <div className="text-xs text-text/40">Sum of trip miles</div>
          </div>
        </div>

        {/* Discrepancy Warning */}
        {hasLargeDiscrepancy && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <div className="font-semibold text-yellow-200 mb-1">Odometer Discrepancy Detected</div>
                <div className="text-sm text-text/70">
                  The odometer difference ({formatNumber(odometerDifference)} miles)
                  differs from business miles tracked ({formatNumber(totalBusinessMiles)} miles)
                  by {formatNumber(discrepancy)} miles. This could be due to personal miles driven
                  or data entry errors.
                </div>
              </div>
            </div>
          </div>
        )}

        {!hasLargeDiscrepancy && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <div className="font-semibold text-green-200 mb-1">Odometer Data Looks Good</div>
                <div className="text-sm text-text/70">
                  Your odometer readings are consistent with tracked business miles
                  (difference of only {formatNumber(discrepancy)} miles).
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OdometerDisplay
