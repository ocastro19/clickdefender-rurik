import React, { useMemo } from 'react'
import { Crown, Trophy } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Campaign } from '@/contexts/CampaignContext'
import { useGlobalCurrencyFormatter } from '@/hooks/useGlobalCurrencyFormatter'
import { useDashboardCurrency, convertCurrencyForDashboard } from '@/contexts/DashboardCurrencyContext'
import { useTranslation } from 'react-i18next'

interface TopPerformersChartProps {
  campaigns: Campaign[]
}

const CampaignPerformanceCard: React.FC<{ campaign: Campaign; index: number; dashboardCurrency: 'BRL' | 'USD'; exchangeRate: number | null }> = ({ 
  campaign, 
  index,
  dashboardCurrency,
  exchangeRate
}) => {
  const { formatGlobalCurrency } = useGlobalCurrencyFormatter()
  const { t } = useTranslation()
  
  const convertedLucro = convertCurrencyForDashboard(
    campaign.lucro || 0, 
    campaign.currency || 'USD', 
    dashboardCurrency, 
    exchangeRate
  )
  
  return (
  <div className="relative p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-success/10 to-success/5 border-success/20 hover:border-success/40">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg bg-gradient-to-r from-success to-success/80 text-white shadow-lg">
          {index === 0 ? <Crown className="h-6 w-6" /> : <Trophy className="h-6 w-6" />}
        </div>
        
        <div>
          <p className="font-semibold text-foreground text-lg">
            {campaign.campanha.length > 20 ? campaign.campanha.substring(0, 20) + '...' : campaign.campanha}
          </p>
          <p className="text-muted-foreground text-sm">
            {t('charts.roi')}: <span className="font-semibold text-success">
              {(campaign.roi || 0).toFixed(1)}%
            </span>
          </p>
        </div>
      </div>
      
      <div className="text-right">
        <p className="text-xl font-bold text-success">
          {formatGlobalCurrency(convertedLucro)}
        </p>
        <Badge className="mt-2 bg-success/20 text-success hover:bg-success/30 border-success/40">
          #{index + 1} {t('charts.topPerformerBadge')}
        </Badge>
      </div>
    </div>
  </div>
  )
}

const TopPerformersChart: React.FC<TopPerformersChartProps> = ({ campaigns }) => {
  const { dashboardCurrency, exchangeRate } = useDashboardCurrency()
  const { formatGlobalCurrency } = useGlobalCurrencyFormatter()
  const { t } = useTranslation()
  
  const topPerformers = useMemo(() => {
    return [...campaigns]
      .sort((a, b) => (b.lucro || 0) - (a.lucro || 0))
      .filter(c => (c.lucro || 0) > 0)
      .slice(0, 5)
  }, [campaigns])

  return (
    <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-premium hover:shadow-glow transition-all duration-500">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-success to-success/80">
            <Crown className="h-6 w-6 text-white" />
          </div>
          {t('charts.topPerformersTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topPerformers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted/20 flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-semibold text-foreground mb-2">{t('charts.awaitingDataTitle')}</p>
              <p className="text-muted-foreground">{t('charts.noProfitableCampaignsFound')}</p>
            </div>
          ) : (
           topPerformers.map((campaign, index) => (
             <CampaignPerformanceCard
               key={campaign.id}
               campaign={campaign}
               index={index}
               dashboardCurrency={dashboardCurrency}
               exchangeRate={exchangeRate}
             />
           ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default TopPerformersChart