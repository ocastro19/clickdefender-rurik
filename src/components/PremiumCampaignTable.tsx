import React, { useState, useMemo } from 'react';
import { Campaign, useCampaigns } from '@/contexts/CampaignContext';
import { Search, Filter, Calendar, Plus, Grid3X3, LayoutList, TrendingUp, TrendingDown, Target, Eye, MoreVertical, Pin, Edit, Trash2, BarChart3, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useGlobalCurrencyFormatter } from '@/hooks/useGlobalCurrencyFormatter';
import IndividualColumnCustomizationModal from './IndividualColumnCustomizationModal';
import { useIndividualCampaignMetrics } from '@/hooks/useIndividualCampaignMetrics';
import { getMetricsConfig } from '@/utils/metricsConfig';
import { getMetricTooltip } from '@/utils/metricsTooltips';
import { useTranslation } from 'react-i18next';

interface PremiumCampaignTableProps {
  campaigns: Campaign[];
  onEdit?: (campaign: Campaign) => void;
  onDelete?: (campaignId: string) => void;
  onNewCampaign?: () => void;
}

type ViewMode = 'grid' | 'list';
type SortField = 'campanha' | 'custo' | 'impressoes' | 'cliques' | 'conversoes' | 'roas';
type SortOrder = 'asc' | 'desc';

