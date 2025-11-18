import React, { useState } from 'react'
import { X, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GoogleAdsAccount } from './GoogleAdsAccountsTable'

interface AccountEditModalProps {
  account: GoogleAdsAccount
  onSave: (updatedAccount: GoogleAdsAccount) => void
  onClose: () => void
}

export const AccountEditModal: React.FC<AccountEditModalProps> = ({
  account,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState({
    name: account.name,
    email: account.email,
    status: account.status,
    balance: account.balance.toString(),
    pendingInvoice: account.pendingInvoice.toString()
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const updatedAccount: GoogleAdsAccount = {
      ...account,
      name: formData.name,
      email: formData.email,
      status: formData.status as GoogleAdsAccount['status'],
      balance: parseFloat(formData.balance),
      pendingInvoice: parseFloat(formData.pendingInvoice)
    }
    
    onSave(updatedAccount)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">Editar Conta Google Ads</h2>
            <p className="text-sm text-muted-foreground">Atualize as informações da conta</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="name">Nome da Conta</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Personal-01"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="email@exemplo.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as GoogleAdsAccount['status'] }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ativa">✅ Ativa</SelectItem>
                <SelectItem value="Pausada">🟡 Pausada</SelectItem>
                <SelectItem value="Suspensa">🔴 Suspensa</SelectItem>
                <SelectItem value="Devedor">⚠️ Devedor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="balance">Saldo (R$)</Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              value={formData.balance}
              onChange={(e) => setFormData(prev => ({ ...prev, balance: e.target.value }))}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="pendingInvoice">Fatura Pendente (R$)</Label>
            <Input
              id="pendingInvoice"
              type="number"
              step="0.01"
              value={formData.pendingInvoice}
              onChange={(e) => setFormData(prev => ({ ...prev, pendingInvoice: e.target.value }))}
              placeholder="0.00"
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}