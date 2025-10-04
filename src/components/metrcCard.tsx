import { Card, CardContent } from "@/components/ui/card"
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string
  icon: LucideIcon
  subtitle?: string
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, 
  className 
}: MetricCardProps) {
  return (
    <Card
      className={cn(
        "bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-colors",
        "w-full h-full", // Garante que o card ocupe todo o espaço disponível
        "transform hover:scale-[1.02] hover:shadow-xl transition-all duration-200", // Efeito hover suave
        className,
      )}
    >
      <CardContent className="p-4 sm:p-5 lg:p-6">
        {/* Header com título e trend */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className={cn(
              "p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30",
              "flex-shrink-0" // Evita que o ícone encolha
            )}>
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-slate-400 truncate">
              {title}
            </span>
          </div>
          
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ml-2",
                "text-[10px] sm:text-xs", // Tamanhos de texto responsivos
                trend.isPositive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400",
              )}
            >
              {trend.isPositive ? 
                <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : 
                <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              }
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        {/* Conteúdo principal */}
        <div className="space-y-1 sm:space-y-2">
          <p className={cn(
            "text-white font-bold tracking-tight",
            "text-xl sm:text-2xl lg:text-3xl xl:text-4xl", // Tamanhos responsivos para o valor
            "break-words overflow-hidden" // Previne quebra de layout
          )}>
            {value}
          </p>
          
          {description && (
            <p className={cn(
              "text-slate-400",
              "text-xs sm:text-sm", 
              "line-clamp-2 sm:line-clamp-3", // Limita número de linhas
              "break-words" // Quebra palavras longas
            )}>
              {description}
            </p>
          )}
        </div>

        {description && (
          <div className="mt-2 sm:hidden">
            <p className="text-xs text-slate-500 line-clamp-2">
              {description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface MetricGridProps {
  children: React.ReactNode
  className?: string
}

export function MetricGrid({ children, className }: MetricGridProps) {
  return (
    <div className={cn(
      "grid gap-4 sm:gap-6",
      "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", 
      "auto-rows-fr", 
      className
    )}>
      {children}
    </div>
  )
}

export function CompactMetricCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  className 
}: Omit<MetricCardProps, 'description'>) {
  return (
    <Card
      className={cn(
        "bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-colors",
        "w-full h-full p-3 sm:p-4",
        "transform hover:scale-[1.02] transition-all duration-200",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex-shrink-0">
            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] sm:text-sm font-medium text-slate-400 truncate">
              {title}
            </p>
            <p className="text-sm sm:text-base font-bold text-white truncate">
              {value}
            </p>
          </div>
        </div>
        
        {trend && (
          <div
            className={cn(
              "flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 ml-1",
              trend.isPositive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400",
            )}
          >
            {trend.isPositive ? 
              <TrendingUp className="h-2 w-2" /> : 
              <TrendingDown className="h-2 w-2" />
            }
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </Card>
  )
}