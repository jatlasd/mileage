import 'dotenv/config';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BreakSchema = new mongoose.Schema({
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  duration: { type: Number }
});

const OrderSchema = new mongoose.Schema({
  time: { type: Date, default: Date.now },
  hourBlock: { type: String },
  type: {type: String, default: 'Food'},
  accepted: { type: Boolean, default: true },
  unassigned: { type: Boolean, default: false },
});

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
  breaks: [BreakSchema],
  orders: [OrderSchema],
  totalBreakDuration: { type: Number, default: 0 }
});

const Trip = mongoose.models.Trip || mongoose.model('Trip', TripSchema);

const REASONABLE_MAX_TRIP_MILES = 500;

async function calculate2025Mileage() {
  try {
    console.log('Connecting to database...');
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!\n');

    const startOf2025 = new Date('2025-01-01T00:00:00.000Z');
    const endOf2025 = new Date('2025-12-31T23:59:59.999Z');

    console.log(`Querying trips from ${startOf2025.toISOString()} to ${endOf2025.toISOString()}...\n`);

    const trips = await Trip.find({
      startDatetime: {
        $gte: startOf2025,
        $lte: endOf2025
      },
      tripMiles: { $exists: true, $ne: null }
    }).sort({ startDatetime: 1 });

    console.log(`Found ${trips.length} trips in 2025\n`);

    const suspiciousTrips = trips.filter(t => t.tripMiles > REASONABLE_MAX_TRIP_MILES);
    const validTrips = trips.filter(t => t.tripMiles <= REASONABLE_MAX_TRIP_MILES);

    if (suspiciousTrips.length > 0) {
      console.log('🚨 SUSPICIOUS TRIPS DETECTED (tripMiles > ' + REASONABLE_MAX_TRIP_MILES + '):\n');
      console.log('These trips likely have data entry errors:\n');
      
      suspiciousTrips.forEach(trip => {
        const date = trip.startDatetime ? new Date(trip.startDatetime).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : 'Unknown date';
        
        console.log(`  📍 Trip ID: ${trip._id}`);
        console.log(`     Date: ${date}`);
        console.log(`     Zone: ${trip.zone}`);
        console.log(`     Start Mileage: ${trip.startMileage?.toLocaleString()}`);
        console.log(`     End Mileage: ${trip.endMileage?.toLocaleString()}`);
        console.log(`     Trip Miles: ${trip.tripMiles?.toLocaleString()} ❌`);
        console.log('');
      });

      console.log('─'.repeat(50));
      console.log('');
    }

    const totalMileageRaw = trips.reduce((sum, trip) => sum + (trip.tripMiles || 0), 0);
    const totalMileageCorrected = validTrips.reduce((sum, trip) => sum + (trip.tripMiles || 0), 0);

    const tripsWithMiles = validTrips.filter(t => t.tripMiles && t.tripMiles > 0);
    const tripsWithoutMiles = trips.filter(t => !t.tripMiles || t.tripMiles === 0);

    console.log('=== 2025 MILEAGE SUMMARY ===');
    console.log(`Total Trips: ${trips.length}`);
    console.log(`Valid Trips (≤${REASONABLE_MAX_TRIP_MILES} miles): ${validTrips.length}`);
    console.log(`Suspicious Trips (>${REASONABLE_MAX_TRIP_MILES} miles): ${suspiciousTrips.length}`);
    console.log(`Trips without mileage: ${tripsWithoutMiles.length}`);
    
    if (suspiciousTrips.length > 0) {
      console.log(`\n⚠️  RAW Total (includes errors): ${totalMileageRaw.toLocaleString()} miles`);
      console.log(`✅ CORRECTED Total (excludes suspicious): ${totalMileageCorrected.toLocaleString()} miles`);
    } else {
      console.log(`\n✅ Total Mileage for 2025: ${totalMileageCorrected.toLocaleString()} miles`);
    }
    
    console.log(`   In kilometers: ${(totalMileageCorrected * 1.60934).toLocaleString()} km\n`);

    if (tripsWithoutMiles.length > 0) {
      console.log('⚠️  WARNING: Found trips without mileage data:');
      tripsWithoutMiles.forEach(trip => {
        const date = trip.startDatetime ? new Date(trip.startDatetime).toLocaleDateString() : 'Unknown date';
        console.log(`  - Trip ${trip._id}: ${date} (Start: ${trip.startMileage}, End: ${trip.endMileage})`);
      });
      console.log('');
    }

    const monthlyBreakdown = {};
    const monthlyBreakdownRaw = {};
    const monthlySuspicious = {};
    const monthlyOdometer = {};
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    trips.forEach(trip => {
      if (trip.startDatetime) {
        const month = months[new Date(trip.startDatetime).getUTCMonth()];
        
        if (!monthlyBreakdownRaw[month]) {
          monthlyBreakdownRaw[month] = { trips: 0, miles: 0 };
        }
        monthlyBreakdownRaw[month].trips++;
        monthlyBreakdownRaw[month].miles += (trip.tripMiles || 0);
        
        if (!monthlyOdometer[month]) {
          monthlyOdometer[month] = { firstStart: null, lastEnd: null };
        }
        if (monthlyOdometer[month].firstStart === null && trip.startMileage) {
          monthlyOdometer[month].firstStart = trip.startMileage;
        }
        if (trip.endMileage) {
          monthlyOdometer[month].lastEnd = trip.endMileage;
        }
        
        if (trip.tripMiles <= REASONABLE_MAX_TRIP_MILES) {
          if (!monthlyBreakdown[month]) {
            monthlyBreakdown[month] = { trips: 0, miles: 0 };
          }
          monthlyBreakdown[month].trips++;
          monthlyBreakdown[month].miles += (trip.tripMiles || 0);
        } else {
          if (!monthlySuspicious[month]) {
            monthlySuspicious[month] = [];
          }
          monthlySuspicious[month].push(trip);
        }
      }
    });

    console.log('=== MONTHLY BREAKDOWN (Corrected) ===');
    console.log('');
    console.log('Month        | Trip Miles  | Trips | Start Odo  | End Odo    | Odo Diff');
    console.log('─'.repeat(75));
    
    months.forEach(month => {
      if (monthlyBreakdown[month] || monthlyBreakdownRaw[month]) {
        const corrected = monthlyBreakdown[month]?.miles || 0;
        const raw = monthlyBreakdownRaw[month]?.miles || 0;
        const tripCount = monthlyBreakdown[month]?.trips || 0;
        const suspiciousCount = monthlySuspicious[month]?.length || 0;
        const odo = monthlyOdometer[month] || {};
        const odoDiff = (odo.lastEnd && odo.firstStart) ? odo.lastEnd - odo.firstStart : 0;
        
        const startOdo = odo.firstStart ? odo.firstStart.toLocaleString().padStart(10) : '       N/A';
        const endOdo = odo.lastEnd ? odo.lastEnd.toLocaleString().padStart(10) : '       N/A';
        const odoDiffStr = odoDiff ? odoDiff.toLocaleString().padStart(8) : '     N/A';
        
        let line = `${month.padEnd(12)} | ${corrected.toFixed(0).padStart(10)}  | ${tripCount.toString().padStart(5)} | ${startOdo} | ${endOdo} | ${odoDiffStr}`;
        
        if (suspiciousCount > 0) {
          line += ` ⚠️`;
        }
        
        console.log(line);
      }
    });

    await mongoose.disconnect();
    console.log('\nDatabase connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error calculating mileage:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

calculate2025Mileage();
