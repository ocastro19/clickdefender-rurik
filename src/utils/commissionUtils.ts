import { formatCurrency } from './campaignCalculations'

export function formatCommissionDisplay(
  commission: number, 
  campaignCurrency: 'BRL' | 'USD', 
  exchangeRate?: number
): string {
  if (commission === 0) {
    return 'US$ 0,00'
  }

  const usdFormatted = formatCurrency(commission, 'USD')
  
  // Se a campanha for em USD, mostrar apenas USD
  if (campaignCurrency === 'USD') {
    return usdFormatted
  }
  
  // Se a campanha for em BRL, mostrar USD + equivalente BRL
  if (campaignCurrency === 'BRL' && exchangeRate) {
    const brlValue = commission * exchangeRate
    const brlFormatted = formatCurrency(brlValue, 'BRL')
    return `${usdFormatted} (≈ ${brlFormatted})`
  }
  
  // Fallback: apenas USD
  return usdFormatted
}