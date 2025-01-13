import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  total: {
    label: "Orders",
    color: "hsl(var(--primary))"
  },
  acceptanceRate: {
    label: "Acceptance Rate",
    color: "hsl(var(--secondary))"
  }
}

export function DailyHourlyChart({ data }) {
  console.log('Chart received data:', data)
  
  if (!data) {
    console.log('No data provided to chart')
    return null
  }

  const chartData = Object.entries(data).map(([timeSlot, stats]) => {
    console.log('Processing time slot:', timeSlot, stats)
    return {
      time: timeSlot,
      total: stats.total || 0,
      acceptanceRate: stats.acceptanceRate || 0,
      averageEarnings: stats.averageEarnings || 0
    }
  }).sort((a, b) => {
    const timeA = parseInt(a.time.split(' - ')[0])
    const timeB = parseInt(b.time.split(' - ')[0])
    return timeA - timeB
  })

  console.log('Processed chart data:', chartData)

  if (chartData.length === 0) {
    console.log('No chart data after processing')
    return null
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} className="stroke-muted" />
        <XAxis 
          dataKey="time" 
          tickLine={false}
          axisLine={false}
          className="text-muted-foreground"
        />
        <YAxis 
          yAxisId="left"
          tickLine={false}
          axisLine={false}
          className="text-muted-foreground"
        />
        <YAxis 
          yAxisId="right"
          orientation="right"
          tickLine={false}
          axisLine={false}
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
          className="text-muted-foreground"
        />
        <ChartTooltip content={<ChartTooltipContent />} cursor={false} animationEasing="linear" animationDuration={200}/>
        <Bar 
          dataKey="total"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
          yAxisId="left"
        />
        <Bar 
          dataKey="acceptanceRate"
          fill="hsl(var(--secondary))"
          radius={[4, 4, 0, 0]}
          yAxisId="right"
        />
      </BarChart>
    </ChartContainer>
  )
} 