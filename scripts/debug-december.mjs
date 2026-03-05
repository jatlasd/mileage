import 'dotenv/config';
import mongoose from 'mongoose';

const TripSchema = new mongoose.Schema({
  startDatetime: { type: Date },
  startMileage: { type: Number },
  endMileage: { type: Number },
  tripMiles: { type: Number }
});

const Trip = mongoose.models.Trip || mongoose.model('Trip', TripSchema);

async function debug() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const trips = await Trip.find({
    startDatetime: { $gte: new Date('2025-01-01'), $lte: new Date('2025-12-31T23:59:59.999Z') }
  }).sort({ startDatetime: 1 });
  
  console.log('Total trips in 2025:', trips.length);
  
  const decTrips = trips.filter(t => {
    const month = new Date(t.startDatetime).toLocaleString('en-US', { month: 'long' });
    return month === 'December';
  });
  
  console.log('\nDecember trips count:', decTrips.length);
  console.log('\nFirst December trip:');
  console.log('  Date:', decTrips[0]?.startDatetime);
  console.log('  Start Mileage:', decTrips[0]?.startMileage);
  
  console.log('\nLast December trip:');
  console.log('  Date:', decTrips[decTrips.length-1]?.startDatetime);
  console.log('  End Mileage:', decTrips[decTrips.length-1]?.endMileage);
  
  const monthlyOdometer = {};
  trips.forEach(trip => {
    if (trip.startDatetime) {
      const month = new Date(trip.startDatetime).toLocaleString('en-US', { month: 'long' });
      
      if (!monthlyOdometer[month]) {
        monthlyOdometer[month] = { firstStart: null, lastEnd: null };
      }
      if (monthlyOdometer[month].firstStart === null && trip.startMileage) {
        monthlyOdometer[month].firstStart = trip.startMileage;
      }
      if (trip.endMileage) {
        monthlyOdometer[month].lastEnd = trip.endMileage;
      }
    }
  });
  
  console.log('\n=== Monthly Odometer from script logic ===');
  console.log('December firstStart:', monthlyOdometer['December']?.firstStart);
  console.log('December lastEnd:', monthlyOdometer['December']?.lastEnd);
  
  console.log('\n=== Checking for any trip with startMileage around 130,944 ===');
  const badTrips = trips.filter(t => t.startMileage && t.startMileage < 140000);
  badTrips.forEach(t => {
    console.log('Found:', t.startDatetime, 'Start:', t.startMileage, 'End:', t.endMileage);
  });
  
  await mongoose.disconnect();
}

debug();

