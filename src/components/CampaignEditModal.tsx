
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Edit, Save, X, RefreshCw } from 'lucide-react'
import { Campaign } from '@/contexts/CampaignContext'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency, getCurrencySymbol, calculateCampaignMetrics } from '@/utils/campaignCalculations'
import { fetchUSDToBRLRate, formatExchangeRate } from '@/utils/exchangeRateService'
import { MetricField } from '@/components/MetricField'
import { getMetricsConfig, HIDDEN_IN_EDIT } from '@/utils/metricsConfig'

interface CampaignEditModalProps {
  isOpen: boolean
  onClose: () => void
  campaign: Campaign | null
  onSave: (campaignId: string, changes: Partial<Campaign>) => void
}

const getBiddingStrategyOptions = (t: any) => [
  t('biddingStrategies.manualCPC'),
  t('biddingStrategies.maximizeConversions'),
  t('biddingStrategies.targetCPA'),
  t('biddingStrategies.targetROAS'),
  t('biddingStrategies.maximizeClicks'),
  t('biddingStrategies.enhancedCPC')
]

const CampaignEditModal: React.FC<CampaignEditModalProps> = ({
  isOpen,
  onClose,
  campaign,
  onSave
}) => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [formData, setFormData] = useState<Partial<Campaign>>({})
  const [originalData, setOriginalData] = useState<Partial<Campaign> | null>(null)
  const [calculatedMetrics, setCalculatedMetrics] = useState({
    ctr: 0,
    cpcMedio: 0,
    custo: 0,
    faturamento: 0,
    lucro: 0,
    custoConversao: 0,
    taxaConversao: 0,
    
  })
  const [isUpdatingExchangeRate, setIsUpdatingExchangeRate] = useState(false)
  const [exchangeRateTimestamp, setExchangeRateTimestamp] = useState<string>('')

  useEffect(() => {
    if (campaign && isOpen) {
      const data = {
        campanha: campaign.campanha,
        orcamento: campaign.orcamento,
        estrategiaLances: campaign.estrategiaLances,
        currency: campaign.currency || 'USD',
        impressoes: campaign.impressoes || 0,
        cliques: campaign.cliques || 0,
        custo: campaign.custo || 0,
        cpcMedio: campaign.cpcMedio || 0,
        conversoes: campaign.conversoes || 0,
        
        ctr: campaign.ctr || 0,
        custoConversao: campaign.custoConversao || 0,
        taxaConversao: campaign.taxaConversao || 0,
        parcelaImpressaoRedeSearch: campaign.parcelaImpressaoRedeSearch || 0,
        isParteSuperiorPesquisa: campaign.isParteSuperiorPesquisa || 0,
        isPrimeiraPosicaoPesquisa: campaign.isPrimeiraPosicaoPesquisa || 0,
        cliquesInvalidos: campaign.cliquesInvalidos || 0,
        comissao: campaign.comissao || 0,
        visitors: campaign.visitors || 0,
        checkouts: campaign.checkouts || 0,
        parcelaImpressaoPerdidaOrcamento: campaign.parcelaImpressaoPerdidaOrcamento || 0,
        parcelaImpressaoPerdidaClassificacao: campaign.parcelaImpressaoPerdidaClassificacao || 0,
        exchangeRate: campaign.exchangeRate || 5.50
      }
      setFormData(data)
      setOriginalData(data)
      
      // Calcular métricas iniciais incluindo custo e conversões
      calculateAllMetrics(data)

      // Buscar cotação atual se não tiver
      if (!campaign.exchangeRate) {
        updateExchangeRate()
      }
    }
  }, [campaign, isOpen])

  // Função para calcular todas as métricas automaticamente
  const calculateAllMetrics = (data: Partial<Campaign>) => {
    const metrics = calculateCampaignMetrics({
      impressoes: data.impressoes || 0,
      cliques: data.cliques || 0,
      custo: data.custo || 0,
      cpcMedio: data.cpcMedio || 0,
      conversoes: data.conversoes || 0,
      comissao: data.comissao || 0
    })

    // Calcular custo automaticamente: CPC Médio × Cliques
    const calculatedCusto = (data.cpcMedio || 0) * (data.cliques || 0)
    
    // Calcular faturamento: Comissão (USD) × Conversões
    const calculatedFaturamento = (data.comissao || 0) * (data.conversoes || 0)
    
    // Calcular lucro: Faturamento - Custo
    const calculatedLucro = calculatedFaturamento - calculatedCusto


    setCalculatedMetrics({
      ...metrics,
      custo: Number(calculatedCusto.toFixed(2)),
      faturamento: Number(calculatedFaturamento.toFixed(2)),
      lucro: Number(calculatedLucro.toFixed(2)),
      
    })
  }

  const updateExchangeRate = async () => {
    setIsUpdatingExchangeRate(true)
    try {
      const rateData = await fetchUSDToBRLRate()
      handleInputChange('exchangeRate', rateData.rate)
      setExchangeRateTimestamp(new Date(parseInt(rateData.timestamp) * 1000).toLocaleString('pt-BR'))
      
      toast({
        title: t('campaignEdit.quoteUpdated'),
        description: `${t('campaignEdit.newQuote')} ${formatExchangeRate(rateData.rate)}`,
      })
    } catch (error) {
      toast({
        title: t('campaignEdit.errorUpdatingQuote'),
        description: t('campaignEdit.tryAgainLater'),
        variant: "destructive"
      })
    } finally {
      setIsUpdatingExchangeRate(false)
    }
  }

  const handleSave = () => {
    if (!campaign || !originalData) return

    // Incluir os valores calculados no salvamento
    const formDataWithCalculated = {
      ...formData,
      custo: calculatedMetrics.custo,
      faturamento: calculatedMetrics.faturamento,
      lucro: calculatedMetrics.lucro
    }

    // Calcular apenas os campos que mudaram
    const changes: Partial<Campaign> = {}
    let hasChanges = false

    Object.keys(formDataWithCalculated).forEach(fieldKey => {
      const key = fieldKey as keyof Campaign
      if (formDataWithCalculated[key] !== originalData[key]) {
        ;(changes as any)[key] = formDataWithCalculated[key]
        hasChanges = true
      }
    })

    if (!hasChanges) {
      toast({
        title: t('campaignEdit.noChanges'),
        description: t('campaignEdit.noFieldsModified'),
        variant: "default"
      })
      return
    }

    onSave(campaign.id, changes)
    onClose()
  }

  const handleInputChange = (field: keyof Campaign, value: string | number) => {
    const newFormData = {
      ...formData,
      [field]: value
    }
    setFormData(newFormData)

    // Recalcular todas as métricas quando campos relevantes mudarem
    if (['impressoes', 'cliques', 'custo', 'cpcMedio', 'conversoes', 'comissao', 'exchangeRate'].includes(field)) {
      calculateAllMetrics(newFormData)
    }
  }

  const formatCurrencyValue = (value: number) => {
    const currency = formData.currency || 'USD'
    return formatCurrency(value, currency)
  }

  if (!campaign) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            {t('campaignEdit.editCampaign')} - {campaign.campanha}
          </DialogTitle>
          <DialogDescription>
            {t('campaignEdit.modifyData')}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Dados Básicos */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{t('campaignEdit.basicData')}</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campanha">{t('campaignEdit.campaignName')}</Label>
                  <Input
                    id="campanha"
                    value={formData.campanha || ''}
                    onChange={(e) => handleInputChange('campanha', e.target.value)}
                    placeholder={t('campaignEdit.enterCampaignName')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">{t('campaignEdit.currency')}</Label>
                  <Select
                    value={formData.currency || 'USD'}
                    onValueChange={(value: 'BRL' | 'USD') => handleInputChange('currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('campaignEdit.selectCurrency')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">{t('campaignEdit.brazilianReal')}</SelectItem>
                      <SelectItem value="USD">{t('campaignEdit.usDollar')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <MetricField
                  fieldKey="orcamento"
                  value={formData.orcamento || 0}
                  onChange={(value) => handleInputChange('orcamento', value)}
                  currency={formData.currency || 'USD'}
                />

                <div className="space-y-2">
                  <Label htmlFor="estrategia">{t('campaignEdit.biddingStrategy')}</Label>
                  <Select
                    value={formData.estrategiaLances || ''}
                    onValueChange={(value) => handleInputChange('estrategiaLances', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('campaignEdit.selectStrategy')} />
                    </SelectTrigger>
                    <SelectContent>
                      {getBiddingStrategyOptions(t).map(estrategia => (
                        <SelectItem key={estrategia} value={estrategia}>
                          {estrategia}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Cotação do Dólar */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-orange-500/10 text-orange-700">{t('campaignEdit.dollarQuote')}</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exchangeRate">{t('campaignEdit.usdBrlQuote')}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="exchangeRate"
                      type="number"
                      step="0.0001"
                      value={formData.exchangeRate || 5.50}
                      onChange={(e) => handleInputChange('exchangeRate', parseFloat(e.target.value) || 5.50)}
                      placeholder="5.5000"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={updateExchangeRate}  
                      disabled={isUpdatingExchangeRate}
                      className="px-3"
                      title={t('campaignEdit.updateQuote')}
                    >
                      <RefreshCw className={`h-4 w-4 ${isUpdatingExchangeRate ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatExchangeRate(formData.exchangeRate || 5.50)}
                    {exchangeRateTimestamp && (
                      <span className="block mt-1">Última atualização: {exchangeRateTimestamp}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Métricas de Performance */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500/10 text-blue-700">{t('campaignEdit.performanceMetrics')}</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricField
                  fieldKey="impressoes"
                  value={formData.impressoes || 0}
                  onChange={(value) => handleInputChange('impressoes', value)}
                />

                <MetricField
                  fieldKey="cliques"
                  value={formData.cliques || 0}
                  onChange={(value) => handleInputChange('cliques', value)}
                />

                <MetricField
                  fieldKey="ctr"
                  value={calculatedMetrics.ctr}
                  onChange={() => {}} // Calculado automaticamente
                  readonly={true}
                />
              </div>
            </div>

            <Separator />

            {/* Métricas de Custo */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-red-500/10 text-red-700">Métricas de Custo</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricField
                  fieldKey="cpcMedio"
                  value={formData.cpcMedio || 0}
                  onChange={(value) => handleInputChange('cpcMedio', value)}
                  currency={formData.currency || 'USD'}
                />

                <MetricField
                  fieldKey="comissao"
                  value={formData.comissao || 0}
                  onChange={(value) => handleInputChange('comissao', value)}
                  campaignCurrency={formData.currency}
                />
              </div>
            </div>

            <Separator />

            {/* Métricas de Conversão */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-600/10 text-green-700">Métricas de Conversão</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricField
                  fieldKey="conversoes"
                  value={formData.conversoes || 0}
                  onChange={(value) => handleInputChange('conversoes', value)}
                />


                <MetricField
                  fieldKey="visitors"
                  value={formData.visitors || 0}
                  onChange={(value) => handleInputChange('visitors', value)}
                />

                <MetricField
                  fieldKey="checkouts"
                  value={formData.checkouts || 0}
                  onChange={(value) => handleInputChange('checkouts', value)}
                />
              </div>
              
              {/* Métricas Calculadas */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 p-4 bg-muted/30 rounded-lg">

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium text-muted-foreground">{t('editCampaign.totalRevenue')}</Label>
                  </div>
                  <div className="text-lg font-semibold">
                    {formatCurrencyValue(calculatedMetrics.faturamento)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t('editCampaign.commissionUSDConversions')}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium text-muted-foreground">{t('editCampaign.totalCost')}</Label>
                  </div>
                  <div className="text-lg font-semibold">
                    {formatCurrencyValue(calculatedMetrics.custo)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t('editCampaign.averageCPCClicks')}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium text-muted-foreground">{t('editCampaign.netProfit')}</Label>
                  </div>
                  <div className={`text-lg font-semibold ${calculatedMetrics.lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrencyValue(calculatedMetrics.lucro)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t('editCampaign.revenueCost')}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Métricas de Qualidade */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-500/10 text-purple-700">Métricas de Qualidade</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricField
                  fieldKey="parcelaImpressaoRedeSearch"
                  value={formData.parcelaImpressaoRedeSearch || 0}
                  onChange={(value) => handleInputChange('parcelaImpressaoRedeSearch', value)}
                />

                <MetricField
                  fieldKey="isParteSuperiorPesquisa"
                  value={formData.isParteSuperiorPesquisa || 0}
                  onChange={(value) => handleInputChange('isParteSuperiorPesquisa', value)}
                />

                <MetricField
                  fieldKey="isPrimeiraPosicaoPesquisa"
                  value={formData.isPrimeiraPosicaoPesquisa || 0}
                  onChange={(value) => handleInputChange('isPrimeiraPosicaoPesquisa', value)}
                />

                <MetricField
                  fieldKey="cliquesInvalidos"
                  value={formData.cliquesInvalidos || 0}
                  onChange={(value) => handleInputChange('cliquesInvalidos', value)}
                />

                <MetricField
                  fieldKey="parcelaImpressaoPerdidaOrcamento"
                  value={formData.parcelaImpressaoPerdidaOrcamento || 0}
                  onChange={(value) => handleInputChange('parcelaImpressaoPerdidaOrcamento', value)}
                />

                <MetricField
                  fieldKey="parcelaImpressaoPerdidaClassificacao"
                  value={formData.parcelaImpressaoPerdidaClassificacao || 0}
                  onChange={(value) => handleInputChange('parcelaImpressaoPerdidaClassificacao', value)}
                />
              </div>
            </div>

            {/* Resumo de dados somente leitura */}
            <div className="bg-muted/30 p-4 rounded-lg space-y-2">
              <div className="text-sm font-medium">Dados da Campanha (Somente Leitura)</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">ID:</span> {campaign.id}
                </div>
                <div>
                  <span className="text-muted-foreground">Data:</span> {campaign.data}
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span> Ativa
                </div>
                <div>
                  <span className="text-muted-foreground">Tipo:</span> Search
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Botões de ação */}
        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            {t('common.save')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CampaignEditModal
