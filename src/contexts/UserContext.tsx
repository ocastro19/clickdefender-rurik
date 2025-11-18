import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface UserData {
  id: string;
  username: string;
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  senhaAcesso: string;
  fusoHorario: string;
  secretKey: string;
  tokenTelegram: string;
  chatIdTelegram: string;
  avisoVenda: boolean;
  avisoAcessoSuspeito: boolean;
  avisoIpSuspeito: boolean;
  profileImage?: string;
  role?: 'admin' | 'user';
  // Novos campos da tabela usuario
  phone?: string;
  system?: string;
  login?: string;
  fcm_token?: string;
  timezone?: string;
  secret_key?: string;
  telegram_token?: string;
  telegram_chat_id?: string;
  notification_access?: boolean;
  notification_ip_block?: boolean;
  notification_checkout?: boolean;
  notification_sale?: boolean;
  affiliate_of?: string;
  payment_method?: string;
  is_active?: boolean;
  plan?: string;
}

interface UserContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const defaultUserData: UserData = {
  id: '1',
  username: 'ElielCastro',
  nome: 'Eliel',
  sobrenome: 'Castro',
  email: 'admin@admin.com',
  telefone: '(11) 99999-9999',
  senhaAcesso: '123456',
  fusoHorario: 'Brasília (GMT -3)',
  secretKey: 'SECRET, ELIELI0, CLICKDEFENDER10',
  tokenTelegram: '7631690083:AAEBv-LXvzlJon1jYKSO3dnbmbOtqj2Jk',
  chatIdTelegram: '1740730267',
  avisoVenda: true,
  avisoAcessoSuspeito: false,
  avisoIpSuspeito: false,
  profileImage: undefined,
  role: 'admin'
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [loading, setLoading] = useState(true);

  // Carregar dados do usuário do Supabase
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        
        // Verificar sessão atual
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Buscar dados do usuário do backend
          const token = session.access_token;
          const response = await fetch('/api/admin/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
              const user = result.data;
              setUserData(prev => ({
                ...prev,
                id: user.id || user.ukey,
                username: user.login || user.name || user.email?.split('@')[0] || 'usuario',
                nome: user.name?.split(' ')[0] || 'João',
                sobrenome: user.name?.split(' ').slice(1).join(' ') || 'Silva',
                email: user.email,
                role: user.role || 'user',
                phone: user.phone || '',
                system: user.system || '',
                login: user.login || '',
                fcm_token: user.fcm_token || '',
                timezone: user.timezone || '',
                secret_key: user.secret_key || '',
                telegram_token: user.telegram_token || '',
                telegram_chat_id: user.telegram_chat_id || '',
                notification_access: user.notification_access || false,
                notification_ip_block: user.notification_ip_block || false,
                notification_checkout: user.notification_checkout || false,
                notification_sale: user.notification_sale || false,
                affiliate_of: user.affiliate_of || '',
                payment_method: user.payment_method || '',
                is_active: user.is_active ?? true,
                plan: user.plan || 'free',
                // Mapear campos antigos para compatibilidade
                telefone: user.phone || '',
                fusoHorario: user.timezone || '',
                secretKey: user.secret_key || '',
                tokenTelegram: user.telegram_token || '',
                chatIdTelegram: user.telegram_chat_id || '',
                avisoVenda: user.notification_sale || false,
                avisoAcessoSuspeito: user.notification_access || false,
                avisoIpSuspeito: user.notification_ip_block || false,
              }));
            }
          } else {
            // Fallback: usar dados básicos do Supabase
            setUserData(prev => ({
              ...prev,
              id: session.user.id,
              username: session.user.email?.split('@')[0] || 'usuario',
              nome: 'João',
              sobrenome: 'Silva',
              email: session.user.email || '',
              role: 'user', // Role padrão
              phone: '',
              system: '',
              login: session.user.email?.split('@')[0] || 'usuario',
              fcm_token: '',
              timezone: '',
              secret_key: '',
              telegram_token: '',
              telegram_chat_id: '',
              notification_access: false,
              notification_ip_block: false,
              notification_checkout: false,
              notification_sale: false,
              affiliate_of: '',
              payment_method: '',
              is_active: true,
              plan: 'free',
              // Mapear campos antigos para compatibilidade
              telefone: '',
              fusoHorario: '',
              secretKey: '',
              tokenTelegram: '',
              chatIdTelegram: '',
              avisoVenda: false,
              avisoAcessoSuspeito: false,
              avisoIpSuspeito: false,
            }));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserData();
      } else if (event === 'SIGNED_OUT') {
        setUserData(defaultUserData);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    // Simular validação de senha atual e mudança
    return new Promise((resolve) => {
      setTimeout(() => {
        // Por enquanto, sempre retorna sucesso
        // Em produção, aqui seria feita a verificação com o backend
        resolve(true);
      }, 1000);
    });
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData, changePassword }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};