import React, { useMemo } from 'react'
import { TrendingUp } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Campaign } from '@/contexts/CampaignContext'
import { useTranslation } from 'react-i18next'

interface ProfitEvolutionChartProps {
  campaigns: Campaign[]
}

const ProfitEvolutionChart: React.FC<ProfitEvolutionChartProps> = ({ campaigns }) => {
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
    return campaigns.slice(0, 10).map((campaign, index) => {
      return {
        name: campaign.campanha.length > 8 ? campaign.campanha.substring(0, 8) + '...' : campaign.campanha,
        lucro: campaign.lucro || 0,
        roi: campaign.roi || 0,
        period: `P${index + 1}`
      }
    })
  }, [campaigns])

  return (
    <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-premium hover:shadow-glow transition-all duration-500">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-success to-success/80">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          {t('charts.evolutionOfProfit')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="period" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
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
                      <p className="text-foreground font-semibold mb-2">{`${t('charts.period')}: ${label}`}</p>
                      <p className="text-success font-bold text-lg">
                        {t('charts.profit')}: {formatCurrency(payload[0].value as number)}
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="lucro"
              stroke="hsl(var(--success))"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#profitGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default ProfitEvolutionChart