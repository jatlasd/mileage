const formatDelta = (delta, suffix = '') => {
  if (!delta) return '—'
  const sign = delta.percent > 0 ? '+' : ''
  const arrow = delta.direction === 'up' ? '↑' : delta.direction === 'down' ? '↓' : '→'
  return `${arrow} ${sign}${delta.percent}%${suffix}`
}

const ComparisonCard = ({ title, comparison, metric = 'miles', icon }) => {
  if (!comparison) return null

  const { current, prior, delta, labels } = comparison
  const currentVal = current?.[metric]
  const priorVal = prior?.[metric]
  const metricDelta = delta?.[metric]

  const formatValue = (val) => {
    if (metric === 'acceptanceRate') return `${val ?? 0}%`
    if (typeof val === 'number') return val.toLocaleString()
    return val ?? '0'
  }

  return (
    <div className="p-4 md:p-5 bg-gradient-to-br from-background/80 to-background/40 border border-border/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xs md:text-sm font-bold uppercase tracking-wide text-text/60 group-hover:text-text/80 transition-colors">
          {title}
        </h3>
        {icon && <span className="text-xl opacity-60">{icon}</span>}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-text/40 mb-1">{labels?.current}</p>
          <p className="text-2xl md:text-3xl font-bold text-primary leading-none">
            {formatValue(currentVal)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-text/40 mb-1">{labels?.prior}</p>
          <p className="text-2xl md:text-3xl font-bold text-text/70 leading-none">
            {formatValue(priorVal)}
          </p>
        </div>
      </div>

      <p className="text-xs md:text-sm text-text/50">
        {formatDelta(metricDelta)} vs prior period
        {metric === 'miles' && current?.daysWorked != null && (
          <span className="block mt-1">
            {current.daysWorked} days worked · {current.tripCount} trips · {current.totalOrders} orders
          </span>
        )}
      </p>
    </div>
  )
}

export default ComparisonCard
