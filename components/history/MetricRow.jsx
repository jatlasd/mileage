const MetricRow = ({ label, current, prior, delta, format = (v) => v?.toLocaleString?.() ?? v }) => {
  const arrow = delta?.direction === 'up' ? '↑' : delta?.direction === 'down' ? '↓' : '→'
  const color =
    delta?.direction === 'up'
      ? 'text-green-500'
      : delta?.direction === 'down'
        ? 'text-red-400'
        : 'text-text/50'

  return (
    <div className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
      <span className="text-sm text-text/70">{label}</span>
      <div className="flex items-center gap-4 text-sm">
        <span className="font-semibold text-primary w-16 text-right">{format(current)}</span>
        <span className="text-text/50 w-16 text-right">{format(prior)}</span>
        <span className={`w-20 text-right font-medium ${color}`}>
          {arrow} {delta?.percent > 0 ? '+' : ''}
          {delta?.percent ?? 0}%
        </span>
      </div>
    </div>
  )
}

export default MetricRow
