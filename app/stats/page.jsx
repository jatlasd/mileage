"use client"

import StatsFilter from '@/components/stats/StatsFilter'
import { useState, useEffect } from 'react'


const Stats = () => {
  const [trips, setTrips] = useState(null)
  const [filteredTrips, setFilteredTrips] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchAllTrips = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/entry')
      const data = await response.json()
      setTrips(data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching trips:', error)
    }
    finally{setIsLoading(false)}
  }

  useEffect(() => {
    fetchAllTrips()
  }, [])

  if(isLoading) return <h1>Loading</h1>

  return (
    <div className='min-h-[100dvh] bg-background text-text flex flex-col'>
      <StatsFilter trips={trips} setFilteredTrips={setFilteredTrips}/>
    </div>
  )
}

export default Stats