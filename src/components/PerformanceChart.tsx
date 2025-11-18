import React, { useMemo } from 'react';
import { ComposedChart, Bar, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useGlobalCurrencyFormatter } from '@/hooks/useGlobalCurrencyFormatter';
import { Campaign } from '@/contexts/CampaignContext';
import { useDashboardCurrency, convertCurrencyForDashboard } from '@/contexts/DashboardCurrencyContext';
import { useTranslation } from 'react-i18next';
import { MousePointer, CheckCircle, RotateCcw } from 'lucide-react';

interface PerformanceChartProps {
  campaigns: Campaign[]
}

const generatePerformanceData = (campaigns: Campaign[], dashboardCurrency: 'BRL' | 'USD', exchangeRate: number | null) => {
  const today = new Date()
  const data = []
  
  // Base values for simulation
  const baseRevenue = 8500 // R$ base por dia
  const baseClicks = 450 // Quantidade base de cliques por dia
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dayStr = `${date.getDate()}. ${date.toLocaleDateString('pt-BR', { month: 'short' })}`
    
    // Simulate realistic daily patterns (weekend drops, weekday peaks)
    const dayOfWeek = date.getDay()
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.6 : 1.0
    const mondayBoost = dayOfWeek === 1 ? 1.3 : 1.0
    const fridayDrop = dayOfWeek === 5 ? 0.8 : 1.0
    
    // Add trend over time (slight growth)
    const trendMultiplier = 1 + (11 - i) * 0.02
    
    // Random daily variation
    const randomVariation = 0.7 + Math.random() * 0.6 // 70% to 130%
    
    const finalMultiplier = weekendMultiplier * mondayBoost * fridayDrop * trendMultiplier * randomVariation
    
    // Calculate realistic metrics
    const dailyRevenue = Math.round(baseRevenue * finalMultiplier)
    const dailyClickCount = Math.round(baseClicks * finalMultiplier * (0.8 + Math.random() * 0.4))
    
    // Simulate refunds (5-15% of revenue, not every day)
    const hasRefund = Math.random() < 0.4 // 40% chance of refunds per day
    const refundRate = 0.05 + Math.random() * 0.10 // 5-15% refund rate
    const dailyRefunds = hasRefund && dailyRevenue > 0 ? 
      Math.round(dailyRevenue * refundRate) : 0 // SEMPRE 0, nunca null
    
    data.push({
      data: dayStr,
      cliques: dailyClickCount, // Quantidade unitária de cliques
      conversoes: dailyRevenue, // Valor em vendas
      reembolsos: dailyRefunds // Valor em reembolsos
    })
  }
  
  return data
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  const { t } = useTranslation();
  
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-premium">
        <p className="text-foreground font-medium mb-3">📅 {label}</p>
        {payload.map((entry, index) => {
          const icons = {
            cliques: <MousePointer className="h-3 w-3 inline" />,
            conversoes: <CheckCircle className="h-3 w-3 inline" />,
            reembolsos: <RotateCcw className="h-3 w-3 inline" />,
          };
          
          return (
            <p key={index} style={{ color: entry.color }} className="text-sm mb-1">
              {icons[entry.dataKey as keyof typeof icons]} {entry.name}: {entry.value}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

export default function PerformanceChart({ campaigns }: PerformanceChartProps) {
  const { dashboardCurrency } = useGlobalCurrencyFormatter()
  const { exchangeRate } = useDashboardCurrency()
  const { t } = useTranslation()
  
  const performanceData = useMemo(() => 
    generatePerformanceData(campaigns, dashboardCurrency, exchangeRate), 
    [campaigns, dashboardCurrency, exchangeRate]
  )
  
  return (
    <div className="bg-gradient-to-br from-card to-muted/30 border border-border rounded-xl p-8 shadow-premium mb-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">{t('charts.performance')}</h2>
        <div className="h-px bg-gradient-to-r from-border to-transparent" />
      </div>
      
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="refundsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            
            <XAxis 
              dataKey="data" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
            />
            
            <YAxis 
              yAxisId="left"
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              domain={[0, (dataMax: number) => Math.ceil((dataMax + 200) / 100) * 100]}
            />
            
            <YAxis 
              yAxisId="right"
              orientation="right" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              domain={[0, 'dataMax + 500']}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            {/* Barras para conversões/vendas (sempre atrás - renderiza primeiro) */}
            <Bar
              yAxisId="left"
              dataKey="conversoes"
              fill="#16A34A"
              name="Vendas"
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
              style={{ zIndex: 1 }}
            />
            
            {/* Área vermelha para reembolsos (sobrepõe as barras) */}
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
              style={{ zIndex: 3 }}
            />
            
            {/* Linha para cliques (sempre na frente de tudo) */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cliques"
              stroke="#3B82F6"
              strokeWidth={3}
              strokeDasharray="8 8"
              dot={false}
              name="Cliques"
              connectNulls
              style={{ zIndex: 4 }}
            />
            
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legenda customizada */}
      <div className="flex justify-center gap-8 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-success rounded"></div>
          <span className="text-sm text-foreground font-medium">{t('campaigns.conversions')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-primary border-2 border-dashed border-primary rounded"></div>
          <span className="text-sm text-foreground font-medium">{t('campaigns.clicks')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-destructive border-2 border-dashed border-destructive rounded"></div>
          <span className="text-sm text-foreground font-medium">Reembolsos</span>
        </div>
      </div>
      
      <p className="text-center text-sm text-muted-foreground">
        Linha vermelha tracejada aparece apenas nos dias com reembolsos
      </p>
    </div>
  );
}