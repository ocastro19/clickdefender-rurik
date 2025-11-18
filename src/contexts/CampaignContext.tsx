import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { calculateCampaignMetrics } from '@/utils/campaignCalculations'
import { useDailySnapshot } from './DailySnapshotContext'

import { BudgetDiagnostic } from '@/utils/budgetDiagnostic'

export interface Campaign {
  id: string
  campanha: string
  data: string // Data da campanha
  orcamento: number
  impressoes: number
  cliques: number
  custo: number
  cpcMedio: number
  conversoes: number
  estrategiaLances: string
  currency: 'BRL' | 'USD'
  isFromGoogleAds?: boolean // Flag para identificar se veio do Google Ads
  
  // Campos calculados automaticamente
  ctr?: number
  custoConversao?: number
  taxaConversao?: number
  cpm?: number
  roi?: number
  lucro?: number
  
  // Campos opcionais/manuais
  parcelaImpressaoRedeSearch?: number
  isParteSuperiorPesquisa?: number
  isPrimeiraPosicaoPesquisa?: number
  cliquesInvalidos?: number
  comissao?: number // Sempre em USD
  visitors?: number
  checkouts?: number
  faturamento?: number
  parcelaImpressaoPerdidaOrcamento?: number
  parcelaImpressaoPerdidaClassificacao?: number
  exchangeRate?: number // Cotação USD/BRL da AwesomeAPI
  
  // Novas métricas adicionadas
  valorConversao?: number
  roas?: number
  cpcMaximo?: number
  cpvMedio?: number
  vtr?: number
  pontuacaoOtimizacao?: number
  statusCampanha?: string
  tipoCampanha?: string
  isActive?: boolean // Status ativo/pausado no sistema
  visualizacoes?: number // Para cálculo de CPV e VTR
  
  // Metadata do Google Ads (para multi-conta/multi-campanha)
  googleAdsCampaignId?: string // ID único da campanha no Google Ads
  googleAdsAccountId?: string // ID da conta do Google Ads
  webhookUserId?: string // ID do usuário que criou o webhook
  
  // Metas de rastreamento (Presell)
  conversionGoal?: string // Nome da meta de conversão
  checkoutGoal?: string // Nome da meta de checkout
  domain?: string // Domínio da presell
}

interface CampaignContextType {
  campaigns: Campaign[]
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>
  updateCampaign: (campaignId: string, field: keyof Campaign, value: any) => void
  deleteCampaign: (campaignId: string) => void
  addCampaign: (campaign: Campaign) => void
  addCampaignFromGoogleAds: (campaigns: Campaign[]) => void
  updateCampaignWithCalculations: (campaignId: string, updates: Partial<Campaign>) => void
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined)

const recalculateInitialCampaigns = (campaigns: Campaign[]): Campaign[] => {
  return campaigns.map(campaign => {
    const calculations = calculateCampaignMetrics({
      impressoes: campaign.impressoes,
      cliques: campaign.cliques,
      custo: campaign.custo,
      cpcMedio: campaign.cpcMedio,
      conversoes: campaign.conversoes,
      faturamento: campaign.faturamento,
      comissao: campaign.comissao,
      exchangeRate: campaign.exchangeRate || 5.50,
      valorConversao: campaign.valorConversao,
      visualizacoes: campaign.visualizacoes
    })
    
    return {
      ...campaign,
      currency: campaign.currency || 'USD',
      exchangeRate: campaign.exchangeRate || 5.50,
      ctr: calculations.ctr,
      cpcMedio: calculations.cpcMedio,
      custo: calculations.custo,
      custoConversao: calculations.custoConversao,
      taxaConversao: calculations.taxaConversao,
      cpm: calculations.cpm,
      roas: calculations.roas,
      roi: calculations.roi,
      lucro: calculations.lucro,
      cpvMedio: calculations.cpvMedio,
      vtr: calculations.vtr,
      
      faturamento: calculations.faturamento || campaign.faturamento,
      valorConversao: calculations.valorConversao || campaign.valorConversao
    }
  })
}

const initialCampaigns: Campaign[] = recalculateInitialCampaigns([
  {
    id: '1',
    campanha: 'LeanDrops™ - CD',
    data: '2025-07-22',
    orcamento: 1220.00,
    impressoes: 0,
    cliques: 0,
    custo: 0.00,
    cpcMedio: 0,
    conversoes: 0,
    estrategiaLances: 'Maximizar Conversões',
    currency: 'BRL',
    isActive: true,
  },
  {
    id: '2',
    campanha: 'BrainDefender™ - CD',
    data: '2025-07-22',
    orcamento: 1110.00,
    impressoes: 224,
    cliques: 29,
    custo: 519.55,
    cpcMedio: 17.92,
    conversoes: 1,
    estrategiaLances: 'Maximizar Conversões',
    currency: 'BRL',
    isActive: true,
  },
  {
    id: '3',
    campanha: 'GlycoShield™ - CD - 21/07 #3',
    data: '2025-07-22',
    orcamento: 5000.00,
    impressoes: 0,
    cliques: 0,
    custo: 0.00,
    cpcMedio: 0,
    conversoes: 0,
    estrategiaLances: 'Maximizar Conversões',
    currency: 'BRL',
    isActive: false,
  },
])

