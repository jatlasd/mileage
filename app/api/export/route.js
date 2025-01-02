import { NextResponse } from 'next/server';
import connectToDb from '@/lib/mongodb';
import Trip from '@/models/entry';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    await connectToDb();
    
    const query = {};
    if (startDate && endDate) {
      query.startDatetime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const trips = await Trip.find(query).sort({ startDatetime: -1 });

    const headers = [
      'Date',
      'Start Mileage',
      'End Mileage',
      'Business Miles'
    ];

    const data = trips.map(trip => {
      const startDate = trip.startDatetime ? new Date(trip.startDatetime) : null;
      
      const formatDate = (date) => {
        if (!date) return '';
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${month}/${day}`;
      };
      
      const escapeField = (field) => {
        if (field === null || field === undefined) return '""';
        return `"${field.toString().replace(/"/g, '""')}"`;
      };

      return [
        escapeField(formatDate(startDate)),
        escapeField(trip.startMileage || ''),
        escapeField(trip.endMileage || ''),
        escapeField(trip.tripMiles ? trip.tripMiles.toFixed(1) : '')
      ];
    });

    // Calculate total business miles
    const totalMiles = trips.reduce((sum, trip) => sum + (trip.tripMiles || 0), 0);
    
    // Add a blank row and total
    data.push([]);  // blank row
    data.push([
      '"Total Business Miles:"',
      '""',
      '""',
      `"${totalMiles.toFixed(1)}"`
    ]);

    const csvRows = [
      headers.map(h => `"${h}"`).join(','),
      ...data.map(row => row.join(','))
    ];

    return new NextResponse(csvRows.join('\r\n'), {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="mileage_for_taxes.csv"`,
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 