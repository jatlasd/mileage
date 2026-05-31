import { connectToDb } from '@/lib/mongodb'
import Trip from '@/models/entry'

const TZ = 'America/New_York'
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const getTripYear = (date) =>
  parseInt(new Date(date).toLocaleString('en-US', { year: 'numeric', timeZone: TZ }))

const getTripMonth = (date) =>
  parseInt(new Date(date).toLocaleString('en-US', { month: 'numeric', timeZone: TZ }))

const getTripDay = (date) =>
  parseInt(new Date(date).toLocaleString('en-US', { day: 'numeric', timeZone: TZ }))

const getDateKeyET = (date) =>
  new Date(date).toLocaleDateString('en-CA', { timeZone: TZ })

const getNowET = () => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(new Date())

  const get = (type) => parts.find((p) => p.type === type)?.value
  return new Date(
    `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}`
  )
}

const startOfDay = (date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

const endOfDay = (date) => {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

const startOfYear = (year) => new Date(year, 0, 1, 0, 0, 0, 0)

const startOfMonth = (year, month) => new Date(year, month - 1, 1, 0, 0, 0, 0)

const endOfMonth = (year, month) => new Date(year, month, 0, 23, 59, 59, 999)

const getWeekStart = (date) => {
  const d = startOfDay(date)
  d.setDate(d.getDate() - d.getDay())
  return d
}

const formatShortDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: TZ })

const computePeriodStats = (trips, startDate, endDate) => {
  const filtered = trips.filter((trip) => {
    if (trip.isActive) return false
    const d = new Date(trip.startDatetime)
    return d >= startDate && d <= endDate
  })

  const miles = filtered.reduce((sum, trip) => sum + (trip.tripMiles || 0), 0)
  const tripCount = filtered.length
  const daysWorked = new Set(filtered.map((trip) => getDateKeyET(trip.startDatetime))).size

  let totalOrders = 0
  let acceptedOrders = 0
  filtered.forEach((trip) => {
    (trip.orders || []).forEach((order) => {
      totalOrders++
      if (order.accepted) acceptedOrders++
    })
  })

  const acceptanceRate =
    totalOrders > 0 ? +((acceptedOrders / totalOrders) * 100).toFixed(1) : 0
  const avgMilesPerTrip = tripCount > 0 ? +(miles / tripCount).toFixed(1) : 0
  const avgOrdersPerDay = daysWorked > 0 ? +(totalOrders / daysWorked).toFixed(1) : 0
  const avgMilesPerDay = daysWorked > 0 ? +(miles / daysWorked).toFixed(1) : 0

  return {
    miles: +miles.toFixed(1),
    tripCount,
    daysWorked,
    totalOrders,
    acceptanceRate,
    avgMilesPerTrip,
    avgOrdersPerDay,
    avgMilesPerDay
  }
}

const computeDelta = (current, prior) => {
  const delta = (curr, prev) => {
    if (prev === 0 && curr === 0) return { value: 0, percent: 0, direction: 'flat' }
    if (prev === 0) return { value: curr, percent: 100, direction: 'up' }
    const diff = curr - prev
    const percent = +((diff / prev) * 100).toFixed(1)
    return {
      value: typeof diff === 'number' && !Number.isInteger(diff) ? +diff.toFixed(1) : diff,
      percent,
      direction: percent > 0 ? 'up' : percent < 0 ? 'down' : 'flat'
    }
  }

  return {
    miles: delta(current.miles, prior.miles),
    tripCount: delta(current.tripCount, prior.tripCount),
    daysWorked: delta(current.daysWorked, prior.daysWorked),
    totalOrders: delta(current.totalOrders, prior.totalOrders),
    acceptanceRate: delta(current.acceptanceRate, prior.acceptanceRate),
    avgMilesPerTrip: delta(current.avgMilesPerTrip, prior.avgMilesPerTrip),
    avgOrdersPerDay: delta(current.avgOrdersPerDay, prior.avgOrdersPerDay),
    avgMilesPerDay: delta(current.avgMilesPerDay, prior.avgMilesPerDay)
  }
}

const buildComparison = (current, prior, labels) => ({
  current,
  prior,
  delta: computeDelta(current, prior),
  labels
})

