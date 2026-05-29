export function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export const buttonBase = 'min-h-11 cursor-pointer rounded-lg border-0 px-3.5 py-2.5 font-extrabold text-[#34251f] disabled:cursor-not-allowed disabled:opacity-55'

export const primaryButton = `${buttonBase} bg-[#d4e09b]`

export const panelClass = 'rounded-lg border border-[#a44a3f]/15 bg-[#fffdf0]/90 p-3.5 shadow-[0_12px_34px_rgba(76,55,46,0.08)]'

export const eyebrowClass = 'mb-1 text-xs font-extrabold uppercase tracking-normal text-[#775149]'

export const mutedClass = 'm-0 text-[#6f5a50]'

export const inputClass = 'w-full rounded-lg border border-[#cbdfbd] bg-[#fffef7] px-3 py-2.5 text-[#34251f]'
