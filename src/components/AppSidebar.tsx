import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { 
  Settings,
  LogOut,
  User,
  Sun,
  Moon,
  HeadphonesIcon,
  Shield,
  BarChart3,
  Target,
  Link as LinkIcon,
  FileText,
  Link2,
  ShieldCheck
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { UserProfileModal } from "@/components/UserProfileModal";
import { SettingsModal } from "@/components/SettingsModal";
import { ClickDefenderLogo } from "@/assets/ClickDefenderLogo";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useAuth } from '@/hooks/useAuth';
import { ComingSoonModal } from '@/components/ComingSoonModal';

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

export function AppSidebar() {
  const { t } = useTranslation();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { theme, cycleTheme } = useTheme();
  const { userData } = useUser();
  const { signOut } = useAuth();
  const isMobile = useIsMobile();
  
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [comingSoonTitle, setComingSoonTitle] = useState('');

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };
  
  const navigationItems = buildNavigationItems(userData.role);
  const currentPath = location.pathname;
  const isActive = (path: string) => path === '/' ? currentPath === '/' : currentPath.startsWith(path);

  const getNavClassName = (path: string) => {
    if (isActive(path)) {
      return "bg-primary text-primary-foreground font-medium";
    }
    return "hover:bg-accent hover:text-accent-foreground";
  };

  const handleDisabledClick = (title: string) => {
    setComingSoonTitle(title);
    setComingSoonOpen(true);
  };

  const getInitials = () => {
    return `${userData.nome.charAt(0)}${userData.sobrenome.charAt(0)}`.toUpperCase();
  };

  return (
    <>
      <Sidebar className={collapsed ? (isMobile ? "" : "") : (isMobile ? "" : "")}>
      <SidebarContent className="bg-background border-r">
        {/* Header */}
        <div className={`${isMobile ? 'p-2' : 'p-2 sm:p-4'} border-b`}>
          <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-2 sm:gap-3'}`}>
            <ClickDefenderLogo 
              size={collapsed ? (isMobile ? 35 : 45) : (isMobile ? 50 : 64)} 
              showText={!collapsed} 
              centered={true}
              scale={1.25}
            />
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className={`${isMobile ? 'text-xs' : 'text-xs sm:text-sm'}`}>{t('common.navigation', { defaultValue: 'Navegação' })}</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.disabled ? (
                      <button
                        onClick={() => handleDisabledClick(item.title)}
                        className={`flex w-full items-center ${isMobile ? 'gap-2 px-2 py-3' : 'gap-2 sm:gap-3 px-2 sm:px-3 py-2'} rounded-md transition-colors ${isMobile ? 'text-sm' : 'text-sm'} hover:bg-accent hover:text-accent-foreground cursor-pointer`}
                        title={collapsed ? item.title : undefined}
                      >
                        <item.icon className={`${collapsed ? (isMobile ? 'h-4 w-4' : 'h-4 w-4 sm:h-5 sm:w-5') : (isMobile ? 'h-4 w-4' : 'h-4 w-4 sm:h-5 sm:w-5')}`} />
                        {!collapsed && <span className={`truncate ${isMobile ? 'text-sm' : ''}`}>{item.title}</span>}
                      </button>
                    ) : (
                      <Link 
                        to={item.url} 
                        className={`flex items-center ${isMobile ? 'gap-2 px-2 py-3' : 'gap-2 sm:gap-3 px-2 sm:px-3 py-2'} rounded-md transition-colors ${isMobile ? 'text-sm' : 'text-sm'} ${getNavClassName(item.url)}`}
                        title={collapsed ? item.title : undefined}
                      >
                        <item.icon className={`${collapsed ? (isMobile ? 'h-4 w-4' : 'h-4 w-4 sm:h-5 sm:w-5') : (isMobile ? 'h-4 w-4' : 'h-4 w-4 sm:h-5 sm:w-5')}`} />
                        {!collapsed && <span className={`truncate ${isMobile ? 'text-sm' : ''}`}>{item.title}</span>}
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom Actions */}
        <div className={`mt-auto ${isMobile ? 'p-1' : 'p-2'} space-y-${isMobile ? '1' : '2'} border-t`}>
          {/* Support Button */}
          <Button 
            variant="ghost" 
            size={collapsed ? "icon" : (isMobile ? "sm" : "sm")}
            className={collapsed ? "w-full" : "w-full justify-start gap-2"}
            title={collapsed ? t('common.support') : undefined}
            onClick={() => {
              // TODO: Implementar redirecionamento para suporte
              console.log('Redirecionamento para suporte');
            }}
          >
            <HeadphonesIcon className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            {!collapsed && <span className={`${isMobile ? 'text-xs' : ''}`}>{t('common.support')}</span>}
          </Button>

          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size={collapsed ? "icon" : (isMobile ? "sm" : "sm")}
            onClick={cycleTheme}
            className={collapsed ? "w-full" : "w-full justify-start gap-2"}
            title={collapsed ? t('navbar.toggleTheme', { mode: theme === 'dark' ? t('common.light') : t('common.dark') }) : undefined}
          >
            {theme === 'dark' ? (
              <Moon className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            ) : theme === 'dark-blue' ? (
              <Moon className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-blue-400`} />
            ) : (
              <Sun className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            )}
            {!collapsed && <span className={`${isMobile ? 'text-xs' : ''}`}>
              {theme === 'dark' ? t('sidebar.darkMode') : theme === 'dark-blue' ? 'Dark Blue' : t('sidebar.lightMode')}
            </span>}
          </Button>

          {/* Language Selector */}
          {!collapsed && (
            <div className="w-full">
              <LanguageSelector />
            </div>
          )}

          {/* User Menu */}
          {collapsed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-full">
                  <Avatar className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`}>
                    <AvatarFallback className={`bg-primary text-primary-foreground ${isMobile ? 'text-xs' : 'text-xs'}`}>
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" side="right">
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
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`w-full justify-start gap-2 ${isMobile ? 'p-1' : 'p-2'}`}>
                  <Avatar className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`}>
                    <AvatarFallback className={`bg-primary text-primary-foreground ${isMobile ? 'text-xs' : 'text-xs'}`}>
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium truncate`}>{userData.username}</span>
                    <span className={`${isMobile ? 'text-xs' : 'text-xs'} text-muted-foreground truncate`}>{userData.email}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" side="right">
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
          )}
        </div>
      </SidebarContent>
    </Sidebar>
    
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
