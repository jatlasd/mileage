import { NextResponse } from "next/server";
import connectToDb from "@/lib/mongodb";
import mongoose from "mongoose";
import Trip from "@/models/entry";

export async function PATCH(request, { params }) {
  try {
    await connectToDb();
    const { id } = await params;
    const { type, accepted } = await request.json();

    const orderTime = new Date()
    const estOrderTime = new Date(orderTime.toLocaleString('en-US', { timeZone: 'America/New_York' }))
    const hour = estOrderTime.getHours()
    const nextHour = (hour + 1) % 24
    const hourBlock = `${hour % 12 || 12}${hour < 12 ? 'am' : 'pm'} - ${nextHour % 12 || 12}${nextHour < 12 ? 'am' : 'pm'}`

    const trip = await Trip.findByIdAndUpdate(
      id,
      {
        $push: {
          orders: {
            time: orderTime,
            hourBlock,
            type,
            accepted
          },
        },
      },
      { new: true }
    );

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDb();
    const { id } = params;
    const { orders } = await request.json();

    const trip = await Trip.findByIdAndUpdate(
      id,
      { orders },
      { new: true }
    );

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
