import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import { Campaign } from '@/contexts/CampaignContext'
import { useGlobalCurrencyFormatter } from '@/hooks/useGlobalCurrencyFormatter'
import { useDashboardCurrency, convertCurrencyForDashboard } from '@/contexts/DashboardCurrencyContext'
import { useTranslation } from 'react-i18next'

interface CostRevenueChartProps {
  campaigns: Campaign[]
}

const CostRevenueChart: React.FC<CostRevenueChartProps> = ({ campaigns }) => {
  const { dashboardCurrency, exchangeRate } = useDashboardCurrency()
  const { formatGlobalCurrency } = useGlobalCurrencyFormatter()
  const { t } = useTranslation()
  
  const chartData = useMemo(() => {
    // Generate realistic data from campaigns over last 30 days
    const today = new Date()
    const data = []
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dayStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`
      
      // Calculate daily metrics from campaigns
      const dailyCost = campaigns.reduce((sum, campaign) => {
        const convertedCost = convertCurrencyForDashboard(
          (campaign.custo || 0) / 30, // Distribute monthly cost over 30 days
          campaign.currency || 'USD',
          dashboardCurrency,
          exchangeRate
        )
        return sum + convertedCost
      }, 0)
      
      const dailyRevenue = campaigns.reduce((sum, campaign) => {
        const convertedRevenue = convertCurrencyForDashboard(
          (campaign.faturamento || 0) / 30, // Distribute monthly revenue over 30 days
          campaign.currency || 'USD',
          dashboardCurrency,
          exchangeRate
        )
        return sum + convertedRevenue
      }, 0)
      
      data.push({
        day: `Dia ${30 - i}`,
        dayStr,
        revenue: dailyRevenue,
        cost: dailyCost,
        profit: dailyRevenue - dailyCost
      })
    }
    
    return data
  }, [campaigns, dashboardCurrency, exchangeRate])

  return (
    <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-premium hover:shadow-glow transition-all duration-500">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-xl lg:text-2xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
          <div className="p-1 sm:p-2 rounded-md sm:rounded-lg bg-gradient-to-r from-primary to-primary/80">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
          </div>
          <span className="hidden sm:block">{t('charts.costVsRevenue')}</span>
          <span className="sm:hidden">{t('charts.costVsRevenue')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} barCategoryGap="10%" margin={{ left: 0, right: 0, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="day" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={10}
              tickLine={false}
              interval="preserveStartEnd"
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={10}
              tickLine={false}
              width={60}
              tickFormatter={(value) => {
                if (value >= 1000) {
                  return `${(value / 1000).toFixed(0)}k`
                }
                return value.toFixed(0)
              }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const revenue = payload.find(p => p.dataKey === 'revenue')?.value as number || 0
                  const cost = payload.find(p => p.dataKey === 'cost')?.value as number || 0
                  const profit = revenue - cost
                  
                  return (
                    <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-premium">
                      <p className="text-foreground font-semibold mb-3">{typeof label === 'string' && label.includes('Dia') ? `${label} (${chartData[parseInt(String(label).split(' ')[1]) - 1]?.dayStr})` : label}</p>
                      <div className="space-y-2">
                        <p className="text-success font-semibold">
                          {t('charts.revenue')}: {formatGlobalCurrency(revenue)}
                        </p>
                        <p className="text-destructive font-semibold">
                          {t('charts.cost')}: {formatGlobalCurrency(cost)}
                        </p>
                        <div className="border-t pt-2">
                          <p className={`font-bold text-lg ${profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {t('charts.profit')}: {formatGlobalCurrency(profit)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar 
              dataKey="revenue" 
              fill="hsl(var(--success))" 
              name={t('charts.expectedRevenue')}
              radius={[4, 4, 0, 0]}
              opacity={0.8}
            />
            <Bar 
              dataKey="cost" 
              fill="hsl(var(--destructive))" 
              name={t('charts.realCost')}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default CostRevenueChart