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
    return <div className="min-h-[100dvh] bg-background text-text flex items-center justify-center">
      <div className="animate-pulse text-lg">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-[100dvh] bg-background text-text flex flex-col">
      <div className="flex-1 flex flex-col p-5 pt-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-primary">
          Delivery Mileage Tracker
        </h1>
        
        <div className="bg-white/[0.07] rounded-xl p-4 mb-6 backdrop-blur-sm border border-white/[0.05]">
          <h2 className="text-base font-medium mb-3 text-text/80">
            {activeTrip ? 'Current Trip' : 'Start New Trip'}
          </h2>
          {activeTrip && (
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-primary/90 text-sm">Starting Mileage:</span>
                <span className="font-mono text-2xl">{activeTrip.startMileage}</span>
              </div>
              <div className="text-sm text-text/60 space-y-0.5">
                <p>Started: {new Date(activeTrip.startDatetime).toLocaleTimeString()}</p>
                <p>Duration: {formatDuration(activeTrip.startDatetime, currentTime)}</p>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 mt-auto mb-8">
          <div className="space-y-2">
            <label className="text-sm text-text/70 px-1">
              {activeTrip ? 'Enter ending mileage' : 'Enter starting mileage'}
            </label>
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              className="w-full h-16 px-4 border border-white/10 rounded-xl bg-white/[0.07] text-2xl font-mono placeholder:text-text/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/[0.09] transition-all"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full h-16 bg-primary text-white text-lg font-medium rounded-xl active:scale-[0.98] transition-transform shadow-lg shadow-primary/20"
          >
            {activeTrip ? 'End Trip' : 'Start Trip'}
          </button>
        </form>
      </div>
    </div>
  );
}
