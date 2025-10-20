"use client"

import { useState } from 'react'
import FilterGroup from './FilterGroup'
import HourlyView from './views/HourlyView'
import DailyView from './views/DailyView'
import MonthlyView from './views/MonthlyView'
import ZoneView from './views/ZoneView'
import QuickInsights from './QuickInsights'

const AnalyticsContainer = () => {
  const [timeFilter, setTimeFilter] = useState('daily')
  const [zoneFilter, setZoneFilter] = useState('all')
  const [selectedDay, setSelectedDay] = useState('all')

  const timeOptions = [
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'monthly', label: 'Monthly' }
  ]

  const dayOptions = [
    { value: 'all', label: 'All Days' },
    { value: 'Mon', label: 'Mon' },
    { value: 'Tue', label: 'Tue' },
    { value: 'Wed', label: 'Wed' },
    { value: 'Thu', label: 'Thu' },
    { value: 'Fri', label: 'Fri' },
    { value: 'Sat', label: 'Sat' },
    { value: 'Sun', label: 'Sun' }
  ]

  const zoneOptions = [
    { value: 'all', label: 'All Zones' },
    { value: 'zone1', label: 'Zone 1' },
    { value: 'zone2', label: 'Zone 2' }
  ]

  return (
    <div className="space-y-6">
      {/* Quick Insights at the top */}
      <QuickInsights />

      {/* Filters Section */}
      <div className="space-y-4 md:space-y-6">
        <div className="bg-gradient-to-br from-background/80 to-background/40 border border-border rounded-xl p-4 md:p-6 shadow-xl">
          <div className="space-y-4">
            <FilterGroup
              title="Time Period"
              icon="⏱️"
              value={timeFilter}
              onChange={setTimeFilter}
              options={timeOptions}
            />

            {timeFilter === 'daily' && (
              <FilterGroup
                title="Day"
                icon="📅"
                value={selectedDay}
                onChange={setSelectedDay}
                options={dayOptions}
              />
            )}

            {/* Hide zones for now since it's not fully implemented */}
            {false && (
              <FilterGroup
                title="Zones"
                icon="🗺️"
                value={zoneFilter}
                onChange={setZoneFilter}
                options={zoneOptions}
              />
            )}
          </div>
        </div>
      </div>

      {/* Content Views */}
      <div className="space-y-6">
        {timeFilter === 'hourly' && <HourlyView />}
        {timeFilter === 'daily' && <DailyView selectedDay={selectedDay} />}
        {timeFilter === 'monthly' && <MonthlyView />}
        {zoneFilter !== 'all' && <ZoneView selectedDay={selectedDay} />}
      </div>
    </div>
  )
}

export default AnalyticsContainer