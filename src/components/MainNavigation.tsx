import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart3, Target, Link, Grid3x3, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { usePreloadImages } from "@/hooks/usePreloadImages";
import { useUser } from '@/contexts/UserContext';
import clickSyncLogo from '@/assets/click-sync-logo.png';
import clickShieldLogo from '@/assets/click-shield-logo.webp';

export const MainNavigation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { userData } = useUser();
  const [allInOneOpen, setAllInOneOpen] = useState(false);
  const imagesLoaded = usePreloadImages([clickSyncLogo, clickShieldLogo]);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboards',
      icon: BarChart3,
      path: '/'
    },
    {
      id: 'campaigns',
      label: 'Campanhas',
      icon: Target,
      path: '/campanhas'
    },
    {
      id: 'platforms',
      label: 'Link plataformas',
      icon: Link,
      path: '/plataformas'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleComingSoon = (systemName: string) => {
    toast({
      title: "Em Breve",
      description: `${systemName} estará disponível em breve!`,
    });
    setAllInOneOpen(false);
  };

  const isMobile = useIsMobile();

  return (
    <nav className={`flex items-center ${isMobile ? 'grid grid-cols-4 gap-2 w-full' : 'space-x-2'}`}>
      {menuItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        
        return (
          <Button
            key={item.id}
            variant="ghost"
            size={isMobile ? "sm" : "sm"}
            onClick={() => navigate(item.path)}
            className={`
              flex items-center gap-2 ${isMobile ? 'flex-col px-2 py-3 h-auto' : 'px-6 py-3 h-11'} rounded-xl transition-all duration-300 group relative
              ${active 
                ? 'bg-gradient-to-r from-primary/20 via-primary/15 to-primary/10 text-primary border border-primary/30 shadow-lg shadow-primary/10' 
                : 'text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/30 border border-transparent hover:border-muted/40'
              }
            `}
          >
            <Icon className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} transition-all duration-300 ${active ? 'text-primary' : 'group-hover:text-foreground'}`} />
            <span className={`font-semibold ${isMobile ? 'text-xs text-center' : 'text-sm'} transition-all duration-300 ${active ? 'text-primary' : 'group-hover:text-foreground'}`}>
              {isMobile ? item.label.split(' ')[0] : item.label}
            </span>
            {active && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl blur-sm -z-10" />
            )}
          </Button>
        );
      })}

      {/* Links de Admin - somente para usuários admin */}
      {userData.role === 'admin' && (
        <>
          <Button
            variant="ghost"
            size={isMobile ? "sm" : "sm"}
            onClick={() => navigate('/admin/platforms')}
            className={`
              flex items-center gap-2 ${isMobile ? 'flex-col px-2 py-3 h-auto' : 'px-6 py-3 h-11'} rounded-xl transition-all duration-300 group relative
              ${isActive('/admin/platforms') 
                ? 'bg-gradient-to-r from-red-500/20 via-red-500/15 to-red-500/10 text-red-600 border border-red-500/30 shadow-lg shadow-red-500/10' 
                : 'text-muted-foreground hover:text-red-600 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-500/5 border border-transparent hover:border-red-500/20'
              }
            `}
          >
            <Shield className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} transition-all duration-300 ${isActive('/admin/platforms') ? 'text-red-600' : 'group-hover:text-red-600'}`} />
            <span className={`font-semibold ${isMobile ? 'text-xs text-center' : 'text-sm'} transition-all duration-300 ${isActive('/admin/platforms') ? 'text-red-600' : 'group-hover:text-red-600'}`}>
              {isMobile ? 'Plataformas' : 'Admin Plataformas'}
            </span>
            {isActive('/admin/platforms') && (
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-red-500/10 to-red-500/5 rounded-xl blur-sm -z-10" />
            )}
          </Button>

          <Button
            variant="ghost"
            size={isMobile ? "sm" : "sm"}
            onClick={() => navigate('/admin/postbacks')}
            className={`
              flex items-center gap-2 ${isMobile ? 'flex-col px-2 py-3 h-auto' : 'px-6 py-3 h-11'} rounded-xl transition-all duration-300 group relative
              ${isActive('/admin/postbacks') 
                ? 'bg-gradient-to-r from-purple-500/20 via-purple-500/15 to-purple-500/10 text-purple-600 border border-purple-500/30 shadow-lg shadow-purple-500/10' 
                : 'text-muted-foreground hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-purple-500/5 border border-transparent hover:border-purple-500/20'
              }
            `}
          >
            <Shield className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} transition-all duration-300 ${isActive('/admin/postbacks') ? 'text-purple-600' : 'group-hover:text-purple-600'}`} />
            <span className={`font-semibold ${isMobile ? 'text-xs text-center' : 'text-sm'} transition-all duration-300 ${isActive('/admin/postbacks') ? 'text-purple-600' : 'group-hover:text-purple-600'}`}>
              {isMobile ? 'Postbacks' : 'Admin Postbacks'}
            </span>
            {isActive('/admin/postbacks') && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-purple-500/10 to-purple-500/5 rounded-xl blur-sm -z-10" />
            )}
          </Button>

          <Button
            variant="ghost"
            size={isMobile ? "sm" : "sm"}
            onClick={() => navigate('/admin/checkout-postbacks')}
            className={`
              flex items-center gap-2 ${isMobile ? 'flex-col px-2 py-3 h-auto' : 'px-6 py-3 h-11'} rounded-xl transition-all duration-300 group relative
              ${isActive('/admin/checkout-postbacks') 
                ? 'bg-gradient-to-r from-indigo-500/20 via-indigo-500/15 to-indigo-500/10 text-indigo-600 border border-indigo-500/30 shadow-lg shadow-indigo-500/10' 
                : 'text-muted-foreground hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-indigo-500/5 border border-transparent hover:border-indigo-500/20'
              }
            `}
          >
            <Shield className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} transition-all duration-300 ${isActive('/admin/checkout-postbacks') ? 'text-indigo-600' : 'group-hover:text-indigo-600'}`} />
            <span className={`font-semibold ${isMobile ? 'text-xs text-center' : 'text-sm'} transition-all duration-300 ${isActive('/admin/checkout-postbacks') ? 'text-indigo-600' : 'group-hover:text-indigo-600'}`}>
              {isMobile ? 'Checkout' : 'Admin Checkout'}
            </span>
            {isActive('/admin/checkout-postbacks') && (
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-indigo-500/10 to-indigo-500/5 rounded-xl blur-sm -z-10" />
            )}
          </Button>
        </>
      )}

      {/* Botão All-in-one */}
      <Sheet open={allInOneOpen} onOpenChange={setAllInOneOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size={isMobile ? "sm" : "sm"}
            className={`
              flex items-center gap-2 ${isMobile ? 'flex-col px-2 py-3 h-auto' : 'px-6 py-3 h-11'} rounded-xl transition-all duration-300 group relative
              text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/30 border border-transparent hover:border-muted/40
            `}
          >
            <Grid3x3 className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} transition-all duration-300 group-hover:text-foreground`} />
            <span className={`font-semibold ${isMobile ? 'text-xs text-center' : 'text-sm'} transition-all duration-300 group-hover:text-foreground`}>
              {isMobile ? 'All-in-one' : 'All-in-one'}
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[90vw] sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-2xl">All-in-one</SheetTitle>
            <SheetDescription>
              Acesse os sistemas integrados do ecossistema
            </SheetDescription>
          </SheetHeader>
          
          <div className="grid gap-4 py-6">
            {/* Click Sync */}
            <Card 
              className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-2 hover:border-primary/50"
              onClick={() => handleComingSoon('Click Sync')}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {imagesLoaded ? (
                    <img src={clickSyncLogo} alt="Click Sync" className="w-16 h-16 object-contain" />
                  ) : (
                    <Skeleton className="w-16 h-16 rounded" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">Click Sync</h3>
                    <p className="text-sm text-muted-foreground">
                      Análise de campanhas Google Ads com integração de métricas avançadas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Click Shield */}
            <Card 
              className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-2 hover:border-primary/50"
              onClick={() => handleComingSoon('Click Shield')}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {imagesLoaded ? (
                    <img src={clickShieldLogo} alt="Click Shield" className="w-16 h-16 object-contain" />
                  ) : (
                    <Skeleton className="w-16 h-16 rounded" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">Click Shield</h3>
                    <p className="text-sm text-muted-foreground">
                      Cloaker de proteção que bloqueia espiões e impede clonagem de ofertas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};