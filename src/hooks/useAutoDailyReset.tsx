import { useEffect } from 'react'
import { useCampaigns } from '@/contexts/CampaignContext'
import { useDailySnapshot } from '@/contexts/DailySnapshotContext'
import { getBrazilianDateTime, BRASILIA_TIMEZONE } from '@/utils/brazilianTime'

export const useAutoDailyReset = () => {
  const { campaigns, setCampaigns } = useCampaigns()
  const { saveSnapshot, currentDate } = useDailySnapshot()

  useEffect(() => {
    const handleDailyReset = (event: CustomEvent) => {
      const { newDate, previousDate, timezone } = event.detail
      
      // Verificar se o reset está acontecendo no horário correto (Brasília)
      if (timezone !== BRASILIA_TIMEZONE) {
        console.warn(`Reset detectado com timezone incorreto: ${timezone}. Esperado: ${BRASILIA_TIMEZONE}`)
        return
      }
      
      // Salvar snapshot das campanhas do dia anterior
      if (campaigns.length > 0) {
        saveSnapshot(campaigns)
        console.log(`Snapshot automático salvo para ${previousDate}. Resetando para ${newDate} (Brasília).`)
      }
      
      // Resetar campanhas para o novo dia
      setCampaigns([])
      
      // Notificar usuário sobre o reset (apenas se suportado)
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          const brasiliaTime = getBrazilianDateTime()
          new Notification('Sistema Atualizado - Horário de Brasília', {
            body: `Novo dia iniciado! Dados salvos e dashboard resetado para ${newDate} às ${brasiliaTime} (UTC-3).`,
            icon: '/favicon.ico'
          })
        }
      }
    }

    // Escutar evento de reset diário
    window.addEventListener('dailyReset', handleDailyReset as EventListener)
    
    return () => {
      window.removeEventListener('dailyReset', handleDailyReset as EventListener)
    }
  }, [campaigns, saveSnapshot, setCampaigns, currentDate])

  // Solicitar permissão para notificações na primeira vez
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission()
      }
    }
  }, [])

  // Função manual para salvar snapshot
  const manualSnapshot = () => {
    if (campaigns.length > 0) {
      saveSnapshot(campaigns)
      return true
    }
    return false
  }

  // Função manual para resetar o dia
  const manualReset = () => {
    if (campaigns.length > 0) {
      saveSnapshot(campaigns)
    }
    setCampaigns([])
  }

  return {
    manualSnapshot,
    manualReset,
    currentDate
  }
}