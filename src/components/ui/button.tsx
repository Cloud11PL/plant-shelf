import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'
import { cn } from '../../utils/styles'

const buttonVariants = cva(
  'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-extrabold shadow-sm transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55',
  {
    variants: {
      variant: {
        default: 'bg-[#d4e09b] text-[#34251f] shadow-[#a44a3f]/10 hover:bg-[#cbdfbd]',
        destructive: 'bg-[#a44a3f] text-[#fffdf0] hover:bg-[#8d3f36]',
        outline: 'border border-[#cbdfbd] bg-[#fffdf0]/85 text-[#34251f] hover:bg-[#f6f4d2]',
        ghost: 'bg-transparent text-[#34251f] hover:bg-[#d4e09b]/45',
        warm: 'bg-[#f19c79] text-[#34251f] hover:bg-[#e88c68]',
      },
      size: {
        default: 'min-h-11 px-3.5 py-2.5',
        sm: 'min-h-9 px-3 py-2',
        icon: 'h-11 w-11 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
