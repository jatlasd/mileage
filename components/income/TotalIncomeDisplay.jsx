"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DollarSign, PiggyBank } from "lucide-react"

const TotalIncomeDisplay = ({ incomes = [] }) => {
  const yearlyTotal = incomes?.reduce((acc, curr) => acc + parseFloat(curr.amount), 0) || 0
  const yearlyToSave = yearlyTotal * 0.2

  return (
    <div className="my-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card darkBg={true} className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/10 hover:border-primary/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold flex items-center gap-2 text-primary">
              <DollarSign className="h-6 w-6 text-primary" strokeWidth={2} />
              Total Yearly Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <span className="text-4xl font-bold text-primary">
                ${yearlyTotal.toFixed(2)}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-text/70">
                Total earnings across all months
              </p>
            </div>
          </CardContent>
        </Card>

        <Card darkBg={true} className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/10 hover:border-primary/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold flex items-center gap-2 text-primary">
              <PiggyBank className="h-6 w-6 text-primary" strokeWidth={2} />
              Yearly Savings Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <span className="text-4xl font-bold text-primary">
                ${yearlyToSave.toFixed(2)}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-text/70">
                Recommended savings (20% of income)
              </p>
              <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                20% rate
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default TotalIncomeDisplay