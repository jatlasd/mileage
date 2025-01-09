'use client';

import { useState, useEffect } from 'react';
import { formatDuration } from '@/lib/utils';
import { Pause, Play, Plus } from 'lucide-react';
import OrderDialog from '@/components/OrderDialog';

export default function HomePage() {
  const [mileage, setMileage] = useState('');
  const [activeTrip, setActiveTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBreakLoading, setIsBreakLoading] = useState(false);
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedZone, setSelectedZone] = useState('')
  const [isOtherZone, setIsOtherZone] = useState(false)
  const [otherZone, setOtherZone] = useState('')

  const buttonClass = 'relative px-4 py-3 border-2 border-text/50 rounded-xl text-lg bg-text/10 w-full transition-all duration-200 active:scale-[0.98]'
  const selectedButtonClass = `${buttonClass} border-primary bg-primary/20 border-primary text-primary`

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
    if (!activeTrip && !selectedZone && !otherZone) return;

    const zoneToSend = activeTrip ? 
      activeTrip.zone : 
      (isOtherZone ? otherZone : selectedZone);
      
    console.log('Submitting with zone:', zoneToSend, 'selectedZone:', selectedZone, 'isOtherZone:', isOtherZone, 'otherZone:', otherZone);

    try {
      const res = await fetch('/api/entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mileage: Number(mileage),
          zone: zoneToSend
        }),
      });
      
      console.log('Request body:', { mileage: Number(mileage), zone: zoneToSend });
      
      if (!res.ok) throw new Error('Failed to submit mileage');
      
      const data = await res.json();
      setActiveTrip(data.trip.isActive ? data.trip : null);
      setMileage('');
      setSelectedZone('');
      setOtherZone('');
      setIsOtherZone(false);
      
      if (!data.trip.isActive) {
        window.location.href = '/mileage';
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting mileage');
    }
  };

  const handleBreak = async () => {
    if (!activeTrip) return;
    
    const activeBreak = activeTrip.breaks?.find(b => !b.endTime);
    const action = activeBreak ? 'end' : 'start';
    
    setIsBreakLoading(true);
    try {
      const res = await fetch('/api/break', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId: activeTrip._id, action })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to process break');
      }

      const updatedTrip = await res.json();
      setActiveTrip(updatedTrip);
    } catch (err) {
      console.error(err);
      alert('Error processing break');
    } finally {
      setIsBreakLoading(false);
    }
  };

const handleSelectZone = (zone) => {
  console.log('handleSelectZone called with:', zone);
  if (zone === 'other') {
    setIsOtherZone(true);
    setSelectedZone('');
  } else {
    setSelectedZone(zone);
    setIsOtherZone(false);
    setOtherZone('');
  }
  console.log('After setting zone - selectedZone:', zone, 'isOtherZone:', false);
}

  if (isLoading) {
    return <div className="min-h-[100dvh] bg-background text-text flex items-center justify-center">
      <div className="animate-pulse text-lg">Loading...</div>
    </div>;
  }

  const activeBreak = activeTrip?.breaks?.find(b => !b.endTime);
  const totalBreakDuration = activeTrip?.totalBreakDuration || 0;

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
            <div className={`space-y-3 ${activeBreak ? 'p-3 bg-red-500/10 rounded-lg border border-red-500/20' : ''}`}>
              <div className="flex items-baseline gap-2">
                <span className="text-primary/90 text-sm">Starting Mileage:</span>
                <span className="font-mono text-2xl">{activeTrip.startMileage}</span>
              </div>
              <div className="text-sm text-text/60 space-y-0.5">
                <p>Started: {new Date(activeTrip.startDatetime).toLocaleTimeString()}</p>
                <p>Orders: <span className="text-green-400 font-medium">{activeTrip.orders?.length || 0}</span></p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleBreak}
                  disabled={isBreakLoading}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors disabled:opacity-50
                    ${activeBreak 
                      ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' 
                      : 'bg-white/[0.05] hover:bg-white/[0.1]'}`}
                >
                  {activeBreak ? (
                    <>
                      <Play className="w-4 h-4" />
                      Resume Trip
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4" />
                      Take Break
                    </>
                  )}
                </button>
                <OrderDialog 
                  tripId={activeTrip._id} 
                  onOrderCreated={setActiveTrip}
                />
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-[15%]">
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
              className="w-full h-14 px-4 border border-white/10 rounded-xl bg-white/[0.07] text-2xl font-mono placeholder:text-text/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/[0.09] transition-all"
              required
            />
          </div>

          {!activeTrip && (
            <div className="space-y-2">
              <label className="text-sm text-text/70 px-1">Select delivery zone</label>
              <div className='grid grid-cols-2 gap-3'>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectZone('Swedesboro');
                  }}
                  className={selectedZone === 'Swedesboro' ? selectedButtonClass : buttonClass}
                >
                  Swedesboro
                </button>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectZone('Deptford');
                  }}
                  className={selectedZone === 'Deptford' ? selectedButtonClass : buttonClass}
                >
                  Deptford
                </button>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectZone('other');
                  }}
                  className={isOtherZone ? selectedButtonClass : buttonClass}
                >
                  Other
                </button>
              </div>
              
              {isOtherZone && (
                <input
                  type="text"
                  value={otherZone}
                  placeholder='Enter zone name'
                  onChange={(e) => setOtherZone(e.target.value)}
                  className="w-full h-14 mt-3 px-4 border border-white/10 rounded-xl bg-white/[0.07] text-lg placeholder:text-text/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/[0.09] transition-all"
                  required
                />
              )}
            </div>
          )}

          <button 
            type="submit" 
            disabled={!mileage || (!activeTrip && (!selectedZone && !otherZone))}
            className="w-full h-14 bg-primary text-white text-lg font-medium rounded-xl active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {activeTrip ? 'End Trip' : 'Start Trip'}
          </button>
        </form>
      </div>
    </div>
  );
}
