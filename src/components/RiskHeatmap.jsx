import { riskHeatmap } from '@/data/mockData'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/ui/tooltip'
import { cn } from '@/lib/utils'

const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

function cellColor(v) {
  if (v < 0.25) return 'bg-emerald-500/25'
  if (v < 0.5) return 'bg-amber-500/30'
  if (v < 0.75) return 'bg-orange-500/35'
  return 'bg-rose-500/40'
}

export function RiskHeatmap() {
  return (
    <TooltipProvider>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-left text-[10px]">
          <thead>
            <tr className="text-zinc-500">
              <th className="pb-2 pr-2 font-medium">Location</th>
              {days.map((d) => (
                <th key={d} className="pb-2 px-0.5 font-medium capitalize">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {riskHeatmap.map((row) => (
              <tr key={row.location}>
                <td className="py-1 pr-2 text-zinc-400">{row.location}</td>
                {days.map((d) => {
                  const v = row[d]
                  return (
                    <td key={d} className="p-0.5">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              'h-6 w-full rounded-md border border-white/5 transition-transform hover:scale-105',
                              cellColor(v)
                            )}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          Stock-out risk index {Math.round(v * 100)}% — blends POS, weather, and events.
                        </TooltipContent>
                      </Tooltip>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-[10px] text-zinc-600">
          AI risk heatmap · higher saturation = higher predicted stock pressure
        </p>
      </div>
    </TooltipProvider>
  )
}
