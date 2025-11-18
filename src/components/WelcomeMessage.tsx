import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { useBrasiliaTime } from '@/hooks/useBrasiliaTime';
export const WelcomeMessage = () => {
  const { t } = useTranslation();
  const {
    userData
  } = useUser();
  const brasiliaTime = useBrasiliaTime();
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.greetings.morning');
    if (hour < 18) return t('dashboard.greetings.afternoon'); 
    return t('dashboard.greetings.evening');
  };
  return <Card className="bg-card shadow-premium transition-all duration-500 hover:shadow-elegant hover:scale-[1.01] dark:bg-gradient-to-r dark:from-primary/10 dark:via-primary/5 dark:to-background dark:border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {getGreeting()}, {userData.nome}! 👋
            </h1>
            <p className="text-muted-foreground">
              {t('dashboard.welcome')}
            </p>
          </div>
          
        </div>
      </CardContent>
    </Card>;
};