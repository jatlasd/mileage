import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Trip from '@/models/entry';
import { connectToDb } from '@/lib/mongodb';

export async function PATCH(request, { params }) {
  await connectToDb();
  
  try {
    const parameters = await params;
    if (!parameters?.id) {
      return NextResponse.json({ error: 'Trip ID is required' }, { status: 400 });
    }

    const data = await request.json();
    const id = parameters.id;

    if (data.orderCount !== undefined) {
      const hour = new Date(data.hour);
      hour.setMinutes(0, 0, 0);

      const trip = await Trip.findById(id);
      if (!trip) {
        return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
      }

      const hourlyOrderIndex = trip.hourlyOrders?.findIndex(
        order => new Date(order.hour).getTime() === hour.getTime()
      ) ?? -1;

      if (hourlyOrderIndex === -1) {
        if (!trip.hourlyOrders) {
          trip.hourlyOrders = [];
        }
        trip.hourlyOrders.push({ hour, orderCount: data.orderCount });
      } else {
        trip.hourlyOrders[hourlyOrderIndex].orderCount = data.orderCount;
      }

      await trip.save();
      return NextResponse.json(trip);
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );

    if (!updatedTrip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    return NextResponse.json(updatedTrip);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 