import { NextResponse } from 'next/server';
import connectToDb from '@/lib/mongodb';
import Trip from '@/models/entry';

export async function GET() {
  try {
    await connectToDb();
    const trips = await Trip.find({}).sort({ startDatetime: -1 });

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
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month} ${day}, ${year}`;
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