import type * as React from 'react'
import { cn } from '../../utils/styles'

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('grid gap-1.5 text-sm font-bold text-[#4b372e]', className)} {...props} />
}