export const historyService = {
  async getComparisonData(yearParam) {
    await connectToDb()

    const allTrips = await Trip.find({ isActive: false }).sort({ startDatetime: 1 }).lean()
    const now = getNowET()
    const currentYear = yearParam ? parseInt(yearParam) : getTripYear(now)
    const priorYear = currentYear - 1

    const year = getTripYear(now)
    const month = getTripMonth(now)
    const day = getTripDay(now)

    const useHistoricalDate = currentYear < year
    const referenceDate = useHistoricalDate
      ? endOfMonth(currentYear, 12)
      : currentYear > year
        ? startOfYear(currentYear)
        : now

    const refYear = getTripYear(referenceDate)
    const refMonth = getTripMonth(referenceDate)
    const refDay = getTripDay(referenceDate)

    const ytdStart = startOfYear(refYear)
    const ytdEnd = endOfDay(referenceDate)
    const priorYtdStart = startOfYear(priorYear)
    const priorYtdEnd = endOfDay(new Date(priorYear, refMonth - 1, refDay, 23, 59, 59, 999))

    const mtdStart = startOfMonth(refYear, refMonth)
    const mtdEnd = endOfDay(referenceDate)
    const priorMtdStart = startOfMonth(priorYear, refMonth)
    const priorMtdEnd = endOfDay(new Date(priorYear, refMonth - 1, refDay, 23, 59, 59, 999))

    const MS_PER_DAY = 24 * 60 * 60 * 1000
    const weekStart = getWeekStart(referenceDate)
    const weekEnd = endOfDay(referenceDate)
    const daysIntoWeek = Math.floor((referenceDate - weekStart) / MS_PER_DAY)
    const priorWeekStart = getWeekStart(new Date(priorYear, refMonth - 1, refDay))
    const priorWeekEnd = new Date(priorWeekStart)
    priorWeekEnd.setDate(priorWeekEnd.getDate() + daysIntoWeek)
    priorWeekEnd.setHours(23, 59, 59, 999)

    const todayStart = startOfDay(referenceDate)
    const todayEnd = endOfDay(referenceDate)
    const priorTodayStart = startOfDay(new Date(priorYear, refMonth - 1, refDay))
    const priorTodayEnd = endOfDay(priorTodayStart)

    const rolling7Start = new Date(referenceDate)
    rolling7Start.setDate(rolling7Start.getDate() - 6)
    rolling7Start.setHours(0, 0, 0, 0)
    const priorRolling7Start = new Date(rolling7Start)
    priorRolling7Start.setFullYear(priorYear)
    const priorRolling7End = endOfDay(new Date(priorYear, refMonth - 1, refDay))

    const prevMonth = refMonth === 1 ? 12 : refMonth - 1
    const prevMonthYear = refMonth === 1 ? refYear - 1 : refYear
    const momMtdStart = startOfMonth(refYear, refMonth)
    const momMtdEnd = endOfDay(referenceDate)
    const momPrevStart = startOfMonth(prevMonthYear, prevMonth)
    const momPrevEnd = endOfDay(
      new Date(prevMonthYear, prevMonth - 1, Math.min(refDay, endOfMonth(prevMonthYear, prevMonth).getDate()))
    )

    const refLabel = formatShortDate(referenceDate)

    const yoy = {
      ytd: buildComparison(
        computePeriodStats(allTrips, ytdStart, ytdEnd),
        computePeriodStats(allTrips, priorYtdStart, priorYtdEnd),
        {
          current: `${refYear} YTD`,
          prior: `${priorYear} YTD (through ${refLabel})`
        }
      ),
      mtd: buildComparison(
        computePeriodStats(allTrips, mtdStart, mtdEnd),
        computePeriodStats(allTrips, priorMtdStart, priorMtdEnd),
        {
          current: `${MONTHS[refMonth - 1]} ${refYear} MTD`,
          prior: `${MONTHS[refMonth - 1]} ${priorYear} (through ${refLabel})`
        }
      ),
      week: buildComparison(
        computePeriodStats(allTrips, weekStart, weekEnd),
        computePeriodStats(allTrips, priorWeekStart, priorWeekEnd),
        {
          current: `This week (${formatShortDate(weekStart)} – ${refLabel})`,
          prior: `Same week ${priorYear}`
        }
      ),
      rolling7: buildComparison(
        computePeriodStats(allTrips, rolling7Start, todayEnd),
        computePeriodStats(allTrips, priorRolling7Start, priorRolling7End),
        {
          current: 'Last 7 days',
          prior: `Same 7 days in ${priorYear}`
        }
      ),
      today: buildComparison(
        computePeriodStats(allTrips, todayStart, todayEnd),
        computePeriodStats(allTrips, priorTodayStart, priorTodayEnd),
        {
          current: refLabel,
          prior: `${formatShortDate(priorTodayStart)} (${priorYear})`
        }
      )
    }

    const mom = {
      mtdVsPrevMonth: buildComparison(
        computePeriodStats(allTrips, momMtdStart, momMtdEnd),
        computePeriodStats(allTrips, momPrevStart, momPrevEnd),
        {
          current: `${MONTHS[refMonth - 1]} ${refYear} MTD`,
          prior: `${MONTHS[prevMonth - 1]} ${prevMonthYear} (same period)`
        }
      ),
      monthlyBreakdown: []
    }

    for (let m = 1; m <= 12; m++) {
      const monthStart = startOfMonth(refYear, m)
      const monthEnd =
        refYear === year && m === month
          ? endOfDay(referenceDate)
          : refYear > year || (refYear === year && m > month)
            ? null
            : endOfMonth(refYear, m)

      if (!monthEnd) continue

      const prevM = m === 1 ? 12 : m - 1
      const prevY = m === 1 ? refYear - 1 : refYear
      const prevEnd = endOfMonth(prevY, prevM)

      const currentStats = computePeriodStats(allTrips, monthStart, monthEnd)
      const priorMonthStats = computePeriodStats(allTrips, startOfMonth(prevY, prevM), prevEnd)

      mom.monthlyBreakdown.push({
        month: MONTHS[m - 1],
        monthIndex: m - 1,
        current: currentStats,
        priorMonth: priorMonthStats,
        delta: computeDelta(currentStats, priorMonthStats)
      })
    }

    const yearlyComparison = [refYear, priorYear, priorYear - 1]
      .filter((y, i, arr) => arr.indexOf(y) === i && y >= 2020)
      .map((y) => {
        const yStart = startOfYear(y)
        const yEnd =
          y === refYear
            ? endOfDay(referenceDate)
            : y < refYear
              ? endOfMonth(y, 12)
              : null
        if (!yEnd) return null

        const fullYearEnd = endOfMonth(y, 12)
        return {
          year: y,
          ytdAtReference: computePeriodStats(allTrips, yStart, yEnd),
          fullYear: computePeriodStats(allTrips, yStart, fullYearEnd),
          throughDate: y === refYear ? refLabel : `Dec 31, ${y}`
        }
      })
      .filter(Boolean)

    const ytdCumulative = buildYtdCumulativeChart(allTrips, refYear, priorYear, referenceDate)
    const monthlyYoY = buildMonthlyYoYChart(allTrips, refYear, priorYear, refMonth, referenceDate)

    const availableYears = [...new Set(allTrips.map((t) => getTripYear(t.startDatetime)))].sort(
      (a, b) => b - a
    )

    return {
      referenceDate: getDateKeyET(referenceDate),
      referenceDateLabel: refLabel,
      currentYear: refYear,
      priorYear,
      availableYears: availableYears.length ? availableYears : [refYear],
      yoy,
      mom,
      yearlyComparison,
      charts: {
        ytdCumulative,
        monthlyYoY
      }
    }
  }
}

