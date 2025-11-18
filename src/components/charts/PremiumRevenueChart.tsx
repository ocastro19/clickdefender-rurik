
import React, { useMemo } from 'react'
import { ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { Campaign } from '@/contexts/CampaignContext'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from '@/hooks/use-mobile'

interface PremiumRevenueChartProps {
  campaigns: Campaign[]
  dateRange?: {
    startDate: string | null
    endDate: string | null
  }
}

const PremiumRevenueChart: React.FC<PremiumRevenueChartProps> = ({ campaigns, dateRange }) => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  
  // Função para formatar sempre em USD
  const formatUSD = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }
  
  const chartData = useMemo(() => {
    const today = new Date()
    const data = []
    
    // Produtos reais do sistema com dados de conversão simulados fixos
    const productConversions = {
      'LeanDrops™ - CD': {
        baseRevenue: 297, // Valor base por conversão
        conversions: [
          { date: -11, sales: 3, refunds: 0 },
          { date: -10, sales: 2, refunds: 1 },
          { date: -9, sales: 4, refunds: 0 },
          { date: -8, sales: 1, refunds: 0 },
          { date: -7, sales: 5, refunds: 1 },
          { date: -6, sales: 2, refunds: 0 },
          { date: -5, sales: 3, refunds: 1 },
          { date: -4, sales: 4, refunds: 0 },
          { date: -3, sales: 2, refunds: 0 },
          { date: -2, sales: 6, refunds: 2 },
          { date: -1, sales: 3, refunds: 0 },
          { date: 0, sales: 4, refunds: 1 }
        ]
      },
      'BrainDefender™ - CD': {
        baseRevenue: 147,
        conversions: [
          { date: -11, sales: 2, refunds: 0 },
          { date: -10, sales: 1, refunds: 0 },
          { date: -9, sales: 3, refunds: 1 },
          { date: -8, sales: 2, refunds: 0 },
          { date: -7, sales: 4, refunds: 0 },
          { date: -6, sales: 1, refunds: 0 },
          { date: -5, sales: 2, refunds: 1 },
          { date: -4, sales: 3, refunds: 0 },
          { date: -3, sales: 1, refunds: 0 },
          { date: -2, sales: 5, refunds: 1 },
          { date: -1, sales: 2, refunds: 0 },
          { date: 0, sales: 3, refunds: 0 }
        ]
      },
      'GlycoShield™ - CD - 21/07 #3': {
        baseRevenue: 197,
        conversions: [
          { date: -11, sales: 1, refunds: 0 },
          { date: -10, sales: 0, refunds: 0 },
          { date: -9, sales: 2, refunds: 0 },
          { date: -8, sales: 1, refunds: 0 },
          { date: -7, sales: 3, refunds: 1 },
          { date: -6, sales: 0, refunds: 0 },
          { date: -5, sales: 1, refunds: 0 },
          { date: -4, sales: 2, refunds: 0 },
          { date: -3, sales: 1, refunds: 0 },
          { date: -2, sales: 4, refunds: 1 },
          { date: -1, sales: 1, refunds: 0 },
          { date: 0, sales: 2, refunds: 0 }
        ]
      }
    }
    
    // Dados de cliques simulados por produto
    const productClicks = {
      'LeanDrops™ - CD': [450, 380, 520, 290, 610, 340, 470, 580, 390, 720, 480, 650],
      'BrainDefender™ - CD': [220, 180, 290, 150, 350, 200, 250, 320, 190, 410, 260, 340],
      'GlycoShield™ - CD - 21/07 #3': [120, 80, 180, 90, 220, 110, 150, 200, 100, 280, 140, 190]
    }
    
    // Filtrar produtos baseado nas campanhas selecionadas
    const selectedProducts = campaigns.length === 0 ? 
      Object.keys(productConversions) : 
      campaigns.map(c => c.campanha).filter(name => productConversions[name as keyof typeof productConversions])
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dayStr = `${date.getDate()}. ${date.toLocaleDateString('pt-BR', { month: 'short' })}`
      
      let totalRevenue = 0
      let totalRefunds = 0
      let totalClicks = 0
      
      // Somar dados de todos os produtos selecionados
      selectedProducts.forEach(productName => {
        const product = productConversions[productName as keyof typeof productConversions]
        const clicksData = productClicks[productName as keyof typeof productClicks]
        
        if (product && clicksData) {
          const dayData = product.conversions.find(conv => conv.date === -i)
          if (dayData) {
            totalRevenue += dayData.sales * product.baseRevenue
            totalRefunds += dayData.refunds * product.baseRevenue
            totalClicks += clicksData[11 - i] || 0
          }
        }
      })
      
      data.push({
        day: dayStr,
        cliques: totalClicks,
        conversoes: totalRevenue,
        reembolsos: totalRefunds
      })
    }
    
    return data
  }, [campaigns])

  return (
    <div className="w-full">
      <Card className="border-0 bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-sm shadow-premium transition-all duration-700 w-full">
        <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
          <ResponsiveContainer width="100%" height={isMobile ? 320 : 500}>
            <ComposedChart data={chartData} margin={{ left: 0, right: 0, top: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="refundsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              
              <XAxis 
                dataKey="day" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={isMobile ? 10 : 12}
                tickLine={false}
                axisLine={false}
              />
              
              <YAxis 
                yAxisId="left"
                stroke="hsl(var(--muted-foreground))" 
                fontSize={isMobile ? 10 : 12}
                tickLine={false}
                axisLine={false}
                width={isMobile ? 60 : 80}
                domain={[0, 'dataMax + 500']}
                tickCount={8}
                tickFormatter={(value) => {
                  if (value === 0) return '$0'
                  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`
                  return `$${value}`
                }}
              />
              
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="hsl(var(--muted-foreground))" 
                fontSize={isMobile ? 10 : 12}
                tickLine={false}
                axisLine={false}
                width={0}
                domain={[0, 'dataMax + 500']}
                hide={true}
              />
              
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-premium">
                        <p className="text-foreground font-semibold mb-3">{label}</p>
                        <div className="space-y-2">
                          {payload.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded" 
                                style={{ backgroundColor: entry.color }}
                              ></div>
                               <span className="font-semibold" style={{ color: entry.color }}>
                                 {entry.name}: {entry.name === 'Cliques' ? entry.value?.toLocaleString('pt-BR') : formatUSD(entry.value as number)}
                               </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              
              {/* Área azul para custo de cliques */}
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="cliques"
                stroke="#3B82F6"
                strokeWidth={2}
                strokeDasharray="8 8"
                fill="url(#clicksGradient)"
                name="Cliques"
                connectNulls
              />
              
              {/* Barras verdes para vendas */}
              <Bar
                yAxisId="left"
                dataKey="conversoes"
                fill="#16A34A"
                name="Vendas"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
              
              {/* Área vermelha para reembolsos (sempre na frente) */}
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="reembolsos"
                stroke="#EF4444"
                strokeWidth={3}
                strokeDasharray="8 8"
                fill="url(#refundsGradient)"
                name="Reembolsos"
                connectNulls={true}
              />
              
            </ComposedChart>
          </ResponsiveContainer>
          
          {/* Legenda customizada */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-success rounded"></div>
              <span className="text-sm text-foreground font-medium">Conversões</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-primary border-2 border-dashed border-primary rounded"></div>
              <span className="text-sm text-foreground font-medium">Cliques</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-destructive border-2 border-dashed border-destructive rounded"></div>
              <span className="text-sm text-foreground font-medium">Reembolsos</span>
            </div>
          </div>
          
        </CardContent>
      </Card>
    </div>
  )
}

export default PremiumRevenueChart
