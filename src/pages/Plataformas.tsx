import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Check, Link2, ChevronDown, Server, Code, ShoppingCart, BarChart3, Shield, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';

const platforms = [{
  name: 'ADCOMBO',
  url: 'https://clickdefender.pro/postback-plataformas/adcombo.php?ukey={codigousuario}&orderid={trans_id}&product={offer_id}&amount={revenue}&cy=USD&subid1={subacc}&subid2={subacc2}&subid3={subacc3}&subid4={subacc4}&cid={clickid}&type={status}&status=approved'
}, {
  name: 'BUYGOODS',
  url: 'https://clickdefender.pro/postback-plataformas/buygoods.php?ukey={codigousuario}&orderid={ORDERID}&CONV_TYPE={CONV_TYPE}&amount={COMMISSION_AMOUNT}&cy=USD&status=approved&product={PRODUCT_CODENAME}&subid1={SUBID}&subid2={SUBID2}&subid3={SUBID3}&subid4={SUBID4}&subid5={SUBID5}'
}, {
  name: 'CLICKBANK',
  url: 'https://clickdefender.pro/postback-plataformas/clickbank.php?ukey={codigousuario}'
}, {
  name: 'CLICKSADV',
  url: 'https://clickdefender.pro/postback-plataformas/clicksadv.php?ukey={codigousuario}&orderid={transaction_id}&amount={payout_amount}&cy={offer_currency}&status=approved&product={offer_name}&subid1={sub1}&subid2={sub2}&subid3={sub3}&subid4={sub4}&subid5={sub5}'
}, {
  name: 'DIGISTORE',
  url: 'https://clickdefender.pro/postback-plataformas/digistore.php?ukey={codigousuario}&orderid={transaction_id}&amount={amount_affiliate}&cy={currency}&status={billing_status}&product={product_name}&subid1={sid1}&subid2={sid2}&subid3={sid3}&subid4={sid4}&subid5={sid5}&gclid={cid}&vendor={affiliate_name}&country={country}&transactionTime={datetime_full}'
}, {
  name: 'DR.CASH',
  url: 'https://clickdefender.pro/postback-plataformas/drcash.php?ukey={codigousuario}&orderid={uuid}&product={offer}&amount={payment}&cy={currency}&status=approved&type={status}&subid1={sub1}&subid2={sub2}&subid3={sub3}&subid4={sub4}&subid5={sub5}'
}, {
  name: 'EVERFLOW',
  url: 'https://clickdefender.pro/postback-plataformas/everflow.php?ukey={codigousuario}&orderid={transaction_id}&amount={payout_amount}&cy={offer_currency}&status=approved&product={offer_name}&subid1={sub1}&subid2={sub2}&subid3={sub3}&subid4={sub4}&subid5={sub5}'
}, {
  name: 'GURUMEDIA',
  url: 'https://clickdefender.pro/postback-plataformas/gurumedia.php?ukey={codigousuario}&orderid={transaction_id}&amount={payout_amount}&cy={offer_currency}&status=approved&product={offer_name}&subid1={sub1}&subid2={sub2}&subid3={sub3}&subid4={sub4}&subid5={sub5}'
}, {
  name: 'LEMONAD',
  url: 'https://clickdefender.pro/postback-plataformas/lemonad.php?ukey={codigousuario}&orderid={leadid}&amount={payout}&cy={currency}&status={status}&subid1={clickid}&subid2={utmMedium}&subid3={utmCampaign}&subid4={utmContent}&subid5={utmTerm}&cid={utmSource}'
}, {
  name: 'MAXWEB',
  url: 'https://clickdefender.pro/postback-plataformas/maxweb.php?ukey={codigousuario}&orderid={ORDERID}&amount={COMMISSION_AMOUNT}&cy=USD&status=approved&product={PRODUCT_CODENAME}&subid1={SUBID}&subid2={SUBID2}&subid3={SUBID3}&subid4={SUBID4}&subid5={SUBID5}'
}, {
  name: 'MEDIASCALERS',
  url: 'https://clickdefender.pro/postback-plataformas/mediascalers.php?ukey={codigousuario}&orderid={order_id}&amount={payout_amount}&cy={offer_currency}&status=approved&product={offer_name}&subid1={sub1}&subid2={sub2}&subid3={sub3}&subid4={sub4}&subid5={sub5}'
}, {
  name: 'MONETIZZE',
  url: 'https://clickdefender.pro/postback-plataformas/monetizze.php?ukey={codigousuario}&src={src}&utm_campaign={utm_campaign}'
}, {
  name: 'NUTRIPROFITS',
  url: 'https://clickdefender.pro/postback-plataformas/nutriprofits.php?ukey={codigousuario}&amount={payout_usd}&cy=USD&status={payment}&subid1={param}&subid2={param_2}&subid3={param_3}&subid4={param_4}'
}, {
  name: 'SMARTADV',
  url: 'https://clickdefender.pro/postback-plataformas/smartadv.php?ukey={codigousuario}&orderid={transaction_id}&amount={payout_amount}&cy={offer_currency}&status=approved&product={offer_name}&subid1={sub1}&subid2={sub2}&subid3={sub3}&subid4={sub4}&subid5={sub5}'
}, {
  name: 'SMASHLOUD',
  url: 'https://clickdefender.pro/postback-plataformas/smashloud.php?ukey={codigousuario}&orderid={transaction_id}&amount={payout_amount}&cy={offer_currency}&status=approved&product={offer_name}&subid1={sub1}&subid2={sub2}&subid3={sub3}&subid4={sub4}&subid5={sub5}'
}, {
  name: 'TERRALEADS',
  url: 'https://clickdefender.pro/postback-plataformas/terraleads.php?ukey={codigousuario}&orderid={lead_id}&amount={payout}&cy=USD&status=approved&product={offer_id}&subid1={sub_id_1}&subid2={sub_id_2}&subid3={sub_id_3}&subid4={sub_id_4}&subid5={sub_id_5}'
}, {
  name: 'TRAFFICLIGHT',
  url: 'https://clickdefender.pro/postback-plataformas/trafficlight.php?ukey={codigousuario}&orderid={offer_id}&amount={payout}&country={country}&cy={payout_currency}&status=approved&subid1={sub1}&subid2={sub2}&subid3={sub3}&subid4={sub4}&subid5={sub5}'
}, {
  name: 'WEBVORK',
  url: 'https://clickdefender.pro/postback-plataformas/webvork.php?ukey={codigousuario}&orderid={lead_guid}&status=approved&amount={money}&cy={currency}&subid1={utm_medium}&subid2={utm_campaign}&subid3={utm_content}&subid4={utm_term}'
}];

