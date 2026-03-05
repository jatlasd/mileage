"use client"

import { Bar, ComposedChart, CartesianGrid, XAxis, YAxis, Line } from "recharts"
import { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  income: {
    label: "Income ($)",
    color: "hsl(var(--chart-3))"
  },
  miles: {
    label: "Miles",
    color: "hsl(var(--chart-1))"
  }
}

export default function IncomeVsMilesChart({ monthlyBreakdown }) {
  if (!monthlyBreakdown || monthlyBreakdown.length === 0) {
    return <div className="text-text/60">No monthly data available</div>
  }

  const chartData = monthlyBreakdown.map(month => ({
    month: month.month.slice(0, 3),
    income: Math.round(month.income),
    miles: Math.round(month.businessMiles)
  }))

  return (
    <div className="bg-gradient-to-br from-background/80 to-background/40 border border-border rounded-xl p-6 shadow-xl">
      <h3 className="text-lg font-bold text-text mb-4">Income vs Miles</h3>
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
            yAxisId="left"
            tickLine={false}
            axisLine={false}
            className="text-muted-foreground text-xs"
            dx={-8}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickLine={false}
            axisLine={false}
            className="text-muted-foreground text-xs"
            dx={8}
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
            yAxisId="left"
            dataKey="income"
            fill="hsl(var(--chart-3))"
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
          />
          <Line
            yAxisId="right"
            dataKey="miles"
            type="monotone"
            stroke="hsl(var(--chart-1))"
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
