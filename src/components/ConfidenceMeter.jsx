import { motion as Motion } from 'framer-motion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/ui/tooltip'
import { cn } from '@/lib/utils'

export function ConfidenceMeter({ value, className }) {
  const pct = Math.round(value * 100)
  const color =
    pct >= 85 ? 'from-emerald-500 to-teal-400' : pct >= 60 ? 'from-amber-500 to-yellow-400' : 'from-rose-500 to-orange-400'

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('flex items-center gap-2', className)}>
            <div className="h-1.5 flex-1 max-w-[100px] overflow-hidden rounded-full bg-white/10">
              <Motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                className={cn('h-full rounded-full bg-gradient-to-r', color)}
              />
            </div>
            <span className="text-[10px] font-mono text-zinc-500">{pct}%</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          Model confidence on vendor line match. Below 70% usually needs human mapping.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
