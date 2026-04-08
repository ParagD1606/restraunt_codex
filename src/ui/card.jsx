import { cn } from '@/lib/utils'

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-white/[0.08] bg-[var(--color-nilay-surface)]/80 text-zinc-100 shadow-xl shadow-black/20',
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('flex flex-col gap-1 p-5 pb-0', className)} {...props} />
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn('text-sm font-semibold tracking-tight text-white', className)} {...props} />
}

export function CardDescription({ className, ...props }) {
  return <p className={cn('text-xs text-zinc-500', className)} {...props} />
}

export function CardContent({ className, ...props }) {
  return <div className={cn('p-5', className)} {...props} />
}
