import { useState, useEffect } from 'react'

interface ExchangeRate {
  USDBRL: {
    bid: string
    ask: string
    pctChange: string
  }
}

export const useExchangeRate = () => {
  const [exchangeRate, setExchangeRate] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL')
        
        if (!response.ok) {
          throw new Error('Falha ao buscar cotação')
        }
        
        const data: ExchangeRate = await response.json()
        const rate = parseFloat(data.USDBRL.bid)
        
        setExchangeRate(rate)
        setError(null)
      } catch (err) {
        setError('Erro ao carregar cotação')
        console.error('Erro ao buscar cotação:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchExchangeRate()
    
    // Atualizar a cada 5 minutos
    const interval = setInterval(fetchExchangeRate, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  return { exchangeRate, loading, error }
}