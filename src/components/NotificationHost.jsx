import { AnimatePresence, motion as Motion } from 'framer-motion'
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react'
import { useInventoryStore } from '@/store/useInventoryStore'
import { cn } from '@/lib/utils'

const icons = {
  success: CheckCircle2,
  info: Info,
  warn: AlertTriangle,
  error: AlertTriangle,
}

export function NotificationHost() {
  const notifications = useInventoryStore((s) => s.notifications)

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[250] flex w-[min(100%,360px)] flex-col gap-2">
      <AnimatePresence>
        {notifications.map((n) => {
          const Icon = icons[n.type] ?? Info
          return (
            <Motion.div
              key={n.id}
              initial={{ opacity: 0, x: 24, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 16 }}
              className={cn(
                'pointer-events-auto glass-strong rounded-lg p-3 shadow-2xl',
                n.type === 'success' && 'border-emerald-500/20',
                n.type === 'warn' && 'border-amber-500/25'
              )}
            >
              <div className="flex gap-2">
                <Icon
                  className={cn(
                    'mt-0.5 h-4 w-4 shrink-0',
                    n.type === 'success' && 'text-emerald-400',
                    n.type === 'info' && 'text-violet-400',
                    n.type === 'warn' && 'text-amber-400'
                  )}
                />
                <div>
                  <p className="text-xs font-semibold text-white">{n.title}</p>
                  {n.body && <p className="mt-0.5 text-[11px] text-zinc-500">{n.body}</p>}
                </div>
              </div>
            </Motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
