import { useState, useCallback } from 'react';

export interface Postback {
  id: string;
  platformId: string;
  platformName: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT';
  headers: Record<string, string>;
  payloadTemplate?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostbackData {
  platformId: string;
  name: string;
  url: string;
  method?: 'GET' | 'POST' | 'PUT';
  headers?: Record<string, string>;
  payloadTemplate?: string;
  status?: 'active' | 'inactive';
}

export interface UpdatePostbackData {
  platformId?: string;
  name?: string;
  url?: string;
  method?: 'GET' | 'POST' | 'PUT';
  headers?: Record<string, string>;
  payloadTemplate?: string;
  status?: 'active' | 'inactive';
}

interface UsePostbacksReturn {
  postbacks: Postback[];
  loading: boolean;
  error: string | null;
  fetchPostbacks: () => Promise<void>;
  createPostback: (data: CreatePostbackData) => Promise<void>;
  updatePostback: (id: string, data: UpdatePostbackData) => Promise<void>;
  deletePostback: (id: string) => Promise<void>;
  testPostback: (id: string, testData?: any) => Promise<any>;
}

export function usePostbacks(): UsePostbacksReturn {
  const [postbacks, setPostbacks] = useState<Postback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPostbacks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const stored = localStorage.getItem('postbacks');
      const list: Postback[] = stored ? JSON.parse(stored) : [];
      setPostbacks(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar postbacks');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPostback = useCallback(async (data: CreatePostbackData) => {
    setLoading(true);
    setError(null);
    try {
      const newItem: Postback = {
        id: crypto.randomUUID(),
        platformId: data.platformId,
        platformName: '',
        name: data.name,
        url: data.url,
        method: data.method || 'POST',
        headers: data.headers || {},
        payloadTemplate: data.payloadTemplate,
        status: data.status || 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setPostbacks(prev => {
        const next = [newItem, ...prev];
        localStorage.setItem('postbacks', JSON.stringify(next));
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar postback');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePostback = useCallback(async (id: string, data: UpdatePostbackData) => {
    setLoading(true);
    setError(null);
    try {
      let updated: Postback | null = null;
      setPostbacks(prev => {
        const next = prev.map(p => {
          if (p.id === id) {
            updated = { ...p, ...data, updatedAt: new Date().toISOString() };
            return updated;
          }
          return p;
        });
        localStorage.setItem('postbacks', JSON.stringify(next));
        return next;
      });
      return updated as Postback;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar postback');
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
        localStorage.setItem('postbacks', JSON.stringify(next));
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar postback');
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
      setError(err instanceof Error ? err.message : 'Erro ao testar postback');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    postbacks,
    loading,
    error,
    fetchPostbacks,
    createPostback,
    updatePostback,
    deletePostback,
    testPostback,
  };
}