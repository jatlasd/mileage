import { NextResponse } from 'next/server';
import { startBreak, endBreak } from '@/models/entry';
import { connectToDb } from '@/lib/mongodb';

export async function POST(request) {
  try {
    await connectToDb();
    const { tripId, action } = await request.json();

    if (!tripId) {
      return NextResponse.json(
        { error: 'Trip ID is required' },
        { status: 400 }
      );
    }

    if (action === 'start') {
      const trip = await startBreak(tripId);
      return NextResponse.json(trip);
    } else if (action === 'end') {
      const trip = await endBreak(tripId);
      return NextResponse.json(trip);
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "start" or "end"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Break operation failed:', error);
    return NextResponse.json(
      { error: 'Failed to process break operation' },
      { status: 500 }
    );
  }
} 