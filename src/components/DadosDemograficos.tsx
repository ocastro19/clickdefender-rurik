import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Clock, Smartphone } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Campaign } from '@/contexts/CampaignContext'
import { useGlobalCurrencyFormatter } from '@/hooks/useGlobalCurrencyFormatter'

interface DadosDemograficosProps {
  campaigns: Campaign[]
}

type MetricType = 'impressoes' | 'cliques' | 'custo' | 'conversoes' | 'valorConversoes' | 'ctr' | 'cpcMedio'
type VisualizationType = 'dispositivo' | 'horario'

// Dados de exemplo para dispositivos
const dispositivoData = {
  mobile: { value: 3323, percentage: 100 },
  desktop: { value: 0, percentage: 0 },
  tablet: { value: 0, percentage: 0 }
}

// Dados de exemplo para horários (0-23h)
const horarioDataExample = {
  impressoes: [130, 172, 67, 54, 50, 65, 95, 180, 220, 250, 240, 190, 160, 140, 195, 170, 150, 160, 140, 130, 120, 110, 125, 115],
  cliques: [12, 15, 8, 6, 4, 7, 10, 18, 22, 25, 24, 19, 16, 14, 19, 17, 15, 16, 14, 13, 12, 11, 12, 11],
  custo: [23, 30, 16, 12, 8, 14, 20, 36, 44, 50, 48, 38, 32, 28, 38, 34, 30, 32, 28, 26, 24, 22, 24, 22],
  conversoes: [2, 3, 1, 1, 0, 1, 2, 4, 5, 6, 5, 4, 3, 3, 4, 3, 3, 3, 3, 2, 2, 2, 2, 2],
  valorConversoes: [120, 180, 60, 60, 0, 60, 120, 240, 300, 360, 300, 240, 180, 180, 240, 180, 180, 180, 180, 120, 120, 120, 120, 120],
  ctr: [9.2, 8.7, 11.9, 11.1, 8.0, 10.8, 10.5, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 9.7, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 9.6, 9.6],
  cpcMedio: [1.92, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00]
}

