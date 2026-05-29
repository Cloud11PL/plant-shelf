import { type FormEvent, useEffect, useState } from 'react'
import { photoStorageService } from '../services/photoStorageService'
import { plantService } from '../services/plantService'
import { shelfService } from '../services/shelfService'
import type { AppData, EntityId, Shelf } from '../types/domain'
import type { PlantFormState, QuickStartFormState } from '../types/ui'
import { parseOptionalNumber } from '../utils/watering'

const emptyPlantForm: PlantFormState = {
  shelfId: '',
  name: '',
  species: '',
  note: '',
  intervalDays: '',
}

export function useCollectionActions(
  data: AppData,
  refreshData: () => Promise<void>,
  setNotice: (notice: string) => void,
) {
  const [selectedShelfId, setSelectedShelfId] = useState<EntityId | undefined>()
  const [shelfName, setShelfName] = useState('')
  const [shelfInterval, setShelfInterval] = useState('')
  const [shelfPhoto, setShelfPhoto] = useState<File | undefined>()
  const [plantForm, setPlantForm] = useState<PlantFormState>(emptyPlantForm)
  const [quickStartForm, setQuickStartForm] = useState<QuickStartFormState>({
    shelfName: '',
    plantName: '',
  })

  const selectedShelf = data.shelves.find((shelf) => shelf.id === selectedShelfId) ?? data.shelves[0]
  const shelfPlants = selectedShelf ? data.plants.filter((plant) => plant.shelfId === selectedShelf.id) : []

  useEffect(() => {
    if (!selectedShelfId && data.shelves[0]) {
      setSelectedShelfId(data.shelves[0].id)
      setPlantForm((current) => ({ ...current, shelfId: data.shelves[0].id }))
    }
  }, [data.shelves, selectedShelfId])

  async function handleCreateShelf(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!shelfName.trim()) {
      return
    }

    const photoId = shelfPhoto ? await photoStorageService.save(shelfPhoto) : undefined
    const shelf = await shelfService.create({
      name: shelfName,
      photoId,
      wateringIntervalDays: parseOptionalNumber(shelfInterval),
    })

    setShelfName('')
    setShelfInterval('')
    setShelfPhoto(undefined)
    setSelectedShelfId(shelf.id)
    setNotice(`Shelf "${shelf.name}" added.`)
    await refreshData()
  }

  async function handleCreatePlant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!plantForm.name.trim() || !plantForm.shelfId) {
      return
    }

    const photoId = plantForm.photo ? await photoStorageService.save(plantForm.photo) : undefined
    const plant = await plantService.create({
      shelfId: plantForm.shelfId,
      name: plantForm.name,
      species: plantForm.species,
      note: plantForm.note,
      wateringIntervalDays: parseOptionalNumber(plantForm.intervalDays),
      photoId,
    })

    setPlantForm({ ...emptyPlantForm, shelfId: plantForm.shelfId })
    setNotice(`Plant "${plant.name}" added.`)
    await refreshData()
  }

  async function handleQuickStart(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!quickStartForm.shelfName.trim()) {
      return
    }

    const shelf = await shelfService.create({ name: quickStartForm.shelfName })

    if (quickStartForm.plantName.trim()) {
      await plantService.create({
        shelfId: shelf.id,
        name: quickStartForm.plantName,
      })
    }

    setQuickStartForm({ shelfName: '', plantName: '' })
    setSelectedShelfId(shelf.id)
    setNotice(quickStartForm.plantName.trim() ? 'First shelf and plant added.' : 'First shelf added.')
    await refreshData()
  }

  async function handleDeleteShelf(shelf: Shelf) {
    await shelfService.remove(shelf, data.plants, data.reminders)
    setNotice(`Shelf "${shelf.name}" removed.`)
    setSelectedShelfId(undefined)
    await refreshData()
  }

  function handleShelfSelect(shelfId: EntityId) {
    setSelectedShelfId(shelfId)
    setPlantForm((current) => ({ ...current, shelfId }))
  }

  return {
    plantForm,
    quickStartForm,
    selectedShelf,
    shelfInterval,
    shelfName,
    shelfPlants,
    actions: {
      createPlant: handleCreatePlant,
      createShelf: handleCreateShelf,
      deleteShelf: handleDeleteShelf,
      quickStart: handleQuickStart,
      selectShelf: handleShelfSelect,
      setPlantForm,
      setQuickStartForm,
      setShelfInterval,
      setShelfName,
      setShelfPhoto,
    },
  }
}
