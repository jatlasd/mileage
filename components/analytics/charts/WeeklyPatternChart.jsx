import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  orders: {
    label: "Orders",
    color: "hsl(var(--primary))"
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
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} className="stroke-muted" />
        <XAxis 
          dataKey="day" 
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
          className="text-muted-foreground"
        />
        <YAxis 
          tickLine={false}
          axisLine={false}
          className="text-muted-foreground"
        />
        <ChartTooltip content={<ChartTooltipContent />} cursor={false} animationEasing="linear" animationDuration={200}/>
        <Bar 
          dataKey="orders"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
} 