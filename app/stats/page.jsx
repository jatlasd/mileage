"use client"

import SingleTrip from '@/components/stats/SingleTrip'
import StatsFilter from '@/components/stats/StatsFilter'
import { convertTripDate, filterTripsByField } from '@/lib/stats'
import { useState, useEffect } from 'react'


const Stats = () => {
  const [trips, setTrips] = useState(null)
  const [filteredTrips, setFilteredTrips] = useState([])
  const [isLoading, setIsLoading] = useState(false)


  const [selectedTrip, setSelectedTrip] = useState(null)


  const fetchAllTrips = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/entry')
      const data = await response.json()
      setTrips(data)
      setFilteredTrips(data)
      setSelectedTrip(data[0])
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching trips:', error)
    }
    finally{setIsLoading(false)}
  }

  useEffect(() => {
    fetchAllTrips()
  }, [])

  const handleClick = () => {
    setSelectedTrip(trips[0])
  }

  if(isLoading) return <h1>Loading</h1>

  return (
    <div className='min-h-[100dvh] bg-background text-text flex flex-col items-center'>
      {/* <StatsFilter trips={trips} setFilteredTrips={setFilteredTrips}/> */}


        {selectedTrip && (
          <SingleTrip trip={selectedTrip}/>
        )}

    </div>
  )
}

export default Stats