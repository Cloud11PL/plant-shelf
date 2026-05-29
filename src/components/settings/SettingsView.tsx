import type { AppData } from '../../types/domain'
import type { NotificationStatus } from '../../services/notificationScheduler'
import { Button } from '../ui/button'
import { Card, CardDescription, CardTitle } from '../ui/card'
import { eyebrowClass } from '../../utils/styles'

export function SettingsView(props: {
  data: AppData
  notificationStatus: NotificationStatus
  onPermissionRequest: () => void
  onTestNotification: () => void
}) {
  return (
    <section className="grid gap-4">
      <Card className="overflow-hidden">
        <p className={eyebrowClass}>This phone</p>
        <CardTitle>Your local plant book</CardTitle>
        <CardDescription>
          Shelves, plants, photos, watering notes, and reminders stay on this device for now.
        </CardDescription>
        <dl className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/70 bg-[#f6f4d2]/78 p-3 shadow-sm">
            <dt className="text-sm text-[#775149]">Shelves</dt>
            <dd className="m-0 text-2xl font-black text-[#34251f]">{props.data.shelves.length}</dd>
          </div>
          <div className="rounded-2xl border border-white/70 bg-[#f6f4d2]/78 p-3 shadow-sm">
            <dt className="text-sm text-[#775149]">Plants</dt>
            <dd className="m-0 text-2xl font-black text-[#34251f]">{props.data.plants.length}</dd>
          </div>
          <div className="rounded-2xl border border-white/70 bg-[#f6f4d2]/78 p-3 shadow-sm">
            <dt className="text-sm text-[#775149]">Waterings</dt>
            <dd className="m-0 text-2xl font-black text-[#34251f]">{props.data.wateringEvents.length}</dd>
          </div>
          <div className="rounded-2xl border border-white/70 bg-[#f6f4d2]/78 p-3 shadow-sm">
            <dt className="text-sm text-[#775149]">Nudges</dt>
            <dd className="m-0 text-2xl font-black text-[#34251f]">{props.data.reminders.length}</dd>
          </div>
        </dl>
      </Card>

      <Card className="grid gap-3 bg-[#fffdf0]/70">
        <p className={eyebrowClass}>Gentle nudges</p>
        <CardTitle>Watering reminders</CardTitle>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button type="button" onClick={props.onPermissionRequest}>
            Let this app remind me
          </Button>
          <Button variant="outline" type="button" onClick={props.onTestNotification}>
            Send a test nudge
          </Button>
        </div>
        <CardDescription>
          The test nudge is only there to confirm your phone allows notifications. Your watering plan still stays saved here either way.
        </CardDescription>
        <div className="grid gap-2 rounded-2xl bg-[#f6f4d2]/70 p-3 text-sm text-[#4b372e]">
          <StatusLine label="Secure page" ok={props.notificationStatus.secureContext} value={props.notificationStatus.secureContext ? 'yes' : 'no'} />
          <StatusLine label="Notification API" ok={props.notificationStatus.notificationApi} value={props.notificationStatus.notificationApi ? 'available' : 'missing'} />
          <StatusLine label="Permission" ok={props.notificationStatus.permission === 'granted'} value={props.notificationStatus.permission} />
          <StatusLine label="Service worker" ok={props.notificationStatus.serviceWorker} value={props.notificationStatus.serviceWorker ? 'available' : 'missing'} />
        </div>
        {!props.notificationStatus.secureContext && (
          <CardDescription>
            Firefox Mobile will not show web notifications from an insecure page. Use HTTPS, localhost on the same device, or install/open the PWA from a trusted origin.
          </CardDescription>
        )}
      </Card>
    </section>
  )
}

function StatusLine(props: { label: string; ok: boolean; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span>{props.label}</span>
      <strong className={props.ok ? 'text-[#4f6b2f]' : 'text-[#a44a3f]'}>
        {props.value}
      </strong>
    </div>
  )
}
