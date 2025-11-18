import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, MousePointer, DollarSign, TrendingUp, TrendingDown, Activity, Target, CheckCircle2, Copy, ExternalLink, Calendar, Star, Shield, AlertTriangle, ChevronUp, ChevronDown, BarChart3, Sparkles, Globe, ArrowUpRight, Timer, Award, Bolt, FileText, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
interface PresellData {
  id: number;
  name: string;
  type: string;
  visitas: number;
  cliques: number;
  taxaFuga: string;
  checkouts: number;
  vendas: number;
  reembolsos: number;
  status?: 'active' | 'paused' | 'draft';
}
interface PresellDetails {
  publicadoEm: string;
  paises: string;
  dominio: string;
  metaVenda: string;
  metaCheckout: string;
  script: string;
  palavrasChave: string;
}
interface CompactPresellDashboardProps {
  presells: PresellData[];
  presellDetails: Record<string, PresellDetails>;
  selectedPresell: string | null;
  onPresellSelect: (presellName: string) => void;
}
const CompactPresellDashboard: React.FC<CompactPresellDashboardProps> = ({
  presells,
  presellDetails,
  selectedPresell,
  onPresellSelect
}) => {
  const {
    t
  } = useTranslation();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const {
    toast
  } = useToast();
  const toggleRowExpansion = (presellName: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(presellName)) {
      newExpanded.delete(presellName);
    } else {
      newExpanded.add(presellName);
    }
    setExpandedRows(newExpanded);
    onPresellSelect(presellName);
  };
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          badge: 'bg-gradient-to-r from-success/20 to-success-bright/20 text-success border-success/40 shadow-[0_0_8px_hsl(var(--success)/0.3)]',
          icon: Bolt,
          label: 'Ativo'
        };
      case 'paused':
        return {
          badge: 'bg-gradient-to-r from-warning/20 to-warning-bright/20 text-warning border-warning/40 shadow-[0_0_8px_hsl(var(--warning)/0.3)]',
          icon: Timer,
          label: 'Pausado'
        };
      case 'draft':
        return {
          badge: 'bg-gradient-to-r from-muted/20 to-muted/30 text-muted-foreground border-muted/40',
          icon: FileText,
          label: 'Rascunho'
        };
      default:
        return {
          badge: 'bg-gradient-to-r from-muted/20 to-muted/30 text-muted-foreground border-muted/40',
          icon: FileText,
          label: 'Inativo'
        };
    }
  };
  const getPerformanceConfig = (visitas: number, cliques: number, vendas: number) => {
    const ctr = visitas > 0 ? cliques / visitas * 100 : 0;
    const conversion = cliques > 0 ? vendas / cliques * 100 : 0;
    if (ctr > 10 && conversion > 5) {
      return {
        color: 'text-success',
        bgGradient: 'from-success/20 via-success-bright/15 to-transparent',
        icon: Award,
        label: 'Elite',
        glow: 'shadow-[0_0_20px_hsl(var(--success)/0.4)]',
        ring: 'ring-2 ring-success/30'
      };
    }
    if (ctr > 5 && conversion > 2) {
      return {
        color: 'text-info',
        bgGradient: 'from-info/20 via-info-bright/15 to-transparent',
        icon: TrendingUp,
        label: 'Excepcional',
        glow: 'shadow-[0_0_15px_hsl(var(--info)/0.3)]',
        ring: 'ring-2 ring-info/30'
      };
    }
    if (ctr > 2 || conversion > 1) {
      return {
        color: 'text-warning',
        bgGradient: 'from-warning/20 via-warning-bright/15 to-transparent',
        icon: Activity,
        label: 'Promissor',
        glow: 'shadow-[0_0_10px_hsl(var(--warning)/0.3)]',
        ring: 'ring-1 ring-warning/30'
      };
    }
    return {
      color: 'text-danger',
      bgGradient: 'from-danger/20 via-danger-bright/15 to-transparent',
      icon: AlertTriangle,
      label: 'Crítico',
      glow: 'shadow-[0_0_10px_hsl(var(--danger)/0.3)]',
      ring: 'ring-1 ring-danger/30'
    };
  };

  const getFugaColor = (taxaFuga: string) => {
    const percentage = parseFloat(taxaFuga.replace('%', ''));
    if (percentage >= 0 && percentage <= 30) return 'text-green-600';
    if (percentage >= 31 && percentage <= 50) return 'text-yellow-600';
    if (percentage >= 51 && percentage <= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const getFugaBgColor = (taxaFuga: string) => {
    const percentage = parseFloat(taxaFuga.replace('%', ''));
    if (percentage >= 0 && percentage <= 30) return 'from-green-500/20 to-green-600/20';
    if (percentage >= 31 && percentage <= 50) return 'from-yellow-500/20 to-yellow-600/20';
    if (percentage >= 51 && percentage <= 70) return 'from-orange-500/20 to-orange-600/20';
    return 'from-red-500/20 to-red-600/20';
  };
  return <div className="h-full flex flex-col">
      <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.25)] h-full flex flex-col">
        {/* Header Premium */}
        <div className="relative p-6 border-b border-border/30 bg-gradient-to-r from-background/80 to-background/60">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-muted/30 border border-border/50 shadow-sm">
                <BarChart3 className="h-6 w-6 text-foreground/80" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">Análise de Presell</h2>
                <p className="text-sm text-muted-foreground">Dashboard de Performance</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-primary/40 shadow-[0_0_10px_hsl(var(--primary)/0.3)]">
                <Sparkles className="w-3 h-3 mr-1" />
                {presells.length} Presells
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Scroll Area Premium */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-4">
              {presells.map(presell => {
              const isExpanded = expandedRows.has(presell.name);
              const isSelected = selectedPresell === presell.name;
              const performance = getPerformanceConfig(presell.visitas, presell.cliques, presell.vendas);
              const statusConfig = getStatusConfig(presell.status || 'active');
              const ctr = presell.visitas > 0 ? presell.cliques / presell.visitas * 100 : 0;
              const conversionRate = presell.cliques > 0 ? presell.vendas / presell.cliques * 100 : 0;
              const details = presellDetails[presell.name];
              return <div key={presell.id} className={`
                      group relative overflow-hidden rounded-2xl border transition-all duration-500 cursor-pointer transform
                      ${isSelected ? `border-primary/60 bg-gradient-to-br ${performance.bgGradient} ${performance.glow} ${performance.ring} scale-[1.02]` : isExpanded ? `border-primary/40 bg-gradient-to-br from-primary/10 via-transparent to-transparent shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.2)] hover:scale-[1.01]` : 'border-border/50 bg-gradient-to-br from-card/60 to-card/30 hover:border-border/80 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.1)] hover:scale-[1.005]'}
                    `} onClick={() => toggleRowExpansion(presell.name)}>
                    {/* Presell Card Premium */}
                    <div className="p-5">
                      <div className="flex items-center justify-between gap-4">
                          {/* Avatar & Info Section */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          {/* Número da Presell */}
                          <div className="flex-shrink-0 w-8 h-8 bg-muted/50 rounded-lg flex items-center justify-center border border-border/50">
                            <span className="text-xs font-semibold text-muted-foreground">{presells.indexOf(presell) + 1}</span>
                          </div>
                          
                          {/* Info Premium */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                              <h3 className="font-bold text-lg text-foreground truncate">{presells.indexOf(presell) + 1}. {presell.name}</h3>
                              <div className="flex items-center gap-2">
                                {/* Status Badge Premium */}
                                <TooltipProvider>
                                  <UITooltip>
                                    <TooltipTrigger asChild>
                                      
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Status do Presell</p>
                                    </TooltipContent>
                                  </UITooltip>
                                </TooltipProvider>
                                
                                {/* Performance Badge Premium */}
                                <TooltipProvider>
                                  <UITooltip>
                                    <TooltipTrigger asChild>
                                      
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <div className="text-center">
                                        <p className="font-medium">{performance.label}</p>
                                        <p className="text-xs opacity-80">CTR: {formatPercentage(ctr)} | Conv: {formatPercentage(conversionRate)}</p>
                                      </div>
                                    </TooltipContent>
                                  </UITooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                           
                            {/* Métricas Premium Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                              {/* Visitas */}
                              <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-background/60 to-background/30 border border-border/30">
                                <div className="p-1.5 rounded-md bg-gradient-to-r from-blue-500/20 to-blue-600/20">
                                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs text-muted-foreground font-medium">Visitas</p>
                                  <p className="font-bold text-sm text-foreground">{formatNumber(presell.visitas)}</p>
                                </div>
                              </div>
                              
                               {/* Cliques */}
                               <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-background/60 to-background/30 border border-border/30">
                                 <div className="p-1.5 rounded-md bg-gradient-to-r from-blue-500/20 to-blue-600/20">
                                   <MousePointer className="w-3.5 h-3.5 text-blue-600" />
                                 </div>
                                 <div className="min-w-0">
                                   <p className="text-xs text-muted-foreground font-medium">Cliques</p>
                                   <p className="font-bold text-sm text-blue-600">{formatNumber(presell.cliques)}</p>
                                 </div>
                               </div>
                               
                               {/* Taxa de Fuga */}
                               <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-background/60 to-background/30 border border-border/30">
                                 <div className={`p-1.5 rounded-md bg-gradient-to-r ${getFugaBgColor(presell.taxaFuga)}`}>
                                   <AlertTriangle className={`w-3.5 h-3.5 ${getFugaColor(presell.taxaFuga)}`} />
                                 </div>
                                 <div className="min-w-0">
                                   <p className="text-xs text-muted-foreground font-medium">Fuga</p>
                                   <p className={`font-bold text-sm ${getFugaColor(presell.taxaFuga)}`}>{presell.taxaFuga}</p>
                                 </div>
                               </div>
                               
                               {/* Vendas */}
                               <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-background/60 to-background/30 border border-border/30">
                                 <div className="p-1.5 rounded-md bg-gradient-to-r from-green-500/20 to-green-600/20">
                                   <DollarSign className="w-3.5 h-3.5 text-green-600" />
                                 </div>
                                 <div className="min-w-0">
                                   <p className="text-xs text-muted-foreground font-medium">Vendas</p>
                                   <p className="font-bold text-sm text-green-600">{formatNumber(presell.vendas)}</p>
                                 </div>
                               </div>
                            </div>
                          </div>
                        </div>

                        {/* Expand Icon Premium */}
                        <div className="flex-shrink-0">
                          <div className={`p-2 rounded-xl transition-all duration-300 ${isExpanded ? 'bg-primary/20 text-primary' : 'bg-background/60 text-muted-foreground group-hover:bg-background/80'}`}>
                            {isExpanded ? <ChevronUp className="w-5 h-5 transition-transform duration-300" /> : <ChevronDown className="w-5 h-5 transition-transform duration-300" />}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details Premium */}
                    {isExpanded && details && <div className="border-t border-border/40 bg-gradient-to-r from-background/60 via-background/40 to-background/60 backdrop-blur-sm p-5 animate-accordion-down">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Publicação */}
                          <div className="p-4 rounded-xl bg-gradient-to-br from-card/80 to-card/40 border border-border/30">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500/20 to-blue-600/20">
                                <Calendar className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Publicação</span>
                            </div>
                            <p className="text-foreground font-medium">{details.publicadoEm}</p>
                          </div>
                          
                          {/* Domínio */}
                          <div className="p-4 rounded-xl bg-gradient-to-br from-card/80 to-card/40 border border-border/30">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="p-1.5 rounded-lg bg-gradient-to-r from-green-500/20 to-green-600/20">
                                <Globe className="w-4 h-4 text-green-600" />
                              </div>
                              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Domínio</span>
                            </div>
                            <TooltipProvider>
                              <UITooltip>
                                <TooltipTrigger asChild>
                                  <p className="text-primary cursor-pointer hover:text-primary/80 transition-colors font-medium truncate flex items-center gap-1" onClick={e => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(details.dominio);
                              toast({
                                title: "✓ Copiado!",
                                description: "Domínio copiado para área de transferência",
                                duration: 2000
                              });
                            }}>
                                    {details.dominio}
                                    <Copy className="w-3 h-3 opacity-60" />
                                  </p>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Clique para copiar domínio</p>
                                </TooltipContent>
                              </UITooltip>
                            </TooltipProvider>
                          </div>
                          
                          {/* Palavras-chave */}
                          <div className="p-4 rounded-xl bg-gradient-to-br from-card/80 to-card/40 border border-border/30">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-purple-600/20">
                                <Star className="w-4 h-4 text-purple-600" />
                              </div>
                              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Keywords</span>
                            </div>
                            <p className="text-foreground font-medium">{details.palavrasChave}</p>
                          </div>
                        </div>
                      </div>}
                  </div>;
            })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>;
};
export default CompactPresellDashboard;