export default function PremiumCampaignTable({
  campaigns,
  onEdit,
  onDelete,
  onNewCampaign
}: PremiumCampaignTableProps): React.ReactElement {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('campanha');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [pinnedCampaigns, setPinnedCampaigns] = useState<Set<string>>(new Set());
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());
  const [customizationModal, setCustomizationModal] = useState<{ isOpen: boolean; campaignId: string; campaignName: string }>({
    isOpen: false,
    campaignId: '',
    campaignName: ''
  });
  const { getMetricsForCampaign, setMetricsForCampaign } = useIndividualCampaignMetrics();
  const { formatGlobalCurrency } = useGlobalCurrencyFormatter();
  const { updateCampaignWithCalculations } = useCampaigns();

  // Filtrar e ordenar campanhas
  const filteredAndSortedCampaigns = useMemo(() => {
    let filtered = campaigns.filter(campaign => {
      const matchesSearch = campaign.campanha.toLowerCase().includes(searchTerm.toLowerCase());
      const isActive = campaign.isActive ?? true; // Use actual isActive field
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && isActive) ||
        (statusFilter === 'paused' && !isActive);
      return matchesSearch && matchesStatus;
    });

    // Ordenação
    filtered.sort((a, b) => {
      // Campanhas fixadas sempre no topo
      const aIsPinned = pinnedCampaigns.has(a.id);
      const bIsPinned = pinnedCampaigns.has(b.id);
      if (aIsPinned && !bIsPinned) return -1;
      if (!aIsPinned && bIsPinned) return 1;

      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'campanha':
          aValue = a.campanha.toLowerCase();
          bValue = b.campanha.toLowerCase();
          break;
        case 'custo':
          aValue = a.custo || 0;
          bValue = b.custo || 0;
          break;
        case 'impressoes':
          aValue = a.impressoes || 0;
          bValue = b.impressoes || 0;
          break;
        case 'cliques':
          aValue = a.cliques || 0;
          bValue = b.cliques || 0;
          break;
        case 'conversoes':
          aValue = a.conversoes || 0;
          bValue = b.conversoes || 0;
          break;
        case 'roas':
          aValue = a.custo ? (a.faturamento || 0) / a.custo : 0;
          bValue = b.custo ? (b.faturamento || 0) / b.custo : 0;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
      }
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    });

    return filtered;
  }, [campaigns, searchTerm, statusFilter, sortField, sortOrder, pinnedCampaigns]);

  // Calcular estatísticas gerais
  const stats = useMemo(() => {
    const totalCost = filteredAndSortedCampaigns.reduce((sum, c) => sum + (c.custo || 0), 0);
    const totalRevenue = filteredAndSortedCampaigns.reduce((sum, c) => sum + (c.faturamento || 0), 0);
    const totalImpressions = filteredAndSortedCampaigns.reduce((sum, c) => sum + (c.impressoes || 0), 0);
    const totalClicks = filteredAndSortedCampaigns.reduce((sum, c) => sum + (c.cliques || 0), 0);
    const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions * 100) : 0;
    const avgROAS = totalCost > 0 ? (totalRevenue / totalCost) : 0;

    return {
      totalCost,
      totalRevenue,
      totalImpressions,
      totalClicks,
      avgCTR,
      avgROAS,
      activeCount: filteredAndSortedCampaigns.filter(c => c.isActive ?? true).length,
      totalCount: filteredAndSortedCampaigns.length
    };
  }, [filteredAndSortedCampaigns]);

  const handlePin = (campaignId: string) => {
    const newPinned = new Set(pinnedCampaigns);
    if (newPinned.has(campaignId)) {
      newPinned.delete(campaignId);
    } else {
      newPinned.add(campaignId);
    }
    setPinnedCampaigns(newPinned);
    // Não fecha o dropdown automaticamente para permitir múltiplas ações
  };

  const closeDropdown = (campaignId: string) => {
    setOpenDropdowns(prev => {
      const newSet = new Set(prev);
      newSet.delete(campaignId);
      return newSet;
    });
  };

  const toggleDropdown = (campaignId: string, isOpen: boolean) => {
    setOpenDropdowns(prev => {
      const newSet = new Set(prev);
      if (isOpen) {
        newSet.add(campaignId);
      } else {
        newSet.delete(campaignId);
      }
      return newSet;
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleCustomizeMetrics = (campaignId: string, campaignName: string) => {
    setCustomizationModal({
      isOpen: true,
      campaignId,
      campaignName
    });
    // Fecha o dropdown após abrir o modal
    closeDropdown(campaignId);
  };

  const getMetricValue = (campaign: Campaign, metricKey: string) => {
    const currency = campaign.currency || 'USD';
    
    switch (metricKey) {
      // Basic metrics
      case 'custo':
        return formatGlobalCurrency(campaign.custo || 0, currency);
      case 'faturamento':
        return formatGlobalCurrency(campaign.faturamento || 0, currency);
      case 'impressoes':
        return new Intl.NumberFormat('pt-BR').format(campaign.impressoes || 0);
      case 'cliques':
        return new Intl.NumberFormat('pt-BR').format(campaign.cliques || 0);
      case 'conversoes':
        return new Intl.NumberFormat('pt-BR').format(campaign.conversoes || 0);
      case 'orcamento':
        return formatGlobalCurrency(campaign.orcamento || 0, currency);
      
      // Calculated percentage metrics
      case 'ctr':
        return campaign.impressoes ? `${((campaign.cliques || 0) / campaign.impressoes * 100).toFixed(2)}%` : '0.00%';
      case 'taxaConversao':
        return campaign.cliques ? `${((campaign.conversoes || 0) / campaign.cliques * 100).toFixed(2)}%` : '0.00%';
      case 'roi':
        const profit = (campaign.faturamento || 0) - (campaign.custo || 0);
        return campaign.custo ? `${(profit / campaign.custo * 100).toFixed(1)}%` : '0.0%';
      
      // Cost metrics
      case 'cpc':
      case 'cpcMedio':
        return campaign.cliques ? formatGlobalCurrency((campaign.custo || 0) / campaign.cliques, currency) : formatGlobalCurrency(0, currency);
      case 'custoConversao':
        return campaign.conversoes ? formatGlobalCurrency((campaign.custo || 0) / campaign.conversoes, currency) : formatGlobalCurrency(0, currency);
      case 'cpm':
        return campaign.impressoes ? formatGlobalCurrency((campaign.custo || 0) / campaign.impressoes * 1000, currency) : formatGlobalCurrency(0, currency);
      
      // Revenue metrics
      case 'roas':
        return campaign.custo ? `${((campaign.faturamento || 0) / campaign.custo).toFixed(2)}x` : '0.00x';
      case 'valorConversao':
        return formatGlobalCurrency(campaign.valorConversao || 0, currency);
      case 'comissao':
        return formatGlobalCurrency(campaign.comissao || 0, 'USD'); // Always USD as per config
      case 'lucro':
        return formatGlobalCurrency((campaign.faturamento || 0) - (campaign.custo || 0), currency);
      
      // Other metrics
      case 'cliquesInvalidos':
        return new Intl.NumberFormat('pt-BR').format(campaign.cliquesInvalidos || 0);
      case 'visitors':
        return new Intl.NumberFormat('pt-BR').format(campaign.visitors || 0);
      case 'checkouts':
        return new Intl.NumberFormat('pt-BR').format(campaign.checkouts || 0);
      case 'visualizacoes':
        return new Intl.NumberFormat('pt-BR').format(campaign.visualizacoes || 0);
      
      // Text/configuration fields
      case 'estrategiaLances':
        return campaign.estrategiaLances || '—';
      case 'tipoCampanha':
        return campaign.tipoCampanha || '—';
      case 'statusCampanha':
        return campaign.statusCampanha || (campaign.isActive ? 'Ativa' : 'Pausada');
      case 'moeda':
        return campaign.currency || 'USD';
      
      default:
        // Fallback for any unhandled metrics
        const value = (campaign as any)[metricKey];
        if (typeof value === 'number') {
          if (metricKey.includes('taxa') || metricKey.includes('percentual')) {
            return `${value.toFixed(2)}%`;
          }
          return new Intl.NumberFormat('pt-BR').format(value);
        }
        return value?.toString() || '—';
    }
  };

  const getMetricLabel = (metricKey: string) => {
    const metricsConfig = getMetricsConfig(t);
    return metricsConfig[metricKey]?.displayName || metricKey;
  };

  const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
    const campaignMetrics = getMetricsForCampaign(campaign.id);
    const ctr = campaign.impressoes ? ((campaign.cliques || 0) / campaign.impressoes * 100) : 0;
    const roas = campaign.custo ? (campaign.faturamento || 0) / campaign.custo : 0;
    const isPinned = pinnedCampaigns.has(campaign.id);
    const isActive = campaign.isActive ?? true;

    return (
      <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-glow ${
        isPinned 
          ? 'border-primary/40 bg-gradient-to-br from-primary/5 via-background to-background' 
          : 'border-border hover:border-primary/30'
      }`}>
        {/* Status indicator */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${
          isActive 
            ? 'bg-gradient-to-r from-success to-success/60' 
            : 'bg-gradient-to-r from-muted to-muted/60'
        }`} />

        {/* Pin indicator */}
        {isPinned && (
          <div className="absolute top-3 right-3 z-10">
              <Badge variant="secondary" className="bg-warning/20 text-warning border-warning/30">
                <Pin className="w-3 h-3 mr-1" />
                {t('campaigns.pinned')}
              </Badge>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isActive 
                  ? 'bg-gradient-to-br from-primary to-primary/70 text-primary-foreground' 
                  : 'bg-gradient-to-br from-muted to-muted/70 text-muted-foreground'
              }`}>
                <Target className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold truncate max-w-48">
                  {campaign.campanha}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {new Date(campaign.data).toLocaleDateString('pt-BR')}
                  </Badge>
                  <Switch 
                    checked={isActive} 
                    onCheckedChange={(checked) => {
                      updateCampaignWithCalculations(campaign.id, { isActive: checked });
                    }}
                    className="scale-75" 
                  />
                </div>
              </div>
            </div>

            <DropdownMenu 
              open={openDropdowns.has(campaign.id)}
              onOpenChange={(isOpen) => toggleDropdown(campaign.id, isOpen)}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem 
                  onSelect={(e) => {
                    e.preventDefault();
                    handleCustomizeMetrics(campaign.id, campaign.campanha);
                  }}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {t('campaigns.customizeMetrics')}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onSelect={(e) => {
                    e.preventDefault();
                    handlePin(campaign.id);
                  }}
                >
                  <Pin className="w-4 h-4 mr-2" />
                  {isPinned ? t('campaigns.unpinCampaign') : t('campaigns.pinCampaign')}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onSelect={(e) => {
                    e.preventDefault();
                    onEdit?.(campaign);
                    closeDropdown(campaign.id);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {t('common.edit')}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive"
                  onSelect={(e) => {
                    e.preventDefault();
                    onDelete?.(campaign.id);
                    closeDropdown(campaign.id);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('common.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Métricas dinâmicas baseadas na seleção individual */}
          <div className={`grid gap-4 ${campaignMetrics.length <= 2 ? 'grid-cols-1' : campaignMetrics.length <= 4 ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-3'}`}>
            {campaignMetrics.map(metricKey => (
              <Tooltip key={metricKey}>
                <TooltipTrigger asChild>
                  <div className="space-y-1 cursor-help">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                      {getMetricLabel(metricKey)}
                    </p>
                    <p className={`font-bold ${
                      metricKey === 'custo' ? 'text-primary text-xl' : 
                      metricKey === 'faturamento' ? 'text-success text-xl' : 
                      metricKey === 'roas' && roas >= 2 ? 'text-success text-lg' :
                      metricKey === 'roas' && roas >= 1 ? 'text-warning text-lg' :
                      metricKey === 'roas' && roas < 1 ? 'text-destructive text-lg' :
                      metricKey === 'ctr' && ctr > 3 ? 'text-success text-lg' :
                      metricKey === 'ctr' && ctr <= 3 ? 'text-muted-foreground text-lg' :
                      'text-foreground text-lg'
                    }`}>
                      {getMetricValue(campaign, metricKey)}
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="z-[99999] fixed">
                  <p className="max-w-xs text-sm">
                    {getMetricTooltip(metricKey, t)}
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Performance indicators quando CTR e ROAS estão selecionados */}
          {(campaignMetrics.includes('ctr') || campaignMetrics.includes('roas')) && (
            <div className="flex items-center justify-center pt-4 border-t border-border/50">
              <div className="flex items-center gap-4 text-sm">
                {campaignMetrics.includes('ctr') && (
                  <div className="flex items-center gap-1">
                    {ctr > 3 ? (
                      <TrendingUp className="w-3 h-3 text-success" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-destructive" />
                    )}
                    <span className="text-muted-foreground">
                      {ctr > 3 ? t('campaigns.ctrExcellent') : t('campaigns.ctrLow')}
                    </span>
                  </div>
                )}
                {campaignMetrics.includes('roas') && (
                  <div className="flex items-center gap-1">
                    {roas >= 2 ? (
                      <TrendingUp className="w-3 h-3 text-success" />
                    ) : roas >= 1 ? (
                      <TrendingUp className="w-3 h-3 text-warning" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-destructive" />
                    )}
                    <span className="text-muted-foreground">
                      {roas >= 2 ? t('campaigns.roasGreat') : roas >= 1 ? t('campaigns.roasOk') : t('campaigns.roasLow')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <TooltipProvider>
      <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            {t('analytics.title')}
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            {t('analytics.description', { defaultValue: 'Controle analítico avançado de campanhas com métricas personalizáveis' })}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {onNewCampaign && (
            <Button onClick={onNewCampaign} className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-premium">
              <Plus className="w-4 h-4 mr-2" />
              {t('campaigns.newCampaign')}
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 bg-gradient-to-br from-primary/10 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('campaigns.totalInvested')}</p>
                <p className="text-2xl font-bold text-primary">{formatGlobalCurrency(stats.totalCost)}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-success/10 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('campaigns.revenue')}</p>
                <p className="text-2xl font-bold text-success">{formatGlobalCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('campaigns.averageCTR')}</p>
                <p className="text-2xl font-bold text-blue-600">{stats.avgCTR.toFixed(2)}%</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('campaigns.averageROAS')}</p>
                <p className="text-2xl font-bold text-purple-600">{stats.avgROAS.toFixed(2)}x</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card className="border-0 bg-gradient-to-r from-card/50 to-muted/20 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t('campaigns.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/80 border-border/60 focus:border-primary/50"
                />
              </div>

              {/* Status filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-background/80 border-border/60">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('campaigns.allCampaignsFilter')}</SelectItem>
                  <SelectItem value="active">{t('campaigns.activeCampaigns')}</SelectItem>
                  <SelectItem value="paused">{t('campaigns.pausedCampaigns')}</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={`${sortField}-${sortOrder}`} onValueChange={(value) => {
                const [field, order] = value.split('-') as [SortField, SortOrder];
                setSortField(field);
                setSortOrder(order);
              }}>
                <SelectTrigger className="w-48 bg-background/80 border-border/60">
                  <SelectValue placeholder={t('campaigns.sortBy')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="campanha-asc">{t('campaigns.nameAZ')}</SelectItem>
                  <SelectItem value="campanha-desc">{t('campaigns.nameZA')}</SelectItem>
                  <SelectItem value="custo-desc">{t('campaigns.highestInvestment')}</SelectItem>
                  <SelectItem value="custo-asc">{t('campaigns.lowestInvestment')}</SelectItem>
                  <SelectItem value="roas-desc">{t('campaigns.highestROAS')}</SelectItem>
                  <SelectItem value="roas-asc">{t('campaigns.lowestROAS')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8"
              >
                <LayoutList className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">{t('campaigns.title')}</h2>
          <Badge variant="secondary" className="px-3 py-1">
            {stats.activeCount} {t('campaigns.activeCampaignsCount')} {stats.totalCount} {t('campaigns.totalCampaigns')}
          </Badge>
        </div>
        
        {pinnedCampaigns.size > 0 && (
          <Badge variant="outline" className="border-warning/30 text-warning">
            <Pin className="w-3 h-3 mr-1" />
            {pinnedCampaigns.size} {pinnedCampaigns.size > 1 ? t('campaigns.pinnedMultiple') : t('campaigns.pinned')}
          </Badge>
        )}
      </div>

      {/* Campaigns Grid/List */}
      {filteredAndSortedCampaigns.length === 0 ? (
        <Card className="border-dashed border-2 border-muted">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Target className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              {t('campaigns.noCampaignsFound')}
            </h3>
            <p className="text-muted-foreground text-center">
              {searchTerm ? t('campaigns.adjustFilters') : t('campaigns.createFirstCampaign')}
            </p>
            {onNewCampaign && !searchTerm && (
              <Button onClick={onNewCampaign} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                {t('campaigns.newCampaign')}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
            : 'space-y-4'
        }>
          {filteredAndSortedCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}

      {/* Modal de personalização individual */}
      <IndividualColumnCustomizationModal
        campaignName={customizationModal.campaignName}
        selectedMetrics={getMetricsForCampaign(customizationModal.campaignId)}
        onMetricsChange={(metrics) => setMetricsForCampaign(customizationModal.campaignId, metrics)}
        isOpen={customizationModal.isOpen}
        onOpenChange={(open) => setCustomizationModal(prev => ({ ...prev, isOpen: open }))}
      />
      </div>
    </TooltipProvider>
  );
}