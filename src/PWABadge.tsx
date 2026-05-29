import { useRegisterSW } from 'virtual:pwa-register/react'
import { cn, primaryButton } from './utils/styles'

function PWABadge() {
  // check for updates every hour
  const period = 60 * 60 * 1000

  const {
    
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0) return
      if (r?.active?.state === 'activated') {
        registerPeriodicSync(period, swUrl, r)
      }
      else if (r?.installing) {
        r.installing.addEventListener('statechange', (e) => {
          const sw = e.target as ServiceWorker
          if (sw.state === 'activated')
            registerPeriodicSync(period, swUrl, r)
        })
      }
    },
  })

  function close() {
    
    setNeedRefresh(false)
  }

  return (
    <div role="alert" aria-labelledby="toast-message">
      { (needRefresh)
      && (
        <div className="fixed right-4 bottom-20 z-10 rounded-lg border border-[#a44a3f]/20 bg-[#fffdf0] p-3 text-left shadow-[0_12px_34px_rgba(76,55,46,0.16)]">
          <div className="mb-2">
            <span id="toast-message">New content available, click on reload button to update.</span>
              
              
          </div>
          <div className="flex gap-2">
            <button className={primaryButton} onClick={() => updateServiceWorker(true)}>Reload</button>
            <button className={cn(primaryButton, 'bg-[#f6f4d2]')} onClick={() => close()}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PWABadge

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(period: number, swUrl: string, r: ServiceWorkerRegistration) {
  if (period <= 0) return

  setInterval(async () => {
    if ('onLine' in navigator && !navigator.onLine)
      return

    const resp = await fetch(swUrl, {
      cache: 'no-store',
      headers: {
        'cache': 'no-store',
        'cache-control': 'no-cache',
      },
    })

    if (resp?.status === 200)
      await r.update()
  }, period)
}
