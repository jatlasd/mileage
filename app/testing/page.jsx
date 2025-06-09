"use client"
import React from 'react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

const Testing = () => {
  const [orders, setOrders] = useState(null)

  const fetchRecentOrders = async () => {
    try {
      const response = await fetch('/api/entry')
      const trips = await response.json()
      
      const allOrders = trips.flatMap(trip => trip.orders || [])
      const sortedOrders = allOrders
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 100)
      
      setOrders(sortedOrders)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  return (
    <div className="p-4 flex flex-col justify-center items-center">
      <Button 
        onClick={fetchRecentOrders}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        Fetch Recent Orders
      </Button>

      {orders ? (
        <div className='mt-10 grid grid-cols-10 gap-2'>
          {orders.map((order, i) => (
            <div 
              key={i} 
              className={`rounded-full h-6 w-6 flex items-center justify-center ${
                order.accepted ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              <span className='text-white text-sm'>{i+1}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <p>No orders</p>
        </div>
      )}
    </div>
  )
}

export default Testing