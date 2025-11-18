import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Payment } from './PaymentSchedule'
import { DollarSign, BarChart3, Bell } from 'lucide-react'

interface PaymentModalProps {
  onSave: (payment: Omit<Payment, 'id'>) => void
  onCancel: () => void
  payment?: Payment
}

const platforms = [
  'AdCombo', 'BuyGoods', 'ClickBank', 'DigiStore24', 'Dr. Cash', 'Everflow',
  'GuruMedia', 'Hotmart', 'JVZoo', 'MaxWeb', 'MediaScalers', 'Monetizze',
  'SmashLoud', 'TrafficLight', 'Warrior Plus', 'Webvork'
].sort()

export const PaymentModal: React.FC<PaymentModalProps> = ({
  onSave,
  onCancel,
  payment
}) => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    platform: payment?.platform || '',
    customPlatform: '',
    amount: payment?.amount.toString() || '',
    date: payment?.date || '',
    period: payment?.period || '',
    notes: payment?.notes || '',
    notifyOnDay: true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.platform || !formData.amount || !formData.date) {
      return
    }

    const finalPlatform = formData.platform === 'Outra' ? formData.customPlatform : formData.platform

    onSave({
      platform: finalPlatform,
      amount: parseFloat(formData.amount),
      date: formData.date,
      period: formData.period,
      notes: formData.notes,
      status: 'programado'
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="platform">🏢 {t('payments.platform')}</Label>
          <Select value={formData.platform} onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}>
            <SelectTrigger>
              <SelectValue placeholder={t('payments.selectPlatform')} />
            </SelectTrigger>
            <SelectContent>
              {platforms.map(platform => (
                <SelectItem key={platform} value={platform}>
                  {platform}
                </SelectItem>
              ))}
              <SelectItem value="Outra">➕ {t('payments.addPlatform')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.platform === 'Outra' && (
          <div>
            <Label htmlFor="customPlatform">✏️ {t('payments.platformName')}</Label>
            <Input
              id="customPlatform"
              value={formData.customPlatform}
              onChange={(e) => setFormData(prev => ({ ...prev, customPlatform: e.target.value }))}
              placeholder={t('payments.enterPlatformName')}
              required
            />
          </div>
        )}

        <div>
          <Label htmlFor="amount" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            {t('payments.expectedValue')}
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">R$</span>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              className="pl-10"
              placeholder="0,00"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="date">📅 {t('payments.paymentDate')}</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="period" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t('payments.periodReference')}
          </Label>
          <Input
            id="period"
            value={formData.period}
            onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
            placeholder={t('payments.periodPlaceholder')}
          />
        </div>

        <div>
          <Label htmlFor="notes">📝 {t('payments.observations')}</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder={t('payments.observationsPlaceholder')}
            rows={3}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="notify"
            checked={formData.notifyOnDay}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, notifyOnDay: checked as boolean }))}
          />
          <Label htmlFor="notify" className="text-sm flex items-center gap-2">
            <Bell className="h-4 w-4" />
            {t('payments.notifyOnDay')}
          </Label>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          {t('common.cancel')}
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70"
        >
          {t('payments.savePayment')}
        </Button>
      </div>
    </form>
  )
}