// components/metric-card.tsx
import { ArrowUp, ArrowDown, LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
interface MetricCardProps {
  title: string
  value: string | number
  icon?: LucideIcon
  trend?: {
    value: string
    positive: boolean
  }
  description?: string
  color?: string
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  color = "bg-purple-500"
}: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <h3 className="text-2xl  mt-1">{value}</h3>
          </div>
          {Icon && (
            <div className={`${color} p-2 rounded-lg text-white`}>
              <Icon size={20} />
            </div>
          )}
        </div>
        
        {(trend || description) && (
          <div className="mt-4 flex items-center gap-1 text-sm">
            {trend && (
              <span className={`flex items-center ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
                {trend.positive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                {trend.value}
              </span>
            )}
            {description && (
              <span className="text-gray-500">
                {trend ? ' • ' : ''}{description}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}