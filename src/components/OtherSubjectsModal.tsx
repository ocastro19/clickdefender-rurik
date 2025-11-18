
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileText } from 'lucide-react'
import { useChangeHistory } from '@/hooks/useChangeHistory'
import { useToast } from '@/hooks/use-toast'

interface OtherSubjectsModalProps {
  isOpen: boolean
  onClose: () => void
  campaignId: string
  campaignName: string
}

const OtherSubjectsModal: React.FC<OtherSubjectsModalProps> = ({
  isOpen,
  onClose,
  campaignId,
  campaignName
}) => {
  const { addHistoryEntry } = useChangeHistory()
  const { toast } = useToast()
  
  const [notes, setNotes] = useState('')

  const handleSave = () => {
    if (!notes.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, adicione uma descrição.",
        variant: "destructive"
      })
      return
    }

    addHistoryEntry({
      campaignId,
      campaignName,
      field: 'other',
      fieldLabel: 'Outros Assuntos',
      oldValue: '',
      newValue: '',
      type: 'other',
      notes: notes.trim()
    })

    toast({
      title: "Entrada adicionada",
      description: "A entrada de outros assuntos foi adicionada ao histórico."
    })

    // Reset form
    setNotes('')
    onClose()
  }

  const handleClose = () => {
    setNotes('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Adicionar Outros Assuntos
          </DialogTitle>
          <DialogDescription>
            Adicione uma entrada de outros assuntos ao histórico de {campaignName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Descrição *</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Descreva o assunto relacionado à campanha..."
              rows={5}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <FileText className="h-4 w-4 mr-2" />
              Adicionar Entrada
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default OtherSubjectsModal
