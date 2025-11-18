import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DollarSign, TrendingUp, TrendingDown, Target, ShoppingCart, Zap, Activity, Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Campaign } from '@/contexts/CampaignContext'
import { useGlobalCurrencyFormatter } from '@/hooks/useGlobalCurrencyFormatter'
import { useDashboardCurrency, convertCurrencyForDashboard } from '@/contexts/DashboardCurrencyContext'
import DraggableDashboard from './DraggableDashboard'
import ProfitEvolutionChart from './charts/ProfitEvolutionChart'
import ROIChart from './charts/ROIChart'
import InvestmentRevenueChart from './charts/InvestmentRevenueChart'
import CampaignsAtRiskChart from './charts/CampaignsAtRiskChart'
import TopPerformersChart from './charts/TopPerformersChart'

interface PremiumAnalyticsDashboardProps {
  campaigns: Campaign[]
}

interface PremiumKPICardProps {
  icon: React.ComponentType<any>
  title: string
  value: string
  trend?: 'up' | 'down' | 'neutral'
  gradientClass: string
  glowColor: string
  percentage?: number
  tooltip?: string
}

const PremiumKPICard: React.FC<PremiumKPICardProps> = ({ 
  icon: Icon, 
  title, 
  value, 
  trend, 
  gradientClass, 
  glowColor,
  percentage,
  tooltip
}) => (
  <Card className="group relative overflow-hidden bg-card shadow-premium transition-all duration-500 hover:shadow-elegant hover:scale-[1.02] dark:bg-card/50 dark:backdrop-blur-sm">
    <div className={`absolute inset-0 ${gradientClass} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
    <div className={`absolute inset-0 shadow-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500`} style={{ boxShadow: `0 0 40px ${glowColor}` }} />
    
    <CardContent className="relative p-4">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-xl ${gradientClass} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        {percentage && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
            trend === 'up' ? 'bg-success/20 text-success border border-success/30' : 
            trend === 'down' ? 'bg-destructive/20 text-destructive border border-destructive/30' : 
            'bg-muted/20 text-muted-foreground border border-muted/30'
          }`}>
            {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : 
             trend === 'down' ? <TrendingDown className="h-3 w-3" /> : 
             <Activity className="h-3 w-3" />}
            {Math.abs(percentage)}%
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-foreground group-hover:text-white transition-colors duration-300">
          {value}
        </h3>
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {title}
          </p>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3 h-3 text-muted-foreground hover:text-foreground transition-colors" />
                </TooltipTrigger>
                <TooltipContent className="z-[99999] fixed">
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
)

