import 'dotenv/config';
import mongoose from 'mongoose';

const TripSchema = new mongoose.Schema({
  startDatetime: { type: Date },
  endDatetime: { type: Date },
  startMileage: { type: Number },
  endMileage: { type: Number },
  tripMiles: { type: Number },
  zone: { type: String }
});

const Trip = mongoose.models.Trip || mongoose.model('Trip', TripSchema);

async function checkDecember() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!\n');

    const startOfDec = new Date('2025-12-01T00:00:00.000Z');
    const endOfDec = new Date('2025-12-31T23:59:59.999Z');

    const trips = await Trip.find({
      startDatetime: { $gte: startOfDec, $lte: endOfDec }
    }).sort({ startDatetime: 1 });

    console.log(`Found ${trips.length} trips in December 2025\n`);
    
    console.log('Date                 | Start Odo  | End Odo    | Trip Miles');
    console.log('─'.repeat(60));
    
    trips.forEach(trip => {
      const date = trip.startDatetime.toLocaleDateString('en-US', { 
        month: 'short', 
        day: '2-digit',
        weekday: 'short'
      });
      const startOdo = trip.startMileage?.toLocaleString().padStart(10) || 'N/A';
      const endOdo = trip.endMileage?.toLocaleString().padStart(10) || 'N/A';
      const miles = trip.tripMiles?.toString().padStart(10) || 'N/A';
      
      console.log(`${date.padEnd(20)} | ${startOdo} | ${endOdo} | ${miles}`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
  }
}

checkDecember();

