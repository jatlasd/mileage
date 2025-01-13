import { connectToDb } from '@/lib/mongodb'
import Trip from '@/models/entry'

export async function GET(request) {
  try {
    await connectToDb()

    const matchStage = {
      "orders.0": { $exists: true }
    }

    // Get monthly stats
    const monthlyStats = await Trip.aggregate([
      { $match: matchStage },
      { $unwind: "$orders" },
      { $group: {
        _id: "$month",
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
        totalMiles: { $sum: "$tripMiles" }
      }},
      { $project: {
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
      }},
      { $sort: { month: -1 }}
    ])

    // Get best performing day of week
    const dayStats = await Trip.aggregate([
      { $match: matchStage },
      { $unwind: "$orders" },
      { $group: {
        _id: "$dayOfWeek",
        totalOrders: { $sum: 1 },
        uniqueDays: { $addToSet: { 
          $dateToString: { 
            format: "%Y-%m-%d", 
            date: "$startDatetime" 
          }
        }}
      }},
      { $project: {
        day: "$_id",
        _id: 0,
        daysWorked: { $size: "$uniqueDays" },
        averageOrders: {
          $round: [
            { $divide: ["$totalOrders", { $size: "$uniqueDays" }] },
            1
          ]
        }
      }},
      { $sort: { averageOrders: -1 }}
    ])

    // Get best performing hour
    const hourlyStats = await Trip.aggregate([
      { $match: matchStage },
      { $unwind: "$orders" },
      { $group: {
        _id: "$orders.hourBlock",
        totalOrders: { $sum: 1 },
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
        daysWorked: { $size: "$uniqueDays" },
        averageOrders: {
          $round: [
            { $divide: ["$totalOrders", { $size: "$uniqueDays" }] },
            1
          ]
        }
      }},
      { $sort: { averageOrders: -1 }}
    ])

    // Get current month's data
    const currentMonth = new Date().toLocaleString('en-US', { month: 'long' })
    const currentMonthData = monthlyStats.find(stat => stat.month === currentMonth) || {
      ordersPerDay: 0,
      acceptanceRate: 0,
      milesPerOrder: 0,
      daysWorked: 0
    }

    // Get best day and hour
    const bestDay = dayStats.length > 0 ? {
      name: dayStats[0].day,
      average: dayStats[0].averageOrders
    } : { name: 'No data', average: 0 }

    const bestHour = hourlyStats.length > 0 ? {
      time: hourlyStats[0].hour,
      average: hourlyStats[0].averageOrders
    } : { time: 'No data', average: 0 }

    return Response.json({
      monthlyStats,
      currentMonth: {
        name: currentMonth,
        ordersPerDay: currentMonthData.ordersPerDay,
        acceptanceRate: currentMonthData.acceptanceRate,
        milesPerOrder: currentMonthData.milesPerOrder,
        daysWorked: currentMonthData.daysWorked
      },
      bestDay,
      bestHour
    })
  } catch (error) {
    console.error('Analytics Error:', error)
    return Response.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
} 