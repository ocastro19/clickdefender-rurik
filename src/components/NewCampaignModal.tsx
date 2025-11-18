import React, { useState, useMemo, useEffect } from 'react'
import { Plus, Calculator, User, Eye, TrendingUp } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useCampaigns, Campaign } from '@/contexts/CampaignContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchUSDToBRLRate, formatExchangeRate } from '@/utils/exchangeRateService'
import { useTranslation } from 'react-i18next'

interface NewCampaignModalProps {
  isOpen: boolean
  onClose: () => void
}

const NewCampaignModal: React.FC<NewCampaignModalProps> = ({ isOpen, onClose }) => {
  const { addCampaign } = useCampaigns()
  const { toast } = useToast()
  const { t } = useTranslation()
  const [exchangeRate, setExchangeRate] = useState(5.50)
  
  const [formData, setFormData] = useState({
    campanha: '',
    data: new Date().toISOString().split('T')[0],
    orcamento: '',
    impressoes: '',
    cliques: '',
    conversoes: '',
    estrategiaLances: 'CPC',
    currency: 'USD',
    // Campos manuais adicionais
    cpcMedio: '',
    comissao: '', // Comissão em USD
    visitors: '',
    checkouts: '',
    parcelaImpressaoRedeSearch: '',
    isParteSuperiorPesquisa: '',
    isPrimeiraPosicaoPesquisa: '',
    parcelaImpressaoPerdidaClassificacao: '',
    parcelaImpressaoPerdidaOrcamento: ''
  })

  // Buscar cotação do dólar ao abrir o modal
  useEffect(() => {
    const getExchangeRate = async () => {
      try {
        const rateData = await fetchUSDToBRLRate()
        setExchangeRate(rateData.rate)
      } catch (error) {
        console.error('Erro ao buscar cotação:', error)
      }
    }
    
    if (isOpen) {
      getExchangeRate()
    }
  }, [isOpen])

  // Campos calculados automaticamente
  const calculatedFields = useMemo(() => {
    const custo = formData.cpcMedio && formData.cliques 
      ? parseFloat(formData.cpcMedio) * parseInt(formData.cliques)
      : 0
    
    const comissao = parseFloat(formData.comissao) || 0
    const conversoes = parseInt(formData.conversoes) || 0
    
    // Faturamento = Comissão (USD) × Conversões × Cotação
    const faturamento = comissao && conversoes > 0 
      ? comissao * conversoes * exchangeRate
      : 0
    
    return {
      custo: custo.toFixed(2),
      faturamento: faturamento.toFixed(2),
      comissaoEmBRL: comissao > 0 ? (comissao * exchangeRate).toFixed(2) : '0.00'
    }
  }, [formData.cpcMedio, formData.cliques, formData.comissao, formData.conversoes, exchangeRate])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    if (!formData.campanha.trim()) {
      toast({
        title: t('newCampaign.error'),
        description: t('newCampaign.campaignNameRequired'),
        variant: "destructive"
      })
      return
    }

    const custo = parseFloat(calculatedFields.custo) || 0
    const comissao = parseFloat(formData.comissao) || 0
    const conversoes = parseInt(formData.conversoes) || 0
    const faturamento = parseFloat(calculatedFields.faturamento) || 0

    const newCampaign: Campaign = {
      id: `campaign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      campanha: formData.campanha,
      data: formData.data,
      orcamento: parseFloat(formData.orcamento) || 0,
      impressoes: parseInt(formData.impressoes) || 0,
      cliques: parseInt(formData.cliques) || 0,
      custo: custo,
      cpcMedio: parseFloat(formData.cpcMedio) || 0,
      conversoes: conversoes,
      estrategiaLances: formData.estrategiaLances,
      ctr: ((parseInt(formData.cliques) || 0) / (parseInt(formData.impressoes) || 1)) * 100,
      
      custoConversao: custo / (conversoes || 1),
      taxaConversao: ((conversoes || 0) / (parseInt(formData.cliques) || 1)) * 100,
      parcelaImpressaoRedeSearch: parseFloat(formData.parcelaImpressaoRedeSearch) || 0,
      isParteSuperiorPesquisa: parseFloat(formData.isParteSuperiorPesquisa) || 0,
      isPrimeiraPosicaoPesquisa: parseFloat(formData.isPrimeiraPosicaoPesquisa) || 0,
      cliquesInvalidos: 0,
      comissao: comissao, // Sempre em USD
      visitors: parseInt(formData.visitors) || parseInt(formData.cliques) || 0,
      checkouts: parseInt(formData.checkouts) || conversoes || 0,
      parcelaImpressaoPerdidaOrcamento: parseFloat(formData.parcelaImpressaoPerdidaOrcamento) || 0,
      parcelaImpressaoPerdidaClassificacao: parseFloat(formData.parcelaImpressaoPerdidaClassificacao) || 0,
      currency: formData.currency as 'USD' | 'BRL',
      exchangeRate: exchangeRate,
      // Faturamento = Comissão (USD) × Conversões × Cotação
      faturamento: faturamento,
      lucro: faturamento - custo,
      roi: 0, // Será calculado automaticamente
      isFromGoogleAds: false
    }

    // Calcular ROI
    const faturamentoFinal = newCampaign.faturamento || 0
    newCampaign.roi = custo > 0 ? ((faturamentoFinal - custo) / custo) * 100 : 0

    addCampaign(newCampaign)

    toast({
      title: t('newCampaign.success'),
      description: t('newCampaign.campaignCreated', { name: formData.campanha })
    })

    // Reset form
    setFormData({
      campanha: '',
      data: new Date().toISOString().split('T')[0],
      orcamento: '',
      impressoes: '',
      cliques: '',
      conversoes: '',
      estrategiaLances: 'CPC',
      currency: 'USD',
      cpcMedio: '',
      comissao: '',
      visitors: '',
      checkouts: '',
      parcelaImpressaoRedeSearch: '',
      isParteSuperiorPesquisa: '',
      isPrimeiraPosicaoPesquisa: '',
      parcelaImpressaoPerdidaClassificacao: '',
      parcelaImpressaoPerdidaOrcamento: ''
    })

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] w-[95vw] sm:w-[90vw] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-r from-primary to-primary/80">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            {t('newCampaign.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('newCampaign.basicInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campanha">{t('newCampaign.campaignName')} *</Label>
                <Input
                  id="campanha"
                  value={formData.campanha}
                  onChange={(e) => handleInputChange('campanha', e.target.value)}
                  placeholder="Ex: Campanha Black Friday 2024"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data">{t('newCampaign.date')}</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => handleInputChange('data', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estrategiaLances">{t('newCampaign.biddingStrategy')}</Label>
                <Select value={formData.estrategiaLances} onValueChange={(value) => handleInputChange('estrategiaLances', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CPC">{t('newCampaign.bidStrategies.cpc')}</SelectItem>
                    <SelectItem value="Max">{t('newCampaign.bidStrategies.maximize')}</SelectItem>
                    <SelectItem value="Target">{t('newCampaign.bidStrategies.target')}</SelectItem>
                    <SelectItem value="Manual">{t('newCampaign.bidStrategies.manual')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">{t('newCampaign.currency')}</Label>
                <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">{t('newCampaign.usdDollar')}</SelectItem>
                    <SelectItem value="BRL">{t('newCampaign.brlReal')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Métricas Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {t('newCampaign.basicMetrics')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orcamento">{t('newCampaign.budget')}</Label>
                <Input
                  id="orcamento"
                  type="number"
                  step="0.01"
                  value={formData.orcamento}
                  onChange={(e) => handleInputChange('orcamento', e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="impressoes">{t('newCampaign.impressions')}</Label>
                <Input
                  id="impressoes"
                  type="number"
                  value={formData.impressoes}
                  onChange={(e) => handleInputChange('impressoes', e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cliques">{t('newCampaign.clicks')}</Label>
                <Input
                  id="cliques"
                  type="number"
                  value={formData.cliques}
                  onChange={(e) => handleInputChange('cliques', e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpcMedio">{t('newCampaign.averageCpc')}</Label>
                <Input
                  id="cpcMedio"
                  type="number"
                  step="0.01"
                  value={formData.cpcMedio}
                  onChange={(e) => handleInputChange('cpcMedio', e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="conversoes">{t('newCampaign.conversions')}</Label>
                <Input
                  id="conversoes"
                  type="number"
                  value={formData.conversoes}
                  onChange={(e) => handleInputChange('conversoes', e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comissao">{t('newCampaign.commissionPerConversion')}</Label>
                <Input
                  id="comissao"
                  type="number"
                  step="0.01"
                  value={formData.comissao}
                  onChange={(e) => handleInputChange('comissao', e.target.value)}
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground">
                  {t('newCampaign.equivalent')}: R$ {calculatedFields.comissaoEmBRL}
                </p>
              </div>

            </CardContent>
          </Card>

          {/* Campos Avançados e Calculados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                {t('newCampaign.advancedFields')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Campos Calculados Automaticamente */}
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
                <h4 className="text-sm font-semibold text-muted-foreground">{t('newCampaign.calculatedAutomatically')}</h4>
                
                <div className="space-y-2">
                  <Label>{t('newCampaign.totalCost')}</Label>
                  <Input
                    value={`R$ ${calculatedFields.custo}`}
                    disabled
                    className="bg-secondary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t('newCampaign.totalRevenue')}</Label>
                  <Input
                    value={`R$ ${calculatedFields.faturamento}`}
                    disabled
                    className="bg-secondary/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Comissão (USD) × Conversões × Cotação ({formatExchangeRate(exchangeRate)})
                  </p>
                </div>
              </div>

              {/* Campos Manuais Adicionais */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-muted-foreground">{t('newCampaign.manualFields')}</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="visitors">{t('newCampaign.visitors')}</Label>
                  <Input
                    id="visitors"
                    type="number"
                    value={formData.visitors}
                    onChange={(e) => handleInputChange('visitors', e.target.value)}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="checkouts">{t('newCampaign.checkouts')}</Label>
                  <Input
                    id="checkouts"
                    type="number"
                    value={formData.checkouts}
                    onChange={(e) => handleInputChange('checkouts', e.target.value)}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parcelaImpressaoRedeSearch">{t('newCampaign.searchImpressionShare')}</Label>
                  <Input
                    id="parcelaImpressaoRedeSearch"
                    type="number"
                    step="0.1"
                    value={formData.parcelaImpressaoRedeSearch}
                    onChange={(e) => handleInputChange('parcelaImpressaoRedeSearch', e.target.value)}
                    placeholder="0.0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isParteSuperiorPesquisa">{t('newCampaign.topImpressionShare')}</Label>
                  <Input
                    id="isParteSuperiorPesquisa"
                    type="number"
                    step="0.1"
                    value={formData.isParteSuperiorPesquisa}
                    onChange={(e) => handleInputChange('isParteSuperiorPesquisa', e.target.value)}
                    placeholder="0.0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isPrimeiraPosicaoPesquisa">{t('newCampaign.firstPositionShare')}</Label>
                  <Input
                    id="isPrimeiraPosicaoPesquisa"
                    type="number"
                    step="0.1"
                    value={formData.isPrimeiraPosicaoPesquisa}
                    onChange={(e) => handleInputChange('isPrimeiraPosicaoPesquisa', e.target.value)}
                    placeholder="0.0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parcelaImpressaoPerdidaClassificacao">{t('newCampaign.lostImpressionQuality')}</Label>
                  <Input
                    id="parcelaImpressaoPerdidaClassificacao"
                    type="number"
                    step="0.1"
                    value={formData.parcelaImpressaoPerdidaClassificacao}
                    onChange={(e) => handleInputChange('parcelaImpressaoPerdidaClassificacao', e.target.value)}
                    placeholder="0.0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parcelaImpressaoPerdidaOrcamento">{t('newCampaign.lostImpressionBudget')}</Label>
                  <Input
                    id="parcelaImpressaoPerdidaOrcamento"
                    type="number"
                    step="0.1"
                    value={formData.parcelaImpressaoPerdidaOrcamento}
                    onChange={(e) => handleInputChange('parcelaImpressaoPerdidaOrcamento', e.target.value)}
                    placeholder="0.0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            {t('newCampaign.cancel')}
          </Button>
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-primary to-primary/80">
            <Plus className="h-4 w-4 mr-2" />
            {t('newCampaign.createCampaign')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default NewCampaignModal