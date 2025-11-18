import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Campaign } from './CampaignContext'
import { 
  getBrazilianDate, 
  getBrazilianDateTime,
  BRASILIA_TIMEZONE,
  isNearMidnight,
  createBrazilianTimestamp
} from '@/utils/brazilianTime'

export interface DailySnapshot {
  date: string // YYYY-MM-DD format
  campaigns: Campaign[]
  timestamp: number
  timezone: string // 'America/Sao_Paulo'
}

interface DailySnapshotContextType {
  currentDate: string
  snapshots: DailySnapshot[]
  selectedHistoryDate: string | null
  isViewingHistory: boolean
  saveSnapshot: (campaigns: Campaign[]) => void
  getSnapshotByDate: (date: string) => DailySnapshot | null
  setSelectedHistoryDate: (date: string | null) => void
  updateHistoricalSnapshot: (date: string, campaigns: Campaign[]) => void
  getAllSnapshotDates: () => string[]
  resetToCurrentDay: () => void
}

const DailySnapshotContext = createContext<DailySnapshotContextType | undefined>(undefined)

export const DailySnapshotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentDate, setCurrentDate] = useState<string>(getBrazilianDate())
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<string | null>(null)
  const [snapshots, setSnapshots] = useState<DailySnapshot[]>(() => {
    const saved = localStorage.getItem('daily-snapshots')
    return saved ? JSON.parse(saved) : []
  })

  // Salvar snapshots no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('daily-snapshots', JSON.stringify(snapshots))
  }, [snapshots])

  // Sistema de verificação de mudança de data baseado no fuso horário de Brasília
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const checkDateChange = () => {
      const brasiliaDate = getBrazilianDate()
      
      if (brasiliaDate !== currentDate) {
        console.log(`Mudança de data detectada: ${currentDate} → ${brasiliaDate}`)
        setCurrentDate(brasiliaDate)
        
        // Disparar evento de reset diário
        window.dispatchEvent(new CustomEvent('dailyReset', { 
          detail: { 
            newDate: brasiliaDate,
            previousDate: currentDate,
            timezone: BRASILIA_TIMEZONE,
            timestamp: Date.now()
          } 
        }))
      }

      // Calcular tempo até próxima verificação baseado no horário de Brasília
      // Se estamos próximos da meia-noite, verificar a cada 30 segundos
      // Caso contrário, verificar a cada 5 minutos
      const checkInterval = isNearMidnight() ? 30000 : 300000 // 30s ou 5min
      
      timeoutId = setTimeout(checkDateChange, checkInterval)
    }

    // Iniciar verificação
    checkDateChange()
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [currentDate])

  const saveSnapshot = (campaigns: Campaign[]) => {
    const timestampInfo = createBrazilianTimestamp()
    
    const snapshot: DailySnapshot = {
      date: timestampInfo.date,
      campaigns: campaigns.map(campaign => ({ 
        ...campaign,
        // Garantir que a data do snapshot é sempre a data de Brasília
        snapshotDate: timestampInfo.date,
        snapshotTimezone: BRASILIA_TIMEZONE
      })),
      timestamp: timestampInfo.timestamp,
      timezone: BRASILIA_TIMEZONE
    }

    setSnapshots(prev => {
      // Remover snapshot existente da mesma data se houver
      const filtered = prev.filter(s => s.date !== timestampInfo.date)
      return [...filtered, snapshot].sort((a, b) => b.date.localeCompare(a.date))
    })

    console.log(`Snapshot salvo para ${timestampInfo.date} às ${timestampInfo.dateTime} (${BRASILIA_TIMEZONE})`)
  }

  // Auto-save automático à meia-noite
  useEffect(() => {
    const handleDailyReset = (event: CustomEvent) => {
      console.log('Evento de reset diário detectado, salvando snapshot automaticamente...')
      
      // Obter campanhas atuais do localStorage
      const saved = localStorage.getItem('campaigns')
      const currentCampaigns = saved ? JSON.parse(saved) : []
      
      if (currentCampaigns.length > 0) {
        saveSnapshot(currentCampaigns)
        console.log(`Snapshot automático salvo para ${event.detail.newDate}`)
      }
    }

    window.addEventListener('dailyReset', handleDailyReset as EventListener)
    
    return () => {
      window.removeEventListener('dailyReset', handleDailyReset as EventListener)
    }
  }, [])

  // Auto-save quando campanhas mudam (backup de segurança)
  useEffect(() => {
    const handleCampaignChange = () => {
      const saved = localStorage.getItem('campaigns')
      const currentCampaigns = saved ? JSON.parse(saved) : []
      
      if (currentCampaigns.length > 0) {
        // Salvar snapshot apenas se não existe um para hoje
        const today = getBrazilianDate()
        const existingSnapshot = getSnapshotByDate(today)
        
        if (!existingSnapshot) {
          saveSnapshot(currentCampaigns)
          console.log(`Snapshot de backup salvo para ${today}`)
        }
      }
    }

    // Debounce para evitar muitos saves
    const timeoutId = setTimeout(handleCampaignChange, 5000) // 5 segundos de delay
    
    return () => clearTimeout(timeoutId)
  }, [snapshots.length]) // Triggered when snapshots array length changes

  const getSnapshotByDate = (date: string): DailySnapshot | null => {
    return snapshots.find(s => s.date === date) || null
  }

  const updateHistoricalSnapshot = (date: string, updatedCampaigns: Campaign[]) => {
    setSnapshots(prev => prev.map(snapshot => {
      if (snapshot.date === date) {
        return {
          ...snapshot,
          campaigns: updatedCampaigns,
          timestamp: Date.now() // Atualizar timestamp da modificação
        }
      }
      return snapshot
    }))
  }

  const getAllSnapshotDates = (): string[] => {
    return snapshots.map(s => s.date).sort((a, b) => b.localeCompare(a))
  }

  const resetToCurrentDay = () => {
    setSelectedHistoryDate(null)
  }

  const isViewingHistory = selectedHistoryDate !== null

  return (
    <DailySnapshotContext.Provider value={{
      currentDate,
      snapshots,
      selectedHistoryDate,
      isViewingHistory,
      saveSnapshot,
      getSnapshotByDate,
      setSelectedHistoryDate,
      updateHistoricalSnapshot,
      getAllSnapshotDates,
      resetToCurrentDay
    }}>
      {children}
    </DailySnapshotContext.Provider>
  )
}

export const useDailySnapshot = () => {
  const context = useContext(DailySnapshotContext)
  if (context === undefined) {
    throw new Error('useDailySnapshot must be used within a DailySnapshotProvider')
  }
  return context
}