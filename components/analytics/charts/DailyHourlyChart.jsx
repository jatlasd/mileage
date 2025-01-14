import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  total: {
    label: "Orders",
    color: "hsl(var(--primary))"
  }
}

export function DailyHourlyChart({ data }) {
  if (!data) {
    return null
  }

  const chartData = Object.entries(data).map(([timeSlot, stats]) => ({
    time: timeSlot,
    total: stats.total || 0
  })).sort((a, b) => {
    const timeA = parseInt(a.time.split(' - ')[0])
    const timeB = parseInt(b.time.split(' - ')[0])
    return timeA - timeB
  })

  if (chartData.length === 0) {
    return null
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} className="stroke-muted" />
          <XAxis 
            dataKey="time" 
            tickLine={false}
            axisLine={false}
            className="text-muted-foreground"
          />
          <YAxis 
            tickLine={false}
            axisLine={false}
            className="text-muted-foreground"
          />
          <ChartTooltip content={<ChartTooltipContent />} cursor={false} animationEasing="linear" animationDuration={200}/>
          <Bar 
            dataKey="total"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
} 