// Componente para distribuição de investimento
const InvestmentDistributionChart: React.FC<{ campaigns: Campaign[] }> = ({ campaigns }) => {
  const { t } = useTranslation()
  const { dashboardCurrency, exchangeRate } = useDashboardCurrency()
  const { formatGlobalCurrency } = useGlobalCurrencyFormatter()
  
  const investmentDistribution = useMemo(() => {
    const convertedCampaigns = campaigns.map(campaign => ({
      ...campaign,
      convertedCusto: convertCurrencyForDashboard(
        campaign.custo || 0, 
        campaign.currency || 'USD', 
        dashboardCurrency, 
        exchangeRate
      )
    }))
    
    const total = convertedCampaigns.reduce((sum, c) => sum + c.convertedCusto, 0)
    
    return convertedCampaigns
      .map(campaign => ({
        name: campaign.campanha.length > 15 ? campaign.campanha.substring(0, 15) + '...' : campaign.campanha,
        value: campaign.convertedCusto,
        percentage: total > 0 ? (campaign.convertedCusto / total * 100) : 0
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [campaigns, dashboardCurrency, exchangeRate])

  const CHART_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))', 'hsl(var(--chart-6))']

  return (
    <Card className="bg-card shadow-premium transition-all duration-500 hover:shadow-elegant dark:bg-card/50 dark:backdrop-blur-sm">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
            <Activity className="h-6 w-6 text-white" />
          </div>
          {t('premiumAnalytics.campaignDistribution')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <RechartsPieChart>
            <Pie
              data={investmentDistribution}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={160}
              paddingAngle={5}
              dataKey="value"
            >
              {investmentDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-foreground">
              {t('premiumAnalytics.total')}
            </text>
            <text x="50%" y="50%" dy={25} textAnchor="middle" dominantBaseline="middle" className="text-sm fill-muted-foreground">
              {formatGlobalCurrency(investmentDistribution.reduce((sum, item) => sum + item.value, 0))}
            </text>
          </RechartsPieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Componente interno que usa o contexto de moeda
const PremiumAnalyticsDashboardContent: React.FC<PremiumAnalyticsDashboardProps> = ({ campaigns }) => {
  const { t } = useTranslation()
  const { dashboardCurrency, exchangeRate } = useDashboardCurrency()
  const { formatGlobalCurrency } = useGlobalCurrencyFormatter()
  
  console.log('=== DASHBOARD DEBUG ===')
  console.log('Dashboard Currency:', dashboardCurrency)
  console.log('Exchange Rate:', exchangeRate)
  console.log('Campaigns:', campaigns)
  
  // Calcular KPIs convertidos para a moeda do dashboard
  const kpis = useMemo(() => {
    const totalInvestment = campaigns.reduce((sum, c) => {
      console.log('Processing campaign:', c.campanha, 'Cost:', c.custo, 'Currency:', c.currency)
      const convertedValue = convertCurrencyForDashboard(c.custo || 0, c.currency || 'USD', dashboardCurrency, exchangeRate)
      console.log('Converted from', c.custo, c.currency, 'to', convertedValue, dashboardCurrency)
      return sum + convertedValue
    }, 0)
    
    const totalRevenue = campaigns.reduce((sum, c) => {
      const convertedValue = convertCurrencyForDashboard(c.faturamento || 0, c.currency || 'USD', dashboardCurrency, exchangeRate)
      return sum + convertedValue
    }, 0)
    
    const totalProfit = totalRevenue - totalInvestment
    const avgROI = campaigns.length > 0 
      ? campaigns.reduce((sum, c) => sum + (c.roi || 0), 0) / campaigns.length 
      : 0
    const totalConversions = campaigns.reduce((sum, c) => sum + (c.conversoes || 0), 0)

    return {
      totalInvestment,
      totalRevenue,
      totalProfit,
      avgROI,
      totalConversions
    }
  }, [campaigns, dashboardCurrency, exchangeRate])

  // Configuração dos gráficos para o dashboard arrastável
  const dashboardCharts = [
    {
      id: 'profit-evolution',
      title: t('premiumAnalytics.charts.profitEvolution'),
      component: ProfitEvolutionChart
    },
    {
      id: 'roi-chart',
      title: t('premiumAnalytics.charts.roiByCapaign'),
      component: ROIChart
    },
    {
      id: 'campaigns-at-risk',
      title: t('premiumAnalytics.charts.campaignsAtRisk'),
      component: CampaignsAtRiskChart
    },
    {
      id: 'top-performers',
      title: t('premiumAnalytics.charts.topPerformers'),
      component: TopPerformersChart
    },
    {
      id: 'investment-revenue',
      title: t('premiumAnalytics.charts.investmentRevenue'),
      component: InvestmentRevenueChart
    },
    {
      id: 'investment-distribution',
      title: t('premiumAnalytics.charts.campaignDistribution'),
      component: InvestmentDistributionChart
    }
  ]

  return (
    <div className="space-y-12 mt-12">
      {/* Header Premium com Seletor de Moeda */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            {t('premiumAnalytics.performanceDashboard')}
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('premiumAnalytics.visualAnalysis')}
        </p>
      </div>

      {/* KPI Cards Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        <PremiumKPICard
          icon={DollarSign}
          title={t('premiumAnalytics.totalInvested')}
          value={formatGlobalCurrency(kpis.totalInvestment)}
          gradientClass="bg-gradient-to-r from-blue-500 to-blue-600"
          glowColor="rgb(59, 130, 246)"
          trend="neutral"
          tooltip={t('premiumAnalytics.tooltips.totalInvested')}
        />
        
        <PremiumKPICard
          icon={TrendingUp}
          title={t('premiumAnalytics.totalRevenue')}
          value={formatGlobalCurrency(kpis.totalRevenue)}
          gradientClass="bg-gradient-to-r from-green-600 to-green-700"
          glowColor="rgb(22, 163, 74)"
          trend="up"
          percentage={12.5}
          tooltip={t('premiumAnalytics.tooltips.totalRevenue')}
        />
        
        <PremiumKPICard
          icon={Target}
          title={t('premiumAnalytics.netProfit')}
          value={formatGlobalCurrency(kpis.totalProfit)}
          gradientClass={kpis.totalProfit >= 0 ? "bg-gradient-to-r from-green-600 to-green-700" : "bg-gradient-to-r from-red-500 to-red-600"}
          glowColor={kpis.totalProfit >= 0 ? "rgb(22, 163, 74)" : "rgb(239, 68, 68)"}
          trend={kpis.totalProfit >= 0 ? "up" : "down"}
          percentage={Math.abs(kpis.avgROI * 0.8)}
          tooltip={t('premiumAnalytics.tooltips.netProfit')}
        />
        
        <PremiumKPICard
          icon={Activity}
          title={t('premiumAnalytics.roi')}
          value={`${kpis.avgROI.toFixed(1)}%`}
          gradientClass="bg-gradient-to-r from-purple-500 to-purple-600"
          glowColor="rgb(168, 85, 247)"
          trend={kpis.avgROI >= 0 ? "up" : "down"}
          percentage={Math.abs(kpis.avgROI * 0.1)}
          tooltip={t('premiumAnalytics.tooltips.roi')}
        />
        
        <PremiumKPICard
          icon={ShoppingCart}
          title={t('premiumAnalytics.totalConversions')}
          value={kpis.totalConversions.toString()}
          gradientClass="bg-gradient-to-r from-cyan-500 to-cyan-600"
          glowColor="rgb(6, 182, 212)"
          trend="up"
          percentage={18.7}
          tooltip={t('premiumAnalytics.tooltips.totalConversions')}
        />
      </div>

      {/* Dashboard Arrastável */}
      <DraggableDashboard charts={dashboardCharts} campaigns={campaigns} />
    </div>
  )
}

// Componente wrapper que fornece o contexto de moeda
const PremiumAnalyticsDashboard: React.FC<PremiumAnalyticsDashboardProps> = ({ campaigns }) => {
  return <PremiumAnalyticsDashboardContent campaigns={campaigns} />
}

export default PremiumAnalyticsDashboard