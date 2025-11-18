/**
 * Parser específico para valores de orçamento no formato brasileiro
 * Converte valores como "1.200,00" para float 1200.00
 */

export function parseOrcamentoBRL(valor: string | number): number {
  // Se já é um número, retorna diretamente
  if (typeof valor === 'number') {
    return valor
  }

  if (!valor || typeof valor !== 'string') {
    return 0
  }

  // Remove espaços e converte para string
  let cleanValue = valor.toString().trim()

  // Remove símbolos de moeda (R$, $, €, etc.)
  cleanValue = cleanValue.replace(/[R$€£¥₹]/g, '')

  // Remove espaços extras
  cleanValue = cleanValue.trim()

  // Se está vazio após limpeza, retorna 0
  if (!cleanValue || cleanValue === '-' || cleanValue === '--') {
    return 0
  }

  // Detecta formato brasileiro: "1.200,00" ou "1.200"
  // vs formato americano: "1,200.00" ou "1200"
  
  // Se contém vírgula como último separador decimal (formato brasileiro)
  if (cleanValue.includes(',') && cleanValue.lastIndexOf(',') > cleanValue.lastIndexOf('.')) {
    // Formato brasileiro: "1.200,50" ou "1.200.500,75"
    // Remove pontos (separadores de milhar) e troca vírgula por ponto
    cleanValue = cleanValue.replace(/\./g, '').replace(',', '.')
  } else if (cleanValue.includes('.') && !cleanValue.includes(',')) {
    // Se só tem ponto, pode ser decimal americano ou separador de milhar brasileiro
    const parts = cleanValue.split('.')
    if (parts.length === 2 && parts[1].length <= 2) {
      // Provavelmente é decimal: "1200.50"
      cleanValue = cleanValue
    } else if (parts.length > 2 || (parts.length === 2 && parts[1].length > 2)) {
      // Provavelmente é separador de milhar brasileiro: "1.200" ou "1.200.500"
      cleanValue = cleanValue.replace(/\./g, '')
    }
  }

  // Converte para float
  const result = parseFloat(cleanValue)
  
  // Retorna 0 se não conseguiu converter
  return isNaN(result) ? 0 : result
}

/**
 * Formata um valor numérico para exibição em formato brasileiro
 * Exemplo: 1200.50 → "R$ 1.200,50"
 */
export function formatOrcamentoBRL(valor: number | null | undefined): string {
  if (!valor && valor !== 0) {
    return 'R$ 0,00'
  }

  return `R$ ${valor.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

/**
 * Formata um valor para exibição sem símbolo de moeda
 * Exemplo: 1200.50 → "1.200,50"
 */
export function formatNumberBRL(valor: number | null | undefined): string {
  if (!valor && valor !== 0) {
    return '0,00'
  }

  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}