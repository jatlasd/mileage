'use client';

import { useState, useEffect } from 'react';
import { CalendarDays, Clock, Car, Edit2, X, Check } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ExportDialog from '@/components/ExportDialog';

export default function MileagePage() {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTrip, setEditingTrip] = useState(null);
  const [editForm, setEditForm] = useState({ startMileage: '', endMileage: '' });
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
    const taxYearStart = new Date('2024-01-01'); // Starting from January 1st, 2024
    const effectiveStartDate = startDate > taxYearStart ? startDate : taxYearStart;
    
    return trips
      .filter(trip => {
        const tripDate = new Date(trip.startDatetime);
        return tripDate >= effectiveStartDate;
      })
      .reduce((acc, trip) => acc + (trip.tripMiles || 0), 0);
  };

  const handleEdit = (trip) => {
    setEditingTrip(trip._id);
    setEditForm({
      startMileage: trip.startMileage,
      endMileage: trip.endMileage || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingTrip(null);
    setEditForm({ startMileage: '', endMileage: '' });
  };

  const handleSaveEdit = async (tripId) => {
    try {
      const res = await fetch(`/api/entry/${tripId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startMileage: Number(editForm.startMileage),
          endMileage: Number(editForm.endMileage)
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update trip');
      }

      const updatedTrip = await res.json();
      setTrips(trips.map(trip => 
        trip._id === tripId ? updatedTrip : trip
      ));
      setEditingTrip(null);
      setEditForm({ startMileage: '', endMileage: '' });
    } catch (err) {
      console.error('Error updating trip:', err);
      setError(err.message);
    }
  };

  const handleExportCSV = async ({ startDate, endDate }) => {
    try {
      const timestamp = new Date().getTime();
      const queryParams = new URLSearchParams({
        t: timestamp,
        startDate,
        endDate
      });
      const response = await fetch(`/api/export?${queryParams}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mileage_for_taxes.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      setError(error.message);
    }
  };

  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Start of current week
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1); // January 1st of current year

  const stats = {
    ytd: getMileageForDateRange(startOfYear),
    month: getMileageForDateRange(startOfMonth),
    week: getMileageForDateRange(startOfWeek),
    today: getMileageForDateRange(startOfDay)
  };

  const groupTripsByDay = (trips) => {
    const grouped = {};
    trips.forEach(trip => {
      const date = new Date(trip.startDatetime);
      const dateKey = date.toISOString().split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(trip);
    });
    return Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0]));
  };

  const formatDayHeader = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().split('T')[0]) {
      return 'Today';
    } else if (dateStr === yesterday.toISOString().split('T')[0]) {
      return 'Yesterday';
    }
    return date.toLocaleDateString([], {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDayTotal = (trips) => {
    return trips.reduce((acc, trip) => acc + (trip.tripMiles || 0), 0);
  };

  const filterTrips = (trips) => {
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const selectedYear = parseInt(filterYear);
    const yearStart = new Date(selectedYear, 0, 1);
    const yearEnd = new Date(selectedYear + 1, 0, 1);

    return trips.filter(trip => {
      const tripDate = new Date(trip.startDatetime);
      
      // First filter by year
      if (tripDate < yearStart || tripDate >= yearEnd) return false;
      
      // Then filter by period within the year
      switch (filterPeriod) {
        case 'today':
          return tripDate >= today;
        case 'yesterday':
          return tripDate >= yesterday && tripDate < today;
        case 'week':
          return tripDate >= lastWeek;
        case 'month':
          return tripDate >= lastMonth;
        default:
          return true;
      }
    });
  };

  const paginateTrips = (trips) => {
    const filteredTrips = filterTrips(trips);
    const groupedTrips = groupTripsByDay(filteredTrips);
    const totalPages = Math.ceil(groupedTrips.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return {
      paginatedTrips: groupedTrips.slice(startIndex, endIndex),
      totalPages,
      totalItems: groupedTrips.length
    };
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mileage Log</h1>
          <ExportDialog onExport={handleExportCSV} />
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-medium text-text/60">RECENT TRIPS</h2>
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="bg-[#1a1b26] text-sm rounded-lg px-3 py-1.5 border border-white/[0.1] text-white/80 outline-none appearance-none cursor-pointer hover:bg-[#1f2133] transition-colors pr-8 relative"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255, 255, 255, 0.3)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
                backgroundSize: '16px'
              }}
            >
              <option value="all" className="bg-[#1a1b26]">All Time</option>
              <option value="today" className="bg-[#1a1b26]">Today</option>
              <option value="yesterday" className="bg-[#1a1b26]">Yesterday</option>
              <option value="week" className="bg-[#1a1b26]">Last 7 Days</option>
              <option value="month" className="bg-[#1a1b26]">Last 30 Days</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="bg-[#1a1b26] text-sm rounded-lg px-3 py-1.5 border border-white/[0.1] text-white/80 outline-none appearance-none cursor-pointer hover:bg-[#1f2133] transition-colors pr-8 relative"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255, 255, 255, 0.3)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
                backgroundSize: '16px'
              }}
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year.toString()} className="bg-[#1a1b26]">{year}</option>
              ))}
            </select>
            <div className="text-sm text-text/40">{filterTrips(trips).length} total</div>
          </div>
        </div>

        {trips.length === 0 ? (
          <div className="text-center text-text/40 py-8">
            No trips recorded yet
          </div>
        ) : (
          <div className="space-y-6">
            {paginateTrips(trips).paginatedTrips.map(([dateKey, dayTrips]) => (
              <div key={dateKey} className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm font-medium text-text/80">{formatDayHeader(dateKey)}</h3>
                  <span className="text-xs text-text/40 font-mono">{getDayTotal(dayTrips).toFixed(1)} mi</span>
                </div>
                <div className="space-y-3">
                  {dayTrips.map((trip) => {
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

                          <div className="flex items-center gap-2">
                            {editingTrip === trip._id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  value={editForm.startMileage}
                                  onChange={(e) => setEditForm({ ...editForm, startMileage: e.target.value })}
                                  className="w-20 px-2 py-1 text-sm bg-white/10 rounded border border-white/20 font-mono"
                                  placeholder="Start"
                                />
                                <span className="text-text/50">→</span>
                                <input
                                  type="number"
                                  value={editForm.endMileage}
                                  onChange={(e) => setEditForm({ ...editForm, endMileage: e.target.value })}
                                  className="w-20 px-2 py-1 text-sm bg-white/10 rounded border border-white/20 font-mono"
                                  placeholder="End"
                                />
                                <button
                                  onClick={() => handleSaveEdit(trip._id)}
                                  className="p-1 hover:bg-white/10 rounded"
                                >
                                  <Check className="w-4 h-4 text-green-400" />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="p-1 hover:bg-white/10 rounded"
                                >
                                  <X className="w-4 h-4 text-red-400" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <div className="text-sm text-text/50 font-mono">
                                  {trip.startMileage} → {trip.endMileage || '...'}
                                </div>
                                <button
                                  onClick={() => handleEdit(trip)}
                                  className="p-1 hover:bg-white/10 rounded"
                                >
                                  <Edit2 className="w-4 h-4 text-text/40" />
                                </button>
                              </>
                            )}
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

                        {trip.orders && trip.orders.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-white/[0.05]">
                            <div className="text-xs text-text/40 mb-2">Orders:</div>
                            <div className="space-y-1">
                              {trip.orders.map((order, index) => {
                                const orderTime = new Date(order.time);
                                return (
                                  <div key={index} className="text-xs text-text/60 flex items-center gap-2">
                                    <span>
                                      {orderTime.toLocaleTimeString([], {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true
                                      })}
                                    </span>
                                    <span className="text-text/40">
                                      {order.id}
                                    </span>
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
            ))}
            
            {paginateTrips(trips).totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent className="gap-2">
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                          bg-[#1a1b26] border border-white/[0.1] hover:bg-[#1f2133] transition-colors`}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: paginateTrips(trips).totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className={`${currentPage === page 
                            ? "bg-primary/20 text-primary border-primary/20" 
                            : "bg-[#1a1b26] border-white/[0.1] hover:bg-[#1f2133]"
                          } cursor-pointer border transition-colors`}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(paginateTrips(trips).totalPages, prev + 1))}
                        className={`${currentPage === paginateTrips(trips).totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          bg-[#1a1b26] border border-white/[0.1] hover:bg-[#1f2133] transition-colors`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
