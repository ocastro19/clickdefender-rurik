import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, MousePointer, TrendingDown, ShoppingCart, Globe, Target, CheckSquare, Trash2, Undo2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
interface PresellMetrics {
  id: string;
  name: string;
  visits: number;
  clicks: number;
  bounceRate: number;
  sales: number;
  checkouts?: number;
  refunds?: number;
  domain?: string;
  salesGoal?: number;
  checkoutGoal?: number;
  order?: number;
}
interface PresellAnalysisCardProps {
  presell: PresellMetrics;
  onPresellClick?: (presell: PresellMetrics) => void;
  onDomainClick?: (presell: PresellMetrics) => void;
  onSalesGoalClick?: (presell: PresellMetrics) => void;
  onCheckoutGoalClick?: (presell: PresellMetrics) => void;
  onDeleteClick?: (presell: PresellMetrics) => void;
}
export function PresellAnalysisCard({
  presell,
  onPresellClick,
  onDomainClick,
  onSalesGoalClick,
  onCheckoutGoalClick,
  onDeleteClick
}: PresellAnalysisCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };
  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };
  return <Card className="bg-card shadow-premium transition-all duration-500 hover:shadow-elegant hover:scale-[1.01] cursor-pointer dark:bg-gradient-to-br dark:from-background dark:to-muted/50 dark:border-border/50">
      <CardContent className="p-4">
        {/* Layout Horizontal Compacto - Clicável */}
        <div className="flex items-center justify-between mb-3 hover:bg-muted/10 rounded-lg p-2 -m-2" onClick={() => onPresellClick?.(presell)}>
          {/* Número e Nome do Produto */}
          <div className="flex-shrink-0 min-w-0 mr-6">
            <h3 className="text-lg font-semibold text-foreground truncate">
              {presell.order || presell.id} {presell.name}
            </h3>
          </div>

          {/* Métricas Bem Distribuídas - 6 colunas */}
          <div className="flex-1 grid grid-cols-6 gap-2 max-w-3xl px-0 mx-auto">
            {/* Visitas */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-1">
                <Eye className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-sm font-bold text-blue-500">
                {formatNumber(presell.visits)}
              </div>
              <div className="text-xs text-muted-foreground">
                Visitas
              </div>
            </div>

            {/* Cliques */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-1">
                <MousePointer className="h-4 w-4 text-blue-400" />
              </div>
              <div className="text-sm font-bold text-blue-400">
                {formatNumber(presell.clicks)}
              </div>
              <div className="text-xs text-muted-foreground">
                Cliques
              </div>
            </div>

            {/* Fuga */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-1">
                <TrendingDown className="h-4 w-4 text-red-500" />
              </div>
              <div className="text-sm font-bold text-red-500">
                {formatPercentage(presell.bounceRate)}
              </div>
              <div className="text-xs text-muted-foreground">
                Fuga
              </div>
            </div>

            {/* Checkout */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-1">
                <CheckSquare className="h-4 w-4 text-primary" />
              </div>
              <div className="text-sm font-bold text-primary">
                {formatNumber(presell.checkouts || 0)}
              </div>
              <div className="text-xs text-muted-foreground">
                Checkout
              </div>
            </div>

            {/* Vendas */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-1">
                <ShoppingCart className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-sm font-bold text-green-500">
                {formatNumber(presell.sales)}
              </div>
              <div className="text-xs text-muted-foreground">
                Vendas
              </div>
            </div>

            {/* Reembolso */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-1">
                <Undo2 className="h-4 w-4 text-orange-500" />
              </div>
              <div className="text-sm font-bold text-orange-500">
                {formatNumber(presell.refunds || 0)}
              </div>
              <div className="text-xs text-muted-foreground">
                Reembolso
              </div>
            </div>
          </div>
        </div>

        {/* Botões Compactos */}
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={() => onDomainClick?.(presell)} className="flex-1 text-xs py-1 h-7">
            <Globe className="h-3 w-3 mr-1" />
            Domínio
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => onSalesGoalClick?.(presell)} className="flex-1 text-xs py-1 h-7">
            <Target className="h-3 w-3 mr-1" />
            Meta de Conversão
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => onCheckoutGoalClick?.(presell)} className="flex-1 text-xs py-1 h-7">
            <CheckSquare className="h-3 w-3 mr-1" />
            Meta de Checkout
          </Button>

          {/* Botão de Excluir */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs py-1 h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-50">
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. A presell "{presell.name}" será excluída permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDeleteClick?.(presell)}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>;
}
export default PresellAnalysisCard;