export const CampaignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('campaigns')
    return saved ? JSON.parse(saved) : initialCampaigns
  })

  // CRITICAL: Budget diagnostic on campaigns change
  useEffect(() => {
    if (campaigns.length > 0) {
      console.log('🔍 RUNNING BUDGET DIAGNOSTIC ON CONTEXT CHANGE')
      BudgetDiagnostic.logDetailedReport(campaigns)
    }
  }, [campaigns])

  // Integração com sistema de snapshots
  useEffect(() => {
    const handleHistoryView = () => {
      // Quando visualizar histórico, os dados já são carregados pelo HistoryDateFilter
      // Este efeito serve apenas para manter sincronização se necessário
    }

    // Listener para mudanças de visualização de histórico
    window.addEventListener('historyViewChange', handleHistoryView)
    return () => window.removeEventListener('historyViewChange', handleHistoryView)
  }, [])

  useEffect(() => {
    // CRITICAL: Enhanced localStorage saving with budget validation
    console.log('💾 SAVING TO LOCALSTORAGE - Budget validation:')
    campaigns.forEach(campaign => {
      console.log(`Campaign "${campaign.campanha}":`, {
        id: campaign.id,
        orcamento: campaign.orcamento,
        orcamentoType: typeof campaign.orcamento,
        source: campaign.isFromGoogleAds ? 'Google Ads' : 'Manual'
      })
    })
    
    localStorage.setItem('campaigns', JSON.stringify(campaigns))
  }, [campaigns])

  const updateCampaign = (campaignId: string, field: keyof Campaign, value: any) => {
    console.log(`🔄 UPDATE CAMPAIGN - Field: ${field}, Value: ${value}, Type: ${typeof value}`)
    
    setCampaigns(prev => prev.map(campaign => {
      if (campaign.id === campaignId) {
        const updated = { ...campaign, [field]: value }
        console.log(`Campaign "${campaign.campanha}" updated field "${field}":`, {
          oldValue: campaign[field],
          newValue: value,
          oldType: typeof campaign[field],
          newType: typeof value
        })
        return updated
      }
      return campaign
    }))
  }

  const deleteCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.filter(campaign => campaign.id !== campaignId))
  }

  const addCampaign = (campaign: Campaign) => {
    console.log('➕ ADD CAMPAIGN:', {
      id: campaign.id,
      campanha: campaign.campanha,
      orcamento: campaign.orcamento,
      orcamentoType: typeof campaign.orcamento,
      source: campaign.isFromGoogleAds ? 'Google Ads' : 'Manual'
    })
    
    setCampaigns(prev => [...prev, campaign])
  }

  const updateCampaignWithCalculations = (campaignId: string, updates: Partial<Campaign>) => {
    setCampaigns(prev => prev.map(campaign => {
      if (campaign.id === campaignId) {
        const updatedCampaign = { ...campaign, ...updates }
        
        // CRITICAL: Log budget changes specifically
        if ('orcamento' in updates) {
          console.log(`💰 BUDGET UPDATE for "${campaign.campanha}":`, {
            oldBudget: campaign.orcamento,
            newBudget: updates.orcamento,
            oldType: typeof campaign.orcamento,
            newType: typeof updates.orcamento
          })
        }
        
        // Para campanhas do Google Ads, preservar valores originais
        // Para edição manual, atualizar apenas os campos explicitamente alterados
        const needsCalculation = 
          'impressoes' in updates || 
          'cliques' in updates || 
          'custo' in updates || 
          'cpcMedio' in updates ||
          'conversoes' in updates ||
          'comissao' in updates ||
          'exchangeRate' in updates

        if (needsCalculation && !updatedCampaign.isFromGoogleAds) {
          // Para campanhas não-Google Ads, usar calculateCampaignMetrics normal
          const calculations = calculateCampaignMetrics({
            impressoes: updatedCampaign.impressoes,
            cliques: updatedCampaign.cliques,
            custo: updatedCampaign.custo,
            cpcMedio: updatedCampaign.cpcMedio,
            conversoes: updatedCampaign.conversoes,
            faturamento: updatedCampaign.faturamento,
            comissao: updatedCampaign.comissao,
            exchangeRate: updatedCampaign.exchangeRate || 5.50,
            valorConversao: updatedCampaign.valorConversao,
            visualizacoes: updatedCampaign.visualizacoes
          })
          
          // Atualizar todos os campos calculados
          Object.assign(updatedCampaign, calculations)
        }

        return updatedCampaign
      }
      return campaign
    }))
  }

  // Adicionar campanhas vindas do Google Ads
  const addCampaignFromGoogleAds = (newCampaigns: Campaign[]) => {
    console.log('🚀 ADD CAMPAIGNS FROM GOOGLE ADS:', newCampaigns.length)
    
    setCampaigns(prevCampaigns => {
      // Evitar duplicatas baseado no googleCampaignId
      const existingGoogleIds = prevCampaigns
        .filter(c => c.googleAdsCampaignId)
        .map(c => c.googleAdsCampaignId)
      
      const uniqueNewCampaigns = newCampaigns.filter(campaign => 
        !existingGoogleIds.includes(campaign.googleAdsCampaignId)
      )
      
      const updatedCampaigns = [...prevCampaigns, ...uniqueNewCampaigns]
      console.log(`✅ ${uniqueNewCampaigns.length} new campaigns added. Total: ${updatedCampaigns.length}`)
      
      return updatedCampaigns
    })
  }


  return (
    <CampaignContext.Provider value={{
      campaigns,
      setCampaigns,
      updateCampaign,
      deleteCampaign,
      addCampaign,
      addCampaignFromGoogleAds,
      updateCampaignWithCalculations
    }}>
      {children}
    </CampaignContext.Provider>
  )
}

export const useCampaigns = () => {
  const context = useContext(CampaignContext)
  if (context === undefined) {
    throw new Error('useCampaigns must be used within a CampaignProvider')
  }
  return context
}
