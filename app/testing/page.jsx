"use client"

import React from 'react'
import { Button } from '@/components/ui/button'

const Testing = () => {
  const updateDayOfWeek = async () => {
    try {
      const response = await fetch('/api/entry')
      const trips = await response.json()

      for (const trip of trips) {
        if (trip.startDatetime) {
          const startDate = new Date(trip.startDatetime)
          const dayOfWeek = startDate.toLocaleString('en-US', { weekday: 'long', timeZone: 'America/New_York' })

          await fetch(`/api/entry/${trip._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dayOfWeek }),
          })
        }
      }

      alert('Successfully updated dayOfWeek for all trips')
    } catch (error) {
      console.error('Error updating trips:', error)
      alert('Error updating trips. Check console for details.')
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Testing Page</h1>
      <Button onClick={updateDayOfWeek}>Update Day of Week for All Trips</Button>
    </div>
  )
}

export default Testing