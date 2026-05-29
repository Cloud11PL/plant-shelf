import { SettingsView } from './components/settings/SettingsView'
import { ShelvesView } from './components/shelves/ShelvesView'
import { WateringView } from './components/watering/WateringView'
import { usePlantTracker } from './hooks/usePlantTracker'
import PWABadge from './PWABadge.tsx'
import { cn, panelClass, primaryButton } from './utils/styles'

function App() {
  const tracker = usePlantTracker()

  return (
    <main className="mx-auto min-h-screen w-full max-w-[680px] px-3.5 pt-[18px] pb-[92px] sm:px-5">
      <header className="mb-3.5 flex items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-extrabold uppercase tracking-normal text-[#775149]">Offline PWA</p>
          <h1 className="m-0 text-[2rem] leading-none tracking-normal text-[#34251f]">Plant Tracker</h1>
        </div>
        <div className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#cbdfbd] bg-[#fffdf0] px-3 py-2 text-[#4b372e]">
          <strong className="text-xl text-[#a44a3f]">{tracker.scheduledCount}</strong>
          <span>scheduled</span>
        </div>
      </header>

      {tracker.notice && (
        <button className={cn(primaryButton, 'mb-3.5 w-full bg-[#f19c79] text-left')} type="button" onClick={() => tracker.actions.setNotice('')}>
          {tracker.notice}
        </button>
      )}

      {tracker.isLoading ? (
        <section className={panelClass}>
          <p>Loading local plant storage...</p>
        </section>
      ) : (
        <>
          {tracker.view === 'shelves' && (
            <ShelvesView
              shelves={tracker.data.shelves}
              plants={tracker.data.plants}
              photoUrls={tracker.photoUrls}
              selectedShelf={tracker.selectedShelf}
              shelfPlants={tracker.shelfPlants}
              shelfName={tracker.shelfName}
              shelfInterval={tracker.shelfInterval}
              plantForm={tracker.plantForm}
              quickStartForm={tracker.quickStartForm}
              onShelfNameChange={tracker.actions.setShelfName}
              onShelfIntervalChange={tracker.actions.setShelfInterval}
              onShelfPhotoChange={tracker.actions.setShelfPhoto}
              onCreateShelf={tracker.actions.createShelf}
              onQuickStart={tracker.actions.quickStart}
              onSelectShelf={tracker.actions.selectShelf}
              onDeleteShelf={tracker.actions.deleteShelf}
              onPlantFormChange={tracker.actions.setPlantForm}
              onQuickStartFormChange={tracker.actions.setQuickStartForm}
              onCreatePlant={tracker.actions.createPlant}
              onWaterTarget={tracker.actions.waterTarget}
            />
          )}

          {tracker.view === 'watering' && (
            <WateringView
              targets={tracker.targets}
              reminders={tracker.data.reminders}
              groups={tracker.reminderGroups}
              wateringTarget={tracker.wateringTarget}
              customReminderAt={tracker.customReminderAt}
              predictionLabel={tracker.predictionLabel}
              relativeReminder={tracker.relativeReminder}
              reminderOptions={tracker.reminderOptions}
              onTargetSelect={tracker.actions.waterTarget}
              onCustomReminderChange={tracker.actions.setCustomReminderAt}
              onRelativeReminderChange={tracker.actions.setRelativeReminder}
              onWatered={tracker.actions.watered}
            />
          )}

          {tracker.view === 'settings' && (
            <SettingsView
              data={tracker.data}
              onPermissionRequest={tracker.actions.requestPermission}
              onNotifyDue={tracker.actions.notifyDue}
            />
          )}
        </>
      )}

      <nav className="fixed inset-x-0 bottom-0 flex items-center justify-center gap-2 border-t border-[#a44a3f]/15 bg-[#f6f4d2]/95 px-3 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] backdrop-blur" aria-label="Primary navigation">
        <button className={cn(primaryButton, 'w-[min(30%,150px)] bg-transparent', tracker.view === 'shelves' && 'bg-[#a44a3f] text-[#fffdf0]')} type="button" onClick={() => tracker.actions.setView('shelves')}>
          Shelves
        </button>
        <button className={cn(primaryButton, 'w-[min(30%,150px)] bg-transparent', tracker.view === 'watering' && 'bg-[#a44a3f] text-[#fffdf0]')} type="button" onClick={() => tracker.actions.setView('watering')}>
          Watering
        </button>
        <button className={cn(primaryButton, 'w-[min(30%,150px)] bg-transparent', tracker.view === 'settings' && 'bg-[#a44a3f] text-[#fffdf0]')} type="button" onClick={() => tracker.actions.setView('settings')}>
          Settings
        </button>
      </nav>

      <PWABadge />
    </main>
  )
}

export default App
