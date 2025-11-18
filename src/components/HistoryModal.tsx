
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Clock, User, Plus, Trash2, FileText } from 'lucide-react'
import { HistoryEntry } from '@/hooks/useChangeHistory'
import { formatHistoryMessage, formatHistoryDate } from '@/utils/historyUtils'

interface HistoryModalProps {
  isOpen: boolean
  onClose: () => void
  campaignName: string
  history: HistoryEntry[]
  onAddManualEntry: () => void
  onAddOtherEntry: () => void
  onDeleteEntry: (entryId: string) => void
}

const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  campaignName,
  history,
  onAddManualEntry,
  onAddOtherEntry,
  onDeleteEntry
}) => {
  const { t } = useTranslation()
  
  const getEntryTypeColor = (type: string = 'automatic') => {
    switch (type) {
      case 'manual':
        return 'bg-purple-500/10 text-purple-700'
      case 'other':
        return 'bg-orange-500/10 text-orange-700'
      default:
        return 'bg-blue-500/10 text-blue-700'
    }
  }

  const getEntryTypeLabel = (type: string = 'automatic') => {
    switch (type) {
      case 'manual':
        return 'Manual'
      case 'other':
        return 'Outros'
      default:
        return 'Automático'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Histórico de Alterações - {campaignName}
          </DialogTitle>
          <DialogDescription>
            Visualize todas as alterações realizadas nesta campanha
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-end mb-4 gap-2">
          <Button onClick={onAddManualEntry} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Entrada Manual
          </Button>
          <Button onClick={onAddOtherEntry} size="sm" variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Outros Assuntos
          </Button>
        </div>
        
        <ScrollArea className="h-[500px] pr-4">
          {history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma alteração registrada para esta campanha.
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((entry, index) => (
                <div key={entry.id} className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getEntryTypeColor(entry.type)}>
                          {getEntryTypeLabel(entry.type)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {entry.fieldLabel}
                        </Badge>
                      </div>
                      
                      <p className="text-sm font-medium">
                        {entry.type === 'other' ? entry.notes || 'Entrada de outros assuntos' : formatHistoryMessage(entry)}
                      </p>
                      
                      {entry.notes && entry.type !== 'other' && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('common.observations')}: {entry.notes}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatHistoryDate(entry.timestamp)}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {entry.user}
                        </div>
                      </div>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir esta entrada do histórico? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDeleteEntry(entry.id)} className="bg-red-500 hover:bg-red-600">
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  {index < history.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default HistoryModal
