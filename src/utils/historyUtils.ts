
import { HistoryEntry } from '@/hooks/useChangeHistory'

export const formatHistoryValue = (value: any, field: string): string => {
  if (value === undefined || value === null) return '-'
  
  if (typeof value === 'number') {
    if (field.includes('custo') || field.includes('orcamento') || field === 'comissao' || field === 'cpcMedio' || field === 'custoConversao') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value)
    }
    if (field.includes('ctr') || field.includes('taxa') || field.includes('parcela') || field.includes('IS')) {
      return `${value.toFixed(2)}%`
    }
    return new Intl.NumberFormat('pt-BR').format(value)
  }
  
  return String(value)
}

export const formatHistoryMessage = (entry: HistoryEntry): string => {
  const oldFormatted = formatHistoryValue(entry.oldValue, entry.field)
  const newFormatted = formatHistoryValue(entry.newValue, entry.field)
  
  return `${entry.fieldLabel} alterado de ${oldFormatted} para ${newFormatted}`
}

export const formatHistoryDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj)
}
