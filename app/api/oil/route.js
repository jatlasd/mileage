import connectToDb from "@/lib/mongodb";
import OilChange from "@/models/oilChange";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    await connectToDb();
    const body = await request.json();

    const oilChange = await OilChange.create({
      mileage: body.mileage,
      lastChange: new Date(),
    });

    return NextResponse.json(oilChange, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create oil change entry" },
      { status: 500 }
    );
  }
};

export const PATCH = async (request) => {
  try {
    await connectToDb();
    const body = await request.json();
    const lastOilChange = await OilChange.findOne().sort({ date: -1 });

    if (!lastOilChange) {
      return NextResponse.json(
        { error: "No oil change entry found" },
        { status: 404 }
      );
    }

    if (body.mileage !== undefined) {
      lastOilChange.mileage = body.mileage;
      lastOilChange.lastChange = new Date();
    }
    
    if (body.currentlyNeeds !== undefined) {
      lastOilChange.currentlyNeeds = body.currentlyNeeds;
    }

    await lastOilChange.save();
    return NextResponse.json(lastOilChange);
  } catch (error) {
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Invalid data provided" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update oil change entry" },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    await connectToDb();
    const lastOilChange = await OilChange.findOne().sort({ date: -1 });
    return NextResponse.json(lastOilChange);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch oil change entry" },
      { status: 500 }
    );
  }
};
