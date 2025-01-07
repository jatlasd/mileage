import mongoose from 'mongoose';

const BreakSchema = new mongoose.Schema({
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  duration: { type: Number }
});

const OrderSchema = new mongoose.Schema({
  time: { type: Date, default: Date.now },
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

TripSchema.pre('save', function(next) {
  if (this.startDatetime) {
    this.month = this.startDatetime.toLocaleString('en-US', { month: 'long' });
    this.dayOfWeek = this.startDatetime.toLocaleString('en-US', { weekday: 'long' });
  }
  next();
});

export const getAllTrips = async () => {
  const Trip = mongoose.models.Trip || mongoose.model('Trip', TripSchema);
  return await Trip.find({}).sort({ startDatetime: -1 });
};

export const getActiveTrip = async () => {
  const Trip = mongoose.models.Trip || mongoose.model('Trip', TripSchema);
  return await Trip.findOne({ isActive: true });
};

export const startBreak = async (tripId) => {
  const Trip = mongoose.models.Trip || mongoose.model('Trip', TripSchema);
  return await Trip.findByIdAndUpdate(
    tripId,
    { $push: { breaks: { startTime: new Date() } } },
    { new: true }
  );
};

export const endBreak = async (tripId) => {
  const Trip = mongoose.models.Trip || mongoose.model('Trip', TripSchema);
  const trip = await Trip.findById(tripId);
  const currentBreak = trip.breaks[trip.breaks.length - 1];
  
  if (currentBreak && !currentBreak.endTime) {
    const endTime = new Date();
    const duration = (endTime - currentBreak.startTime) / 1000;
    
    return await Trip.findByIdAndUpdate(
      tripId,
      {
        $set: { 
          ['breaks.' + (trip.breaks.length - 1) + '.endTime']: endTime,
          ['breaks.' + (trip.breaks.length - 1) + '.duration']: duration
        },
        $inc: { totalBreakDuration: duration }
      },
      { new: true }
    );
  }
  return trip;
};

export default mongoose.models.Trip || mongoose.model('Trip', TripSchema);
