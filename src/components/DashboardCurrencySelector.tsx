import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DollarSign, CircleDollarSign, BarChart3 } from 'lucide-react';
import { useDashboardCurrency } from '@/contexts/DashboardCurrencyContext';

export const DashboardCurrencySelector: React.FC = () => {
  const {
    dashboardCurrency,
    setDashboardCurrency,
    exchangeRate
  } = useDashboardCurrency();

  return (
    <div className="flex items-center gap-3">
      <Select value={dashboardCurrency} onValueChange={setDashboardCurrency}>
        <SelectTrigger className="w-36 bg-card/50 border-border hover:bg-card/80 transition-colors">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="BRL">
            <div className="flex items-center gap-2">
              <CircleDollarSign className="h-4 w-4 text-green-600" />
              <span className="font-medium">BRL (R$)</span>
            </div>
          </SelectItem>
          <SelectItem value="USD">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <span className="font-medium">USD (US$)</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      
      <Badge 
        variant="outline" 
        className="text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors flex items-center gap-1.5"
      >
        <BarChart3 className="h-3 w-3" />
        {dashboardCurrency === 'BRL' ? 'Visualizando em Reais' : 'Visualizando em Dólares'}
      </Badge>
    </div>
  );
};