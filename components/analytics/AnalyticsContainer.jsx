"use client"

import { useState } from 'react'
import { Card } from '../ui/card'

const AnalyticsContainer = () => {
  const [timeFilter, setTimeFilter] = useState('daily')
  const [zoneFilter, setZoneFilter] = useState('all')
  const [selectedDay, setSelectedDay] = useState('all')

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-3">Time Period</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeFilter('hourly')}
              className={`px-4 py-2 rounded-md ${
                timeFilter === 'hourly'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Hourly
            </button>
            <button
              onClick={() => setTimeFilter('daily')}
              className={`px-4 py-2 rounded-md ${
                timeFilter === 'daily'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setTimeFilter('monthly')}
              className={`px-4 py-2 rounded-md ${
                timeFilter === 'monthly'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Monthly
            </button>
          </div>
        </Card>

        {timeFilter === 'daily' && (
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Day Filter</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedDay('all')}
                className={`px-4 py-2 rounded-md ${
                  selectedDay === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                All Days
              </button>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-md ${
                    selectedDay === day
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </Card>
        )}

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-3">Zones</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setZoneFilter('all')}
              className={`px-4 py-2 rounded-md ${
                zoneFilter === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              All Zones
            </button>
            <button
              onClick={() => setZoneFilter('zone1')}
              className={`px-4 py-2 rounded-md ${
                zoneFilter === 'zone1'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Zone 1
            </button>
            <button
              onClick={() => setZoneFilter('zone2')}
              className={`px-4 py-2 rounded-md ${
                zoneFilter === 'zone2'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Zone 2
            </button>
          </div>
        </Card>
      </div>

      {timeFilter === 'hourly' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Busiest Hour Ever</h3>
              <div className="text-3xl font-bold">Tue 6PM</div>
              <p className="text-sm text-gray-500">32 orders</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Best Acceptance</h3>
              <div className="text-3xl font-bold">Wed 2PM</div>
              <p className="text-sm text-gray-500">95% acceptance</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Peak Window</h3>
              <div className="text-3xl font-bold">5-7 PM</div>
              <p className="text-sm text-gray-500">Consistently busiest</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Current Hour</h3>
              <div className="text-3xl font-bold">0</div>
              <p className="text-sm text-gray-500">Orders this hour</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Hourly Heatmap</h3>
                <p className="text-sm text-gray-500">All days</p>
              </div>
              <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
                Hour vs Day heatmap
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Best Hours</h3>
                <p className="text-sm text-gray-500">By volume</p>
              </div>
              <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
                Top performing hours
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Type Distribution</h3>
                <p className="text-sm text-gray-500">By hour</p>
              </div>
              <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                Order types per hour
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Acceptance Patterns</h3>
                <p className="text-sm text-gray-500">By hour</p>
              </div>
              <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                Hourly acceptance rates
              </div>
            </Card>
          </div>
        </div>
      )}

      {timeFilter === 'daily' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Today's Orders</h3>
              <div className="text-3xl font-bold">0</div>
              <p className="text-sm text-gray-500">Total for today</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Daily Average</h3>
              <div className="text-3xl font-bold">0</div>
              <p className="text-sm text-gray-500">
                {selectedDay === 'all' ? 'All days' : `${selectedDay}s only`}
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Best Time</h3>
              <div className="text-3xl font-bold">6 PM</div>
              <p className="text-sm text-gray-500">
                {selectedDay === 'all' ? 'Overall peak' : `Peak on ${selectedDay}s`}
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Acceptance Rate</h3>
              <div className="text-3xl font-bold">0%</div>
              <p className="text-sm text-gray-500">Daily average</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Weekly Pattern</h3>
                <p className="text-sm text-gray-500">Orders by day</p>
              </div>
              <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                Weekly distribution chart
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Day Performance</h3>
                <p className="text-sm text-gray-500">vs Previous Week</p>
              </div>
              <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                Day-by-day comparison
              </div>
            </Card>
          </div>

          <Card className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Hourly Breakdown</h3>
              <p className="text-sm text-gray-500">
                {selectedDay === 'all' ? 'All Days' : selectedDay}
              </p>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
                  Current hour stats
                </div>
                <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
                  Peak hours distribution
                </div>
                <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
                  Hourly acceptance rates
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold">24-Hour Pattern</h3>
                    <p className="text-sm text-gray-500">
                      {selectedDay === 'all' ? 'Average' : selectedDay}
                    </p>
                  </div>
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                    24-hour distribution chart
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold">Hourly Type Split</h3>
                    <p className="text-sm text-gray-500">By hour of day</p>
                  </div>
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                    Order types by hour
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {zoneFilter !== 'all' && (
            <Card className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Zone Details</h3>
                <p className="text-sm text-gray-500">
                  {selectedDay === 'all' ? 'All Days' : selectedDay}
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                  Zone performance by hour
                </div>
                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                  Zone type distribution
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {timeFilter === 'monthly' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Monthly Orders</h3>
              <div className="text-3xl font-bold">0</div>
              <p className="text-sm text-gray-500">Total orders</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Best Day</h3>
              <div className="text-3xl font-bold">-</div>
              <p className="text-sm text-gray-500">Highest performing</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Worst Day</h3>
              <div className="text-3xl font-bold">-</div>
              <p className="text-sm text-gray-500">Lowest performing</p>
            </Card>
          </div>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Monthly Performance</h3>
            <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
              Monthly trends chart
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default AnalyticsContainer