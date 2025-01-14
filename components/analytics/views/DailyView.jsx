import { useState, useEffect } from 'react'
import StatCard from '../StatCard'
import ChartCard from '../ChartCard'
import { WeeklyPatternChart } from '../charts/WeeklyPatternChart'
import { DailyHourlyChart } from '../charts/DailyHourlyChart'
import { DailyTimeChart } from '../charts/DailyTimeChart'
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
  const [weeklyPattern, setWeeklyPattern] = useState(null)
  const [dailyHourlyData, setDailyHourlyData] = useState(null)
  const [timeData, setTimeData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

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
    const reverseMapping = Object.entries(dayMapping).reduce((acc, [short, full]) => {
      acc[full] = short
      return acc
    }, {})
    return reverseMapping[day] || day
  }

  useEffect(() => {
    setIsLoading(true)
    const fetchDailyStats = async () => {
      try {
        const response = await fetch(`/api/analytics/daily?day=${selectedDay}`)
        const data = await response.json()
        setDailyStats(data.dailyStats)
        setBestTime(data.bestTime)
        setBusiestDay(data.busiestDay)
        setAcceptanceRate(data.acceptanceRate)
        
        if (selectedDay === 'all') {
          const pattern = data.dailyStats.reduce((acc, stat) => {
            const shortDay = formatDayDisplay(stat.day)
            acc[shortDay] = stat
            return acc
          }, {})
          setWeeklyPattern(pattern)
        } else {
          setWeeklyPattern(data.weeklyPattern)
        }
      } catch (error) {
        console.error('Failed to fetch daily stats:', error)
      }
    }

    const fetchDailyHourlyBreakdown = async () => {
      try {
        const response = await fetch(`/api/analytics/daily/hourly?day=${dayMapping[selectedDay]}`)
        const data = await response.json()
        setDailyHourlyData(data.hourlyStats)
      } catch (error) {
        console.error('Failed to fetch daily hourly breakdown:', error)
      }
    }

    const fetchTimeData = async () => {
      try {
        const response = await fetch(`/api/analytics/daily/time?day=${dayMapping[selectedDay]}`)
        const data = await response.json()
        setTimeData(data)
      } catch (error) {
        console.error('Failed to fetch time data:', error)
      }
    }

    Promise.all([fetchDailyHourlyBreakdown(), fetchDailyStats(), fetchTimeData()])
      .finally(() => setIsLoading(false))
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

  const LoadingChart = ({ height }) => (
    <div 
      className="flex items-center justify-center animate-pulse" 
      style={{ height: `${height}px` }}
    >
      <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
        <svg 
          className="animate-spin h-8 w-8 text-primary" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <StatCard
                  title="Daily Average"
                  value={isLoading ? "Loading..." : getDailyAverage()}
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
                  value={isLoading ? "Loading..." : getBestTimeValue()}
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
                  value={isLoading ? "Loading..." : getAcceptanceRateValue()}
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
          title={selectedDay === 'all' ? "Weekly Pattern" : "24-Hour Pattern"}
          subtitle={selectedDay === 'all' ? "Orders by day" : dayMapping[selectedDay]}
          height={300}
        >
          {isLoading ? (
            <LoadingChart height={300} />
          ) : selectedDay === 'all' ? (
            <WeeklyPatternChart data={weeklyPattern} />
          ) : (
            <DailyHourlyChart data={dailyHourlyData} />
          )}
        </ChartCard>

        <ChartCard
          title="Time Analysis"
          subtitle="Trip Time & Total Time Out"
          height={300}
        >
          {isLoading ? (
            <LoadingChart height={300} />
          ) : (
            <DailyTimeChart data={timeData} isAllDays={selectedDay === 'all'} />
          )}
        </ChartCard>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ChartCard title="Current Hour Stats" height={180}>
            {isLoading ? <LoadingChart height={180} /> : "Current hour stats"}
          </ChartCard>
          <ChartCard title="Peak Hours" height={180}>
            {isLoading ? <LoadingChart height={180} /> : "Peak hours distribution"}
          </ChartCard>
          <ChartCard title="Acceptance Rates" height={180}>
            {isLoading ? <LoadingChart height={180} /> : "Hourly acceptance rates"}
          </ChartCard>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Hourly Type Split"
            subtitle="By hour of day"
            height={300}
          >
            {isLoading ? <LoadingChart height={300} /> : "Order types by hour"}
          </ChartCard>
          <ChartCard
            title="Earnings Distribution"
            subtitle="By hour"
            height={300}
          >
            {isLoading ? <LoadingChart height={300} /> : "Hourly earnings"}
          </ChartCard>
        </div>
      </div>
    </div>
  )
}

export default DailyView 