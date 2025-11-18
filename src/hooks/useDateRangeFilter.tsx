// Stub simples para filtro de data
import { useState } from 'react'

export const useDateRangeFilter = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date(),
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  
  return {
    dateRange,
    setDateRange,
    setStartDate: (date: any) => {},
    setEndDate: (date: any) => {},
    applyDateFilter: () => {},
    clearDateFilter: () => {},
    isViewingHistory: false,
    hasDateFilter: false,
    isFiltered: false,
    resetFilter: () => {}
  }
}