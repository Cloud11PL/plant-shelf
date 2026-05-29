import type * as React from 'react'
import { createContext, useContext, useEffect } from 'react'
import { cn } from '../../utils/styles'

const DialogContext = createContext<{ close: () => void } | undefined>(undefined)

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
      <DialogContext.Provider value={{ close: () => props.onOpenChange(false) }}>
        {props.children}
      </DialogContext.Provider>
    </div>
  )
}

export function DialogContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const dialog = useContext(DialogContext)

  return (
    <div
      className={cn('relative max-h-[88vh] w-full max-w-[520px] overflow-y-auto rounded-3xl border border-white/70 bg-[#fffdf0] p-4 pr-12 shadow-[0_24px_70px_rgba(52,37,31,0.28)] ring-1 ring-[#a44a3f]/10', className)}
      {...props}
    >
      <button
        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-[#a44a3f]/15 bg-[#fffdf0]/90 text-sm font-black text-[#4b372e] shadow-sm transition hover:bg-[#f6f4d2] focus:outline-none focus:ring-2 focus:ring-[#f19c79]/35"
        type="button"
        aria-label="Close dialog"
        onClick={dialog?.close}
      >
        X
      </button>
      {props.children}
    </div>
  )
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('m-0 text-2xl font-black tracking-normal text-[#34251f]', className)} {...props} />
}
