import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useIsMobile } from "@/hooks/use-mobile";
import { CompactDateRangeFilter } from "@/components/CompactDateRangeFilter";
import { useCampaigns } from "@/contexts/CampaignContext";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import CampaignCard from "@/components/CampaignCard";
import PresellAccessDataTable from "@/components/PresellAccessDataTable";
import PresellWizard from "@/components/criar/PresellWizard";
import { Button } from "@/components/ui/button";
import { BarChart3, Eye, Plus, Info } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Cookie, Timer, Code, Link as LinkIcon } from "lucide-react";

const CampanhasContent = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { dateRange, hasDateFilter } = useDateRangeFilter();
  const { campaigns, deleteCampaign } = useCampaigns();
  const [selectedPresell, setSelectedPresell] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estados para criar nova campanha
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  
  // Converter campanhas do contexto para o formato esperado pela interface
  const [presells, setPresells] = useState<any[]>([]);

  // Manter dados mockados para presells antigas
  const defaultPresells = [
    {
      id: 1,
      name: "BrainDefender",
      type: "Script",
      visitas: 4,
      cliques: 1,
      taxaFuga: "75.0%",
      checkouts: 0,
      vendas: 0,
      reembolsos: 0,
      status: 'active' as const
    },
    {
      id: 2,
      name: "GlucoSense",
      type: "Script",
      visitas: 1,
      cliques: 0,
      taxaFuga: "100%",
      checkouts: 0,
      vendas: 0,
      reembolsos: 0,
      status: 'active' as const
    },
    {
      id: 3,
      name: "Audizen",
      type: "Script",
      visitas: 1,
      cliques: 1,
      taxaFuga: "0.0%",
      checkouts: 0,
      vendas: 0,
      reembolsos: 0,
      status: 'active' as const
    },
    {
      id: 4,
      name: "Glycoshield",
      type: "Script",
      visitas: 0,
      cliques: 0,
      taxaFuga: "0.0%",
      checkouts: 0,
      vendas: 0,
      reembolsos: 0,
      status: 'paused' as const
    },
    {
      id: 5,
      name: "NerveFlow",
      type: "Script",
      visitas: 0,
      cliques: 0,
      taxaFuga: "0.0%",
      checkouts: 0,
      vendas: 0,
      reembolsos: 0,
      status: 'draft' as const
    }
  ];

  // Preparar lista de presells (evitar IDs duplicados)
  useEffect(() => {
    const formattedPresells = campaigns.map((campaign) => ({
      id: parseInt(campaign.id) || Date.now(),
      name: campaign.campanha,
      type: campaign.conversionGoal ? "Presell" : "Script",
      visitas: campaign.visitors || 0,
      cliques: campaign.cliques || 0,
      taxaFuga: campaign.cliques > 0 
        ? `${((1 - (campaign.conversoes / campaign.cliques)) * 100).toFixed(1)}%` 
        : "0.0%",
      checkouts: campaign.checkouts || 0,
      vendas: campaign.conversoes || 0,
      reembolsos: 0,
      status: campaign.isActive ? 'active' as const : 'paused' as const,
      domain: campaign.domain || '',
      conversionGoal: campaign.conversionGoal || '',
      checkoutGoal: campaign.checkoutGoal || '',
      platform: campaign.estrategiaLances || '',
      createdAt: campaign.data,
      source: 'ctx' as const,
    }));

    // Se houver campanhas reais, usar apenas elas; senão, usar mock
    const basePresells = (formattedPresells.length > 0
      ? formattedPresells
      : defaultPresells.map((p) => ({ ...p, source: 'default' as const })));
    
    // Ordenar por performance: visitas + (cliques * 2)
    const sortedPresells = basePresells.sort((a, b) => {
      const scoreA = a.visitas + (a.cliques * 2);
      const scoreB = b.visitas + (b.cliques * 2);
      if (scoreB !== scoreA) return scoreB - scoreA;
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;
      return 0;
    });

    setPresells(sortedPresells);
  }, [campaigns]);

  // Opções de presell
  const presellOptions = [
    {
      value: 'presell-cookie',
      label: 'Presell Cookie',
      icon: Cookie,
      description: 'Simula um cookie de consentimento na tela do cliente'
    },
    {
      value: 'presell-escassez',
      label: 'Presell Escassez',
      icon: Timer,
      description: 'Mensagem de escassez de últimas unidades'
    },
    {
      value: 'script-rastreamento',
      label: 'Script de Rastreamento',
      icon: Code,
      description: 'Rastreamento avançado de conversões'
    },
    {
      value: 'url-produtor',
      label: 'URL do Produtor',
      icon: LinkIcon,
      description: 'UTM para página de vendas do produto'
    }
  ];

  const handleSelectChange = (value: string) => {
    setSelectedType(value);
  };

  const handleContinue = () => {
    if (!selectedType) return;
    setIsCreateDialogOpen(false);
    setIsWizardOpen(true);
  };

  // Dados mock para a tabela de acesso
  const accessData: Record<string, any[]> = {
    'BrainDefender': [
      {
        id: '1',
        data: '25/07/2025 16:45',
        ipId: '98.97.35.111 175347359404',
        keyword: 'glucosense',
        gclid: 'EAIaIQobChMImTt_aa5PMjgMVTdXCBB06JCkgEAAYASAAEgLhOfD_BwE',
        acessos: 1,
        cliques: 0,
        dispositivo: 'mobile' as const,
        pais: 'US',
        estado: 'Washington',
        flag: '🇺🇸'
      },
      {
        id: '2',
        data: '25/07/2025 14:32',
        ipId: '192.168.1.105 875643921287',
        keyword: 'braindefender',
        gclid: 'EAIaIQobChMImTt_bb8PMjgMVTdXCBB06JCkgEAAYASAAEgLhOfD_BwE',
        acessos: 2,
        cliques: 1,
        dispositivo: 'desktop' as const,
        pais: 'BR',
        estado: 'São Paulo',
        flag: '🇧🇷'
      },
      {
        id: '3',
        data: '25/07/2025 12:15',
        ipId: '203.45.67.89 456789123456',
        keyword: 'brain defender supplement',
        gclid: 'EAIaIQobChMImTt_cc9PMjgMVTdXCBB06JCkgEAAYASAAEgLhOfD_BwE',
        acessos: 1,
        cliques: 0,
        dispositivo: 'tablet' as const,
        pais: 'CA',
        estado: 'Ontario',
        flag: '🇨🇦'
      }
    ]
  };

  const handlePresellSelect = (presellName: string) => {
    setSelectedPresell(presellName);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPresell(null);
  };

  const handleDeletePresell = (presellId: number) => {
    // Encontrar a campanha correspondente
    const presell = presells.find(p => p.id === presellId);
    
    // Se a presell tem createdAt (foi criada dinamicamente), deletar do contexto
    if (presell && presell.createdAt) {
      const campaignToDelete = campaigns.find(c => c.campanha === presell.name);
      if (campaignToDelete) {
        deleteCampaign(campaignToDelete.id);
      }
    }
    
    // Remover do estado local
    setPresells(prev => prev.filter(p => p.id !== presellId));
  };

  // Renderizar tela principal com grid de cards
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      <div className={`${isMobile ? 'p-2 mx-1' : 'p-4 mx-4'}`}>
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Compact Date Range Filter */}
          <div className="flex justify-end">
            <CompactDateRangeFilter />
          </div>
          
          {/* Dashboard KPIs - Normal em cima */}
          <div className="space-y-4">
            {/* Header compacto com KPIs principais */}
            <div className="bg-card shadow-premium transition-all duration-500 hover:shadow-elegant rounded-xl dark:bg-gradient-to-r dark:from-card/80 dark:to-card/40 dark:backdrop-blur-md">
              <div className={`${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
                <div className={`flex ${isMobile ? 'flex-col gap-3' : 'flex-col lg:flex-row'} items-start lg:items-center justify-between gap-3`}>
                  {/* Título e botão Nova Campanha */}
                  <div className={`flex ${isMobile ? 'flex-col gap-2 w-full' : 'items-center gap-4'}`}>
                    <div className="flex items-center gap-2">
                      <div className={`${isMobile ? 'p-1.5' : 'p-2'} rounded-lg bg-gradient-to-r from-primary to-primary/70 shadow-glow`}>
                        <svg className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-primary-foreground`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h1 className={`${isMobile ? 'text-base' : 'text-lg sm:text-xl'} font-bold text-foreground`}>
                          Campanhas
                        </h1>
                        <p className={`${isMobile ? 'text-xs' : 'text-xs'} text-muted-foreground`}>
                          {presells.length} total
                        </p>
                      </div>
                    </div>
                    
                    {/* Botão Nova Campanha */}
                    <Button 
                      onClick={() => setIsCreateDialogOpen(true)}
                      size={isMobile ? "sm" : "default"}
                      className={`${isMobile ? 'w-full' : ''} shadow-lg`}
                    >
                      <Plus className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-2`} />
                      Nova Campanha
                    </Button>
                  </div>

                  {/* KPIs em linha */}
                  <div className={`grid ${isMobile ? 'grid-cols-3 gap-2' : 'grid-cols-2 lg:grid-cols-6 gap-2 lg:gap-3'}`}>
                    {/* Acessos */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <svg className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-blue-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className={`${isMobile ? 'text-[9px]' : 'text-[10px]'} font-medium text-muted-foreground uppercase`}>
                          Acessos
                        </span>
                      </div>
                      <div className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-blue-500`}>
                        {presells.reduce((sum, p) => sum + p.visitas, 0)}
                      </div>
                    </div>
                  
                    {/* Cliques */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <svg className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-blue-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                        <span className={`${isMobile ? 'text-[9px]' : 'text-[10px]'} font-medium text-muted-foreground uppercase`}>Cliques</span>
                      </div>
                      <div className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-blue-400`}>
                        {presells.reduce((sum, p) => sum + p.cliques, 0)}
                      </div>
                    </div>

                    {/* Fuga */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <svg className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-red-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                        </svg>
                       <span className={`${isMobile ? 'text-[9px]' : 'text-[10px]'} font-medium text-muted-foreground uppercase`}>Fuga</span>
                     </div>
                     <div className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-red-500`}>
                       {((presells.reduce((sum, p) => sum + p.visitas, 0) - presells.reduce((sum, p) => sum + p.cliques, 0)) / Math.max(presells.reduce((sum, p) => sum + p.visitas, 0), 1) * 100).toFixed(1)}%
                     </div>
                    </div>
                  
                    {/* Checkout */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <svg className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-primary`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        <span className={`${isMobile ? 'text-[9px]' : 'text-[10px]'} font-medium text-muted-foreground uppercase`}>Checkout</span>
                      </div>
                      <div className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-primary`}>
                        {presells.reduce((sum, p) => sum + (p.checkouts || 0), 0)}
                      </div>
                    </div>
                  
                    {/* Vendas */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <svg className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-green-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className={`${isMobile ? 'text-[9px]' : 'text-[10px]'} font-medium text-muted-foreground uppercase`}>Vendas</span>
                      </div>
                      <div className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-green-500`}>
                        {presells.reduce((sum, p) => sum + p.vendas, 0)}
                      </div>
                    </div>

                    {/* Reembolso */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <svg className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-orange-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        <span className={`${isMobile ? 'text-[9px]' : 'text-[10px]'} font-medium text-muted-foreground uppercase`}>Reembolso</span>
                      </div>
                      <div className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-orange-500`}>
                        {presells.reduce((sum, p) => sum + (p.reembolsos || 0), 0)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Grid de Cards - 3 por linha */}
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-4`}>
            {presells.map((presell) => (
              <CampaignCard
                key={`${presell.source || 'mix'}-${presell.id}`}
                id={presell.id.toString()}
                name={presell.name}
                visits={presell.visitas}
                clicks={presell.cliques}
                bounceRate={parseFloat(presell.taxaFuga.replace('%', ''))}
                checkouts={presell.checkouts || 0}
                sales={presell.vendas}
                refunds={presell.reembolsos || 0}
                status={presell.status}
                onClick={() => handlePresellSelect(presell.name)}
                onDelete={() => handleDeletePresell(presell.id)}
              />
            ))}
          </div>

          {/* Modal de Detalhes */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-[95vw] lg:max-w-[90vw] max-h-[90vh] overflow-y-auto p-6">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Eye className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{selectedPresell}</DialogTitle>
                    <p className="text-sm text-muted-foreground">Dados de acesso detalhados</p>
                  </div>
                </div>
              </DialogHeader>

              {selectedPresell && (
                <div className="space-y-4 mt-4">
                  {/* Métricas resumidas */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">
                        {presells.find(p => p.name === selectedPresell)?.visitas || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Visitas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {presells.find(p => p.name === selectedPresell)?.cliques || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Cliques</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-500">
                        {presells.find(p => p.name === selectedPresell)?.taxaFuga || '0%'}
                      </div>
                      <div className="text-xs text-muted-foreground">Fuga</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {presells.find(p => p.name === selectedPresell)?.checkouts || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Checkout</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">
                        {presells.find(p => p.name === selectedPresell)?.vendas || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Vendas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-500">
                        {presells.find(p => p.name === selectedPresell)?.reembolsos || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Reembolso</div>
                    </div>
                  </div>

                  {/* Botões de ação */}
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      Domínio
                    </Button>
                    <Button variant="outline" size="sm">
                      Meta de Conversão
                    </Button>
                    <Button variant="outline" size="sm">
                      Meta de Checkout
                    </Button>
                  </div>

                  {/* Tabela de dados */}
                  {accessData[selectedPresell] ? (
                    <PresellAccessDataTable 
                      presellName={selectedPresell}
                      accessData={accessData[selectedPresell]}
                    />
                  ) : (
                    <div className="p-12 text-center">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-muted/30 to-muted/10 flex items-center justify-center">
                        <BarChart3 className="w-10 h-10 text-muted-foreground/50" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Nenhum Dado Disponível
                      </h3>
                      <p className="text-muted-foreground">
                        Não há dados de acesso para esta presell no momento.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Dialog para criar nova campanha */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className={`${isMobile ? 'w-[95vw] max-w-[95vw]' : 'sm:max-w-2xl'} rounded-2xl p-0 max-h-[90vh] overflow-y-auto`}>
              <div className={`${isMobile ? 'p-4' : 'p-8'}`}>
                <DialogHeader className={`${isMobile ? 'mb-4' : 'mb-6'} text-left`}>
                  <div className={`flex items-center gap-3 ${isMobile ? 'mb-2' : 'mb-3'}`}>
                    <div className={`flex ${isMobile ? 'h-10 w-10' : 'h-12 w-12'} items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg`}>
                      <Info className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
                    </div>
                    <div>
                      <DialogTitle className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold`}>
                        Selecione sua criação de campanha
                      </DialogTitle>
                    </div>
                  </div>
                  <DialogDescription className={`${isMobile ? 'text-xs pl-13' : 'text-base pl-15'}`}>
                    Escolha o tipo de presell que deseja criar
                  </DialogDescription>
                </DialogHeader>
                
                <div className={`space-y-${isMobile ? '4' : '6'}`}>
                  <div className={`space-y-${isMobile ? '3' : '4'}`}>
                    <Label htmlFor="presell-select" className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold`}>
                      Escolha uma opção...
                    </Label>
                    <Select value={selectedType} onValueChange={handleSelectChange}>
                      <SelectTrigger 
                        id="presell-select" 
                        className={`w-full ${isMobile ? 'h-12' : 'h-16'} ${isMobile ? 'text-sm' : 'text-base'} bg-background border-2 rounded-xl focus:border-primary hover:border-primary/50 transition-colors`}
                      >
                        <SelectValue placeholder="Escolha uma opção..." />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-2 rounded-xl z-[200] max-h-[60vh] overflow-y-auto">
                        {presellOptions.map((option) => {
                          const Icon = option.icon;
                          return (
                            <SelectItem 
                              key={option.value} 
                              value={option.value}
                              className={`cursor-pointer ${isMobile ? 'py-3' : 'py-4'} rounded-lg my-1 hover:bg-accent focus:bg-accent transition-colors`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`${isMobile ? 'p-2' : 'p-2.5'} rounded-xl bg-primary/10`}>
                                  <Icon className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-primary`} />
                                </div>
                                <div className="flex flex-col text-left">
                                  <span className={`font-semibold ${isMobile ? 'text-sm' : 'text-base'}`}>{option.label}</span>
                                  <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-muted-foreground mt-1`}>{option.description}</span>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <div className={`flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                      <Info className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                      <span>{presellOptions.length} opções disponíveis para criação de presell</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleContinue} 
                    className={`w-full ${isMobile ? 'h-11' : 'h-14'} ${isMobile ? 'text-sm' : 'text-base'} font-semibold rounded-xl shadow-lg`}
                    disabled={!selectedType}
                    size={isMobile ? "default" : "lg"}
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Wizard de criação de presell */}
          {selectedType && (
            <PresellWizard
              open={isWizardOpen}
              onClose={() => {
                setIsWizardOpen(false);
                setSelectedType('');
              }}
              presellType={selectedType}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const Campanhas = () => {
  return <CampanhasContent />;
};

export default Campanhas;
