import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Income from "@/models/income";

export const POST = async (req) => {
  try {
    await connectDB();
    const body = await req.json();

    const income = await Income.create({
      amount: body.amount,
      month: body.month,
      week: body.week,
    });

    return NextResponse.json(income, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create income entry" },
      { status: 500 }
    );
  }
}