const DadosDemograficos: React.FC<DadosDemograficosProps> = ({ campaigns }) => {
  const { t } = useTranslation()
  const { formatGlobalCurrency } = useGlobalCurrencyFormatter()
  const [visualizacao, setVisualizacao] = useState<VisualizationType>('horario')
  const [metricaSelecionada, setMetricaSelecionada] = useState<MetricType>('impressoes')

  const metricas = [
    { key: 'impressoes' as MetricType, label: t('campaigns.impressions') },
    { key: 'cliques' as MetricType, label: t('campaigns.clicks') },
    { key: 'custo' as MetricType, label: t('campaigns.cost') },
    { key: 'conversoes' as MetricType, label: t('campaigns.conversions') },
    { key: 'valorConversoes' as MetricType, label: t('campaigns.revenue') },
    { key: 'ctr' as MetricType, label: t('campaigns.ctr') },
    { key: 'cpcMedio' as MetricType, label: t('campaigns.averageCpc') }
  ]

  const COLORS = ['#2563EB', '#3B82F6', '#60A5FA']

  const [campanhaFiltro, setCampanhaFiltro] = useState('all')

  // Preparar dados do gráfico de pizza para dispositivos
  const dispositivoChartData = useMemo(() => [
    { name: 'Mobile', value: dispositivoData.mobile.value, percentage: dispositivoData.mobile.percentage },
    { name: 'Desktop', value: dispositivoData.desktop.value, percentage: dispositivoData.desktop.percentage },
    { name: 'Tablet', value: dispositivoData.tablet.value, percentage: dispositivoData.tablet.percentage }
  ].filter(item => item.value > 0), [])

  // Preparar dados do gráfico de linha para horários
  const horarioChartData = useMemo(() => {
    const data = horarioDataExample[metricaSelecionada]
    return data.map((value, index) => ({
      hora: `${index}:00`,
      value: value,
      horaNum: index
    }))
  }, [metricaSelecionada])

  // Obter top 5 segmentos
  const getTop5Segmentos = () => {
    if (visualizacao === 'dispositivo') {
      return [
        { name: 'Mobile', rank: '#1', value: dispositivoData.mobile.value, label: `${dispositivoData.mobile.value} ${metricas.find(m => m.key === metricaSelecionada)?.label.toLowerCase()}` }
      ]
    } else {
      const data = horarioDataExample[metricaSelecionada]
      const horariosComValores = data.map((value, index) => ({
        hora: `${index}:00`,
        value: value,
        index: index
      }))
      
      const top5 = horariosComValores
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)
        .map((item, index) => ({
          name: item.hora,
          rank: `#${index + 1}`,
          value: item.value,
          label: `${item.value} ${metricas.find(m => m.key === metricaSelecionada)?.label.toLowerCase()}`
        }))
      
      return top5
    }
  }

  const top5Segmentos = getTop5Segmentos()

  const renderCustomTooltip = (props: any) => {
    if (props.active && props.payload && props.payload.length) {
      const data = props.payload[0]
      if (visualizacao === 'horario') {
        return (
          <div className="bg-background border rounded-lg p-2 shadow-lg">
            <p className="font-medium">{`${data.payload.hora}: ${data.value}`}</p>
          </div>
        )
      }
    }
    return null
  }

  const renderPieTooltip = (props: any) => {
    if (props.active && props.payload && props.payload.length) {
      const data = props.payload[0]
      const deviceName = data.name
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg min-w-[200px]">
          <p className="font-semibold text-primary mb-2">{deviceName} (100,0%)</p>
          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground">Impressões: 3.323</p>
            <p className="text-muted-foreground">Cliques: 396</p>
            <p className="text-muted-foreground">Custo: {formatGlobalCurrency(5735.49, 'USD')}</p>
            <p className="text-muted-foreground">Conversões: 2</p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">{t('analytics.demographicData')}</h2>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          {t('analytics.exportPDF')}
        </Button>
      </div>

      {/* Filtro de Campanhas */}
      <div className="flex justify-center">
        <Select value={campanhaFiltro} onValueChange={setCampanhaFiltro}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder={t('campaigns.allCampaignsFilter')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('campaigns.allCampaignsFilter')}</SelectItem>
            {campaigns.map((campaign) => (
              <SelectItem key={campaign.id} value={campaign.id}>
                {campaign.campanha}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Toggle de Visualização */}
      <div className="flex justify-center gap-2">
        <Button
          variant={visualizacao === 'horario' ? 'default' : 'outline'}
          onClick={() => setVisualizacao('horario')}
          className="flex items-center gap-2"
        >
          <Clock className="h-4 w-4" />
          {t('analytics.schedule')}
        </Button>
        <Button
          variant={visualizacao === 'dispositivo' ? 'default' : 'outline'}
          onClick={() => setVisualizacao('dispositivo')}
          className="flex items-center gap-2"
        >
          <Smartphone className="h-4 w-4" />
          {t('analytics.device')}
        </Button>
      </div>

      {/* Filtros de Métricas */}
      <div className="flex flex-wrap justify-center gap-2">
        {metricas.map((metrica) => (
          <Button
            key={metrica.key}
            variant={metricaSelecionada === metrica.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMetricaSelecionada(metrica.key)}
            className="text-xs"
          >
            {metrica.label}
          </Button>
        ))}
      </div>

      {/* Gráficos */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          {visualizacao === 'dispositivo' ? (
            <div className="h-[400px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dispositivoChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dispositivoChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={renderPieTooltip} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={horarioChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="hora"
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                    interval={0}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                    domain={['dataMin - 10', 'dataMax + 10']}
                  />
                  <Tooltip content={renderCustomTooltip} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2563EB" 
                    strokeWidth={3}
                    dot={{ fill: '#2563EB', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 8, fill: '#2563EB', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabela Top 5 */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">
            Top 5 Segmentos por {metricas.find(m => m.key === metricaSelecionada)?.label}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {top5Segmentos.map((segmento, index) => (
              <Card key={index} className="bg-card/50 border border-border/40 hover:border-border/60 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">{segmento.name}</span>
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">{segmento.rank}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-primary">{segmento.value}</div>
                    <div className="text-xs text-muted-foreground capitalize">{segmento.label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DadosDemograficos