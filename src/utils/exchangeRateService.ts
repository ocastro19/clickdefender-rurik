
interface AwesomeAPIResponse {
  USDBRL: {
    code: string
    codein: string
    name: string
    high: string
    low: string
    varBid: string
    pctChange: string
    bid: string
    ask: string
    timestamp: string
    create_date: string
  }
}

interface ExchangeRateData {
  rate: number
  timestamp: string
  lastUpdate: Date
}

// Cache para evitar muitas requisições
let cachedExchangeRate: ExchangeRateData | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

export const fetchUSDToBRLRate = async (): Promise<ExchangeRateData> => {
  // Verificar se tem cache válido
  if (cachedExchangeRate && 
      new Date().getTime() - cachedExchangeRate.lastUpdate.getTime() < CACHE_DURATION) {
    return cachedExchangeRate
  }

  try {
    const response = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL')
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`)
    }

    const data: AwesomeAPIResponse = await response.json()
    
    const exchangeRateData: ExchangeRateData = {
      rate: parseFloat(data.USDBRL.bid),
      timestamp: data.USDBRL.timestamp,
      lastUpdate: new Date()
    }

    // Atualizar cache
    cachedExchangeRate = exchangeRateData
    
    return exchangeRateData
  } catch (error) {
    console.error('Erro ao buscar cotação:', error)
    
    // Fallback para cotação padrão se a API falhar
    const fallbackRate: ExchangeRateData = {
      rate: 5.50, // Valor padrão de fallback
      timestamp: Date.now().toString(),
      lastUpdate: new Date()
    }
    
    return fallbackRate
  }
}

export const formatExchangeRate = (rate: number): string => {
  return `R$ ${rate.toFixed(4)}`
}

export const getCachedRate = (): ExchangeRateData | null => {
  return cachedExchangeRate
}
