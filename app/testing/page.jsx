"use client"

import { useState, useEffect } from 'react'

const Testing = () => {
  const [trips, setTrips] = useState([])
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/entry')
        const data = await response.json()
        setTrips(data)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching trips:', error)
        setIsLoading(false)
      }
    }
    fetchTrips()
  },[])

  const handleClick = () => {
    const trip = trips[0]
    console.log(typeof(trip.endMileage))
  }

  if(isLoading) return <p>loading</p>

  return (
    <div>
      <button onClick={handleClick}>Click</button>
    </div>
  )
}

export default Testing