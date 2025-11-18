import { useState, useEffect } from 'react';

const DEFAULT_METRICS = ['custo', 'faturamento', 'impressoes', 'cliques', 'ctr', 'roas'];

export const useIndividualCampaignMetrics = () => {
  const [campaignMetrics, setCampaignMetrics] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('individual-campaign-metrics');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('individual-campaign-metrics', JSON.stringify(campaignMetrics));
  }, [campaignMetrics]);

  const getMetricsForCampaign = (campaignId: string): string[] => {
    return campaignMetrics[campaignId] || DEFAULT_METRICS;
  };

  const setMetricsForCampaign = (campaignId: string, metrics: string[]) => {
    setCampaignMetrics(prev => ({
      ...prev,
      [campaignId]: metrics
    }));
  };

  return {
    getMetricsForCampaign,
    setMetricsForCampaign
  };
};