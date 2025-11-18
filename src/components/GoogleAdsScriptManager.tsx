import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Copy, Play, Pause, Trash2, Settings, Globe, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useGoogleAdsWebhooks } from '@/hooks/useGoogleAdsWebhooks'
import { useToast } from '@/hooks/use-toast'
import { GoogleAdsScriptCode } from '@/components/GoogleAdsScriptCode'

interface NewWebhookFormData {
  name: string
  accountId: string
  accountName: string
  currency: 'BRL' | 'USD'
  description: string
}

export const GoogleAdsScriptManager: React.FC = () => {
  const { t } = useTranslation()
  const { 
    webhooks, 
    isLoading,
    createWebhook, 
    updateWebhook, 
    deleteWebhook, 
    toggleWebhook,
    copyWebhookUrl,
    testWebhook,
    getWebhookStats
  } = useGoogleAdsWebhooks()
  
  const { toast } = useToast()
  const [showNewWebhookDialog, setShowNewWebhookDialog] = useState(false)
  const [formData, setFormData] = useState<NewWebhookFormData>({
    name: '',
    accountId: '',
    accountName: '',
    currency: 'USD',
    description: ''
  })
  
  const handleCreateWebhook = () => {
    if (!formData.name.trim()) {
      toast({
        title: t('googleAds.requiredName'),
        description: t('googleAds.enterWebhookName'),
        variant: "destructive"
      })
      return
    }
    
    createWebhook(
      formData.name,
      formData.accountId || undefined,
      formData.accountName || undefined,
      formData.currency
    )
    
    // Reset form
    setFormData({
      name: '',
      accountId: '',
      accountName: '',
      currency: 'USD',
      description: ''
    })
    setShowNewWebhookDialog(false)
  }
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return t('googleAds.neverUsed')
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-600' : 'bg-gray-400'
  }
  
  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Header - Mobile Responsive */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="px-1">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
            <span className="block sm:hidden">{t('googleAds.webhooks')}</span>
            <span className="hidden sm:block">{t('googleAds.scriptConfiguration')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            <span className="block sm:hidden">{t('googleAds.configureWebhooks')}</span>
            <span className="hidden sm:block">{t('googleAds.scriptConfigurationDescription')}</span>
          </p>
        </div>
        
        <Dialog open={showNewWebhookDialog} onOpenChange={setShowNewWebhookDialog}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-xs sm:text-sm">
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="block sm:hidden">{t('googleAds.new')}</span>
              <span className="hidden sm:block">{t('googleAds.newWebhook')}</span>
            </Button>
          </DialogTrigger>
          
          <DialogContent className="w-[95vw] max-w-[500px] mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-2">
              <DialogTitle className="text-base sm:text-lg lg:text-xl">{t('googleAds.createNewWebhook')}</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                {t('googleAds.createNewWebhookDescription')}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 sm:space-y-4 py-2 sm:py-4 px-1">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">{t('googleAds.webhookName')} *</Label>
                <Input
                  id="name"
                  placeholder={t('googleAds.webhookNamePlaceholder')}
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="text-sm"
                />
              </div>
              
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="accountId" className="text-sm font-medium">{t('googleAds.accountId')}</Label>
                    <Input
                      id="accountId"
                      placeholder={t('googleAds.accountIdPlaceholder')}
                      value={formData.accountId}
                      onChange={(e) => setFormData(prev => ({ ...prev, accountId: e.target.value }))}
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-sm font-medium">{t('googleAds.currency')}</Label>
                    <Select 
                      value={formData.currency} 
                      onValueChange={(value: 'BRL' | 'USD') => 
                        setFormData(prev => ({ ...prev, currency: value }))
                      }
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">{t('googleAds.usdCurrency')}</SelectItem>
                        <SelectItem value="BRL">{t('googleAds.brlCurrency')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accountName" className="text-sm font-medium">{t('googleAds.accountName')}</Label>
                  <Input
                    id="accountName"
                    placeholder={t('googleAds.accountNamePlaceholder')}
                    value={formData.accountName}
                    onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
                    className="text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">{t('googleAds.description')}</Label>
                  <Textarea
                    id="description"
                    placeholder={t('googleAds.descriptionPlaceholder')}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    className="text-sm resize-none"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end pt-2 border-t">
              <Button 
                variant="outline" 
                onClick={() => setShowNewWebhookDialog(false)}
                className="w-full sm:w-auto text-sm"
              >
                {t('googleAds.cancel')}
              </Button>
              <Button 
                onClick={handleCreateWebhook}
                className="w-full sm:w-auto text-sm"
              >
                {t('googleAds.createWebhook')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Webhooks List - Mobile Responsive */}
      {webhooks.length === 0 ? (
        <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-premium">
          <CardContent className="py-6 sm:py-8 lg:py-12 text-center px-2 sm:px-4">
            <Globe className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-foreground mb-1 sm:mb-2">
              <span className="block sm:hidden">{t('googleAds.noWebhooksMobile')}</span>
              <span className="hidden sm:block">{t('googleAds.noWebhooksConfigured')}</span>
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 max-w-xs sm:max-w-md mx-auto">
              <span className="block sm:hidden">{t('googleAds.createFirstWebhookMobile')}</span>
              <span className="hidden sm:block">{t('googleAds.createFirstWebhook')}</span>
            </p>
            <Button 
              onClick={() => setShowNewWebhookDialog(true)}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="block sm:hidden">{t('googleAds.create')}</span>
              <span className="hidden sm:block">{t('googleAds.createFirstWebhookButton')}</span>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {webhooks.map((webhook) => {
            const stats = getWebhookStats(webhook.id)
            
            return (
              <Card key={webhook.id} className="relative border-0 bg-card/50 backdrop-blur-sm shadow-premium">
                <CardHeader className="pb-2 sm:pb-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 mb-2">
                        <CardTitle className="text-sm sm:text-base lg:text-lg">{webhook.name}</CardTitle>
                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                          <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getStatusColor(webhook.isActive)}`} />
                          <Badge variant={webhook.isActive ? "default" : "secondary"} className="text-xs">
                            {webhook.isActive ? t('googleAds.active') : t('googleAds.inactive')}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {webhook.currency}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardDescription className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4 text-xs sm:text-sm">
                        {webhook.accountName && (
                          <span className="truncate">📊 {webhook.accountName}</span>
                        )}
                        {webhook.accountId && (
                          <span className="truncate">🔗 {webhook.accountId}</span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 flex-shrink-0" />
                          <span className="hidden sm:inline">{t('googleAds.createdOn')}</span>
                          <span className="truncate">{formatDate(webhook.createdAt)}</span>
                        </span>
                      </CardDescription>
                    </div>
                    
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyWebhookUrl(webhook.id)}
                        className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                      >
                        <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testWebhook(webhook.id)}
                        disabled={isLoading}
                        className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                      >
                        <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleWebhook(webhook.id)}
                        className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                      >
                        {webhook.isActive ? (
                          <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
                        ) : (
                          <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteWebhook(webhook.id)}
                        className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-2 sm:pt-4">
                  <div className="space-y-3 sm:space-y-4">
                    {/* Webhook URL - Mobile Responsive */}
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-medium">{t('googleAds.webhookUrl')}</Label>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
                        <Input
                          value={webhook.url}
                          readOnly
                          className="font-mono text-xs bg-muted flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyWebhookUrl(webhook.id)}
                          className="w-full sm:w-auto text-xs"
                        >
                          <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          <span className="block sm:hidden">{t('googleAds.copy')}</span>
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Stats - Mobile Responsive */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                      <div>
                        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                          {stats.totalRequests}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span className="block sm:hidden">{t('googleAds.requests')}</span>
                          <span className="hidden sm:block">{t('googleAds.totalRequests')}</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                          {stats.activeCampaigns}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span className="block sm:hidden">{t('googleAds.campaigns')}</span>
                          <span className="hidden sm:block">{t('googleAds.activeCampaigns')}</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-foreground">
                          {formatDate(stats.lastRequestDate)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span className="block sm:hidden">{t('googleAds.lastUsedMobile')}</span>
                          <span className="hidden sm:block">{t('googleAds.lastUsed')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
      
      {/* Instructions - Mobile Responsive */}
      <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-premium">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base lg:text-lg">
            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="block sm:hidden">{t('googleAds.howToConfigure')}</span>
            <span className="hidden sm:block">{t('googleAds.setupTitle')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
            <h4 className="font-semibold mb-2 sm:mb-3 text-xs sm:text-sm">
              <span className="block sm:hidden">{t('googleAds.steps')}</span>
              <span className="hidden sm:block">{t('googleAds.setupSteps')}</span>
            </h4>
            <ol className="space-y-2 sm:space-y-3">
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-medium mt-0.5 flex-shrink-0">1</span>
                <span className="text-xs sm:text-sm">{t('googleAds.step1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-medium mt-0.5 flex-shrink-0">2</span>
                <span className="text-xs sm:text-sm">{t('googleAds.step2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-medium mt-0.5 flex-shrink-0">3</span>
                <span className="text-xs sm:text-sm">{t('googleAds.step3')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-medium mt-0.5 flex-shrink-0">4</span>
                <span className="text-xs sm:text-sm">{t('googleAds.step4')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-medium mt-0.5 flex-shrink-0">5</span>
                <span className="text-xs sm:text-sm">{t('googleAds.step5')}</span>
              </li>
            </ol>
          </div>
          
          <div className="mt-3 sm:mt-4">
            <GoogleAdsScriptCode />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}