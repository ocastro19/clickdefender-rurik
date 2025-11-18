import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Save, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface GclidEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (gclid: string) => void
  currentGclid: string
  productName: string
}

const GclidEditModal: React.FC<GclidEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentGclid,
  productName
}) => {
  const [gclid, setGclid] = useState(currentGclid)
  const { toast } = useToast()

  const handleSave = () => {
    if (!gclid.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite um GCLID válido",
        variant: "destructive"
      })
      return
    }

    onSave(gclid.trim())
    toast({
      title: "Sucesso",
      description: "GCLID atualizado com sucesso! Tráfego alterado para pago.",
      variant: "default"
    })
    onClose()
  }

  const handleClose = () => {
    setGclid(currentGclid)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Editar Google Click ID
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Produto
            </Label>
            <p className="text-sm text-foreground font-semibold mt-1">
              {productName}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gclid" className="text-sm font-medium">
              Google Click ID (GCLID)
            </Label>
            <Textarea
              id="gclid"
              value={gclid}
              onChange={(e) => setGclid(e.target.value)}
              placeholder="Cole aqui o GCLID do Google Ads..."
              className="min-h-[100px] font-mono text-xs"
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Exemplo: CjwKCAiA9-HTBhCqEiwAGLVXQh2f8g...
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              <strong>💡 Dica:</strong> Ao adicionar um GCLID, esta venda será automaticamente 
              convertida de tráfego orgânico para tráfego pago.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={handleClose}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-success hover:bg-success/90">
            <Save className="w-4 h-4 mr-2" />
            Salvar GCLID
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GclidEditModal