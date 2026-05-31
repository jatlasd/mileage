"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function YtdCumulativeChart({ data, currentYear, priorYear }) {
  if (!data?.length) {
    return <div className="text-text/60">No YTD data available</div>
  }

  const chartConfig = {
    [currentYear]: {
      label: `${currentYear} YTD`,
      color: "hsl(var(--chart-1))"
    },
    [priorYear]: {
      label: `${priorYear} YTD`,
      color: "hsl(var(--chart-2))"
    }
  }

  return (
    <div className="bg-gradient-to-br from-background/80 to-background/40 border border-border rounded-xl p-4 md:p-6 shadow-xl">
      <h3 className="text-lg font-bold text-text mb-4">YTD Cumulative Miles</h3>
      <ChartContainer config={chartConfig} className="h-[280px] w-full">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="hsl(var(--grid-color))" strokeDasharray="3 3" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} className="text-xs text-muted-foreground" dy={8} />
          <YAxis tickLine={false} axisLine={false} className="text-xs text-muted-foreground" dx={-8} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            dataKey={String(currentYear)}
            type="monotone"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey={String(priorYear)}
            type="monotone"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            dot={false}
            strokeDasharray="4 4"
          />
          <ChartLegend verticalAlign="top" height={36} />
        </LineChart>
      </ChartContainer>
    </div>
  )
}