const checkoutLinks = [{
  name: 'BUYGOODS',
  url: '<script src="https://clickdefender.pro/postback-plataformas/checkout-buygoods.php?ukey={codigousuario}&orderid={ORDERID}&amount={COMMISSION_AMOUNT}&cy=USD&product={PRODUCT_CODENAME}&subid={SUBID}&subid1={SUBID1}&subid2={SUBID2}"></script>'
}, {
  name: 'CLICKBANK',
  url: 'https://clickdefender.pro/postback-plataformas/checkout-clickbank.php?ukey={codigousuario}&account={account}&affiliate={affiliate}&vendor={vendor}&event_type={event_type}&transaction_amount={affiliate_earnings}&currency={currency}&tid={tid}&click_id={ext_clid}&country={country}&state={state}&device_type={device_type}=&campaign={campaign}'
}, {
  name: 'DIGISTORE',
  url: 'https://clickdefender.pro/postback-plataformas/checkout-digistore.php?ukey={codigousuario}&__all_params__'
}, {
  name: 'GURUMEDIA',
  url: 'https://clickdefender.pro/postback-plataformas/checkout-gurumedia.php?ukey={codigousuario}?orderid={transaction_id}&amount={payout_amount}&cy={offer_currency}&status=approved&product={offer_name}&subid1={sub1}&subid2={sub2}&subid3={sub3}&subid4={sub4}&subid5={sub5}'
}, {
  name: 'MAXWEB',
  url: 'https://clickdefender.pro/postback-plataformas/checkout-maxweb.php?ukey={codigousuario}&subid1={SUBID}&subid2={SUBID2}&subid3={SUBID3}&subid4={SUBID4}&product={PRODUCT_CODENAME}'
}];

