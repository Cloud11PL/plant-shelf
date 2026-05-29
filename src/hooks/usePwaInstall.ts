import { useEffect, useState } from 'react'
import type { BeforeInstallPromptEvent } from '../types/ui'

export function usePwaInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | undefined>()
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean }
    const standalone = window.matchMedia('(display-mode: standalone)').matches || navigatorWithStandalone.standalone === true
    setIsInstalled(standalone)

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault()
      setInstallPrompt(event as BeforeInstallPromptEvent)
    }

    function handleInstalled() {
      setIsInstalled(true)
      setInstallPrompt(undefined)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  async function install() {
    if (!installPrompt) {
      return
    }

    await installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(undefined)
  }

  return {
    canInstall: Boolean(installPrompt),
    install,
    isInstalled,
    shouldShowInstallHelp: !isInstalled,
  }
}
