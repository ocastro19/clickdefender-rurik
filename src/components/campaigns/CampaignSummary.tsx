import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Target, MousePointer, Eye, DollarSign, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useGlobalCurrencyFormatter } from '@/hooks/useGlobalCurrencyFormatter';

interface CampaignSummaryProps {
  totals: {
    custo: number;
    impressoes: number;
    cliques: number;
    conversoes: number;
    valorConversoes: number;
    ctr: number;
    cpc: number;
    roas: number;
  };
}

export default function CampaignSummary({ totals }: CampaignSummaryProps) {
  const { t } = useTranslation();
  const { formatGlobalCurrency } = useGlobalCurrencyFormatter();
  
  const metrics = [
    {
      icon: DollarSign,
      label: t('campaignTable.totalInvestment'),
      value: formatGlobalCurrency(totals.custo),
      color: 'primary',
      description: t('campaignTable.totalInvested')
    },
    {
      icon: Eye,
      label: t('campaignTable.impressions'),
      value: new Intl.NumberFormat('pt-BR').format(totals.impressoes),
      color: 'info',
      description: t('campaignTable.adViews')
    },
    {
      icon: MousePointer,
      label: t('campaignTable.clicks'),
      value: new Intl.NumberFormat('pt-BR').format(totals.cliques),
      color: 'purple',
      description: t('campaignTable.adClicks')
    },
    {
      icon: Target,
      label: t('campaignTable.averageCTR'),
      value: `${totals.ctr.toFixed(2)}%`,
      color: 'warning',
      description: t('campaignTable.averageClickRate')
    },
    {
      icon: Zap,
      label: t('campaignTable.conversions'),
      value: new Intl.NumberFormat('pt-BR').format(totals.conversoes),
      color: 'success',
      description: t('campaignTable.totalConversions')
    },
    {
      icon: TrendingUp,
      label: t('campaignTable.averageROAS'),
      value: `${totals.roas.toFixed(2)}x`,
      color: 'cyan',
      description: t('campaignTable.returnOnInvestment')
    }
  ];

  return (
    <Card className="border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/5 shadow-premium">
      <CardContent className="p-8">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-foreground mb-2">{t('campaignTable.generalSummary')}</h3>
          <p className="text-muted-foreground">{t('campaignTable.consolidatedView')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div 
                key={metric.label}
                className="group relative p-6 rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/20 hover:from-background hover:to-muted/30 transition-all duration-300 hover:shadow-card hover:scale-105"
              >
                {/* Ícone com gradiente */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${metric.color} to-${metric.color}/70 flex items-center justify-center mb-4 shadow-premium group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                {/* Valor principal */}
                <div className="mb-2">
                  <p className={`text-3xl font-bold text-${metric.color} group-hover:text-${metric.color}/90 transition-colors duration-300`}>
                    {metric.value}
                  </p>
                </div>
                
                {/* Label e descrição */}
                <div>
                  <p className="font-medium text-foreground mb-1">{metric.label}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{metric.description}</p>
                </div>

                {/* Efeito de brilho no hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Indicadores de performance */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-success to-success/70"></div>
              <span className="text-muted-foreground">{t('campaignTable.excellentPerformance')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-warning to-warning/70"></div>
              <span className="text-muted-foreground">{t('campaignTable.needsOptimization')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-danger to-danger/70"></div>
              <span className="text-muted-foreground">{t('campaignTable.requiresAttention')}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}