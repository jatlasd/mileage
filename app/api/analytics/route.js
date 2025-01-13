// app/api/analytics/route.js
import { connectToDb } from '@/lib/mongodb'
import Trip from '@/models/entry'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const day = searchParams.get('day');

    if (!day) {
      return Response.json({ error: 'Day parameter is required' }, { status: 400 });
    }

    await connectToDb();
    
    const hourlyStats = await Trip.aggregate([
      { $match: { 
        dayOfWeek: day,
        "orders.0": { $exists: true }
      }},
      { $unwind: "$orders" },
      { $group: {
        _id: "$orders.hourBlock",
        totalOrders: { $sum: 1 },
        uniqueDays: { $addToSet: "$_id" }
      }},
      { $project: {
        hourBlock: "$_id",
        _id: 0,
        totalOrders: 1,
        uniqueDayCount: { $size: "$uniqueDays" },
        averageOrders: {
          $round: [
            { $divide: ["$totalOrders", { $size: "$uniqueDays" }] },
            2
          ]
        }
      }},
      { $sort: { hourBlock: 1 }}
    ]);

    return Response.json({ hourlyStats });
  } catch (error) {
    console.error('Analytics Error:', error);
    return Response.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}