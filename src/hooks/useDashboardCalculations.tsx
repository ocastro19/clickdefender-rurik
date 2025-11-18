// Stub simples para cálculos do dashboard
export interface DashboardCalculations {
  totalInvestment: number
  totalRevenue: number
  totalProfit: number
  avgROI: number
}

export interface DashboardMetrics {
  totalInvestment: number
  totalRevenue: number
  totalProfit: number
  avgROI: number
  totalInvestido: number
  totalFaturado: number
  lucroTotal: number
  roiMedio: number
  roasMedia: number
  campanhasAtivas: number
  impressoesTotais: number
  cliquesTotais: number
  ctrMedio: number
  cpcMedio: number
  conversoes: number
  taxaConversaoMedia: number
}

export const useDashboardCalculations = (params?: any): DashboardCalculations => {
  return {
    totalInvestment: 0,
    totalRevenue: 0,
    totalProfit: 0,
    avgROI: 0
  }
}