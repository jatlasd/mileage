// app/api/analytics/route.js
import { connectToDb } from '@/lib/mongodb'
import Trip from '@/models/entry'

export async function GET() {
  try {
    await connectToDb();
    
    // Busiest days analysis
    const busiestDays = await Trip.aggregate([
      { $unwind: "$orders" },
      { $group: {
        _id: { dayOfWeek: "$dayOfWeek", month: "$month" },
        orderCount: { $sum: 1 }
      }},
      { $sort: { orderCount: -1 }}
    ]);

    // Busiest hours analysis
    const busiestHours = await Trip.aggregate([
      { $unwind: "$orders" },
      { $group: {
        _id: { hourBlock: "$orders.hourBlock" },
        orderCount: { $sum: 1 }
      }},
      { $sort: { orderCount: -1 }}
    ]);

    // Orders by type analysis
    const ordersByType = await Trip.aggregate([
      { $unwind: "$orders" },
      { $group: {
        _id: { 
          type: "$orders.type",
          dayOfWeek: "$dayOfWeek"
        },
        orderCount: { $sum: 1 }
      }},
      { $sort: { orderCount: -1 }}
    ]);

    // Acceptance rate analysis
    const acceptanceRates = await Trip.aggregate([
      { $unwind: "$orders" },
      { $group: {
        _id: "$dayOfWeek",
        totalOrders: { $sum: 1 },
        acceptedOrders: {
          $sum: { $cond: ["$orders.accepted", 1, 0] }
        }
      }},
      { $project: {
        dayOfWeek: "$_id",
        acceptanceRate: {
          $multiply: [
            { $divide: ["$acceptedOrders", "$totalOrders"] },
            100
          ]
        },
        totalOrders: 1,
        acceptedOrders: 1
      }}
    ]);

    console.log({
      busiestDays,
      busiestHours,
      ordersByType,
      acceptanceRates
    });

    return Response.json({
      busiestDays,
      busiestHours,
      ordersByType,
      acceptanceRates
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    return Response.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}