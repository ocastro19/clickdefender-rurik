import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileKPICardProps {
  title: string;
  value: string;
  color?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const MobileKPICard: React.FC<MobileKPICardProps> = ({ 
  title, 
  value, 
  color = "text-foreground",
  icon: Icon 
}) => {
  const isMobile = useIsMobile();

  return (
    <Card>
      <CardContent className={`${isMobile ? 'p-3' : 'p-6'}`}>
        <div className={`${isMobile ? 'flex flex-col gap-2' : 'flex items-center justify-between'}`}>
          <div className={`${isMobile ? 'w-full' : ''}`}>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-muted-foreground ${isMobile ? 'mb-2' : 'mb-1'}`}>
              {title}
            </p>
            <p className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold ${color}`}>
              {value}
            </p>
          </div>
          {!isMobile && Icon && <Icon className="w-8 h-8 text-muted-foreground" />}
        </div>
      </CardContent>
    </Card>
  );
};