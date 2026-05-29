import { useCallback, useEffect, useState } from 'react'
import { dataRepository, initialData } from '../services/dataRepository'
import type { AppData } from '../types/domain'

export function useAppData() {
  const [data, setData] = useState<AppData>(initialData)
  const [isLoading, setIsLoading] = useState(true)

  const refreshData = useCallback(async () => {
    setIsLoading(true)
    const nextData = await dataRepository.load()
    setData(nextData)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    refreshData()
  }, [refreshData])

  return {
    data,
    isLoading,
    refreshData,
  }
}
