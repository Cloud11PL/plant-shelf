import type * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '../../utils/styles'

export function Card({ asChild = false, className, ...props }: React.HTMLAttributes<HTMLElement> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'section'

  return (
    <Comp
      className={cn('rounded-2xl border border-white/70 bg-[#fffdf0]/92 p-4 shadow-[0_14px_34px_rgba(76,55,46,0.1)] ring-1 ring-[#a44a3f]/8', className)}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-3.5 flex items-start justify-between gap-3', className)} {...props} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('m-0 text-[1.45rem] font-black leading-tight tracking-normal text-[#34251f]', className)} {...props} />
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('m-0 text-[#6f5a50]', className)} {...props} />
}
