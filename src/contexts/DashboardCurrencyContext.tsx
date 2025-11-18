import React, { createContext, useContext, useState, ReactNode } from 'react'

type DashboardCurrency = 'BRL' | 'USD'

interface DashboardCurrencyContextType {
  dashboardCurrency: DashboardCurrency
  setDashboardCurrency: (currency: DashboardCurrency) => void
  exchangeRate: number | null
}

const DashboardCurrencyContext = createContext<DashboardCurrencyContextType | undefined>(undefined)

export const DashboardCurrencyProvider: React.FC<{ children: ReactNode; exchangeRate: number | null }> = ({ 
  children, 
  exchangeRate 
}) => {
  const [dashboardCurrency, setDashboardCurrency] = useState<DashboardCurrency>('USD') // Fixo em USD

  return (
    <DashboardCurrencyContext.Provider value={{
      dashboardCurrency,
      setDashboardCurrency,
      exchangeRate
    }}>
      {children}
    </DashboardCurrencyContext.Provider>
  )
}

export const useDashboardCurrency = () => {
  const context = useContext(DashboardCurrencyContext)
  if (context === undefined) {
    throw new Error('useDashboardCurrency must be used within a DashboardCurrencyProvider')
  }
  return context
}

// Função para converter valores baseado na moeda do dashboard
export const convertCurrencyForDashboard = (
  value: number,
  originalCurrency: 'BRL' | 'USD',
  dashboardCurrency: 'BRL' | 'USD',
  exchangeRate: number | null
): number => {
  console.log('=== CONVERT CURRENCY ===')
  console.log('Value:', value)
  console.log('Original Currency:', originalCurrency)
  console.log('Dashboard Currency:', dashboardCurrency)
  console.log('Exchange Rate:', exchangeRate)
  
  // Se as moedas são iguais, não converter
  if (originalCurrency === dashboardCurrency) {
    console.log('Same currency, no conversion needed')
    return value
  }
  
  // Se não há taxa de câmbio, usar valor original
  if (!exchangeRate || exchangeRate <= 0) {
    console.log('No exchange rate available, returning original value')
    return value
  }
  
  // Converter USD para BRL
  if (originalCurrency === 'USD' && dashboardCurrency === 'BRL') {
    const converted = value * exchangeRate
    console.log('Converting USD to BRL:', value, '*', exchangeRate, '=', converted)
    return converted
  }
  
  // Converter BRL para USD
  if (originalCurrency === 'BRL' && dashboardCurrency === 'USD') {
    const converted = value / exchangeRate
    console.log('Converting BRL to USD:', value, '/', exchangeRate, '=', converted)
    return converted
  }
  
  console.log('No matching conversion case, returning original value')
  return value
}