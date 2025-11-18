
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Campaign } from '@/contexts/CampaignContext';
import CampaignFilters from './campaigns/CampaignFilters';
import CampaignRow from './campaigns/CampaignRow';
import CampaignSummary from './campaigns/CampaignSummary';

interface CampaignTableProps {
  campaigns: Campaign[];
  onEdit?: (campaign: Campaign) => void;
  onDelete?: (campaignId: string) => void;
  onNewCampaign?: () => void;
}

export default function CampaignTable({
  campaigns,
  onEdit,
  onDelete,
  onNewCampaign
}: CampaignTableProps): React.ReactElement {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedCampaign, setFocusedCampaign] = useState<string | null>(null);
  const [pinnedCampaigns, setPinnedCampaigns] = useState<Set<string>>(new Set());

  // Filtrar campanhas por termo de busca
  const filteredCampaigns = useMemo(() => {
    if (!searchTerm) return campaigns;
    return campaigns.filter(campaign => campaign.campanha.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [campaigns, searchTerm]);

  // Ordenar campanhas (fixadas primeiro)
  const sortedCampaigns = useMemo(() => {
    return [...filteredCampaigns].sort((a, b) => {
      const aIsPinned = pinnedCampaigns.has(a.id);
      const bIsPinned = pinnedCampaigns.has(b.id);
      if (aIsPinned && !bIsPinned) return -1;
      if (!aIsPinned && bIsPinned) return 1;
      return 0;
    });
  }, [filteredCampaigns, pinnedCampaigns]);

  const handlePin = (campaignId: string) => {
    const newPinned = new Set(pinnedCampaigns);
    if (newPinned.has(campaignId)) {
      newPinned.delete(campaignId);
    } else {
      newPinned.add(campaignId);
    }
    setPinnedCampaigns(newPinned);
  };

  const handleFocus = (campaignId: string) => {
    setFocusedCampaign(focusedCampaign === campaignId ? null : campaignId);
  };

  // Calcular totais gerais
  const totals = useMemo(() => {
    return sortedCampaigns.reduce((acc, campaign) => ({
      custo: acc.custo + (campaign.custo || 0),
      impressoes: acc.impressoes + (campaign.impressoes || 0),
      cliques: acc.cliques + (campaign.cliques || 0),
      conversoes: acc.conversoes + (campaign.conversoes || 0),
      valorConversoes: acc.valorConversoes + (campaign.faturamento || 0),
      ctr: sortedCampaigns.length > 0 ? 
        sortedCampaigns.reduce((sum, c) => sum + ((c.cliques || 0) / (c.impressoes || 1) * 100), 0) / sortedCampaigns.length : 0,
      cpc: sortedCampaigns.length > 0 ?
        sortedCampaigns.reduce((sum, c) => sum + ((c.custo || 0) / (c.cliques || 1)), 0) / sortedCampaigns.length : 0,
      roas: sortedCampaigns.length > 0 ?
        sortedCampaigns.reduce((sum, c) => sum + ((c.faturamento || 0) / (c.custo || 1)), 0) / sortedCampaigns.length : 0
    }), {
      custo: 0,
      impressoes: 0,
      cliques: 0,
      conversoes: 0,
      valorConversoes: 0,
      ctr: 0,
      cpc: 0,
      roas: 0
    });
  }, [sortedCampaigns]);

  return (
    <div className="w-full space-y-4 mx-2 sm:mx-4">
      {/* Filtros e controles */}
      <CampaignFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        focusedCampaign={focusedCampaign}
        onClearFocus={() => setFocusedCampaign(null)}
        onNewCampaign={onNewCampaign}
      />

      {/* Lista de campanhas premium */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">{t('campaignTable.activeCampaigns')}</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {sortedCampaigns.length} {sortedCampaigns.length === 1 ? t('campaignTable.campaign') : t('campaignTable.campaigns')}
          </span>
        </div>

        {sortedCampaigns.map((campaign) => (
          <CampaignRow
            key={campaign.id}
            campaign={campaign}
            isPinned={pinnedCampaigns.has(campaign.id)}
            isFocused={focusedCampaign === campaign.id}
            isHighlighted={focusedCampaign !== null && focusedCampaign !== campaign.id}
            onPin={handlePin}
            onFocus={handleFocus}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Resumo geral premium */}
      <CampaignSummary totals={totals} />
    </div>
  );
}
