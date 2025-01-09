"use client"

import { useState, useEffect } from 'react'

const Testing = () => {
  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/entry')
      const data = await response.json()
      console.log('All entries:', data)
    } catch (error) {
      console.error('Error fetching entries:', error)
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

  const updateOrderHourBlocks = async () => {
    try {
      const response = await fetch('/api/entry')
      const entries = await response.json()
      console.log('Fetched entries:', entries.length)
      
      for (const entry of entries) {
        if (entry.orders && entry.orders.length > 0) {
          const updatedOrders = entry.orders.map(order => {
            const orderTime = new Date(order.time)
            const estOrderTime = new Date(orderTime.toLocaleString('en-US', { timeZone: 'America/New_York' }))
            const hour = estOrderTime.getHours()
            const nextHour = (hour + 1) % 24
            const hourBlock = `${hour % 12 || 12}${hour < 12 ? 'am' : 'pm'} - ${nextHour % 12 || 12}${nextHour < 12 ? 'am' : 'pm'}`
            return { ...order, hourBlock }
          })

          const updateResponse = await fetch(`/api/entry/${entry._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orders: updatedOrders
            })
          })
          
          if (updateResponse.ok) {
            console.log(`Updated orders for entry ${entry._id}`)
          } else {
            console.error(`Failed to update orders for entry ${entry._id}`)
          }
        }
      }
      console.log('Finished updating all orders')
    } catch (error) {
      console.error('Error updating order hour blocks:', error)
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
      <button 
        onClick={updateOrderHourBlocks}
        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
      >
        Update Order Hour Blocks
      </button>
    </div>
  )
}

export default Testing