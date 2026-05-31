import MetricRow from './MetricRow'

const PeriodDetailPanel = ({ title, comparison }) => {
  if (!comparison) return null

  const { current, prior, delta, labels } = comparison

  return (
    <div className="bg-gradient-to-br from-background/80 to-background/40 border border-border rounded-xl p-4 md:p-6 shadow-xl">
      <h3 className="text-lg font-bold text-text mb-1">{title}</h3>
      <p className="text-xs text-text/50 mb-4">
        {labels?.current} vs {labels?.prior}
      </p>

      <div className="flex justify-end gap-4 text-[10px] uppercase tracking-wide text-text/40 mb-2 pr-0">
        <span className="w-16 text-right">Current</span>
        <span className="w-16 text-right">Prior</span>
        <span className="w-20 text-right">Change</span>
      </div>

      <MetricRow label="Miles" current={current.miles} prior={prior.miles} delta={delta.miles} />
      <MetricRow label="Trips" current={current.tripCount} prior={prior.tripCount} delta={delta.tripCount} />
      <MetricRow label="Days worked" current={current.daysWorked} prior={prior.daysWorked} delta={delta.daysWorked} />
      <MetricRow label="Orders" current={current.totalOrders} prior={prior.totalOrders} delta={delta.totalOrders} />
      <MetricRow
        label="Acceptance rate"
        current={current.acceptanceRate}
        prior={prior.acceptanceRate}
        delta={delta.acceptanceRate}
        format={(v) => `${v}%`}
      />
      <MetricRow
        label="Avg miles/day"
        current={current.avgMilesPerDay}
        prior={prior.avgMilesPerDay}
        delta={delta.avgMilesPerDay}
      />
      <MetricRow
        label="Avg orders/day"
        current={current.avgOrdersPerDay}
        prior={prior.avgOrdersPerDay}
        delta={delta.avgOrdersPerDay}
      />
    </div>
  )
}

export default PeriodDetailPanel
