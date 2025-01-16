import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  total: {
    label: "Orders",
    color: "hsl(var(--chart-1))"
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
          <CartesianGrid 
            vertical={false} 
            horizontal={true}
            stroke="hsl(var(--grid-color))"
            strokeDasharray="3 3"
          />
          <XAxis 
            dataKey="time" 
            tickLine={false}
            axisLine={false}
            className="text-muted-foreground text-xs"
            dy={8}
          />
          <YAxis 
            tickLine={false}
            axisLine={false}
            className="text-muted-foreground text-xs"
            dx={-8}
          />
          <ChartTooltip 
            content={<ChartTooltipContent />} 
            cursor={false} 
            animationEasing="ease-out" 
            animationDuration={200}
            contentStyle={{
              background: "hsl(var(--tooltip-bg))",
              border: "none",
              borderRadius: "var(--radius)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
            }}
          />
          <Bar 
            dataKey="total"
            fill="hsl(var(--chart-1))"
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
          />
                  <ChartLegend 
          verticalAlign="top" 
          height={36}
          className="text-sm"
          iconSize={8}
          iconType="circle"
        />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
} 