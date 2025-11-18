import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Filter, Activity, TrendingUp, DollarSign, Target, MousePointer, Eye, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { HistoryDateFilter } from "@/components/HistoryDateFilter";
import { CompactDateRangeFilter } from "@/components/CompactDateRangeFilter";
import { CampaignSelector } from "@/components/CampaignSelector";
import { WelcomeMessage } from "@/components/WelcomeMessage";
import { useCampaigns } from "@/contexts/CampaignContext";
import { useDashboardCalculations } from "@/hooks/useDashboardCalculations";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { useDashboardCurrency } from "@/contexts/DashboardCurrencyContext";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import CampaignTable from "@/components/CampaignTable";
import DashboardDraggableComponents from "@/components/DashboardDraggableComponents";
import { PDFExportButton } from "@/components/PDFExportButton";
import ForecastingSection from "@/components/forecasting/ForecastingSection";
import { MobileKPICard } from "@/components/MobileKPICard";
import { PremiumKPICards } from "@/components/PremiumKPICards";
import { ClickDefenderLogo } from "@/assets/ClickDefenderLogo";



import PremiumRevenueChart from "@/components/charts/PremiumRevenueChart";
import PremiumSalesList from "@/components/PremiumSalesList";
const DashboardContent = () => {
  const {
    t
  } = useTranslation();
  const {
    campaigns
  } = useCampaigns();
  const {
    dateRange
  } = useDateRangeFilter();
  const {
    dashboardCurrency,
    exchangeRate
  } = useDashboardCurrency();
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const isMobile = useIsMobile();

  // Calcular métricas em tempo real com conversão de moeda
  const dashboardMetrics = useDashboardCalculations({
    campaigns,
    dateRange,
    selectedCampaign,
    dashboardCurrency,
    exchangeRate
  });
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };
  const formatMultiplier = (value: number) => {
    return `${value.toFixed(2)}x`;
  };
  return <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      <div className={`${isMobile ? 'p-2 mx-1' : 'p-3 mx-4'}`}>
        {/* Welcome Message - Compacto */}
        <div className={`${isMobile ? 'mb-3' : 'mb-4'} mt-2`}>
          <WelcomeMessage />
        </div>

        {/* Compact Filter Section */}
        <div className="flex justify-between items-center mb-3">
          <CampaignSelector value={selectedCampaign} onValueChange={setSelectedCampaign} />
          <CompactDateRangeFilter />
        </div>

        {/* Premium KPI Cards - Espaçamento reduzido */}
        <div className={`${isMobile ? 'mb-3' : 'mb-4'}`}>
          <PremiumKPICards 
            totalVendas={selectedCampaign === 'all' ? 12475 : Math.floor(12475 * 0.3)} 
            totalPedidos={selectedCampaign === 'all' ? 89 : Math.floor(89 * 0.3)} 
            valorMedioPedido={140.17} 
            totalUpsell={selectedCampaign === 'all' ? 1547 : Math.floor(1547 * 0.3)} 
            totalReembolso={selectedCampaign === 'all' ? 125 : Math.floor(125 * 0.3)} 
            selectedCampaign={selectedCampaign} 
          />
        </div>

        {/* Premium Revenue Chart - Mais compacto */}
        <div className={`${isMobile ? 'mb-3' : 'mb-4'}`}>
          <PremiumRevenueChart 
            campaigns={selectedCampaign === 'all' ? campaigns : campaigns.filter(c => c.id === selectedCampaign)} 
            dateRange={dateRange} 
          />
        </div>

        {/* Premium Sales List - Mais compacto */}
        <div className={`${isMobile ? 'mb-3' : 'mb-4'}`}>
          <PremiumSalesList 
            dateRange={dateRange} 
            selectedCampaign={selectedCampaign}
            campaigns={campaigns}
          />
        </div>

        {/* Sistema de Forecasting - Mais compacto */}
        <div className={`${isMobile ? 'mb-3' : 'mb-4'}`}>
          <ForecastingSection 
            campaigns={selectedCampaign === 'all' ? campaigns : campaigns.filter(c => c.id === selectedCampaign)} 
          />
        </div>

        {/* Dashboard Draggable Components */}
        <DashboardDraggableComponents 
          campaigns={selectedCampaign === 'all' ? campaigns : campaigns.filter(c => c.id === selectedCampaign)} 
          selectedCampaign={selectedCampaign} 
          onCampaignChange={setSelectedCampaign} 
          dashboardCurrency={dashboardCurrency} 
          exchangeRate={exchangeRate} 
        />
      </div>
    </div>;
};
const Dashboard = () => {
  return <DashboardContent />;
};
export default Dashboard;