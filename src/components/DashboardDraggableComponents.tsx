import React from 'react'
import { Campaign } from '@/contexts/CampaignContext'

interface DashboardDraggableComponentsProps {
  campaigns: Campaign[]
  selectedCampaign: string
  onCampaignChange: (value: string) => void
  dashboardCurrency: 'BRL' | 'USD'
  exchangeRate: number
}

const DashboardDraggableComponents: React.FC<DashboardDraggableComponentsProps> = ({ 
  campaigns 
}) => {
  // Componente vazio - sem charts para mostrar
  return null
}

export default DashboardDraggableComponents