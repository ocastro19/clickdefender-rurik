import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Menu,
  X,
  BarChart3,
  Target,
  Link as LinkIcon,
  FileText,
  Link2,
  ShieldCheck,
  Shield,
  Settings,
  LogOut,
  User,
  Sun,
  Moon,
  
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { UserProfileModal } from "@/components/UserProfileModal";
import { SettingsModal } from "@/components/SettingsModal";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useAuth } from '@/hooks/useAuth';
import { ComingSoonModal } from '@/components/ComingSoonModal';
import { ClickDefenderLogo } from '@/assets/ClickDefenderLogo';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const buildNavigationItems = (role: string) => {
  const items = [
    { title: "Dashboards", url: "/", icon: BarChart3 },
    { title: "Campanhas", url: "/campanhas", icon: Target },
    { title: "Link plataformas", url: "/plataformas", icon: LinkIcon },
    { title: "Click Pages", url: "#", icon: FileText, disabled: true },
    { title: "Click Sync", url: "#", icon: Link2, disabled: true },
    { title: "Click Shield", url: "#", icon: ShieldCheck, disabled: true },
  ];
  if (role === 'admin') {
    items.push({ title: "Administração", url: "/admin", icon: Shield });
  }
  return items;
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export function TopbarNavigation() {
  const { t } = useTranslation();
  const location = useLocation();
  const { theme, cycleTheme } = useTheme();
  const { userData } = useUser();
  const { signOut } = useAuth();
  const isMobile = useIsMobile();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [comingSoonTitle, setComingSoonTitle] = useState('');
  
  const menuRef = useRef<HTMLDivElement>(null);
  
  const navigationItems = buildNavigationItems(userData.role);
  const currentPath = location.pathname;
  const isActive = (path: string) => path === '/' ? currentPath === '/' : currentPath.startsWith(path);
  
  // Fechar menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isMenuOpen]);
  
  // Fechar menu ao mudar de rota
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  // Acessibilidade via teclado
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    }
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);
  
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };
  
  const handleDisabledClick = (title: string) => {
    setComingSoonTitle(title);
    setComingSoonOpen(true);
  };
  
  const getInitials = () => {
    return `${userData.nome.charAt(0)}${userData.sobrenome.charAt(0)}`.toUpperCase();
  };
  
  const getNavClassName = (path: string) => {
    if (isActive(path)) {
      return "bg-primary text-primary-foreground font-medium";
    }
    return "hover:bg-accent hover:text-accent-foreground";
  };
  
  return (
    <>
      {/* Overlay escuro quando menu está aberto */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      
      {/* Topbar Navigation - Layout com Logo Centralizada */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center h-16 sm:h-18 md:h-20 px-4 lg:px-6">
          {/* Left side - Menu Hambúrguer */}
          <div className="flex items-center flex-shrink-0">
            <div className="relative z-50">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative h-10 w-10 hover:bg-accent/80 transition-all duration-200 group flex-shrink-0"
                aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={isMenuOpen}
                aria-controls="navigation-menu"
              >
                <div className="flex flex-col justify-center items-center gap-1">
                  <span 
                    className={`block h-0.5 w-5 bg-current transition-all duration-300 ease-in-out ${
                      isMenuOpen ? 'rotate-45 translate-y-[3px]' : ''
                    }`}
                  />
                  <span 
                    className={`block h-0.5 w-5 bg-current transition-all duration-300 ease-in-out ${
                      isMenuOpen ? 'opacity-0' : ''
                    }`}
                  />
                  <span 
                    className={`block h-0.5 w-5 bg-current transition-all duration-300 ease-in-out ${
                      isMenuOpen ? '-rotate-45 -translate-y-[3px]' : ''
                    }`}
                  />
                </div>
              </Button>
            </div>
          </div>
          
          {/* Center - Logo Centralizada */}
          <div className="flex-1 flex items-center justify-center">
            <Link to="/" className="logo-container flex-shrink-0">
              <ClickDefenderLogo 
                size={isMobile ? 40 : 64} // Aumentado em 25% (32→40, 48→64)
                showText={!isMobile} 
                centered={true}
                scale={1.25} // 25% maior que o tamanho base
                className="logo-responsive transition-all duration-200 hover:scale-105"
              />
            </Link>
          </div>
          
          {/* Right side - User Menu and Theme Toggle */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={cycleTheme}
              aria-label="Alternar tema"
            >
              {theme === 'dark' ? (
                <Moon className="h-4 w-4" />
              ) : theme === 'dark-blue' ? (
                <Moon className="h-4 w-4 text-blue-400" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
            
            
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" side="bottom">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userData.nome} {userData.sobrenome}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      @{userData.username}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => setProfileModalOpen(true)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{t('common.profile')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setSettingsModalOpen(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t('common.settings')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('common.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Dropdown Menu - Posicionamento ajustado para evitar sobreposição */}
        <div 
          ref={menuRef}
          id="navigation-menu"
          className={`absolute top-full left-0 mt-1 ml-2 sm:left-2 sm:ml-0 sm:w-80 md:w-96 bg-popover border border-border rounded-lg shadow-xl transition-all duration-300 ease-in-out origin-top-left z-40 ${
            isMenuOpen 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="max-h-[calc(100vh-10rem)] overflow-y-auto">
            <div className="p-4 space-y-1">
              {/* Header do Menu - Mais Compacto */}
              <div className="mb-3 pb-2 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Menu Principal</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Navegue pelas funcionalidades</p>
              </div>
              
              {navigationItems.map((item) => (
                <div key={item.title}>
                  {item.disabled ? (
                    <button
                      onClick={() => handleDisabledClick(item.title)}
                      className={cn(
                        "menu-item flex w-full items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 text-sm group",
                        "hover:bg-accent/60 hover:text-accent-foreground",
                        "focus:outline-none focus:ring-1 focus:ring-primary/50"
                      )}
                    >
                      <div className="w-6 h-6 rounded bg-muted/60 flex items-center justify-center flex-shrink-0">
                        <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <span className="font-medium flex-grow text-left">{item.title}</span>
                      <span className="px-1.5 py-0.5 text-xs bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 rounded border border-yellow-400/30 flex-shrink-0">
                        Breve
                      </span>
                    </button>
                  ) : (
                    <Link
                      to={item.url}
                      className={cn(
                        "menu-item flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 text-sm group",
                        "hover:bg-accent/60 hover:text-accent-foreground",
                        "focus:outline-none focus:ring-1 focus:ring-primary/50",
                        isActive(item.url) 
                          ? "bg-primary/15 text-primary font-medium" 
                          : "text-foreground/85 hover:text-foreground"
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className={cn(
                        "w-6 h-6 rounded flex items-center justify-center flex-shrink-0 transition-colors",
                        isActive(item.url)
                          ? "bg-primary/20 text-primary"
                          : "bg-muted/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                      )}>
                        <item.icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-medium flex-grow text-left">{item.title}</span>
                      {isActive(item.url) && (
                        <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      )}
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Language Selector in Menu - Compacto */}
              <div className="pt-3 mt-3 border-t border-border">
                <div className="px-3 py-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm font-medium">Idioma</span>
                  </div>
                  <LanguageSelector />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Spacer to prevent content from going under the fixed topbar */}
      <div className="h-16 sm:h-18 md:h-20" />
      
      {/* Modals */}
      <UserProfileModal 
        open={profileModalOpen} 
        onOpenChange={setProfileModalOpen} 
      />
      <SettingsModal 
        open={settingsModalOpen} 
        onOpenChange={setSettingsModalOpen} 
      />
      <ComingSoonModal
        open={comingSoonOpen}
        onOpenChange={setComingSoonOpen}
        title={`${comingSoonTitle} - Em Breve`}
        description="Esta funcionalidade está em desenvolvimento e será liberada em breve."
      />
    </>
  );
}