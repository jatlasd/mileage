import ChartCard from '../ChartCard'

const ZoneView = ({ selectedDay }) => {
  return (
    <div className="mt-8">
      <ChartCard
        title="Zone Details"
        subtitle={selectedDay === 'all' ? 'All Days' : selectedDay}
        height={300}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <div className="flex items-center justify-center bg-surface/50 rounded-lg border border-white/[0.05] h-full">
            Zone performance by hour
          </div>
          <div className="flex items-center justify-center bg-surface/50 rounded-lg border border-white/[0.05] h-full">
            Zone type distribution
          </div>
        </div>
      </ChartCard>
    </div>
  )
}

export default ZoneView 