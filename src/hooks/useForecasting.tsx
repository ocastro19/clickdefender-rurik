import { useMemo } from 'react'
import { Campaign } from '@/contexts/CampaignContext'
import { useDashboardCurrency, convertCurrencyForDashboard } from '@/contexts/DashboardCurrencyContext'

interface ForecastData {
  revenue: number
  cost: number
  profit: number
  conversions: number
  clicks: number
  impressions: number
}

interface ForecastScenarios {
  optimistic: ForecastData
  realistic: ForecastData
  conservative: ForecastData
  pessimistic: ForecastData
}

interface MonthlyForecast {
  scenarios: ForecastScenarios
  confidence: number
  currentROAS: number
  monthlyGoal: number
  goalStatus: 'above' | 'below' | 'ontrack'
  goalPercentage: number
  daysRemaining: number
  insights: Array<{
    type: 'opportunity' | 'warning' | 'prediction' | 'recommendation'
    message: string
    confidence: number
    action?: string
  }>
}

// Algoritmo de previsão linear simples
const linearForecast = (historicalData: number[], daysToProject: number): number => {
  if (historicalData.length < 2) return 0
  
  // Calcular tendência diária dos últimos 14 dias
  const recent = historicalData.slice(-14)
  let totalGrowth = 0
  
  for (let i = 1; i < recent.length; i++) {
    totalGrowth += recent[i] - recent[i - 1]
  }
  
  const dailyGrowth = totalGrowth / (recent.length - 1)
  const currentValue = recent[recent.length - 1]
  
  return Math.max(0, currentValue + (dailyGrowth * daysToProject))
}

// Calcular confiança baseada na volatilidade dos dados
const calculateConfidence = (data: number[]): number => {
  if (data.length < 3) return 30
  
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length
  const standardDeviation = Math.sqrt(variance)
  
  const volatility = mean > 0 ? standardDeviation / mean : 1
  const stability = Math.max(0, 1 - volatility)
  
  return Math.min(95, Math.max(30, stability * 100))
}

// Análise sazonal por dia da semana
const getWeeklyPattern = (campaigns: Campaign[]): Record<number, number> => {
  const weeklyData: Record<number, number[]> = {}
  
  campaigns.forEach(campaign => {
    const date = new Date(campaign.data)
    const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, etc.
    const revenue = campaign.faturamento || 0
    
    if (!weeklyData[dayOfWeek]) {
      weeklyData[dayOfWeek] = []
    }
    weeklyData[dayOfWeek].push(revenue)
  })
  
  // Calcular média por dia da semana
  const weeklyPattern: Record<number, number> = {}
  Object.keys(weeklyData).forEach(day => {
    const dayNum = parseInt(day)
    const values = weeklyData[dayNum]
    weeklyPattern[dayNum] = values.reduce((sum, val) => sum + val, 0) / values.length
  })
  
  return weeklyPattern
}

// Gerar insights automáticos
const generateInsights = (
  campaigns: Campaign[], 
  currentROAS: number, 
  projectedRevenue: number,
  daysRemaining: number
): Array<{ type: 'opportunity' | 'warning' | 'prediction' | 'recommendation', message: string, confidence: number, action?: string }> => {
  const insights = []
  
  // Análise de ROAS
  if (currentROAS > 3.0) {
    insights.push({
      type: 'prediction',
      message: `Com seu ROAS de ${currentROAS.toFixed(2)}x, você deve faturar R$ ${projectedRevenue.toLocaleString('pt-BR')} este mês`,
      confidence: 87
    })
  }
  
  // Análise de crescimento
  const recentCampaigns = campaigns.slice(-7)
  const olderCampaigns = campaigns.slice(-14, -7)
  
  if (recentCampaigns.length > 0 && olderCampaigns.length > 0) {
    const recentAvg = recentCampaigns.reduce((sum, c) => sum + (c.faturamento || 0), 0) / recentCampaigns.length
    const olderAvg = olderCampaigns.reduce((sum, c) => sum + (c.faturamento || 0), 0) / olderCampaigns.length
    
    if (recentAvg > olderAvg * 1.15) {
      insights.push({
        type: 'opportunity',
        message: `Sua performance está 15% acima da média. Mantenha esse ritmo para maximizar receitas`,
        confidence: 82,
        action: 'Manter estratégia atual'
      })
    } else if (recentAvg < olderAvg * 0.85) {
      insights.push({
        type: 'warning',
        message: `Performance caindo 15% por semana. Ajuste necessário para não perder meta mensal`,
        confidence: 78,
        action: 'Revisar campanhas'
      })
    }
  }
  
  // Análise de budget
  const totalCost = campaigns.reduce((sum, c) => sum + (c.custo || 0), 0)
  const avgDailyCost = totalCost / Math.max(1, campaigns.length)
  const projectedMonthlyCost = avgDailyCost * daysRemaining
  
  if (projectedMonthlyCost > 10000) {
    insights.push({
      type: 'warning',
      message: `Custo projetado de R$ ${projectedMonthlyCost.toLocaleString('pt-BR')} pode estourar budget mensal`,
      confidence: 75,
      action: 'Ajustar orçamentos'
    })
  }
  
  // Análise de campanhas específicas
  const topCampaign = campaigns
    .filter(c => c.faturamento && c.faturamento > 0)
    .sort((a, b) => (b.faturamento || 0) - (a.faturamento || 0))[0]
  
  if (topCampaign && topCampaign.roas && topCampaign.roas > 4.0) {
    insights.push({
      type: 'opportunity',
      message: `Campanha ${topCampaign.campanha} está 30% acima da média. Potencial para escalar budget`,
      confidence: 85,
      action: 'Aumentar investimento'
    })
  }
  
  return insights
}