function buildYtdCumulativeChart(trips, currentYear, priorYear, referenceDate) {
  const refMonth = getTripMonth(referenceDate)
  const refDay = getTripDay(referenceDate)

  const data = []
  let cumCurrent = 0
  let cumPrior = 0

  const start = new Date(currentYear, 0, 1)
  const end = referenceDate

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = getDateKeyET(d)
    const dayMilesCurrent = trips
      .filter((t) => getDateKeyET(t.startDatetime) === key && getTripYear(t.startDatetime) === currentYear)
      .reduce((s, t) => s + (t.tripMiles || 0), 0)

    const priorDate = new Date(d)
    priorDate.setFullYear(priorYear)
    const priorKey = getDateKeyET(priorDate)
    const dayMilesPrior = trips
      .filter((t) => getDateKeyET(t.startDatetime) === priorKey && getTripYear(t.startDatetime) === priorYear)
      .reduce((s, t) => s + (t.tripMiles || 0), 0)

    cumCurrent += dayMilesCurrent
    cumPrior += dayMilesPrior

    const dayOfYear = Math.floor((d - start) / (24 * 60 * 60 * 1000)) + 1
    if (dayOfYear % 14 === 0 || d.getTime() === end.getTime()) {
      data.push({
        label: formatShortDate(d),
        [currentYear]: +cumCurrent.toFixed(1),
        [priorYear]: +cumPrior.toFixed(1)
      })
    }
  }

  return data
}

function buildMonthlyYoYChart(trips, currentYear, priorYear, refMonth, referenceDate) {
  return MONTHS.slice(0, refMonth).map((monthName, index) => {
    const m = index + 1
    const monthStart = startOfMonth(currentYear, m)
    const monthEnd =
      m === refMonth ? endOfDay(referenceDate) : endOfMonth(currentYear, m)
    const priorStart = startOfMonth(priorYear, m)
    const priorEnd =
      m === refMonth
        ? endOfDay(new Date(priorYear, index, getTripDay(referenceDate)))
        : endOfMonth(priorYear, m)

    return {
      month: monthName.slice(0, 3),
      [currentYear]: computePeriodStats(trips, monthStart, monthEnd).miles,
      [priorYear]: computePeriodStats(trips, priorStart, priorEnd).miles
    }
  })
}
