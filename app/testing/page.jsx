'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const Testing = () => {
  const [mileage, setMileage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch('/api/oil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mileage: Number(mileage) })
      })

      if (!res.ok) throw new Error('Failed to create oil change entry')
      
      setMileage('')
      alert('Oil change entry created successfully!')
    } catch (error) {
      console.error('Error creating oil change:', error)
      alert('Failed to create oil change entry')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] bg-background text-text flex flex-col items-center p-5 pt-6">
      <h1 className="text-2xl font-bold mb-6 text-primary">
        Add Initial Oil Change Entry
      </h1>

      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-text/70">
              Current Mileage
            </label>
            <Input
              type="number"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              placeholder="Enter current mileage"
              className="w-full h-14 px-4 border text-text/80 border-white/10 rounded-xl bg-white/[0.07] font-mono placeholder:text-text/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/[0.09] transition-all"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={!mileage || isLoading}
            className="w-full h-14 bg-primary text-white text-lg font-medium rounded-xl disabled:opacity-50 transition-all duration-200"
          >
            {isLoading ? 'Creating...' : 'Create Oil Change Entry'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Testing