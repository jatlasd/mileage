"use client"

import { useState, useEffect } from 'react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "../ui/select"
  

  
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const daysOfWeek = [
  "Sunday", "Monday", "Tuesda", "Wednesday", "Thursday", "Friday", "Saturday"
]

const StatsFilter = ({ trips, setFilteredTrips }) => {
  const [selectedMonth, setSelectedMonth] = useState("all")
  const [selectedDay, setSelectedDay] = useState("all")

  useEffect(() => {
    if (trips) {
      setFilteredTrips(trips)
    }
  }, [trips])

  const handleMonthChange = (value) => {
    setSelectedMonth(value)
    filterTrips(value, selectedDay)
  }

  const handleDayChange = (value) => {
    setSelectedDay(value)
    filterTrips(selectedMonth, value)
  }

  const filterTrips = (month, day) => {
    let filtered = [...trips]
    
    if (month && month !== "all") {
      filtered = filtered.filter(trip => trip.month === month)
    }
    
    if (day && day !== "all") {
      filtered = filtered.filter(trip => trip.dayOfWeek === day)
    }
    
    setFilteredTrips(filtered)
  }

  return (
    <div className="flex gap-4 items-center">
      <Select value={selectedMonth} onValueChange={handleMonthChange}>
        <SelectTrigger className="w-[179px]">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Months</SelectItem>
          {months.map(month => (
            <SelectItem key={month} value={month}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedDay} onValueChange={handleDayChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select day" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Days</SelectItem>
          {daysOfWeek.map(day => (
            <SelectItem key={day} value={day}>
              {day}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default StatsFilter