import React, { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, TrendingUp, TrendingDown, DollarSign, Target, Users, ShoppingCart, BarChart3, PieChart, Info } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip as TooltipUI, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Campaign } from '@/contexts/CampaignContext'
import { formatCurrency } from '@/utils/campaignCalculations'
import { BudgetDiagnostic } from '@/utils/budgetDiagnostic'
import { getMetricTooltip } from '@/utils/metricsTooltips'

interface CampaignAnalyticsProps {
  campaigns: Campaign[]
}

interface KPICardProps {
  icon: React.ComponentType<any>
  title: string
  value: string
  change?: number
  color: string
  trend?: 'up' | 'down' | 'neutral'
  transactionType?: 'sales' | 'upsell' | 'refund' | 'neutral'
}

const KPICard: React.FC<KPICardProps & { metricKey?: string }> = ({ icon: Icon, title, value, change, color, trend, metricKey, transactionType = 'neutral' }) => {
  const { t } = useTranslation()
  
  // Determinar a cor do valor baseado no tipo de transação
  const getValueColor = () => {
    switch(transactionType) {
      case 'sales':
        return 'text-transaction-sales'
      case 'upsell':
        return 'text-transaction-upsell'
      case 'refund':
        return 'text-transaction-refund'
      default:
        return 'text-gray-900'
    }
  }
  
  return (
  <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/30">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            trend === 'up' ? 'bg-green-100 text-green-700' : 
            trend === 'down' ? 'bg-red-100 text-red-700' : 
            'bg-gray-100 text-gray-700'
          }`}>
            {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : 
             trend === 'down' ? <TrendingDown className="h-3 w-3" /> : null}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className="flex items-center gap-2">
          <h3 className={`text-lg font-bold ${getValueColor()}`}>{value}</h3>
          {metricKey && (
            <TooltipProvider>
              <TooltipUI>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="z-[99999] fixed">
                  <p className="max-w-xs">{getMetricTooltip(metricKey, t)}</p>
                </TooltipContent>
              </TooltipUI>
            </TooltipProvider>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">{title}</p>
      </div>
    </CardContent>
  </Card>
  )
}

const CampaignAnalytics: React.FC<CampaignAnalyticsProps> = ({ campaigns }) => {
  const { t } = useTranslation()
  const [timeFilter, setTimeFilter] = useState('30d')

  // CRITICAL: Budget diagnostic on component mount and campaigns change
  useEffect(() => {
    if (campaigns.length > 0) {
      console.log('🔍 RUNNING BUDGET DIAGNOSTIC ON ANALYTICS COMPONENT')
      BudgetDiagnostic.logDetailedReport(campaigns)
    }
  }, [campaigns])

  // CRITICAL: Enhanced getCellValue function with detailed logging
  const getCellValue = (campaign: Campaign, field: string): any => {
    console.log(`🔍 getCellValue called for campaign "${campaign.campanha}" field "${field}":`, {
      campaignId: campaign.id,
      source: campaign.isFromGoogleAds ? 'Google Ads' : 'Manual',
      fieldValue: campaign[field as keyof Campaign],
      fieldType: typeof campaign[field as keyof Campaign],
      wholeObject: campaign
    })

    const value = campaign[field as keyof Campaign]
    
    // CRITICAL: Special handling for orcamento field
    if (field === 'orcamento') {
      console.log(`💰 ORÇAMENTO getCellValue detailed analysis:`, {
        originalValue: value,
        valueType: typeof value,
        isNull: value === null,
        isUndefined: value === undefined,
        isZero: value === 0,
        isNumber: typeof value === 'number',
        campaignSource: campaign.isFromGoogleAds ? 'Google Ads' : 'Manual'
      })
      
      // NEVER return "-" for valid numbers
      if (typeof value === 'number' && value > 0) {
        const formatted = formatCurrency(value, campaign.currency || 'USD')
        console.log(`✅ ORÇAMENTO valid number formatted: ${formatted}`)
        return formatted
      }
      
      // Only return "-" for truly invalid values
      if (value === null || value === undefined || value === 0) {
        console.log(`❌ ORÇAMENTO invalid value, returning "-"`)
        return '-'
      }
      
      // Try to parse as number if it's a string
      if (typeof value === 'string') {
        const parsed = parseFloat(value)
        if (!isNaN(parsed) && parsed > 0) {
          const formatted = formatCurrency(parsed, campaign.currency || 'USD')
          console.log(`✅ ORÇAMENTO parsed from string: ${formatted}`)
          return formatted
        }
      }
    }
    
    // Default handling for other fields
    if (value === null || value === undefined || value === '') {
      return '-'
    }
    
    // Format numbers with currency if applicable
    if (typeof value === 'number' && (field.includes('custo') || field.includes('orcamento') || field.includes('faturamento'))) {
      return formatCurrency(value, campaign.currency || 'USD')
    }
    
    return value
  }

  // Usar todas as campanhas
  const filteredCampaigns = campaigns

  // Calcular KPIs with enhanced budget validation
  const kpis = useMemo(() => {
    console.log('📊 Calculating KPIs with budget validation...')
    
    const totalInvestment = filteredCampaigns.reduce((sum, c) => {
      const cost = typeof c.custo === 'number' ? c.custo : 0
      console.log(`Campaign "${c.campanha}" cost: ${cost} (type: ${typeof c.custo})`)
      return sum + cost
    }, 0)
    
    const totalRevenue = filteredCampaigns.reduce((sum, c) => {
      const revenue = typeof c.faturamento === 'number' ? c.faturamento : 0
      return sum + revenue
    }, 0)
    
    const totalBudget = filteredCampaigns.reduce((sum, c) => {
      const budget = typeof c.orcamento === 'number' ? c.orcamento : 0
      console.log(`Campaign "${c.campanha}" budget: ${budget} (type: ${typeof c.orcamento})`)
      return sum + budget
    }, 0)
    
    const totalProfit = totalRevenue - totalInvestment
    const avgROI = filteredCampaigns.length > 0 
      ? filteredCampaigns.reduce((sum, c) => sum + (c.roi || 0), 0) / filteredCampaigns.length 
      : 0
    const totalCommission = filteredCampaigns.reduce((sum, c) => sum + ((c.comissao || 0) * (c.conversoes || 0)), 0)
    const totalConversions = filteredCampaigns.reduce((sum, c) => sum + (c.conversoes || 0), 0)

    console.log('📊 KPIs calculated:', {
      totalInvestment,
      totalRevenue,
      totalBudget,
      totalProfit,
      avgROI,
      totalCommission,
      totalConversions
    })

    return {
      totalInvestment,
      totalRevenue,
      totalBudget,
      totalProfit,
      avgROI,
      totalCommission,
      totalConversions
    }
  }, [filteredCampaigns])

  // Enhanced data preparation with budget validation
  const areaChartData = useMemo(() => {
    return filteredCampaigns.map((campaign, index) => {
      const budget = typeof campaign.orcamento === 'number' ? campaign.orcamento : 0
      const cost = typeof campaign.custo === 'number' ? campaign.custo : 0
      const revenue = typeof campaign.faturamento === 'number' ? campaign.faturamento : 0
      const profit = typeof campaign.lucro === 'number' ? campaign.lucro : 0
      
      console.log(`Chart data for "${campaign.campanha}":`, {
        budget,
        cost,
        revenue,
        profit
      })
      
      return {
        name: campaign.campanha.length > 12 ? campaign.campanha.substring(0, 12) + '...' : campaign.campanha,
        profit,
        investment: cost,
        revenue,
        budget,
        day: `Dia ${index + 1}`
      }
    }).slice(0, 10)
  }, [filteredCampaigns])

  // Dados para gráfico de ROI por campanha
  const roiChartData = useMemo(() => {
    return filteredCampaigns
      .map(campaign => ({
        name: campaign.campanha.length > 15 ? campaign.campanha.substring(0, 15) + '...' : campaign.campanha,
        roi: campaign.roi || 0,
        profit: campaign.lucro || 0
      }))
      .sort((a, b) => b.roi - a.roi)
      .slice(0, 8)
  }, [filteredCampaigns])

  // Dados para pizza de distribuição de investimento
  const investmentDistribution = useMemo(() => {
    const total = filteredCampaigns.reduce((sum, c) => sum + (c.custo || 0), 0)
    return filteredCampaigns
      .map(campaign => ({
        name: campaign.campanha.length > 20 ? campaign.campanha.substring(0, 20) + '...' : campaign.campanha,
        value: campaign.custo || 0,
        percentage: total > 0 ? ((campaign.custo || 0) / total * 100) : 0
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [filteredCampaigns])

  // Dados para gráfico de taxa de conversão
  const conversionRateData = useMemo(() => {
    return filteredCampaigns
      .map(campaign => ({
        name: campaign.campanha.length > 15 ? campaign.campanha.substring(0, 15) + '...' : campaign.campanha,
        rate: campaign.taxaConversao || 0,
        conversions: campaign.conversoes || 0
      }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 8)
  }, [filteredCampaigns])

  // Top e bottom performers
  const performers = useMemo(() => {
    const sorted = [...filteredCampaigns].sort((a, b) => (b.lucro || 0) - (a.lucro || 0))
    return {
      top: sorted.slice(0, 3),
      bottom: sorted.slice(-3).reverse()
    }
  }, [filteredCampaigns])

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#84cc16']

  const selectedCampaign = null

  return (
    <div className="space-y-8 mt-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">{t('campaignAnalytics.overviewAllCampaigns')}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 {t('campaignAnalytics.days')}</SelectItem>
              <SelectItem value="30d">30 {t('campaignAnalytics.days')}</SelectItem>
              <SelectItem value="90d">90 {t('campaignAnalytics.days')}</SelectItem>
              <SelectItem value="custom">{t('campaignAnalytics.custom')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards - Enhanced with budget KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-6">
        <KPICard
          icon={Target}
          title={t('campaignAnalytics.totalBudget')}
          value={formatCurrency(kpis.totalBudget, 'USD')}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          trend="neutral"
          metricKey="orcamento"
        />
        <KPICard
          icon={DollarSign}
          title={t('campaignAnalytics.totalInvested')}
          value={formatCurrency(kpis.totalInvestment, 'USD')}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          trend="neutral"
          metricKey="custo"
        />
        <KPICard
          icon={TrendingUp}
          title={t('campaignAnalytics.totalRevenue')}
          value={formatCurrency(kpis.totalRevenue, 'USD')}
          color="bg-gradient-to-r from-green-600 to-green-700"
          trend="up"
          change={12.5}
          metricKey="faturamento"
          transactionType="sales"
        />
        <KPICard
          icon={Target}
          title={t('campaignAnalytics.netProfit')}
          value={formatCurrency(kpis.totalProfit, 'USD')}
          color={kpis.totalProfit >= 0 ? "bg-gradient-to-r from-emerald-500 to-emerald-600" : "bg-gradient-to-r from-red-500 to-red-600"}
          trend={kpis.totalProfit >= 0 ? "up" : "down"}
          change={Math.abs(kpis.avgROI)}
          metricKey="lucro"
        />
        <KPICard
          icon={BarChart3}
          title="ROI (%)"
          value={`${kpis.avgROI.toFixed(1)}%`}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          trend={kpis.avgROI >= 0 ? "up" : "down"}
          change={Math.abs(kpis.avgROI * 0.1)}
          metricKey="roi"
        />
        <KPICard
          icon={DollarSign}
          title={t('campaignAnalytics.totalCommission')}
          value={formatCurrency(kpis.totalCommission, 'USD')}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
          trend="up"
          change={8.3}
          metricKey="comissao"
          transactionType="upsell"
        />
        <KPICard
          icon={ShoppingCart}
          title={t('campaigns.conversions')}
          value={kpis.totalConversions.toString()}
          color="bg-gradient-to-r from-indigo-500 to-indigo-600"
          trend="up"
          change={15.2}
          metricKey="conversoes"
        />
      </div>

      {/* Gráfico Central - Evolução do Lucro */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-900">{t('charts.evolutionOfProfit')}</CardTitle>
            <Badge variant="outline" className="text-sm">
              {filteredCampaigns.length} {t('campaignAnalytics.campaigns')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={areaChartData}>
              <defs>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="day" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(value) => formatCurrency(value, 'USD')}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
                  formatter={(value: number) => [formatCurrency(value, 'USD'), t('campaignAnalytics.profitWord')]}
                />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#profitGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráficos Secundários */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ROI por Campanha */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">{t('campaignAnalytics.roiByCampaign')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={roiChartData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#64748b" fontSize={12} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={12}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'ROI']}
                />
                <Bar dataKey="roi" fill="#8b5cf6" radius={[4, 4, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Investimento */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">{t('campaignAnalytics.investmentDistribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <RechartsPieChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number) => [formatCurrency(value, 'USD'), t('campaignAnalytics.investmentWord')]}
                />
                <Pie
                  data={investmentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {investmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value: string, entry: any) => (
                    <span className="text-sm text-gray-600">
                      {value} ({entry.payload?.percentage?.toFixed(1)}%)
                    </span>
                  )}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Investimento x Faturamento */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">{t('campaignAnalytics.investmentVsRevenue')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={areaChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12}
                  tickFormatter={(value) => formatCurrency(value, 'USD')}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number, name: string) => [
                    formatCurrency(value, 'USD'), 
                    name === 'investment' ? t('campaignAnalytics.investmentWord') : t('campaignAnalytics.revenueWord')
                  ]}
                />
                <Bar dataKey="investment" fill="#ef4444" name={t('campaignAnalytics.investmentWord')} radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" fill="#16A34A" name={t('campaignAnalytics.revenueWord')} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Taxa de Conversão */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">{t('campaignAnalytics.conversionRateByCampaign')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={conversionRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)}%`, t('campaignAnalytics.conversionRateWord')]}
                />
                <Bar dataKey="rate" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabelas de Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Campanhas */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              {t('campaignAnalytics.topCampaigns')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performers.top.map((campaign, index) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-sm">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{campaign.campanha}</p>
                      <p className="text-sm text-gray-600">ROI: {(campaign.roi || 0).toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{formatCurrency(campaign.lucro || 0, 'USD')}</p>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      {t('campaignAnalytics.topPerformerBadge')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Campanhas com Prejuízo */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              {t('campaignAnalytics.campaignsWithLoss')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performers.bottom.filter(c => (c.lucro || 0) < 0).map((campaign, index) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-semibold text-sm">⚠</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{campaign.campanha}</p>
                      <p className="text-sm text-gray-600">ROI: {(campaign.roi || 0).toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">{formatCurrency(campaign.lucro || 0, 'USD')}</p>
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                      {t('campaignAnalytics.requiresAttentionBadge')}
                    </Badge>
                  </div>
                </div>
              ))}
              {performers.bottom.filter(c => (c.lucro || 0) < 0).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-3 text-green-600" />
                  <p>{t('campaignAnalytics.allCampaignsAreProfitable')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CampaignAnalytics
