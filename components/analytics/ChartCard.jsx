import { Card } from '../ui/card'

const ChartCard = ({ title, subtitle, height = 300, children }) => {
  const heightClass = `h-[${height}px]`

  return (
    <Card className="p-4 bg-background border-white/[0.1]">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-text">{title}</h3>
        {subtitle && <p className="text-sm text-text/60">{subtitle}</p>}
      </div>
      <div className={heightClass + " flex items-center justify-center bg-surface/50 rounded-lg border border-white/[0.05]"}>
        {children}
      </div>
    </Card>
  )
}

export default ChartCard 