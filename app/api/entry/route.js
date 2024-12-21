import dbConnect from '@/lib/mongodb';
import Trip from '@/models/entry';

export const GET = async () => {
  try {
    await dbConnect();
    const trips = await Trip.find({}).sort({ startDatetime: -1 });
    return new Response(JSON.stringify(trips), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch trips' }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const POST = async (request) => {
  try {
    const body = await request.json();
    await dbConnect();

    const activeTrip = await Trip.findOne({ isActive: true });

    if (!activeTrip) {
      const newTrip = new Trip({ startMileage: body.mileage });
      await newTrip.save();
      return new Response(JSON.stringify({ success: true, trip: newTrip }), { 
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      const tripMiles = body.mileage - activeTrip.startMileage;
      activeTrip.endMileage = body.mileage;
      activeTrip.endDatetime = new Date();
      activeTrip.tripMiles = tripMiles;
      activeTrip.isActive = false;
      await activeTrip.save();
      return new Response(JSON.stringify({ success: true, trip: activeTrip }), { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process trip' }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
