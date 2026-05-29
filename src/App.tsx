import { useState } from 'react'
import { SettingsView } from './components/settings/SettingsView'
import { ShelvesView } from './components/shelves/ShelvesView'
import { WateringDialog } from './components/watering/WateringDialog'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import { Dialog, DialogContent } from './components/ui/dialog'
import { usePlantTracker } from './hooks/usePlantTracker'
import PWABadge from './PWABadge.tsx'
import { eyebrowClass } from './utils/styles'

function App() {
  const tracker = usePlantTracker()
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <main className="mx-auto min-h-screen w-full max-w-[720px] px-3.5 pt-4 pb-8 sm:px-5">
      <header className="mb-4 rounded-[1.7rem] border border-white/60 bg-[#fffdf0]/82 p-4 shadow-[0_14px_34px_rgba(76,55,46,0.1)] ring-1 ring-[#a44a3f]/8">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className={eyebrowClass}>Offline PWA</p>
            <h1 className="m-0 text-[2.15rem] font-black leading-none tracking-normal text-[#34251f]">Plant Tracker</h1>
            <p className="mt-2 max-w-[24rem] text-sm leading-5 text-[#6f5a50]">A calm little home for your plants, shelves, and watering nudges.</p>
          </div>
          <div className="flex shrink-0 items-start gap-2">
            <div className="grid min-w-[74px] place-items-center rounded-2xl bg-[#a44a3f] px-3 py-2 text-[#fffdf0] shadow-lg shadow-[#a44a3f]/20">
              <strong className="text-2xl leading-none">{tracker.scheduledCount}</strong>
              <span className="text-[0.72rem] font-bold uppercase">nudges</span>
            </div>
            <Button aria-label="Open settings" size="icon" variant="outline" type="button" onClick={() => setSettingsOpen(true)}>
              ⚙
            </Button>
          </div>
        </div>
      </header>

      {tracker.notice && (
        <Button className="mb-3.5 w-full justify-start bg-[#d4e09b]" type="button" onClick={() => tracker.actions.setNotice('')}>
          {tracker.notice}
        </Button>
      )}

      {tracker.pwaInstall.shouldShowInstallHelp && (
        <Card className="mb-4 grid gap-3 bg-[#fffdf0]/72">
          <div>
            <p className={eyebrowClass}>Keep it handy</p>
            <p className="m-0 text-sm leading-5 text-[#6f5a50]">
              Add Plant Tracker to your home screen so it opens like a small app, even when you are offline.
            </p>
          </div>
          {tracker.pwaInstall.canInstall ? (
            <Button type="button" onClick={tracker.pwaInstall.install}>
              Add to Home Screen
            </Button>
          ) : (
            <p className="m-0 rounded-2xl bg-[#f6f4d2]/70 px-3 py-2 text-sm font-bold text-[#775149]">
              On your phone, open the browser menu and choose Add to Home Screen.
            </p>
          )}
        </Card>
      )}

      {tracker.isLoading ? (
        <Card>
          <p>Opening your plant shelf...</p>
        </Card>
      ) : (
        <ShelvesView
          shelves={tracker.data.shelves}
          plants={tracker.data.plants}
          photoUrls={tracker.photoUrls}
          selectedShelf={tracker.selectedShelf}
          shelfPlants={tracker.shelfPlants}
          shelfName={tracker.shelfName}
          shelfInterval={tracker.shelfInterval}
          plantForm={tracker.plantForm}
          plantEditForm={tracker.plantEditForm}
          shelfEditForm={tracker.shelfEditForm}
          quickStartForm={tracker.quickStartForm}
          selectedPlant={tracker.selectedPlant}
          onShelfNameChange={tracker.actions.setShelfName}
          onShelfIntervalChange={tracker.actions.setShelfInterval}
          onShelfPhotoChange={tracker.actions.setShelfPhoto}
          onCreateShelf={tracker.actions.createShelf}
          onQuickStart={tracker.actions.quickStart}
          onSelectShelf={tracker.actions.selectShelf}
          onDeleteShelf={tracker.actions.deleteShelf}
          onEditShelf={tracker.actions.selectShelfForEdit}
          onPlantFormChange={tracker.actions.setPlantForm}
          onPlantEditFormChange={tracker.actions.setPlantEditForm}
          onShelfEditFormChange={tracker.actions.setShelfEditForm}
          onQuickStartFormChange={tracker.actions.setQuickStartForm}
          onCreatePlant={tracker.actions.createPlant}
              onUpdatePlant={tracker.actions.updatePlant}
              onUpdateShelf={tracker.actions.updateShelf}
              onSelectPlant={tracker.actions.selectPlant}
              onEditPlant={tracker.actions.selectPlantForEdit}
              onDeletePlant={tracker.actions.deletePlant}
              onWaterTarget={tracker.actions.waterTarget}
            />
      )}

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <SettingsView
            data={tracker.data}
            notificationStatus={tracker.notificationStatus.status}
            onPermissionRequest={tracker.actions.requestPermission}
            onTestNotification={tracker.actions.testNotification}
          />
        </DialogContent>
      </Dialog>

      <WateringDialog
        target={tracker.wateringTarget}
        customReminderAt={tracker.customReminderAt}
        predictionLabel={tracker.predictionLabel}
        relativeReminder={tracker.relativeReminder}
        reminderOptions={tracker.reminderOptions}
        onClose={tracker.actions.closeWatering}
        onCustomReminderChange={tracker.actions.setCustomReminderAt}
        onRelativeReminderChange={tracker.actions.setRelativeReminder}
        onWatered={tracker.actions.watered}
      />
      <PWABadge />
    </main>
  )
}

export default App
