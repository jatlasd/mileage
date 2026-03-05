import React from "react"
import TaxSummaryContainer from "@/components/tax-summary/TaxSummaryContainer"

const TaxSummary = () => {
  return (
    <div className="min-h-[100dvh] bg-background text-text">
      <div className="container mx-auto px-3 md:px-6 py-4 md:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl md:text-4xl">📋</span>
            <h1 className="text-2xl md:text-4xl font-bold text-primary">
              Tax Summary
            </h1>
          </div>
          <p className="text-sm md:text-base text-text/60">
            Year-end mileage tracking and tax reporting for delivery drivers
          </p>
        </div>

        {/* Main Content */}
        <TaxSummaryContainer />
      </div>
    </div>
  )
}

export default TaxSummary