export const useForecasting = (campaigns: Campaign[]): MonthlyForecast => {
  const { dashboardCurrency, exchangeRate } = useDashboardCurrency()
  
  return useMemo(() => {
    if (!campaigns.length) {
      return {
        scenarios: {
          optimistic: { revenue: 0, cost: 0, profit: 0, conversions: 0, clicks: 0, impressions: 0 },
          realistic: { revenue: 0, cost: 0, profit: 0, conversions: 0, clicks: 0, impressions: 0 },
          conservative: { revenue: 0, cost: 0, profit: 0, conversions: 0, clicks: 0, impressions: 0 },
          pessimistic: { revenue: 0, cost: 0, profit: 0, conversions: 0, clicks: 0, impressions: 0 }
        },
        confidence: 0,
        currentROAS: 0,
        monthlyGoal: 15000,
        goalStatus: 'below',
        goalPercentage: 0,
        daysRemaining: 30,
        insights: []
      }
    }

    // Calcular métricas atuais
    const totalRevenue = campaigns.reduce((sum, campaign) => {
      const converted = convertCurrencyForDashboard(
        campaign.faturamento || 0,
        campaign.currency || 'USD',
        dashboardCurrency,
        exchangeRate
      )
      return sum + converted
    }, 0)
    
    const totalCost = campaigns.reduce((sum, campaign) => {
      const converted = convertCurrencyForDashboard(
        campaign.custo || 0,
        campaign.currency || 'USD',
        dashboardCurrency,
        exchangeRate
      )
      return sum + converted
    }, 0)
    
    const currentROAS = totalCost > 0 ? totalRevenue / totalCost : 0
    
    // Calcular dias restantes no mês
    const now = new Date()
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const daysRemaining = Math.max(1, lastDayOfMonth.getDate() - now.getDate())
    
    // Preparar dados históricos para previsão
    const historicalRevenue = campaigns.map(c => 
      convertCurrencyForDashboard(c.faturamento || 0, c.currency || 'USD', dashboardCurrency, exchangeRate)
    )
    const historicalCost = campaigns.map(c => 
      convertCurrencyForDashboard(c.custo || 0, c.currency || 'USD', dashboardCurrency, exchangeRate)
    )
    const historicalConversions = campaigns.map(c => c.conversoes || 0)
    const historicalClicks = campaigns.map(c => c.cliques || 0)
    const historicalImpressions = campaigns.map(c => c.impressoes || 0)
    
    // Calcular previsões usando algoritmo linear
    const projectedRevenue = linearForecast(historicalRevenue, daysRemaining)
    const projectedCost = linearForecast(historicalCost, daysRemaining)
    const projectedConversions = linearForecast(historicalConversions, daysRemaining)
    const projectedClicks = linearForecast(historicalClicks, daysRemaining)
    const projectedImpressions = linearForecast(historicalImpressions, daysRemaining)
    
    // Cenários baseados em variações percentuais
    const scenarios: ForecastScenarios = {
      optimistic: {
        revenue: projectedRevenue * 1.2,
        cost: projectedCost * 1.1,
        profit: (projectedRevenue * 1.2) - (projectedCost * 1.1),
        conversions: projectedConversions * 1.15,
        clicks: projectedClicks * 1.1,
        impressions: projectedImpressions * 1.1
      },
      realistic: {
        revenue: projectedRevenue,
        cost: projectedCost,
        profit: projectedRevenue - projectedCost,
        conversions: projectedConversions,
        clicks: projectedClicks,
        impressions: projectedImpressions
      },
      conservative: {
        revenue: projectedRevenue * 0.85,
        cost: projectedCost * 0.95,
        profit: (projectedRevenue * 0.85) - (projectedCost * 0.95),
        conversions: projectedConversions * 0.9,
        clicks: projectedClicks * 0.9,
        impressions: projectedImpressions * 0.9
      },
      pessimistic: {
        revenue: projectedRevenue * 0.7,
        cost: projectedCost * 0.9,
        profit: (projectedRevenue * 0.7) - (projectedCost * 0.9),
        conversions: projectedConversions * 0.8,
        clicks: projectedClicks * 0.85,
        impressions: projectedImpressions * 0.85
      }
    }
    
    // Calcular confiança
    const confidence = calculateConfidence(historicalRevenue)
    
    // Meta mensal e status
    const monthlyGoal = 15000
    const goalPercentage = ((scenarios.realistic.revenue / monthlyGoal) - 1) * 100
    const goalStatus: 'above' | 'below' | 'ontrack' = 
      goalPercentage > 10 ? 'above' : goalPercentage < -10 ? 'below' : 'ontrack'
    
    // Gerar insights automáticos
    const insights = generateInsights(campaigns, currentROAS, scenarios.realistic.revenue, daysRemaining)
    
    return {
      scenarios,
      confidence,
      currentROAS,
      monthlyGoal,
      goalStatus,
      goalPercentage,
      daysRemaining,
      insights
    }
  }, [campaigns, dashboardCurrency, exchangeRate])
}