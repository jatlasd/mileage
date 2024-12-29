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