const Plataformas = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [selectedType, setSelectedType] = useState<'postbacks' | 'checkouts' | ''>('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);
  const [expandedUrl, setExpandedUrl] = useState(false);

  const getCurrentPlatforms = () => {
    return selectedType === 'postbacks' ? platforms : checkoutLinks;
  };

  const getSelectedPlatformData = () => {
    const currentPlatforms = getCurrentPlatforms();
    return currentPlatforms.find(p => p.name === selectedPlatform);
  };

  const handleCopyPostback = async () => {
    const platformData = getSelectedPlatformData();
    if (!platformData) return;
    try {
      await navigator.clipboard.writeText(platformData.url);
      setCopiedPlatform(platformData.name);
      toast({
        title: "Link copiado!",
        description: `${selectedType === 'postbacks' ? 'Postback' : 'Checkout'} da ${platformData.name} copiado para a área de transferência.`
      });
      setTimeout(() => setCopiedPlatform(null), 2000);
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleTypeChange = (type: 'postbacks' | 'checkouts') => {
    setSelectedType(type);
    setSelectedPlatform('');
    setCopiedPlatform(null);
  };

  const getCardClasses = (type: 'postbacks' | 'checkouts', isSelected: boolean) => {
    if (type === 'postbacks') {
      return {
        cardBg: isSelected 
          ? 'bg-[hsl(var(--card-sales-bg))] border-[hsl(var(--card-sales-border))] dark:bg-gradient-to-br dark:from-success/20 dark:via-success/10 dark:to-success/5 dark:border-0 shadow-[var(--shadow-sales)] dark:shadow-premium'
          : 'bg-card/90 border-border hover:border-success/50 dark:bg-gradient-to-br dark:from-success/10 dark:via-success/5 dark:to-success/2 dark:border-0 hover:shadow-[var(--shadow-sales)] dark:hover:shadow-premium',
        gradientOverlay: 'absolute inset-0 bg-gradient-to-r from-transparent via-success/5 to-transparent opacity-30 dark:via-white/5 dark:opacity-50',
        iconBg: isSelected 
          ? 'bg-gradient-to-r from-success to-success-bright shadow-glow' 
          : 'bg-gradient-to-r from-muted to-muted/70',
        iconColor: isSelected ? 'text-white' : 'text-muted-foreground',
        badgeBg: 'bg-[hsl(var(--card-sales-accent))] text-success border-success/30 dark:bg-success/10 dark:border-success/20'
      };
    } else {
      return {
        cardBg: isSelected 
          ? 'bg-[hsl(var(--card-orders-bg))] border-[hsl(var(--card-orders-border))] dark:bg-gradient-to-br dark:from-primary/20 dark:via-primary/10 dark:to-primary/5 dark:border-0 shadow-[var(--shadow-orders)] dark:shadow-premium'
          : 'bg-card/90 border-border hover:border-primary/50 dark:bg-gradient-to-br dark:from-primary/10 dark:via-primary/5 dark:to-primary/2 dark:border-0 hover:shadow-[var(--shadow-orders)] dark:hover:shadow-premium',
        gradientOverlay: 'absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-30 dark:via-white/5 dark:opacity-50',
        iconBg: isSelected 
          ? 'bg-gradient-to-r from-primary to-info-bright shadow-glow' 
          : 'bg-gradient-to-r from-muted to-muted/70',
        iconColor: isSelected ? 'text-white' : 'text-muted-foreground',
        badgeBg: 'bg-[hsl(var(--card-orders-accent))] text-primary border-primary/30 dark:bg-primary/10 dark:border-primary/20'
      };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      <div className={`${isMobile ? 'p-2 mx-1' : 'p-3 mx-4'}`}>
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Header Section - Seguindo padrão do Dashboard */}
          <div className="border-0 bg-gradient-to-r from-card/80 to-card/40 backdrop-blur-md shadow-premium rounded-xl">
            <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-primary to-primary/70 shadow-glow">
                    <Link2 className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">
                      Plataformas de Vendas
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Sistema inteligente para gerar links de integração
                    </p>
                  </div>
                </div>

                {/* KPIs Compactos - Seguindo padrão */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Server className="w-3 h-3 text-success" />
                      <span className="text-[10px] font-medium text-muted-foreground uppercase">Postbacks</span>
                    </div>
                    <div className="text-lg font-bold text-success">{platforms.length}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <ShoppingCart className="w-3 h-3 text-primary" />
                      <span className="text-[10px] font-medium text-muted-foreground uppercase">Checkouts</span>
                    </div>
                    <div className="text-lg font-bold text-primary">{checkoutLinks.length}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Shield className="w-3 h-3 text-info" />
                      <span className="text-[10px] font-medium text-muted-foreground uppercase">Seguras</span>
                    </div>
                    <div className="text-lg font-bold text-info">{platforms.length + checkoutLinks.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gerador de Links - Interface Melhorada */}
          <div className="border-0 bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-md rounded-xl shadow-premium">
            <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Code className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-foreground">
                      Gerador de Links de Integração
                    </h2>
                  </div>
                  <p className="text-muted-foreground">
                    Configure sua integração em 3 passos simples e seguros
                  </p>
                </div>

                {/* Step 1: Select Type - Cards Melhorados */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/70 text-primary-foreground text-sm font-bold flex items-center justify-center shadow-glow">
                      1
                    </div>
                    <label className="text-base font-semibold text-foreground">
                      Escolha o tipo de integração
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card 
                      className={`relative overflow-hidden cursor-pointer transition-all duration-500 group ${getCardClasses('postbacks', selectedType === 'postbacks').cardBg}`}
                      onClick={() => handleTypeChange('postbacks')}
                    >
                      <div className={getCardClasses('postbacks', selectedType === 'postbacks').gradientOverlay} />
                      <CardContent className="p-6 relative">
                        <div className="text-center space-y-3">
                          <div className={`p-3 rounded-xl mx-auto w-fit ${getCardClasses('postbacks', selectedType === 'postbacks').iconBg}`}>
                            <Server className={`w-6 h-6 ${getCardClasses('postbacks', selectedType === 'postbacks').iconColor}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">Postbacks de Vendas</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              Links para rastreamento de conversões
                            </p>
                            <Badge variant="secondary" className="mt-2">
                              {platforms.length} plataformas
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card 
                      className={`relative overflow-hidden cursor-pointer transition-all duration-500 group ${getCardClasses('checkouts', selectedType === 'checkouts').cardBg}`}
                      onClick={() => handleTypeChange('checkouts')}
                    >
                      <div className={getCardClasses('checkouts', selectedType === 'checkouts').gradientOverlay} />
                      <CardContent className="p-6 relative">
                        <div className="text-center space-y-3">
                          <div className={`p-3 rounded-xl mx-auto w-fit ${getCardClasses('checkouts', selectedType === 'checkouts').iconBg}`}>
                            <ShoppingCart className={`w-6 h-6 ${getCardClasses('checkouts', selectedType === 'checkouts').iconColor}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">Links de Checkouts</h3>
                            <p className="text-xs text-muted-foreground mt-1">Scripts para checkout de plataforma</p>
                            <Badge variant="secondary" className="mt-2">
                              {checkoutLinks.length} plataformas
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Step 2: Select Platform - Melhorado */}
                {selectedType && <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-info to-info/70 text-white text-sm font-bold flex items-center justify-center shadow-glow">
                        2
                      </div>
                      <label className="text-base font-semibold text-foreground">
                        Selecione a plataforma
                      </label>
                    </div>
                    
                    <div className="bg-gradient-to-r from-muted/20 to-muted/10 rounded-lg p-4 border border-primary/10">
                      <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                        <SelectTrigger className="h-14 bg-background/80 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 text-base">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                              <BarChart3 className="w-4 h-4 text-primary" />
                            </div>
                            <SelectValue placeholder="Escolha uma plataforma..." />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-background border-2 shadow-premium max-h-64">
                          {getCurrentPlatforms().map(platform => <SelectItem key={platform.name} value={platform.name} className="cursor-pointer hover:bg-muted py-3 text-base">
                              <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
                                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                                </div>
                                {platform.name}
                              </div>
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                      
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        {getCurrentPlatforms().length} plataformas disponíveis para {selectedType === 'postbacks' ? 'postbacks' : 'checkouts'}
                      </p>
                    </div>
                  </div>}

                {/* Step 3: Generated Link - Melhorado */}
                {selectedType && selectedPlatform && <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-success to-success/70 text-white text-sm font-bold flex items-center justify-center shadow-glow">
                        3
                      </div>
                      <label className="text-base font-semibold text-foreground">
                        Link gerado com sucesso
                      </label>
                    </div>
                    
                    <Card className="border-2 border-success/20 bg-gradient-to-r from-success/5 to-success/10">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gradient-to-r from-success to-success/70 shadow-glow">
                                <Check className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-foreground">
                                  {selectedType === 'postbacks' ? 'Postback' : 'Checkout'} - {selectedPlatform}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Link pronto para integração na plataforma
                                </p>
                              </div>
                            </div>
                            
                            <Button onClick={handleCopyPostback} variant={copiedPlatform === selectedPlatform ? "default" : "outline"} size="lg" className="hover:shadow-glow transition-all duration-300">
                              {copiedPlatform === selectedPlatform ? <>
                                  <Check className="w-4 h-4 mr-2" />
                                  Copiado!
                                </> : <>
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copiar Link
                                </>}
                            </Button>
                          </div>

                          {/* URL Preview - Expandable */}
                          <div className="bg-background/50 rounded-lg border border-primary/10 overflow-hidden">
                            <div className="p-3 cursor-pointer hover:bg-muted/20 transition-all duration-200" onClick={() => setExpandedUrl(!expandedUrl)}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Code className="w-4 h-4 text-primary" />
                                  <span className="text-sm font-medium text-foreground">Visualizar URL</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${expandedUrl ? 'rotate-180' : ''}`} />
                              </div>
                            </div>
                            
                            {expandedUrl && <div className="p-4 border-t border-primary/10 bg-muted/10">
                                <div className="font-mono text-xs break-all text-muted-foreground bg-background/50 p-3 rounded border">
                                  {getSelectedPlatformData()?.url}
                                </div>
                              </div>}
                          </div>

                          <div className="flex items-start gap-2 p-3 bg-success/10 rounded-lg border border-success/20">
                            <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-success">
                              <strong>Pronto para usar:</strong> Todos os links estão codificados para copiar e colar no campo de postback, em suas respectivas plataformas, boas vendas.
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>}

                {/* Estado Inicial - Melhorado */}
                {!selectedType && <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center shadow-glow">
                      <Link2 className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Pronto para gerar links seguros
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Comece selecionando o tipo de integração que você precisa. Nosso sistema gera links seguros e otimizados para cada plataforma.
                    </p>
                  </div>}
              </div>
            </div>
          </div>

          {/* Plataformas Disponíveis - Reorganizado e Melhorado */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="relative overflow-hidden border border-[hsl(var(--card-sales-border))] bg-[hsl(var(--card-sales-bg))] shadow-premium dark:bg-gradient-to-br dark:from-success/20 dark:via-success/10 dark:to-success/5 dark:border-0 transition-all duration-500 hover:shadow-[var(--shadow-sales)] dark:hover:shadow-premium">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-success/5 to-transparent opacity-30 dark:via-white/5 dark:opacity-50" />
              <CardHeader className="pb-3 relative">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-success to-success-bright shadow-glow">
                    <Server className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-foreground">Postbacks de Vendas</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {platforms.length} plataformas para rastreamento
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 relative">
                <div className="flex flex-wrap gap-2">
                  {platforms.slice(0, 8).map(platform => (
                    <Badge key={platform.name} variant="secondary" className="bg-[hsl(var(--card-sales-accent))] text-success border-success/30 dark:bg-success/10 dark:border-success/20 hover:border-success/50 transition-all duration-200">
                      {platform.name}
                    </Badge>
                  ))}
                  {platforms.length > 8 && (
                    <Badge variant="outline" className="bg-success/10 border-success/20 text-success">
                      +{platforms.length - 8} mais
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                  <Shield className="w-3 h-3 text-success" />
                  <span>Todas as integrações são seguras e testadas</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border border-[hsl(var(--card-orders-border))] bg-[hsl(var(--card-orders-bg))] shadow-premium dark:bg-gradient-to-br dark:from-primary/20 dark:via-primary/10 dark:to-primary/5 dark:border-0 transition-all duration-500 hover:shadow-[var(--shadow-orders)] dark:hover:shadow-premium">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-30 dark:via-white/5 dark:opacity-50" />
              <CardHeader className="pb-3 relative">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-info-bright shadow-glow">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-foreground">Links de Checkouts</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {checkoutLinks.length} scripts para checkout
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 relative">
                <div className="flex flex-wrap gap-2">
                  {checkoutLinks.map(platform => (
                    <Badge key={platform.name} variant="secondary" className="bg-[hsl(var(--card-orders-accent))] text-primary border-primary/30 dark:bg-primary/10 dark:border-primary/20 hover:border-primary/50 transition-all duration-200">
                      {platform.name}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                  <Code className="w-3 h-3 text-primary" />
                  <span>Scripts otimizados para máxima performance</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informações de Segurança */}
          <Card className="border-0 bg-gradient-to-r from-card/60 to-card/30 backdrop-blur-md shadow-premium">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-primary/20 to-primary/10">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Segurança e Confiabilidade
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success"></div>
                      <span>Links criptografados e seguros</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-info"></div>
                      <span>Compatível com todas as plataformas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-warning"></div>
                      <span>Monitoramento em tempo real</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Plataformas;
