import React, { useMemo } from 'react'
import { DollarSign } from 'lucide-react'
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Campaign } from '@/contexts/CampaignContext'
import { useTranslation } from 'react-i18next'

interface InvestmentRevenueChartProps {
  campaigns: Campaign[]
}

const InvestmentRevenueChart: React.FC<InvestmentRevenueChartProps> = ({ campaigns }) => {
  const { t } = useTranslation()
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }
  
  const data = useMemo(() => {
    return campaigns.slice(0, 8).map(campaign => {
      return {
        name: campaign.campanha.length > 10 ? campaign.campanha.substring(0, 10) + '...' : campaign.campanha,
        investimento: campaign.custo || 0,
        faturamento: campaign.faturamento || 0,
        lucro: (campaign.faturamento || 0) - (campaign.custo || 0)
      }
    })
  }, [campaigns])

  return (
    <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-premium hover:shadow-glow transition-all duration-500">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          {t('charts.investmentVsRevenue')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-premium">
                      <p className="text-foreground font-semibold mb-3">{label}</p>
                      {payload.map((entry, index) => (
                        <p key={index} className="font-semibold" style={{ color: entry.color }}>
                          {entry.name}: {formatCurrency(entry.value as number)}
                        </p>
                      ))}
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="investimento" fill="hsl(var(--destructive))" name={t('charts.investment')} radius={[4, 4, 0, 0]} />
            <Bar dataKey="faturamento" fill="hsl(var(--success))" name={t('charts.revenue')} radius={[4, 4, 0, 0]} />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default InvestmentRevenueChart