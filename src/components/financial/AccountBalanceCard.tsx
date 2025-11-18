
import React from 'react'
import { useTranslation } from 'react-i18next'
import { DollarSign, TrendingUp, Plus, Minus, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useGlobalCurrencyFormatter } from '@/hooks/useGlobalCurrencyFormatter'

interface AccountBalanceCardProps {
  totalBalance: number
  positiveBalance: boolean
  onAddBudget: () => void
  onRemoveBudget: () => void
  movementHistory: Array<{
    id: string
    description: string
    amount: number
    date: string
  }>
}

const AccountBalanceCard: React.FC<AccountBalanceCardProps> = ({
  totalBalance,
  positiveBalance,
  onAddBudget,
  onRemoveBudget,
  movementHistory
}) => {
  const { t } = useTranslation()
  const { formatGlobalCurrency } = useGlobalCurrencyFormatter()

  return (
    <Card className="border-0 bg-gradient-to-br from-primary/10 to-primary/5 shadow-premium hover:shadow-glow transition-all duration-500 mb-8">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-primary/80">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          {t('accountBalance.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Saldo Total */}
          <div className="text-center p-6 bg-card/50 rounded-xl border border-border">
            <p className="text-sm text-muted-foreground mb-2">{t('accountBalance.totalAvailableBalance')}</p>
            <div className="text-4xl font-bold text-primary mb-4">
              {formatGlobalCurrency(totalBalance)}
            </div>
            <Badge className={`${positiveBalance ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
              {positiveBalance ? (
                <>
                  <CheckCircle className="h-4 w-4 inline mr-1.5 text-success" />
                  {t('accountBalance.positiveBalance')}
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 inline mr-1.5 text-destructive" />
                  {t('accountBalance.positiveBalance')}
                </>
              )}
            </Badge>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-4">
            <Button 
              onClick={onAddBudget}
              className="flex-1 bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('accountBalance.addBudget')}
            </Button>
            <Button 
              onClick={onRemoveBudget}
              variant="outline"
              className="flex-1 border-destructive/20 text-destructive hover:bg-destructive/10"
            >
              <Minus className="h-4 w-4 mr-2" />
              {t('accountBalance.removeBudget')}
            </Button>
          </div>

          {/* Histórico de Movimentações */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {t('accountBalance.movementHistory')}
            </h4>
            <div className="space-y-3">
              {movementHistory.map((movement) => (
                <div key={movement.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">{movement.description}</p>
                    <p className="text-xs text-muted-foreground">{movement.date}</p>
                  </div>
                  <div className={`text-lg font-bold ${movement.amount > 0 ? 'text-success' : 'text-destructive'}`}>
                    {movement.amount > 0 ? '+' : ''}{formatGlobalCurrency(movement.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AccountBalanceCard
