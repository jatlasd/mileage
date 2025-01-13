import { Card } from '../ui/card'

const StatCard = ({ title, value, subtitle }) => {
  return (
    <Card className="p-4 bg-background border-white/[0.1]">
      <h3 className="text-lg font-semibold mb-3 text-text">{title}</h3>
      <div className="text-3xl font-bold text-primary">{value}</div>
      <p className="text-sm text-text/60">{subtitle}</p>
    </Card>
  )
}

export default StatCard 