import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cookie, Timer, Code, Link } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';

interface PresellType {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  color: string;
}

interface PresellTypeSelectorProps {
  onSelectType: (type: string) => void;
}

const PresellTypeSelector = ({ onSelectType }: PresellTypeSelectorProps) => {
  const isMobile = useIsMobile();
  const getCardClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          cardBg: 'bg-[hsl(var(--card-orders-bg))] border-[hsl(var(--card-orders-border))] dark:bg-card dark:border-[hsl(var(--card-orders-border))] hover:shadow-[var(--shadow-orders)]',
          gradientOverlay: 'absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-30 dark:via-primary/10 dark:opacity-50',
          iconBg: 'bg-gradient-to-r from-primary to-info-bright shadow-lg',
          iconColor: 'text-white',
          badgeBg: 'bg-[hsl(var(--card-orders-accent))] text-primary border-primary/30 dark:bg-primary/20 dark:text-white dark:border-primary/30',
          bulletColor: 'bg-primary'
        };
      case 'orange':
        return {
          cardBg: 'bg-[hsl(var(--card-upsell-bg))] border-[hsl(var(--card-upsell-border))] dark:bg-card dark:border-[hsl(var(--card-upsell-border))] hover:shadow-[var(--shadow-upsell)]',
          gradientOverlay: 'absolute inset-0 bg-gradient-to-r from-transparent via-warning/5 to-transparent opacity-30 dark:via-warning/10 dark:opacity-50',
          iconBg: 'bg-gradient-to-r from-warning to-warning-bright shadow-lg',
          iconColor: 'text-white',
          badgeBg: 'bg-[hsl(var(--card-upsell-accent))] text-warning border-warning/30 dark:bg-warning/20 dark:text-white dark:border-warning/30',
          bulletColor: 'bg-warning'
        };
      case 'purple':
        return {
          cardBg: 'bg-card/90 border-purple/20 dark:bg-card dark:border-purple/30 hover:shadow-glow',
          gradientOverlay: 'absolute inset-0 bg-gradient-to-r from-transparent via-purple/5 to-transparent opacity-30 dark:via-purple/10 dark:opacity-50',
          iconBg: 'bg-gradient-to-r from-purple to-purple-bright shadow-lg',
          iconColor: 'text-white',
          badgeBg: 'bg-purple/10 text-purple border-purple/30 dark:bg-purple/20 dark:text-white dark:border-purple/30',
          bulletColor: 'bg-purple'
        };
      case 'green':
        return {
          cardBg: 'bg-[hsl(var(--card-sales-bg))] border-[hsl(var(--card-sales-border))] dark:bg-card dark:border-[hsl(var(--card-sales-border))] hover:shadow-[var(--shadow-sales)]',
          gradientOverlay: 'absolute inset-0 bg-gradient-to-r from-transparent via-success/5 to-transparent opacity-30 dark:via-success/10 dark:opacity-50',
          iconBg: 'bg-gradient-to-r from-success to-success-bright shadow-lg',
          iconColor: 'text-white',
          badgeBg: 'bg-[hsl(var(--card-sales-accent))] text-success border-success/30 dark:bg-success/20 dark:text-white dark:border-success/30',
          bulletColor: 'bg-success'
        };
      default:
        return {
          cardBg: 'bg-card/90 border-primary/20 dark:bg-card dark:border-primary/30 hover:shadow-glow',
          gradientOverlay: 'absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-30 dark:via-primary/10 dark:opacity-50',
          iconBg: 'bg-gradient-to-r from-primary to-primary',
          iconColor: 'text-white',
          badgeBg: 'bg-primary/10 text-primary border-primary/30 dark:bg-primary/20 dark:text-white dark:border-primary/30',
          bulletColor: 'bg-primary'
        };
    }
  };

  const presellTypes: PresellType[] = [
    {
      id: 'presell-cookie',
      title: 'Presell Cookie',
      description: 'Simula um cookie de consentimento na tela do cliente com imagem real do site e pote do produto',
      icon: Cookie,
      color: 'blue',
      features: [
        'Design responsivo e profissional',
        'Compliance com LGPD/GDPR',
        'Presell automática'
      ]
    },
    {
      id: 'presell-escassez',
      title: 'Presell Escassez',
      description: 'Mensagem de escassez de últimas unidades',
      icon: Timer,
      color: 'orange',
      features: [
        'Gatilhos psicológicos eficazes',
        'Aumento na taxa de conversão',
        'Multi idiomas',
        'Presell automática'
      ]
    },
    {
      id: 'script-rastreamento',
      title: 'Script de Rastreamento',
      description: 'Rastreamento avançado de conversões',
      icon: Code,
      color: 'purple',
      features: [
        'Tracking pixel personalizado',
        'Eventos de conversão precisos',
        'Integração com múltiplas plataformas',
        'Analytics detalhados'
      ]
    },
    {
      id: 'url-produtor',
      title: 'URL do Produtor',
      description: 'UTM para página de vendas do produto',
      icon: Link,
      color: 'green',
      features: [
        'Tracking de cliques avançado'
      ]
    }
  ];

  return (
    <div className={`${isMobile ? 'px-2 py-4' : 'px-4 py-6'}`}>
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto'}`}>
        {presellTypes.map((type) => {
          const IconComponent = type.icon;
          const cardClasses = getCardClasses(type.color);
          return (
            <Card 
              key={type.id}
              className={`relative overflow-hidden ${cardClasses.cardBg} transition-all duration-300 hover:shadow-xl border-2`}
            >
              {/* Gradient overlay */}
              <div className={cardClasses.gradientOverlay} />
              
              <CardContent className={`${isMobile ? 'p-5' : 'p-6'} relative`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`${isMobile ? 'p-3' : 'p-4'} rounded-2xl ${cardClasses.iconBg} shadow-xl`}>
                    <IconComponent className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'} ${cardClasses.iconColor}`} />
                  </div>
                  <div className={`px-4 py-1.5 rounded-full ${isMobile ? 'text-xs' : 'text-sm'} font-semibold ${cardClasses.badgeBg} shadow-sm`}>
                    {type.title}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <CardTitle className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-foreground mb-2`}>
                      {type.title}
                    </CardTitle>
                    <CardDescription className={`${isMobile ? 'text-sm' : 'text-base'} text-muted-foreground leading-relaxed`}>
                      {type.description}
                    </CardDescription>
                  </div>
                  
                  <ul className="space-y-2.5">
                    {type.features.map((feature, index) => (
                      <li key={index} className={`flex items-center gap-3 ${isMobile ? 'text-sm' : 'text-base'} text-foreground/90`}>
                        <div className={`h-2 w-2 rounded-full ${cardClasses.bulletColor} flex-shrink-0 shadow-sm`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${isMobile ? 'mt-4 h-10' : 'mt-6 h-12'} text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]`}
                    size={isMobile ? "default" : "lg"}
                    onClick={() => onSelectType(type.id)}
                  >
                    Selecionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PresellTypeSelector;