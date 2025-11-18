// Stub simples para presets
import { useState } from 'react'

export interface ColumnPreset {
  id: string
  name: string
  description?: string
  columns: string[]
  isDefault?: boolean
}

export const usePresets = () => {
  const [presets] = useState<ColumnPreset[]>([])
  
  const savePreset = () => {}
  const deletePreset = () => {}
  const updatePreset = () => {}
  
  return {
    presets,
    savePreset: (preset: any) => {},
    deletePreset: (id: any) => {},
    updatePreset: (id: any, updates: any) => {}
  }
}