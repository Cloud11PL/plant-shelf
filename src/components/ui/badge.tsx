import type * as React from 'react'
import { cn } from '../../utils/styles'

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn('inline-flex min-h-10 items-center gap-2 rounded-full border border-white/70 bg-[#fffdf0]/88 px-3 py-2 text-[#4b372e] shadow-sm ring-1 ring-[#cbdfbd]/50', className)}
      {...props}
    />
  )
}
