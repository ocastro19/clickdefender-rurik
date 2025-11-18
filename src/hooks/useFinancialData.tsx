import React, { useState, useCallback, useMemo } from 'react'
import { GoogleAdsAccount } from '@/components/financial/GoogleAdsAccountsTable'
import { Payment } from '@/components/financial/PaymentSchedule'
import { Notification } from '@/components/financial/NotificationSystem'

// Mock data for demonstration
const mockGoogleAdsAccounts: GoogleAdsAccount[] = [
  {
    id: '1',
    name: 'Personal-01',
    email: 'joao@gmail.com',
    status: 'Ativa',
    balance: 150.00,
    pendingInvoice: 0,
    lastActivity: 'Hoje'
  },
  {
    id: '2',
    name: 'Agency-02',
    email: 'ads@empresa.com',
    status: 'Suspensa',
    balance: -500.00,
    pendingInvoice: 500.00,
    lastActivity: '3 dias'
  },
  {
    id: '3',
    name: 'Business-03',
    email: 'marketing@loja.com',
    status: 'Pausada',
    balance: 0.00,
    pendingInvoice: 0,
    lastActivity: '1 semana'
  },
  {
    id: '4',
    name: 'Manager-04',
    email: 'gestor@digital.com',
    status: 'Devedor',
    balance: -750.00,
    pendingInvoice: 750.00,
    lastActivity: 'Ontem'
  }
]

const mockPayments: Payment[] = [
  {
    id: '1',
    platform: 'BuyGoods',
    amount: 2450.00,
    date: new Date().toISOString().split('T')[0], // Today
    period: 'Janeiro 2024',
    status: 'programado'
  },
  {
    id: '2',
    platform: 'ClickBank',
    amount: 1200.00,
    date: new Date().toISOString().split('T')[0], // Today
    period: 'Janeiro 2024',
    status: 'programado'
  },
  {
    id: '3',
    platform: 'Hotmart',
    amount: 3800.00,
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days
    period: 'Janeiro 2024',
    status: 'programado'
  },
  {
    id: '4',
    platform: 'Monetizze',
    amount: 1650.00,
    date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 days
    period: 'Janeiro 2024',
    status: 'programado'
  }
]

const generateCostRevenueData = (campaignCosts: number) => {
  return Array.from({ length: 30 }, (_, i) => ({
    day: (i + 1).toString(),
    revenue: campaignCosts * (1 + Math.random() * 0.5) / 30, // Distribute monthly cost over 30 days
    cost: campaignCosts / 30 + (Math.random() * campaignCosts * 0.1 / 30), // Some variation
    profit: 0 // Will be calculated
  })).map(item => ({
    ...item,
    profit: item.revenue - item.cost
  }))
}

const generateMockNotifications = (payments: Payment[], accounts: GoogleAdsAccount[]): Notification[] => {
  const notifications: Notification[] = []
  const today = new Date().toISOString().split('T')[0]
  
  // Payment notifications for today
  const todayPayments = payments.filter(p => p.date === today)
  todayPayments.forEach(payment => {
    notifications.push({
      id: `payment-${payment.id}`,
      type: 'payment_today',
      title: `Pagamento ${payment.platform}`,
      message: `${payment.platform} programado para HOJE`,
      amount: payment.amount,
      date: payment.date,
      platform: payment.platform,
      read: false,
      createdAt: new Date().toISOString()
    })
  })
  
  // Account debt notifications
  const debtAccounts = accounts.filter(acc => acc.balance < 0)
  debtAccounts.forEach(account => {
    notifications.push({
      id: `debt-${account.id}`,
      type: 'account_debt',
      title: 'Conta Google Ads',
      message: `${account.name} com saldo devedor`,
      amount: Math.abs(account.balance),
      account: account.name,
      read: false,
      createdAt: new Date().toISOString()
    })
  })
  
  // Suspended account notifications
  const suspendedAccounts = accounts.filter(acc => acc.status === 'Suspensa')
  suspendedAccounts.forEach(account => {
    notifications.push({
      id: `suspended-${account.id}`,
      type: 'account_suspended',
      title: 'Conta Suspensa',
      message: `${account.name} foi suspensa pelo Google`,
      account: account.name,
      read: false,
      createdAt: new Date().toISOString()
    })
  })
  
  return notifications
}

