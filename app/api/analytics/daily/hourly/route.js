import { connectToDb } from "@/lib/mongodb"
import Trip from "@/models/entry"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    await connectToDb()
    const { searchParams } = new URL(request.url)
    const selectedDay = searchParams.get("day")

    if (!selectedDay || selectedDay === "all") {
      return NextResponse.json({ error: "Day parameter is required" }, { status: 400 })
    }

    const hourlyBreakdown = await Trip.aggregate([
      {
        $match: {
          dayOfWeek: selectedDay,
          "orders.0": { $exists: true }
        }
      },
      { $unwind: "$orders" },
      {
        $group: {
          _id: {
            hour: "$orders.hourBlock",
            type: "$orders.type"
          },
          count: { $sum: 1 },
          totalEarnings: { $sum: "$orders.total" },
          acceptedCount: {
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
          hour: "$_id.hour",
          type: "$_id.type",
          count: 1,
          averageEarnings: {
            $round: [
              { $divide: ["$totalEarnings", { $size: "$uniqueDays" }] },
              2
            ]
          },
          acceptanceRate: {
            $round: [
              { $multiply: [
                { $divide: ["$acceptedCount", "$count"] },
                100
              ]},
              1
            ]
          },
          ordersPerDay: {
            $round: [
              { $divide: ["$count", { $size: "$uniqueDays" }] },
              1
            ]
          }
        }
      },
      { $sort: { hour: 1, type: 1 } }
    ])

    const hourlyStats = {}
    hourlyBreakdown.forEach(stat => {
      if (!hourlyStats[stat.hour]) {
        hourlyStats[stat.hour] = {
          total: 0,
          acceptanceRate: 0,
          averageEarnings: 0,
          types: {}
        }
      }
      
      hourlyStats[stat.hour].types[stat.type] = {
        count: stat.ordersPerDay,
        acceptanceRate: stat.acceptanceRate,
        averageEarnings: stat.averageEarnings
      }
      
      hourlyStats[stat.hour].total += stat.ordersPerDay
      hourlyStats[stat.hour].acceptanceRate = stat.acceptanceRate
      hourlyStats[stat.hour].averageEarnings += stat.averageEarnings
    })

    return NextResponse.json({
      hourlyStats,
      day: selectedDay
    })
  } catch (error) {
    console.error("Error in hourly analytics:", error)
    return NextResponse.json({ error: "Failed to fetch hourly analytics" }, { status: 500 })
  }
}
