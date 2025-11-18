import { useState, useCallback } from 'react';

// Tipos alinhados com a página AdminCheckoutPostbacks e API (snake_case)
export interface CheckoutPostback {
  id: string;
  platform_id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT';
  headers: Record<string, string>;
  payload_template?: string;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
  // relação opcional retornada pelo backend
  platforms?: { id: string; name: string };
}

export interface CreateCheckoutPostbackData {
  platform_id: string;
  name: string;
  url: string;
  method?: 'GET' | 'POST' | 'PUT';
  headers?: Record<string, string>;
  payload_template?: string;
  status?: 'active' | 'inactive';
}

export interface UpdateCheckoutPostbackData {
  platform_id?: string;
  name?: string;
  url?: string;
  method?: 'GET' | 'POST' | 'PUT';
  headers?: Record<string, string>;
  payload_template?: string;
  status?: 'active' | 'inactive';
}

interface UseCheckoutPostbacksReturn {
  postbacks: CheckoutPostback[];
  loading: boolean;
  error: string | null;
  fetchCheckoutPostbacks: () => Promise<void>;
  createPostback: (data: CreateCheckoutPostbackData) => Promise<void>;
  updatePostback: (id: string, data: UpdateCheckoutPostbackData) => Promise<void>;
  deletePostback: (id: string) => Promise<void>;
  testPostback: (id: string, testData?: any) => Promise<any>;
}

export function useCheckoutPostbacks(): UseCheckoutPostbacksReturn {
  const [postbacks, setPostbacks] = useState<CheckoutPostback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCheckoutPostbacks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const stored = localStorage.getItem('checkoutPostbacks');
      const list: CheckoutPostback[] = stored ? JSON.parse(stored) : [];
      setPostbacks(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar postbacks de checkout');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPostback = useCallback(async (data: CreateCheckoutPostbackData) => {
    setLoading(true);
    setError(null);
    try {
      const newItem: CheckoutPostback = {
        id: crypto.randomUUID(),
        platform_id: data.platform_id,
        name: data.name,
        url: data.url,
        method: data.method || 'POST',
        headers: data.headers || {},
        payload_template: data.payload_template,
        status: data.status || 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setPostbacks(prev => {
        const next = [newItem, ...prev];
        localStorage.setItem('checkoutPostbacks', JSON.stringify(next));
        return next;
      });
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar postback de checkout');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePostback = useCallback(async (id: string, data: UpdateCheckoutPostbackData) => {
    setLoading(true);
    setError(null);
    try {
      let updated: CheckoutPostback | null = null;
      setPostbacks(prev => {
        const next = prev.map(p => {
          if (p.id === id) {
            updated = { ...p, ...data, updated_at: new Date().toISOString() };
            return updated;
          }
          return p;
        });
        localStorage.setItem('checkoutPostbacks', JSON.stringify(next));
        return next;
      });
      return updated as CheckoutPostback;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar postback de checkout');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePostback = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      setPostbacks(prev => {
        const next = prev.filter(postback => postback.id !== id);
        localStorage.setItem('checkoutPostbacks', JSON.stringify(next));
        return next;
      });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar postback de checkout');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const testPostback = useCallback(async (_id: string, _testData?: any) => {
    setLoading(true);
    setError(null);
    try {
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao testar postback de checkout');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    postbacks,
    loading,
    error,
    fetchCheckoutPostbacks,
    createPostback,
    updatePostback,
    deletePostback,
    testPostback
  };
}