export const useFinancialData = (campaignCosts: number = 0) => {
  const [googleAdsAccounts, setGoogleAdsAccounts] = useState<GoogleAdsAccount[]>(mockGoogleAdsAccounts)
  const [payments, setPayments] = useState<Payment[]>(mockPayments)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [costRevenueData, setCostRevenueData] = useState(() => generateCostRevenueData(campaignCosts))

  // Update cost revenue data when campaign costs change
  React.useEffect(() => {
    setCostRevenueData(generateCostRevenueData(campaignCosts))
  }, [campaignCosts])

  React.useEffect(() => {
    setNotifications(generateMockNotifications(payments, googleAdsAccounts))
  }, [payments, googleAdsAccounts])

  // Summary calculations
  const summary = useMemo(() => {
    const totalReceivable = payments
      .filter(p => p.status === 'programado')
      .reduce((sum, payment) => sum + payment.amount, 0)
    const debtBalance = googleAdsAccounts
      .filter(acc => acc.balance < 0)
      .reduce((sum, acc) => sum + Math.abs(acc.balance), 0)
    const activeAccounts = googleAdsAccounts.filter(acc => acc.status === 'Ativa').length
    const totalAccounts = googleAdsAccounts.length
    const pausedAccounts = googleAdsAccounts.filter(acc => acc.status === 'Pausada').length
    const suspendedAccounts = googleAdsAccounts.filter(acc => acc.status === 'Suspensa').length

    return {
      campaignCosts,
      totalReceivable,
      debtBalance,
      activeAccounts,
      totalAccounts,
      pausedAccounts,
      suspendedAccounts
    }
  }, [campaignCosts, payments, googleAdsAccounts])

  // Google Ads account actions
  const handleViewAccountDetails = useCallback((account: GoogleAdsAccount) => {
    // This will be handled by the parent component to show modal
    return account
  }, [])

  const handleEditAccount = useCallback((account: GoogleAdsAccount) => {
    // This will be handled by the parent component to show modal
    return account
  }, [])

  const handleUpdateAccount = useCallback((updatedAccount: GoogleAdsAccount) => {
    setGoogleAdsAccounts(prev => 
      prev.map(acc => acc.id === updatedAccount.id ? updatedAccount : acc)
    )
  }, [])

  const handleDeleteAccount = useCallback((accountId: string) => {
    setGoogleAdsAccounts(prev => prev.filter(acc => acc.id !== accountId))
  }, [])

  const handleAddAccount = useCallback((newAccount: Omit<GoogleAdsAccount, 'id'>) => {
    const account: GoogleAdsAccount = {
      ...newAccount,
      id: `account-${Date.now()}`
    }
    setGoogleAdsAccounts(prev => [...prev, account])
  }, [])

  // Payment actions
  const handleAddPayment = useCallback((newPayment: Omit<Payment, 'id'>) => {
    const payment: Payment = {
      ...newPayment,
      id: `payment-${Date.now()}`
    }
    setPayments(prev => [...prev, payment])
  }, [])

  const handleUpdatePayment = useCallback((updatedPayment: Payment) => {
    setPayments(prev => prev.map(p => p.id === updatedPayment.id ? updatedPayment : p))
  }, [])

  const handleDeletePayment = useCallback((paymentId: string) => {
    setPayments(prev => prev.filter(p => p.id !== paymentId))
  }, [])

  // Notification actions
  const handleMarkAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
  }, [])

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const handleRemoveNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }, [])

  return {
    // Data
    summary,
    costRevenueData,
    googleAdsAccounts,
    payments,
    notifications,
    
    // Actions
    handleViewAccountDetails,
    handleEditAccount,
    handleUpdateAccount,
    handleDeleteAccount,
    handleAddAccount,
    handleAddPayment,
    handleUpdatePayment,
    handleDeletePayment,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleRemoveNotification
  }
}