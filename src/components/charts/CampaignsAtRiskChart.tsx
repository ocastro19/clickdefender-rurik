import React, { useMemo } from 'react'
import { AlertCircle, Crown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Campaign } from '@/contexts/CampaignContext'
import { useGlobalCurrencyFormatter } from '@/hooks/useGlobalCurrencyFormatter'
import { useDashboardCurrency, convertCurrencyForDashboard } from '@/contexts/DashboardCurrencyContext'
import { useTranslation } from 'react-i18next'

interface CampaignsAtRiskChartProps {
  campaigns: Campaign[]
}

const CampaignPerformanceCard: React.FC<{ campaign: Campaign; type: 'top' | 'risk'; dashboardCurrency: 'BRL' | 'USD'; exchangeRate: number | null }> = ({ 
  campaign, 
  type,
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
  <div className={`relative p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-[1.02] ${
    type === 'top' 
      ? 'bg-gradient-to-r from-success/10 to-success/5 border-success/20 hover:border-success/40' 
      : 'bg-gradient-to-r from-destructive/10 to-destructive/5 border-destructive/20 hover:border-destructive/40'
  }`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
          type === 'top' 
            ? 'bg-gradient-to-r from-success to-success/80 text-white shadow-lg' 
            : 'bg-gradient-to-r from-destructive to-destructive/80 text-white shadow-lg'
        }`}>
          {type === 'top' ? <Crown className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
        </div>
        
        <div>
          <p className="font-semibold text-foreground text-lg">
            {campaign.campanha.length > 20 ? campaign.campanha.substring(0, 20) + '...' : campaign.campanha}
          </p>
          <p className="text-muted-foreground text-sm">
            {t('charts.roi')}: <span className={`font-semibold ${(campaign.roi || 0) >= 0 ? 'text-success' : 'text-destructive'}`}>
              {(campaign.roi || 0).toFixed(1)}%
            </span>
          </p>
        </div>
      </div>
      
      <div className="text-right">
        <p className={`text-xl font-bold ${(campaign.lucro || 0) >= 0 ? 'text-success' : 'text-destructive'}`}>
          {formatGlobalCurrency(convertedLucro)}
        </p>
        <Badge className={`mt-2 ${
          type === 'top' 
            ? 'bg-success/20 text-success hover:bg-success/30 border-success/40' 
            : 'bg-destructive/20 text-destructive hover:bg-destructive/30 border-destructive/40'
        }`}>
          {type === 'top' ? t('charts.topPerformerBadge') : t('charts.requiresAttentionBadge')}
        </Badge>
      </div>
    </div>
  </div>
  )
}

const CampaignsAtRiskChart: React.FC<CampaignsAtRiskChartProps> = ({ campaigns }) => {
  const { dashboardCurrency, exchangeRate } = useDashboardCurrency()
  const { formatGlobalCurrency } = useGlobalCurrencyFormatter()
  const { t } = useTranslation()
  
  const performers = useMemo(() => {
    const sorted = [...campaigns].sort((a, b) => (b.lucro || 0) - (a.lucro || 0))
    return {
      risk: sorted.filter(c => (c.lucro || 0) < 0).slice(0, 5)
    }
  }, [campaigns])

  return (
    <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-premium hover:shadow-glow transition-all duration-500">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-destructive to-destructive/80">
            <AlertCircle className="h-6 w-6 text-white" />
          </div>
          {t('charts.campaignsAtRiskTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {performers.risk.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto rounded-full bg-success/20 flex items-center justify-center mb-4">
                <Crown className="h-8 w-8 text-success" />
              </div>
              <p className="text-lg font-semibold text-foreground mb-2">{t('charts.excellentTitle')}</p>
              <p className="text-muted-foreground">{t('charts.noRiskCampaignsFound')}</p>
            </div>
          ) : (
           performers.risk.map((campaign, index) => (
             <CampaignPerformanceCard
               key={campaign.id}
               campaign={campaign}
               type="risk"
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

export default CampaignsAtRiskChart