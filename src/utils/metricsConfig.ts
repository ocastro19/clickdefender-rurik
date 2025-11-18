// Stub simples para configuração de métricas
export const getMetricsConfig = (t?: any) => {
  return {
    campanha: { label: 'Campanha', type: 'text' },
    orcamento: { label: 'Orçamento', type: 'currency' },
    custo: { label: 'Custo', type: 'currency' },
    conversoes: { label: 'Conversões', type: 'number' }
  }
}

export const getMetricConfig = (metricKey: string) => {
  return getMetricsConfig(metricKey)
}

export const METRIC_COLUMNS = [
  'campanha',
  'data', 
  'orcamento',
  'custo',
  'conversoes',
  'roi'
]

export const HIDDEN_IN_EDIT = ['id', 'data']