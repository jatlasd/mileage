import { useAnalytics } from '@/lib/hooks/useAnalytics'

export const useHistory = (year) => {
  const params = year ? { year: year.toString() } : {}
  const { data, isLoading, error } = useAnalytics('/api/history', params)

  return {
    history: data,
    isLoading,
    error
  }
}
