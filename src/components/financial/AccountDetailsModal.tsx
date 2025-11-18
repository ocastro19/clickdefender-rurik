import React from 'react'
import { X, Calendar, Mail, CreditCard, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GoogleAdsAccount } from './GoogleAdsAccountsTable'

interface AccountDetailsModalProps {
  account: GoogleAdsAccount
  onClose: () => void
}

export const AccountDetailsModal: React.FC<AccountDetailsModalProps> = ({
  account,
  onClose
}) => {
  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativa': return 'text-success'
      case 'Suspensa': return 'text-destructive'
      case 'Pausada': return 'text-yellow-600'
      case 'Devedor': return 'text-orange-600'
      default: return 'text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ativa': return '✅'
      case 'Suspensa': return '🔴'
      case 'Pausada': return '🟡'
      case 'Devedor': return '⚠️'
      default: return '⚪'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Detalhes da Conta</h2>
              <p className="text-muted-foreground">Informações completas da conta Google Ads</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nome da Conta</label>
                <p className="text-lg font-semibold text-foreground">{account.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Associado
                </label>
                <p className="text-foreground">{account.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Última Atividade
                </label>
                <p className="text-foreground">{account.lastActivity}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status da Conta</label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl">{getStatusIcon(account.status)}</span>
                  <span className={`text-lg font-semibold ${getStatusColor(account.status)}`}>
                    {account.status}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Saldo Atual</label>
                <p className={`text-2xl font-bold ${account.balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(account.balance)}
                </p>
              </div>

              {account.pendingInvoice > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Fatura Pendente
                  </label>
                  <p className="text-xl font-bold text-destructive">
                    {formatCurrency(account.pendingInvoice)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Status Details */}
          <div className="border border-border rounded-lg p-4 bg-card/50">
            <h3 className="font-semibold text-foreground mb-3">Informações do Status</h3>
            
            {account.status === 'Ativa' && (
              <div className="flex items-center gap-2 text-success">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span>Conta funcionando normalmente. Campanhas ativas podem receber tráfego.</span>
              </div>
            )}

            {account.status === 'Suspensa' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Conta suspensa pelo Google</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Todas as campanhas estão pausadas. Entre em contato com o Google para resolver.
                </p>
              </div>
            )}

            {account.status === 'Pausada' && (
              <div className="flex items-center gap-2 text-yellow-600">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Conta pausada temporariamente. Campanhas não estão recebendo tráfego.</span>
              </div>
            )}

            {account.status === 'Devedor' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Saldo devedor detectado</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  É necessário quitar o saldo pendente para evitar suspensão da conta.
                </p>
              </div>
            )}
          </div>

          {/* Financial Summary */}
          <div className="border border-border rounded-lg p-4 bg-card/50">
            <h3 className="font-semibold text-foreground mb-3">Resumo Financeiro</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Saldo Total</p>
                <p className={`text-lg font-bold ${account.balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(account.balance)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor em Débito</p>
                <p className="text-lg font-bold text-destructive">
                  {formatCurrency(account.pendingInvoice)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  )
}