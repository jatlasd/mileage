// Unified analytics service to eliminate code duplication across API routes
import { connectToDb } from '@/lib/mongodb'
import Trip from '@/models/entry'

// Constants
const RECENT_DAYS_THRESHOLD = 14
const MS_PER_DAY = 24 * 60 * 60 * 1000

// Reusable aggregation stage builders
const stages = {
  matchWithOrders: (additionalMatch = {}) => ({
    $match: {
      "orders.0": { $exists: true },
      ...additionalMatch
    }
  }),

  matchByDay: (dayOfWeek) => {
    if (!dayOfWeek || dayOfWeek === 'all') return null
    return { $match: { dayOfWeek } }
  },

  unwindOrders: () => ({ $unwind: "$orders" }),

  groupByHour: () => ({
    $group: {
      _id: "$orders.hourBlock",
      totalOrders: { $sum: 1 },
      acceptedOrders: {
        $sum: { $cond: [{ $eq: ["$orders.accepted", true] }, 1, 0] }
      },
      uniqueDays: {
        $addToSet: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$startDatetime"
          }
        }
      }
    }
  }),

  groupByDayOfWeek: () => ({
    $group: {
      _id: "$dayOfWeek",
      totalOrders: { $sum: 1 },
      acceptedOrders: {
        $sum: { $cond: [{ $eq: ["$orders.accepted", true] }, 1, 0] }
      },
      uniqueDays: {
        $addToSet: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$startDatetime"
          }
        }
      }
    }
  }),

  groupByMonth: () => ({
    $group: {
      _id: "$month",
      totalOrders: { $sum: 1 },
      acceptedOrders: {
        $sum: { $cond: [{ $eq: ["$orders.accepted", true] }, 1, 0] }
      },
      uniqueDays: {
        $addToSet: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$startDatetime"
          }
        }
      },
      totalMiles: { $sum: "$tripMiles" }
    }
  }),

  groupByOrderType: () => ({
    $group: {
      _id: "$orders.type",
      totalOrders: { $sum: 1 },
      uniqueDays: {
        $addToSet: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$startDatetime"
          }
        }
      }
    }
  }),

  projectHourlyStats: () => ({
    $project: {
      hour: "$_id",
      _id: 0,
      totalDays: { $size: "$uniqueDays" },
      averageOrders: {
        $round: [
          { $divide: ["$totalOrders", { $size: "$uniqueDays" }] },
          1
        ]
      },
      acceptanceRate: {
        $round: [
          { $multiply: [
            { $divide: ["$acceptedOrders", "$totalOrders"] },
            100
          ]},
          1
        ]
      }
    }
  }),

  projectDailyStats: () => ({
    $project: {
      day: "$_id",
      _id: 0,
      totalOrders: 1,
      uniqueDayCount: { $size: "$uniqueDays" },
      averageOrders: {
        $round: [
          { $divide: ["$totalOrders", { $size: "$uniqueDays" }] },
          1
        ]
      },
      acceptanceRate: {
        $round: [
          { $multiply: [
            { $divide: ["$acceptedOrders", "$totalOrders"] },
            100
          ]},
          1
        ]
      }
    }
  }),

  projectTypeStats: () => ({
    $project: {
      type: "$_id",
      _id: 0,
      totalOrders: 1,
      uniqueDayCount: { $size: "$uniqueDays" },
      averageOrders: {
        $round: [
          { $divide: ["$totalOrders", { $size: "$uniqueDays" }] },
          1
        ]
      }
    }
  }),

  sortByAverageDesc: () => ({ $sort: { averageOrders: -1 } }),
  sortByHourAsc: () => ({ $sort: { hour: 1 } })
}

