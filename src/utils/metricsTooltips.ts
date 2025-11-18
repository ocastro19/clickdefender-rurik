// Stub simples para tooltips
export const getMetricTooltip = (metricKey: string, t?: any): string => {
  const tooltips: Record<string, string> = {
    'orcamento': 'Orçamento definido para a campanha',
    'custo': 'Valor investido na campanha',
    'faturamento': 'Receita gerada pela campanha',
    'lucro': 'Lucro = Faturamento - Custo',
    'roi': 'Retorno sobre investimento',
    'conversoes': 'Número de conversões',
    'comissao': 'Comissão por conversão'
  }
  
  return tooltips[metricKey] || 'Métrica da campanha'
}