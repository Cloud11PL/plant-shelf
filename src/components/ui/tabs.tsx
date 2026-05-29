import type * as React from 'react'
import { cn } from '../../utils/styles'

export function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto flex w-full max-w-[520px] items-center justify-center gap-1.5 rounded-2xl border border-white/60 bg-[#fffdf0]/75 p-1.5 shadow-[0_12px_30px_rgba(76,55,46,0.12)] ring-1 ring-[#a44a3f]/8', className)} {...props} />
}

export function TabsTrigger({
  active,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      className={cn(
        'inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl px-3.5 py-2.5 text-sm font-extrabold text-[#34251f] transition-all active:scale-[0.98]',
        active ? 'bg-[#a44a3f] text-[#fffdf0] shadow-md shadow-[#a44a3f]/20' : 'bg-transparent hover:bg-[#d4e09b]/45',
        className,
      )}
      {...props}
    />
  )
}
