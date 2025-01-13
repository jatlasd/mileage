import StatCard from '../StatCard'
import ChartCard from '../ChartCard'

const MonthlyView = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Monthly Orders"
          value="0"
          subtitle="Total orders"
        />
        <StatCard
          title="Best Day"
          value="-"
          subtitle="Highest performing"
        />
        <StatCard
          title="Worst Day"
          value="-"
          subtitle="Lowest performing"
        />
      </div>

      <ChartCard
        title="Monthly Performance"
        height={300}
      >
        Monthly trends chart
      </ChartCard>
    </div>
  )
}

export default MonthlyView 