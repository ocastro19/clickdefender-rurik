
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Save } from 'lucide-react'
import { usePresets } from '@/hooks/usePresets'
import { useToast } from '@/hooks/use-toast'

interface Column {
  key: string
  label: string
  visible: boolean
}

interface SavePresetModalProps {
  isOpen: boolean
  onClose: () => void
  columns: Column[]
}

const SavePresetModal: React.FC<SavePresetModalProps> = ({
  isOpen,
  onClose,
  columns
}) => {
  const { savePreset } = usePresets()
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um nome para o preset.",
        variant: "destructive"
      })
      return
    }

    const visibleColumns = columns.filter(col => col.visible).map(col => col.key)
    
    savePreset({
      name: name.trim(),
      description: description.trim(),
      columns: visibleColumns
    })

    toast({
      title: "Preset salvo",
      description: `O preset "${name}" foi salvo com sucesso.`
    })

    setName('')
    setDescription('')
    onClose()
  }

  const handleClose = () => {
    setName('')
    setDescription('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Salvar Preset
          </DialogTitle>
          <DialogDescription>
            Salve a configuração atual de colunas como um novo preset
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="preset-name">Nome do Preset *</Label>
            <Input
              id="preset-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Análise de Conversão"
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preset-description">Descrição (opcional)</Label>
            <Textarea
              id="preset-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva quando usar este preset..."
              maxLength={200}
              rows={3}
            />
          </div>

          <div className="bg-muted/20 p-3 rounded-lg">
            <p className="text-sm font-medium mb-1">Colunas que serão salvas:</p>
            <p className="text-sm text-muted-foreground">
              {columns.filter(col => col.visible).length} colunas visíveis
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Preset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SavePresetModal
