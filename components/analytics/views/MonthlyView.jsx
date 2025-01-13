import { useState, useEffect } from 'react'
import StatCard from '../StatCard'
import ChartCard from '../ChartCard'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const MonthlyView = () => {
  const [monthlyStats, setMonthlyStats] = useState(null)

  useEffect(() => {
    const fetchMonthlyStats = async () => {
      try {
        const response = await fetch('/api/analytics/monthly')
        const data = await response.json()
        setMonthlyStats(data)
      } catch (error) {
        console.error('Failed to fetch monthly stats:', error)
      }
    }

    fetchMonthlyStats()
  }, [])

  const getOrdersValue = () => {
    if (!monthlyStats?.currentMonth) return '0'
    return `${monthlyStats.currentMonth.ordersPerDay}/day`
  }

  const getOrdersSubtitle = () => {
    if (!monthlyStats?.currentMonth) return 'Loading...'
    const { name, daysWorked } = monthlyStats.currentMonth
    return `${name} • ${daysWorked} days worked`
  }

  const getBestTimeValue = () => {
    if (!monthlyStats?.bestDay) return 'No data'
    const { name, average } = monthlyStats.bestDay
    return `${name}s (${average}/day)`
  }

  const getBestTimeSubtitle = () => {
    if (!monthlyStats?.bestHour) return 'No data'
    const { time, average } = monthlyStats.bestHour
    return `Best hour: ${time} (${average}/hr)`
  }

  const getEfficiencyValue = () => {
    if (!monthlyStats?.currentMonth) return '0'
    return `${monthlyStats.currentMonth.milesPerOrder} mi/order`
  }

  const getEfficiencySubtitle = () => {
    if (!monthlyStats?.currentMonth) return 'Loading...'
    const { name, acceptanceRate } = monthlyStats.currentMonth
    return `${name} • ${acceptanceRate}% acceptance`
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <StatCard
                  title="Orders Per Day"
                  value={getOrdersValue()}
                  subtitle={getOrdersSubtitle()}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px] p-4">
              <p>Your daily order average for this month. This helps you track if you're hitting your target order volume and how many days you've worked so far.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <StatCard
                  title="Best Schedule"
                  value={getBestTimeValue()}
                  subtitle={getBestTimeSubtitle()}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px] p-4">
              <p>Your most profitable day and time slot combination. This is when you should try to schedule yourself if possible - these times consistently bring in the most orders.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <StatCard
                  title="Efficiency"
                  value={getEfficiencyValue()}
                  subtitle={getEfficiencySubtitle()}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px] p-4">
              <p>How many miles you drive per order on average. Combined with your acceptance rate, this helps you track if you're being selective enough with orders to keep your mileage down.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Monthly Trends"
          subtitle="Orders per day"
          height={300}
        >
          Monthly trends chart
        </ChartCard>
        <ChartCard
          title="Earnings vs Mileage"
          subtitle="By month"
          height={300}
        >
          Earnings vs mileage chart
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Days Worked"
          subtitle="By month"
          height={300}
        >
          Days worked chart
        </ChartCard>
        <ChartCard
          title="Order Types"
          subtitle="Distribution by month"
          height={300}
        >
          Order types chart
        </ChartCard>
      </div>
    </div>
  )
}

export default MonthlyView 