import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Settings, Save, RotateCcw } from 'lucide-react';
import { usePresets, ColumnPreset } from '@/hooks/usePresets';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

interface MetricOption {
  key: string;
  label: string;
  description: string;
  category: 'basico' | 'performance' | 'conversao' | 'custo';
}

export function getAvailableMetrics(t: any): MetricOption[] {
  return [
    // Métricas Básicas
    { key: 'custo', label: t('columnCustomization.metrics.investment'), description: t('columnCustomization.descriptions.investment'), category: 'basico' },
    { key: 'faturamento', label: t('columnCustomization.metrics.revenue'), description: t('columnCustomization.descriptions.revenue'), category: 'basico' },
    { key: 'impressoes', label: t('columnCustomization.metrics.impressions'), description: t('columnCustomization.descriptions.impressions'), category: 'basico' },
    { key: 'cliques', label: t('columnCustomization.metrics.clicks'), description: t('columnCustomization.descriptions.clicks'), category: 'basico' },
    { key: 'orcamento', label: t('columnCustomization.metrics.budget'), description: t('columnCustomization.descriptions.budget'), category: 'basico' },
    
    // Métricas de Performance
    { key: 'ctr', label: t('columnCustomization.metrics.ctr'), description: t('columnCustomization.descriptions.ctr'), category: 'performance' },
    { key: 'cpcMedio', label: t('columnCustomization.metrics.averageCpc'), description: t('columnCustomization.descriptions.averageCpc'), category: 'performance' },
    { key: 'roas', label: t('columnCustomization.metrics.roas'), description: t('columnCustomization.descriptions.roas'), category: 'performance' },
    { key: 'roi', label: t('columnCustomization.metrics.roi'), description: t('columnCustomization.descriptions.roi'), category: 'performance' },
    { key: 'parcelaImpressaoRedeSearch', label: t('columnCustomization.metrics.searchImpressionShare'), description: t('columnCustomization.descriptions.searchImpressionShare'), category: 'performance' },
    { key: 'isParteSuperiorPesquisa', label: t('columnCustomization.metrics.topImpressionShare'), description: t('columnCustomization.descriptions.topImpressionShare'), category: 'performance' },
    { key: 'isPrimeiraPosicaoPesquisa', label: t('columnCustomization.metrics.firstPositionShare'), description: t('columnCustomization.descriptions.firstPositionShare'), category: 'performance' },
    
    // Métricas de Conversão
    { key: 'conversoes', label: t('columnCustomization.metrics.conversions'), description: t('columnCustomization.descriptions.conversions'), category: 'conversao' },
    { key: 'valorConversao', label: t('columnCustomization.metrics.conversionValue'), description: t('columnCustomization.descriptions.conversionValue'), category: 'conversao' },
    { key: 'custoConversao', label: t('columnCustomization.metrics.costPerConversion'), description: t('columnCustomization.descriptions.costPerConversion'), category: 'conversao' },
    { key: 'taxaConversao', label: t('columnCustomization.metrics.conversionRate'), description: t('columnCustomization.descriptions.conversionRate'), category: 'conversao' },
    { key: 'comissao', label: t('columnCustomization.metrics.commission'), description: t('columnCustomization.descriptions.commission'), category: 'conversao' },
    { key: 'visitors', label: t('columnCustomization.metrics.visitors'), description: t('columnCustomization.descriptions.visitors'), category: 'conversao' },
    { key: 'checkouts', label: t('columnCustomization.metrics.checkouts'), description: t('columnCustomization.descriptions.checkouts'), category: 'conversao' },
    
    // Métricas de Custo
    { key: 'cpcMaximo', label: t('columnCustomization.metrics.maxCpc'), description: t('columnCustomization.descriptions.maxCpc'), category: 'custo' },
    { key: 'cpm', label: t('columnCustomization.metrics.cpm'), description: t('columnCustomization.descriptions.cpm'), category: 'custo' },
    { key: 'lucro', label: t('columnCustomization.metrics.profit'), description: t('columnCustomization.descriptions.profit'), category: 'custo' }
  ];
}

interface QualityMetricOption {
  key: string;
  label: string;
  description: string;
  category: 'qualidade';
}

interface ManualMetricOption {
  key: string;
  label: string;
  description: string;
  category: 'manual';
}

export function getQualityMetrics(t: any): QualityMetricOption[] {
  return [
    { key: 'cliquesInvalidos', label: t('columnCustomization.metrics.invalidClicks'), description: t('columnCustomization.descriptions.invalidClicks'), category: 'qualidade' },
    { key: 'parcelaImpressaoPerdidaOrcamento', label: t('columnCustomization.metrics.lostImpressionBudget'), description: t('columnCustomization.descriptions.lostImpressionBudget'), category: 'qualidade' },
    { key: 'parcelaImpressaoPerdidaClassificacao', label: t('columnCustomization.metrics.lostImpressionQuality'), description: t('columnCustomization.descriptions.lostImpressionQuality'), category: 'qualidade' },
    { key: 'pontuacaoOtimizacao', label: t('columnCustomization.metrics.optimizationScore'), description: t('columnCustomization.descriptions.optimizationScore'), category: 'qualidade' }
  ];
}

