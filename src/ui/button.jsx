import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const variants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 disabled:pointer-events-none disabled:opacity-45',
  {
    variants: {
      variant: {
        default: 'bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-900/30',
        secondary:
          'bg-white/5 text-zinc-100 hover:bg-white/10 border border-white/10',
        ghost: 'text-zinc-300 hover:bg-white/5 hover:text-white',
        outline: 'border border-white/12 bg-transparent hover:bg-white/5',
        destructive: 'bg-rose-600/90 text-white hover:bg-rose-500',
        link: 'text-violet-400 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 px-6',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(variants({ variant, size, className }))} ref={ref} {...props} />
})
Button.displayName = 'Button'

export { Button, variants as buttonVariants }
