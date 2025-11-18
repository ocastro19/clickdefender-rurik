import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, PlusCircle, Link, Settings, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminPlatforms from './AdminPlatforms';
import AdminPostbacks from './AdminPostbacks';
import AdminCheckoutPostbacks from './AdminCheckoutPostbacks';
import { UserManagement } from '@/components/UserManagement';

export default function Admin() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'platforms' | 'postbacks' | 'checkout' | 'users'>('platforms');

  const tabs = [
    { key: 'platforms', label: 'Plataformas', icon: Link },
    { key: 'postbacks', label: 'Postbacks', icon: Settings },
    { key: 'checkout', label: 'Checkout', icon: PlusCircle },
    { key: 'users', label: 'Usuários', icon: Users },
  ];

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center gap-4">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl">Painel de Administração</CardTitle>
            <p className="text-muted-foreground">Gerencie plataformas, postbacks e configurações de checkout.</p>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid grid-cols-4 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger key={tab.key} value={tab.key} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="platforms">
          <AdminPlatforms />
        </TabsContent>

        <TabsContent value="postbacks">
          <AdminPostbacks />
        </TabsContent>

        <TabsContent value="checkout">
          <AdminCheckoutPostbacks />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}