import type * as React from 'react'
import { useEffect } from 'react'
import { cn } from '../../utils/styles'

export function Dialog(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}) {
  useEffect(() => {
    if (!props.open) {
      return
    }

    const scrollY = window.scrollY
    const originalStyle = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    }

    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'

    return () => {
      document.body.style.overflow = originalStyle.overflow
      document.body.style.position = originalStyle.position
      document.body.style.top = originalStyle.top
      document.body.style.width = originalStyle.width
      window.scrollTo(0, scrollY)
    }
  }, [props.open])

  if (!props.open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-[#34251f]/35 p-3 backdrop-blur-sm sm:place-items-center" role="dialog" aria-modal="true">
      <button className="absolute inset-0 cursor-default" type="button" aria-label="Close dialog" onClick={() => props.onOpenChange(false)} />
      {props.children}
    </div>
  )
}

export function DialogContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('relative max-h-[88vh] w-full max-w-[520px] overflow-y-auto rounded-3xl border border-white/70 bg-[#fffdf0] p-4 shadow-[0_24px_70px_rgba(52,37,31,0.28)] ring-1 ring-[#a44a3f]/10', className)}
      {...props}
    />
  )
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('m-0 text-2xl font-black tracking-normal text-[#34251f]', className)} {...props} />
}
