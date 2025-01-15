import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  orders: {
    label: "Orders",
    color: "hsl(var(--chart-1))"
  }
}

export function WeeklyPatternChart({ data }) {
  const chartData = [
    { day: "Monday", orders: data?.Mon?.averageOrders || data?.Mon || 0 },
    { day: "Tuesday", orders: data?.Tue?.averageOrders || data?.Tue || 0 },
    { day: "Wednesday", orders: data?.Wed?.averageOrders || data?.Wed || 0 },
    { day: "Thursday", orders: data?.Thu?.averageOrders || data?.Thu || 0 },
    { day: "Friday", orders: data?.Fri?.averageOrders || data?.Fri || 0 },
    { day: "Saturday", orders: data?.Sat?.averageOrders || data?.Sat || 0 },
    { day: "Sunday", orders: data?.Sun?.averageOrders || data?.Sun || 0 }
  ]

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid 
          vertical={false} 
          horizontal={true}
          stroke="hsl(var(--grid-color))"
          strokeDasharray="3 3"
        />
        <XAxis 
          dataKey="day" 
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
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
          dataKey="orders"
          fill="hsl(var(--chart-1))"
          radius={[4, 4, 0, 0]}
          maxBarSize={50}
        />
      </BarChart>
    </ChartContainer>
  )
} 