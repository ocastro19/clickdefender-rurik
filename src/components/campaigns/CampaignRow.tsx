import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Trash2, Info, Settings, Target, Edit, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tooltip as TooltipUI, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Campaign } from '@/contexts/CampaignContext';
import { useGlobalCurrencyFormatter } from '@/hooks/useGlobalCurrencyFormatter';
import { useIndividualCampaignMetrics } from '@/hooks/useIndividualCampaignMetrics';
import { getMetricsConfig } from '@/utils/metricsConfig';
import { useTranslation } from 'react-i18next';
import IndividualColumnCustomizationModal from '@/components/IndividualColumnCustomizationModal';
import { useCampaigns } from '@/contexts/CampaignContext';
import CampaignPresellInfo from './CampaignPresellInfo';

interface CampaignRowProps {
  campaign: Campaign;
  isPinned: boolean;
  isFocused: boolean;
  isHighlighted: boolean;
  onPin: (campaignId: string) => void;
  onFocus: (campaignId: string) => void;
  onEdit?: (campaign: Campaign) => void;
  onDelete?: (campaignId: string) => void;
}

export default function CampaignRow({
  campaign,
  isPinned,
  isFocused,
  isHighlighted,
  onPin,
  onFocus,
  onEdit,
  onDelete
}: CampaignRowProps) {
  const { t } = useTranslation();
  const metricsConfig = getMetricsConfig(t);
  const { formatGlobalCurrency } = useGlobalCurrencyFormatter();
  const { getMetricsForCampaign, setMetricsForCampaign } = useIndividualCampaignMetrics();
  const { updateCampaign } = useCampaigns();
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  
  // Get selected metrics for this campaign
  const selectedMetrics = getMetricsForCampaign(campaign.id);

  // Handle metrics customization
  const handleMetricsChange = (newMetrics: string[]) => {
    setMetricsForCampaign(campaign.id, newMetrics);
  };

  // Handle campaign active/inactive toggle
  const handleToggleActive = (checked: boolean) => {
    updateCampaign(campaign.id, 'isActive', checked);
  };

  // Helper function to format metric values
  const formatMetricValue = (metricKey: string, value: any): string => {
    if (value === undefined || value === null) return 'N/A';
    
    const config = metricsConfig[metricKey];
    if (!config) return String(value);

    switch (metricKey) {
      case 'orcamento':
      case 'custo':
      case 'faturamento':
      case 'valorConversao':
      case 'comissao':
      case 'cpcMedio':
      case 'cpcMaximo':
      case 'cpvMedio':
      case 'lucro':
        return formatGlobalCurrency(Number(value), campaign.currency || 'USD');
      
      case 'ctr':
      case 'roi':
      case 'taxaConversao':
      case 'vtr':
      case 'parcelaImpressaoRedeSearch':
      case 'isParteSuperiorPesquisa':
      case 'isPrimeiraPosicaoPesquisa':
      case 'parcelaImpressaoPerdidaOrcamento':
      case 'parcelaImpressaoPerdidaClassificacao':
      case 'pontuacaoOtimizacao':
        return `${Number(value).toFixed(2)}%`;
      
      case 'roas':
        return `${Number(value).toFixed(2)}x`;
      
      case 'impressoes':
      case 'cliques':
      case 'conversoes':
      case 'cliquesInvalidos':
      case 'visitors':
      case 'checkouts':
      case 'visualizacoes':
        return new Intl.NumberFormat('pt-BR').format(Number(value));
      
      case 'cpm':
        return formatGlobalCurrency(Number(value), campaign.currency || 'USD');
      
      default:
        return String(value);
    }
  };

  // Helper function to get metric value with calculations
  const getMetricValue = (metricKey: string): any => {
    switch (metricKey) {
      case 'ctr':
        return campaign.impressoes ? ((campaign.cliques || 0) / campaign.impressoes * 100) : 0;
      case 'roas':
        return campaign.custo ? (campaign.faturamento || 0) / campaign.custo : 0;
      case 'roi':
        return campaign.custo ? ((campaign.faturamento || 0) - campaign.custo) / campaign.custo * 100 : 0;
      case 'custoConversao':
        return campaign.conversoes ? (campaign.custo || 0) / campaign.conversoes : 0;
      case 'taxaConversao':
        return campaign.cliques ? (campaign.conversoes || 0) / campaign.cliques * 100 : 0;
      case 'cpm':
        return campaign.impressoes ? (campaign.custo || 0) / campaign.impressoes * 1000 : 0;
      case 'lucro':
        return (campaign.faturamento || 0) - (campaign.custo || 0);
      default:
        return campaign[metricKey as keyof Campaign];
    }
  };

  // Function to render a metric card
  const renderMetric = (metricKey: string) => {
    const config = metricsConfig[metricKey];
    if (!config) return null;

    const value = getMetricValue(metricKey);
    const formattedValue = formatMetricValue(metricKey, value);

    return (
      <div key={metricKey} className="space-y-1">
        <div className="flex items-center gap-1">
          <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
            {config.displayName}
          </p>
          <TooltipProvider>
            <TooltipUI>
              <TooltipTrigger asChild>
                <Info className="h-2.5 w-2.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="z-[99999] fixed">
                <p className="max-w-xs text-xs">{config.tooltip}</p>
              </TooltipContent>
            </TooltipUI>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-1">
          <span className={`font-bold text-sm sm:text-base ${
            metricKey === 'faturamento' || metricKey === 'lucro' ? 'text-success' :
            metricKey === 'custo' ? 'text-primary' :
            'text-foreground'
          }`}>
            {formattedValue}
          </span>
          {/* Add trend indicators for CTR */}
          {metricKey === 'ctr' && typeof value === 'number' && (
            <>
              {value > 5 ? (
                <TrendingUp className="w-4 h-4 text-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-danger" />
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="group relative">
      {/* Linha principal da campanha */}
      <div 
        className={`
          relative overflow-hidden rounded-lg border transition-all duration-300 
          ${isFocused 
            ? 'border-primary/50 bg-gradient-to-r from-primary/10 to-transparent shadow-glow' 
            : isHighlighted
              ? 'border-border/40 bg-gradient-to-r from-accent/5 to-transparent'
              : isPinned
                ? 'border-primary/30 bg-gradient-to-r from-primary/5 to-transparent'
                : 'border-border bg-card hover:border-border/60 hover:shadow-card'
          }
        `}
      >
        {/* Barra de status lateral */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${
          isFocused ? 'bg-gradient-to-b from-primary to-primary/50' :
          isPinned ? 'bg-gradient-to-b from-primary/70 to-primary/30' :
          'bg-transparent group-hover:bg-gradient-to-b group-hover:from-primary/50 group-hover:to-primary/20'
        }`} />

        <div className="p-2 sm:p-3">
          {/* Header da campanha */}
          <div className="flex flex-col sm:flex-row items-start justify-between mb-3 gap-2">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Ícone do objetivo */}
              <div className="relative flex-shrink-0">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-premium">
                  <Search className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
                </div>
                {isPinned && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-warning text-warning-foreground text-xs flex items-center justify-center">
                    <Target className="h-2 w-2" />
                  </div>
                )}
              </div>

               {/* Info da campanha */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                    <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
                      {campaign.campanha}
                    </h3>
                   <div className="flex items-center gap-2 flex-wrap">
                     <Badge variant="outline" className="text-xs flex-shrink-0">
                       {formatDate(campaign.data)}
                     </Badge>
                     
                     {/* Toggle Ativo/Pausado */}
                     <div className="flex items-center gap-2">
                       <TooltipProvider>
                         <TooltipUI>
                           <TooltipTrigger asChild>
                             <div className="flex items-center gap-2">
                               <Switch
                                 checked={campaign.isActive ?? true}
                                 onCheckedChange={handleToggleActive}
                                 className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/20"
                               />
                               <span className={`text-xs font-medium ${
                                 campaign.isActive ?? true 
                                   ? 'text-primary' 
                                   : 'text-muted-foreground'
                               }`}>
                                 {campaign.isActive ?? true ? t('campaigns.activeStatus') : t('campaigns.pausedStatus')}
                               </span>
                             </div>
                           </TooltipTrigger>
                           <TooltipContent className="z-[99999] fixed">
                              <p>
                                {campaign.isActive ?? true 
                                  ? t('campaigns.activeCampaign')
                                  : t('campaigns.pausedCampaign')
                                }
                              </p>
                           </TooltipContent>
                         </TooltipUI>
                       </TooltipProvider>
                     </div>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                   <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm text-muted-foreground">{t('campaigns.strategy')}:</span>
                      <Badge variant="secondary" className="text-xs">
                        {t('campaigns.strategyMaximizeConversions')}
                      </Badge>
                   </div>
                 </div>
               </div>
             </div>

             {/* Ações da campanha */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                  isPinned ? 'bg-warning/20 text-warning' : 'bg-muted hover:bg-muted/80'
                }`}
                onClick={() => onPin(campaign.id)}
                title={t('campaigns.pinCampaign')}
              >
                <Target className="h-4 w-4" />
              </button>
              <button
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-all duration-200 hover:scale-110"
                onClick={() => setIsCustomizationModalOpen(true)}
                title={t('campaigns.customizeMetrics')}
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-all duration-200 hover:scale-110"
                onClick={() => onEdit?.(campaign)}
                title={t('campaigns.editCampaign')}
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-all duration-200 hover:scale-110"
                title={t('campaigns.addNote')}
              >
                <FileText className="w-4 h-4" />
              </button>
              <button
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                  isFocused ? 'bg-primary/20 text-primary' : 'bg-muted hover:bg-muted/80'
                }`}
                onClick={() => onFocus(campaign.id)}
                title={t('campaigns.focusCampaign')}
              >
                <Target className="h-4 w-4" />
              </button>
              {onDelete && (
                <button
                  className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-all duration-200 hover:scale-110"
                  onClick={() => onDelete(campaign.id)}
                  title={t('campaigns.deleteCampaign')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
             </div>
           </div>

           {/* Presell Info: Domínio, Meta de Conversão, Meta de Checkout */}
           <CampaignPresellInfo 
             campaign={campaign} 
             onUpdate={(field, value) => updateCampaign(campaign.id, field, value)}
           />

           {/* Dynamic Metrics */}
           <div className={`grid gap-2 sm:gap-3 ${
             selectedMetrics.length <= 2 ? 'grid-cols-1 sm:grid-cols-2' :
             selectedMetrics.length <= 4 ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4' :
             'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
           }`}>
             {selectedMetrics.map(metricKey => renderMetric(metricKey))}
           </div>
         </div>
       </div>

      {/* Customization Modal */}
      <IndividualColumnCustomizationModal
        campaignName={campaign.campanha}
        selectedMetrics={selectedMetrics}
        onMetricsChange={handleMetricsChange}
        isOpen={isCustomizationModalOpen}
        onOpenChange={setIsCustomizationModalOpen}
      />
    </div>
  );
}