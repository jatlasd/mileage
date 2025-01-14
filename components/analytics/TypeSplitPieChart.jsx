import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const COLORS = ["#10b981", "#3b82f6"]

export default function TypeSplitPieChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/analytics/types")
        const { typeSplit } = await response.json()
        
        const formattedData = typeSplit.map(item => ({
          name: item.type.charAt(0).toUpperCase() + item.type.slice(1),
          value: item.count,
          earnings: item.totalEarnings
        }))
        
        setData(formattedData)
      } catch (error) {
        console.error("Error fetching type split:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="w-full h-full flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            outerRadius="80%"
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [
              `Count: ${value}`,
              name
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
} 