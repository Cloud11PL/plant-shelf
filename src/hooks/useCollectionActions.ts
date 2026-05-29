import { type FormEvent, useEffect, useState } from 'react'
import { photoStorageService } from '../services/photoStorageService'
import { plantService } from '../services/plantService'
import { shelfService } from '../services/shelfService'
import type { AppData, EntityId, Plant, Shelf } from '../types/domain'
import type { PlantEditFormState, PlantFormState, QuickStartFormState, ShelfEditFormState } from '../types/ui'
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
  const [selectedPlantId, setSelectedPlantId] = useState<EntityId | undefined>()
  const [plantEditForm, setPlantEditForm] = useState<PlantEditFormState | undefined>()
  const [shelfEditForm, setShelfEditForm] = useState<ShelfEditFormState | undefined>()
  const [quickStartForm, setQuickStartForm] = useState<QuickStartFormState>({
    shelfName: '',
    plantName: '',
  })

  const selectedShelf = data.shelves.find((shelf) => shelf.id === selectedShelfId) ?? data.shelves[0]
  const shelfPlants = selectedShelf ? data.plants.filter((plant) => plant.shelfId === selectedShelf.id) : []
  const selectedPlant = data.plants.find((plant) => plant.id === selectedPlantId)

  useEffect(() => {
    if (!selectedShelfId && data.shelves[0]) {
      setSelectedShelfId(data.shelves[0].id)
      setPlantForm((current) => ({ ...current, shelfId: data.shelves[0].id }))
    }
  }, [data.shelves, selectedShelfId])

  useEffect(() => {
    if (!selectedPlantId) {
      return
    }

    const plant = data.plants.find((item) => item.id === selectedPlantId)

    if (!plant) {
      setSelectedPlantId(undefined)
      setPlantEditForm(undefined)
      return
    }

    setPlantEditForm(toPlantEditForm(plant))
  }, [data.plants, selectedPlantId])

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
    setNotice(`${shelf.name} has a spot now.`)
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
    setSelectedPlantId(plant.id)
    setPlantEditForm(toPlantEditForm(plant))
    setNotice(`${plant.name} moved in.`)
    await refreshData()
  }

  async function handleUpdatePlant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!plantEditForm?.name.trim()) {
      return
    }

    const current = data.plants.find((plant) => plant.id === plantEditForm.id)

    if (!current) {
      return
    }

    const photoId = plantEditForm.photo ? await photoStorageService.save(plantEditForm.photo) : undefined
    const plant = await plantService.update(current, {
      shelfId: plantEditForm.shelfId,
      name: plantEditForm.name,
      species: plantEditForm.species,
      note: plantEditForm.note,
      wateringIntervalDays: parseOptionalNumber(plantEditForm.intervalDays),
      photoId,
    })

    setPlantEditForm(toPlantEditForm(plant))
    setNotice(`${plant.name} looks up to date.`)
    await refreshData()
  }

  async function handleDeletePlant(plant: Plant) {
    await plantService.remove(plant, data.reminders)
    setNotice(randomPlantRemovedMessage(plant.name))

    if (selectedPlantId === plant.id) {
      setSelectedPlantId(undefined)
      setPlantEditForm(undefined)
    }

    await refreshData()
  }

  async function handleUpdateShelf(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!shelfEditForm?.name.trim()) {
      return
    }

    const current = data.shelves.find((shelf) => shelf.id === shelfEditForm.id)

    if (!current) {
      return
    }

    const photoId = shelfEditForm.photo ? await photoStorageService.save(shelfEditForm.photo) : undefined
    const shelf = await shelfService.update(current, {
      name: shelfEditForm.name,
      wateringIntervalDays: parseOptionalNumber(shelfEditForm.intervalDays),
      photoId,
    })

    setShelfEditForm(toShelfEditForm(shelf))
    setNotice(`${shelf.name} looks up to date.`)
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
    setNotice(quickStartForm.plantName.trim() ? 'Your first shelf and plant are in.' : 'Your first shelf is ready.')
    await refreshData()
  }

  async function handleDeleteShelf(shelf: Shelf) {
    await shelfService.remove(shelf, data.plants, data.reminders)
    setNotice(`${shelf.name} is gone from the shelf list.`)
    setSelectedShelfId(undefined)
    await refreshData()
  }

  function handleShelfSelect(shelfId: EntityId) {
    setSelectedShelfId(shelfId)
    setPlantForm((current) => ({ ...current, shelfId }))
    setSelectedPlantId(undefined)
    setPlantEditForm(undefined)
  }

  function handleShelfEdit(shelf: Shelf) {
    setShelfEditForm(toShelfEditForm(shelf))
  }

  function handlePlantSelect(plant: Plant) {
    setSelectedPlantId(plant.id)
    setPlantEditForm(undefined)
  }

  function handlePlantEdit(plant: Plant) {
    setSelectedPlantId(plant.id)
    setPlantEditForm(toPlantEditForm(plant))
  }

  return {
    plantEditForm,
    plantForm,
    quickStartForm,
    selectedPlant,
    selectedShelf,
    shelfEditForm,
    shelfInterval,
    shelfName,
    shelfPlants,
    actions: {
      createPlant: handleCreatePlant,
      createShelf: handleCreateShelf,
      deleteShelf: handleDeleteShelf,
      deletePlant: handleDeletePlant,
      quickStart: handleQuickStart,
      selectPlantForEdit: handlePlantEdit,
      selectPlant: handlePlantSelect,
      selectShelf: handleShelfSelect,
      selectShelfForEdit: handleShelfEdit,
      setPlantEditForm,
      setPlantForm,
      setQuickStartForm,
      setShelfEditForm,
      setShelfInterval,
      setShelfName,
      setShelfPhoto,
      updatePlant: handleUpdatePlant,
      updateShelf: handleUpdateShelf,
    },
  }
}

function randomPlantRemovedMessage(name: string) {
  const messages = [
    `${name} moved out.`,
    `${name} left the shelf.`,
    `${name} is off the plant list.`,
    `${name} packed its little pot.`,
    `${name} made room for something new.`,
  ]

  return messages[Math.floor(Math.random() * messages.length)]
}

function toPlantEditForm(plant: Plant): PlantEditFormState {
  return {
    id: plant.id,
    shelfId: plant.shelfId,
    name: plant.name,
    species: plant.species ?? '',
    note: plant.note ?? '',
    intervalDays: plant.wateringIntervalDays?.toString() ?? '',
  }
}

function toShelfEditForm(shelf: Shelf): ShelfEditFormState {
  return {
    id: shelf.id,
    name: shelf.name,
    intervalDays: shelf.wateringIntervalDays?.toString() ?? '',
  }
}
