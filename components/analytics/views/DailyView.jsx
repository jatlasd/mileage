import { useState, useEffect } from 'react'
import StatCard from '../StatCard'
import ChartCard from '../ChartCard'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const DailyView = ({ selectedDay }) => {
  const [dailyStats, setDailyStats] = useState(null)
  const [bestTime, setBestTime] = useState(null)
  const [busiestDay, setBusiestDay] = useState(null)
  const [acceptanceRate, setAcceptanceRate] = useState(null)

  const dayMapping = {
    'Mon': 'Monday',
    'Tue': 'Tuesday',
    'Wed': 'Wednesday',
    'Thu': 'Thursday',
    'Fri': 'Friday',
    'Sat': 'Saturday',
    'Sun': 'Sunday',
    'all': 'all'
  }

  const formatDayDisplay = (day) => {
    // Convert full names back to abbreviated for display
    const reverseMapping = Object.entries(dayMapping).reduce((acc, [short, full]) => {
      acc[full] = short
      return acc
    }, {})
    return reverseMapping[day] || day
  }

  useEffect(() => {
    const fetchDailyStats = async () => {
      try {
        const response = await fetch(`/api/analytics/daily?day=${selectedDay}`)
        const data = await response.json()
        setDailyStats(data.dailyStats)
        setBestTime(data.bestTime)
        setBusiestDay(data.busiestDay)
        setAcceptanceRate(data.acceptanceRate)
      } catch (error) {
        console.error('Failed to fetch daily stats:', error)
      }
    }

    fetchDailyStats()
  }, [selectedDay])

  const getDailyAverage = () => {
    if (!dailyStats) return '0'
    
    if (selectedDay === 'all') {
      const totalAverage = dailyStats.reduce((sum, stat) => sum + stat.averageOrders, 0) / dailyStats.length
      return totalAverage.toFixed(1)
    }
    
    const dayStats = dailyStats.find(stat => stat.day === dayMapping[selectedDay])
    return dayStats ? dayStats.averageOrders.toString() : '0'
  }

  const getBestTimeValue = () => {
    if (!bestTime) return 'Loading...'
    return bestTime.hour === 'No data' ? 'No data' : `${bestTime.hour} (${bestTime.averageOrders}/hr)`
  }

  const getBestTimeSubtitle = () => {
    if (selectedDay === 'all' && busiestDay) {
      return `Peak time (${formatDayDisplay(busiestDay.day)}s avg: ${busiestDay.averageOrders}/day)`
    }
    return selectedDay === 'all' ? 'Overall peak' : `Peak on ${dayMapping[selectedDay]}s`
  }

  const getAcceptanceRateValue = () => {
    if (acceptanceRate === null) return '0%'
    return `${acceptanceRate}%`
  }

  const getAcceptanceRateSubtitle = () => {
    return selectedDay === 'all' ? 'Overall average' : `${dayMapping[selectedDay]}s only`
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <StatCard
                  title="Daily Average"
                  value={getDailyAverage()}
                  subtitle={selectedDay === 'all' ? 'All days' : `${dayMapping[selectedDay]}s only`}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px] p-4">
              <p>The average number of orders you get per day. When viewing 'All Days', this shows your overall average. When a specific day is selected, it shows that day's typical performance.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <StatCard
                  title="Best Time"
                  value={getBestTimeValue()}
                  subtitle={getBestTimeSubtitle()}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px] p-4">
              <p>The busiest hour of the day for orders. When viewing 'All Days', it also shows which day of the week is typically busiest. This helps you plan the best times to schedule yourself.</p>
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
              <p>The percentage of orders you accept. A higher rate on certain days might mean better quality orders, while a lower rate might indicate more low-value orders to skip.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
            subtitle={selectedDay === 'all' ? 'Average' : dayMapping[selectedDay]}
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