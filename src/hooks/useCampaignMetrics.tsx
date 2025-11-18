import { useState, useEffect } from 'react';

const DEFAULT_METRICS = ['custo', 'faturamento', 'impressoes', 'cliques', 'ctr', 'roas'];

export const useCampaignMetrics = () => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(() => {
    const saved = localStorage.getItem('campaign-selected-metrics');
    return saved ? JSON.parse(saved) : DEFAULT_METRICS;
  });

  useEffect(() => {
    localStorage.setItem('campaign-selected-metrics', JSON.stringify(selectedMetrics));
  }, [selectedMetrics]);

  return {
    selectedMetrics,
    setSelectedMetrics
  };
};