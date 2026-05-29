import type * as React from 'react'
import { cn } from '../../utils/styles'

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn('w-full rounded-xl border border-[#cbdfbd] bg-[#fffef7]/90 px-3.5 py-3 text-[#34251f] shadow-inner shadow-[#cbdfbd]/20 outline-none transition focus:border-[#a44a3f] focus:ring-2 focus:ring-[#f19c79]/25 disabled:opacity-65', className)}
      {...props}
    />
  )
}
