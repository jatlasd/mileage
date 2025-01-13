import StatCard from '../StatCard'
import ChartCard from '../ChartCard'

const DailyView = ({ selectedDay }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Daily Average"
          value="0"
          subtitle={selectedDay === 'all' ? 'All days' : `${selectedDay}s only`}
        />
        <StatCard
          title="Best Time"
          value="6 PM"
          subtitle={selectedDay === 'all' ? 'Overall peak' : `Peak on ${selectedDay}s`}
        />
        <StatCard
          title="Acceptance Rate"
          value="0%"
          subtitle="Daily average"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Weekly Pattern"
          subtitle="Orders by day"
          height={300}
        >
          Weekly distribution chart
        </ChartCard>

        <ChartCard
          title="Day Performance"
          subtitle="vs Previous Week"
          height={300}
        >
          Day-by-day comparison
        </ChartCard>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ChartCard title="Current Hour Stats" height={180}>
            Current hour stats
          </ChartCard>
          <ChartCard title="Peak Hours" height={180}>
            Peak hours distribution
          </ChartCard>
          <ChartCard title="Acceptance Rates" height={180}>
            Hourly acceptance rates
          </ChartCard>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="24-Hour Pattern"
            subtitle={selectedDay === 'all' ? 'Average' : selectedDay}
            height={300}
          >
            24-hour distribution chart
          </ChartCard>
          <ChartCard
            title="Hourly Type Split"
            subtitle="By hour of day"
            height={300}
          >
            Order types by hour
          </ChartCard>
        </div>
      </div>
    </div>
  )
}

export default DailyView 