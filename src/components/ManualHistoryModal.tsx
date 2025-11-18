
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { useChangeHistory } from '@/hooks/useChangeHistory'
import { useToast } from '@/hooks/use-toast'

interface ManualHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  campaignId: string
  campaignName: string
}

const fieldOptions = [
  { value: 'orcamento', label: 'Orçamento da Campanha (USD)' },
  { value: 'impressoes', label: 'Impressões' },
  { value: 'cliques', label: 'Cliques' },
  { value: 'custo', label: 'Custo (USD)' },
  { value: 'cpcMedio', label: 'CPC Médio (USD)' },
  { value: 'conversoes', label: 'Conversões' },
  { value: 'estrategiaLances', label: 'Estratégia de Lances' },
  { value: 'ctr', label: 'CTR (%)' },
  
  { value: 'custoConversao', label: 'Custo / Conversão (USD)' },
  { value: 'taxaConversao', label: 'Taxa de Conversão (%)' },
  { value: 'comissao', label: 'Comissão (USD)' },
  { value: 'visitors', label: 'Visitors' },
  { value: 'checkouts', label: 'Checkouts' },
  { value: 'parcelaImpressaoRedeSearch', label: 'Parcela Impressão Rede Search (%)' },
  { value: 'isParteSuperiorPesquisa', label: 'IS Parte Superior Pesquisa (%)' },
  { value: 'isPrimeiraPosicaoPesquisa', label: 'IS Primeira Posição Pesquisa (%)' },
  { value: 'cliquesInvalidos', label: 'Cliques Inválidos' },
  { value: 'parcelaImpressaoPerdidaOrcamento', label: 'Parcela Perdida por Orçamento (%)' },
  { value: 'parcelaImpressaoPerdidaClassificacao', label: 'Parcela Perdida por Classificação (%)' },
]

const ManualHistoryModal: React.FC<ManualHistoryModalProps> = ({
  isOpen,
  onClose,
  campaignId,
  campaignName
}) => {
  const { addHistoryEntry } = useChangeHistory()
  const { toast } = useToast()
  
  const [field, setField] = useState('')
  const [fieldLabel, setFieldLabel] = useState('')
  const [oldValue, setOldValue] = useState('')
  const [newValue, setNewValue] = useState('')
  const [notes, setNotes] = useState('')

  const handleFieldChange = (value: string) => {
    setField(value)
    const option = fieldOptions.find(opt => opt.value === value)
    setFieldLabel(option?.label || value)
  }

  const handleSave = () => {
    if (!field || !fieldLabel) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um campo.",
        variant: "destructive"
      })
      return
    }

    if (!oldValue || !newValue) {
      toast({
        title: "Erro", 
        description: "Por favor, preencha os valores anterior e novo.",
        variant: "destructive"
      })
      return
    }

    // Converter valores se necessário
    const convertedOldValue = isNaN(Number(oldValue)) ? oldValue : Number(oldValue)
    const convertedNewValue = isNaN(Number(newValue)) ? newValue : Number(newValue)

    addHistoryEntry({
      campaignId,
      campaignName,
      field,
      fieldLabel,
      oldValue: convertedOldValue,
      newValue: convertedNewValue,
      type: 'manual',
      notes: notes.trim() || undefined
    })

    toast({
      title: "Entrada adicionada",
      description: "A entrada manual foi adicionada ao histórico."
    })

    // Reset form
    setField('')
    setFieldLabel('')
    setOldValue('')
    setNewValue('')
    setNotes('')
    onClose()
  }

  const handleClose = () => {
    setField('')
    setFieldLabel('')
    setOldValue('')
    setNewValue('')
    setNotes('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Adicionar Entrada Manual
          </DialogTitle>
          <DialogDescription>
            Adicione uma entrada manual ao histórico de {campaignName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="field">Campo Alterado *</Label>
            <Select value={field} onValueChange={handleFieldChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um campo" />
              </SelectTrigger>
              <SelectContent>
                {fieldOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="old-value">Valor Anterior *</Label>
              <Input
                id="old-value"
                value={oldValue}
                onChange={(e) => setOldValue(e.target.value)}
                placeholder="Ex: 100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-value">Valor Novo *</Label>
              <Input
                id="new-value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Ex: 150"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicione observações sobre esta alteração..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Entrada
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ManualHistoryModal
