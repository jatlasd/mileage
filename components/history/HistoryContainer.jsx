"use client"

import { useState, useMemo } from 'react'
import { useHistory } from '@/lib/hooks/useHistory'
import FilterGroup from '../analytics/FilterGroup'
import ComparisonCard from './ComparisonCard'
import PeriodDetailPanel from './PeriodDetailPanel'
import YtdCumulativeChart from './YtdCumulativeChart'
import MonthlyYoYChart from './MonthlyYoYChart'
import StatCard from '../analytics/StatCard'

const HistoryContainer = () => {
  const [selectedYear, setSelectedYear] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  const { history, isLoading, error } = useHistory(selectedYear)

  const yearOptions = useMemo(() => {
    const years = history?.availableYears || [new Date().getFullYear()]
    return years.map((y) => ({ value: String(y), label: String(y) }))
  }, [history?.availableYears])

  const effectiveYear = selectedYear || String(history?.currentYear || new Date().getFullYear())

  const tabOptions = [
    { value: 'overview', label: 'Overview' },
    { value: 'yoy', label: 'Year over Year' },
    { value: 'mom', label: 'Month over Month' },
    { value: 'charts', label: 'Charts' }
  ]

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <p className="text-red-500 text-lg font-semibold">Error loading history</p>
          <p className="text-text/60 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-background/80 to-background/40 border border-border rounded-xl p-4 md:p-6 shadow-xl">
        <div className="space-y-4">
          <p className="text-sm text-text/60">
            Comparing through{' '}
            <span className="text-text font-medium">
              {history?.referenceDateLabel || '…'}
            </span>
            {history?.priorYear && (
              <span> · {history.currentYear} vs {history.priorYear}</span>
            )}
          </p>

          {yearOptions.length > 1 && (
            <FilterGroup
              title="Reference Year"
              icon="📅"
              value={effectiveYear}
              onChange={setSelectedYear}
              options={yearOptions}
            />
          )}

          <FilterGroup
            title="View"
            icon="📊"
            value={activeTab}
            onChange={setActiveTab}
            options={tabOptions}
          />
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-text/60">Loading comparisons…</p>
          </div>
        </div>
      )}

      {!isLoading && history && (
        <>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ComparisonCard title="YTD Miles" comparison={history.yoy?.ytd} icon="📈" />
                <ComparisonCard title="Month to Date" comparison={history.yoy?.mtd} icon="📅" />
                <ComparisonCard title="This Week" comparison={history.yoy?.week} icon="🗓️" />
                <ComparisonCard title="Last 7 Days" comparison={history.yoy?.rolling7} icon="⏱️" />
                <ComparisonCard title="Today" comparison={history.yoy?.today} icon="📍" />
                <ComparisonCard
                  title="MTD vs Last Month"
                  comparison={history.mom?.mtdVsPrevMonth}
                  icon="↔️"
                />
              </div>

              {history.yearlyComparison?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {history.yearlyComparison.map((yearData) => (
                    <StatCard
                      key={yearData.year}
                      title={`${yearData.year} YTD`}
                      value={yearData.ytdAtReference?.miles?.toLocaleString() ?? '0'}
                      subtitle={`${yearData.throughDate} · ${yearData.ytdAtReference?.tripCount ?? 0} trips`}
                      icon="🚗"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'yoy' && (
            <div className="space-y-6">
              <PeriodDetailPanel title="Year to Date" comparison={history.yoy?.ytd} />
              <PeriodDetailPanel title="Month to Date" comparison={history.yoy?.mtd} />
              <PeriodDetailPanel title="This Week" comparison={history.yoy?.week} />
              <PeriodDetailPanel title="Last 7 Days" comparison={history.yoy?.rolling7} />
              <PeriodDetailPanel title="Same Day" comparison={history.yoy?.today} />
            </div>
          )}

          {activeTab === 'mom' && (
            <div className="space-y-6">
              <PeriodDetailPanel
                title="Current Month vs Previous Month"
                comparison={history.mom?.mtdVsPrevMonth}
              />

              <div className="bg-gradient-to-br from-background/80 to-background/40 border border-border rounded-xl p-4 md:p-6 shadow-xl overflow-x-auto">
                <h3 className="text-lg font-bold text-text mb-4">
                  {history.currentYear} Monthly Breakdown
                </h3>
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="text-left text-text/50 border-b border-border/50">
                      <th className="pb-2 pr-4">Month</th>
                      <th className="pb-2 pr-4 text-right">Miles</th>
                      <th className="pb-2 pr-4 text-right">Prev Month</th>
                      <th className="pb-2 pr-4 text-right">Change</th>
                      <th className="pb-2 text-right">Trips</th>
                      <th className="pb-2 text-right">Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.mom?.monthlyBreakdown?.map((row) => {
                      const arrow =
                        row.delta.miles.direction === 'up'
                          ? '↑'
                          : row.delta.miles.direction === 'down'
                            ? '↓'
                            : '→'
                      const color =
                        row.delta.miles.direction === 'up'
                          ? 'text-green-500'
                          : row.delta.miles.direction === 'down'
                            ? 'text-red-400'
                            : 'text-text/50'

                      return (
                        <tr key={row.month} className="border-b border-border/20">
                          <td className="py-3 pr-4 font-medium">{row.month}</td>
                          <td className="py-3 pr-4 text-right text-primary font-semibold">
                            {row.current.miles.toLocaleString()}
                          </td>
                          <td className="py-3 pr-4 text-right text-text/60">
                            {row.priorMonth.miles.toLocaleString()}
                          </td>
                          <td className={`py-3 pr-4 text-right font-medium ${color}`}>
                            {arrow} {row.delta.miles.percent > 0 ? '+' : ''}
                            {row.delta.miles.percent}%
                          </td>
                          <td className="py-3 pr-4 text-right text-text/70">
                            {row.current.tripCount}
                          </td>
                          <td className="py-3 text-right text-text/70">
                            {row.current.totalOrders}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'charts' && (
            <div className="space-y-6">
              <YtdCumulativeChart
                data={history.charts?.ytdCumulative}
                currentYear={history.currentYear}
                priorYear={history.priorYear}
              />
              <MonthlyYoYChart
                data={history.charts?.monthlyYoY}
                currentYear={history.currentYear}
                priorYear={history.priorYear}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default HistoryContainer
