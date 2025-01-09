"use client"

import AddIncome from '@/components/income/AddIncome'
import MonthlyIncome from '@/components/income/MonthlyIncome'
import TotalIncomeDisplay from '@/components/income/TotalIncomeDisplay';
import { useState, useEffect } from 'react'

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Income = () => {
  const [incomes, setIncomes] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const currentMonth = new Date().getMonth()

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/income')
        const data = await response.json()
        setIncomes(data)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching incomes:', error)
      }
    }
    fetchIncomes()
  }, [refresh])

  return (
    <div className="min-h-[100dvh] bg-background text-text flex flex-col p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto w-full">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Income Tracker</h1>
        <AddIncome refresh={refresh} setRefresh={setRefresh}/>
        <div className="mt-4 sm:mt-6">
          <TotalIncomeDisplay incomes={incomes}/>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6 animate-pulse">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="h-[180px] sm:h-[200px] bg-text/10 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
            {months.map((month, index) => (
              <MonthlyIncome 
                key={index} 
                month={month} 
                incomes={incomes?.filter(i => i.month === month)}
                isDisabled={index > currentMonth}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Income