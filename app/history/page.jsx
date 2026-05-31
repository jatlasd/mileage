import HistoryContainer from '@/components/history/HistoryContainer'

export default function HistoryPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-text">
      <div className="container mx-auto px-3 md:px-6 py-4 md:py-8 max-w-7xl">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl md:text-4xl">📜</span>
            <h1 className="text-2xl md:text-4xl font-bold text-primary">History</h1>
          </div>
          <p className="text-sm md:text-base text-text/60">
            Year-over-year and month-over-month comparisons — see where you were at this point last year
          </p>
        </div>

        <HistoryContainer />
      </div>
    </div>
  )
}
