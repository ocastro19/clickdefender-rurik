import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'
import { getMetricsConfig } from '@/utils/metricsConfig'
import { useTranslation } from 'react-i18next'
import { CommissionField } from '@/components/CommissionField'
import { cn } from '@/lib/utils'

interface MetricFieldProps {
  fieldKey: string
  value: number
  onChange: (value: number) => void
  currency?: string
  readonly?: boolean
  className?: string
  campaignCurrency?: 'BRL' | 'USD'
}

export const MetricField: React.FC<MetricFieldProps> = ({
  fieldKey,
  value,
  onChange,
  currency,
  readonly = false,
  className,
  campaignCurrency = 'USD'
}) => {
  const { t } = useTranslation();
  const metricsConfig = getMetricsConfig(t);
  const config = metricsConfig[fieldKey]
  
  if (!config) {
    return null
  }

  // Se for campo de comissão, usar o componente específico
  if (fieldKey === 'comissao') {
    return (
      <CommissionField
        value={value}
        onChange={onChange}
        campaignCurrency={campaignCurrency}
        readonly={readonly}
        className={className}
      />
    )
  }

  const getCurrencySymbol = (curr: string) => {
    return curr === 'USD' ? '$' : 'R$'
  }

  const shouldShowCurrency = fieldKey.includes('orcamento') || fieldKey.includes('cpc') || fieldKey.includes('custo') || fieldKey.includes('comissao')
  const isPercentage = fieldKey.includes('ctr') || fieldKey.includes('taxa') || fieldKey.includes('parcela') || fieldKey.includes('is')

  const displayName = shouldShowCurrency && currency 
    ? `${config.displayName} (${getCurrencySymbol(currency)})`
    : config.displayName

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <Label htmlFor={fieldKey} className="text-sm font-medium">
          {displayName}
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs z-[99999] fixed">
              <p className="text-sm">{config.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Input
        id={fieldKey}
        type="number"
        step={isPercentage || shouldShowCurrency ? "0.01" : "1"}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        readOnly={readonly}
        className={cn(
          "h-10",
          readonly && "bg-muted cursor-not-allowed text-muted-foreground",
          !readonly && "border-primary/20 focus:border-primary"
        )}
        placeholder="0"
      />
    </div>
  )
}