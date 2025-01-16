"use client";

import { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ExportDialog from "@/components/ExportDialog";
import MileageStats from "@/components/MileageStats";
import FilterBar from "@/components/FilterBar";
import TripCard from "@/components/TripCard";
import {
  calculateMileageStats,
  paginateTrips,
  formatDayHeader,
  getDayTotal,
} from "@/lib/utils";

export default function MileagePage() {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTrip, setEditingTrip] = useState(null);
  const [editForm, setEditForm] = useState({
    startMileage: "",
    endMileage: "",
  });
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [filterYear, setFilterYear] = useState(
    new Date().getFullYear().toString()
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    async function fetchTrips() {
      try {
        const res = await fetch("/api/entry");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.details || "Failed to fetch trips");
        }
        const data = await res.json();
        setTrips(data);
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTrips();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-background text-text flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[100dvh] bg-background text-text flex items-center justify-center p-4">
        <div className="text-red-400 text-center">
          Error loading trips: {error}
        </div>
      </div>
    );
  }

  const handleEdit = (trip) => {
    setEditingTrip(trip._id);
    setEditForm({
      startMileage: trip.startMileage,
      endMileage: trip.endMileage || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingTrip(null);
    setEditForm({ startMileage: "", endMileage: "" });
  };

  const handleSaveEdit = async (tripId) => {
    try {
      const res = await fetch(`/api/entry/${tripId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startMileage: Number(editForm.startMileage),
          endMileage: Number(editForm.endMileage),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update trip");
      }

      const updatedTrip = await res.json();
      setTrips(trips.map((trip) => (trip._id === tripId ? updatedTrip : trip)));
      setEditingTrip(null);
      setEditForm({ startMileage: "", endMileage: "" });
    } catch (err) {
      console.error("Error updating trip:", err);
      setError(err.message);
    }
  };

  const handleDelete = async (tripId) => {
    try {
      const res = await fetch(`/api/entry/${tripId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete trip");
      }

      setTrips(trips.filter((trip) => trip._id !== tripId));
    } catch (err) {
      console.error("Error deleting trip:", err);
      setError(err.message);
    }
  };

  const handleExportCSV = async ({ startDate, endDate }) => {
    try {
      const timestamp = new Date().getTime();
      const queryParams = new URLSearchParams({
        t: timestamp,
        startDate,
        endDate,
      });
      const response = await fetch(`/api/export?${queryParams}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mileage_for_taxes.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      setError(error.message);
    }
  };

  const stats = calculateMileageStats(trips);
  const { paginatedTrips, totalPages, totalItems } = paginateTrips(
    trips,
    filterPeriod,
    filterYear,
    currentPage,
    itemsPerPage
  );

  return (
    <div className="min-h-[100dvh] bg-background text-text flex flex-col">
      <div className="container mx-auto max-w-7xl">
        <MileageStats stats={stats} />

        <div className="flex-1 p-5 space-y-3">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Mileage Log</h1>
            <ExportDialog onExport={handleExportCSV} />
          </div>

          <FilterBar
            filterPeriod={filterPeriod}
            filterYear={filterYear}
            totalItems={totalItems}
            onFilterPeriodChange={setFilterPeriod}
            onFilterYearChange={setFilterYear}
          />

          {trips.length === 0 ? (
            <div className="text-center text-text/40 py-8">
              No trips recorded yet
            </div>
          ) : (
            <div className="space-y-6">
              {paginatedTrips.map(([dateKey, dayTrips]) => (
                <div key={dateKey} className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-sm font-medium text-text/80">
                      {formatDayHeader(dateKey)}
                    </h3>
                    <span className="text-xs text-text/40 font-mono">
                      {getDayTotal(dayTrips).toFixed(1)} mi
                    </span>
                  </div>
                  <div className="space-y-3">
                    {dayTrips.map((trip) => (
                      <TripCard
                        key={trip._id}
                        trip={trip}
                        editingTrip={editingTrip}
                        editForm={editForm}
                        onEdit={handleEdit}
                        onSave={handleSaveEdit}
                        onCancel={handleCancelEdit}
                        onEditFormChange={setEditForm}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination>
                    <PaginationContent className="gap-2">
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                          }
                          className={`${
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          } 
                            bg-[#1a1b26] border border-white/[0.1] hover:bg-[#1f2133] transition-colors`}
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className={`${
                                currentPage === page
                                  ? "bg-primary/20 text-primary border-primary/20"
                                  : "bg-[#1a1b26] border-white/[0.1] hover:bg-[#1f2133]"
                              } cursor-pointer border transition-colors`}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(totalPages, prev + 1)
                            )
                          }
                          className={`${
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
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
    </div>
  );
}
