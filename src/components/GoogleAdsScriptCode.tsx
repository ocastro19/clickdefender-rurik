import React, { useState } from 'react'
import { Copy, Download, Code2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

interface GoogleAdsScriptCodeProps {
  webhookUrl?: string
}

export const GoogleAdsScriptCode: React.FC<GoogleAdsScriptCodeProps> = ({ webhookUrl }) => {
  const { toast } = useToast()
  const [customWebhookUrl, setCustomWebhookUrl] = useState(webhookUrl || '')
  
  const generateScript = (url: string) => `
// Script Google Ads - Integração ClickSync Pro
// Versão: 2.0 - Multilíngue (PT-BR/EN-US)
// Data: ${new Date().toLocaleDateString('pt-BR')}

function main() {
  // Configuração - SUBSTITUA PELA SUA URL DO WEBHOOK
  const WEBHOOK_URL = '${url}';
  const ACCOUNT_ID = AdsApp.currentAccount().getCustomerId();
  const ACCOUNT_NAME = AdsApp.currentAccount().getName();
  
  try {
    Logger.log('=== INÍCIO DA EXECUÇÃO - CLICKSYNC PRO ===');
    Logger.log('Conta: ' + ACCOUNT_NAME + ' (' + ACCOUNT_ID + ')');
    
    // Obter campanhas ativas
    const campaigns = AdsApp.campaigns()
      .withCondition('Status = ENABLED')
      .withCondition('CampaignStatus = ENABLED')
      .forDateRange('YESTERDAY') // Dados do dia anterior
      .get();
    
    const campaignsData = [];
    let processedCount = 0;
    
    // Processar cada campanha
    while (campaigns.hasNext()) {
      const campaign = campaigns.next();
      const stats = campaign.getStatsFor('YESTERDAY');
      
      try {
        const campaignData = {
          // IDs únicos (CRÍTICO para multi-conta)
          campaign_id: campaign.getId(),
          account_id: ACCOUNT_ID,
          account_name: ACCOUNT_NAME,
          
          // Dados da campanha
          campaign_name: campaign.getName(),
          campaign_status: campaign.isEnabled() ? 'ENABLED' : 'PAUSED',
          bid_strategy: campaign.getBiddingStrategyType(),
          budget: campaign.getBudget().getAmount(),
          
          // Métricas principais
          impressions: stats.getImpressions(),
          clicks: stats.getClicks(),
          cost: stats.getCost(),
          conversions: stats.getConversions(),
          
          // Métricas calculadas
          ctr: stats.getCtr(),
          avg_cpc: stats.getAverageCpc(),
          cost_per_conversion: stats.getCostPerConversion(),
          conversion_rate: stats.getConversionRate(),
          
          // Metadata
          date: Utilities.formatDate(new Date(), 'GMT-3', 'yyyy-MM-dd'),
          timestamp: new Date().toISOString(),
          currency: campaign.getBudget().getAmount() ? 'USD' : 'USD' // Google Ads geralmente USD
        };
        
        campaignsData.push(campaignData);
        processedCount++;
        
      } catch (error) {
        Logger.log('Erro ao processar campanha: ' + campaign.getName() + ' - ' + error);
      }
    }
    
    if (campaignsData.length === 0) {
      Logger.log('Nenhuma campanha encontrada ou processada');
      return;
    }
    
    // Preparar dados para envio
    const payload = {
      userId: 'google_ads_user', // Pode ser customizado
      accountId: ACCOUNT_ID,
      accountName: ACCOUNT_NAME,
      data: campaignsData,
      timestamp: new Date().toISOString(),
      currency: 'USD', // Padrão Google Ads
      totalCampaigns: processedCount
    };
    
    // Enviar dados via webhook
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'GoogleAds-Script-ClickSync/2.0'
      },
      payload: JSON.stringify(payload)
    };
    
    Logger.log('Enviando ' + campaignsData.length + ' campanhas para o webhook...');
    
    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    if (responseCode === 200) {
      Logger.log('✅ SUCESSO: Dados enviados com sucesso');
      Logger.log('Resposta: ' + responseText);
    } else {
      Logger.log('❌ ERRO: Falha no envio - Código: ' + responseCode);
      Logger.log('Resposta: ' + responseText);
    }
    
    Logger.log('=== EXECUÇÃO CONCLUÍDA ===');
    Logger.log('Campanhas processadas: ' + processedCount);
    
  } catch (error) {
    Logger.log('❌ ERRO GERAL: ' + error);
    Logger.log('Stack trace: ' + error.stack);
  }
}

// Função auxiliar para debug (opcional)
function debugScript() {
  Logger.log('=== MODO DEBUG ===');
  
  const account = AdsApp.currentAccount();
  Logger.log('Conta atual: ' + account.getName());
  Logger.log('ID da conta: ' + account.getCustomerId());
  
  const campaigns = AdsApp.campaigns()
    .withCondition('Status = ENABLED')
    .get();
  
  let count = 0;
  while (campaigns.hasNext() && count < 5) {
    const campaign = campaigns.next();
    Logger.log('Campanha ' + (count + 1) + ': ' + campaign.getName());
    count++;
  }
  
  Logger.log('Total de campanhas ativas: ' + count);
}
`.trim()
  
  const currentScript = generateScript(customWebhookUrl)
  
  const copyScript = () => {
    navigator.clipboard.writeText(currentScript)
    toast({
      title: "Código copiado!",
      description: "Script do Google Ads copiado para a área de transferência"
    })
  }
  
  const downloadScript = () => {
    const blob = new Blob([currentScript], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `google-ads-script-clicksync-${Date.now()}.js`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: "Download iniciado",
      description: "Arquivo do script baixado com sucesso"
    })
  }
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full text-xs sm:text-sm">
          <Code2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="block sm:hidden">Ver Script</span>
          <span className="hidden sm:block">Ver Código do Script Google Ads</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="w-[95vw] max-w-4xl max-h-[85vh] overflow-y-auto mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base lg:text-lg">
            <Code2 className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="block sm:hidden">Script Google Ads</span>
            <span className="hidden sm:block">Script Google Ads - ClickSync Pro</span>
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            <span className="block sm:hidden">Código JS para Google Ads Scripts</span>
            <span className="hidden sm:block">Código JavaScript para executar no Google Ads Scripts. Este código enviará automaticamente os dados das suas campanhas para o webhook configurado.</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6">
          {/* URL Configuration - Mobile Responsive */}
          <div className="space-y-2">
            <Label htmlFor="webhook-url" className="text-xs sm:text-sm">URL do Webhook</Label>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
              <Input
                id="webhook-url"
                value={customWebhookUrl}
                onChange={(e) => setCustomWebhookUrl(e.target.value)}
                placeholder="https://seu-dominio.com/api/webhooks/googleads/..."
                className="font-mono text-xs sm:text-sm flex-1"
              />
              <Button 
                variant="outline" 
                onClick={() => setCustomWebhookUrl(customWebhookUrl)}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                Atualizar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="block sm:hidden">URL do webhook criado acima</span>
              <span className="hidden sm:block">Substitua pela URL do webhook criado na seção anterior</span>
            </p>
          </div>
          
          {/* Features - Mobile Responsive */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
            <Badge variant="secondary" className="justify-center text-xs">Multilíngue</Badge>
            <Badge variant="secondary" className="justify-center text-xs">Multi-conta</Badge>
            <Badge variant="secondary" className="justify-center text-xs">Auto-execução</Badge>
            <Badge variant="secondary" className="justify-center text-xs">Error Handling</Badge>
          </div>
          
          {/* Script Code - Mobile Responsive */}
          <div className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Label className="text-sm sm:text-base font-semibold">Código do Script</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyScript} className="flex-1 sm:flex-none text-xs sm:text-sm">
                  <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Copiar
                </Button>
                <Button variant="outline" size="sm" onClick={downloadScript} className="flex-1 sm:flex-none text-xs sm:text-sm">
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Baixar
                </Button>
              </div>
            </div>
            
            <Textarea
              value={currentScript}
              readOnly
              className="font-mono text-xs bg-muted min-h-[300px] sm:min-h-[400px] resize-none"
              style={{ fontFamily: 'Consolas, Monaco, "Courier New", monospace' }}
            />
          </div>
          
          {/* Instructions - Mobile Responsive */}
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-sm sm:text-base lg:text-lg">
                <span className="block sm:hidden">Como usar:</span>
                <span className="hidden sm:block">Como usar este código:</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ol className="space-y-2 text-xs sm:text-sm">
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-medium mt-0.5 flex-shrink-0">1</span>
                  <span>Copie o código acima (clique em "Copiar")</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-medium mt-0.5 flex-shrink-0">2</span>
                  <span>Acesse sua conta do Google Ads → Ferramentas → Scripts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-medium mt-0.5 flex-shrink-0">3</span>
                  <span>Clique em "+ Novo Script" e cole o código</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-medium mt-0.5 flex-shrink-0">4</span>
                  <span>Verifique se a URL do webhook está correta no código</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-medium mt-0.5 flex-shrink-0">5</span>
                  <span>Configure a execução automática (ex: diariamente às 9h)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-medium mt-0.5 flex-shrink-0">6</span>
                  <span>Teste executando manualmente uma vez</span>
                </li>
              </ol>
              
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200">
                  💡 <strong>Dica:</strong> O script será executado automaticamente no horário configurado e enviará os dados do dia anterior para o seu sistema.
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Links - Mobile Responsive */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" size="sm" asChild className="w-full sm:w-auto text-xs sm:text-sm">
              <a 
                href="https://ads.google.com/aw/scripts" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="block sm:hidden">Google Ads Scripts</span>
                <span className="hidden sm:block">Abrir Google Ads Scripts</span>
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild className="w-full sm:w-auto text-xs sm:text-sm">
              <a 
                href="https://developers.google.com/google-ads/scripts/docs/your-first-script" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Documentação
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}