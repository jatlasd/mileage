import { NextResponse } from 'next/server';
import connectToDb from '@/lib/mongodb';
import mongoose from 'mongoose';
import Trip from '@/models/entry';

export async function PATCH(request, { params }) {
    try {
        await connectToDb();
        const { id } = await params;
        
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        const hour = hours >= 12 ? 'pm' : 'am';

        const trip = await Trip.findByIdAndUpdate(
            id,
            { 
                $push: { 
                    orders: {
                        time: time,
                        hour: hour
                    }
                }
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