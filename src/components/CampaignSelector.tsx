import React from 'react';
import { useTranslation } from 'react-i18next';
import { Target, Rocket, BarChart3 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useCampaigns } from '@/contexts/CampaignContext';
interface CampaignSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}
export const CampaignSelector: React.FC<CampaignSelectorProps> = ({
  value,
  onValueChange,
  className
}) => {
  const {
    t
  } = useTranslation();
  const {
    campaigns
  } = useCampaigns();
  return <div className={`space-y-2 ${className}`}>
      
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="bg-gradient-to-r from-background to-muted/20 border-primary/20 hover:border-primary/40 transition-colors shadow-premium">
          <SelectValue placeholder="Todas as campanhas" />
        </SelectTrigger>
        <SelectContent className="bg-background/95 backdrop-blur-sm border border-primary/20">
          <SelectItem value="all" className="hover:bg-primary/10">
            <Rocket className="h-4 w-4 inline mr-1.5" />
            Todas as campanhas
          </SelectItem>
          {campaigns.map(campaign => <SelectItem key={campaign.id} value={campaign.id} className="hover:bg-primary/10">
              <BarChart3 className="h-4 w-4 inline mr-1.5" />
              {campaign.campanha}
            </SelectItem>)}
        </SelectContent>
      </Select>
    </div>;
};