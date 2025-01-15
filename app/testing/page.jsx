"use client"

import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

const Testing = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [trips, setTrips] = useState(null)
  const [filteredByYearTrips, setFilteredByYearTrips] = useState(null)
  const [totalMiles, setTotalMiles] = useState(null)
  const [writeoff, setWriteoff] = useState(null)
  

  useEffect(() => {
    const fetchTrips = async () => {
      setIsLoading(true)
      const response = await fetch('/api/entry')
      const trips = await response.json()
      setTrips(trips)
      setIsLoading(false)
    }
    fetchTrips()
  }, [])

  const filterByYear = () => {
    const trips2025 = trips.filter(trip => {
      const tripDate = new Date(trip.startDatetime)
      return tripDate.getFullYear() === 2025
    })
    setFilteredByYearTrips(trips2025)
  }

  const calculateTotalMiles = () => {
    const total = filteredByYearTrips.reduce((acc, trip) => acc + trip.tripMiles, 0)
    setTotalMiles(total.toFixed(2))
  }

  const calculateWriteoff = () => {
    const writeoffAmount = totalMiles * 0.66
    setWriteoff(writeoffAmount.toFixed(2))
  }



  if(isLoading) return <p>Loading...</p>

  return (
    <div className='h-screen w-screen flex flex-col items-center justify-center gap-5 bg-background/20'>
      <Button onClick={()=>console.log(trips)}>Log all orders</Button>
      <Button onClick={filterByYear}>Filter them!</Button>
      <Button onClick={()=>console.log(filteredByYearTrips)}>Log filtered orders</Button>
      <Button onClick={calculateTotalMiles}>Calculate total miles</Button>
      <Button onClick={()=>console.log(totalMiles)}>Log total miles</Button>
      <Button onClick={calculateWriteoff}>Calculate writeoff</Button>
      <Button onClick={()=>console.log(writeoff)}>Log writeoff</Button>
    </div>
  )
}

export default Testing