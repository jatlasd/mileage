import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const TripSchema = new mongoose.Schema({
  startDatetime: { type: Date },
  endDatetime: { type: Date },
  month: { type: String },
  startMileage: { type: Number },
  endMileage: { type: Number },
  tripMiles: { type: Number },
});

async function debugYearFilter() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Trip = mongoose.model('Trip', TripSchema);
  
  const decemberTrips = await Trip.find({
    month: 'December'
  }).sort({ startDatetime: -1 }).select('startDatetime month startMileage endMileage tripMiles');
  
  console.log('All December trips (any year):');
  console.log('================================');
  
  decemberTrips.forEach(trip => {
    const date = new Date(trip.startDatetime);
    const yearET = date.toLocaleString('en-US', { year: 'numeric', timeZone: 'America/New_York' });
    const fullDateET = date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/New_York' 
    });
    console.log(`${fullDateET} | Year (ET): ${yearET} | Mileage: ${trip.startMileage}-${trip.endMileage} (${trip.tripMiles} mi)`);
  });
  
  console.log('\n\nGrouped by year (ET timezone):');
  console.log('================================');
  
  const byYear = {};
  decemberTrips.forEach(trip => {
    const date = new Date(trip.startDatetime);
    const yearET = date.toLocaleString('en-US', { year: 'numeric', timeZone: 'America/New_York' });
    if (!byYear[yearET]) byYear[yearET] = [];
    byYear[yearET].push(trip);
  });
  
  Object.keys(byYear).sort().reverse().forEach(year => {
    console.log(`\n${year}: ${byYear[year].length} trips`);
    console.log(`  Mileage range: ${byYear[year][byYear[year].length-1].startMileage} - ${byYear[year][0].endMileage}`);
  });
  
  await mongoose.disconnect();
}

debugYearFilter().catch(console.error);
