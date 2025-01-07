import { connectToDb } from '@/lib/mongodb';
import Trip from '@/models/entry';

export const GET = async () => {
  try {
    console.log('Connecting to database...');
    await connectToDb();
    console.log('Connected successfully');
    
    console.log('Fetching trips...');
    const trips = await Trip.find({}).sort({ startDatetime: -1 }).lean();
    console.log(`Found ${trips.length} trips`);
    
    return new Response(JSON.stringify(trips), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Database error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch trips',
      details: error.message 
    }), { 
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
    await connectToDb();

    const activeTrip = await Trip.findOne({ isActive: true });

    if (!activeTrip) {
      const newTrip = new Trip({ 
        startMileage: body.mileage,
        zone: body.zone
      });
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
