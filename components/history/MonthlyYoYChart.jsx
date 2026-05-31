"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function MonthlyYoYChart({ data, currentYear, priorYear }) {
  if (!data?.length) {
    return <div className="text-text/60">No monthly comparison data</div>
  }

  const chartConfig = {
    [currentYear]: {
      label: String(currentYear),
      color: "hsl(var(--chart-1))"
    },
    [priorYear]: {
      label: String(priorYear),
      color: "hsl(var(--chart-2))"
    }
  }

  return (
    <div className="bg-gradient-to-br from-background/80 to-background/40 border border-border rounded-xl p-4 md:p-6 shadow-xl">
      <h3 className="text-lg font-bold text-text mb-4">Monthly Miles (YoY)</h3>
      <ChartContainer config={chartConfig} className="h-[280px] w-full">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="hsl(var(--grid-color))" strokeDasharray="3 3" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs text-muted-foreground" dy={8} />
          <YAxis tickLine={false} axisLine={false} className="text-xs text-muted-foreground" dx={-8} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey={String(currentYear)} fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} maxBarSize={40} />
          <Bar dataKey={String(priorYear)} fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} maxBarSize={40} />
          <ChartLegend verticalAlign="top" height={36} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
