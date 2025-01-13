import StatCard from '../StatCard'
import ChartCard from '../ChartCard'

const HourlyView = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Busiest Hour Ever"
          value="Tue 6PM"
          subtitle="32 orders"
        />
        <StatCard
          title="Best Acceptance"
          value="Wed 2PM"
          subtitle="95% acceptance"
        />
        <StatCard
          title="Peak Window"
          value="5-7 PM"
          subtitle="Consistently busiest"
        />
        <StatCard
          title="Current Hour"
          value="0"
          subtitle="Orders this hour"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Hourly Heatmap"
          subtitle="All days"
          height={300}
        >
          Hour vs Day heatmap
        </ChartCard>

        <ChartCard
          title="Best Hours"
          subtitle="By volume"
          height={300}
        >
          Top performing hours
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Type Distribution"
          subtitle="By hour"
          height={300}
        >
          Order types per hour
        </ChartCard>

        <ChartCard
          title="Acceptance Patterns"
          subtitle="By hour"
          height={300}
        >
          Hourly acceptance rates
        </ChartCard>
      </div>
    </div>
  )
}

export default HourlyView 