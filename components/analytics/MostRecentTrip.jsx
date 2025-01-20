"use client"

import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

const MostRecentTrip = ({ trip }) => {
    const [duration, setDuration] = useState('not set yet')
    const [reduced, setReduced] = useState('not yet reduced')

    const getMostPopularHourBlock = () => {
        const hourBlockCounts = trip.orders.reduce((acc, order) => {
            acc[order.hourBlock] = (acc[order.hourBlock] || 0) + 1
            return acc
        }, {})
        
        return Object.entries(hourBlockCounts)
            .sort(([,a], [,b]) => b - a)[0][0]
    }

    const startDate = new Date(trip.startDatetime)
    const endDate = new Date(trip.endDatetime)
    const calculateDuration = () => {
        const durationMs = endDate - startDate
        
        const hours = Math.floor(durationMs / (1000 * 60 * 60))
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
        
        return `${hours}h ${minutes}m`
    }

    const filterTripByType = (type) => {
        const reduced = trip.orders.filter((order)=>order.type===type)
        return reduced.length
    }

    const filterOrderByAccepted = ()=>{
        const accepted = trip.orders.filter((order)=>order.accepted)
        return accepted.length
    }

  return (
    <div className='grid grid-cols-4 gap-4'>
        <Card className="bg-[#1a1b26]/50 border-white/[0.1] hover:bg-[#1a1b26]/70 transition-all">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-medium text-white/90 text-center border-b border-white/10 pb-2">Time</CardTitle>
            </CardHeader>
            <CardContent>
                <div className='flex flex-col space-y-4'>
                    <div className="flex flex-col items-center">
                        <span className='text-rose-400 text-sm mb-1'>Date</span>
                        <span className='text-white/70'>{startDate.toLocaleDateString()}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="flex flex-col items-center">
                            <span className='text-rose-400 text-sm mb-1'>Start</span>
                            <span className='text-white/70'>{startDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className='text-rose-400 text-sm mb-1'>End</span>
                            <span className='text-white/70'>{endDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className='text-rose-400 text-sm mb-1'>Duration</span>
                        <span className='text-white/70'>{calculateDuration()}</span>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-[#1a1b26]/50 border-white/[0.1] hover:bg-[#1a1b26]/70 transition-all">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-medium text-white/90 text-center border-b border-white/10 pb-2">Orders</CardTitle>
            </CardHeader>
            <CardContent>
                <div className='flex flex-col space-y-4'>
                    <div className="flex flex-col items-center">
                        <span className='text-rose-400 text-sm mb-1'>Total</span>
                        <span className='text-white/70'>{trip.orders.length}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="flex flex-col items-center">
                            <span className='text-rose-400 text-sm mb-1'>Food</span>
                            <span className='text-white/70'>{filterTripByType("Food")}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className='text-rose-400 text-sm mb-1'>Shop</span>
                            <span className='text-white/70'>{filterTripByType("Shop")}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="flex flex-col items-center">
                            <span className='text-rose-400 text-sm mb-1'>Accepted</span>
                            <span className='text-white/70'>{filterOrderByAccepted()}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className='text-rose-400 text-sm mb-1'>Declined</span>
                            <span className='text-white/70'>{(trip.orders.length - filterOrderByAccepted())}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-[#1a1b26]/50 border-white/[0.1] hover:bg-[#1a1b26]/70 transition-all">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-medium text-white/90 text-center border-b border-white/10 pb-2">Busiest Hour</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center min-h-[180px]">
                <h1 className='font-bold text-3xl text-primary'>{getMostPopularHourBlock()}</h1>
            </CardContent>
        </Card>

    </div>
  )
}

export default MostRecentTrip