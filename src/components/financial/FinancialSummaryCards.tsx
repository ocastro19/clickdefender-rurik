import React from 'react'
import { useTranslation } from 'react-i18next'
import { CreditCard, DollarSign, AlertTriangle, CheckCircle, BarChart3, Calendar, XCircle, Pause } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGlobalCurrencyFormatter } from '@/hooks/useGlobalCurrencyFormatter'
import { useIsMobile } from '@/hooks/use-mobile'

interface FinancialSummaryCardsProps {
  campaignCosts: number
  totalReceivable: number
  debtBalance: number
  activeAccounts: number
  totalAccounts: number
  pausedAccounts: number
  suspendedAccounts: number
}

const FinancialSummaryCards: React.FC<FinancialSummaryCardsProps> = ({
  campaignCosts,
  totalReceivable,
  debtBalance,
  activeAccounts,
  totalAccounts,
  pausedAccounts,
  suspendedAccounts
}) => {
  const { t } = useTranslation()
  const { formatGlobalCurrency } = useGlobalCurrencyFormatter()
  const isMobile = useIsMobile()
  
  return (
    <div className={`grid ${
      isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6'
    } mb-4 sm:mb-6 lg:mb-8`}>
      {/* Card 1: Custo Total Campanhas */}
      <Card className="border-0 bg-gradient-to-br from-red-500/10 to-red-600/5 shadow-premium hover:shadow-glow transition-all duration-500">
        <CardHeader className={`${isMobile ? 'pb-1 px-3 pt-3' : 'pb-2 sm:pb-3'}`}>
            <CardTitle className={`${
              isMobile ? 'text-xs flex-col items-start gap-1' : 'text-sm sm:text-base lg:text-lg'
            } font-bold text-foreground flex items-center gap-1.5 sm:gap-2`}>
            <div className={`${
              isMobile ? 'p-1' : 'p-1 sm:p-1.5 lg:p-2'
            } rounded-md sm:rounded-lg bg-gradient-to-r from-red-500 to-red-600`}>
              <CreditCard className={`${
                isMobile ? 'h-3 w-3' : 'h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5'
              } text-white`} />
            </div>
            {isMobile ? (
              <span className="text-xs">{t('financial.costs')}</span>
            ) : (
              <>
                <span className="hidden sm:inline">{t('financial.campaignCosts')}</span>
                <span className="sm:hidden">{t('financial.costs')}</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className={`pt-0 ${isMobile ? 'px-3 pb-3' : ''}`}>
          <div className={`space-y-1 ${isMobile ? 'space-y-0' : 'sm:space-y-2'}`}>
            <div className={`${
              isMobile ? 'text-sm' : 'text-lg sm:text-2xl lg:text-3xl'
            } font-bold text-red-600`}>
              {isMobile 
                ? formatGlobalCurrency(campaignCosts).replace('US$', '$')
                : formatGlobalCurrency(campaignCosts)
              }
            </div>
            <div className={`${
              isMobile ? 'text-xs' : 'text-xs sm:text-sm'
            } text-muted-foreground flex items-center gap-1`}>
              <BarChart3 className="h-4 w-4 inline mr-1.5" />
              {isMobile ? '30d' : (
                <>
                  <span className="hidden sm:inline">{t('financial.last30Days')}</span>
                  <span className="sm:hidden">30 {t('financial.days')}</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: A Receber */}
      <Card className="border-0 bg-gradient-to-br from-success/10 to-success/5 shadow-premium hover:shadow-glow transition-all duration-500">
        <CardHeader className={`${isMobile ? 'pb-1 px-3 pt-3' : 'pb-2 sm:pb-3'}`}>
            <CardTitle className={`${
              isMobile ? 'text-xs flex-col items-start gap-1' : 'text-sm sm:text-base lg:text-lg'
            } font-bold text-foreground flex items-center gap-1.5 sm:gap-2`}>
            <div className={`${
              isMobile ? 'p-1' : 'p-1 sm:p-1.5 lg:p-2'
            } rounded-md sm:rounded-lg bg-gradient-to-r from-success to-success/80`}>
              <DollarSign className={`${
                isMobile ? 'h-3 w-3' : 'h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5'
              } text-white`} />
            </div>
            {isMobile ? (
              <span className="text-xs">{t('financial.receivable')}</span>
            ) : (
              <>
                <span className="hidden sm:inline">{t('financial.totalReceivable')}</span>
                <span className="sm:hidden">{t('financial.receivable')}</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className={`pt-0 ${isMobile ? 'px-3 pb-3' : ''}`}>
          <div className={`space-y-1 ${isMobile ? 'space-y-0' : 'sm:space-y-2'}`}>
            <div className={`${
              isMobile ? 'text-sm' : 'text-lg sm:text-2xl lg:text-3xl'
            } font-bold text-success`}>
              {isMobile 
                ? formatGlobalCurrency(totalReceivable).replace('US$', '$')
                : formatGlobalCurrency(totalReceivable)
              }
            </div>
            <div className={`${
              isMobile ? 'text-xs' : 'text-xs sm:text-sm'
            } text-muted-foreground flex items-center gap-1`}>
              <Calendar className="h-4 w-4 inline mr-1.5" />
              {isMobile ? 'Próx' : (
                <>
                  <span className="hidden sm:inline">{t('financial.nextPayments')}</span>
                  <span className="sm:hidden">{t('financial.upcoming')}</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Saldo Devedor */}
      <Card className="border-0 bg-gradient-to-br from-destructive/10 to-destructive/5 shadow-premium hover:shadow-glow transition-all duration-500">
        <CardHeader className={`${isMobile ? 'pb-1 px-3 pt-3' : 'pb-2 sm:pb-3'}`}>
            <CardTitle className={`${
              isMobile ? 'text-xs flex-col items-start gap-1' : 'text-sm sm:text-base lg:text-lg'
            } font-bold text-foreground flex items-center gap-1.5 sm:gap-2`}>
            <div className={`${
              isMobile ? 'p-1' : 'p-1 sm:p-1.5 lg:p-2'
            } rounded-md sm:rounded-lg bg-gradient-to-r from-destructive to-destructive/80`}>
              <AlertTriangle className={`${
                isMobile ? 'h-3 w-3' : 'h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5'
              } text-white`} />
            </div>
            {isMobile ? (
              <span className="text-xs">{t('financial.debts')}</span>
            ) : (
              <>
                <span className="hidden sm:inline">{t('financial.debtBalance')}</span>
                <span className="sm:hidden">{t('financial.debts')}</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className={`pt-0 ${isMobile ? 'px-3 pb-3' : ''}`}>
          <div className={`space-y-1 ${isMobile ? 'space-y-0' : 'sm:space-y-2'}`}>
            <div className={`${
              isMobile ? 'text-sm' : 'text-lg sm:text-2xl lg:text-3xl'
            } font-bold text-destructive`}>
              {isMobile 
                ? formatGlobalCurrency(debtBalance).replace('US$', '$')
                : formatGlobalCurrency(debtBalance)
              }
            </div>
            <div className={`${
              isMobile ? 'text-xs' : 'text-xs sm:text-sm'
            } text-muted-foreground flex items-center gap-1`}>
              <XCircle className="h-4 w-4 inline mr-1.5 text-destructive" />
              {isMobile ? '2' : (
                <>
                  <span className="hidden sm:inline">2 {t('financial.pendingAccounts')}</span>
                  <span className="sm:hidden">2 {t('financial.pending')}</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 4: Contas Ativas */}
      <Card className="border-0 bg-gradient-to-br from-primary/10 to-primary/5 shadow-premium hover:shadow-glow transition-all duration-500">
        <CardHeader className={`${isMobile ? 'pb-1 px-3 pt-3' : 'pb-2 sm:pb-3'}`}>
            <CardTitle className={`${
              isMobile ? 'text-xs flex-col items-start gap-1' : 'text-sm sm:text-base lg:text-lg'
            } font-bold text-foreground flex items-center gap-1.5 sm:gap-2`}>
            <div className={`${
              isMobile ? 'p-1' : 'p-1 sm:p-1.5 lg:p-2'
            } rounded-md sm:rounded-lg bg-gradient-to-r from-primary to-primary/80`}>
              <CheckCircle className={`${
                isMobile ? 'h-3 w-3' : 'h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5'
              } text-white`} />
            </div>
            {isMobile ? (
              <span className="text-xs">{t('financial.accounts')}</span>
            ) : (
              <>
                <span className="hidden lg:inline">{t('financial.googleAdsAccounts')}</span>
                <span className="lg:hidden">{t('financial.accounts')}</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className={`pt-0 ${isMobile ? 'px-3 pb-3' : ''}`}>
          <div className={`space-y-1 ${isMobile ? 'space-y-0' : 'sm:space-y-2'}`}>
            <div className={`${
              isMobile ? 'text-xs' : 'text-sm sm:text-lg lg:text-2xl'
            } font-bold text-primary`}>
              {isMobile ? (
                <span>{activeAccounts}/{totalAccounts}</span>
              ) : (
                <>
                  <span className="hidden sm:inline">{activeAccounts} {t('financial.activeAccounts')} / {totalAccounts} {t('financial.totalAccounts')}</span>
                  <span className="sm:hidden">{activeAccounts}/{totalAccounts} {t('financial.active')}</span>
                </>
              )}
            </div>
            <div className={`flex items-center ${
              isMobile ? 'gap-1 flex-wrap' : 'gap-1 sm:gap-2'
            } text-xs sm:text-sm`}>
              <Badge variant="outline" className={`text-yellow-600 ${
                isMobile ? 'text-xs px-1' : 'text-xs px-1 sm:px-2'
              }`}>
                <Pause className="h-4 w-4 inline mr-1.5" />
                {isMobile ? pausedAccounts : (
                  <>
                    <span className="hidden sm:inline">{pausedAccounts} {t('financial.pausedAccounts')}</span>
                    <span className="sm:hidden">{pausedAccounts}</span>
                  </>
                )}
              </Badge>
              <Badge variant="outline" className={`text-red-600 ${
                isMobile ? 'text-xs px-1' : 'text-xs px-1 sm:px-2'
              }`}>
                <XCircle className="h-4 w-4 inline mr-1.5" />
                {isMobile ? suspendedAccounts : (
                  <>
                    <span className="hidden sm:inline">{suspendedAccounts} {t('financial.suspendedAccounts')}</span>
                    <span className="sm:hidden">{suspendedAccounts}</span>
                  </>
                )}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default FinancialSummaryCards