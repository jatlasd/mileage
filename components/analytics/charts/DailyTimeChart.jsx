import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  avgTripTime: {
    label: "Average Trip Time (hours)",
    color: "hsl(var(--primary))"
  },
  avgTimeOut: {
    label: "Average Time Out (hours)",
    color: "hsl(var(--accent-1))"
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric'
  })
}

const formatDay = (day) => {
  if (!day) return ""
  return day.slice(0, 3)
}

export function DailyTimeChart({ data, isAllDays }) {
  if (!data || !data.timeStats || data.timeStats.length === 0) {
    return <div className="flex items-center justify-center h-full">No data available</div>
  }

  const chartData = isAllDays 
    ? data.timeStats.map(stat => ({
        day: formatDay(stat.day || ""),
        avgTripTime: stat.avgTripTime || 0,
        avgTimeOut: stat.avgTimeOut || 0,
        tripCount: stat.tripCount || 0,
        daysWorked: stat.daysWorked || 0
      }))
    : data.timeStats.map(stat => ({
        date: stat.date || "",
        displayDate: formatDate(stat.date || ""),
        avgTripTime: stat.avgTripTime || 0,
        totalTimeOut: stat.totalTimeOut || 0,
        tripCount: stat.tripCount || 0
      }))

  // Calculate the maximum value across both metrics to set consistent scale
  const maxValue = Math.max(
    ...chartData.map(d => Math.max(
      d.avgTripTime || 0, 
      isAllDays ? (d.avgTimeOut || 0) : (d.totalTimeOut || 0)
    ))
  )
  // Round up to nearest whole number for cleaner axis
  const yAxisMax = Math.ceil(maxValue)

  return (
    <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} className="stroke-muted" />
        <XAxis 
          dataKey={isAllDays ? "day" : "displayDate"}
          tickLine={false}
          axisLine={false}
          className="text-muted-foreground"
        />
        <YAxis 
          yAxisId="left"
          tickLine={false}
          axisLine={false}
          className="text-muted-foreground"
          domain={[0, yAxisMax]}
        />
        <YAxis 
          yAxisId="right"
          orientation="right"
          tickLine={false}
          axisLine={false}
          className="text-muted-foreground"
          domain={[0, yAxisMax]}
        />
        <ChartTooltip content={<ChartTooltipContent />} cursor={false} animationEasing="linear" animationDuration={200}/>
        <Bar 
          name="Avg Trip Time"
          dataKey="avgTripTime"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
          yAxisId="left"
        />
        <Bar 
          name={isAllDays ? "Avg Time Out" : "Total Time Out"}
          dataKey={isAllDays ? "avgTimeOut" : "totalTimeOut"}
          fill="hsl(var(--accent-1))"
          radius={[4, 4, 0, 0]}
          yAxisId="right"
        />
        <Legend verticalAlign="top" height={36}/>
      </BarChart>
    </ChartContainer>
  )
} 