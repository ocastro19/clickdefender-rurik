import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { User, Mail, Phone, Save, X, Lock, Globe, MessageSquare, Eye, Shield, Camera, Upload } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserProfileModal = ({ open, onOpenChange }: UserProfileModalProps) => {
  const { userData, updateUserData } = useUser();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nome: userData.nome,
    email: userData.email,
    senhaAcesso: userData.senhaAcesso,
    telefone: userData.telefone,
    fusoHorario: userData.fusoHorario,
    secretKey: userData.secretKey,
    tokenTelegram: userData.tokenTelegram,
    chatIdTelegram: userData.chatIdTelegram,
    avisoVenda: userData.avisoVenda,
    avisoAcessoSuspeito: userData.avisoAcessoSuspeito,
    avisoIpSuspeito: userData.avisoIpSuspeito,
    profileImage: userData.profileImage
  });

  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setFormData(prev => ({ ...prev, profileImage: imageUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateUserData(formData);
      
      toast({
        title: "Dados atualizados",
        description: "Suas informações foram salvas com sucesso.",
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao atualizar seus dados.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nome: userData.nome,
      email: userData.email,
      senhaAcesso: userData.senhaAcesso,
      telefone: userData.telefone,
      fusoHorario: userData.fusoHorario,
      secretKey: userData.secretKey,
      tokenTelegram: userData.tokenTelegram,
      chatIdTelegram: userData.chatIdTelegram,
      avisoVenda: userData.avisoVenda,
      avisoAcessoSuspeito: userData.avisoAcessoSuspeito,
      avisoIpSuspeito: userData.avisoIpSuspeito,
      profileImage: userData.profileImage
    });
    onOpenChange(false);
  };

  const getInitials = () => {
    return `${userData.nome.charAt(0)}${userData.sobrenome.charAt(0)}`.toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <User className="h-6 w-6" />
            {userData.nome}
          </DialogTitle>
          <p className="text-center text-muted-foreground">Preencha todos os campos corretamente</p>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex justify-center">
            <div className="relative group">
              <Avatar className="h-24 w-24 cursor-pointer" onClick={handleImageClick}>
                {formData.profileImage ? (
                  <AvatarImage src={formData.profileImage} alt="Profile" className="object-cover" />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                    {getInitials()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div 
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center cursor-pointer"
                onClick={handleImageClick}
              >
                <Camera className="h-6 w-6 text-white" />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
          <div className="text-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleImageClick}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Alterar foto
            </Button>
          </div>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome:</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  E-mail:
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senhaAcesso" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Senha de acesso:
                </Label>
                <Input
                  id="senhaAcesso"
                  type="password"
                  value={formData.senhaAcesso}
                  onChange={(e) => handleInputChange('senhaAcesso', e.target.value)}
                  placeholder="Sua senha de acesso"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Celular:
                </Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fusoHorario" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Fuso horário:
                </Label>
                <Input
                  id="fusoHorario"
                  value={formData.fusoHorario}
                  onChange={(e) => handleInputChange('fusoHorario', e.target.value)}
                  placeholder="Ex: Brasília (GMT -3)"
                />
              </div>
            </CardContent>
          </Card>

          {/* ClickBank and Telegram Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5" />
                Integrações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="secretKey">Secret Key: (apenas ClickBank)</Label>
                <Input
                  id="secretKey"
                  value={formData.secretKey}
                  onChange={(e) => handleInputChange('secretKey', e.target.value)}
                  placeholder="SECRET, KEY, CLICKBANK"
                />
                <p className="text-xs text-red-500">* Se tiver mais de uma Secret Key separar com VÍRGULA.</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tokenTelegram" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Token Telegram:
                </Label>
                <Input
                  id="tokenTelegram"
                  value={formData.tokenTelegram}
                  onChange={(e) => handleInputChange('tokenTelegram', e.target.value)}
                  placeholder="Token do bot do Telegram"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chatIdTelegram">Chat ID Telegram:</Label>
                <Input
                  id="chatIdTelegram"
                  value={formData.chatIdTelegram}
                  onChange={(e) => handleInputChange('chatIdTelegram', e.target.value)}
                  placeholder="ID do chat do Telegram"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Eye className="h-5 w-5" />
                Configurações de Aviso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Aviso de venda:</Label>
                  <p className="text-sm text-muted-foreground">Receber notificações de vendas</p>
                </div>
                <Switch
                  checked={formData.avisoVenda}
                  onCheckedChange={(checked) => handleInputChange('avisoVenda', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Aviso de acesso suspeito:</Label>
                  <p className="text-sm text-muted-foreground">Alertas sobre acessos suspeitos</p>
                </div>
                <Switch
                  checked={formData.avisoAcessoSuspeito}
                  onCheckedChange={(checked) => handleInputChange('avisoAcessoSuspeito', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Aviso de IP suspeito:</Label>
                  <p className="text-sm text-muted-foreground">Alertas sobre IPs suspeitos</p>
                </div>
                <Switch
                  checked={formData.avisoIpSuspeito}
                  onCheckedChange={(checked) => handleInputChange('avisoIpSuspeito', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90"
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Atualizando...' : 'Atualizar meus dados'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};