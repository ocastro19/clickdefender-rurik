import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GoogleAdsAccount } from './GoogleAdsAccountsTable'

interface AccountAddModalProps {
  isOpen: boolean
  onSave: (account: Omit<GoogleAdsAccount, 'id'>) => void
  onClose: () => void
}

export const AccountAddModal: React.FC<AccountAddModalProps> = ({
  isOpen,
  onSave,
  onClose
}) => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: 'Ativa' as GoogleAdsAccount['status'],
    balance: 0,
    pendingInvoice: 0,
    lastActivity: 'Hoje'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
    // Reset form
    setFormData({
      name: '',
      email: '',
      status: 'Ativa',
      balance: 0,
      pendingInvoice: 0,
      lastActivity: 'Hoje'
    })
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('accountManagement.addNewAccount')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('accountManagement.accountName')}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ex: Personal-05"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('accountManagement.email')}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="email@exemplo.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">{t('accountManagement.status')}</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ativa">Ativa</SelectItem>
                <SelectItem value="Pausada">Pausada</SelectItem>
                <SelectItem value="Suspensa">Suspensa</SelectItem>
                <SelectItem value="Devedor">Devedor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance">{t('accountManagement.balance')}</Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              value={formData.balance}
              onChange={(e) => handleInputChange('balance', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pendingInvoice">{t('accountManagement.pendingInvoice')}</Label>
            <Input
              id="pendingInvoice"
              type="number"
              step="0.01"
              value={formData.pendingInvoice}
              onChange={(e) => handleInputChange('pendingInvoice', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
              {t('accountManagement.addAccount')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}