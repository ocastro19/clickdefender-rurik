import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Globe, Moon, Sun, Bell, Shield, HelpCircle, Info, Database, Cloud, Download, Lock, Trash2, RefreshCw, Palette } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [dataRetention, setDataRetention] = useState('90');
  const [isLoading, setIsLoading] = useState(false);

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Dados exportados",
        description: "Seus dados foram exportados com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao exportar seus dados.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCache = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Cache limpo",
        description: "O cache da aplicação foi limpo com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao limpar o cache.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('settings.title')}
          </DialogTitle>
          <DialogDescription>
            {t('settings.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Appearance Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sun className="h-5 w-5" />
                Aparência
              </CardTitle>
              <CardDescription>
                Personalize a aparência da aplicação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Language Setting */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Idioma</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Selecione o idioma da interface
                  </p>
                </div>
                <LanguageSelector />
              </div>

              <Separator />

              {/* Theme Setting */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Tema da aplicação</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Escolha entre Light, Dark ou Dark Blue minimalista
                  </p>
                </div>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="dark-blue">
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Dark Blue
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Sistema
              </CardTitle>
              <CardDescription>
                Configurações gerais do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Notificações push</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receber notificações do navegador
                  </p>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Backup automático</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Fazer backup automático dos dados
                  </p>
                </div>
                <Switch
                  checked={autoBackup}
                  onCheckedChange={setAutoBackup}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Retenção de dados</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tempo de armazenamento dos dados históricos
                  </p>
                </div>
                <Select value={dataRetention} onValueChange={setDataRetention}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 dias</SelectItem>
                    <SelectItem value="60">60 dias</SelectItem>
                    <SelectItem value="90">90 dias</SelectItem>
                    <SelectItem value="180">6 meses</SelectItem>
                    <SelectItem value="365">1 ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Segurança e Privacidade
              </CardTitle>
              <CardDescription>
                Configurações de segurança e privacidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Sessão automática</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Encerrar sessão automaticamente após inatividade
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Exportar dados</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Baixar todos os seus dados em formato JSON
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportData}
                  disabled={isLoading}
                >
                  {isLoading ? 'Exportando...' : 'Exportar'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Manutenção
              </CardTitle>
              <CardDescription>
                Ferramentas de manutenção da aplicação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Limpar cache</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Limpar dados temporários da aplicação
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearCache}
                  disabled={isLoading}
                >
                  {isLoading ? 'Limpando...' : 'Limpar'}
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Versão da aplicação</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    v2.1.0 - Última atualização: 25/07/2025
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Verificar atualizações
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Support Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Suporte
              </CardTitle>
              <CardDescription>
                Obtenha ajuda e suporte técnico
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="font-medium">Central de ajuda</span>
                  <p className="text-sm text-muted-foreground">
                    Acesse documentação e tutoriais
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Acessar
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="font-medium">Contatar suporte</span>
                  <p className="text-sm text-muted-foreground">
                    Entre em contato com nossa equipe
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Contatar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};