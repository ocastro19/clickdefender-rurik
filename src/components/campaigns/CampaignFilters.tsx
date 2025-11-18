import React from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

interface CampaignFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  focusedCampaign: string | null;
  onClearFocus: () => void;
  onNewCampaign?: () => void;
}

export default function CampaignFilters({
  searchTerm,
  onSearchChange,
  focusedCampaign,
  onClearFocus,
  onNewCampaign
}: CampaignFiltersProps) {
  const { t } = useTranslation();
  return (
    <div className="bg-gradient-to-r from-card to-muted/30 border border-border rounded-xl p-6 shadow-card">
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        {/* Filtros de objetivo e status */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filtrar por objetivo:</span>
            <Badge variant="default" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-4 py-2 shadow-premium">
              <Search className="w-3 h-3 mr-2" />
              PESQUISA
            </Badge>
          </div>
          
          {focusedCampaign && (
            <Button 
              variant="outline" 
              size="sm" 
              className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-200"
              onClick={onClearFocus}
            >
              ✕ Limpar foco em 1 campanha
            </Button>
          )}
        </div>

        {/* Controles principais */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full lg:w-auto">
          {/* Barra de pesquisa */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar campanhas..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-background/80 border-border/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            />
          </div>
          
          {/* Seletor de período */}
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-background/80 border-border/60 hover:bg-background hover:border-border transition-all duration-200"
            >
              <Calendar className="w-4 h-4 mr-2" />
              09/07/2025 - 22/07/2025
            </Button>
            
            {onNewCampaign && (
              <Button 
                onClick={onNewCampaign}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-premium transition-all duration-200"
              >
                + {t('campaigns.newCampaign')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}