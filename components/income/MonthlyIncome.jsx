"use client"

import { useState, useEffect } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"  
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

const MonthlyIncome = ({ month, incomes = [], isDisabled }) => {
  const totalGross = incomes?.reduce((acc, curr) => acc + parseFloat(curr.amount), 0) || 0
  const amountToSave = totalGross * 0.2

  return (
    <Card className={` ${isDisabled ? 'opacity-50 cursor-not-allowed bg-background' : 'hover:shadow-lg transition-all duration-200 hover:scale-[1.02] bg-surface/50'}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className={`${isDisabled ? 'text-text/50' : 'text-primary'}`}>{month}</span>
          <span className="text-sm font-normal text-text/60">{incomes?.length || 0} entries</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div className="h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent pr-2">
            <Table>
              <TableHeader>
                <TableRow isDisabled={isDisabled}>
                  <TableHead className="w-[100px]">Week</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomes?.map((income, index) => (
                  <TableRow key={index} isDisabled={isDisabled}>
                    <TableCell className="py-1 text-text">Week {income.week}</TableCell>
                    <TableCell className="py-1 text-text">${income.amount}</TableCell>
                  </TableRow>
                ))}
                {(!incomes || incomes.length === 0) && (
                  <TableRow isDisabled={isDisabled}>
                    <TableCell colSpan={2} className="text-center text-text/50 py-4">
                      {isDisabled ? 'Future month' : 'No income recorded'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      <CardFooter className={`bg-text/5 rounded-b-lg pt-3 ${isDisabled ? 'opacity-50' : ''}`}>
        <div className="flex justify-between w-full">
          <div className="flex flex-col items-center">
            <p className="text-sm text-text/70">Total Gross</p>
            <p className={`font-semibold text-lg ${isDisabled ? 'text-text/50' : 'text-primary/60'}`}>${totalGross.toFixed(2)}</p>
          </div>
          <div className="w-[1px] bg-text/10"></div>
          <div className="flex flex-col items-center">
            <p className="text-sm text-text/70">To Save (20%)</p>
            <p className={`font-semibold text-lg ${isDisabled ? 'text-text/50' : 'text-primary/60'}`}>${amountToSave.toFixed(2)}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default MonthlyIncome