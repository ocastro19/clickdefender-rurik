
import { useCallback } from 'react'
import { Campaign } from '@/contexts/CampaignContext'

interface Column {
  key: keyof Campaign
  label: string
  visible: boolean
}

export const useExportCSV = () => {
  const formatCellValue = (value: any, columnKey: keyof Campaign): string => {
    if (value === undefined || value === null) return ''
    
    if (typeof value === 'number') {
      if (columnKey.includes('custo') || columnKey.includes('orcamento') || columnKey === 'comissao') {
        return value.toFixed(2)
      }
      if (columnKey.includes('ctr') || columnKey.includes('taxa') || columnKey.includes('parcela') || columnKey.includes('IS')) {
        return value.toFixed(2)
      }
      return value.toString()
    }
    
    return String(value).replace(/"/g, '""') // Escape quotes for CSV
  }

  const exportToCSV = useCallback((campaigns: Campaign[], columns: Column[], filename?: string) => {
    const visibleColumns = columns.filter(col => col.visible)
    
    // Create CSV header
    const headers = visibleColumns.map(col => `"${col.label}"`).join(',')
    
    // Create CSV rows
    const rows = campaigns.map(campaign => 
      visibleColumns.map(col => {
        const value = formatCellValue(campaign[col.key], col.key)
        return `"${value}"`
      }).join(',')
    )
    
    // Combine header and rows
    const csvContent = [headers, ...rows].join('\n')
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', filename || `campanhas-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }, [])

  return { exportToCSV }
}
