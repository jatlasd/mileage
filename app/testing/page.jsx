"use client"

import { useState, useEffect } from 'react'

const Testing = () => {
  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/entry')
      const data = await response.json()
      console.log('All entries:', data)
    } catch (error) {
      console.error('Error fetching entrie:', error)
    }
  }

  const updateEntries = async () => {
    try {
      const response = await fetch('/api/entry')
      const entries = await response.json()
      
      for (const entry of entries) {
        if (!entry.month || !entry.dayOfWeek) {
          const startDate = new Date(entry.startDatetime)
          const estDate = new Date(startDate.toLocaleString('en-US', { timeZone: 'America/New_York' }))
          
          const month = estDate.getMonth() + 1
          const dayOfWeek = estDate.getDay()
          
          const updateResponse = await fetch(`/api/entry/${entry._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              month,
              dayOfWeek
            })
          })
          
          if (updateResponse.ok) {
            console.log(`Updated entry ${entry._id} with month: ${month}, dayOfWeek: ${dayOfWeek}`)
          } else {
            console.error(`Failed to update entry ${entry._id}`)
          }
        }
      }
      console.log('Finished updating entries')
    } catch (error) {
      console.error('Error updating entries:', error)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <button 
        onClick={fetchEntries}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Fetch All Entries
      </button>
      <button 
        onClick={updateEntries}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Update Missing Fields
      </button>
    </div>
  )
}

export default Testing