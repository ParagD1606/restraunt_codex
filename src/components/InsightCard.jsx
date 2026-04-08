import { motion as Motion } from 'framer-motion'
import { Sparkles, TrendingUp, AlertTriangle } from 'lucide-react'
import { Card, CardContent } from '@/ui/card'
import { Badge } from '@/ui/badge'
import { cn } from '@/lib/utils'

const icons = {
  info: Sparkles,
  warn: TrendingUp,
  critical: AlertTriangle,
}

export function InsightCard({ insight, index = 0 }) {
  const Icon = icons[insight.severity] ?? Sparkles
  return (
    <Motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 200, damping: 24 }}
    >
      <Card className="group relative overflow-hidden border-white/[0.06]">
        <div
          className={cn(
            'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100',
            insight.severity === 'critical' && 'bg-gradient-to-br from-rose-500/10 to-transparent',
            insight.severity === 'warn' && 'bg-gradient-to-br from-amber-500/10 to-transparent',
            insight.severity === 'info' && 'bg-gradient-to-br from-violet-500/10 to-transparent'
          )}
        />
        <CardContent className="relative flex gap-3 p-4">
          <div
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]',
              insight.severity === 'critical' && 'text-rose-300',
              insight.severity === 'warn' && 'text-amber-300',
              insight.severity === 'info' && 'text-violet-300'
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-white">{insight.title}</span>
              <Badge variant={insight.severity === 'critical' ? 'danger' : insight.severity === 'warn' ? 'warn' : 'ai'}>
                {insight.metric}
              </Badge>
            </div>
            <p className="text-xs leading-relaxed text-zinc-500">{insight.body}</p>
          </div>
        </CardContent>
      </Card>
    </Motion.div>
  )
}
