import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, MousePointer, TrendingDown, ShoppingCart, CheckSquare, Undo2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CampaignCardProps {
  id: string;
  name: string;
  visits: number;
  clicks: number;
  bounceRate: number;
  checkouts: number;
  sales: number;
  refunds: number;
  status?: 'active' | 'paused' | 'draft';
  onClick?: () => void;
  onDelete?: () => void;
}

export function CampaignCard({
  id,
  name,
  visits,
  clicks,
  bounceRate,
  checkouts,
  sales,
  refunds,
  status = 'active',
  onClick,
  onDelete
}: CampaignCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const getStatusStyles = () => {
    // Determinar cor baseada na taxa de fuga
    if (bounceRate < 50) {
      // Verde - saudável (incluindo 0%)
      return {
        borderColor: 'border-t-green-500',
        bgGradient: 'bg-gradient-to-br from-green-500/5 via-transparent to-green-500/5',
        iconBg: 'bg-gradient-to-br from-green-500 to-green-600',
        shadowColor: 'shadow-lg shadow-green-500/10',
        hoverShadow: 'hover:shadow-xl hover:shadow-green-500/20',
        statusBadge: 'bg-green-500/20 text-green-400 border border-green-500/30',
        statusText: 'Saudável',
        cardBorder: 'border-border/50'
      };
    } else if (bounceRate < 75) {
      // Amarelo - atenção
      return {
        borderColor: 'border-t-yellow-500',
        bgGradient: 'bg-gradient-to-br from-yellow-500/5 via-transparent to-yellow-500/5',
        iconBg: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
        shadowColor: 'shadow-lg shadow-yellow-500/10',
        hoverShadow: 'hover:shadow-xl hover:shadow-yellow-500/20',
        statusBadge: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
        statusText: 'Atenção',
        cardBorder: 'border-border/50'
      };
    } else {
      // Vermelho - crítico
      return {
        borderColor: 'border-t-red-500',
        bgGradient: 'bg-gradient-to-br from-red-500/5 via-transparent to-red-500/5',
        iconBg: 'bg-gradient-to-br from-red-500 to-red-600',
        shadowColor: 'shadow-lg shadow-red-500/10',
        hoverShadow: 'hover:shadow-xl hover:shadow-red-500/20',
        statusBadge: 'bg-red-500/20 text-red-400 border border-red-500/30',
        statusText: 'Crítico',
        cardBorder: 'border-border/50'
      };
    }
  };

  const styles = getStatusStyles();

  return (
    <Card 
      className={`
        ${styles.bgGradient} 
        ${styles.borderColor}
        ${styles.cardBorder}
        border-t-4 
        border
        ${styles.shadowColor}
        ${styles.hoverShadow}
        hover:scale-[1.02]
        transition-all duration-300 
        cursor-pointer 
        relative 
        group
        bg-card/95
        backdrop-blur-sm
      `}
      onClick={onClick}
    >
      <CardContent className="p-5">
        {/* Header com nome, status badge e menu */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`p-2.5 rounded-xl ${styles.iconBg} shadow-lg`}>
              <Eye className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base text-foreground truncate mb-1">
                {name}
              </h3>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">
                  {id}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles.statusBadge}`}>
                  {styles.statusText}
                </span>
              </div>
            </div>
          </div>
          
          {/* Menu dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => {
              e.stopPropagation();
            }}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setConfirmOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                <span className="text-red-500">Excluir</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Confirm dialog */}
          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. A campanha "{name}" será excluída permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.();
                    setConfirmOpen(false);
                  }}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Métricas principais em grid */}
        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-background/40 rounded-lg border border-border/50">
          {/* Visitas */}
          <div className="text-center">
            <div className="text-xs text-muted-foreground/80 uppercase mb-1.5 font-medium">Visitas</div>
            <div className="text-2xl font-bold text-foreground">{formatNumber(visits)}</div>
          </div>
          
          {/* Cliques */}
          <div className="text-center">
            <div className="text-xs text-muted-foreground/80 uppercase mb-1.5 font-medium">Cliques</div>
            <div className="text-2xl font-bold text-foreground">{formatNumber(clicks)}</div>
          </div>
          
          {/* Fuga */}
          <div className="text-center">
            <div className="text-xs text-muted-foreground/80 uppercase mb-1.5 font-medium">Fuga</div>
            <div className={`text-2xl font-bold ${
              bounceRate < 50 ? 'text-green-400' :
              bounceRate < 75 ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {bounceRate.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Métricas secundárias */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/30">
          {/* Checkout */}
          <div className="text-center">
            <div className="text-xs text-muted-foreground/80 uppercase mb-1.5 font-medium">Checkout</div>
            <div className="text-lg font-bold text-foreground">{formatNumber(checkouts)}</div>
          </div>
          
          {/* Vendas */}
          <div className="text-center">
            <div className="text-xs text-muted-foreground/80 uppercase mb-1.5 font-medium">Vendas</div>
            <div className="text-lg font-bold text-green-400">{formatNumber(sales)}</div>
          </div>
          
          {/* Reembolso */}
          <div className="text-center">
            <div className="text-xs text-muted-foreground/80 uppercase mb-1.5 font-medium">Reembolso</div>
            <div className="text-lg font-bold text-orange-400">{formatNumber(refunds)}</div>
          </div>
        </div>

        {/* Indicador "Ver Mais" */}
        <div className="mt-4 pt-4 border-t border-border/30 text-center">
          <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors font-medium flex items-center justify-center gap-1">
            <Eye className="h-3 w-3" />
            Ver Detalhes
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default CampaignCard;
