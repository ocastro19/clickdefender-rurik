// Stub simples para layout do dashboard
import { useState } from 'react'

export interface DashboardChart {
  id: string
  title: string
  component: any
}

export const useDashboardLayout = (charts?: any) => {
  const [layout, setLayout] = useState([])
  
  return {
    layout,
    setLayout,
    resetLayout: () => {},
    saveLayout: () => {},
    updateChartOrder: (items: any) => {},
    getOrderedCharts: () => charts || [],
    visibleCharts: new Set(),
    toggleChartVisibility: (chartId: any) => {},
    getVisibleChartsCount: () => 0,
    getTotalChartsCount: () => 0
  }
}