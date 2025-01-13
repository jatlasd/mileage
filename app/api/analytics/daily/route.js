import { connectToDb } from '@/lib/mongodb'
import Trip from '@/models/entry'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    let selectedDay = searchParams.get('day')

    await connectToDb()

    // Convert day to match the format stored in the database (e.g., "Monday" instead of "Mon")
    const dayMapping = {
      'Mon': 'Monday',
      'Tue': 'Tuesday',
      'Wed': 'Wednesday',
      'Thu': 'Thursday',
      'Fri': 'Friday',
      'Sat': 'Saturday',
      'Sun': 'Sunday',
      'all': 'all'
    }

    selectedDay = dayMapping[selectedDay] || selectedDay

    const matchStage = {
      "orders.0": { $exists: true },
      ...(selectedDay && selectedDay !== 'all' ? { dayOfWeek: selectedDay } : {})
    }

    const hourlyStats = await Trip.aggregate([
      { $match: matchStage },
      { $unwind: "$orders" },
      { $group: {
        _id: {
          day: "$dayOfWeek",
          hour: "$orders.hourBlock"
        },
        totalOrders: { $sum: 1 },
        uniqueDays: { $addToSet: { 
          $dateToString: { 
            format: "%Y-%m-%d", 
            date: "$startDatetime" 
          }
        }}
      }},
      { $project: {
        day: "$_id.day",
        hour: "$_id.hour",
        _id: 0,
        totalOrders: 1,
        uniqueDayCount: { $size: "$uniqueDays" },
        averageOrders: {
          $round: [
            { $divide: ["$totalOrders", { $size: "$uniqueDays" }] },
            1
          ]
        }
      }},
      { $sort: { averageOrders: -1 }}
    ])

    const bestHoursByDay = {}
    hourlyStats.forEach(stat => {
      if (!bestHoursByDay[stat.day] || bestHoursByDay[stat.day].averageOrders < stat.averageOrders) {
        bestHoursByDay[stat.day] = {
          hour: stat.hour,
          averageOrders: stat.averageOrders,
          totalOrders: stat.totalOrders,
          uniqueDayCount: stat.uniqueDayCount
        }
      }
    })

    const acceptanceStats = await Trip.aggregate([
      { $match: matchStage },
      { $unwind: "$orders" },
      { $group: {
        _id: "$dayOfWeek",
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
        },
        uniqueDayCount: { $size: "$uniqueDays" }
      }},
      { $sort: { day: 1 }}
    ])

    const dailyStats = await Trip.aggregate([
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
        totalOrders: 1,
        uniqueDayCount: { $size: "$uniqueDays" },
        averageOrders: {
          $round: [
            { $divide: ["$totalOrders", { $size: "$uniqueDays" }] },
            1
          ]
        }
      }},
      { $sort: { averageOrders: -1 }}
    ])

    let bestTimeData
    let busiestDay = null
    let acceptanceRate = null

    if (selectedDay && selectedDay !== 'all') {
      bestTimeData = bestHoursByDay[selectedDay] || { hour: 'No data', averageOrders: 0 }
      const dayAcceptance = acceptanceStats.find(stat => stat.day === selectedDay)
      acceptanceRate = dayAcceptance ? dayAcceptance.acceptanceRate : 0
    } else {
      const allHours = Object.values(bestHoursByDay)
      bestTimeData = allHours.reduce((best, current) => 
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

    return Response.json({ 
      dailyStats,
      bestTime: {
        hour: bestTimeData.hour,
        averageOrders: bestTimeData.averageOrders
      },
      busiestDay,
      acceptanceRate
    })
  } catch (error) {
    return Response.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
} 