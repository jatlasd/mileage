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

async function checkFirstLastTrip() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!\n');

    const startOf2025 = new Date('2025-01-01T00:00:00.000Z');
    const endOf2025 = new Date('2025-12-31T23:59:59.999Z');

    const firstTrip = await Trip.findOne({
      startDatetime: { $gte: startOf2025, $lte: endOf2025 }
    }).sort({ startDatetime: 1 });

    const lastTrip = await Trip.findOne({
      startDatetime: { $gte: startOf2025, $lte: endOf2025 },
      endMileage: { $exists: true, $ne: null }
    }).sort({ startDatetime: -1 });

    console.log('=== FIRST TRIP OF 2025 ===');
    if (firstTrip) {
      console.log(`Date: ${firstTrip.startDatetime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`);
      console.log(`Start Mileage: ${firstTrip.startMileage?.toLocaleString()}`);
      console.log(`End Mileage: ${firstTrip.endMileage?.toLocaleString()}`);
      console.log(`Trip Miles: ${firstTrip.tripMiles}`);
    }

    console.log('\n=== LAST TRIP OF 2025 (with end mileage) ===');
    if (lastTrip) {
      console.log(`Date: ${lastTrip.startDatetime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`);
      console.log(`Start Mileage: ${lastTrip.startMileage?.toLocaleString()}`);
      console.log(`End Mileage: ${lastTrip.endMileage?.toLocaleString()}`);
      console.log(`Trip Miles: ${lastTrip.tripMiles}`);
    }

    if (firstTrip && lastTrip) {
      const odometerDiff = lastTrip.endMileage - firstTrip.startMileage;
      console.log('\n=== ODOMETER DIFFERENCE ===');
      console.log(`First trip start: ${firstTrip.startMileage?.toLocaleString()}`);
      console.log(`Last trip end: ${lastTrip.endMileage?.toLocaleString()}`);
      console.log(`Total odometer difference: ${odometerDiff.toLocaleString()} miles`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
  }
}

checkFirstLastTrip();



