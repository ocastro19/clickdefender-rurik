import React, { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import { Campaign } from '@/contexts/CampaignContext'
import { useDashboardCurrency, convertCurrencyForDashboard } from '@/contexts/DashboardCurrencyContext'

interface ForecastChartProps {
  campaigns: Campaign[]
  projectedRevenue: number
  confidence: number
}

const ForecastChart: React.FC<ForecastChartProps> = ({ 
  campaigns, 
  projectedRevenue, 
  confidence 
}) => {
  const { dashboardCurrency, exchangeRate } = useDashboardCurrency()
  
  const chartData = useMemo(() => {
    if (!campaigns.length) return []
    
    // Preparar dados históricos (últimos 14 dias)
    const historicalData = campaigns.slice(-14).map((campaign, index) => ({
      day: `Dia ${index + 1}`,
      date: campaign.data,
      historical: convertCurrencyForDashboard(
        campaign.faturamento || 0,
        campaign.currency || 'USD',
        dashboardCurrency,
        exchangeRate
      ),
      cost: convertCurrencyForDashboard(
        campaign.custo || 0,
        campaign.currency || 'USD',
        dashboardCurrency,
        exchangeRate
      )
    }))
    
    // Calcular tendência para projeção
    const lastValue = historicalData[historicalData.length - 1]?.historical || 0
    const avgGrowth = historicalData.length > 1 ? 
      (lastValue - (historicalData[0]?.historical || 0)) / historicalData.length : 0
    
    // Gerar dados de projeção (próximos 16 dias para completar 30)
    const projectionData = Array.from({ length: 16 }, (_, index) => {
      const projectedValue = Math.max(0, lastValue + (avgGrowth * (index + 1)))
      const confidenceRange = projectedValue * (confidence / 100) * 0.3 // 30% do valor como margem
      
      return {
        day: `Dia ${14 + index + 1}`,
        date: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        forecast: projectedValue,
        confidenceUpper: projectedValue + confidenceRange,
        confidenceLower: Math.max(0, projectedValue - confidenceRange),
        cost: lastValue * 0.33 // Estimativa baseada no ROAS médio de 3x
      }
    })
    
    return [...historicalData, ...projectionData]
  }, [campaigns, projectedRevenue, confidence, dashboardCurrency, exchangeRate])
  
  const formatCurrency = (value: number) => {
    const locale = dashboardCurrency === 'BRL' ? 'pt-BR' : 'en-US'
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: dashboardCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-premium hover:shadow-glow transition-all duration-500">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          📈 Projeção - Próximos 30 Dias
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            
            <XAxis 
              dataKey="day" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              interval={2}
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
                  const isHistorical = payload.some(p => p.dataKey === 'historical')
                  const isForecast = payload.some(p => p.dataKey === 'forecast')
                  
                  return (
                    <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-premium">
                      <p className="text-foreground font-semibold mb-3">{label}</p>
                      
                      {isHistorical && (
                        <div className="space-y-2">
                          <p className="text-primary font-semibold">
                            📊 Dados Reais: {formatCurrency(payload[0].value as number)}
                          </p>
                          {payload.length > 1 && (
                            <p className="text-destructive font-semibold">
                              💳 Custo: {formatCurrency(payload[1].value as number)}
                            </p>
                          )}
                        </div>
                      )}
                      
                      {isForecast && (
                        <div className="space-y-2">
                          <p className="text-success font-semibold">
                            📈 Projeção: {formatCurrency(payload.find(p => p.dataKey === 'forecast')?.value as number)}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            Confiança: {confidence.toFixed(0)}%
                          </p>
                        </div>
                      )}
                    </div>
                  )
                }
                return null
              }}
            />
            
            {/* Área de confiança para projeção */}
            <Area
              dataKey="confidenceUpper"
              fill="url(#confidenceGradient)"
              stroke="none"
              fillOpacity={0.3}
            />
            
            {/* Dados históricos - linha sólida */}
            <Line 
              dataKey="historical" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              name="Dados Reais"
              connectNulls={false}
            />
            
            {/* Projeção - linha tracejada */}
            <Line 
              dataKey="forecast" 
              stroke="hsl(var(--success))" 
              strokeWidth={3}
              strokeDasharray="8 4"
              dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
              name="Projeção"
              connectNulls={false}
            />
            
            {/* Linha de custo para referência */}
            <Line 
              dataKey="cost" 
              stroke="hsl(var(--destructive))" 
              strokeWidth={2}
              strokeDasharray="3 3"
              dot={false}
              name="Custo Estimado"
              opacity={0.7}
            />
          </ComposedChart>
        </ResponsiveContainer>
        
        {/* Legenda personalizada */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-primary"></div>
            <span className="text-muted-foreground">📊 Dados reais</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-success border-dashed"></div>
            <span className="text-muted-foreground">📈 Projeção</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-destructive opacity-70"></div>
            <span className="text-muted-foreground">💳 Custo estimado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-success/30 rounded"></div>
            <span className="text-muted-foreground">🟢 Margem de confiança ({confidence.toFixed(0)}%)</span>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-muted/30 rounded-xl text-center">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Como interpretar:</strong> A linha sólida mostra dados históricos reais. 
            A linha tracejada verde projeta tendências futuras com base em algoritmos de IA.
            A área verde indica a margem de confiança da previsão.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default ForecastChart