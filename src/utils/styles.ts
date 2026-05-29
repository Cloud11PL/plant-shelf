import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const eyebrowClass = 'mb-1 text-xs font-extrabold uppercase tracking-normal text-[#775149]'

export const mutedClass = 'm-0 text-[#6f5a50]'
