"use client"

import { useState } from 'react'
import { Card } from '../ui/card'

const AnalyticsContainer = () => {
  const [timeFilter, setTimeFilter] = useState('daily')
  const [zoneFilter, setZoneFilter] = useState('all')
  const [selectedDay, setSelectedDay] = useState('all')

  const buttonClass = (isActive) =>
    `px-4 py-2 rounded-md transition-colors ${
      isActive
        ? 'bg-primary text-white'
        : 'bg-surface hover:bg-surface/80 text-text/80'
    }`

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <Card className="p-4 bg-background border-white/[0.1]">
          <h3 className="text-lg font-semibold mb-3 text-text">Time Period</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeFilter('hourly')}
              className={buttonClass(timeFilter === 'hourly')}
            >
              Hourly
            </button>
            <button
              onClick={() => setTimeFilter('daily')}
              className={buttonClass(timeFilter === 'daily')}
            >
              Daily
            </button>
            <button
              onClick={() => setTimeFilter('monthly')}
              className={buttonClass(timeFilter === 'monthly')}
            >
              Monthly
            </button>
          </div>
        </Card>

        {timeFilter === 'daily' && (
          <Card className="p-4 bg-background border-white/[0.1]">
            <h3 className="text-lg font-semibold mb-3 text-text">Day Filter</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedDay('all')}
                className={buttonClass(selectedDay === 'all')}
              >
                All Days
              </button>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={buttonClass(selectedDay === day)}
                >
                  {day}
                </button>
              ))}
            </div>
          </Card>
        )}

        <Card className="p-4 bg-background border-white/[0.1]">
          <h3 className="text-lg font-semibold mb-3 text-text">Zones</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setZoneFilter('all')}
              className={buttonClass(zoneFilter === 'all')}
            >
              All Zones
            </button>
            <button
              onClick={() => setZoneFilter('zone1')}
              className={buttonClass(zoneFilter === 'zone1')}
            >
              Zone 1
            </button>
            <button
              onClick={() => setZoneFilter('zone2')}
              className={buttonClass(zoneFilter === 'zone2')}
            >
              Zone 2
            </button>
          </div>
        </Card>
      </div>

      {timeFilter === 'hourly' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 bg-background border-white/[0.1]">
              <h3 className="text-lg font-semibold mb-3 text-text">Busiest Hour Ever</h3>
              <div className="text-3xl font-bold text-primary">Tue 6PM</div>
              <p className="text-sm text-text/60">32 orders</p>
            </Card>
            <Card className="p-4 bg-background border-white/[0.1]">
              <h3 className="text-lg font-semibold mb-3 text-text">Best Acceptance</h3>
              <div className="text-3xl font-bold text-primary">Wed 2PM</div>
              <p className="text-sm text-text/60">95% acceptance</p>
            </Card>
            <Card className="p-4 bg-background border-white/[0.1]">
              <h3 className="text-lg font-semibold mb-3 text-text">Peak Window</h3>
              <div className="text-3xl font-bold text-primary">5-7 PM</div>
              <p className="text-sm text-text/60">Consistently busiest</p>
            </Card>
            <Card className="p-4 bg-background border-white/[0.1]">
              <h3 className="text-lg font-semibold mb-3 text-text">Current Hour</h3>
              <div className="text-3xl font-bold text-primary">0</div>
              <p className="text-sm text-text/60">Orders this hour</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4 bg-background border-white/[0.1]">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-text">Hourly Heatmap</h3>
                <p className="text-sm text-text/60">All days</p>
              </div>
              <div className="h-[400px] flex items-center justify-center bg-surface/50 rounded-lg border border-white/[0.05]">
                Hour vs Day heatmap
              </div>
            </Card>

            <Card className="p-4 bg-background border-white/[0.1]">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-text">Best Hours</h3>
                <p className="text-sm text-text/60">By volume</p>
              </div>
              <div className="h-[400px] flex items-center justify-center bg-surface/50 rounded-lg border border-white/[0.05]">
                Top performing hours
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4 bg-background border-white/[0.1]">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-text">Type Distribution</h3>
                <p className="text-sm text-text/60">By hour</p>
              </div>
              <div className="h-[300px] flex items-center justify-center bg-surface/50 rounded-lg border border-white/[0.05]">
                Order types per hour
              </div>
            </Card>

            <Card className="p-4 bg-background border-white/[0.1]">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-text">Acceptance Patterns</h3>
                <p className="text-sm text-text/60">By hour</p>
              </div>
              <div className="h-[300px] flex items-center justify-center bg-surface/50 rounded-lg border border-white/[0.05]">
                Hourly acceptance rates
              </div>
            </Card>
          </div>
        </div>
      )}

      {timeFilter === 'daily' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 bg-background border-white/[0.1]">
              <h3 className="text-lg font-semibold mb-3 text-text">Today's Orders</h3>
              <div className="text-3xl font-bold text-primary">0</div>
              <p className="text-sm text-text/60">Total for today</p>
            </Card>
            <Card className="p-4 bg-background border-white/[0.1]">
              <h3 className="text-lg font-semibold mb-3 text-text">Daily Average</h3>
              <div className="text-3xl font-bold text-primary">0</div>
              <p className="text-sm text-text/60">
                {selectedDay === 'all' ? 'All days' : `${selectedDay}s only`}
              </p>
            </Card>
            <Card className="p-4 bg-background border-white/[0.1]">
              <h3 className="text-lg font-semibold mb-3 text-text">Best Time</h3>
              <div className="text-3xl font-bold text-primary">6 PM</div>
              <p className="text-sm text-text/60">
                {selectedDay === 'all' ? 'Overall peak' : `Peak on ${selectedDay}s`}
              </p>
            </Card>
            <Card className="p-4 bg-background border-white/[0.1]">
              <h3 className="text-lg font-semibold mb-3 text-text">Acceptance Rate</h3>
              <div className="text-3xl font-bold text-primary">0%</div>
              <p className="text-sm text-text/60">Daily average</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4 bg-background border-white/[0.1]">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-text">Weekly Pattern</h3>
                <p className="text-sm text-text/60">Orders by day</p>
              </div>
              <div className="h-[300px] flex items-center justify-center bg-surface/50 rounded-lg border border-white/[0.05]">
                Weekly distribution chart
              </div>
            </Card>

            <Card className="p-4 bg-background border-white/[0.1]">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-text">Day Performance</h3>
                <p className="text-sm text-text/60">vs Previous Week</p>
              </div>
              <div className="h-[300px] flex items-center justify-center bg-surface/50 rounded-lg border border-white/[0.05]">
                Day-by-day comparison
              </div>
            </Card>
          </div>

          <Card className="p-4 bg-background border-white/[0.1]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-text">Hourly Breakdown</h3>
              <p className="text-sm text-text/60">
                {selectedDay === 'all' ? 'All Days' : selectedDay}
              </p>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="h-[200px] flex items-center justify-center bg-surface/50 rounded-lg border border-white/[0.05]">
                  Current hour stats
                </div>
                <div className="h-[200px] flex items-center justify-center bg-surface/50 rounded-lg border border-white/[0.05]">
                  Peak hours distribution
                </div>
                <div className="h-[200px] flex items-center justify-center bg-surface/50 rounded-lg border border-white/[0.05]">
                  Hourly acceptance rates
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-text">24-Hour Pattern</h3>
                    <p className="text-sm text-text/60">
                      {selectedDay === 'all' ? 'Average' : selectedDay}
                    </p>
                  </div>
                  <div className="h-[300px] flex items-center justify-center bg-surface/50 rounded-lg border border-white/[0.05]">
                    24-hour distribution chart
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-text">Hourly Type Split</h3>
                    <p className="text-sm text-text/60">By hour of day</p>
                  </div>
                  <div className="h-[300px] flex items-center justify-center bg-surface/50 rounded-lg border border-white/[0.05]">
                    Order types by hour
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {zoneFilter !== 'all' && (
            <Card className="p-4 bg-background border-white/[0.1]">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-text">Zone Details</h3>
                <p className="text-sm text-text/60">
                  {selectedDay === 'all' ? 'All Days' : selectedDay}
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-[300px] flex items-center justify-center bg-surface/50 rounded-lg border border-white/[0.05]">
                  Zone performance by hour
                </div>
                <div className="h-[300px] flex items-center justify-center bg-surface/50 rounded-lg border border-white/[0.05]">
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
            <Card className="p-4 bg-background border-white/[0.1]">
              <h3 className="text-lg font-semibold mb-3 text-text">Monthly Orders</h3>
              <div className="text-3xl font-bold text-primary">0</div>
              <p className="text-sm text-text/60">Total orders</p>
            </Card>
            <Card className="p-4 bg-background border-white/[0.1]">
              <h3 className="text-lg font-semibold mb-3 text-text">Best Day</h3>
              <div className="text-3xl font-bold text-primary">-</div>
              <p className="text-sm text-text/60">Highest performing</p>
            </Card>
            <Card className="p-4 bg-background border-white/[0.1]">
              <h3 className="text-lg font-semibold mb-3 text-text">Worst Day</h3>
              <div className="text-3xl font-bold text-primary">-</div>
              <p className="text-sm text-text/60">Lowest performing</p>
            </Card>
          </div>

          <Card className="p-4 bg-background border-white/[0.1]">
            <h3 className="text-lg font-semibold mb-3 text-text">Monthly Performance</h3>
            <div className="h-[400px] flex items-center justify-center bg-surface/50 rounded-lg border border-white/[0.05]">
              Monthly trends chart
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default AnalyticsContainer