import 'dotenv/config';
import mongoose from 'mongoose';

const TripSchema = new mongoose.Schema({
  startDatetime: { type: Date, default: Date.now },
  endDatetime: { type: Date },
  month: { type: String },
  dayOfWeek: { type: String },
  zone: { type: String, default: 'Swedesboro' },
  startMileage: { type: Number, required: true },
  endMileage: { type: Number },
  tripMiles: { type: Number },
  isActive: { type: Boolean, default: true },
  breaks: [{}],
  orders: [{}],
  totalBreakDuration: { type: Number, default: 0 }
});

const Trip = mongoose.models.Trip || mongoose.model('Trip', TripSchema);

const corrections = [
  {
    tripId: '67ae67b73e45c257e0df2a12',
    date: 'Feb 13, 2025',
    oldEndMileage: 135227,
    newEndMileage: 134227
  },
  {
    tripId: '67d21a66cce0c7e689320beb',
    date: 'Mar 12, 2025',
    oldEndMileage: 167794,
    newEndMileage: 137794
  },
  {
    tripId: '68e18c4eb123dea72ad3ab19',
    date: 'Oct 4, 2025',
    oldEndMileage: 459769,
    newEndMileage: 159769
  }
];

async function fixMileageErrors() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!\n');

    for (const correction of corrections) {
      const trip = await Trip.findById(correction.tripId);
      
      if (!trip) {
        console.log(`❌ Trip ${correction.tripId} not found!`);
        continue;
      }

      const newTripMiles = correction.newEndMileage - trip.startMileage;

      console.log(`📍 Fixing trip from ${correction.date}:`);
      console.log(`   Trip ID: ${correction.tripId}`);
      console.log(`   Start Mileage: ${trip.startMileage.toLocaleString()}`);
      console.log(`   Old End Mileage: ${trip.endMileage.toLocaleString()} → New: ${correction.newEndMileage.toLocaleString()}`);
      console.log(`   Old Trip Miles: ${trip.tripMiles.toLocaleString()} → New: ${newTripMiles.toLocaleString()}`);

      await Trip.findByIdAndUpdate(correction.tripId, {
        endMileage: correction.newEndMileage,
        tripMiles: newTripMiles
      });

      console.log(`   ✅ Updated successfully!\n`);
    }

    console.log('All corrections applied successfully!');
    
    await mongoose.disconnect();
    console.log('\nDatabase connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing mileage:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

fixMileageErrors();



