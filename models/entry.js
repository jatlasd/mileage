import mongoose from 'mongoose';

const TripSchema = new mongoose.Schema({
  startDatetime: { type: Date, default: Date.now },
  endDatetime: { type: Date },
  startMileage: { type: Number, required: true },
  endMileage: { type: Number },
  tripMiles: { type: Number },
  isActive: { type: Boolean, default: true }
});

export const getAllTrips = async () => {
  const Trip = mongoose.models.Trip || mongoose.model('Trip', TripSchema);
  return await Trip.find({}).sort({ startDatetime: -1 });
};

export const getActiveTrip = async () => {
  const Trip = mongoose.models.Trip || mongoose.model('Trip', TripSchema);
  return await Trip.findOne({ isActive: true });
};

export default mongoose.models.Trip || mongoose.model('Trip', TripSchema);
