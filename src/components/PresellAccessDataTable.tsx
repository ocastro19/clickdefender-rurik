import React from 'react'
import { useTranslation } from 'react-i18next'
import { 
  Calendar, MapPin, Globe, Smartphone, Monitor, 
  Tablet, Eye, MousePointer, ExternalLink, Copy 
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'

interface AccessData {
  id: string
  data: string
  ipId: string
  keyword: string
  gclid: string
  acessos: number
  cliques: number
  dispositivo: 'desktop' | 'mobile' | 'tablet'
  pais: string
  estado: string
  flag: string
}

interface PresellAccessDataTableProps {
  presellName: string
  accessData: AccessData[]
}

const PresellAccessDataTable: React.FC<PresellAccessDataTableProps> = ({
  presellName,
  accessData
}) => {
  const { t } = useTranslation()
  const { toast } = useToast()

  const copyToClipboard = (text: string, label: string = 'GCLID') => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência.`,
    })
  }

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'mobile': return <Smartphone className="w-4 h-4" />
      case 'tablet': return <Tablet className="w-4 h-4" />
      default: return <Monitor className="w-4 h-4" />
    }
  }

  const getDeviceColor = (device: string) => {
    switch (device) {
      case 'mobile': return 'text-success'
      case 'tablet': return 'text-warning'
      default: return 'text-info'
    }
  }

  if (!accessData.length) {
    return (
      <Card className="border-0 bg-card/30 backdrop-blur-md h-full flex items-center justify-center">
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">
            <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum dado de acesso encontrado para <strong>{presellName}</strong></p>
            <p className="text-sm mt-2">Os dados aparecerão aqui quando houver acessos registrados.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 bg-card/30 backdrop-blur-md shadow-premium h-full flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <CardTitle className="text-xl font-bold text-foreground flex items-center gap-3 flex-wrap">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <span className="truncate">Dados de Acesso - {presellName}</span>
          <Badge variant="outline" className="ml-auto">
            {accessData.length} registros
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col overflow-hidden p-4">
        <div className="rounded-lg border border-border/50 bg-card/20 overflow-hidden flex-1">
          <div className="w-full overflow-auto max-h-[60vh]">
            <Table className="w-full">
              <TableHeader className="bg-muted/30 sticky top-0 z-10 border-b border-border/50">
                <TableRow>
                  <TableHead className="font-semibold min-w-[120px]">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <Calendar className="w-4 h-4" />
                      Data
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold min-w-[180px]">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <ExternalLink className="w-4 h-4" />
                      IP/ID Acesso
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold min-w-[150px] whitespace-nowrap">Keyword</TableHead>
                  <TableHead className="font-semibold min-w-[200px] whitespace-nowrap">GCLID</TableHead>
                  <TableHead className="font-semibold text-center min-w-[100px]">
                    <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                      <Eye className="w-4 h-4" />
                      Acessos
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-center min-w-[100px]">
                    <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                      <MousePointer className="w-4 h-4" />
                      Cliques
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-center min-w-[120px] whitespace-nowrap">Dispositivo</TableHead>
                  <TableHead className="font-semibold text-center min-w-[150px]">
                    <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                      <MapPin className="w-4 h-4" />
                      País/Estado
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {accessData.map((row) => (
                  <TableRow 
                    key={row.id}
                    className="hover:bg-muted/20 transition-colors border-border/30"
                  >
                    <TableCell className="font-medium">
                      <div className="flex flex-col whitespace-nowrap">
                        <span className="text-sm">{row.data.split(' ')[0]}</span>
                        <span className="text-xs text-muted-foreground">{row.data.split(' ')[1]}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="font-mono text-xs bg-muted/20 px-2 py-1 rounded whitespace-nowrap">
                          {row.ipId.includes('.') ? row.ipId.split(' ')[0] : row.ipId.slice(0, -13)}
                        </div>
                        <div className="font-mono text-xs bg-muted/10 px-2 py-1 rounded whitespace-nowrap text-muted-foreground">
                          {row.ipId.includes('.') ? row.ipId.split(' ')[1] || '' : row.ipId.slice(-13)}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 whitespace-nowrap">
                        {row.keyword}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div 
                        className="flex items-center gap-2 font-mono text-xs text-muted-foreground max-w-[160px] cursor-pointer hover:text-foreground transition-colors group"
                        title={`Clique para copiar: ${row.gclid}`}
                        onClick={() => copyToClipboard(row.gclid, 'GCLID')}
                      >
                        <span className="truncate">{row.gclid}</span>
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                        <Eye className="w-3 h-3 text-muted-foreground" />
                        <span className="font-semibold">{row.acessos}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                        <MousePointer className="w-3 h-3 text-info" />
                        <span className="font-semibold text-info">{row.cliques}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <div className={`flex items-center justify-center gap-1 ${getDeviceColor(row.dispositivo)} whitespace-nowrap`}>
                        {getDeviceIcon(row.dispositivo)}
                        <span className="text-xs font-medium capitalize">{row.dispositivo}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <span className="text-lg">{row.flag}</span>
                          <span className="text-sm font-medium">{row.pais}</span>
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                          {row.estado}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {/* Summary footer */}
        <div className="mt-4 p-4 bg-muted/10 rounded-lg border border-border/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-sm text-muted-foreground">Total Acessos</div>
              <div className="text-xl font-bold text-foreground">
                {accessData.reduce((sum, row) => sum + row.acessos, 0)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Cliques</div>
              <div className="text-xl font-bold text-info">
                {accessData.reduce((sum, row) => sum + row.cliques, 0)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Dispositivos Únicos</div>
              <div className="text-xl font-bold text-primary">
                {new Set(accessData.map(row => row.dispositivo)).size}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Países Únicos</div>
              <div className="text-xl font-bold text-success">
                {new Set(accessData.map(row => row.pais)).size}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PresellAccessDataTable