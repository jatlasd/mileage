import { NextResponse } from "next/server";
import connectToDb from "@/lib/mongodb";
import mongoose from "mongoose";
import Trip from "@/models/entry";

export async function PATCH(request, { params }) {
  try {
    await connectToDb();
    const { id } = await params;
    const { type, accepted } = await request.json();

    const trip = await Trip.findByIdAndUpdate(
      id,
      {
        $push: {
          orders: {
            time: new Date(),
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
