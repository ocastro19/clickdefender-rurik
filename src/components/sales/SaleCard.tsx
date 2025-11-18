import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ShoppingCart, TrendingUp, RefreshCw, Globe, MousePointer, Eye, ChevronDown, ChevronUp, MapPin, Edit2, Copy } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useToast } from '@/hooks/use-toast'

interface Sale {
  id: string
  produto: string
  dataVenda: string
  valor: number
  tipoTransacao: 'venda' | 'upsell' | 'reembolso'
  pais: string
  estado: string
  trafego: 'pago' | 'organico'
  gclid: string
}

interface SaleCardProps {
  sale: Sale
  isOpen: boolean
  onToggle: () => void
  onEditGclid: (saleId: string, productName: string, currentGclid: string) => void
}

const SaleCard: React.FC<SaleCardProps> = ({ sale, isOpen, onToggle, onEditGclid }) => {
  const isMobile = useIsMobile()
  const { toast } = useToast()

  const copyToClipboard = (text: string, label: string = 'GCLID') => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência.`,
    })
  }

  const formatTransactionValue = (valor: number, tipo: string) => {
    const formattedValue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor)
    
    switch (tipo) {
      case 'venda':
        return formattedValue
      case 'upsell':
        return `+${formattedValue}`
      case 'reembolso':
        return `-${formattedValue}`
      default:
        return formattedValue
    }
  }

  const getTransactionIcon = (tipo: string) => {
    switch (tipo) {
      case 'venda':
        return <ShoppingCart className="w-4 h-4 text-transaction-sales" />
      case 'upsell':
        return <TrendingUp className="w-4 h-4 text-transaction-upsell" />
      case 'reembolso':
        return <RefreshCw className="w-4 h-4 text-destructive" />
      default:
        return <ShoppingCart className="w-4 h-4" />
    }
  }

  const getTransactionBadge = (tipo: string) => {
    switch (tipo) {
      case 'venda':
        return <Badge variant="outline" className="bg-transaction-sales/10 text-transaction-sales border-transaction-sales/20 min-w-[80px] justify-center">Venda</Badge>
      case 'upsell':
        return <Badge variant="outline" className="bg-transaction-upsell/10 text-transaction-upsell border-transaction-upsell/20 min-w-[80px] justify-center">Upsell</Badge>
      case 'reembolso':
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 min-w-[80px] justify-center">Reembolso</Badge>
      default:
        return <Badge variant="outline" className="min-w-[80px] justify-center">Desconhecido</Badge>
    }
  }

  const getTrafficBadge = (trafego: string) => {
    if (trafego === 'pago') {
      return (
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1 min-w-[80px] justify-center">
          <MousePointer className="w-3 h-3" />
          Pago
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20 flex items-center gap-1 min-w-[80px] justify-center">
        <Eye className="w-3 h-3" />
        Orgânico
      </Badge>
    )
  }

  const getCountryFlag = (pais: string) => {
    const flags: { [key: string]: string } = {
      'Brasil': '🇧🇷',
      'Portugal': '🇵🇹',
      'Estados Unidos': '🇺🇸',
      'Argentina': '🇦🇷',
      'México': '🇲🇽'
    }
    return flags[pais] || '🌍'
  }

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <div className="group relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer bg-card/50 hover:bg-card/80 hover:border-primary/20 hover:shadow-lg hover:scale-[1.01]">
          {/* Card compacto profissional */}
          <div className="p-4">
            <div className="flex items-center justify-between gap-4">
              
              {/* Produto com ícone da transação */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                  {getTransactionIcon(sale.tipoTransacao)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground text-sm truncate leading-tight">{sale.produto}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{sale.dataVenda}</p>
                </div>
              </div>
              
              {/* Valor e indicador */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <p className={`font-bold text-lg leading-tight ${
                    sale.trafego === 'organico' 
                      ? 'text-white' 
                      : sale.tipoTransacao === 'reembolso' 
                        ? 'text-destructive' 
                        : sale.tipoTransacao === 'upsell'
                          ? 'text-transaction-upsell'
                          : 'text-transaction-sales'
                  }`}>
                    {formatTransactionValue(sale.valor, sale.tipoTransacao)}
                  </p>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    <span className="text-xs text-muted-foreground">{getCountryFlag(sale.pais)}</span>
                    <span className="text-xs text-muted-foreground">{sale.estado}</span>
                  </div>
                </div>
                
                <div className="w-5 h-5 rounded-full bg-muted/50 flex items-center justify-center">
                  {isOpen ? (
                    <ChevronUp className="w-3 h-3 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="animate-accordion-down">
        {/* Painel expandido profissional */}
        <div className="border-t border-border/30 bg-gradient-to-b from-card/80 to-card/60 backdrop-blur-sm shadow-glow">
          <div className="p-6 space-y-6">
            
            {/* Grid de informações organizadas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Tipo e Origem unificados */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-1 space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground/80 uppercase tracking-wider font-medium">
                  <div className="w-1 h-4 bg-primary/40 rounded-full"></div>
                  Tipo e Origem
                </div>
                <div className="flex items-center gap-2 p-3 bg-background/40 rounded-lg border border-border/30">
                  <div className="flex items-center gap-2">
                    {getTransactionBadge(sale.tipoTransacao)}
                    <div className="w-px h-4 bg-border"></div>
                    {getTrafficBadge(sale.trafego)}
                  </div>
                </div>
              </div>

              {/* Processado em */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground/80 uppercase tracking-wider font-medium">
                  <div className="w-1 h-4 bg-info/40 rounded-full"></div>
                  Processado em
                </div>
                <div className="p-3 bg-background/40 rounded-lg border border-border/30">
                  <p className="text-sm font-medium text-foreground">{sale.dataVenda}</p>
                </div>
              </div>

              {/* País */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground/80 uppercase tracking-wider font-medium">
                  <div className="w-1 h-4 bg-success/40 rounded-full"></div>
                  País
                </div>
                <div className="p-3 bg-background/40 rounded-lg border border-border/30">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCountryFlag(sale.pais)}</span>
                    <span className="text-sm font-medium text-foreground">{sale.pais}</span>
                  </div>
                </div>
              </div>
              
              {/* Estado/Região */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground/80 uppercase tracking-wider font-medium">
                  <div className="w-1 h-4 bg-warning/40 rounded-full"></div>
                  Estado/Região
                </div>
                <div className="p-3 bg-background/40 rounded-lg border border-border/30">
                  <p className="text-sm font-medium text-foreground">{sale.estado}</p>
                </div>
              </div>
            </div>

            {/* Google Click ID - seção destacada */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full"></div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Google Click ID</h4>
                    <p className="text-xs text-muted-foreground">Identificador único da origem do clique</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onEditGclid(sale.id, sale.produto, sale.gclid)
                  }}
                  className="p-2 rounded-lg hover:bg-muted/50 transition-all duration-200 group border border-transparent hover:border-warning/20"
                  title="Editar GCLID"
                >
                  <Edit2 className="w-4 h-4 text-muted-foreground group-hover:text-warning transition-colors" />
                </button>
              </div>
              
              <div className="relative">
                {sale.gclid ? (
                  <div 
                    className="relative p-4 bg-gradient-to-r from-background/80 to-background/60 rounded-xl border border-border/40 font-mono text-xs text-foreground cursor-pointer transition-all duration-300 hover:border-primary/30 hover:shadow-lg group"
                    title={`Clique para copiar: ${sale.gclid}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      copyToClipboard(sale.gclid, 'GCLID')
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-primary/60 flex-shrink-0" />
                      <span className="flex-1 leading-relaxed break-all select-all">{sale.gclid}</span>
                      <div className="flex-shrink-0 p-1.5 rounded-md bg-muted/30 group-hover:bg-primary/10 transition-colors">
                        <Copy className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                  </div>
                ) : (
                  <div className="p-4 bg-muted/20 rounded-xl border-2 border-dashed border-muted/40 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Globe className="w-5 h-5 text-muted-foreground/50" />
                      <p className="text-xs text-muted-foreground italic">Nenhum GCLID registrado</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default SaleCard