import React, { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Upload, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGlobalCurrencyFormatter } from '@/hooks/useGlobalCurrencyFormatter'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from '@/hooks/use-mobile'
import GclidEditModal from '@/components/GclidEditModal'
import SaleCard from '@/components/sales/SaleCard'

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

interface PremiumSalesListProps {
  dateRange?: {
    startDate: string | null
    endDate: string | null
  }
  selectedCampaign?: string
  campaigns?: any[] // Array de campanhas do contexto
}

const PremiumSalesList: React.FC<PremiumSalesListProps> = ({ dateRange, selectedCampaign, campaigns = [] }) => {
  const { formatGlobalCurrency } = useGlobalCurrencyFormatter()
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const [openSales, setOpenSales] = useState<Set<string>>(new Set())
  const [editingGclid, setEditingGclid] = useState<{ saleId: string; productName: string; currentGclid: string } | null>(null)
  const [salesState, setSalesState] = useState<Sale[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  const handleEditGclid = (saleId: string, productName: string, currentGclid: string) => {
    setEditingGclid({ saleId, productName, currentGclid })
  }

  const handleSaveGclid = (newGclid: string) => {
    if (!editingGclid) return
    
    setSalesState(prevSales => 
      prevSales.map(sale => 
        sale.id === editingGclid.saleId 
          ? { ...sale, gclid: newGclid, trafego: 'pago' as const }
          : sale
      )
    )
    setEditingGclid(null)
  }
  
  const salesData = useMemo(() => {
    // Mapeamento de campanhas para produtos e dados de conversão reais
    const campaignProductMap: { [key: string]: { name: string; conversionValue: number; sales: Sale[] } } = {}
    
    // Criar mapeamento dinâmico baseado nas campanhas reais
    campaigns.forEach((campaign) => {
      const conversionValue = campaign.valorConversao || campaign.faturamento / (campaign.conversoes || 1) || 297
      const salesCount = campaign.conversoes || Math.floor(Math.random() * 5) + 1
      
      // Gerar vendas realistas baseadas na campanha
      const campaignSales: Sale[] = []
      for (let i = 0; i < salesCount; i++) {
        campaignSales.push({
          id: `${campaign.id}-${i + 1}`,
          produto: campaign.campanha,
          dataVenda: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          valor: conversionValue,
          tipoTransacao: i === 0 ? 'venda' : (Math.random() > 0.7 ? 'upsell' : 'venda'),
          pais: ['Brasil', 'Estados Unidos', 'Portugal', 'Argentina', 'México'][Math.floor(Math.random() * 5)],
          estado: ['São Paulo', 'California', 'Lisboa', 'Buenos Aires', 'Ciudad de México'][Math.floor(Math.random() * 5)],
          trafego: 'pago',
          gclid: `CjwKCAiA9-HTBhCqEiwAGLVXQ${Math.random().toString(36).substring(7)}...`
        })
      }
      
      campaignProductMap[campaign.id] = {
        name: campaign.campanha,
        conversionValue,
        sales: campaignSales
      }
    })
    
    // Se não há campanhas, usar dados de exemplo
    if (campaigns.length === 0) {
      const exampleSales: Sale[] = [
        {
          id: "1",
          produto: "Curso Marketing Digital Premium",
          dataVenda: "2024-03-19T14:32:00.000Z",
          valor: 497,
          tipoTransacao: "venda",
          pais: "Brasil",
          estado: "São Paulo",
          trafego: "pago",
          gclid: "CjwKCAiA9-HTBhCqEiwAGLVXQh2f8g..."
        },
        {
          id: "2",
          produto: "Mentoria 1:1 - 3 Meses",
          dataVenda: "2024-03-19T13:45:00.000Z",
          valor: 297,
          tipoTransacao: "upsell",
          pais: "Portugal",
          estado: "Lisboa",
          trafego: "organico",
          gclid: ""
        }
      ]
      return exampleSales
    }
    
    // Retornar todas as vendas de todas as campanhas
    return Object.values(campaignProductMap).flatMap(campaign => campaign.sales)
  }, [campaigns])

  // Filtrar e ordenar vendas baseado na campanha selecionada (ordem decrescente por data)
  const sortedSales = useMemo(() => {
    let filteredSales = salesData
    
    if (selectedCampaign && selectedCampaign !== 'all') {
      // Filtrar vendas pela campanha específica selecionada
      filteredSales = salesData.filter(sale => {
        const campaign = campaigns.find(c => c.id === selectedCampaign)
        return campaign && sale.produto === campaign.campanha
      })
    }
    
    // Ordenar por data decrescente (mais recente primeiro)
    return filteredSales.sort((a, b) => {
      const dateA = new Date(a.dataVenda).getTime()
      const dateB = new Date(b.dataVenda).getTime()
      return dateB - dateA // Ordem decrescente
    })
  }, [salesData, selectedCampaign, campaigns])

  // Paginação
  const totalPages = Math.ceil(sortedSales.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSales = sortedSales.slice(startIndex, endIndex)

  // Reset página quando mudarem os filtros
  React.useEffect(() => {
    setCurrentPage(1)
  }, [selectedCampaign, salesData])

  const toggleSale = (saleId: string) => {
    setOpenSales(prev => {
      const newSet = new Set(prev)
      if (newSet.has(saleId)) {
        newSet.delete(saleId)
      } else {
        newSet.add(saleId)
      }
      return newSet
    })
  }

  const formatTransactionValue = (valor: number, tipo: string) => {
    // Formatação direta em USD
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

  const campaignInfo = {
    name: selectedCampaign && selectedCampaign !== 'all' 
      ? campaigns.find(c => c.id === selectedCampaign)?.campanha || 'Campanha não encontrada'
      : 'Todas as campanhas',
    salesCount: sortedSales.length,
    totalValue: sortedSales.reduce((sum, sale) => sum + sale.valor, 0)
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-sm shadow-premium transition-all duration-700">
      <CardHeader className={`${isMobile ? 'p-4 pb-2' : 'p-6 pb-4'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <CardTitle className="flex items-center gap-3 text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              <ShoppingCart className="w-6 h-6 text-primary" />
              Relação de conversões
            </CardTitle>
            <p className="text-muted-foreground text-sm mt-2">
              <span className="font-medium text-primary">{campaignInfo.name}</span> • {campaignInfo.salesCount} conversões • {formatTransactionValue(campaignInfo.totalValue, 'venda')} total
              {totalPages > 1 && <span> • Página {currentPage} de {totalPages}</span>}
            </p>
          </div>
          <Button 
            className="bg-success hover:bg-success/90 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-success/25 flex items-center gap-2"
            onClick={() => console.log('Exportar para Google Ads')}
          >
            <Upload className="w-4 h-4" />
            Exportar para Google Ads
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className={`${isMobile ? 'p-4 pt-0' : 'p-6 pt-0'} space-y-3`}>
        {currentSales.map((sale, index) => (
          <div key={sale.id}>
            <SaleCard 
              sale={{
                ...sale,
                dataVenda: new Date(sale.dataVenda).toLocaleString('pt-BR')
              }}
              isOpen={openSales.has(sale.id)}
              onToggle={() => toggleSale(sale.id)}
              onEditGclid={handleEditGclid}
            />
            
            {index < currentSales.length - 1 && (
              <Separator className="my-2 opacity-30" />
            )}
          </div>
        ))}
        
        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4 border-t border-border/40">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="h-8 w-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <div className="pt-4 border-t border-border/40">
          <p className="text-center text-sm text-muted-foreground">
            <BarChart3 className="h-4 w-4 inline mr-1.5" />
            {currentSales.length > 0 
              ? `Mostrando ${startIndex + 1}-${Math.min(endIndex, sortedSales.length)} de ${sortedSales.length} transações` 
              : 'Nenhuma transação encontrada'
            } • Ordenado por data (mais recente primeiro)
          </p>
        </div>
      </CardContent>
      
      {/* Modal de edição de GCLID */}
      <GclidEditModal
        isOpen={!!editingGclid}
        onClose={() => setEditingGclid(null)}
        onSave={handleSaveGclid}
        currentGclid={editingGclid?.currentGclid || ''}
        productName={editingGclid?.productName || ''}
      />
    </Card>
  )
}

export default PremiumSalesList