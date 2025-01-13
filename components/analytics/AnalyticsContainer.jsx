"use client"

import { useState } from 'react'
import FilterGroup from './FilterGroup'
import HourlyView from './views/HourlyView'
import DailyView from './views/DailyView'
import MonthlyView from './views/MonthlyView'
import ZoneView from './views/ZoneView'

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
      <div className="flex flex-wrap gap-4">
        <FilterGroup
          title="Time Period"
          value={timeFilter}
          onChange={setTimeFilter}
          options={timeOptions}
        />

        {timeFilter === 'daily' && (
          <FilterGroup
            title="Day Filter"
            value={selectedDay}
            onChange={setSelectedDay}
            options={dayOptions}
          />
        )}

        <FilterGroup
          title="Zones"
          value={zoneFilter}
          onChange={setZoneFilter}
          options={zoneOptions}
        />
      </div>

      {timeFilter === 'hourly' && <HourlyView />}
      {timeFilter === 'daily' && <DailyView selectedDay={selectedDay} />}
      {timeFilter === 'monthly' && <MonthlyView />}
      {zoneFilter !== 'all' && <ZoneView selectedDay={selectedDay} />}
    </div>
  )
}

export default AnalyticsContainer