
import { useState, useCallback, useEffect } from 'react'

export const useColumnOrder = <T extends { key: string; order: number; visible: boolean }>(initialColumns: T[]) => {
  const [columns, setColumns] = useState<T[]>(() => {
    // Tentar carregar ordem salva do localStorage
    const saved = localStorage.getItem('analytics-column-order')
    if (saved) {
      try {
        const savedOrder = JSON.parse(saved)
        return initialColumns.map(col => ({
          ...col,
          order: savedOrder[col.key] || col.order
        })).sort((a, b) => a.order - b.order)
      } catch {
        return initialColumns.sort((a, b) => a.order - b.order)
      }
    }
    return initialColumns.sort((a, b) => a.order - b.order)
  })

  const reorderColumns = useCallback((activeId: string, overId: string) => {
    setColumns(items => {
      const activeIndex = items.findIndex(item => item.key === activeId)
      const overIndex = items.findIndex(item => item.key === overId)

      if (activeIndex !== overIndex) {
        const newItems = [...items]
        const [reorderedItem] = newItems.splice(activeIndex, 1)
        newItems.splice(overIndex, 0, reorderedItem)

        // Recalcular orders
        const reorderedWithNewOrder = newItems.map((item, index) => ({
          ...item,
          order: index + 1
        }))

        // Salvar no localStorage
        const orderMap = reorderedWithNewOrder.reduce((acc, item) => {
          acc[item.key] = item.order
          return acc
        }, {} as Record<string, number>)
        localStorage.setItem('analytics-column-order', JSON.stringify(orderMap))

        return reorderedWithNewOrder
      }

      return items
    })
  }, [])

  const toggleColumnVisibility = useCallback((columnKey: string) => {
    setColumns(prev => prev.map(col => 
      col.key === columnKey ? { ...col, visible: !col.visible } : col
    ))
  }, [])

  return {
    columns,
    setColumns,
    reorderColumns,
    toggleColumnVisibility
  }
}
