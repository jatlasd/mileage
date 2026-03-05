"use client"

import { useState, useEffect } from 'react'
import { useTaxSummary } from '@/lib/hooks/useTaxSummary'
import FilterGroup from '../analytics/FilterGroup'
import OverviewTab from './tabs/OverviewTab'
import MonthlyDetailsTab from './tabs/MonthlyDetailsTab'
import ValidationTab from './tabs/ValidationTab'

const TaxSummaryContainer = () => {
  const [selectedYear, setSelectedYear] = useState('2025')
  const [activeTab, setActiveTab] = useState('overview')

  // Fetch tax summary data for selected year
  const { yearSummary, monthlyBreakdown, validation, isLoading, error } = useTaxSummary(selectedYear)

  // Tab options
  const tabOptions = [
    { value: 'overview', label: 'Overview' },
    { value: 'monthly', label: 'Monthly Details' },
    { value: 'validation', label: 'Validation' }
  ]

  // Year options (can be dynamically fetched later)
  const yearOptions = [
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' }
  ]

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <p className="text-red-500 text-lg font-semibold">Error loading tax summary</p>
          <p className="text-text/60 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Year Selector */}
      <div className="bg-gradient-to-br from-background/80 to-background/40 border border-border rounded-xl p-4 md:p-6 shadow-xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-text">
              Tax Summary
            </h1>
          </div>

          <FilterGroup
            title="Year"
            icon="📅"
            value={selectedYear}
            onChange={setSelectedYear}
            options={yearOptions}
          />

          <FilterGroup
            title="View"
            icon="📊"
            value={activeTab}
            onChange={setActiveTab}
            options={tabOptions}
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-text/60">Loading {selectedYear} tax summary...</p>
          </div>
        </div>
      )}

      {/* No Data State */}
      {!isLoading && !yearSummary && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-2">
            <p className="text-text/80 text-lg font-semibold">No trips found for {selectedYear}</p>
            <p className="text-text/60 text-sm">Try selecting a different year</p>
          </div>
        </div>
      )}

      {/* Tab Content */}
      {!isLoading && yearSummary && (
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <OverviewTab
              yearSummary={yearSummary}
              monthlyBreakdown={monthlyBreakdown}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'monthly' && (
            <MonthlyDetailsTab
              monthlyBreakdown={monthlyBreakdown}
              year={selectedYear}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'validation' && (
            <ValidationTab
              validation={validation}
              year={selectedYear}
              isLoading={isLoading}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default TaxSummaryContainer
