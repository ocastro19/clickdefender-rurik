import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  Eye, MousePointer, ShoppingCart, DollarSign, RefreshCw, 
  BarChart3, TrendingUp, TrendingDown, Activity, Zap, 
  Target, Users, CheckCircle2, Copy, ExternalLink, 
  Calendar, Info, FileText, Star, Shield
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useToast } from '@/hooks/use-toast'

interface PresellData {
  id: number
  name: string
  type: string
  visitas: number
  cliques: number
  taxaFuga: string
  checkouts: number
  vendas: number
  reembolsos: number
  status?: 'active' | 'paused' | 'draft'
  avatar?: string
}

interface PresellDetails {
  publicadoEm: string
  paises: string
  dominio: string
  metaVenda: string
  metaCheckout: string
  script: string
  palavrasChave: string
}

interface PremiumKPICardProps {
  icon: React.ComponentType<any>
  title: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
  percentage?: number
  gradientClass: string
  glowColor: string
  textColor: string
}

const PremiumKPICard: React.FC<PremiumKPICardProps> = ({ 
  icon: Icon, 
  title, 
  value, 
  trend, 
  percentage,
  gradientClass, 
  glowColor,
  textColor
}) => (
  <Card className="relative overflow-hidden bg-card shadow-premium transition-all duration-500 hover:shadow-elegant hover:scale-[1.02] dark:bg-gradient-to-br dark:from-card/40 dark:via-card/20 dark:to-card/10">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50" />
    <CardContent className="p-6 relative">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${gradientClass} shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
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
      
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className={`text-3xl font-bold ${textColor}`}>
          {value}
        </p>
        {percentage && (
          <p className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
            Taxa: {Math.abs(percentage)}% {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
          </p>
        )}
      </div>
    </CardContent>
  </Card>
)

const PresellDetailsPanel: React.FC<{ 
  selectedPresell: string | null, 
  presellDetails: Record<string, PresellDetails> 
}> = ({ selectedPresell, presellDetails }) => {
  const { toast } = useToast()
  const details = selectedPresell ? presellDetails[selectedPresell] : null

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência.`,
    })
  }

  if (!selectedPresell || !details) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <Target className="w-16 h-16 mx-auto mb-4 opacity-30" />
        <h3 className="text-lg font-semibold mb-2">Selecione uma Presell</h3>
        <p className="text-sm">Clique em uma presell no gráfico ou na tabela para ver os detalhes</p>
      </div>
    )
  }

  const detailItems = [
    { icon: CheckCircle2, label: 'Status', value: 'Publicado', color: 'text-success' },
    { icon: Calendar, label: 'Publicado em', value: details.publicadoEm, color: 'text-muted-foreground' },
    { icon: Users, label: 'Países', value: details.paises, color: 'text-muted-foreground' },
    { icon: ExternalLink, label: 'Domínio', value: details.dominio, color: 'text-primary', copyable: true },
    { icon: Target, label: 'Meta de venda', value: details.metaVenda, color: 'text-muted-foreground', copyable: true },
    { icon: ShoppingCart, label: 'Meta de checkout', value: details.metaCheckout, color: 'text-muted-foreground', copyable: true },
    { icon: FileText, label: 'Script', value: details.script, color: 'text-muted-foreground', copyable: true },
    { icon: Star, label: 'Palavras-chave', value: details.palavrasChave, color: 'text-muted-foreground' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pb-4 border-b border-border/50">
        <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-foreground">{selectedPresell}</h3>
      </div>
      
      <div className="space-y-3">
        {detailItems.map((item, index) => (
          <div 
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg bg-card/30 backdrop-blur-sm border border-border/30 hover:bg-card/50 transition-all duration-200 ${item.copyable ? 'cursor-pointer' : ''}`}
            onClick={() => item.copyable && copyToClipboard(item.value, item.label)}
          >
            <item.icon className={`w-4 h-4 ${item.color}`} />
            <div className="flex-1">
              <span className="text-sm font-medium text-foreground">{item.label}:</span>
              <span className={`ml-2 text-sm ${item.color}`}>{item.value}</span>
            </div>
            {item.copyable && (
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="z-[99999] fixed">
                    <p>Clique para copiar</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

interface PremiumPresellDashboardProps {
  presells: PresellData[]
  presellDetails: Record<string, PresellDetails>
}

const PremiumPresellDashboard: React.FC<PremiumPresellDashboardProps> = ({ 
  presells, 
  presellDetails 
}) => {
  const { t } = useTranslation()
  const [selectedPresell, setSelectedPresell] = useState<string>("BrainDefender")
  const { toast } = useToast()

  const kpis = useMemo(() => {
    const totalCheckouts = presells.reduce((sum, p) => sum + p.checkouts, 0)
    const totalVendas = presells.reduce((sum, p) => sum + p.vendas, 0)
    const totalReembolsos = presells.reduce((sum, p) => sum + p.reembolsos, 0)
    
    return { totalCheckouts, totalVendas, totalReembolsos }
  }, [presells])

  const chartData = useMemo(() => {
    return presells.map(presell => ({
      name: presell.name.length > 8 ? presell.name.substring(0, 8) + '...' : presell.name,
      fullName: presell.name,
      Acessos: presell.visitas,
      Cliques: presell.cliques,
      Vendas: presell.vendas,
      isSelected: selectedPresell === presell.name
    }))
  }, [presells, selectedPresell])

  const handlePresellSelect = (presellName: string) => {
    setSelectedPresell(presellName)
  }

  const handleBarClick = (data: any) => {
    if (data && data.fullName) {
      handlePresellSelect(data.fullName)
    }
  }

  const deletePresell = (presellId: number) => {
    toast({
      title: "Presell Removida",
      description: "A presell foi removida com sucesso.",
    })
  }

  return (
    <div className="space-y-8">
      {/* Hero Section Premium */}
      <div className="text-center space-y-4 py-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 shadow-premium">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Análise Premium de Presells
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Dashboard profissional com métricas avançadas e análises em tempo real
        </p>
      </div>

      {/* Linha única de métricas */}
      <Card className="bg-card shadow-premium transition-all duration-500 hover:shadow-elegant dark:bg-card/40 dark:backdrop-blur-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-8">
            {/* Nome da Presell */}
            <div className="text-2xl font-bold text-foreground">
              {selectedPresell}
            </div>
            
            {/* Métricas em linha */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-500" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">4</div>
                  <div className="text-sm text-muted-foreground">Visitas</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <MousePointer className="w-5 h-5 text-cyan-500" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-500">1</div>
                  <div className="text-sm text-muted-foreground">Cliques</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-500" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">75.0%</div>
                  <div className="text-sm text-muted-foreground">Fuga</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-green-500" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">0</div>
                  <div className="text-sm text-muted-foreground">Vendas</div>
                </div>
              </div>
            </div>
            
            {/* Seções inferiores */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-lg">
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Domínio</span>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-lg">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Meta de Venda</span>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Meta de Checkout</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section - 2/3 width */}
        <div className="lg:col-span-2">
          <Card className="bg-card shadow-premium transition-all duration-500 hover:shadow-elegant dark:bg-card/40 dark:backdrop-blur-md">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                Resumo Geral
                <div className="flex items-center gap-2 ml-auto text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  25/07/2025
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData} onClick={handleBarClick}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-premium">
                            <p className="text-foreground font-semibold mb-2">{label}</p>
                            {payload.map((entry, index) => (
                              <p key={index} className="font-medium" style={{ color: entry.color }}>
                                {entry.name}: {entry.value}
                              </p>
                            ))}
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="Acessos" radius={[4, 4, 0, 0]} cursor="pointer">
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-acessos-${index}`} 
                        fill={entry.isSelected ? 'hsl(var(--chart-1))' : 'hsl(var(--chart-1))'}
                        opacity={entry.isSelected ? 1 : 0.7}
                      />
                    ))}
                  </Bar>
                  <Bar dataKey="Cliques" radius={[4, 4, 0, 0]} cursor="pointer">
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-cliques-${index}`} 
                        fill={entry.isSelected ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-2))'}
                        opacity={entry.isSelected ? 1 : 0.7}
                      />
                    ))}
                  </Bar>
                  <Bar dataKey="Vendas" radius={[4, 4, 0, 0]} cursor="pointer">
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-vendas-${index}`} 
                        fill={entry.isSelected ? 'hsl(var(--chart-3))' : 'hsl(var(--chart-3))'}
                        opacity={entry.isSelected ? 1 : 0.7}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              
              <div className="flex flex-wrap gap-4 mt-4 text-sm">
                {['Acessos', 'Cliques', 'Vendas'].map((label, index) => (
                  <div key={label} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded" 
                      style={{ backgroundColor: `hsl(var(--chart-${index + 1}))` }}
                    />
                    <span className="font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details Panel - 1/3 width */}
        <div className="lg:col-span-1">
          <Card className="bg-card shadow-premium transition-all duration-500 hover:shadow-elegant h-full dark:bg-card/40 dark:backdrop-blur-md">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-bold text-foreground flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
                  <Info className="h-5 w-5 text-white" />
                </div>
                Detalhes da Presell
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PresellDetailsPanel 
                selectedPresell={selectedPresell} 
                presellDetails={presellDetails} 
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Premium Table */}
      <Card className="bg-card shadow-premium transition-all duration-500 hover:shadow-elegant dark:bg-card/40 dark:backdrop-blur-md">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600">
              <FileText className="h-6 w-6 text-white" />
            </div>
            Presells
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/50">
                  <TableHead className="font-semibold">Presell</TableHead>
                  <TableHead className="font-semibold">Tipo</TableHead>
                  <TableHead className="text-center font-semibold">
                    <div className="flex items-center justify-center gap-1">
                      <Eye className="w-4 h-4" />
                      Visitas
                    </div>
                  </TableHead>
                  <TableHead className="text-center font-semibold">
                    <div className="flex items-center justify-center gap-1">
                      <MousePointer className="w-4 h-4" />
                      Cliques
                    </div>
                  </TableHead>
                  <TableHead className="text-center font-semibold">Taxa Fuga</TableHead>
                  <TableHead className="text-center font-semibold text-primary">Checkout</TableHead>
                  <TableHead className="text-center font-semibold text-success">Vendas</TableHead>
                  <TableHead className="text-center font-semibold text-destructive">Reembolsos</TableHead>
                  <TableHead className="text-center font-semibold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {presells.map((presell, index) => (
                  <TableRow 
                    key={presell.id} 
                    className={`cursor-pointer hover:bg-muted/30 transition-all duration-200 ${
                      selectedPresell === presell.name 
                        ? 'bg-primary/10 border-l-4 border-l-primary shadow-sm' 
                        : 'hover:shadow-sm'
                    }`}
                    onClick={() => handlePresellSelect(presell.name)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                          {presell.name.charAt(0)}
                        </div>
                        {index + 1} - {presell.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-muted/50">{presell.type}</Badge>
                    </TableCell>
                    <TableCell className="text-center font-medium">{presell.visitas}</TableCell>
                    <TableCell className="text-center font-medium">{presell.cliques}</TableCell>
                    <TableCell className="text-center font-medium">{presell.taxaFuga}</TableCell>
                    <TableCell className="text-center text-primary font-bold">{presell.checkouts}</TableCell>
                    <TableCell className="text-center text-success font-bold">{presell.vendas}</TableCell>
                    <TableCell className="text-center text-destructive font-bold">{presell.reembolsos}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deletePresell(presell.id)
                        }}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PremiumPresellDashboard