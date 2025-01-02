export const addOrder = async (tripId) => {
    const Trip = mongoose.models.Trip || mongoose.model('Trip', TripSchema);
    return await Trip.findByIdAndUpdate(
      tripId,
      { $push: { orders: { time: new Date() } } },
      { new: true }
    );
  };