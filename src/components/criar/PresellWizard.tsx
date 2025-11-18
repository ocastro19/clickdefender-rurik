import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCampaigns } from '@/contexts/CampaignContext';
import { useToast } from '@/hooks/use-toast';
import { Cookie, Timer, Code, Link, Copy, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PresellWizardProps {
  open: boolean;
  onClose: () => void;
  presellType: string;
}

const PresellWizard = ({ open, onClose, presellType }: PresellWizardProps) => {
  const navigate = useNavigate();
  const { addCampaign } = useCampaigns();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    productName: '',
    platform: '',
    affiliateLink: '',
    conversionGoal: '',
    checkoutGoal: '',
    domain: '',
    customizeCopy: false,
    presellTitle: '',
    buttonText: '',
    description: '',
    directLink: '',
    generatedTrackingUrl: '',
    generatedGoogleAdsUrl: ''
  });

  const getPresellConfig = () => {
    switch (presellType) {
      case 'presell-cookie':
        return {
          title: 'Criar Presell Cookie',
          icon: Cookie,
          totalSteps: 6,
          hasCopyCustomization: true,
          campaignSuffix: 'Cookie Presell'
        };
      case 'presell-escassez':
        return {
          title: 'Criar Presell Escassez',
          icon: Timer,
          totalSteps: 4,
          hasCopyCustomization: false,
          campaignSuffix: 'Escassez Presell'
        };
      case 'script-rastreamento':
        return {
          title: 'Criar Script de Rastreamento',
          icon: Code,
          totalSteps: 4,
          hasCopyCustomization: false,
          campaignSuffix: 'Script Rastreamento'
        };
      case 'url-produtor':
        return {
          title: 'URL do Produtor',
          icon: Link,
          totalSteps: 5,
          hasCopyCustomization: false,
          hasDirectLink: true,
          campaignSuffix: 'URL Produtor'
        };
      default:
        return {
          title: 'Criar Presell',
          icon: Cookie,
          totalSteps: 4,
          hasCopyCustomization: false,
          campaignSuffix: 'Presell'
        };
    }
  };

  const config = getPresellConfig();

  const generateTrackingUrls = (directLink: string, platform: string) => {
    // Gerar chaves únicas
    const ukey = Math.random().toString(36).substring(2, 15);
    const preskey = Math.random().toString(36).substring(2, 15);
    
    // URL de rastreamento (adiciona parâmetros ao direct link)
    const trackingUrl = `${directLink}${directLink.includes('?') ? '&' : '?'}tid={gclid}&extclid={gclid}`;
    
    // Modelo de acompanhamento do Google Ads
    const googleAdsUrl = `https://clickdefender.pro/google-track.php?ukey=${ukey}&preskey=${preskey}&gclid={gclid}&keyword={keyword}&query={querystring}&matchtype={matchtype}&device={device}&adposition={adposition}&placement={placement}&creative={creative}&campaignid={campaignid}&adgroupid={adgroupid}&feeditemid={feeditemid}&targetid={targetid}`;
    
    return { trackingUrl, googleAdsUrl };
  };

  const platforms = [
    { value: "adcombo", label: "ADCOMBO" },
    { value: "buygoods", label: "BUYGOODS" },
    { value: "clickbank", label: "CLICKBANK" },
    { value: "clicksadv", label: "CLICKSADV" },
    { value: "digistore", label: "DIGISTORE" },
    { value: "dr-cash", label: "DR.CASH" },
    { value: "everflow", label: "EVERFLOW" },
    { value: "gurumedia", label: "GURUMEDIA" },
    { value: "lemonad", label: "LEMONAD" },
    { value: "maxweb", label: "MAXWEB" },
    { value: "mediascalers", label: "MEDIASCALERS" },
    { value: "monetizze", label: "MONETIZZE" },
    { value: "nutriprofits", label: "NUTRIPROFITS" },
    { value: "smartadv", label: "SMARTADV" },
    { value: "smashloud", label: "SMASHLOUD" },
    { value: "terraleads", label: "TERRALEADS" },
    { value: "trafficlight", label: "TRAFFICLIGHT" },
    { value: "webvork", label: "WEBVORK" }
  ];

  const handleNext = () => {
    if (step === 1 && !formData.productName) {
      toast({ title: "Nome do produto é obrigatório", variant: "destructive" });
      return;
    }
    if (step === 2 && !formData.platform) {
      toast({ title: "Selecione uma plataforma", variant: "destructive" });
      return;
    }
    if (step === 3) {
      if (config.hasDirectLink && !formData.directLink) {
        toast({ title: "Direct link da plataforma é obrigatório", variant: "destructive" });
        return;
      }
      if (!config.hasDirectLink && !formData.affiliateLink) {
        toast({ title: "Link de afiliado é obrigatório", variant: "destructive" });
        return;
      }
      
      // Se tem direct link, gerar URLs de rastreamento
      if (config.hasDirectLink && formData.directLink) {
        const { trackingUrl, googleAdsUrl } = generateTrackingUrls(formData.directLink, formData.platform);
        setFormData({
          ...formData,
          generatedTrackingUrl: trackingUrl,
          generatedGoogleAdsUrl: googleAdsUrl
        });
      }
    }
    if (step === 4 && !formData.conversionGoal) {
      toast({ title: "Meta de conversão é obrigatória", variant: "destructive" });
      return;
    }
    
    // Se não tem customização de copy e não tem direct link, vai direto para criação após step 4
    if (!config.hasCopyCustomization && !config.hasDirectLink && step === 4) {
      handleCreateCampaign();
      return;
    }
    
    setStep(step + 1);
  };

  const handleCustomizeCopy = (customize: boolean) => {
    setFormData({ ...formData, customizeCopy: customize });
    
    if (!customize) {
      // Usar valores padrão e criar campanha direto
      setFormData({
        ...formData,
        customizeCopy: false,
        presellTitle: 'Cookie Policy',
        buttonText: 'Accept',
        description: 'This website uses cookies to personalize content and ads, provide social media features and analyze our traffic. By clicking Accept, you agree to the use of cookies. For more information, please, visit our cookie policy.'
      });
      handleCreateCampaign(); // Criar campanha com valores padrão
    } else {
      setStep(6); // Ir para step 6 (customização)
    }
  };

  const handleCreateCampaign = () => {
    const finalData = config.hasCopyCustomization && formData.customizeCopy ? formData : {
      ...formData,
      presellTitle: presellType === 'presell-cookie' ? 'Cookie Policy' : '',
      buttonText: presellType === 'presell-cookie' ? 'Accept' : '',
      description: presellType === 'presell-cookie' 
        ? 'This website uses cookies to personalize content and ads, provide social media features and analyze our traffic. By clicking Accept, you agree to the use of cookies. For more information, please, visit our cookie policy.'
        : ''
    };

    // Criar campanha
    const newCampaign = {
      id: Date.now().toString(),
      campanha: `${finalData.productName} - ${config.campaignSuffix}`,
      data: new Date().toISOString().split('T')[0],
      orcamento: 0,
      impressoes: 0,
      cliques: 0,
      custo: 0,
      cpcMedio: 0,
      conversoes: 0,
      estrategiaLances: 'Manual',
      currency: 'USD' as const,
      isActive: true,
      conversionGoal: finalData.conversionGoal,
      checkoutGoal: finalData.checkoutGoal,
      domain: finalData.domain || '',
    };

    addCampaign(newCampaign);
    
    toast({
      title: "Campanha criada com sucesso!",
      description: `${config.campaignSuffix} para ${finalData.productName} foi criada.`,
    });

    onClose();
    navigate('/campanhas');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Nome do Produto:</Label>
              <Input
                id="productName"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                placeholder="Ex: LeanDrops™"
              />
            </div>
            <Button onClick={handleNext} className="w-full">
              Próximo
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Plataforma:</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, platform: value })} value={formData.platform}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Selecione a Plataforma..." />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {platforms.map((platform) => (
                    <SelectItem 
                      key={platform.value} 
                      value={platform.value}
                      className="hover:bg-muted"
                    >
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Voltar
              </Button>
              <Button onClick={handleNext} className="flex-1">
                Próximo
              </Button>
            </div>
          </div>
        );

      case 3:
        if (config.hasDirectLink) {
          return (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="directLink">Direct link da plataforma:</Label>
                <Input
                  id="directLink"
                  value={formData.directLink}
                  onChange={(e) => setFormData({ ...formData, directLink: e.target.value })}
                  placeholder="https://..."
                />
                <Alert className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Cole aqui o link direto da plataforma. O sistema adicionará automaticamente os parâmetros de rastreamento.
                  </AlertDescription>
                </Alert>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Voltar
                </Button>
                <Button onClick={handleNext} className="flex-1">
                  Próximo
                </Button>
              </div>
            </div>
          );
        }
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="affiliateLink">Seu link de Afiliado:</Label>
              <Input
                id="affiliateLink"
                value={formData.affiliateLink}
                onChange={(e) => setFormData({ ...formData, affiliateLink: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Voltar
              </Button>
              <Button onClick={handleNext} className="flex-1">
                Próximo
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="conversionGoal">Nome da Meta de Conversão:</Label>
              <Input
                id="conversionGoal"
                value={formData.conversionGoal}
                onChange={(e) => setFormData({ ...formData, conversionGoal: e.target.value })}
                placeholder="Ex: Purchase"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                Voltar
              </Button>
              <Button onClick={handleNext} className="flex-1">
                Próximo
              </Button>
            </div>
          </div>
        );

      case 5:
        if (config.hasDirectLink) {
          const copyToClipboard = (text: string, label: string) => {
            navigator.clipboard.writeText(text);
            toast({ title: "Copiado!", description: `${label} copiado para a área de transferência.` });
          };

          return (
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">URL do anúncio:</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.generatedTrackingUrl}
                      readOnly
                      className="text-xs"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(formData.generatedTrackingUrl, "URL do anúncio")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Modelo de acompanhamento da CAMPANHA:</Label>
                  <div className="flex gap-2">
                    <Textarea
                      value={formData.generatedGoogleAdsUrl}
                      readOnly
                      className="text-xs min-h-[100px]"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(formData.generatedGoogleAdsUrl, "Modelo de acompanhamento")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Button onClick={handleCreateCampaign} className="w-full bg-success hover:bg-success/90">
                Criar Campanha
              </Button>
            </div>
          );
        }
        
        // Para presells com customização de copy (cookie)
        return (
          <div className="space-y-4">
            <div className="space-y-4 text-center">
              <h3 className="text-lg font-semibold">Deseja personalizar a copy da presell?</h3>
              <p className="text-sm text-muted-foreground">
                Você pode personalizar o título, texto do botão e descrição, ou usar os valores padrão.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleCustomizeCopy(false)} className="flex-1">
                Usar Padrão
              </Button>
              <Button onClick={() => handleCustomizeCopy(true)} className="flex-1">
                Personalizar
              </Button>
            </div>
          </div>
        );

      case 6:
        // Para presells com customização de copy (cookie) - customização completa
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="presellTitle">Título da Presell:</Label>
                <Input
                  id="presellTitle"
                  value={formData.presellTitle}
                  onChange={(e) => setFormData({ ...formData, presellTitle: e.target.value })}
                  placeholder="Ex: Cookie Policy"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buttonText">Texto do Botão:</Label>
                <Input
                  id="buttonText"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  placeholder="Ex: Accept"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição:</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="This website uses cookies..."
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(4)} className="flex-1">
                Voltar
              </Button>
              <Button onClick={handleCreateCampaign} className="flex-1 bg-success hover:bg-success/90">
                Criar Campanha
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const PresellIcon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <PresellIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>{config.title}</DialogTitle>
              <DialogDescription>
                Passo {step} de {config.totalSteps}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
};

export default PresellWizard;
