import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Settings, Save, RotateCcw } from 'lucide-react';
import { usePresets, ColumnPreset } from '@/hooks/usePresets';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { getAvailableMetrics, getQualityMetrics, getManualMetrics } from '@/components/ColumnCustomizationModal';


const categoryColors = {
  basico: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
  performance: 'bg-green-600/20 text-green-700 border-green-600/30',
  conversao: 'bg-purple-500/20 text-purple-600 border-purple-500/30',
  custo: 'bg-orange-500/20 text-orange-600 border-orange-500/30',
  qualidade: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30',
  manual: 'bg-gray-500/20 text-gray-600 border-gray-500/30',
};

interface IndividualColumnCustomizationModalProps {
  campaignName: string;
  selectedMetrics: string[];
  onMetricsChange: (metrics: string[]) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function IndividualColumnCustomizationModal({
  campaignName,
  selectedMetrics,
  onMetricsChange,
  isOpen,
  onOpenChange
}: IndividualColumnCustomizationModalProps) {
  const [tempSelectedMetrics, setTempSelectedMetrics] = useState<string[]>(selectedMetrics);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const { presets } = usePresets();
  const { t } = useTranslation();

  const availableMetrics = getAvailableMetrics(t);
  const qualityMetrics = getQualityMetrics(t);
  const manualMetrics = getManualMetrics(t);
  const allAvailableMetrics = [...availableMetrics, ...qualityMetrics, ...manualMetrics];

  React.useEffect(() => {
    setTempSelectedMetrics(selectedMetrics);
  }, [selectedMetrics, isOpen]);

  const handleMetricToggle = (metricKey: string) => {
    setTempSelectedMetrics(prev => 
      prev.includes(metricKey) 
        ? prev.filter(key => key !== metricKey)
        : [...prev, metricKey]
    );
  };

  const handleApply = () => {
    onMetricsChange(tempSelectedMetrics);
    onOpenChange(false);
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {t('individualCampaignMetrics.title')} - {campaignName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Presets */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">{t('individualCampaignMetrics.availablePresets')}</h3>
            <Select value={selectedPreset} onValueChange={handlePresetSelect}>
              <SelectTrigger>
                <SelectValue placeholder={t('individualCampaignMetrics.choosePreset')} />
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
              <h3 className="font-semibold text-sm">{t('individualCampaignMetrics.availableMetrics')}</h3>
              <Badge variant="secondary">
                {tempSelectedMetrics.length} {t('individualCampaignMetrics.selected')}
              </Badge>
            </div>

            {Object.entries(metricsByCategory).map(([category, metrics]) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className={categoryColors[category as keyof typeof categoryColors]}>
                    {category === 'basico' && t('individualCampaignMetrics.basicCategory')}
                    {category === 'performance' && t('individualCampaignMetrics.performanceCategory')}
                    {category === 'conversao' && t('individualCampaignMetrics.conversionCategory')}
                    {category === 'custo' && t('individualCampaignMetrics.costCategory')}
                    {category === 'qualidade' && t('individualCampaignMetrics.qualityCategory')}
                    {category === 'manual' && t('individualCampaignMetrics.manualCategory')}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {metrics.map(metric => (
                    <div
                      key={metric.key}
                      className="flex items-center space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <Checkbox
                        id={`${campaignName}-${metric.key}`}
                        checked={tempSelectedMetrics.includes(metric.key)}
                        onCheckedChange={() => handleMetricToggle(metric.key)}
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`${campaignName}-${metric.key}`}
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
            {t('individualCampaignMetrics.restoreDefault')}
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t('individualCampaignMetrics.cancel')}
            </Button>
            <Button onClick={handleApply} className="gap-2">
              <Save className="w-4 h-4" />
              {t('individualCampaignMetrics.applyConfiguration')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}