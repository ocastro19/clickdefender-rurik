import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Save, X, Calculator, TrendingUp } from 'lucide-react'
import { Campaign } from '@/contexts/CampaignContext'
import { useToast } from '@/hooks/use-toast'
import { calculateCampaignMetrics, formatCurrency, getCurrencySymbol } from '@/utils/campaignCalculations'
import { CommissionField } from '@/components/CommissionField'
import { useTranslation } from 'react-i18next'

interface ManualCampaignEditData {
  campanha: string
  moeda: 'BRL' | 'USD'
  orcamento: number
  estrategiaLances: string
  impressoes: number
  cliques: number
  cpcMedio: number
  comissao: number // sempre em USD
  visitors: number
  checkouts: number
  parcelaImpressaoRede: number
  parcelaImpressaoPrimeiraPosicao: number
  parcelaImpressaoTopo: number
  parcelaImpressaoPerdidaOrcamento: number
  parcelaImpressaoPerdidaQualidade: number
  cliquesInvalidos: number
}

interface ManualCampaignEditModalProps {
  isOpen: boolean
  onClose: () => void
  campaign?: Campaign | null
  onSave: (data: ManualCampaignEditData) => void
}

const estrategiaLancesOptions = [
  'Manual CPC',
  'Maximize Conversions',
  'Target CPA',
  'Target ROAS',
  'Maximize Clicks',
  'Enhanced CPC'
]

