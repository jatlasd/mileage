// Tax summary service for year-end mileage tracking and reporting
import { connectToDb } from '@/lib/mongodb'
import Trip from '@/models/entry'

// Constants
const SUSPICIOUS_TRIP_THRESHOLD = 500 // Miles

const getTripYear = (date) => {
  return parseInt(new Date(date).toLocaleString('en-US', { year: 'numeric', timeZone: 'America/New_York' }))
}

// Helper to get month order for sorting
const getMonthIndex = (monthName) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
  return months.indexOf(monthName)
}

export const taxSummaryService = {
  async getYearSummary(year) {
    await connectToDb()

    const allTrips = await Trip.find({ isActive: false }).sort({ startDatetime: 1 })
    const trips = allTrips.filter(trip => getTripYear(trip.startDatetime) === year)

    if (trips.length === 0) {
      return null
    }

    // Get first and last trips
    const firstTrip = trips[0]
    const lastTrip = trips[trips.length - 1]

    // Calculate totals
    const totalTrips = trips.length
    const totalBusinessMiles = trips.reduce((sum, trip) =>
      sum + (trip.tripMiles || 0), 0
    )

    const startOdometer = firstTrip.startMileage || 0
    const endOdometer = lastTrip.endMileage || 0
    const odometerDifference = endOdometer - startOdometer

    const averageMilesPerTrip = totalTrips > 0
      ? +(totalBusinessMiles / totalTrips).toFixed(1)
      : 0

    return {
      year,
      firstTripDate: firstTrip.startDatetime,
      lastTripDate: lastTrip.startDatetime,
      startOdometer,
      endOdometer,
      odometerDifference,
      totalBusinessMiles: +totalBusinessMiles.toFixed(1),
      totalTrips,
      averageMilesPerTrip
    }
  },

  async getMonthlyBreakdown(year) {
    await connectToDb()

    const allTrips = await Trip.find({ isActive: false }).sort({ startDatetime: 1 })
    const trips = allTrips.filter(trip => getTripYear(trip.startDatetime) === year)

    // Build monthly breakdown
    const monthlyData = {}
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']

    // Initialize all months
    months.forEach((month, index) => {
      monthlyData[month] = {
        month,
        monthIndex: index,
        trips: 0,
        businessMiles: 0,
        startOdometer: null,
        endOdometer: null,
        odometerDifference: 0
      }
    })

    // Process trips
    trips.forEach(trip => {
      const month = trip.month

      if (month && monthlyData[month]) {
        monthlyData[month].trips++
        monthlyData[month].businessMiles += (trip.tripMiles || 0)

        // Track first start odometer and last end odometer for the month
        if (monthlyData[month].startOdometer === null && trip.startMileage) {
          monthlyData[month].startOdometer = trip.startMileage
        }
        if (trip.endMileage) {
          monthlyData[month].endOdometer = trip.endMileage
        }
      }
    })

    // Calculate odometer differences
    Object.values(monthlyData).forEach(monthData => {
      if (monthData.startOdometer && monthData.endOdometer) {
        monthData.odometerDifference = monthData.endOdometer - monthData.startOdometer
      }

      // Round business miles
      monthData.businessMiles = +monthData.businessMiles.toFixed(1)
    })

    // Convert to array and sort by month
    return Object.values(monthlyData).sort((a, b) => a.monthIndex - b.monthIndex)
  },

  async validateYearData(year) {
    await connectToDb()

    const allTrips = await Trip.find({ isActive: false }).sort({ startDatetime: 1 })
    const trips = allTrips.filter(trip => getTripYear(trip.startDatetime) === year)

    const warnings = []
    const stats = {
      totalTrips: trips.length,
      validTrips: 0,
      suspiciousTrips: 0,
      tripsWithoutMileage: 0
    }

    // Find suspicious trips (>500 miles)
    const suspiciousTrips = trips.filter(t =>
      t.tripMiles && t.tripMiles > SUSPICIOUS_TRIP_THRESHOLD
    )

    suspiciousTrips.forEach(trip => {
      warnings.push({
        type: 'suspicious_trip',
        severity: 'high',
        tripId: trip._id.toString(),
        date: trip.startDatetime,
        message: `Trip exceeds ${SUSPICIOUS_TRIP_THRESHOLD} miles`,
        data: {
          tripMiles: trip.tripMiles,
          startMileage: trip.startMileage,
          endMileage: trip.endMileage,
          zone: trip.zone
        }
      })
    })

    // Find trips without mileage data
    const tripsWithoutMileage = trips.filter(t =>
      !t.tripMiles || t.tripMiles === 0
    )

    tripsWithoutMileage.forEach(trip => {
      warnings.push({
        type: 'missing_mileage',
        severity: 'medium',
        tripId: trip._id.toString(),
        date: trip.startDatetime,
        message: 'Trip missing mileage data',
        data: {
          startMileage: trip.startMileage,
          endMileage: trip.endMileage
        }
      })
    })

    // Calculate odometer vs sum discrepancy
    const validTrips = trips.filter(t =>
      t.tripMiles && t.tripMiles <= SUSPICIOUS_TRIP_THRESHOLD
    )

    const totalBusinessMiles = validTrips.reduce((sum, trip) =>
      sum + (trip.tripMiles || 0), 0
    )

    if (trips.length > 0) {
      const firstTrip = trips[0]
      const lastTrip = trips[trips.length - 1]
      const odometerDifference = (lastTrip.endMileage || 0) - (firstTrip.startMileage || 0)
      const discrepancy = Math.abs(odometerDifference - totalBusinessMiles)

      if (discrepancy > 50) {
        warnings.push({
          type: 'odometer_mismatch',
          severity: 'low',
          message: `Sum of trip miles (${totalBusinessMiles.toFixed(0)}) differs from odometer difference (${odometerDifference.toFixed(0)}) by ${discrepancy.toFixed(0)} miles`,
          data: {
            totalBusinessMiles: +totalBusinessMiles.toFixed(1),
            odometerDifference: +odometerDifference.toFixed(1),
            discrepancy: +discrepancy.toFixed(1)
          }
        })
      }
    }

    // Update stats
    stats.validTrips = validTrips.length
    stats.suspiciousTrips = suspiciousTrips.length
    stats.tripsWithoutMileage = tripsWithoutMileage.length

    // Sort warnings by severity and date
    const severityOrder = { high: 0, medium: 1, low: 2 }
    warnings.sort((a, b) => {
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[a.severity] - severityOrder[b.severity]
      }
      if (a.date && b.date) {
        return new Date(a.date) - new Date(b.date)
      }
      return 0
    })

    return { warnings, stats }
  },

  // Get available years (years with trip data)
  async getAvailableYears() {
    await connectToDb()

    const years = await Trip.aggregate([
      {
        $match: {
          startDatetime: { $exists: true },
          isActive: false
        }
      },
      {
        $group: {
          _id: { $year: "$startDatetime" }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ])

    return years.map(y => y._id)
  }
}
