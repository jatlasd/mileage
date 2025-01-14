import { connectToDb } from '@/lib/mongodb'
import Trip from '@/models/entry'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    await connectToDb()
    const { searchParams } = new URL(request.url)
    const selectedDay = searchParams.get('day')

    if (!selectedDay) {
      return NextResponse.json({ error: 'Day parameter is required' }, { status: 400 })
    }

    if (selectedDay === 'all') {
      const timeStats = await Trip.aggregate([
        {
          $match: {
            endDatetime: { $exists: true },
            startDatetime: { $exists: true },
            isActive: false
          }
        },
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
            dayCount: { $addToSet: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$startDatetime"
              }
            }},
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
        {
          $sort: {
            day: 1
          }
        }
      ])

      return NextResponse.json({ timeStats })
    } else {
      const matchStage = {
        dayOfWeek: selectedDay,
        endDatetime: { $exists: true },
        startDatetime: { $exists: true },
        isActive: false
      }

      const timeStats = await Trip.aggregate([
        { $match: matchStage },
        { $addFields: {
          tripDuration: {
            $divide: [
              { $subtract: ['$endDatetime', '$startDatetime'] },
              1000 * 60 * 60
            ]
          }
        }},
        { $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$startDatetime'
            }
          },
          avgTripTime: { $avg: '$tripDuration' },
          totalTimeOut: {
            $sum: '$tripDuration'
          },
          tripCount: { $sum: 1 }
        }},
        { $project: {
          date: '$_id',
          _id: 0,
          avgTripTime: { $round: ['$avgTripTime', 2] },
          totalTimeOut: { $round: ['$totalTimeOut', 2] },
          tripCount: 1
        }},
        { $sort: { date: 1 }}
      ])

      return NextResponse.json({ timeStats })
    }
  } catch (error) {
    console.error('Error in time analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch time analytics' }, { status: 500 })
  }
} 