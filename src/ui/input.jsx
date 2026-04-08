import * as React from 'react'
import { cn } from '@/lib/utils'

export const Input = React.forwardRef(function Input({ className, type = 'text', ...props }, ref) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-9 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
