import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Settings, LogOut, User, Sun, Moon, ChevronDown, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { UserProfileModal } from "@/components/UserProfileModal";
import { SettingsModal } from "@/components/SettingsModal";
import { ClickDefenderLogo } from "@/assets/ClickDefenderLogo";

import { MainNavigation } from "@/components/MainNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
export function TopBar() {
  const {
    t
  } = useTranslation();
  const {
    theme,
    cycleTheme
  } = useTheme();
  const {
    userData
  } = useUser();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const isMobile = useIsMobile();
  const getInitials = () => {
    return `${userData.nome.charAt(0)}${userData.sobrenome.charAt(0)}`.toUpperCase();
  };
  return <>
      <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-gradient-to-r from-background/95 via-background/90 to-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            {/* Logo Premium */}
            <Link to="/" className="flex items-center hover:scale-105 transition-all duration-300 group">
              <ClickDefenderLogo 
                size={isMobile ? 72 : 96} 
                showText={!isMobile} 
                centered={true}
                scale={1.25}
              />
            </Link>

            {/* Navigation Menu Premium - Hidden on mobile */}
            <div className="hidden lg:flex flex-1 justify-center">
              <MainNavigation />
            </div>

            {/* Right side actions Premium */}
            <div className="flex items-center gap-2 sm:gap-3">

              {/* Theme Toggle Premium */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={cycleTheme} 
                className={`relative group ${isMobile ? 'h-10 w-10' : 'h-11 w-11'} rounded-xl bg-gradient-to-br from-background/80 to-muted/30 border border-primary/20 hover:border-primary/40 transition-all duration-300`} 
                title={t('navbar.toggleTheme', {
                  mode: theme === 'dark' ? t('navbar.light') : t('navbar.dark')
                })}
              >
                <div className={`relative ${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-full overflow-hidden transition-transform duration-500 ${theme === 'light' ? 'rotate-180' : 'rotate-0'}`}>
                  {theme === 'light' ? (
                    <Sun className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-amber-500 absolute inset-0 m-auto transition-all duration-300 group-hover:text-amber-400`} />
                  ) : theme === 'dark-blue' ? (
                    <Moon className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-blue-600 absolute inset-0 m-auto transition-all duration-300 group-hover:text-blue-500`} />
                  ) : (
                    <Moon className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-blue-400 absolute inset-0 m-auto transition-all duration-300 group-hover:text-blue-300`} />
                  )}
                </div>
                <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                  theme === 'light' 
                    ? 'bg-gradient-to-br from-amber-400/20 to-orange-500/20 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                    : theme === 'dark-blue'
                      ? 'bg-gradient-to-br from-blue-600/20 to-cyan-500/20 shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                      : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                } opacity-0 group-hover:opacity-100`} />
              </Button>

              {/* User Menu Premium */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={`flex items-center gap-2 sm:gap-3 ${isMobile ? 'h-10 px-2' : 'h-12 px-4'} rounded-xl bg-gradient-to-br from-background/80 to-muted/30 border border-primary/20 hover:border-primary/40 transition-all duration-300 group`}>
                    <Avatar className={`${isMobile ? 'h-7 w-7' : 'h-9 w-9'} ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300`}>
                      {userData.profileImage ? 
                        <AvatarImage src={userData.profileImage} alt="Profile" className="object-cover" /> : 
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-sm font-bold">
                          {getInitials()}
                        </AvatarFallback>
                      }
                    </Avatar>
                    {!isMobile && (
                      <div className="hidden md:flex flex-col items-start">
                        <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                          {userData.nome}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">
                          @{userData.username}
                        </span>
                      </div>
                    )}
                    <ChevronDown className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:rotate-180`} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-background/95 backdrop-blur-sm border border-primary/20 shadow-premium" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal p-4 bg-gradient-to-r from-primary/5 to-primary/10">
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm font-semibold leading-none text-foreground">
                        {userData.nome} {userData.sobrenome}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground font-medium">
                        {userData.email}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <div className="w-2 h-2 rounded-full bg-green-600" />
                        <span className="text-xs text-muted-foreground">Online agora</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-primary/20" />
                  <DropdownMenuItem className="cursor-pointer hover:bg-primary/10 transition-colors duration-200 p-3" onClick={() => setProfileModalOpen(true)}>
                    <User className="mr-3 h-4 w-4 text-primary" />
                    <span className="font-medium">Meu Cadastro</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-primary/10 transition-colors duration-200 p-3" onClick={() => setSettingsModalOpen(true)}>
                    <Settings className="mr-3 h-4 w-4 text-primary" />
                    <span className="font-medium">{t('common.settings')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-primary/20" />
                  <DropdownMenuItem className="cursor-pointer hover:bg-destructive/10 transition-colors duration-200 p-3" asChild>
                    <Link to="/">
                      <LogOut className="mr-3 h-4 w-4 text-destructive" />
                      <span className="font-medium text-destructive">{t('common.logout')}</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobile && (
            <div className="lg:hidden border-t border-primary/20 bg-gradient-to-r from-background/95 to-background/90 backdrop-blur-sm">
              <div className="px-2 py-3">
                <MainNavigation />
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Modals */}
      <UserProfileModal open={profileModalOpen} onOpenChange={setProfileModalOpen} />
      <SettingsModal open={settingsModalOpen} onOpenChange={setSettingsModalOpen} />
    </>;
}