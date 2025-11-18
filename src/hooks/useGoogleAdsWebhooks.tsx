// Stub simples para webhooks
export const useGoogleAdsWebhooks = () => {
  return {
    webhooks: [],
    createWebhook: (name: any, accountId?: any, accountName?: any, currency?: any) => {},
    updateWebhook: (id: any, updates: any) => {},
    deleteWebhook: (id: any) => {},
    toggleWebhook: (id: any) => {},
    copyWebhookUrl: (id: any) => {},
    testWebhook: (id: any) => Promise.resolve(false),
    getWebhookStats: (id: any) => ({ totalRequests: 0, activeCampaigns: 0, lastRequestDate: undefined }),
    isLoading: false
  }
}