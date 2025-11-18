import React from 'react';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { DashboardCurrencyProvider } from '@/contexts/DashboardCurrencyContext';

interface ExchangeRateWrapperProps {
  children: React.ReactNode;
}

export const ExchangeRateWrapper: React.FC<ExchangeRateWrapperProps> = ({ children }) => {
  const { exchangeRate } = useExchangeRate();

  return (
    <DashboardCurrencyProvider exchangeRate={exchangeRate}>
      {children}
    </DashboardCurrencyProvider>
  );
};