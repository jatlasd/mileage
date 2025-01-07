import { NextResponse } from 'next/server';
import connectToDb from '@/lib/mongodb';
import mongoose from 'mongoose';
import Trip from '@/models/entry';

export async function PATCH(request, { params }) {
  try {
    await connectToDb();
    const { id } = await params;
    const { startMileage, endMileage } = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid trip ID' }, { status: 400 });
    }

    const trip = await Trip.findById(id);
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    trip.startMileage = startMileage;
    trip.endMileage = endMileage;
    trip.tripMiles = endMileage - startMileage;

    await trip.save();

    return NextResponse.json(trip);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 