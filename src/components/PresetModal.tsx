
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Trash2, Save, Settings, Eye } from 'lucide-react'
import { ColumnPreset, usePresets } from '@/hooks/usePresets'
import { useToast } from '@/hooks/use-toast'

interface Column {
  key: string
  label: string
  visible: boolean
}

interface PresetModalProps {
  isOpen: boolean
  onClose: () => void
  columns: Column[]
  onApplyPreset: (preset: ColumnPreset) => void
  onSaveAsPreset: () => void
}

const PresetModal: React.FC<PresetModalProps> = ({
  isOpen,
  onClose,
  columns,
  onApplyPreset,
  onSaveAsPreset
}) => {
  const { presets, deletePreset } = usePresets()
  const { toast } = useToast()
  const [showSaveForm, setShowSaveForm] = useState(false)

  const handleDeletePreset = (presetId: string) => {
    deletePreset(presetId)
    toast({
      title: "Preset excluído",
      description: "O preset foi excluído com sucesso."
    })
  }

  const handleApplyPreset = (preset: ColumnPreset) => {
    onApplyPreset(preset)
    toast({
      title: "Preset aplicado",
      description: `O preset "${preset.name}" foi aplicado com sucesso.`
    })
    onClose()
  }

  const handleSaveAsPreset = () => {
    onSaveAsPreset()
    setShowSaveForm(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Gerenciar Presets de Colunas
          </DialogTitle>
          <DialogDescription>
            Gerencie seus presets salvos ou crie novos a partir da configuração atual
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Botão para salvar preset atual */}
          <div className="border rounded-lg p-4 bg-muted/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Configuração Atual</h3>
              <Badge variant="outline">{columns.filter(c => c.visible).length} colunas</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Salve a configuração atual de colunas como um novo preset
            </p>
            <Button onClick={handleSaveAsPreset} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Salvar como Novo Preset
            </Button>
          </div>

          {/* Lista de presets existentes */}
          <div className="space-y-3">
            <h3 className="font-medium">Presets Salvos</h3>
            {presets.map(preset => (
              <div key={preset.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{preset.name}</h4>
                      {preset.isDefault && <Badge variant="secondary">Padrão</Badge>}
                      <Badge variant="outline">{preset.columns.length} colunas</Badge>
                    </div>
                    {preset.description && (
                      <p className="text-sm text-muted-foreground mb-2">{preset.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {preset.columns.slice(0, 5).map(colKey => {
                        const column = columns.find(c => c.key === colKey)
                        return column ? (
                          <Badge key={colKey} variant="outline" className="text-xs">
                            {column.label}
                          </Badge>
                        ) : null
                      })}
                      {preset.columns.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{preset.columns.length - 5} mais
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApplyPreset(preset)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Aplicar
                    </Button>
                    {!preset.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePreset(preset.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PresetModal
