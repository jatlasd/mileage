import { useState, useEffect } from 'react'
import StatCard from '../StatCard'
import ChartCard from '../ChartCard'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const HourlyView = () => {
  const [hourlyStats, setHourlyStats] = useState(null)

  useEffect(() => {
    const fetchHourlyStats = async () => {
      try {
        const response = await fetch('/api/analytics/hourly')
        const data = await response.json()
        setHourlyStats(data)
      } catch (error) {
        console.error('Failed to fetch hourly stats:', error)
      }
    }

    fetchHourlyStats()
  }, [])

  const getSelectedHourValue = () => {
    if (!hourlyStats?.selectedHour) return '0/hr'
    const { average, trend } = hourlyStats.selectedHour
    const trendIndicator = trend > 0 ? '↑' : trend < 0 ? '↓' : '→'
    return `${average}/hr ${trendIndicator}`
  }

  const getSelectedHourSubtitle = () => {
    if (!hourlyStats?.selectedHour) return 'Loading...'
    const { timeBlock, trend, daysRecorded } = hourlyStats.selectedHour
    const trendText = trend > 0 ? `+${trend}%` : trend < 0 ? `${trend}%` : 'No change'
    return `${timeBlock} (${trendText} vs historical) • ${daysRecorded} days of data`
  }

  const getPeakTimeValue = () => {
    if (!hourlyStats?.peakHour) return 'No data'
    const { timeBlock, average } = hourlyStats.peakHour
    return `${timeBlock} (${average}/hr)`
  }

  const getPeakTimeSubtitle = () => {
    if (!hourlyStats?.peakHour) return 'No data'
    const { acceptanceRate, daysRecorded } = hourlyStats.peakHour
    return `${acceptanceRate}% acceptance • ${daysRecorded} days of data`
  }

  const getAcceptanceRateValue = () => {
    if (!hourlyStats?.acceptanceRate) return '0%'
    const { average } = hourlyStats.acceptanceRate
    return `${average}%`
  }

  const getAcceptanceRateSubtitle = () => {
    if (!hourlyStats?.acceptanceRate) return 'Loading...'
    const { timeBlock, peak } = hourlyStats.acceptanceRate
    return `${timeBlock} average • Peak: ${peak}%`
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <StatCard
                  title="Selected Hour"
                  value={getSelectedHourValue()}
                  subtitle={getSelectedHourSubtitle()}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px] p-4">
              <p>This is how many orders you typically get during this hour. The arrow tells you if it's been busier or slower lately (past 2 weeks) compared to usual.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <StatCard
                  title="Peak Time"
                  value={getPeakTimeValue()}
                  subtitle={getPeakTimeSubtitle()}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px] p-4">
              <p>Your golden hour! This is when you usually get the most orders. The acceptance rate here can help you decide if it's worth scheduling yourself for this time slot.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <StatCard
                  title="Acceptance Rate"
                  value={getAcceptanceRateValue()}
                  subtitle={getAcceptanceRateSubtitle()}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px] p-4">
              <p>How often you accept orders during this hour. A higher rate usually means better quality orders. Compare it with the peak rate to see if this is a good time slot for you.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="24-Hour Pattern"
          subtitle="Average orders by hour"
          height={300}
        >
          24-hour distribution chart
        </ChartCard>
        <ChartCard
          title="Acceptance Rate Trend"
          subtitle="By hour"
          height={300}
        >
          Acceptance rate trend
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Type Distribution"
          subtitle="By hour"
          height={300}
        >
          Type distribution chart
        </ChartCard>
        <ChartCard
          title="Busiest Hours"
          subtitle="Heatmap"
          height={300}
        >
          Busiest hours heatmap
        </ChartCard>
      </div>
    </div>
  )
}

export default HourlyView 