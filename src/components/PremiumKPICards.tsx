import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, ShoppingCart, ArrowUpCircle, RotateCcw } from 'lucide-react';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { useIsMobile } from '@/hooks/use-mobile';

interface PremiumKPICardsProps {
  totalVendas: number; // sempre USD
  totalPedidos: number; // quantidade
  valorMedioPedido: number; // USD
  totalUpsell: number; // USD
  totalReembolso: number; // USD
  selectedCampaign?: string; // opcional para filtros
}

export const PremiumKPICards: React.FC<PremiumKPICardsProps> = ({
  totalVendas,
  totalPedidos,
  valorMedioPedido,
  totalUpsell,
  totalReembolso,
  selectedCampaign
}) => {
  const { exchangeRate } = useExchangeRate();
  const isMobile = useIsMobile();

  const formatUSD = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatBRL = (value: number) => {
    if (!exchangeRate) return '';
    const brlValue = value * exchangeRate;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(brlValue);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  return (
    <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 lg:grid-cols-4 gap-6'} mb-8`}>
      {/* Total em Vendas */}
      <Card className="relative overflow-hidden bg-card shadow-premium dark:bg-gradient-to-br dark:from-success/20 dark:via-success/10 dark:to-success/5 dark:border-0 transition-all duration-500 hover:shadow-elegant hover:scale-[1.02] dark:hover:shadow-premium">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-success/5 to-transparent opacity-30 dark:via-white/5 dark:opacity-50" />
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-success to-success-bright shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <Badge variant="outline" className="bg-muted/50 text-success border-success/30 dark:bg-success/10 dark:border-success/20 font-medium">
              <TrendingUp className="h-4 w-4 inline mr-1.5" />
              Vendas
            </Badge>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">Total em Vendas</p>
            <p className="text-3xl font-bold text-transaction-sales">{formatUSD(totalVendas)}</p>
            {exchangeRate && (
              <p className="text-sm text-muted-foreground bg-muted/50 dark:bg-muted/50 px-3 py-1.5 rounded-lg font-medium">
                ≈ {formatBRL(totalVendas)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Total de Pedidos */}
      <Card className="relative overflow-hidden bg-card shadow-premium dark:bg-gradient-to-br dark:from-primary/20 dark:via-primary/10 dark:to-primary/5 dark:border-0 transition-all duration-500 hover:shadow-elegant hover:scale-[1.02] dark:hover:shadow-premium">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-30 dark:via-white/5 dark:opacity-50" />
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-primary to-info-bright shadow-lg">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <Badge variant="outline" className="bg-muted/50 text-primary border-primary/30 dark:bg-primary/10 dark:border-primary/20 font-medium">
              <ShoppingCart className="h-4 w-4 inline mr-1.5" />
              Pedidos
            </Badge>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">Total de Pedidos</p>
            <p className="text-3xl font-bold text-primary">{formatNumber(totalPedidos)}</p>
            <p className="text-sm text-muted-foreground bg-muted/50 dark:bg-muted/50 px-3 py-1.5 rounded-lg font-medium">
              Valor médio: {formatUSD(valorMedioPedido)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Total em Upsell */}
      <Card className="relative overflow-hidden bg-card shadow-premium dark:bg-gradient-to-br dark:from-warning/20 dark:via-warning/10 dark:to-warning/5 dark:border-0 transition-all duration-500 hover:shadow-elegant hover:scale-[1.02] dark:hover:shadow-premium">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-warning/5 to-transparent opacity-30 dark:via-white/5 dark:opacity-50" />
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-warning to-warning-bright shadow-lg">
              <ArrowUpCircle className="h-6 w-6 text-white" />
            </div>
            <Badge variant="outline" className="bg-muted/50 text-warning border-warning/30 dark:bg-warning/10 dark:border-warning/20 font-medium">
              <TrendingUp className="h-4 w-4 inline mr-1.5" />
              Upsell
            </Badge>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">Total em Upsell</p>
            <p className="text-3xl font-bold text-transaction-upsell">{formatUSD(totalUpsell)}</p>
            {exchangeRate && (
              <p className="text-sm text-muted-foreground bg-muted/50 dark:bg-muted/50 px-3 py-1.5 rounded-lg font-medium">
                ≈ {formatBRL(totalUpsell)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Total de Reembolso */}
      <Card className="relative overflow-hidden bg-card shadow-premium dark:bg-gradient-to-br dark:from-destructive/20 dark:via-destructive/10 dark:to-destructive/5 dark:border-0 transition-all duration-500 hover:shadow-elegant hover:scale-[1.02] dark:hover:shadow-premium">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-destructive/5 to-transparent opacity-30 dark:via-white/5 dark:opacity-50" />
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-destructive to-danger-bright shadow-lg">
              <RotateCcw className="h-6 w-6 text-white" />
            </div>
            <Badge variant="outline" className="bg-muted/50 text-destructive border-destructive/30 dark:bg-destructive/10 dark:border-destructive/20 font-medium">
              <RotateCcw className="h-4 w-4 inline mr-1.5" />
              Reembolsos
            </Badge>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">Total de Reembolso</p>
            <p className="text-3xl font-bold text-transaction-refund">{formatUSD(totalReembolso)}</p>
            {exchangeRate && (
              <p className="text-sm text-muted-foreground bg-muted/50 dark:bg-muted/50 px-3 py-1.5 rounded-lg font-medium">
                ≈ {formatBRL(totalReembolso)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};