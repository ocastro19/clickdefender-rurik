import React, { useMemo } from 'react'
import { Target } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Campaign } from '@/contexts/CampaignContext'
import { useTranslation } from 'react-i18next'

interface ROIChartProps {
  campaigns: Campaign[]
}

const ROIChart: React.FC<ROIChartProps> = ({ campaigns }) => {
  const { t } = useTranslation()
  const data = useMemo(() => {
    return campaigns
      .map(campaign => ({
        name: campaign.campanha.length > 12 ? campaign.campanha.substring(0, 12) + '...' : campaign.campanha,
        roi: campaign.roi || 0,
        isNegative: (campaign.roi || 0) < 0
      }))
      .sort((a, b) => b.roi - a.roi)
      .slice(0, 8)
  }, [campaigns])

  return (
    <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-premium hover:shadow-glow transition-all duration-500">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
            <Target className="h-6 w-6 text-white" />
          </div>
          {t('charts.roiPerCampaign')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              width={120}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const value = payload[0].value as number
                  return (
                    <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-premium">
                      <p className="text-foreground font-semibold mb-2">{label}</p>
                      <p className={`font-bold text-lg ${value >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {t('charts.roi')}: {value.toFixed(1)}%
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="roi" radius={[0, 8, 8, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isNegative ? 'hsl(var(--destructive))' : 'hsl(var(--success))'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default ROIChart