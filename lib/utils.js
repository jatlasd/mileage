import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDuration(startTime, endTime, breakDuration = 0) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const totalMinutes = Math.round((end - start) / (1000 * 60));
  const netMinutes = totalMinutes - Math.round(breakDuration / 60);
  
  const hours = Math.floor(netMinutes / 60);
  const minutes = netMinutes % 60;
  
  if (hours === 0) {
    return `${minutes}m`;
  }
  
  return `${hours}h ${minutes}m`;
}

export function formatDayHeader(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateStr === today.toISOString().split("T")[0]) {
    return "Today";
  } else if (dateStr === yesterday.toISOString().split("T")[0]) {
    return "Yesterday";
  }
  return date.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function groupTripsByDay(trips) {
  const grouped = {};
  trips.forEach((trip) => {
    const date = new Date(trip.startDatetime);
    const dateKey = date.toISOString().split("T")[0];
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(trip);
  });
  return Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0]));
}

export function getDayTotal(trips) {
  return trips.reduce((acc, trip) => acc + (trip.tripMiles || 0), 0);
}

export function filterTripsByPeriod(trips, filterPeriod, filterYear) {
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

  return trips.filter((trip) => {
    const tripDate = new Date(trip.startDatetime);

    if (tripDate < yearStart || tripDate >= yearEnd) return false;

    switch (filterPeriod) {
      case "today":
        return tripDate >= today;
      case "yesterday":
        return tripDate >= yesterday && tripDate < today;
      case "week":
        return tripDate >= lastWeek;
      case "month":
        return tripDate >= lastMonth;
      default:
        return true;
    }
  });
}

export function getMileageForDateRange(trips, startDate) {
  const taxYearStart = new Date("2024-01-01");
  const effectiveStartDate = startDate > taxYearStart ? startDate : taxYearStart;

  return trips
    .filter((trip) => {
      const tripDate = new Date(trip.startDatetime);
      return tripDate >= effectiveStartDate;
    })
    .reduce((acc, trip) => acc + (trip.tripMiles || 0), 0);
}

export function calculateMileageStats(trips) {
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  return {
    ytd: getMileageForDateRange(trips, startOfYear),
    month: getMileageForDateRange(trips, startOfMonth),
    week: getMileageForDateRange(trips, startOfWeek),
    today: getMileageForDateRange(trips, startOfDay),
    average: trips.length ? getMileageForDateRange(trips, startOfYear) / trips.length : 0,
  };
}

export function paginateTrips(trips, filterPeriod, filterYear, currentPage, itemsPerPage) {
  const filteredTrips = filterTripsByPeriod(trips, filterPeriod, filterYear);
  const groupedTrips = groupTripsByDay(filteredTrips);
  const totalPages = Math.ceil(groupedTrips.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return {
    paginatedTrips: groupedTrips.slice(startIndex, endIndex),
    totalPages,
    totalItems: groupedTrips.length,
  };
}
