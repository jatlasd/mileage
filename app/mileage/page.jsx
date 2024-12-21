'use client';

import { useState, useEffect } from 'react';
import { CalendarDays, Clock, Car } from 'lucide-react';

export default function MileagePage() {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTrips() {
      try {
        const res = await fetch('/api/entry');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setTrips(data);
      } catch (err) {
        console.error('Error fetching trips:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTrips();
  }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-background text-text flex items-center justify-center">
      Loading...
    </div>;
  }

  if (error) {
    return <div className="min-h-screen bg-background text-text flex items-center justify-center">
      Error loading trips: {error}
    </div>;
  }

  const getMileageForDateRange = (startDate) => {
    return trips
      .filter(trip => new Date(trip.startDatetime) >= startDate)
      .reduce((acc, trip) => acc + (trip.tripMiles || 0), 0);
  };

  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const stats = {
    ytd: getMileageForDateRange(startOfYear),
    month: getMileageForDateRange(startOfMonth),
    week: getMileageForDateRange(startOfWeek),
    today: getMileageForDateRange(startOfDay)
  };

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="bg-muted/30">
        <div className="p-4 flex items-center gap-8">
          <div className="flex items-baseline gap-3">
            <h1 className="text-sm font-medium text-muted-foreground">TODAY</h1>
            <span className="font-mono text-2xl text-primary">{stats.today.toFixed(1)}</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-muted-foreground mr-2">YTD</span>
              <span className="font-mono">{stats.ytd.toFixed(1)}</span>
            </div>
            <div>
              <span className="text-muted-foreground mr-2">{new Date().toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
              <span className="font-mono">{stats.month.toFixed(1)}</span>
            </div>
            <div>
              <span className="text-muted-foreground mr-2">WEEK</span>
              <span className="font-mono">{stats.week.toFixed(1)}</span>
            </div>
            <div>
              <span className="text-muted-foreground mr-2">AVG</span>
              <span className="font-mono">{trips.length ? (stats.ytd / trips.length).toFixed(1) : '0.0'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">RECENT TRIPS</h2>
          <div className="text-sm text-muted-foreground">{trips.length} total</div>
        </div>

        {trips.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No trips recorded yet
          </div>
        ) : (
          <div className="space-y-3">
            {trips.map((trip) => {
              const startTime = new Date(trip.startDatetime);
              const endTime = trip.endDatetime ? new Date(trip.endDatetime) : null;
              const duration = endTime 
                ? Math.round((endTime - startTime) / (1000 * 60))
                : null;

              return (
                <div 
                  key={trip._id} 
                  className="group relative bg-muted/50 rounded-lg p-4 hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xl">
                          {trip.tripMiles?.toFixed(1) || '--'} mi
                        </span>
                        {trip.isActive && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="w-4 h-4" />
                          <span>
                            {startTime.toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {startTime.toLocaleTimeString([], {
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                          {endTime && (
                            <> 
                              → {endTime.toLocaleTimeString([], {
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </>
                          )}
                        </div>
                        {duration && (
                          <div className="flex items-center gap-1">
                            <span>{duration}m</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Car className="w-4 h-4" />
                      <span className="font-mono">
                        {trip.startMileage} → {trip.endMileage || '...'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
