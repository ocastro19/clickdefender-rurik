import React, { useState } from 'react'
import { Plus, Minus, History, DollarSign, Calendar, Trash2, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useGlobalCurrencyFormatter } from '@/hooks/useGlobalCurrencyFormatter'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from '@/hooks/use-mobile'

interface BalanceEntry {
  id: string
  type: 'add' | 'remove'
  amount: number
  description: string
  date: string
}

interface AccountBalanceModalProps {
  isOpen: boolean
  onClose: () => void
}

const AccountBalanceModal: React.FC<AccountBalanceModalProps> = ({ isOpen, onClose }) => {
  const { formatGlobalCurrency } = useGlobalCurrencyFormatter()
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const [entries, setEntries] = useState<BalanceEntry[]>([
    {
      id: '1',
      type: 'add',
      amount: 10000,
      description: t('accountBalance.initialBudgetJanuary'),
      date: '2024-01-01'
    },
    {
      id: '2',
      type: 'add',
      amount: 5000,
      description: t('accountBalance.budgetReinforcement'),
      date: '2024-01-15'
    },
    {
      id: '3',
      type: 'remove',
      amount: 2000,
      description: t('accountBalance.budgetAdjustment'),
      date: '2024-01-20'
    }
  ])
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [formType, setFormType] = useState<'add' | 'remove'>('add')
  const [formAmount, setFormAmount] = useState('')
  const [formDescription, setFormDescription] = useState('')

  const totalBalance = entries.reduce((acc, entry) => {
    return entry.type === 'add' ? acc + entry.amount : acc - entry.amount
  }, 0)

  const handleAddEntry = () => {
    if (!formAmount || !formDescription) return

    const newEntry: BalanceEntry = {
      id: Date.now().toString(),
      type: formType,
      amount: parseFloat(formAmount),
      description: formDescription,
      date: new Date().toISOString().split('T')[0]
    }

    setEntries(prev => [newEntry, ...prev])
    setFormAmount('')
    setFormDescription('')
    setShowAddForm(false)
  }

  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${
        isMobile 
          ? 'max-w-[95vw] max-h-[95vh] w-full m-2 overflow-y-auto' 
          : 'max-w-4xl max-h-[90vh] overflow-y-auto'
      }`}>
        <DialogHeader className={`${isMobile ? 'pb-4' : 'pb-6'}`}>
          <DialogTitle className={`${
            isMobile ? 'text-lg' : 'text-2xl'
          } font-bold flex items-center gap-2 sm:gap-3`}>
            <div className={`${
              isMobile ? 'p-2' : 'p-3'
            } rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 shadow-premium`}>
              <DollarSign className={`${isMobile ? 'h-4 w-4' : 'h-6 w-6'} text-white`} />
            </div>
            <span className={isMobile ? 'text-base' : 'text-2xl'}>
              {t('accountBalance.title')}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className={`${isMobile ? 'space-y-4' : 'space-y-6'}`}>
          {/* Saldo Total */}
          <Card className="border-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
              <div className={`${
                isMobile 
                  ? 'flex flex-col space-y-3' 
                  : 'flex items-center justify-between'
              }`}>
                <div className={isMobile ? 'text-center' : ''}>
                  <p className={`${
                    isMobile ? 'text-sm' : 'text-lg'
                  } font-medium text-muted-foreground mb-2`}>
                    {t('accountBalance.totalAvailableBalance')}
                  </p>
                  <p className={`${
                    isMobile ? 'text-2xl' : 'text-4xl'
                  } font-bold text-primary`}>
                    {formatGlobalCurrency(totalBalance, 'USD')}
                  </p>
                </div>
                <div className={`${isMobile ? 'text-center' : 'text-right'}`}>
                  <Badge variant={totalBalance > 0 ? "default" : "destructive"} className="text-sm">
                    {totalBalance > 0 ? (
                      <>
                        <DollarSign className="h-4 w-4 inline mr-1.5" />
                        {t('accountBalance.positiveBalance')}
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 inline mr-1.5" />
                        Saldo Baixo
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className={`${
            isMobile 
              ? 'flex flex-col gap-3' 
              : 'flex gap-4'
          }`}>
            <Button 
              onClick={() => {
                setFormType('add')
                setShowAddForm(true)
              }}
              className={`${
                isMobile ? 'w-full h-12' : 'flex-1'
              } bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800`}
            >
              <Plus className={`${isMobile ? 'h-4 w-4 mr-2' : 'h-4 w-4 mr-2'}`} />
              <span className={isMobile ? 'text-sm' : ''}>
                {t('accountBalance.addBudget')}
              </span>
            </Button>
            <Button 
              onClick={() => {
                setFormType('remove')
                setShowAddForm(true)
              }}
              variant="outline"
              className={`${
                isMobile ? 'w-full h-12' : 'flex-1'
              } border-red-200 text-red-600 hover:bg-red-50`}
            >
              <Minus className={`${isMobile ? 'h-4 w-4 mr-2' : 'h-4 w-4 mr-2'}`} />
              <span className={isMobile ? 'text-sm' : ''}>
                {t('accountBalance.removeBudget')}
              </span>
            </Button>
          </div>

          {/* Formulário de Adição/Remoção */}
          {showAddForm && (
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader className={isMobile ? 'pb-3' : ''}>
                <CardTitle className={`${
                  isMobile ? 'text-base' : 'text-lg'
                } flex items-center gap-2`}>
                  {formType === 'add' ? (
                    <>
                      <Plus className="h-4 w-4 text-green-600" />
                      <span className={isMobile ? 'text-sm' : ''}>
                        {t('accountBalance.addBudget')}
                      </span>
                    </>
                  ) : (
                    <>
                      <Minus className="h-4 w-4 text-red-600" />
                      <span className={isMobile ? 'text-sm' : ''}>
                        {t('accountBalance.removeBudget')}
                      </span>
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className={`${
                isMobile ? 'space-y-3 p-4' : 'space-y-4'
              }`}>
                <div>
                  <Label htmlFor="amount" className={isMobile ? 'text-sm' : ''}>
                    {t('accountBalance.amountUSD')}
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className={isMobile ? 'h-12 text-base' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="description" className={isMobile ? 'text-sm' : ''}>
                    {t('common.description')}
                  </Label>
                  <Input
                    id="description"
                    placeholder={t('accountBalance.descriptionPlaceholder')}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className={isMobile ? 'h-12 text-base' : ''}
                  />
                </div>
                <div className={`${
                  isMobile 
                    ? 'flex flex-col gap-3' 
                    : 'flex gap-2'
                }`}>
                  <Button 
                    onClick={handleAddEntry} 
                    className={`${isMobile ? 'w-full h-12' : 'flex-1'}`}
                  >
                    <span className={isMobile ? 'text-sm' : ''}>
                      {formType === 'add' ? t('accountBalance.add') : t('accountBalance.remove')}
                    </span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddForm(false)}
                    className={`${isMobile ? 'w-full h-12' : 'flex-1'}`}
                  >
                    <span className={isMobile ? 'text-sm' : ''}>
                      {t('common.cancel')}
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Histórico */}
          <Card>
            <CardHeader className={isMobile ? 'pb-3' : ''}>
              <CardTitle className={`${
                isMobile ? 'text-base' : 'text-lg'
              } flex items-center gap-2`}>
                <History className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                <span className={isMobile ? 'text-sm' : ''}>
                  {t('accountBalance.movementHistory')}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className={isMobile ? 'p-4' : ''}>
              <div className={`${isMobile ? 'space-y-2' : 'space-y-3'}`}>
                {entries.map((entry, index) => (
                  <div key={entry.id}>
                    <div className={`${
                      isMobile 
                        ? 'flex flex-col gap-3 p-3' 
                        : 'flex items-center justify-between p-4'
                    } rounded-lg bg-card/50 hover:bg-card transition-colors`}>
                      
                      {/* Mobile Layout */}
                      {isMobile ? (
                        <>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              entry.type === 'add' 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-red-100 text-red-600'
                            }`}>
                              {entry.type === 'add' ? 
                                <Plus className="h-3 w-3" /> : 
                                <Minus className="h-3 w-3" />
                              }
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-foreground text-sm">
                                {entry.description}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {formatDate(entry.date)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className={`text-base font-bold ${
                              entry.type === 'add' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {entry.type === 'add' ? '+' : '-'}{formatGlobalCurrency(entry.amount, 'USD')}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteEntry(entry.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        /* Desktop Layout */
                        <>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              entry.type === 'add' 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-red-100 text-red-600'
                            }`}>
                              {entry.type === 'add' ? 
                                <Plus className="h-4 w-4" /> : 
                                <Minus className="h-4 w-4" />
                              }
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {entry.description}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {formatDate(entry.date)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className={`text-lg font-bold ${
                                entry.type === 'add' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {entry.type === 'add' ? '+' : '-'}{formatGlobalCurrency(entry.amount, 'USD')}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteEntry(entry.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                    {index < entries.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AccountBalanceModal