import React from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDailySnapshot } from '@/contexts/DailySnapshotContext';
import { useCampaigns } from '@/contexts/CampaignContext';
export const HistoryDateFilter: React.FC = () => {
  const {
    selectedHistoryDate,
    setSelectedHistoryDate,
    getSnapshotByDate,
    getAllSnapshotDates,
    currentDate,
    isViewingHistory,
    resetToCurrentDay,
    updateHistoricalSnapshot
  } = useDailySnapshot();
  const {
    campaigns,
    setCampaigns
  } = useCampaigns();
  const availableDates = getAllSnapshotDates();
  const handleBackToCurrent = () => {
    resetToCurrentDay();
    // Recarregar campanhas atuais do localStorage
    const saved = localStorage.getItem('campaigns');
    const currentCampaigns = saved ? JSON.parse(saved) : [];
    setCampaigns(currentCampaigns);
  };
  const handleSaveHistoricalChanges = () => {
    if (selectedHistoryDate && campaigns.length >= 0) {
      updateHistoricalSnapshot(selectedHistoryDate, campaigns);
      // Mostrar feedback visual ou toast se necessário
    }
  };
  return null;
};