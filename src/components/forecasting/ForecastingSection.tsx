import React from 'react';
import { Campaign } from '@/contexts/CampaignContext';
import { useForecasting } from '@/hooks/useForecasting';
import ForecastCard from './ForecastCard';
interface ForecastingSectionProps {
  campaigns: Campaign[];
}
const ForecastingSection: React.FC<ForecastingSectionProps> = ({
  campaigns
}) => {
  const forecast = useForecasting(campaigns);
  if (!campaigns.length) {
    return null;
  }
  return;
};
export default ForecastingSection;