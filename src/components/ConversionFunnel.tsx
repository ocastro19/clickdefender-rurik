import React from "react";
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Campaign } from "@/contexts/CampaignContext";
import { convertCurrencyForDashboard } from "@/contexts/DashboardCurrencyContext";

interface ConversionFunnelProps {
  campaigns: Campaign[];
  selectedCampaign: string;
  onCampaignChange: (value: string) => void;
  dashboardCurrency: 'BRL' | 'USD';
  exchangeRate?: number | null;
}

interface FunnelStage {
  name: string;
  value: number;
  cost: number;
  percentage?: number;
}

export const ConversionFunnel: React.FC<ConversionFunnelProps> = ({
  campaigns,
  selectedCampaign,
  onCampaignChange,
  dashboardCurrency,
  exchangeRate
}) => {
  const { t } = useTranslation();
  // Filtrar campanhas
  const filteredCampaigns = selectedCampaign === 'all' 
    ? campaigns 
    : campaigns.filter(c => c.id === selectedCampaign);

  // Calcular métricas do funil
  const calculateFunnelData = (): FunnelStage[] => {
    if (filteredCampaigns.length === 0) {
      return [
        { name: t('conversionFunnel.impressions'), value: 0, cost: 0 },
        { name: t('conversionFunnel.clicks'), value: 0, cost: 0 },
        { name: t('conversionFunnel.checkouts'), value: 0, cost: 0 },
        { name: t('conversionFunnel.conversions'), value: 0, cost: 0 }
      ];
    }

    const totalImpressoes = filteredCampaigns.reduce((sum, c) => sum + (c.impressoes || 0), 0);
    const totalCliques = filteredCampaigns.reduce((sum, c) => sum + (c.cliques || 0), 0);
    const totalCheckouts = filteredCampaigns.reduce((sum, c) => sum + (c.checkouts || 0), 0);
    const totalConversoes = filteredCampaigns.reduce((sum, c) => sum + (c.conversoes || 0), 0);
    
    // Calcular custos convertidos
    const totalCusto = filteredCampaigns.reduce((sum, c) => {
      const convertedCost = convertCurrencyForDashboard(
        c.custo || 0, 
        c.currency || 'USD', 
        dashboardCurrency, 
        exchangeRate
      );
      return sum + convertedCost;
    }, 0);

    // Distribuir custo proporcionalmente (simplidicado)
    const custoImpressoes = totalImpressoes > 0 ? totalCusto * 0.1 : 0;
    const custoCliques = totalCliques > 0 ? totalCusto * 0.3 : 0;
    const custoCheckouts = totalCheckouts > 0 ? totalCusto * 0.3 : 0;
    const custoConversoes = totalConversoes > 0 ? totalCusto * 0.3 : 0;

    return [
      { 
        name: t('conversionFunnel.impressions'), 
        value: totalImpressoes, 
        cost: custoImpressoes 
      },
      { 
        name: t('conversionFunnel.clicks'), 
        value: totalCliques, 
        cost: custoCliques,
        percentage: totalImpressoes > 0 ? (totalCliques / totalImpressoes) * 100 : 0
      },
      { 
        name: t('conversionFunnel.checkouts'), 
        value: totalCheckouts, 
        cost: custoCheckouts,
        percentage: totalCliques > 0 ? (totalCheckouts / totalCliques) * 100 : 0
      },
      { 
        name: t('conversionFunnel.conversions'), 
        value: totalConversoes, 
        cost: custoConversoes,
        percentage: totalCheckouts > 0 ? (totalConversoes / totalCheckouts) * 100 : 0
      }
    ];
  };

  const funnelData = calculateFunnelData();
  const totalInvestido = funnelData.reduce((sum, stage) => sum + stage.cost, 0);

  const formatCurrency = (value: number) => {
    const locale = dashboardCurrency === 'BRL' ? 'pt-BR' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: dashboardCurrency
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const getStageWidth = (index: number) => {
    const maxValue = Math.max(...funnelData.map(stage => stage.value));
    if (maxValue === 0) return 'w-full';
    
    // Criar efeito de funil real - cada etapa é menor que a anterior
    const baseWidth = 100 - (index * 15); // Reduz 15% a cada etapa
    const minWidth = 40; // Largura mínima
    const finalWidth = Math.max(baseWidth, minWidth);
    
    return `w-[${finalWidth}%]`;
  };

  const getStageColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-blue-600', 
      'bg-blue-700',
      'bg-blue-800'
    ];
    return colors[index] || 'bg-blue-500';
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3 sm:pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle className="text-lg sm:text-xl">{t('conversionFunnel.title')}</CardTitle>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{t('conversionFunnel.exportPDF')}</span>
            <span className="sm:hidden">PDF</span>
          </Button>
        </div>
        
        {/* Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium text-muted-foreground">{t('conversionFunnel.campaign')}</label>
            <Select value={selectedCampaign} onValueChange={onCampaignChange}>
              <SelectTrigger>
                <SelectValue placeholder={t('conversionFunnel.allCampaigns')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('conversionFunnel.allCampaigns')}</SelectItem>
                {campaigns.map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    <span className="truncate">{campaign.campanha}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium text-muted-foreground">{t('conversionFunnel.top')}</label>
            <Select defaultValue="impressoes">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="impressoes">{t('conversionFunnel.impressions')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium text-muted-foreground">{t('conversionFunnel.middle')}</label>
            <Select defaultValue="cliques">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cliques">{t('conversionFunnel.clicks')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium text-muted-foreground">{t('conversionFunnel.bottom')}</label>
            <Select defaultValue="conversoes">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conversoes">{t('conversionFunnel.conversions')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-6">
        {/* Valor Investido */}
        <div className="mb-4 text-center">
          <div className="inline-block bg-primary text-primary-foreground px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm">
            <span className="font-medium">{t('conversionFunnel.valueInvested')}: {formatCurrency(totalInvestido)}</span>
          </div>
        </div>

        {/* Funil Visual */}
        <div className="space-y-1 sm:space-y-2 max-w-xs sm:max-w-md lg:max-w-2xl mx-auto">
          {funnelData.map((stage, index) => (
            <div key={stage.name} className="flex flex-col items-center">
              {/* Barra do Funil com formato real */}
              <div 
                className="relative transition-all duration-300 hover:scale-105 w-full"
                style={{
                  width: `${100 - (index * 10)}%`,
                  minWidth: '50%',
                  maxWidth: '100%'
                }}
              >
                <div 
                  className={`${getStageColor(index)} text-white text-center relative overflow-hidden`}
                  style={{
                    clipPath: index === 0 
                      ? 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)' 
                      : index === funnelData.length - 1
                      ? 'polygon(10% 0, 90% 0, 85% 100%, 15% 100%)'
                      : `polygon(${5 + (index * 2)}% 0, ${95 - (index * 2)}% 0, ${90 - (index * 2)}% 100%, ${10 + (index * 2)}% 100%)`,
                    padding: '0.75rem 1rem',
                    minHeight: '60px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <div className="text-xs sm:text-sm font-medium mb-1">{stage.name}</div>
                  <div className="text-sm sm:text-lg md:text-xl font-bold">{formatNumber(stage.value)}</div>
                  <div className="text-xs opacity-90 mt-0.5 sm:mt-1">{formatCurrency(stage.cost)}</div>
                  
                  {/* Efeito de brilho */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              {/* Taxa de Conversão entre etapas */}
              {index < funnelData.length - 1 && stage.percentage !== undefined && (
                <div className="mt-1 sm:mt-2 mb-0.5 sm:mb-1 text-center">
                  <div className="text-xs font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded-full border">
                    ↓ {stage.percentage.toFixed(1)}% {t('conversionFunnel.conversion')}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};