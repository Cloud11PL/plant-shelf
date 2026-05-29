import type { AppData } from '../../types/domain'
import { mutedClass, panelClass, primaryButton } from '../../utils/styles'

export function SettingsView(props: {
  data: AppData
  onPermissionRequest: () => void
  onNotifyDue: () => void
}) {
  return (
    <section className="grid gap-3.5">
      <section className={panelClass}>
        <p className="mb-1 text-xs font-extrabold uppercase tracking-normal text-[#775149]">Local storage</p>
        <h2 className="m-0 text-2xl tracking-normal text-[#34251f]">Device PWA storage</h2>
        <p className={mutedClass}>
          This v1 keeps shelves, plants, photos, watering history, and reminders in the storage available to the installed PWA on this phone.
        </p>
        <dl className="mt-3.5 grid grid-cols-2 gap-2.5">
          <div className="rounded-lg bg-[#f6f4d2] p-3">
            <dt className="text-sm text-[#775149]">Shelves</dt>
            <dd className="m-0 text-2xl font-black text-[#34251f]">{props.data.shelves.length}</dd>
          </div>
          <div className="rounded-lg bg-[#f6f4d2] p-3">
            <dt className="text-sm text-[#775149]">Plants</dt>
            <dd className="m-0 text-2xl font-black text-[#34251f]">{props.data.plants.length}</dd>
          </div>
          <div className="rounded-lg bg-[#f6f4d2] p-3">
            <dt className="text-sm text-[#775149]">Waterings</dt>
            <dd className="m-0 text-2xl font-black text-[#34251f]">{props.data.wateringEvents.length}</dd>
          </div>
          <div className="rounded-lg bg-[#f6f4d2] p-3">
            <dt className="text-sm text-[#775149]">Reminders</dt>
            <dd className="m-0 text-2xl font-black text-[#34251f]">{props.data.reminders.length}</dd>
          </div>
        </dl>
      </section>

      <section className={`${panelClass} grid gap-3`}>
        <p className="mb-1 text-xs font-extrabold uppercase tracking-normal text-[#775149]">Notifications</p>
        <h2 className="m-0 text-2xl tracking-normal text-[#34251f]">Local reminders</h2>
        <button className={primaryButton} type="button" onClick={props.onPermissionRequest}>
          Enable notifications
        </button>
        <button className={primaryButton} type="button" onClick={props.onNotifyDue}>
          Send due reminders now
        </button>
        <p className={mutedClass}>
          Browser support for persistent mobile PWA notifications varies. The app keeps reminders locally and sends supported notifications from the service worker when available.
        </p>
      </section>
    </section>
  )
}
