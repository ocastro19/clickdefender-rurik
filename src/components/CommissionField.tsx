import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Info, DollarSign } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useExchangeRate } from '@/hooks/useExchangeRate'
import { formatCurrency } from '@/utils/campaignCalculations'

interface CommissionFieldProps {
  value: number
  onChange: (value: number) => void
  campaignCurrency: 'BRL' | 'USD'
  readonly?: boolean
  className?: string
}

export const CommissionField: React.FC<CommissionFieldProps> = ({
  value,
  onChange,
  campaignCurrency,
  readonly = false,
  className
}) => {
  const { exchangeRate, loading } = useExchangeRate()

  const formatEquivalentValue = () => {
    if (campaignCurrency === 'USD') {
      return null // Só mostra em USD quando a campanha for USD
    }
    
    if (loading) {
      return <Badge variant="outline" className="text-xs">Carregando...</Badge>
    }
    
    if (!exchangeRate || value === 0) {
      return null
    }
    
    const brlValue = value * exchangeRate
    return (
      <Badge variant="secondary" className="text-xs font-normal">
        Equivalente: {formatCurrency(brlValue, 'BRL')}
      </Badge>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <Label htmlFor="comissao" className="text-sm font-medium flex items-center gap-1">
          <DollarSign className="h-3 w-3" />
          Comissão (USD)
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs z-[99999] fixed">
              <p className="text-sm">
                Valor em dólar recebido de comissão por conversão. 
                Este campo é sempre em USD, independente da moeda da campanha.
                {campaignCurrency === 'BRL' && ' O valor equivalente em reais é calculado automaticamente.'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="space-y-2">
        <Input
          id="comissao"
          type="number"
          step="0.01"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          readOnly={readonly}
          className={cn(
            "h-10",
            readonly && "bg-muted cursor-not-allowed text-muted-foreground",
            !readonly && "border-primary/20 focus:border-primary"
          )}
          placeholder="0.00"
        />
        
        {/* Mostrar equivalente em BRL apenas se a campanha for BRL */}
        {formatEquivalentValue()}
      </div>
    </div>
  )
}