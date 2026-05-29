import { useEffect, useState } from 'react'
import { notificationScheduler, type NotificationStatus } from '../services/notificationScheduler'

export function useNotificationStatus() {
  const [status, setStatus] = useState<NotificationStatus>(() => notificationScheduler.getStatus())

  useEffect(() => {
    function refresh() {
      setStatus(notificationScheduler.getStatus())
    }

    refresh()
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)

    return () => {
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])

  return {
    refresh: () => setStatus(notificationScheduler.getStatus()),
    status,
  }
}
