import React from 'react'
import { useTranslation } from 'react-i18next'
import { BarChart, Target, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGlobalCurrencyFormatter } from '@/hooks/useGlobalCurrencyFormatter'
import { useIsMobile } from '@/hooks/use-mobile'

interface ForecastData {
  revenue: number
  cost: number
  profit: number
  conversions: number
  clicks: number
  impressions: number
}

interface ForecastScenariosCardProps {
  scenarios: {
    optimistic: ForecastData
    realistic: ForecastData
    conservative: ForecastData
    pessimistic: ForecastData
  }
}

const ForecastScenariosCard: React.FC<ForecastScenariosCardProps> = ({ scenarios }) => {
  const { t } = useTranslation()
  const { formatGlobalCurrency } = useGlobalCurrencyFormatter()
  const isMobile = useIsMobile()
  
  const scenarioData = [
    {
      name: t('financial.optimistic'),
      icon: <TrendingUp className="h-4 w-4 text-success" />,
      color: 'text-success',
      bgColor: 'bg-success/10',
      data: scenarios.optimistic,
      emoji: '🟢'
    },
    {
      name: t('financial.realistic'),
      icon: <Target className="h-4 w-4 text-primary" />,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      data: scenarios.realistic,
      emoji: '🔵'
    },
    {
      name: t('financial.conservative'),
      icon: <BarChart className="h-4 w-4 text-warning" />,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      data: scenarios.conservative,
      emoji: '🟡'
    },
    {
      name: t('financial.pessimistic'),
      icon: <TrendingDown className="h-4 w-4 text-destructive" />,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      data: scenarios.pessimistic,
      emoji: '🔴'
    }
  ]

  return (
    <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-premium hover:shadow-glow transition-all duration-500">
      <CardHeader className={`${isMobile ? 'pb-3' : 'pb-4'}`}>
        <CardTitle className={`${
          isMobile ? 'text-base' : 'text-2xl'
        } font-bold text-foreground flex items-center gap-2 sm:gap-3`}>
          <div className={`${
            isMobile ? 'p-1.5' : 'p-2'
          } rounded-lg bg-gradient-to-r from-blue-500 to-blue-600`}>
            <BarChart className={`${isMobile ? 'h-4 w-4' : 'h-6 w-6'} text-white`} />
          </div>
          <span className={`${isMobile ? 'text-sm' : 'text-xl'}`}>
            📊 {isMobile ? t('financial.projection') : t('financial.financialProjection')}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className={`${isMobile ? 'px-4' : 'px-6'}`}>
        <div className={`${isMobile ? 'space-y-3' : 'space-y-4'}`}>
          <div className={`${
            isMobile ? 'text-xs' : 'text-sm'
          } font-semibold text-muted-foreground mb-4 sm:mb-6 flex items-center gap-2`}>
            <Target className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            <span className={isMobile ? 'text-xs' : ''}>
              {isMobile ? t('financial.scenarios') : t('financial.possibleScenarios')}
            </span>
          </div>
          
          {scenarioData.map((scenario, index) => (
            <div 
              key={index}
              className={`${
                isMobile ? 'p-3' : 'p-4'
              } rounded-xl border border-border ${scenario.bgColor} hover:shadow-md transition-all duration-300`}
            >
              <div className={`flex items-center justify-between ${isMobile ? 'mb-2' : 'mb-3'}`}>
                <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-3'}`}>
                  <span className={`${isMobile ? 'text-base' : 'text-lg'}`}>{scenario.emoji}</span>
                  <span className={`font-bold ${
                    isMobile ? 'text-sm' : 'text-lg'
                  } ${scenario.color}`}>
                    {scenario.name}:
                  </span>
                </div>
                <div className={`${isMobile ? 'scale-90' : ''}`}>
                  {scenario.icon}
                </div>
              </div>
              
              <div className={`grid ${
                isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 sm:grid-cols-3 gap-4'
              }`}>
                <div className={`space-y-1 ${isMobile ? 'flex items-center justify-between' : ''}`}>
                  <p className={`${
                    isMobile ? 'text-xs' : 'text-sm'
                  } font-medium text-muted-foreground`}>
                    {t('financial.revenue')}:
                  </p>
                  <p className={`${
                    isMobile ? 'text-base' : 'text-xl'
                  } font-bold ${scenario.color}`}>
                    {isMobile 
                      ? formatGlobalCurrency(scenario.data.revenue).replace('US$', '$')
                      : formatGlobalCurrency(scenario.data.revenue)
                    }
                  </p>
                </div>
                
                <div className={`space-y-1 ${isMobile ? 'flex items-center justify-between' : ''}`}>
                  <p className={`${
                    isMobile ? 'text-xs' : 'text-sm'
                  } font-medium text-muted-foreground`}>
                    {t('financial.cost')}:
                  </p>
                  <p className={`${
                    isMobile ? 'text-base' : 'text-xl'
                  } font-bold text-destructive`}>
                    {isMobile 
                      ? formatGlobalCurrency(scenario.data.cost).replace('US$', '$')
                      : formatGlobalCurrency(scenario.data.cost)
                    }
                  </p>
                </div>
                
                <div className={`space-y-1 ${isMobile ? 'flex items-center justify-between' : ''}`}>
                  <p className={`${
                    isMobile ? 'text-xs' : 'text-sm'
                  } font-medium text-muted-foreground`}>
                    {t('financial.profit')}:
                  </p>
                  <p className={`${
                    isMobile ? 'text-base' : 'text-xl'
                  } font-bold ${scenario.data.profit > 0 ? 'text-success' : 'text-destructive'}`}>
                    {isMobile 
                      ? formatGlobalCurrency(scenario.data.profit).replace('US$', '$')
                      : formatGlobalCurrency(scenario.data.profit)
                    }
                  </p>
                </div>
              </div>
              
              {/* Métricas Adicionais */}
              <div className={`${
                isMobile ? 'mt-2 pt-2' : 'mt-3 pt-3'
              } border-t border-border/50`}>
                <div className={`flex flex-wrap ${
                  isMobile ? 'gap-1' : 'gap-3'
                } text-sm`}>
                  <Badge variant="outline" className={`text-muted-foreground ${
                    isMobile ? 'text-xs px-1.5 py-0.5' : ''
                  }`}>
                    🎯 {Math.round(scenario.data.conversions)} {isMobile ? '' : t('financial.conversions')}
                  </Badge>
                  <Badge variant="outline" className={`text-muted-foreground ${
                    isMobile ? 'text-xs px-1.5 py-0.5' : ''
                  }`}>
                    👆 {isMobile 
                      ? `${(Math.round(scenario.data.clicks) / 1000).toFixed(1)}k` 
                      : `${Math.round(scenario.data.clicks).toLocaleString()} ${t('financial.clicks')}`
                    }
                  </Badge>
                  <Badge variant="outline" className={`text-muted-foreground ${
                    isMobile ? 'text-xs px-1.5 py-0.5' : ''
                  }`}>
                    👁️ {isMobile 
                      ? `${(Math.round(scenario.data.impressions) / 1000).toFixed(1)}k` 
                      : `${Math.round(scenario.data.impressions).toLocaleString()} ${t('financial.impressions')}`
                    }
                  </Badge>
                </div>
              </div>
            </div>
          ))}
          
          <div className={`${
            isMobile ? 'mt-4 p-3' : 'mt-6 p-4'
          } bg-muted/50 rounded-xl`}>
            <p className={`${
              isMobile ? 'text-xs' : 'text-sm'
            } text-muted-foreground text-center`}>
              💡 <strong>{t('financial.tip').split(':')[0]}:</strong> {t('financial.tip').split(':')[1]}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ForecastScenariosCard