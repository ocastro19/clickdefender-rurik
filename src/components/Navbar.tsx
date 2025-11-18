import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Zap, Menu, X, User, Settings, LogOut, Bell, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";
import { useExchangeRate } from "@/hooks/useExchangeRate";


const Navbar = () => {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const {
    theme,
    cycleTheme
  } = useTheme();
  const {
    exchangeRate,
    loading: exchangeLoading
  } = useExchangeRate();
  const brasiliaTime = new Date().toLocaleTimeString('pt-BR');
  const isActive = (path: string) => location.pathname === path;
  const navigationItems = [{
    name: t('navbar.dashboard'),
    path: "/"
  }, {
    name: t('navbar.connectGoogleAds'),
    path: "/googleads-setup"
  }, {
    name: t('navbar.managementAnalysis'),
    path: "/analytics"
  }, {
    name: t('navbar.financial'),
    path: "/financeiro"
  }];
  return <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Zap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Dashboard</span>
          </Link>

          {/* Desktop Navigation */}
          

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {/* Exchange Rate and Time Indicator */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                <span className="text-muted-foreground">{t('navbar.exchangeRate')}</span>
                <span className="text-foreground font-semibold">
                  {exchangeLoading ? <span className="animate-pulse bg-muted rounded px-2 py-1">...</span> : exchangeRate ? `R$ ${exchangeRate.toFixed(2)}` : t('common.error')}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{t('navbar.brasilia')}</span>
                <span className="text-foreground font-semibold">{brasiliaTime}</span>
              </div>
            </div>


            {/* Theme Toggle Premium */}
            <Button variant="ghost" size="icon" onClick={cycleTheme} className="relative group hover:bg-accent transition-all duration-300" title={t('navbar.toggleTheme', { mode: theme === 'dark' ? t('navbar.light') : t('navbar.dark') })}>
              <div className={`relative w-8 h-8 rounded-full overflow-hidden transition-transform duration-500 ${theme === 'light' ? 'rotate-180' : 'rotate-0'}`}>
                {theme === 'light' ? (
                  <Sun className="h-4 w-4 text-amber-500 absolute inset-0 m-auto transition-opacity duration-300" />
                ) : theme === 'dark-blue' ? (
                  <Moon className="h-4 w-4 text-blue-600 absolute inset-0 m-auto transition-opacity duration-300" />
                ) : (
                  <Moon className="h-4 w-4 text-blue-400 absolute inset-0 m-auto transition-opacity duration-300" />
                )}
              </div>
              <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                theme === 'light' 
                  ? 'bg-gradient-to-br from-amber-400/20 to-orange-500/20 shadow-[0_0_20px_rgba(245,158,11,0.3)]' 
                  : theme === 'dark-blue'
                    ? 'bg-gradient-to-br from-blue-600/20 to-cyan-500/20 shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                    : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
              } opacity-0 group-hover:opacity-100`} />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative" title={t('navbar.notifications')}>
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      U
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{t('userMenu.user')}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {t('navbar.userEmail')}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>{t('userMenu.profile')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t('userMenu.settings')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link to="/">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('userMenu.logout')}</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map(item => <Link key={item.path} to={item.path} className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive(item.path) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`} onClick={() => setIsMobileMenuOpen(false)}>
                  {item.name}
                </Link>)}
              
              <div className="border-t border-border pt-4 mt-4">
                <div className="flex items-center px-3 py-2">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      U
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium text-foreground">{t('userMenu.user')}</div>
                    <div className="text-xs text-muted-foreground">{t('navbar.userEmail')}</div>
                  </div>
                </div>
                
                <Link to="/" className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  <LogOut className="inline mr-2 h-4 w-4" />
                  {t('userMenu.logout')}
                </Link>
              </div>
            </div>
          </div>}
      </div>
    </nav>;
};
export default Navbar;