// Stub simples para manter compatibilidade
export interface CampaignMetrics {
  ctr: number
  cpcMedio: number
  custo: number
  custoConversao: number
  taxaConversao: number
  cpm: number
  roas: number
  roi: number
  lucro: number
  cpvMedio: number
  vtr: number
  faturamento: number
  valorConversao: number
}

export const calculateCampaignMetrics = (params: any): CampaignMetrics => {
  const { impressoes = 0, cliques = 0, custo = 0, conversoes = 0, faturamento = 0 } = params
  
  return {
    ctr: impressoes > 0 ? (cliques / impressoes) * 100 : 0,
    cpcMedio: cliques > 0 ? custo / cliques : 0,
    custo,
    custoConversao: conversoes > 0 ? custo / conversoes : 0,
    taxaConversao: cliques > 0 ? (conversoes / cliques) * 100 : 0,
    cpm: impressoes > 0 ? (custo / impressoes) * 1000 : 0,
    roas: custo > 0 ? faturamento / custo : 0,
    roi: custo > 0 ? ((faturamento - custo) / custo) * 100 : 0,
    lucro: faturamento - custo,
    cpvMedio: 0,
    vtr: 0,
    faturamento,
    valorConversao: conversoes > 0 ? faturamento / conversoes : 0
  }
}

export const formatCurrency = (value: number, currency: 'BRL' | 'USD' = 'USD'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency
  }).format(value)
}

export const getCurrencySymbol = (currency: 'BRL' | 'USD' = 'USD'): string => {
  return currency === 'BRL' ? 'R$' : 'US$'
}