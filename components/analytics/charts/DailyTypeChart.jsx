"use client"

import { Pie, PieChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { calculateTypePercents } from "@/lib/analyticUtils"

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

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white/95 backdrop-blur-sm border rounded-lg shadow-lg p-0.5">
        <div className="border-b border-gray-100 px-4 py-2 bg-gray-50/50 rounded-t-lg">
          <p className="font-semibold text-gray-800">{data.type}</p>
        </div>
        <div className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.fill }} />
            <span className="font-medium text-lg">{data.percentage}%</span>
            <span className="text-gray-500 text-sm">of average daily orders</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export function DailyTypeChart({ typeStats }) {
  const percentages = calculateTypePercents(typeStats)
  
  const chartData = typeStats.map(stat => ({
    type: stat.type,
    orders: stat.averageOrders,
    percentage: stat.type === "Food" ? percentages.foodPercent : percentages.shopPercent,
    fill: chartConfig[stat.type]?.color
  }))

  return (
    <ChartContainer config={chartConfig} className="w-full h-[300px]">
      <PieChart>
        <ChartTooltip content={<CustomTooltip />} cursor={false}/>
        <ChartLegend className="bg-primary"/>
        <Pie 
          data={chartData} 
          dataKey="orders" 
          nameKey="type"
          cx="50%"
          cy="50%"
          innerRadius={0}
          outerRadius={80}
        />
      </PieChart>
    </ChartContainer>
  )
}