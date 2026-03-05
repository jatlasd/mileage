import { useAnalytics } from './useAnalytics'

// Hook for fetching tax summary data for a specific year
export const useTaxSummary = (year) => {
  const { data, isLoading, error } = useAnalytics('/api/tax-summary', { year })

  return {
    yearSummary: data?.yearSummary || null,
    monthlyBreakdown: data?.monthlyBreakdown || [],
    validation: data?.validation || { warnings: [], stats: {} },
    isLoading,
    error
  }
}
