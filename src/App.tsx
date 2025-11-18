import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { CampaignProvider } from "@/contexts/CampaignContext";
import { DailySnapshotProvider } from "@/contexts/DailySnapshotContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { UserProvider } from "@/contexts/UserContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ExchangeRateWrapper } from "@/components/ExchangeRateWrapper";
import { useAutoDailyReset } from "@/hooks/useAutoDailyReset";
import { TopbarNavigation } from '@/components/TopbarNavigation';
import { AdminRoute } from '@/components/AdminRoute';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import '@/i18n';
import Dashboard from "./pages/Dashboard";
import Campanhas from "./pages/Campanhas";
import Plataformas from "./pages/Plataformas";
import AdminPlatforms from "./pages/AdminPlatforms";
import AdminPostbacks from "./pages/AdminPostbacks";
import AdminCheckoutPostbacks from "./pages/AdminCheckoutPostbacks";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import RecuperarSenha from "./pages/RecuperarSenha";
import PrimeiroAcesso from "./pages/PrimeiroAcesso";
import Admin from "./pages/Admin";

// Componente wrapper para hooks que precisam estar dentro dos providers
const AppContent = () => {
  const { t } = useTranslation();
  useAutoDailyReset(); // Ativar reset automático
  
  return (
    <ExchangeRateWrapper>
      <BrowserRouter>
        <Routes>
          {/* Auth pages without TopBar */}
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/primeiro-acesso" element={<PrimeiroAcesso />} />
          
          {/* All other pages with Topbar Navigation */}
          <Route path="/*" element={
            <ProtectedRoute>
              <div className="min-h-screen w-full bg-background">
                <TopbarNavigation />
                <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/campanhas" element={<Campanhas />} />
                    <Route path="/plataformas" element={<Plataformas />} />
                    <Route path="/admin" element={
                      <AdminRoute>
                        <Admin />
                      </AdminRoute>
                    } />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </ExchangeRateWrapper>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <ThemeProvider>
          <UserProvider>
            <CampaignProvider>
              <DailySnapshotProvider>
                <Toaster />
                <Sonner />
                <AppContent />
              </DailySnapshotProvider>
            </CampaignProvider>
          </UserProvider>
        </ThemeProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
