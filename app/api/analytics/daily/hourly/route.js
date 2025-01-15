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

    return NextResponse.json({
      hourlyStats,
      day: selectedDay
    })
  } catch (error) {
    console.error("Error in hourly analytics:", error)
    return NextResponse.json({ error: "Failed to fetch hourly analytics" }, { status: 500 })
  }
}
