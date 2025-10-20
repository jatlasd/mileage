import React from "react";
import AnalyticsContainer from "@/components/analytics/AnalyticsContainer";

const Analytics = () => {
  return (
    <div className="min-h-[100dvh] bg-background text-text">
      <div className="container mx-auto px-3 md:px-6 py-4 md:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl md:text-4xl">📊</span>
            <h1 className="text-2xl md:text-4xl font-bold text-primary">
              Analytics
            </h1>
          </div>
          <p className="text-sm md:text-base text-text/60">
            Track your delivery performance and optimize your schedule
          </p>
        </div>

        {/* Main Content */}
        <AnalyticsContainer />
      </div>
    </div>
  );
};

export default Analytics;
