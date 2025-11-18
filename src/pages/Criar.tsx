import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import PresellWizard from '@/components/criar/PresellWizard';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Cookie, Timer, Code, Link as LinkIcon, Info } from "lucide-react";
import { Label } from "@/components/ui/label";

const Criar = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const isMobile = useIsMobile();

  const presellOptions = [
    {
      value: 'presell-cookie',
      label: 'Presell Cookie',
      icon: Cookie,
      description: 'Simula um cookie de consentimento na tela do cliente'
    },
    {
      value: 'presell-escassez',
      label: 'Presell Escassez',
      icon: Timer,
      description: 'Mensagem de escassez de últimas unidades'
    },
    {
      value: 'script-rastreamento',
      label: 'Script de Rastreamento',
      icon: Code,
      description: 'Rastreamento avançado de conversões'
    },
    {
      value: 'url-produtor',
      label: 'URL do Produtor',
      icon: LinkIcon,
      description: 'UTM para página de vendas do produto'
    }
  ];

  const handleSelectChange = (value: string) => {
    setSelectedType(value);
  };

  const handleContinue = () => {
    if (!selectedType) return;
    setIsDialogOpen(false);
    setIsWizardOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className={`flex items-center justify-center min-h-[calc(100vh-4rem)] ${isMobile ? 'p-4' : 'p-8'}`}>
        <Card className="w-full max-w-2xl shadow-xl border-2">
          <CardContent className={`${isMobile ? 'p-6' : 'p-12'} text-center space-y-6`}>
            <div className="space-y-3">
              <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold tracking-tight`}>
                Criar Nova Campanha
              </h1>
              <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-lg'}`}>
                Inicie a criação de uma nova presell para sua campanha
              </p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size={isMobile ? "default" : "lg"} className={`${isMobile ? 'w-full' : ''} mt-4`}>
                  <Plus className="mr-2 h-5 w-5" />
                  Criar Campanha
                </Button>
              </DialogTrigger>
              <DialogContent className={`${isMobile ? 'w-[95vw] max-w-[95vw]' : 'sm:max-w-2xl'} rounded-2xl p-0 max-h-[90vh] overflow-y-auto`}>
                <div className={`${isMobile ? 'p-4' : 'p-8'}`}>
                  <DialogHeader className={`${isMobile ? 'mb-4' : 'mb-6'} text-left`}>
                    <div className={`flex items-center gap-3 ${isMobile ? 'mb-2' : 'mb-3'}`}>
                      <div className={`flex ${isMobile ? 'h-10 w-10' : 'h-12 w-12'} items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg`}>
                        <Info className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
                      </div>
                      <div>
                        <DialogTitle className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold`}>
                          Selecione sua criação de campanha
                        </DialogTitle>
                      </div>
                    </div>
                    <DialogDescription className={`${isMobile ? 'text-xs pl-13' : 'text-base pl-15'}`}>
                      Escolha o tipo de presell que deseja criar
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className={`space-y-${isMobile ? '4' : '6'}`}>
                    <div className={`space-y-${isMobile ? '3' : '4'}`}>
                      <Label htmlFor="presell-select" className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold`}>
                        Escolha uma opção...
                      </Label>
                      <Select value={selectedType} onValueChange={handleSelectChange}>
                        <SelectTrigger 
                          id="presell-select" 
                          className={`w-full ${isMobile ? 'h-12' : 'h-16'} ${isMobile ? 'text-sm' : 'text-base'} bg-background border-2 rounded-xl focus:border-primary hover:border-primary/50 transition-colors`}
                        >
                          <SelectValue placeholder="Escolha uma opção..." />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-2 rounded-xl z-[200] max-h-[60vh] overflow-y-auto">
                          {presellOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                              <SelectItem 
                                key={option.value} 
                                value={option.value}
                                className={`cursor-pointer ${isMobile ? 'py-3' : 'py-4'} rounded-lg my-1 hover:bg-accent focus:bg-accent transition-colors`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`${isMobile ? 'p-2' : 'p-2.5'} rounded-xl bg-primary/10`}>
                                    <Icon className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-primary`} />
                                  </div>
                                  <div className="flex flex-col text-left">
                                    <span className={`font-semibold ${isMobile ? 'text-sm' : 'text-base'}`}>{option.label}</span>
                                    <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-muted-foreground mt-1`}>{option.description}</span>
                                  </div>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <div className={`flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                        <Info className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                        <span>{presellOptions.length} opções disponíveis para criação de presell</span>
                      </div>
                    </div>

                    <Button 
                      onClick={handleContinue} 
                      className={`w-full ${isMobile ? 'h-11' : 'h-14'} ${isMobile ? 'text-sm' : 'text-base'} font-semibold rounded-xl shadow-lg`}
                      disabled={!selectedType}
                      size={isMobile ? "default" : "lg"}
                    >
                      Continuar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {selectedType && (
        <PresellWizard
          open={isWizardOpen}
          onClose={() => {
            setIsWizardOpen(false);
            setSelectedType('');
          }}
          presellType={selectedType}
        />
      )}
    </div>
  );
};

export default Criar;