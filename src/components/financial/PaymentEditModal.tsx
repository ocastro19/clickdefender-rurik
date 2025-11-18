import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, DollarSign, Edit, Trash2, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { useGlobalCurrencyFormatter } from '@/hooks/useGlobalCurrencyFormatter'
import { useExchangeRate } from '@/hooks/useExchangeRate'
import { Payment } from './PaymentSchedule'

interface PaymentEditModalProps {
  isOpen: boolean
  onClose: () => void
  payment?: Payment
  onSave: (payment: Payment) => void
  onDelete?: (paymentId: string) => void
}

const PaymentEditModal: React.FC<PaymentEditModalProps> = ({ 
  isOpen, 
  onClose, 
  payment, 
  onSave,
  onDelete 
}) => {
  const { t } = useTranslation()
  const { formatGlobalCurrency } = useGlobalCurrencyFormatter()
  const { exchangeRate } = useExchangeRate()

  const [formData, setFormData] = useState({
    platform: '',
    amount: '',
    date: '',
    period: '',
    notes: '',
    status: 'programado' as 'programado' | 'recebido' | 'atrasado'
  })

  useEffect(() => {
    if (payment) {
      setFormData({
        platform: payment.platform,
        amount: payment.amount.toString(),
        date: payment.date,
        period: payment.period,
        notes: payment.notes || '',
        status: payment.status
      })
    } else {
      setFormData({
        platform: '',
        amount: '',
        date: '',
        period: '',
        notes: '',
        status: 'programado'
      })
    }
  }, [payment])

  const handleSave = () => {
    if (!formData.platform || !formData.amount || !formData.date || !formData.period) {
      return
    }

    const paymentData: Payment = {
      id: payment?.id || Date.now().toString(),
      platform: formData.platform,
      amount: parseFloat(formData.amount),
      date: formData.date,
      period: formData.period,
      notes: formData.notes,
      status: formData.status
    }

    onSave(paymentData)
    onClose()
  }

  const handleDelete = () => {
    if (payment && onDelete) {
      onDelete(payment.id)
      onClose()
    }
  }

  const convertedAmount = formData.amount ? 
    (parseFloat(formData.amount) * (exchangeRate || 5.5)) : 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
              <Edit className="h-5 w-5 text-white" />
            </div>
            {payment ? t('payments.editPayment') : t('payments.newPayment')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="platform">{t('payments.platform')}/Cliente</Label>
              <Input
                id="platform"
                placeholder="Ex: Google Ads, Facebook..."
                value={formData.platform}
                onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="period">{t('payments.periodReference')}</Label>
              <Input
                id="period"
                placeholder="Ex: Janeiro 2024"
                value={formData.period}
                onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
              />
            </div>
          </div>

          {/* Valor e Conversão */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Valor (USD) 💵</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              />
            </div>
            
            {formData.amount && exchangeRate && (
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        Conversão Real-time:
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-700">
                        {formatGlobalCurrency(convertedAmount, 'BRL')}
                      </p>
                      <p className="text-xs text-green-600">
                        Taxa: {exchangeRate?.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Data e Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Data de Recebimento</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="programado">⏰ Programado</SelectItem>
                  <SelectItem value="recebido">
                    <CheckCircle className="h-4 w-4 inline mr-1.5 text-success" />
                    Recebido
                  </SelectItem>
                  <SelectItem value="atrasado">
                    <AlertTriangle className="h-4 w-4 inline mr-1.5 text-warning" />
                    Atrasado
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Observações */}
          <div>
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Informações adicionais sobre este pagamento..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-between">
            <div>
              {payment && onDelete && (
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-gradient-to-r from-blue-500 to-purple-600">
                {payment ? 'Salvar Alterações' : 'Criar Pagamento'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PaymentEditModal