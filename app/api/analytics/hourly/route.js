import { connectToDb } from '@/lib/mongodb'
import Trip from '@/models/entry'

export async function GET(request) {
  try {
    await connectToDb()

    const matchStage = {
      "orders.0": { $exists: true }
    }

    // Get the hour we're analyzing (for planning purposes)
    const currentHour = new Date().getHours()
    const nextHour = (currentHour + 1) % 24
    const hourBlock = `${currentHour % 12 || 12}${currentHour < 12 ? 'am' : 'pm'} - ${nextHour % 12 || 12}${nextHour < 12 ? 'am' : 'pm'}`

    // Get historical stats for this hour block
    const hourBlockStats = await Trip.aggregate([
      { $match: matchStage },
      { $unwind: "$orders" },
      { $match: { "orders.hourBlock": hourBlock }},
      { $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        acceptedOrders: {
          $sum: { $cond: [{ $eq: ["$orders.accepted", true] }, 1, 0] }
        },
        uniqueDays: { $addToSet: { 
          $dateToString: { 
            format: "%Y-%m-%d", 
            date: "$startDatetime" 
          }
        }},
        recentOrders: {
          $sum: {
            $cond: [
              { 
                $gte: [
                  "$startDatetime",
                  new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
                ]
              },
              1,
              0
            ]
          }
        },
        recentDays: {
          $addToSet: {
            $cond: [
              { 
                $gte: [
                  "$startDatetime",
                  new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
                ]
              },
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
      }},
      { $project: {
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
      }}
    ])

    // Get stats for all hours to find peak and patterns
    const hourlyStats = await Trip.aggregate([
      { $match: matchStage },
      { $unwind: "$orders" },
      { $group: {
        _id: "$orders.hourBlock",
        totalOrders: { $sum: 1 },
        acceptedOrders: {
          $sum: { $cond: [{ $eq: ["$orders.accepted", true] }, 1, 0] }
        },
        uniqueDays: { $addToSet: { 
          $dateToString: { 
            format: "%Y-%m-%d", 
            date: "$startDatetime" 
          }
        }}
      }},
      { $project: {
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
      }},
      { $sort: { averageOrders: -1 }}
    ])

    // Get peak hour data
    const peakHourData = hourlyStats.length > 0 
      ? { 
          hour: hourlyStats[0].hour, 
          averageOrders: hourlyStats[0].averageOrders,
          totalDays: hourlyStats[0].totalDays,
          acceptanceRate: hourlyStats[0].acceptanceRate
        }
      : { hour: 'No data', averageOrders: 0, totalDays: 0, acceptanceRate: 0 }

    // Get stats for the hour block we're analyzing
    const hourData = hourBlockStats[0] || { historicalAverage: 0, recentAverage: 0, acceptanceRate: 0, totalDays: 0 }
    
    // Calculate trend (comparing recent to historical)
    const trend = hourData.historicalAverage > 0 && hourData.recentAverage > 0
      ? ((hourData.recentAverage - hourData.historicalAverage) / hourData.historicalAverage * 100).toFixed(1)
      : 0

    return Response.json({
      selectedHour: {
        timeBlock: hourBlock,
        average: hourData.historicalAverage,
        trend: Number(trend),
        daysRecorded: hourData.totalDays
      },
      peakHour: {
        timeBlock: peakHourData.hour,
        average: peakHourData.averageOrders,
        acceptanceRate: peakHourData.acceptanceRate,
        daysRecorded: peakHourData.totalDays
      },
      acceptanceRate: {
        average: hourData.acceptanceRate,
        timeBlock: hourBlock,
        peak: peakHourData.acceptanceRate
      }
    })
  } catch (error) {
    console.error('Analytics Error:', error)
    return Response.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
} 