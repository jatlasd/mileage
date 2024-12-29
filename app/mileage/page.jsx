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
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.details || 'Failed to fetch trips');
        }
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
    return <div className="min-h-[100dvh] bg-background text-text flex items-center justify-center">
      <div className="animate-pulse text-lg">Loading...</div>
    </div>;
  }

  if (error) {
    return <div className="min-h-[100dvh] bg-background text-text flex items-center justify-center p-4">
      <div className="text-red-400 text-center">Error loading trips: {error}</div>
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
    <div className="min-h-[100dvh] bg-background text-text flex flex-col">
      <div className="bg-white/[0.07] border-b border-white/[0.05]">
        <div className="p-5 space-y-4">
          <div className="flex items-baseline gap-3">
            <span className="text-sm font-medium text-text/60">TODAY</span>
            <span className="font-mono text-3xl text-primary">{stats.today.toFixed(1)}</span>
            <span className="text-sm text-text/60">miles</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/[0.03] p-3 rounded-lg">
              <div className="text-text/50 mb-1">YTD</div>
              <div className="font-mono text-lg">{stats.ytd.toFixed(1)}</div>
            </div>
            <div className="bg-white/[0.03] p-3 rounded-lg">
              <div className="text-text/50 mb-1">{new Date().toLocaleString('default', { month: 'short' }).toUpperCase()}</div>
              <div className="font-mono text-lg">{stats.month.toFixed(1)}</div>
            </div>
            <div className="bg-white/[0.03] p-3 rounded-lg">
              <div className="text-text/50 mb-1">WEEK</div>
              <div className="font-mono text-lg">{stats.week.toFixed(1)}</div>
            </div>
            <div className="bg-white/[0.03] p-3 rounded-lg">
              <div className="text-text/50 mb-1">AVG</div>
              <div className="font-mono text-lg">{trips.length ? (stats.ytd / trips.length).toFixed(1) : '0.0'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-5 space-y-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-text/60">RECENT TRIPS</h2>
          <div className="text-sm text-text/40">{trips.length} total</div>
        </div>

        {trips.length === 0 ? (
          <div className="text-center text-text/40 py-8">
            No trips recorded yet
          </div>
        ) : (
          <div className="space-y-3">
            {trips.map((trip) => {
              const startTime = new Date(trip.startDatetime);
              const endTime = trip.endDatetime ? new Date(trip.endDatetime) : null;
              const duration = endTime ? Math.round((endTime - startTime) / (1000 * 60)) : null;
              const totalBreakDuration = trip.totalBreakDuration || 0;
              const netDuration = duration ? duration - Math.round(totalBreakDuration / 60) : null;

              return (
                <div 
                  key={trip._id} 
                  className="bg-white/[0.07] rounded-xl p-4 border border-white/[0.05]"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-2xl">
                          {trip.tripMiles?.toFixed(1) || '--'}
                        </span>
                        <span className="text-text/60">mi</span>
                        {trip.isActive && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-text/50">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="w-3.5 h-3.5" />
                          <span>
                            {startTime.toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
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
                          </span>
                        </div>
                        {duration && (
                          <div className="text-text/40">
                            {netDuration}m (breaks: {Math.round(totalBreakDuration / 60)}m)
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-sm text-text/50 font-mono">
                      {trip.startMileage} → {trip.endMileage || '...'}
                    </div>
                  </div>

                  {trip.breaks && trip.breaks.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/[0.05]">
                      <div className="text-xs text-text/40 mb-2">Breaks:</div>
                      <div className="space-y-1">
                        {trip.breaks.map((breakPeriod, index) => {
                          const breakStart = new Date(breakPeriod.startTime);
                          const breakEnd = breakPeriod.endTime ? new Date(breakPeriod.endTime) : null;
                          return (
                            <div key={index} className="text-xs text-text/60 flex items-center gap-2">
                              <span>
                                {breakStart.toLocaleTimeString([], {
                                  hour: 'numeric',
                                  minute: '2-digit'
                                })}
                                {breakEnd && (
                                  <> 
                                    → {breakEnd.toLocaleTimeString([], {
                                      hour: 'numeric',
                                      minute: '2-digit'
                                    })}
                                  </>
                                )}
                              </span>
                              {breakPeriod.duration && (
                                <span className="text-text/40">
                                  ({Math.round(breakPeriod.duration / 60)}m)
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
