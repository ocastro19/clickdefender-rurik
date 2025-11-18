
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Settings, Code, Plus, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const GoogleAdsSetup: React.FC = () => {
  const { t } = useTranslation()

  const configurationSteps = [
    {
      number: 1,
      text: t('googleAds.step1')
    },
    {
      number: 2,
      text: t('googleAds.step2')
    },
    {
      number: 3,
      text: t('googleAds.step3')
    },
    {
      number: 4,
      text: t('googleAds.step4')
    },
    {
      number: 5,
      text: t('googleAds.step5')
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {t('googleAds.title')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('googleAds.scriptConfigurationDescription')}
          </p>
        </div>

        {/* Webhook Management Card */}
        <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-premium">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                <Settings className="h-6 w-6 text-white" />
              </div>
              {t('googleAds.scriptConfiguration')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted/20 flex items-center justify-center mb-6">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {t('googleAds.noWebhooksConfigured')}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {t('googleAds.createFirstWebhook')}
              </p>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                {t('googleAds.createFirstWebhookButton')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Steps Card */}
        <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-premium">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700">
                <Settings className="h-6 w-6 text-white" />
              </div>
              {t('googleAds.setupTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-lg font-semibold text-foreground">
                {t('googleAds.setupSteps')}
              </p>
              
              <div className="space-y-4">
                {configurationSteps.map((step) => (
                  <div key={step.number} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {step.number}
                    </div>
                    <p className="text-foreground font-medium">{step.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2 text-lg py-6"
                >
                  <Code className="h-5 w-5" />
                  {t('googleAds.viewGoogleAdsScript')}
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default GoogleAdsSetup