// Core analytics queries
export const analyticsService = {
  // Get hourly stats for all hours
  async getHourlyStats() {
    await connectToDb()

    const pipeline = [
      stages.matchWithOrders(),
      stages.unwindOrders(),
      stages.groupByHour(),
      stages.projectHourlyStats(),
      stages.sortByAverageDesc()
    ]

    return await Trip.aggregate(pipeline)
  },

  // Get current hour block analysis with trends
  async getCurrentHourAnalysis() {
    await connectToDb()

    const currentHour = new Date().getHours()
    const nextHour = (currentHour + 1) % 24
    const hourBlock = `${currentHour % 12 || 12}${currentHour < 12 ? 'am' : 'pm'} - ${nextHour % 12 || 12}${nextHour < 12 ? 'am' : 'pm'}`

    // Get all hourly stats (for peak hour)
    const allHourlyStats = await this.getHourlyStats()

    // Get specific hour block stats with trend
    const recentDate = new Date(Date.now() - RECENT_DAYS_THRESHOLD * MS_PER_DAY)

    const hourBlockStats = await Trip.aggregate([
      stages.matchWithOrders(),
      stages.unwindOrders(),
      { $match: { "orders.hourBlock": hourBlock }},
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          acceptedOrders: {
            $sum: { $cond: [{ $eq: ["$orders.accepted", true] }, 1, 0] }
          },
          uniqueDays: {
            $addToSet: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$startDatetime"
              }
            }
          },
          recentOrders: {
            $sum: {
              $cond: [
                { $gte: ["$startDatetime", recentDate] },
                1,
                0
              ]
            }
          },
          recentDays: {
            $addToSet: {
              $cond: [
                { $gte: ["$startDatetime", recentDate] },
                {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$startDatetime"
                  }
                },
                null
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalDays: { $size: "$uniqueDays" },
          historicalAverage: {
            $round: [
              { $divide: ["$totalOrders", { $size: "$uniqueDays" }] },
              1
            ]
          },
          recentAverage: {
            $round: [
              { $divide: ["$recentOrders", { $size: "$recentDays" }] },
              1
            ]
          },
          acceptanceRate: {
            $round: [
              { $multiply: [
                { $divide: ["$acceptedOrders", "$totalOrders"] },
                100
              ]},
              1
            ]
          }
        }
      }
    ])

    const hourData = hourBlockStats[0] || {
      historicalAverage: 0,
      recentAverage: 0,
      acceptanceRate: 0,
      totalDays: 0
    }

    const trend = hourData.historicalAverage > 0 && hourData.recentAverage > 0
      ? ((hourData.recentAverage - hourData.historicalAverage) / hourData.historicalAverage * 100).toFixed(1)
      : 0

    const peakHour = allHourlyStats[0] || {
      hour: 'No data',
      averageOrders: 0,
      totalDays: 0,
      acceptanceRate: 0
    }

    return {
      selectedHour: {
        timeBlock: hourBlock,
        average: hourData.historicalAverage,
        trend: Number(trend),
        daysRecorded: hourData.totalDays
      },
      peakHour: {
        timeBlock: peakHour.hour,
        average: peakHour.averageOrders,
        acceptanceRate: peakHour.acceptanceRate,
        daysRecorded: peakHour.totalDays
      },
      acceptanceRate: {
        average: hourData.acceptanceRate,
        timeBlock: hourBlock,
        peak: peakHour.acceptanceRate
      }
    }
  },

  // Get daily stats with optional day filter
  async getDailyStats(selectedDay = 'all') {
    await connectToDb()

    const dayMatch = selectedDay !== 'all' ? { dayOfWeek: selectedDay } : {}

    // Run all queries in parallel for efficiency
    const [dailyStats, typeStats, bestHourData] = await Promise.all([
      // Daily order stats by day of week
      Trip.aggregate([
        stages.matchWithOrders(dayMatch),
        stages.unwindOrders(),
        stages.groupByDayOfWeek(),
        stages.projectDailyStats(),
        stages.sortByAverageDesc()
      ]),

      // Type stats (Food vs Shop)
      Trip.aggregate([
        stages.matchWithOrders(dayMatch),
        stages.unwindOrders(),
        stages.groupByOrderType(),
        stages.projectTypeStats(),
        { $sort: { totalOrders: -1 }}
      ]),

      // Best hours by day
      Trip.aggregate([
        stages.matchWithOrders(dayMatch),
        stages.unwindOrders(),
        {
          $group: {
            _id: {
              day: "$dayOfWeek",
              hour: "$orders.hourBlock"
            },
            totalOrders: { $sum: 1 },
            uniqueDays: {
              $addToSet: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$startDatetime"
                }
              }
            }
          }
        },
        {
          $project: {
            day: "$_id.day",
            hour: "$_id.hour",
            _id: 0,
            averageOrders: {
              $round: [
                { $divide: ["$totalOrders", { $size: "$uniqueDays" }] },
                1
              ]
            }
          }
        },
        { $sort: { averageOrders: -1 }}
      ])
    ])

    // Get acceptance rate stats
    const acceptanceStats = await Trip.aggregate([
      stages.matchWithOrders(dayMatch),
      stages.unwindOrders(),
      {
        $group: {
          _id: "$dayOfWeek",
          totalOrders: { $sum: 1 },
          acceptedOrders: {
            $sum: { $cond: [{ $eq: ["$orders.accepted", true] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          day: "$_id",
          _id: 0,
          acceptanceRate: {
            $round: [
              { $multiply: [
                { $divide: ["$acceptedOrders", "$totalOrders"] },
                100
              ]},
              1
            ]
          }
        }
      }
    ])

    // Find best hour for the selected day(s)
    const bestHoursByDay = {}
    bestHourData.forEach(stat => {
      if (!bestHoursByDay[stat.day] || bestHoursByDay[stat.day].averageOrders < stat.averageOrders) {
        bestHoursByDay[stat.day] = {
          hour: stat.hour,
          averageOrders: stat.averageOrders
        }
      }
    })

    let bestTime, busiestDay = null, acceptanceRate = null

    if (selectedDay !== 'all') {
      bestTime = bestHoursByDay[selectedDay] || { hour: 'No data', averageOrders: 0 }
      const dayAcceptance = acceptanceStats.find(stat => stat.day === selectedDay)
      acceptanceRate = dayAcceptance ? dayAcceptance.acceptanceRate : 0
    } else {
      const allHours = Object.values(bestHoursByDay)
      bestTime = allHours.reduce((best, current) =>
        current.averageOrders > best.averageOrders ? current : best
      , { hour: 'No data', averageOrders: 0 })

      if (dailyStats.length > 0) {
        busiestDay = {
          day: dailyStats[0].day,
          averageOrders: dailyStats[0].averageOrders
        }
      }

      if (acceptanceStats.length > 0) {
        const totalAcceptanceRate = acceptanceStats.reduce((sum, stat) => sum + stat.acceptanceRate, 0)
        acceptanceRate = +(totalAcceptanceRate / acceptanceStats.length).toFixed(1)
      }
    }

    return {
      dailyStats,
      bestTime,
      busiestDay,
      acceptanceRate,
      typeStats
    }
  },

  // Get hourly breakdown for a specific day
  async getDailyHourlyBreakdown(selectedDay) {
    await connectToDb()

    if (!selectedDay || selectedDay === 'all') {
      throw new Error('Day parameter is required')
    }

    const hourlyBreakdown = await Trip.aggregate([
      {
        $match: {
          dayOfWeek: selectedDay,
          "orders.0": { $exists: true }
        }
      },
      stages.unwindOrders(),
      {
        $group: {
          _id: {
            hour: "$orders.hourBlock",
            type: "$orders.type"
          },
          count: { $sum: 1 },
          accepted: {
            $sum: { $cond: ["$orders.accepted", 1, 0] }
          },
          declined: {
            $sum: { $cond: ["$orders.accepted", 0, 1] }
          },
          uniqueDays: {
            $addToSet: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$startDatetime"
              }
            }
          }
        }
      },
      {
        $project: {
          hour: "$_id.hour",
          type: "$_id.type",
          count: 1,
          accepted: 1,
          declined: 1,
          average: {
            $round: [
              { $divide: ["$count", { $size: "$uniqueDays" }] },
              1
            ]
          },
          uniqueDayCount: { $size: "$uniqueDays" }
        }
      },
      { $sort: { hour: 1, type: 1 } }
    ])

    // Transform into nested structure
    const hourlyStats = {}
    hourlyBreakdown.forEach(stat => {
      if (!hourlyStats[stat.hour]) {
        hourlyStats[stat.hour] = {
          total: 0,
          average: 0,
          types: {}
        }
      }

      hourlyStats[stat.hour].types[stat.type] = {
        count: stat.count,
        average: stat.average,
        accepted: stat.accepted,
        declined: stat.declined,
        uniqueDayCount: stat.uniqueDayCount
      }

      hourlyStats[stat.hour].total += stat.count
      hourlyStats[stat.hour].average += stat.average
    })

    return { hourlyStats, day: selectedDay }
  },

  // Get time analysis (trip duration stats)
  async getTimeAnalysis(selectedDay = 'all') {
    await connectToDb()

    const matchStage = {
      endDatetime: { $exists: true },
      startDatetime: { $exists: true },
      isActive: false,
      ...(selectedDay !== 'all' ? { dayOfWeek: selectedDay } : {})
    }

    if (selectedDay === 'all') {
      // Group by day of week
      const timeStats = await Trip.aggregate([
        { $match: matchStage },
        {
          $addFields: {
            tripDuration: {
              $divide: [
                { $subtract: ['$endDatetime', '$startDatetime'] },
                1000 * 60 * 60
              ]
            }
          }
        },
        {
          $group: {
            _id: "$dayOfWeek",
            avgTripTime: { $avg: "$tripDuration" },
            totalTimeOut: { $sum: "$tripDuration" },
            dayCount: {
              $addToSet: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$startDatetime"
                }
              }
            },
            tripCount: { $sum: 1 }
          }
        },
        {
          $project: {
            day: "$_id",
            _id: 0,
            avgTripTime: { $round: ["$avgTripTime", 2] },
            avgTimeOut: {
              $round: [
                { $divide: ["$totalTimeOut", { $size: "$dayCount" }] },
                2
              ]
            },
            tripCount: 1,
            daysWorked: { $size: "$dayCount" }
          }
        },
        { $sort: { day: 1 } }
      ])

      return { timeStats }
    } else {
      // Group by date for specific day
      const timeStats = await Trip.aggregate([
        { $match: matchStage },
        {
          $addFields: {
            tripDuration: {
              $divide: [
                { $subtract: ['$endDatetime', '$startDatetime'] },
                1000 * 60 * 60
              ]
            }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$startDatetime'
              }
            },
            avgTripTime: { $avg: '$tripDuration' },
            totalTimeOut: { $sum: '$tripDuration' },
            tripCount: { $sum: 1 }
          }
        },
        {
          $project: {
            date: '$_id',
            _id: 0,
            avgTripTime: { $round: ['$avgTripTime', 2] },
            totalTimeOut: { $round: ['$totalTimeOut', 2] },
            tripCount: 1
          }
        },
        { $sort: { date: 1 } }
      ])

      return { timeStats }
    }
  },

  // Get monthly analytics
  async getMonthlyStats() {
    await connectToDb()

    const [monthlyStats, dayStats, hourlyStats] = await Promise.all([
      // Monthly stats
      Trip.aggregate([
        stages.matchWithOrders(),
        stages.unwindOrders(),
        stages.groupByMonth(),
        {
          $project: {
            month: "$_id",
            _id: 0,
            daysWorked: { $size: "$uniqueDays" },
            ordersPerDay: {
              $round: [
                { $divide: ["$totalOrders", { $size: "$uniqueDays" }] },
                1
              ]
            },
            acceptanceRate: {
              $round: [
                { $multiply: [
                  { $divide: ["$acceptedOrders", "$totalOrders"] },
                  100
                ]},
                1
              ]
            },
            milesPerOrder: {
              $round: [
                { $divide: ["$totalMiles", "$totalOrders"] },
                1
              ]
            }
          }
        },
        { $sort: { month: -1 } }
      ]),

      // Best day
      Trip.aggregate([
        stages.matchWithOrders(),
        stages.unwindOrders(),
        stages.groupByDayOfWeek(),
        stages.projectDailyStats(),
        stages.sortByAverageDesc(),
        { $limit: 1 }
      ]),

      // Best hour
      Trip.aggregate([
        stages.matchWithOrders(),
        stages.unwindOrders(),
        stages.groupByHour(),
        stages.projectHourlyStats(),
        stages.sortByAverageDesc(),
        { $limit: 1 }
      ])
    ])

    const currentMonth = new Date().toLocaleString('en-US', { month: 'long' })
    const currentMonthData = monthlyStats.find(stat => stat.month === currentMonth) || {
      ordersPerDay: 0,
      acceptanceRate: 0,
      milesPerOrder: 0,
      daysWorked: 0
    }

    const bestDay = dayStats[0] ? {
      name: dayStats[0].day,
      average: dayStats[0].averageOrders
    } : { name: 'No data', average: 0 }

    const bestHour = hourlyStats[0] ? {
      time: hourlyStats[0].hour,
      average: hourlyStats[0].averageOrders
    } : { time: 'No data', average: 0 }

    return {
      monthlyStats,
      currentMonth: {
        name: currentMonth,
        ...currentMonthData
      },
      bestDay,
      bestHour
    }
  },

  // Get quick insights - digestible facts about your delivery patterns
  async getQuickInsights() {
    await connectToDb()

    // Run all queries in parallel for speed
    const [
      dailyStats,
      hourlyStats,
      typeStats,
      recentTrends,
      hourlyByDay
    ] = await Promise.all([
      // Best and worst days
      Trip.aggregate([
        stages.matchWithOrders(),
        stages.unwindOrders(),
        stages.groupByDayOfWeek(),
        stages.projectDailyStats(),
        { $sort: { averageOrders: -1 } }
      ]),

      // Best and worst hours
      Trip.aggregate([
        stages.matchWithOrders(),
        stages.unwindOrders(),
        stages.groupByHour(),
        stages.projectHourlyStats(),
        { $sort: { averageOrders: -1 } } // Sort by average, not by hour
      ]),

      // Food vs Shop breakdown
      Trip.aggregate([
        stages.matchWithOrders(),
        stages.unwindOrders(),
        stages.groupByOrderType(),
        stages.projectTypeStats()
      ]),

      // Recent trends (last 30 days)
      Trip.aggregate([
        {
          $match: {
            startDatetime: { $gte: new Date(Date.now() - 30 * MS_PER_DAY) },
            "orders.0": { $exists: true }
          }
        },
        stages.unwindOrders(),
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            acceptedOrders: {
              $sum: { $cond: [{ $eq: ["$orders.accepted", true] }, 1, 0] }
            },
            uniqueDays: {
              $addToSet: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$startDatetime"
                }
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            daysWorked: { $size: "$uniqueDays" },
            avgPerDay: {
              $round: [
                { $divide: ["$totalOrders", { $size: "$uniqueDays" }] },
                1
              ]
            },
            acceptanceRate: {
              $round: [
                { $multiply: [
                  { $divide: ["$acceptedOrders", "$totalOrders"] },
                  100
                ]},
                1
              ]
            }
          }
        }
      ]),

      // Best hour for each day of week
      Trip.aggregate([
        stages.matchWithOrders(),
        stages.unwindOrders(),
        {
          $group: {
            _id: {
              day: "$dayOfWeek",
              hour: "$orders.hourBlock"
            },
            totalOrders: { $sum: 1 },
            uniqueDays: {
              $addToSet: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$startDatetime"
                }
              }
            }
          }
        },
        {
          $project: {
            day: "$_id.day",
            hour: "$_id.hour",
            _id: 0,
            totalDays: { $size: "$uniqueDays" },
            averageOrders: {
              $round: [
                { $divide: ["$totalOrders", { $size: "$uniqueDays" }] },
                1
              ]
            }
          }
        },
        { $sort: { day: 1, averageOrders: -1 } }
      ])
    ])

    // Process the data into insights
    const insights = []

    // Best day
    if (dailyStats.length > 0) {
      const bestDay = dailyStats[0]
      insights.push({
        type: 'success',
        icon: '📈',
        title: 'Best Day',
        fact: `${bestDay.day}s average ${bestDay.averageOrders} orders/day`,
        detail: `Based on ${bestDay.uniqueDayCount} ${bestDay.day}s worked`
      })
    }

    // Worst day
    if (dailyStats.length > 1) {
      const worstDay = dailyStats[dailyStats.length - 1]
      insights.push({
        type: 'info',
        icon: '📉',
        title: 'Slowest Day',
        fact: `${worstDay.day}s average ${worstDay.averageOrders} orders/day`,
        detail: `Consider taking ${worstDay.day}s off`
      })
    }

    // Best hour - filter out hours with very few data points to avoid outliers
    if (hourlyStats.length > 0) {
      // Find the best hour that has at least 10 days of data to avoid statistical anomalies
      const reliableHours = hourlyStats.filter(h => h.totalDays >= 10)
      const bestHour = reliableHours.length > 0 ? reliableHours[0] : hourlyStats[0]

      insights.push({
        type: 'success',
        icon: '⏰',
        title: 'Peak Hour',
        fact: `${bestHour.hour} - ${bestHour.averageOrders} orders/hr`,
        detail: `${bestHour.acceptanceRate}% acceptance rate`
      })
    }

    // Worst hour (if significantly lower)
    if (hourlyStats.length > 1) {
      const worstHour = hourlyStats[hourlyStats.length - 1]
      const bestHour = hourlyStats[0]
      if (worstHour.averageOrders < bestHour.averageOrders * 0.3) {
        insights.push({
          type: 'warning',
          icon: '💤',
          title: 'Dead Hour',
          fact: `${worstHour.hour} - only ${worstHour.averageOrders} orders/hr`,
          detail: `Maybe skip this time slot`
        })
      }
    }

    // Food vs Shop preference
    if (typeStats.length > 0) {
      const totalOrders = typeStats.reduce((sum, stat) => sum + stat.totalOrders, 0)
      const foodStat = typeStats.find(s => s.type === 'Food')
      const shopStat = typeStats.find(s => s.type === 'Shop')

      if (foodStat && shopStat) {
        const foodPercent = Math.round((foodStat.totalOrders / totalOrders) * 100)
        const dominant = foodPercent > 60 ? 'Food' : foodPercent < 40 ? 'Shop' : null

        if (dominant) {
          insights.push({
            type: 'info',
            icon: dominant === 'Food' ? '🍔' : '🛒',
            title: 'Order Type',
            fact: `${dominant} orders dominate at ${foodPercent > 60 ? foodPercent : 100 - foodPercent}%`,
            detail: `${foodStat.totalOrders} food vs ${shopStat.totalOrders} shop orders`
          })
        }
      }
    }

    // Recent performance
    if (recentTrends.length > 0) {
      const recent = recentTrends[0]
      insights.push({
        type: 'info',
        icon: '📊',
        title: 'Last 30 Days',
        fact: `${recent.avgPerDay} orders/day average`,
        detail: `Worked ${recent.daysWorked} days • ${recent.acceptanceRate}% acceptance`
      })
    }

    // Consistency check
    if (dailyStats.length > 0) {
      const avgDiff = dailyStats[0].averageOrders - dailyStats[dailyStats.length - 1].averageOrders
      if (avgDiff > 5) {
        insights.push({
          type: 'info',
          icon: '🎯',
          title: 'Strategy Tip',
          fact: `Focus on ${dailyStats[0].day}s and ${dailyStats[1]?.day || 'peak hours'}`,
          detail: `Your best days earn ${avgDiff.toFixed(1)} more orders/day`
        })
      }
    }

    // Acceptance rate insights
    const avgAcceptance = dailyStats.reduce((sum, s) => sum + (s.acceptanceRate || 0), 0) / dailyStats.length
    if (avgAcceptance < 60) {
      insights.push({
        type: 'warning',
        icon: '⚠️',
        title: 'Low Acceptance',
        fact: `${avgAcceptance.toFixed(0)}% acceptance rate`,
        detail: `You decline a lot - are orders worth it?`
      })
    } else if (avgAcceptance > 80) {
      insights.push({
        type: 'success',
        icon: '✅',
        title: 'High Acceptance',
        fact: `${avgAcceptance.toFixed(0)}% acceptance rate`,
        detail: `Orders must be consistently good!`
      })
    }

    // Best hour for each day - show top 3 busiest days with their peak hours
    if (hourlyByDay.length > 0 && dailyStats.length > 0) {
      const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

      // Group by day and find best hour for each
      const bestHoursByDay = {}
      hourlyByDay.forEach(stat => {
        if (!bestHoursByDay[stat.day]) {
          // Filter for reliable data (at least 5 occurrences)
          if (stat.totalDays >= 5) {
            bestHoursByDay[stat.day] = {
              hour: stat.hour,
              average: stat.averageOrders,
              totalDays: stat.totalDays
            }
          }
        }
      })

      // Get the top 3 busiest days
      const topDays = dailyStats.slice(0, 3)

      topDays.forEach((dayStat, index) => {
        const dayName = dayStat.day
        const bestHourForDay = bestHoursByDay[dayName]

        if (bestHourForDay) {
          const dayEmojis = ['🥇', '🥈', '🥉']
          insights.push({
            type: 'info',
            icon: dayEmojis[index] || '📅',
            title: `${dayName}s Peak`,
            fact: `${bestHourForDay.hour} - ${bestHourForDay.average} orders/hr`,
            detail: `Your #${index + 1} day averages ${dayStat.averageOrders} orders/day`
          })
        }
      })
    }

    return insights
  }
}
