"use client"

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function MonthlyBreakdownTable({ monthlyBreakdown, year }) {
  const [sortColumn, setSortColumn] = useState('month')
  const [sortDirection, setSortDirection] = useState('asc')
  const [expandedMonth, setExpandedMonth] = useState(null)
  const [monthTrips, setMonthTrips] = useState({})
  const [loadingMonth, setLoadingMonth] = useState(null)

  if (!monthlyBreakdown || monthlyBreakdown.length === 0) {
    return <div className="text-text/60">No monthly data available</div>
  }

  const formatNumber = (num) => {
    return num ? num.toLocaleString() : '0'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  }

  const getTripYear = (date) => {
    return parseInt(new Date(date).toLocaleString('en-US', { year: 'numeric', timeZone: 'America/New_York' }))
  }

  const fetchMonthTrips = async (monthName) => {
    if (monthTrips[monthName]) return

    setLoadingMonth(monthName)
    try {
      const response = await fetch(`/api/entry`)
      const allTrips = await response.json()

      const filtered = allTrips.filter(trip => 
        trip.month === monthName && 
        !trip.isActive && 
        getTripYear(trip.startDatetime) === parseInt(year)
      )
      setMonthTrips(prev => ({ ...prev, [monthName]: filtered }))
    } catch (error) {
      console.error('Error fetching trips:', error)
    } finally {
      setLoadingMonth(null)
    }
  }

  // Handle month row click
  const handleMonthClick = (monthName) => {
    if (expandedMonth === monthName) {
      setExpandedMonth(null)
    } else {
      setExpandedMonth(monthName)
      fetchMonthTrips(monthName)
    }
  }

  // Handle sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  // Sort data
  const sortedData = [...monthlyBreakdown].sort((a, b) => {
    let aVal, bVal

    switch (sortColumn) {
      case 'month':
        aVal = a.monthIndex
        bVal = b.monthIndex
        break
      case 'trips':
        aVal = a.trips
        bVal = b.trips
        break
      case 'miles':
        aVal = a.businessMiles
        bVal = b.businessMiles
        break
      case 'startOdo':
        aVal = a.startOdometer || 0
        bVal = b.startOdometer || 0
        break
      case 'endOdo':
        aVal = a.endOdometer || 0
        bVal = b.endOdometer || 0
        break
      case 'odoDiff':
        aVal = a.odometerDifference
        bVal = b.odometerDifference
        break
      default:
        return 0
    }

    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  const SortIcon = ({ column }) => {
    if (sortColumn !== column) {
      return <span className="text-text/20 ml-1">⇅</span>
    }
    return <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
  }

  // Calculate totals
  const totals = monthlyBreakdown.reduce((acc, month) => ({
    trips: acc.trips + month.trips,
    miles: acc.miles + month.businessMiles
  }), { trips: 0, miles: 0 })

  return (
    <div className="bg-gradient-to-br from-background/80 to-background/40 border border-border rounded-xl shadow-xl overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead
                className="cursor-pointer hover:text-text transition-colors"
                onClick={() => handleSort('month')}
              >
                Month <SortIcon column="month" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-text transition-colors text-right"
                onClick={() => handleSort('trips')}
              >
                Trips <SortIcon column="trips" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-text transition-colors text-right"
                onClick={() => handleSort('miles')}
              >
                Business Miles <SortIcon column="miles" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-text transition-colors text-right"
                onClick={() => handleSort('startOdo')}
              >
                Start Odo <SortIcon column="startOdo" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-text transition-colors text-right"
                onClick={() => handleSort('endOdo')}
              >
                End Odo <SortIcon column="endOdo" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-text transition-colors text-right"
                onClick={() => handleSort('odoDiff')}
              >
                Odo Diff <SortIcon column="odoDiff" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((month) => (
              <>
                <TableRow
                  key={month.month}
                  className="cursor-pointer hover:bg-primary/5"
                  onClick={() => handleMonthClick(month.month)}
                >
                  <TableCell>
                    <span className="text-lg">
                      {expandedMonth === month.month ? '▼' : '▶'}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{month.month}</TableCell>
                  <TableCell className="text-right">{formatNumber(month.trips)}</TableCell>
                  <TableCell className="text-right font-semibold text-primary">
                    {formatNumber(month.businessMiles)}
                  </TableCell>
                  <TableCell className="text-right text-text/60">
                    {month.startOdometer ? formatNumber(month.startOdometer) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right text-text/60">
                    {month.endOdometer ? formatNumber(month.endOdometer) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right text-text/60">
                    {formatNumber(month.odometerDifference)}
                  </TableCell>
                </TableRow>

                {/* Expanded Trip Details */}
                {expandedMonth === month.month && (
                  <TableRow>
                    <TableCell colSpan={7} className="bg-background/50 p-0">
                      <div className="p-4">
                        {loadingMonth === month.month ? (
                          <div className="text-center py-4 text-text/60">Loading trips...</div>
                        ) : monthTrips[month.month] && monthTrips[month.month].length > 0 ? (
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-text/70 mb-2">
                              {month.month} Trips ({monthTrips[month.month].length})
                            </h4>
                            <div className="space-y-1 max-h-96 overflow-y-auto">
                              {monthTrips[month.month].map((trip) => (
                                <div
                                  key={trip._id}
                                  className="flex items-center justify-between text-sm py-2 px-3 bg-background/30 rounded border border-border/30 hover:border-primary/30 transition-colors"
                                >
                                  <div className="flex-1">
                                    <span className="text-text/60">{formatDate(trip.startDatetime)}</span>
                                    {trip.zone && <span className="ml-2 text-text/40">• {trip.zone}</span>}
                                  </div>
                                  <div className="flex gap-4 text-right">
                                    <div>
                                      <span className="text-text/50">Start: </span>
                                      <span className="font-mono">{formatNumber(trip.startMileage)}</span>
                                    </div>
                                    <div>
                                      <span className="text-text/50">End: </span>
                                      <span className="font-mono">{formatNumber(trip.endMileage)}</span>
                                    </div>
                                    <div className="min-w-[80px]">
                                      <span className="text-text/50">Miles: </span>
                                      <span className="font-semibold text-primary">{formatNumber(trip.tripMiles)}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4 text-text/60">No trips found</div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
            {/* Totals Row */}
            <TableRow className="bg-primary/10 font-bold">
              <TableCell></TableCell>
              <TableCell className="font-bold">Total</TableCell>
              <TableCell className="text-right">{formatNumber(totals.trips)}</TableCell>
              <TableCell className="text-right text-primary">{formatNumber(totals.miles)}</TableCell>
              <TableCell className="text-right" colSpan={3}>-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 p-4">
        {sortedData.map((month) => (
          <div key={month.month} className="space-y-2">
            <div
              className="bg-background/50 border border-border rounded-lg p-4 space-y-2 cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => handleMonthClick(month.month)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-primary">{month.month}</h3>
                <span className="text-lg">
                  {expandedMonth === month.month ? '▼' : '▶'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-text/50">Trips:</span>
                  <span className="ml-2 font-semibold">{formatNumber(month.trips)}</span>
                </div>
                <div>
                  <span className="text-text/50">Miles:</span>
                  <span className="ml-2 font-semibold text-primary">{formatNumber(month.businessMiles)}</span>
                </div>
                <div>
                  <span className="text-text/50">Start Odo:</span>
                  <span className="ml-2">{month.startOdometer ? formatNumber(month.startOdometer) : 'N/A'}</span>
                </div>
                <div>
                  <span className="text-text/50">End Odo:</span>
                  <span className="ml-2">{month.endOdometer ? formatNumber(month.endOdometer) : 'N/A'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-text/50">Odo Diff:</span>
                  <span className="ml-2">{formatNumber(month.odometerDifference)}</span>
                </div>
              </div>
            </div>

            {/* Expanded Trips for Mobile */}
            {expandedMonth === month.month && (
              <div className="bg-background/30 border border-border/30 rounded-lg p-3">
                {loadingMonth === month.month ? (
                  <div className="text-center py-4 text-text/60 text-sm">Loading trips...</div>
                ) : monthTrips[month.month] && monthTrips[month.month].length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-text/70 mb-2">
                      Trips ({monthTrips[month.month].length})
                    </h4>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {monthTrips[month.month].map((trip) => (
                        <div
                          key={trip._id}
                          className="text-xs py-2 px-2 bg-background/40 rounded border border-border/20"
                        >
                          <div className="text-text/60 mb-1">{formatDate(trip.startDatetime)}</div>
                          <div className="flex justify-between">
                            <span className="text-text/50">{trip.zone}</span>
                            <span className="font-semibold text-primary">{formatNumber(trip.tripMiles)} mi</span>
                          </div>
                          <div className="text-text/40 text-xs mt-1">
                            {formatNumber(trip.startMileage)} → {formatNumber(trip.endMileage)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-text/60 text-sm">No trips found</div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Mobile Totals */}
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
          <h3 className="text-lg font-bold text-text mb-2">Total</h3>
          <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
            <div>
              <span className="text-text/70">Trips:</span>
              <span className="ml-2">{formatNumber(totals.trips)}</span>
            </div>
            <div>
              <span className="text-text/70">Miles:</span>
              <span className="ml-2 text-primary">{formatNumber(totals.miles)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
