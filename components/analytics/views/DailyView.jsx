import { useState, useEffect } from 'react'
import StatCard from '../StatCard'
import ChartCard from '../ChartCard'
import { WeeklyPatternChart } from '../charts/WeeklyPatternChart'
import { DailyHourlyChart } from '../charts/DailyHourlyChart'
import { DailyTimeChart } from '../charts/DailyTimeChart'
import { DailyTypeChart } from '../charts/DailyTypeChart'
import LoadingChart from '../LoadingChart'
import StatTooltip from '../StatTooltip'
import {
  dayMapping,
  formatDayDisplay,
  getFullDayName,
  calculateDailyAverage,
  calculateTotalCount,
  formatBestTimeValue,
  getBestTimeSubtitle,
  formatAcceptanceRate,
  getAcceptanceRateSubtitle
} from '@/lib/helpers/dailyStats'
import {
  fetchMostRecentTrip,
  fetchDailyStats,
  fetchDailyHourlyBreakdown,
  fetchTimeData
} from '@/lib/api/dailyAnalytics'
import { Button } from '@/components/ui/button'
import MostRecentTrip from '../MostRecentTrip'

const DailyView = ({ selectedDay }) => {
  const [dailyStats, setDailyStats] = useState(null)
  const [bestTime, setBestTime] = useState(null)
  const [busiestDay, setBusiestDay] = useState(null)
  const [acceptanceRate, setAcceptanceRate] = useState(null)
  const [weeklyPattern, setWeeklyPattern] = useState(null)
  const [dailyHourlyData, setDailyHourlyData] = useState(null)
  const [timeData, setTimeData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [typeData, setTypeData] = useState(null)
  const [mostRecent, setMostRecent] = useState(null)

  useEffect(() => {
    setIsLoading(true)

    const loadData = async () => {
      const fullDayName = selectedDay === 'all' ? 'all' : getFullDayName(selectedDay)
      
      const [recentTrip, hourlyData, statsData, time] = await Promise.all([
        fetchMostRecentTrip(selectedDay, dayMapping),
        fetchDailyHourlyBreakdown(fullDayName),
        fetchDailyStats(selectedDay),
        fetchTimeData(fullDayName)
      ])

      setMostRecent(recentTrip)
      setDailyHourlyData(hourlyData)
      setTimeData(time)

      if (statsData) {
        setDailyStats(statsData.dailyStats)
        setBestTime(statsData.bestTime)
        setBusiestDay(statsData.busiestDay)
        setAcceptanceRate(statsData.acceptanceRate)
        setTypeData(statsData.typeStats)
        
        if (selectedDay === 'all') {
          const pattern = statsData.dailyStats.reduce((acc, stat) => {
            const shortDay = formatDayDisplay(stat.day)
            acc[shortDay] = stat
            return acc
          }, {})
          setWeeklyPattern(pattern)
        } else {
          setWeeklyPattern(statsData.weeklyPattern)
        }
      }

      setIsLoading(false)
    }

    loadData()
  }, [selectedDay])

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTooltip content="The total number of trips you've completed. When viewing 'All Days', this shows your overall total. When a specific day is selected, it shows the total trips completed on that day of the week.">
          <div>
            <StatCard
              title="Total Trips"
              value={isLoading ? "Loading..." : calculateTotalCount(timeData, selectedDay)}
              subtitle={selectedDay === 'all' ? 'All days' : `${dayMapping[selectedDay]}s only`}
            />
          </div>
        </StatTooltip>
        
        <StatTooltip content="The average number of orders you get per day. When viewing 'All Days', this shows your overall average. When a specific day is selected, it shows that day's typical performance.">
          <div>
            <StatCard
              title="Daily Average"
              value={isLoading ? "Loading..." : calculateDailyAverage(dailyStats, selectedDay)}
              subtitle={selectedDay === 'all' ? 'All days' : `${dayMapping[selectedDay]}s only`}
            />
          </div>
        </StatTooltip>

        <StatTooltip content="The busiest hour of the day for orders. When viewing 'All Days', it also shows which day of the week is typically busiest. This helps you plan the best times to schedule yourself.">
          <div>
            <StatCard
              title="Best Time"
              value={isLoading ? "Loading..." : formatBestTimeValue(bestTime)}
              subtitle={getBestTimeSubtitle(selectedDay, busiestDay)}
            />
          </div>
        </StatTooltip>

        <StatTooltip content="The percentage of orders you accept. A higher rate on certain days might mean better quality orders, while a lower rate might indicate more low-value orders to skip.">
          <div>
            <StatCard
              title="Acceptance Rate"
              value={isLoading ? "Loading..." : formatAcceptanceRate(acceptanceRate)}
              subtitle={getAcceptanceRateSubtitle(selectedDay)}
            />
          </div>
        </StatTooltip>
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
        <h1 className="text-5xl text-primary font-bold">Most Recent</h1>
        <Button className="bg-primary" onClick={()=>{mostRecent?console.log(mostRecent):console.log('notyet')}}>Click</Button>
        {isLoading?<p>loading...</p>:
        
          <MostRecentTrip trip={mostRecent}/>
        }
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title={`Average ${selectedDay === 'all' ? 'Weekly' : 'Daily'} Type Split`}
            subtitle="By hour of day"
            height={300}
          >
            {isLoading ? <LoadingChart height={300} /> : <DailyTypeChart typeStats={typeData}/>}
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