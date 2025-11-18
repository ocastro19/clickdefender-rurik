import React from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, Edit, Trash2, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-mobile'

export interface GoogleAdsAccount {
  id: string
  name: string
  email: string
  status: 'Ativa' | 'Suspensa' | 'Pausada' | 'Devedor'
  balance: number
  pendingInvoice: number
  lastActivity: string
}

interface GoogleAdsAccountsTableProps {
  accounts: GoogleAdsAccount[]
  onViewDetails: (account: GoogleAdsAccount) => void
  onEdit: (account: GoogleAdsAccount) => void
  onDelete: (accountId: string) => void
  onAdd: () => void
}

const GoogleAdsAccountsTable: React.FC<GoogleAdsAccountsTableProps> = ({
  accounts,
  onViewDetails,
  onEdit,
  onDelete,
  onAdd
}) => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ativa':
        return <Badge className="bg-success/10 text-success border-success/20 text-xs">✅ {isMobile ? 'Ativa' : t('financial.active')}</Badge>
      case 'Suspensa':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs">🔴 {isMobile ? 'Suspensa' : t('financial.suspended')}</Badge>
      case 'Pausada':
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-xs">🟡 {isMobile ? 'Pausada' : t('financial.paused')}</Badge>
      case 'Devedor':
        return <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20 text-xs">⚠️ {isMobile ? 'Devedor' : t('financial.debtor')}</Badge>
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>
    }
  }

  const formatCurrency = (value: number) => {
    if (isMobile && Math.abs(value) >= 1000) {
      return `R$ ${(value / 1000).toFixed(1)}k`
    }
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  }

  // Mobile Card Layout
  const MobileAccountCard = ({ account }: { account: GoogleAdsAccount }) => (
    <div className="bg-card/30 border border-border/50 rounded-lg p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-foreground text-sm">{account.name}</h4>
          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{account.email}</p>
        </div>
        {getStatusBadge(account.status)}
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-muted-foreground">{t('financial.balance')}:</span>
          <p className={`font-medium ${account.balance >= 0 ? 'text-success' : 'text-destructive'}`}>
            {formatCurrency(account.balance)}
          </p>
        </div>
        <div>
          <span className="text-muted-foreground">{t('financial.invoice')}:</span>
          <p className={account.pendingInvoice > 0 ? 'text-destructive font-medium' : 'text-muted-foreground'}>
            {account.pendingInvoice > 0 ? formatCurrency(account.pendingInvoice) : '-'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{account.lastActivity}</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(account)}
            className="hover:bg-primary/10 h-7 w-7 p-0"
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(account)}
            className="hover:bg-primary/10 h-7 w-7 p-0"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(account.id)}
            className="hover:bg-destructive/10 text-destructive h-7 w-7 p-0"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-premium hover:shadow-glow transition-all duration-500">
      <CardHeader className="pb-3 sm:pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle className="text-base sm:text-xl lg:text-2xl font-bold text-foreground">
            <span className="block sm:hidden">{t('financial.googleAdsAccounts')}</span>
            <span className="hidden sm:block">{t('financial.googleAdsManagement')}</span>
          </CardTitle>
          <Button
            onClick={onAdd}
            className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-premium text-xs sm:text-sm h-8 sm:h-10"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="block sm:hidden">{t('financial.add')}</span>
            <span className="hidden sm:block">{t('financial.addAccount')}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        {/* Mobile Layout */}
        {isMobile ? (
          <div className="space-y-3">
            {accounts.map((account) => (
              <MobileAccountCard key={account.id} account={account} />
            ))}
          </div>
        ) : (
          /* Desktop Table Layout */
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">{t('financial.account')}</TableHead>
                  <TableHead className="text-xs sm:text-sm">{t('financial.email')}</TableHead>
                  <TableHead className="text-xs sm:text-sm">{t('financial.status')}</TableHead>
                  <TableHead className="text-xs sm:text-sm">{t('financial.balance')}</TableHead>
                  <TableHead className="text-xs sm:text-sm">{t('financial.pendingInvoice')}</TableHead>
                  <TableHead className="text-xs sm:text-sm">{t('financial.lastActivity')}</TableHead>
                  <TableHead className="text-xs sm:text-sm">{t('financial.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium text-xs sm:text-sm">{account.name}</TableCell>
                    <TableCell className="text-muted-foreground text-xs sm:text-sm">{account.email}</TableCell>
                    <TableCell>{getStatusBadge(account.status)}</TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      <span className={account.balance >= 0 ? 'text-success' : 'text-destructive'}>
                        {formatCurrency(account.balance)}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      {account.pendingInvoice > 0 ? (
                        <span className="text-destructive font-medium">
                          {formatCurrency(account.pendingInvoice)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs sm:text-sm">{account.lastActivity}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDetails(account)}
                          className="hover:bg-primary/10 h-7 w-7 sm:h-8 sm:w-8 p-0"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(account)}
                          className="hover:bg-primary/10 h-7 w-7 sm:h-8 sm:w-8 p-0"
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(account.id)}
                          className="hover:bg-destructive/10 text-destructive h-7 w-7 sm:h-8 sm:w-8 p-0"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default GoogleAdsAccountsTable