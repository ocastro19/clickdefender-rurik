import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, Plus, DollarSign, Edit, CheckCircle, AlertTriangle, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PaymentModal } from './PaymentModal'
import PaymentEditModal from './PaymentEditModal'
import { useGlobalCurrencyFormatter } from '@/hooks/useGlobalCurrencyFormatter'
import { useIsMobile } from '@/hooks/use-mobile'

export interface Payment {
  id: string
  platform: string
  amount: number
  date: string
  period: string
  notes?: string
  status: 'programado' | 'recebido' | 'atrasado'
}

interface PaymentScheduleProps {
  payments: Payment[]
  onAddPayment: (payment: Omit<Payment, 'id'>) => void
  onUpdatePayment: (payment: Payment) => void
  onDeletePayment: (paymentId: string) => void
}

const PaymentSchedule: React.FC<PaymentScheduleProps> = ({ 
  payments, 
  onAddPayment, 
  onUpdatePayment, 
  onDeletePayment 
}) => {
  const { t } = useTranslation()
  const { formatGlobalCurrency } = useGlobalCurrencyFormatter()
  const isMobile = useIsMobile()
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)

  const today = new Date().toISOString().split('T')[0]
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const todayPayments = payments.filter(p => p.date === today)
  const next7DaysPayments = payments.filter(p => p.date > today && p.date <= nextWeek)
  const thisMonthPayments = payments.filter(p => {
    const paymentDate = new Date(p.date)
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    return paymentDate.getMonth() === currentMonth && 
           paymentDate.getFullYear() === currentYear &&
           p.date > nextWeek
  })


  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const PaymentItem = ({ payment, showDays = false }: { payment: Payment; showDays?: boolean }) => (
    <div className={`${isMobile ? 'flex flex-col' : 'flex items-center justify-between'} p-3 sm:p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors group`}>
      <div className={`flex items-center gap-2 sm:gap-3 ${isMobile ? 'mb-2' : ''}`}>
        <div className="p-1.5 sm:p-2 rounded-lg bg-success/10">
          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
        </div>
        <div className="flex-1">
          <div className="font-medium text-foreground text-sm sm:text-base">{payment.platform}</div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            {formatDate(payment.date)}
            {showDays && (
              <span className="ml-2">
                ({getDaysUntil(payment.date)} {isMobile ? 'd' : t('financial.days')})
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className={`flex items-center ${isMobile ? 'justify-between' : 'gap-3'}`}>
        <div className={`${isMobile ? 'flex-1' : 'text-right'}`}>
          <div className="text-sm sm:text-lg font-bold text-success">
            {isMobile 
              ? formatGlobalCurrency(payment.amount, 'USD').replace('US$', '$')
              : formatGlobalCurrency(payment.amount, 'USD')
            }
          </div>
          <Badge variant="outline" className="text-xs">
            {payment.status === 'programado' ? (
              isMobile ? <Clock className="h-4 w-4 text-primary" /> : 
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                {t('financial.scheduled')}
              </span>
            ) :
             payment.status === 'recebido' ? (
               isMobile ? <CheckCircle className="h-4 w-4 text-success" /> : 
               <span className="flex items-center gap-1.5">
                 <CheckCircle className="h-4 w-4 text-success" />
                 {t('financial.received')}
               </span>
             ) : (
               isMobile ? <AlertTriangle className="h-4 w-4 text-warning" /> :
               <span className="flex items-center gap-1.5">
                 <AlertTriangle className="h-4 w-4 text-warning" />
                 {t('financial.late')}
               </span>
             )}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditingPayment(payment)}
          className={`${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity h-7 w-7 sm:h-8 sm:w-8 p-0`}
        >
          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </div>
  )

  return (
    <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-premium hover:shadow-glow transition-all duration-500">
      <CardHeader className="pb-3 sm:pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle className="text-base sm:text-xl lg:text-2xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
            <div className="p-1 sm:p-2 rounded-md sm:rounded-lg bg-gradient-to-r from-primary to-primary/80">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            <span className="block sm:hidden">{t('financial.schedule')}</span>
            <span className="hidden sm:block">{t('financial.paymentSchedule')}</span>
          </CardTitle>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 text-xs sm:text-sm h-8 sm:h-10">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="block sm:hidden">{t('financial.add')}</span>
                <span className="hidden sm:block">{t('financial.addPayment')}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-2 sm:mx-auto">
              <DialogHeader>
                <DialogTitle className="text-sm sm:text-base">{t('financial.newPayment')}</DialogTitle>
              </DialogHeader>
              <PaymentModal
                onSave={(payment) => {
                  onAddPayment(payment)
                  setShowAddModal(false)
                }}
                onCancel={() => setShowAddModal(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <div className="space-y-4 sm:space-y-6">
          {/* HOJE */}
          {todayPayments.length > 0 && (
            <div>
              <h3 className="text-sm sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                📅 <span className="block sm:hidden">{t('financial.today')}</span>
                <span className="hidden sm:block">{t('financial.today')} ({formatDate(today)})</span>
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {todayPayments.map(payment => (
                  <PaymentItem key={payment.id} payment={payment} />
                ))}
              </div>
            </div>
          )}

          {/* PRÓXIMOS 7 DIAS */}
          {next7DaysPayments.length > 0 && (
            <div>
              <h3 className="text-sm sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                📅 <span className="block sm:hidden">{t('financial.next7Days')}</span>
                <span className="hidden sm:block">{t('financial.next7Days')}</span>
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {next7DaysPayments.map(payment => (
                  <PaymentItem key={payment.id} payment={payment} showDays />
                ))}
              </div>
            </div>
          )}

          {/* ESTE MÊS */}
          {thisMonthPayments.length > 0 && (
            <div>
              <h3 className="text-sm sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                📅 <span className="block sm:hidden">{t('financial.thisMonth')}</span>
                <span className="hidden sm:block">{t('financial.thisMonth')}</span>
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {thisMonthPayments.map(payment => (
                  <PaymentItem key={payment.id} payment={payment} showDays />
                ))}
              </div>
            </div>
          )}

          {payments.length === 0 && (
            <div className="text-center py-6 sm:py-8 text-muted-foreground">
              <Calendar className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
              <p className="text-sm sm:text-base">{t('financial.noPaymentsScheduled')}</p>
              <p className="text-xs sm:text-sm">{t('financial.clickAddPayment')}</p>
            </div>
          )}
        </div>

        {/* Payment Edit Modal */}
        <PaymentEditModal
          isOpen={!!editingPayment}
          onClose={() => setEditingPayment(null)}
          payment={editingPayment || undefined}
          onSave={onUpdatePayment}
          onDelete={onDeletePayment}
        />
      </CardContent>
    </Card>
  )
}

export default PaymentSchedule