'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, X, Clock, Car } from 'lucide-react';

const WEEKDAYS = [
  { short: 'S', full: 'Sunday' },
  { short: 'M', full: 'Monday' },
  { short: 'T', full: 'Tuesday' },
  { short: 'W', full: 'Wednesday' },
  { short: 'T', full: 'Thursday' },
  { short: 'F', full: 'Friday' },
  { short: 'S', full: 'Saturday' }
];

function DayModal({ isOpen, onClose, date, trips }) {
  if (!isOpen) return null;

  const formattedDate = date.toLocaleDateString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const totalMiles = trips.reduce((acc, trip) => acc + (trip.tripMiles || 0), 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-white/[0.05] rounded-xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-white/[0.05] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">{formattedDate}</h2>
            <div className="text-sm text-text/60">
              {trips.length} trip{trips.length !== 1 ? 's' : ''} · {totalMiles.toFixed(1)} miles
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/[0.07] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {trips.map((trip) => {
            const startTime = new Date(trip.startDatetime);
            const endTime = trip.endDatetime ? new Date(trip.endDatetime) : null;
            const duration = endTime ? Math.round((endTime - startTime) / (1000 * 60)) : null;
            const totalBreakDuration = trip.totalBreakDuration || 0;
            const netDuration = duration ? duration - Math.round(totalBreakDuration / 60) : null;

            return (
              <div 
                key={trip._id}
                className="bg-white/[0.03] rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xl">
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
                  <div className="border-t border-white/[0.05] pt-3">
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
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getDayStats = (year, month, day) => {
    const targetDate = new Date(year, month, day);
    const nextDate = new Date(year, month, day + 1);
    
    const dayTrips = trips.filter(trip => {
      const tripDate = new Date(trip.startDatetime);
      return tripDate >= targetDate && tripDate < nextDate;
    });

    const totalMiles = dayTrips.reduce((acc, trip) => acc + (trip.tripMiles || 0), 0);
    
    return {
      trips: dayTrips.length,
      miles: totalMiles
    };
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const today = new Date();

  const monthTotal = trips
    .filter(trip => {
      const tripDate = new Date(trip.startDatetime);
      return tripDate.getMonth() === currentDate.getMonth() && 
             tripDate.getFullYear() === currentDate.getFullYear();
    })
    .reduce((acc, trip) => acc + (trip.tripMiles || 0), 0);

  const getTripsForDate = (year, month, day) => {
    const targetDate = new Date(year, month, day);
    const nextDate = new Date(year, month, day + 1);
    
    return trips.filter(trip => {
      const tripDate = new Date(trip.startDatetime);
      return tripDate >= targetDate && tripDate < nextDate;
    });
  };

  const handleDayClick = (year, month, day) => {
    const date = new Date(year, month, day);
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-[100dvh] bg-background text-text p-3 sm:p-5">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <div>
              <h1 className="text-xl sm:text-2xl font-medium">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h1>
              <div className="text-xs sm:text-sm text-text/60">
                {monthTotal.toFixed(1)} miles this month
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={goToPreviousMonth}
              className="p-1.5 sm:p-2 hover:bg-white/[0.07] rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm bg-white/[0.05] hover:bg-white/[0.1] rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={goToNextMonth}
              className="p-1.5 sm:p-2 hover:bg-white/[0.07] rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <div className="bg-white/[0.02] rounded-xl border border-white/[0.05] overflow-hidden">
          <div className="grid grid-cols-7 border-b border-white/[0.05]">
            {WEEKDAYS.map(day => (
              <div 
                key={day.full} 
                className="p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-text/60"
                title={day.full}
              >
                {day.short}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 divide-x divide-y divide-white/[0.05]">
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-start-${index}`} className="p-2 sm:p-3 min-h-[80px] sm:min-h-[120px] bg-white/[0.01]" />
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const dayNumber = index + 1;
              const stats = getDayStats(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
              const isToday = 
                today.getDate() === dayNumber && 
                today.getMonth() === currentDate.getMonth() && 
                today.getFullYear() === currentDate.getFullYear();

              return (
                <div 
                  key={`day-${currentDate.getFullYear()}-${currentDate.getMonth()}-${dayNumber}`}
                  className={`p-2 sm:p-3 min-h-[80px] sm:min-h-[120px] transition-colors hover:bg-white/[0.03] ${
                    isToday ? 'bg-primary/5 hover:bg-primary/10' : stats.trips > 0 ? 'bg-white/[0.02]' : ''
                  } ${stats.trips > 0 ? 'cursor-pointer' : ''}`}
                  onClick={() => stats.trips > 0 && handleDayClick(currentDate.getFullYear(), currentDate.getMonth(), dayNumber)}
                >
                  <div className="flex items-start justify-between">
                    <span className={`text-xs sm:text-sm font-medium ${
                      isToday ? 'text-primary' : stats.trips > 0 ? 'text-text/90' : 'text-text/60'
                    }`}>
                      {dayNumber}
                    </span>
                    {stats.trips > 0 && (
                      <span className={`text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded-full ${
                        isToday ? 'bg-primary/20 text-primary' : 'bg-white/[0.05] text-text/60'
                      }`}>
                        {stats.trips}
                      </span>
                    )}
                  </div>
                  {stats.miles > 0 && (
                    <div className="mt-0.5 sm:mt-1 text-[10px] sm:text-sm font-mono text-text/60">
                      {stats.miles.toFixed(1)} mi
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedDate && (
        <DayModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDate(null);
          }}
          date={selectedDate}
          trips={getTripsForDate(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate()
          )}
        />
      )}
    </div>
  );
} 