const ManualCampaignEditModal: React.FC<ManualCampaignEditModalProps> = ({
  isOpen,
  onClose,
  campaign,
  onSave
}) => {
  const { toast } = useToast()
  const { t } = useTranslation()
  const [exchangeRate, setExchangeRate] = useState(5.5)
  const [formData, setFormData] = useState<ManualCampaignEditData>({
    campanha: '',
    moeda: 'BRL',
    orcamento: 0,
    estrategiaLances: '',
    impressoes: 0,
    cliques: 0,
    cpcMedio: 0,
    comissao: 0,
    visitors: 0,
    checkouts: 0,
    parcelaImpressaoRede: 0,
    parcelaImpressaoPrimeiraPosicao: 0,
    parcelaImpressaoTopo: 0,
    parcelaImpressaoPerdidaOrcamento: 0,
    parcelaImpressaoPerdidaQualidade: 0,
    cliquesInvalidos: 0
  })

  // Fetch exchange rate
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL')
        const data = await response.json()
        if (data.USDBRL?.bid) {
          setExchangeRate(parseFloat(data.USDBRL.bid))
        }
      } catch (error) {
        console.warn('Erro ao buscar cotação:', error)
      }
    }
    
    if (isOpen) {
      fetchExchangeRate()
    }
  }, [isOpen])

  useEffect(() => {
    if (campaign && isOpen) {
      setFormData({
        campanha: campaign.campanha || '',
        moeda: 'BRL',
        orcamento: campaign.orcamento || 0,
        estrategiaLances: campaign.estrategiaLances || '',
        impressoes: campaign.impressoes || 0,
        cliques: campaign.cliques || 0,
        cpcMedio: campaign.cpcMedio || 0,
        comissao: campaign.comissao || 0,
        visitors: campaign.visitors || 0,
        checkouts: campaign.checkouts || 0,
        parcelaImpressaoRede: 0,
        parcelaImpressaoPrimeiraPosicao: 0,
        parcelaImpressaoTopo: 0,
        parcelaImpressaoPerdidaOrcamento: 0,
        parcelaImpressaoPerdidaQualidade: 0,
        cliquesInvalidos: 0
      })
    }
  }, [campaign, isOpen])

  // Calcular métricas automaticamente
  const custo = formData.cliques * formData.cpcMedio
  // Faturamento = Comissão (USD) × Conversões
  const faturamento = formData.checkouts * formData.comissao // Faturamento em USD sempre
  
  const calculatedMetrics = {
    ctr: formData.impressoes > 0 ? (formData.cliques / formData.impressoes) * 100 : 0,
    custo,
    cpm: formData.impressoes > 0 ? (custo / formData.impressoes) * 1000 : 0,
    custoConversao: formData.checkouts > 0 ? custo / formData.checkouts : 0,
    taxaConversao: formData.cliques > 0 ? (formData.checkouts / formData.cliques) * 100 : 0,
    lucro: faturamento - custo,
    roi: custo > 0 ? ((faturamento - custo) / custo) * 100 : 0
  }

  const handleInputChange = (field: keyof ManualCampaignEditData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    if (!formData.campanha.trim()) {
      toast({
        title: t('editCampaign.requiredField'),
        description: t('editCampaign.campaignNameRequired'),
        variant: "destructive"
      })
      return
    }

    onSave(formData)
    toast({
      title: t('editCampaign.campaignSaved'),
      description: t('editCampaign.changesSavedSuccess'),
    })
    onClose()
  }

  const formatPercentage = (value: number) => `${value.toFixed(2)}%`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            {t('editCampaign.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Formulário Único - Campos Editáveis */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Nome da Campanha */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="campanha" className="text-sm font-medium">
                {t('editCampaign.campaignName')} *
              </Label>
              <Input
                id="campanha"
                value={formData.campanha}
                onChange={(e) => handleInputChange('campanha', e.target.value)}
                placeholder={t('editCampaign.campaignName')}
                className="h-10"
              />
            </div>

            {/* Moeda */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('editCampaign.campaignCurrency')}</Label>
              <Select
                value={formData.moeda}
                onValueChange={(value) => handleInputChange('moeda', value)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">BRL (R$)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Orçamento */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t('editCampaign.budget')} ({getCurrencySymbol(formData.moeda)})
              </Label>
              <Input
                type="number"
                step="0.01"
                value={formData.orcamento}
                onChange={(e) => handleInputChange('orcamento', parseFloat(e.target.value) || 0)}
                className="h-10"
              />
            </div>

            {/* Estratégia de Lances */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('editCampaign.biddingStrategy')}</Label>
              <Select
                value={formData.estrategiaLances}
                onValueChange={(value) => handleInputChange('estrategiaLances', value)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder={t('editCampaign.selectStrategy')} />
                </SelectTrigger>
                <SelectContent>
                  {estrategiaLancesOptions.map(estrategia => (
                    <SelectItem key={estrategia} value={estrategia}>
                      {estrategia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Impressões */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('editCampaign.impressions')}</Label>
              <Input
                type="number"
                value={formData.impressoes}
                onChange={(e) => handleInputChange('impressoes', parseInt(e.target.value) || 0)}
                className="h-10"
              />
            </div>

            {/* Cliques */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('editCampaign.clicks')}</Label>
              <Input
                type="number"
                value={formData.cliques}
                onChange={(e) => handleInputChange('cliques', parseInt(e.target.value) || 0)}
                className="h-10"
              />
            </div>

            {/* CPC Médio */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t('editCampaign.avgCpc')} ({getCurrencySymbol(formData.moeda)})
              </Label>
              <Input
                type="number"
                step="0.01"
                value={formData.cpcMedio}
                onChange={(e) => handleInputChange('cpcMedio', parseFloat(e.target.value) || 0)}
                className="h-10"
              />
            </div>

            {/* Comissão (sempre USD) */}
            <CommissionField
              value={formData.comissao}
              onChange={(value) => handleInputChange('comissao', value)}
              campaignCurrency={formData.moeda}
            />

            {/* Visitantes */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('editCampaign.visitors')}</Label>
              <Input
                type="number"
                value={formData.visitors}
                onChange={(e) => handleInputChange('visitors', parseInt(e.target.value) || 0)}
                className="h-10"
              />
            </div>

            {/* Checkouts */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('editCampaign.checkouts')}</Label>
              <Input
                type="number"
                value={formData.checkouts}
                onChange={(e) => handleInputChange('checkouts', parseInt(e.target.value) || 0)}
                className="h-10"
              />
            </div>

            {/* % Impressão Rede Pesquisa */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('editCampaign.searchImpressionShare')}</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.parcelaImpressaoRede}
                onChange={(e) => handleInputChange('parcelaImpressaoRede', parseFloat(e.target.value) || 0)}
                className="h-10"
              />
            </div>

            {/* % Impressão 1ª Posição Pesquisa */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('editCampaign.firstPositionImpressionShare')}</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.parcelaImpressaoPrimeiraPosicao}
                onChange={(e) => handleInputChange('parcelaImpressaoPrimeiraPosicao', parseFloat(e.target.value) || 0)}
                className="h-10"
              />
            </div>

            {/* % Impressão Topo Pesquisa */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('editCampaign.topImpressionShare')}</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.parcelaImpressaoTopo}
                onChange={(e) => handleInputChange('parcelaImpressaoTopo', parseFloat(e.target.value) || 0)}
                className="h-10"
              />
            </div>

            {/* % Impressão Perdida Orçamento */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('editCampaign.lostImpressionShareBudget')}</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.parcelaImpressaoPerdidaOrcamento}
                onChange={(e) => handleInputChange('parcelaImpressaoPerdidaOrcamento', parseFloat(e.target.value) || 0)}
                className="h-10"
              />
            </div>

            {/* % Impressão Perdida Qualidade */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('editCampaign.lostImpressionShareQuality')}</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.parcelaImpressaoPerdidaQualidade}
                onChange={(e) => handleInputChange('parcelaImpressaoPerdidaQualidade', parseFloat(e.target.value) || 0)}
                className="h-10"
              />
            </div>

            {/* Cliques Inválidos */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('editCampaign.invalidClicks')}</Label>
              <Input
                type="number"
                value={formData.cliquesInvalidos}
                onChange={(e) => handleInputChange('cliquesInvalidos', parseInt(e.target.value) || 0)}
                className="h-10"
              />
            </div>
          </div>

          {/* Métricas Calculadas - Apenas Leitura */}
          <div className="border-t pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="h-5 w-5" />
              <h3 className="text-lg font-semibold">{t('editCampaign.calculatedMetrics')}</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t('editCampaign.ctr')}</p>
                <Badge variant="secondary" className="w-full justify-center">
                  {formatPercentage(calculatedMetrics.ctr)}
                </Badge>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t('editCampaign.totalCost')}</p>
                <Badge variant="secondary" className="w-full justify-center">
                  {formatCurrency(calculatedMetrics.custo, formData.moeda)}
                </Badge>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t('editCampaign.cpm')}</p>
                <Badge variant="secondary" className="w-full justify-center">
                  {formatCurrency(calculatedMetrics.cpm, formData.moeda)}
                </Badge>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t('editCampaign.costPerConversion')}</p>
                <Badge variant="secondary" className="w-full justify-center">
                  {formatCurrency(calculatedMetrics.custoConversao, formData.moeda)}
                </Badge>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t('editCampaign.conversionRate')}</p>
                <Badge variant="secondary" className="w-full justify-center">
                  {formatPercentage(calculatedMetrics.taxaConversao)}
                </Badge>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t('editCampaign.conversions')}</p>
                <Badge variant="secondary" className="w-full justify-center">
                  {formData.checkouts}
                </Badge>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t('editCampaign.profit')}</p>
                <Badge 
                  variant={calculatedMetrics.lucro > 0 ? "default" : "destructive"} 
                  className="w-full justify-center"
                >
                  {formatCurrency(calculatedMetrics.lucro, formData.moeda)}
                </Badge>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t('editCampaign.roi')}</p>
                <Badge 
                  variant={calculatedMetrics.roi > 0 ? "default" : "destructive"} 
                  className="w-full justify-center"
                >
                  {formatPercentage(calculatedMetrics.roi)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-4 justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="min-w-[120px]">
              <X className="h-4 w-4 mr-2" />
              {t('editCampaign.cancel')}
            </Button>
            <Button onClick={handleSave} className="min-w-[120px]">
              <Save className="h-4 w-4 mr-2" />
              {t('editCampaign.saveChanges')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ManualCampaignEditModal