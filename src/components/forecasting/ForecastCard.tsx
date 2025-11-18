import React, { useState } from 'react'
import { TrendingUp, Target, AlertTriangle, ChevronDown, ChevronUp, CreditCard, Gem, BarChart3, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useGlobalCurrencyFormatter } from '@/hooks/useGlobalCurrencyFormatter'

interface ForecastCardProps {
  projectedRevenue: number
  projectedCost: number
  projectedProfit: number
  currentROAS: number
  confidence: number
  monthlyGoal: number
  goalStatus: 'above' | 'below' | 'ontrack'
  goalPercentage: number
}

const ForecastCard: React.FC<ForecastCardProps> = ({
  projectedRevenue,
  projectedCost,
  projectedProfit,
  currentROAS,
  confidence,
  monthlyGoal,
  goalStatus,
  goalPercentage
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { formatGlobalCurrency } = useGlobalCurrencyFormatter()
  
  const getStatusColor = () => {
    switch (goalStatus) {
      case 'above': return 'text-success'
      case 'below': return 'text-destructive'
      default: return 'text-warning'
    }
  }
  
  const getStatusIcon = () => {
    switch (goalStatus) {
      case 'above': return <CheckCircle className="h-4 w-4 text-success" />
      case 'below': return <XCircle className="h-4 w-4 text-destructive" />
      default: return <AlertTriangle className="h-4 w-4 text-warning" />
    }
  }
  
  const getStatusText = () => {
    const absPercentage = Math.abs(goalPercentage)
    switch (goalStatus) {
      case 'above': return `Acima da meta (+${absPercentage.toFixed(0)}%)`
      case 'below': return `Abaixo da meta (-${absPercentage.toFixed(0)}%)`
      default: return 'No caminho da meta'
    }
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-primary/10 to-primary/5 shadow-premium hover:shadow-glow transition-all duration-500">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-primary/80">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              Previsão para Este Mês
            </CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          {/* Resumo sempre visível */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Receita Projetada</p>
              <p className="text-lg font-bold text-success">{formatGlobalCurrency(projectedRevenue)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Status da Meta</p>
              <div className="flex items-center gap-1.5">
                {getStatusIcon()}
                <span className={`text-sm font-semibold ${getStatusColor()}`}>
                  {getStatusText()}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Métricas Principais */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Receita Projetada:
                </span>
                <span className="text-2xl font-bold text-success">{formatGlobalCurrency(projectedRevenue)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-muted-foreground flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Custo Estimado:
                </span>
                <span className="text-2xl font-bold text-destructive">{formatGlobalCurrency(projectedCost)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-muted-foreground flex items-center gap-2">
                  <Gem className="h-5 w-5" />
                  Lucro Previsto:
                </span>
                <span className={`text-2xl font-bold ${projectedProfit > 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatGlobalCurrency(projectedProfit)}
                </span>
              </div>
            </div>
            
            <div className="border-t pt-4 space-y-3">
              {/* ROAS e Confiança */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <BarChart3 className="h-4 w-4" />
                  Baseado no ROAS atual:
                </span>
                <Badge variant="outline" className="text-primary font-bold">
                  {currentROAS.toFixed(2)}x
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4" />
                  Confiança:
                </span>
                <Badge variant="outline" className={confidence > 80 ? 'text-success' : confidence > 60 ? 'text-warning' : 'text-destructive'}>
                  {confidence.toFixed(0)}%
                </Badge>
              </div>
            </div>
            
            <div className="border-t pt-4 space-y-2">
              {/* Meta do Mês */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Target className="h-4 w-4" />
                  Meta do mês:
                </span>
                <span className="text-lg font-bold text-foreground">{formatGlobalCurrency(monthlyGoal)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon()}
                  <span className={`font-semibold ${getStatusColor()}`}>
                    {getStatusText()}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Barra de Progresso Visual */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progresso da meta</span>
                <span>{((projectedRevenue / monthlyGoal) * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-border rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    goalStatus === 'above' ? 'bg-success' : 
                    goalStatus === 'below' ? 'bg-destructive' : 
                    'bg-warning'
                  }`}
                  style={{ 
                    width: `${Math.min(100, Math.max(0, (projectedRevenue / monthlyGoal) * 100))}%` 
                  }}
                />
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

export default ForecastCard