// Stub simples para histórico de mudanças
import { useState } from 'react'

export interface HistoryEntry {
  id: string
  date: string
  changes: any[]
  type: string
  fieldLabel: string
  notes?: string
  timestamp: string
  user?: string
  oldValue?: any
  newValue?: any
  field: string
}

export const useChangeHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  
  return {
    history,
    addHistoryEntry: (entry: any) => {},
    clearHistory: () => {}
  }
}