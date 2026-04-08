import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
  {
    variants: {
      variant: {
        default: 'border-white/10 bg-white/5 text-zinc-300',
        success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
        warn: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
        danger: 'border-rose-500/30 bg-rose-500/10 text-rose-200',
        ai: 'border-violet-500/40 bg-violet-500/15 text-violet-200',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
