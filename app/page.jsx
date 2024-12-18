'use client';

import { useState, useEffect } from 'react';
import { formatDuration } from '@/lib/utils';

export default function HomePage() {
  const [mileage, setMileage] = useState('');
  const [activeTrip, setActiveTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const checkActiveTrip = async () => {
      try {
        const res = await fetch('/api/entry');
        const data = await res.json();
        const active = data.find(trip => trip.isActive);
        setActiveTrip(active);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    checkActiveTrip();
  }, []);

  useEffect(() => {
    if (activeTrip) {
      const timer = setInterval(() => setCurrentTime(new Date()), 60000);
      return () => clearInterval(timer);
    }
  }, [activeTrip]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mileage) return;

    try {
      const res = await fetch('/api/entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mileage: Number(mileage) }),
      });
      if (!res.ok) throw new Error('Failed to submit mileage');
      
      const data = await res.json();
      setActiveTrip(data.trip.isActive ? data.trip : null);
      setMileage('');
      
      if (!data.trip.isActive) {
        window.location.href = '/mileage';
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting mileage');
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background text-text flex items-center justify-center">
      Loading...
    </div>;
  }

  return (
    <div className="min-h-screen bg-background text-text flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Delivery Mileage Tracker</h1>
      <div className="mb-8 text-center">
        <h2 className="text-2xl mb-2">
          {activeTrip ? 'End Trip' : 'Start New Trip'}
        </h2>
        {activeTrip && (
          <div className="text-lg opacity-80 mb-4">
            <p>Trip started at {activeTrip.startMileage} miles</p>
            <p className="text-sm mt-2">
              Started: {new Date(activeTrip.startDatetime).toLocaleTimeString()}
              <br />
              Duration: {formatDuration(activeTrip.startDatetime, currentTime)}
            </p>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-xs">
        <input
          type="number"
          step="0.1"
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
          placeholder={activeTrip ? "Enter ending mileage" : "Enter starting mileage"}
          className="p-2 mb-4 border rounded bg-background text-text w-full"
          required
        />
        <button type="submit" className="bg-primary text-text px-6 py-2 rounded w-full">
          {activeTrip ? 'End Trip' : 'Start Trip'}
        </button>
      </form>
    </div>
  );
}
