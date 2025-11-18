
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Lightbulb, AlertTriangle, TrendingUp, Target, Zap, Brain } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Insight {
  type: 'opportunity' | 'warning' | 'prediction' | 'recommendation'
  message: string
  confidence: number
  action?: string
}

interface InsightsCardProps {
  insights: Insight[]
}

const InsightsCard: React.FC<InsightsCardProps> = ({ insights }) => {
  const { t } = useTranslation()
  
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="h-5 w-5 text-success" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-destructive" />
      case 'prediction': return <Brain className="h-5 w-5 text-primary" />
      case 'recommendation': return <Lightbulb className="h-5 w-5 text-warning" />
      default: return <Target className="h-5 w-5 text-muted-foreground" />
    }
  }
  
  const getInsightEmoji = (type: string) => {
    switch (type) {
      case 'opportunity': return '🚀'
      case 'warning': return '⚠️'
      case 'prediction': return '🔮'
      case 'recommendation': return '💡'
      default: return '🎯'
    }
  }
  
  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'border-success/20 bg-success/5'
      case 'warning': return 'border-destructive/20 bg-destructive/5'
      case 'prediction': return 'border-primary/20 bg-primary/5'
      case 'recommendation': return 'border-warning/20 bg-warning/5'
      default: return 'border-border bg-muted/5'
    }
  }
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-success'
    if (confidence >= 60) return 'text-warning'
    return 'text-destructive'
  }

  const getInsightTypeLabel = (type: string) => {
    switch (type) {
      case 'opportunity': return t('insights.opportunity')
      case 'warning': return t('insights.warning')
      case 'prediction': return t('insights.prediction')
      case 'recommendation': return t('insights.recommendation')
      default: return type
    }
  }

  if (!insights.length) {
    return (
      <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-premium">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
              <Brain className="h-6 w-6 text-white" />
            </div>
            {t('insights.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t('insights.noDataTitle')}</p>
            <p className="text-sm mt-2">{t('insights.noDataDescription')}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-premium hover:shadow-glow transition-all duration-500">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
            <Brain className="h-6 w-6 text-white" />
          </div>
          {t('insights.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div 
              key={index}
              className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${getInsightColor(insight.type)}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <span className="text-xl">{getInsightEmoji(insight.type)}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getInsightIcon(insight.type)}
                      <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        {getInsightTypeLabel(insight.type)}
                      </span>
                    </div>
                    <Badge variant="outline" className={getConfidenceColor(insight.confidence)}>
                      {t('insights.confidence')}: {insight.confidence}%
                    </Badge>
                  </div>
                  
                  <p className="text-foreground font-medium mb-3">
                    {insight.message}
                  </p>
                  
                  {insight.action && (
                    <div className="flex items-center justify-between">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs"
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        {insight.action}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">IA Click Sync</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('insights.aiDescription')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default InsightsCard