export function getManualMetrics(t: any): ManualMetricOption[] {
  return [
    { key: 'statusCampanha', label: t('columnCustomization.metrics.campaignStatus'), description: t('columnCustomization.descriptions.campaignStatus'), category: 'manual' },
    { key: 'tipoCampanha', label: t('columnCustomization.metrics.campaignType'), description: t('columnCustomization.descriptions.campaignType'), category: 'manual' },
    { key: 'estrategiaLances', label: t('columnCustomization.metrics.biddingStrategy'), description: t('columnCustomization.descriptions.biddingStrategy'), category: 'manual' },
    { key: 'moeda', label: t('columnCustomization.metrics.currency'), description: t('columnCustomization.descriptions.currency'), category: 'manual' }
  ];
}



const categoryColors = {
  basico: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
  performance: 'bg-green-600/20 text-green-700 border-green-600/30',
  conversao: 'bg-purple-500/20 text-purple-600 border-purple-500/30',
  custo: 'bg-orange-500/20 text-orange-600 border-orange-500/30',
  qualidade: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30',
  manual: 'bg-gray-500/20 text-gray-600 border-gray-500/30',
};

interface ColumnCustomizationModalProps {
  selectedMetrics: string[];
  onMetricsChange: (metrics: string[]) => void;
}

export default function ColumnCustomizationModal({
  selectedMetrics,
  onMetricsChange
}: ColumnCustomizationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelectedMetrics, setTempSelectedMetrics] = useState<string[]>(selectedMetrics);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const { presets } = usePresets();
  const { t } = useTranslation();

  const availableMetrics = getAvailableMetrics(t);
  const qualityMetrics = getQualityMetrics(t);
  const manualMetrics = getManualMetrics(t);
  const allAvailableMetrics = [...availableMetrics, ...qualityMetrics, ...manualMetrics];

  const handleMetricToggle = (metricKey: string) => {
    setTempSelectedMetrics(prev => 
      prev.includes(metricKey) 
        ? prev.filter(key => key !== metricKey)
        : [...prev, metricKey]
    );
  };

  const handleApply = () => {
    onMetricsChange(tempSelectedMetrics);
    setIsOpen(false);
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      setTempSelectedMetrics(preset.columns.filter(col => 
        allAvailableMetrics.some(metric => metric.key === col)
      ));
      setSelectedPreset(presetId);
    }
  };

  const handleReset = () => {
    setTempSelectedMetrics(['custo', 'faturamento', 'impressoes', 'cliques', 'ctr', 'roas']);
    setSelectedPreset('');
  };

  const metricsByCategory = allAvailableMetrics.reduce((acc, metric) => {
    if (!acc[metric.category]) acc[metric.category] = [];
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Settings className="w-4 h-4" />
          {t('columnCustomization.personalizeColumns')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {t('columnCustomization.personalizeMetrics')}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Presets */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">{t('columnCustomization.availablePresets')}</h3>
            <Select value={selectedPreset} onValueChange={handlePresetSelect}>
              <SelectTrigger>
                <SelectValue placeholder={t('columnCustomization.choosePreset')} />
              </SelectTrigger>
              <SelectContent>
                {presets.map(preset => (
                  <SelectItem key={preset.id} value={preset.id}>
                    <div>
                      <div className="font-medium">{preset.name}</div>
                      {preset.description && (
                        <div className="text-xs text-muted-foreground">{preset.description}</div>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Métricas por categoria */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">{t('columnCustomization.availableMetrics')}</h3>
              <Badge variant="secondary">
                {tempSelectedMetrics.length} {t('columnCustomization.selected')}
              </Badge>
            </div>

            {Object.entries(metricsByCategory).map(([category, metrics]) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className={categoryColors[category as keyof typeof categoryColors]}>
                    {category === 'basico' && t('columnCustomization.categories.basic')}
                    {category === 'performance' && t('columnCustomization.categories.performance')}
                    {category === 'conversao' && t('columnCustomization.categories.conversion')}
                    {category === 'custo' && t('columnCustomization.categories.cost')}
                    {category === 'qualidade' && t('columnCustomization.categories.quality')}
                    {category === 'manual' && t('columnCustomization.categories.manual')}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {metrics.map(metric => (
                    <div
                      key={metric.key}
                      className="flex items-center space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <Checkbox
                        id={metric.key}
                        checked={tempSelectedMetrics.includes(metric.key)}
                        onCheckedChange={() => handleMetricToggle(metric.key)}
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={metric.key}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {metric.label}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {metric.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            {t('columnCustomization.restoreDefault')}
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              {t('columnCustomization.cancel')}
            </Button>
            <Button onClick={handleApply} className="gap-2">
              <Save className="w-4 h-4" />
              {t('columnCustomization.applyConfiguration')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}