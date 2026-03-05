"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, ComposedChart } from "recharts"
import { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  miles: {
    label: "Business Miles",
    color: "hsl(var(--chart-1))"
  },
  cumulative: {
    label: "Cumulative Miles",
    color: "hsl(var(--chart-2))"
  }
}

export default function MonthlyMilesChart({ monthlyBreakdown }) {
  if (!monthlyBreakdown || monthlyBreakdown.length === 0) {
    return <div className="text-text/60">No monthly data available</div>
  }

  // Calculate cumulative miles
  let cumulative = 0
  const chartData = monthlyBreakdown.map(month => {
    cumulative += month.businessMiles
    return {
      month: month.month.slice(0, 3),
      miles: Math.round(month.businessMiles),
      cumulative: Math.round(cumulative)
    }
  })

  return (
    <div className="bg-gradient-to-br from-background/80 to-background/40 border border-border rounded-xl p-6 shadow-xl">
      <h3 className="text-lg font-bold text-text mb-4">Monthly Business Miles</h3>
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid
            vertical={false}
            horizontal={true}
            stroke="hsl(var(--grid-color))"
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="month"
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
            dataKey="miles"
            fill="hsl(var(--chart-1))"
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
          />
          <Line
            dataKey="cumulative"
            type="monotone"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <ChartLegend
            verticalAlign="top"
            height={36}
            className="text-sm"
            iconSize={8}
            iconType="circle"
          />
        </ComposedChart>
      </ChartContainer>
    </div>
  )
}
