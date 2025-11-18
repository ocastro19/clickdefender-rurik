
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Download } from 'lucide-react'
import { useExportCSV } from '@/hooks/useExportCSV'
import { useToast } from '@/hooks/use-toast'
import { Campaign } from '@/contexts/CampaignContext'

interface Column {
  key: keyof Campaign
  label: string
  visible: boolean
}

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  campaigns: Campaign[]
  filteredCampaigns: Campaign[]
  columns: Column[]
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  campaigns,
  filteredCampaigns,
  columns
}) => {
  const { t } = useTranslation()
  const { exportToCSV } = useExportCSV()
  const { toast } = useToast()
  
  const [filename, setFilename] = useState('')
  const [exportFiltered, setExportFiltered] = useState(true)
  const [onlyVisibleColumns, setOnlyVisibleColumns] = useState(true)

  const handleExport = () => {
    const campaignsToExport = exportFiltered ? filteredCampaigns : campaigns
    const columnsToExport = onlyVisibleColumns 
      ? columns.filter(col => col.visible)
      : columns

    if (campaignsToExport.length === 0) {
      toast({
        title: "Erro",
        description: "Não há campanhas para exportar.",
        variant: "destructive"
      })
      return
    }

    const finalFilename = filename.trim() || `campanhas-${new Date().toISOString().split('T')[0]}`
    
    exportToCSV(campaignsToExport, columnsToExport, `${finalFilename}.csv`)
    
    toast({
      title: "Exportação concluída",
      description: `${campaignsToExport.length} campanhas exportadas com sucesso.`
    })

    onClose()
  }

  const campaignsToExport = exportFiltered ? filteredCampaigns : campaigns
  const columnsToExport = onlyVisibleColumns 
    ? columns.filter(col => col.visible)
    : columns

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exportar CSV
          </DialogTitle>
          <DialogDescription>
            Configure as opções de exportação para o arquivo CSV
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="filename">Nome do Arquivo</Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder={`campanhas-${new Date().toISOString().split('T')[0]}`}
            />
            <p className="text-xs text-muted-foreground">
              A extensão .csv será adicionada automaticamente
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="export-filtered"
                checked={exportFiltered}
                onCheckedChange={(checked) => setExportFiltered(checked as boolean)}
              />
              <Label htmlFor="export-filtered" className="text-sm">
                Exportar apenas campanhas filtradas
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="only-visible"
                checked={onlyVisibleColumns}
                onCheckedChange={(checked) => setOnlyVisibleColumns(checked as boolean)}
              />
              <Label htmlFor="only-visible" className="text-sm">
                Exportar apenas colunas visíveis
              </Label>
            </div>
          </div>

          <div className="bg-muted/20 p-3 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Campanhas:</span>
              <Badge variant="outline">{campaignsToExport.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Colunas:</span>
              <Badge variant="outline">{columnsToExport.length}</Badge>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ExportModal
