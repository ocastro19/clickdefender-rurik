import { useDashboardCurrency, convertCurrencyForDashboard } from '@/contexts/DashboardCurrencyContext'

// Hook para formatar valores monetários usando a moeda global selecionada
export const useGlobalCurrencyFormatter = () => {
  const { dashboardCurrency, exchangeRate } = useDashboardCurrency()
  
  const formatGlobalCurrency = (
    value: number, 
    originalCurrency: 'BRL' | 'USD' = 'USD'
  ): string => {
    // Converter o valor para a moeda do dashboard
    const convertedValue = convertCurrencyForDashboard(
      value,
      originalCurrency,
      dashboardCurrency,
      exchangeRate
    )
    
    // Formatar usando a moeda do dashboard
    const locale = dashboardCurrency === 'BRL' ? 'pt-BR' : 'en-US'
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: dashboardCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(convertedValue)
  }
  
  const formatGlobalCurrencyShort = (
    value: number, 
    originalCurrency: 'BRL' | 'USD' = 'USD'
  ): string => {
    // Converter o valor para a moeda do dashboard
    const convertedValue = convertCurrencyForDashboard(
      value,
      originalCurrency,
      dashboardCurrency,
      exchangeRate
    )
    
    // Formatar de forma compacta para valores grandes
    const locale = dashboardCurrency === 'BRL' ? 'pt-BR' : 'en-US'
    
    if (Math.abs(convertedValue) >= 1000000) {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: dashboardCurrency,
        notation: 'compact',
        compactDisplay: 'short',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      }).format(convertedValue)
    }
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: dashboardCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(convertedValue)
  }
  
  return {
    formatGlobalCurrency,
    formatGlobalCurrencyShort,
    dashboardCurrency,
    exchangeRate
  }
}