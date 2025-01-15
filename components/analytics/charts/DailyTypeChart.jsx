"use client"

import { Pie, PieChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  orders: {
    label: "Orders"
  },
  Food: {
    label: "Food",
    color: "hsl(var(--chart-1))"
  },
  Shop: {
    label: "Shop",
    color: "hsl(var(--chart-2))"
  }
}

export function DailyTypeChart({ typeStats }) {
  const chartData = typeStats.map(stat => ({
    type: stat.type,
    orders: stat.averageOrders,
    fill: chartConfig[stat.type]?.color
  }))

  return (

        <ChartContainer config={chartConfig} className="w-full h-[300px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent  />} cursor={false}/>
            <ChartLegend className="bg-primary"/>
            <Pie data={chartData} dataKey="orders" nameKey="type" />
          </PieChart>
        </ChartContainer>

  )
}