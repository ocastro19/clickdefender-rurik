import React from 'react'
import { useTranslation } from 'react-i18next'
import { Campaign } from '@/contexts/CampaignContext'
import { useDashboardCurrency } from '@/contexts/DashboardCurrencyContext'
import DraggableDashboard from './DraggableDashboard'
import PerformanceChart from './PerformanceChart'
import DadosDemograficos from './DadosDemograficos'
import PremiumAnalyticsDashboard from './PremiumAnalyticsDashboard'

interface AnalyticsDraggableComponentsProps {
  campaigns: Campaign[]
}

const AnalyticsDraggableComponents: React.FC<AnalyticsDraggableComponentsProps> = ({ campaigns }) => {
  const { t } = useTranslation();
  
  // Definir os componentes que podem ser arrastados na ordem padrão desejada
  const analyticsCharts = [
    {
      id: 'dados-demograficos',
      title: t('analytics.components.demographicData.title'),
      component: DadosDemograficos
    },
    {
      id: 'premium-analytics',
      title: t('analytics.components.premiumAnalytics.title'),
      component: PremiumAnalyticsDashboard
    },
    {
      id: 'performance-chart',
      title: t('analytics.components.performanceChart.title'),
      component: (props) => <PerformanceChart campaigns={props.campaigns} />
    }
  ]

  return (
    <div className="mt-8">
      <DraggableDashboard charts={analyticsCharts} campaigns={campaigns} />
    </div>
  )
}

export default AnalyticsDraggableComponents