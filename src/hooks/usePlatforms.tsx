import { useState, useCallback } from 'react';
import { Platform, CreatePlatformRequest, UpdatePlatformRequest } from '../types/platform';
import { useToast } from './use-toast';

export function usePlatforms() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchPlatforms = useCallback(async () => {
    try {
      setLoading(true);
      const stored = localStorage.getItem('platforms');
      const list: Platform[] = stored ? JSON.parse(stored) : [];
      setPlatforms(list);
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao buscar plataformas',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createPlatform = useCallback(async (data: CreatePlatformRequest) => {
    try {
      setLoading(true);
      const newItem: Platform = {
        id: crypto.randomUUID(),
        name: data.name,
        status: data.status || 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Platform;
      setPlatforms(prev => {
        const next = [...prev, newItem];
        localStorage.setItem('platforms', JSON.stringify(next));
        return next;
      });
      toast({
        title: 'Sucesso',
        description: 'Plataforma criada com sucesso'
      });
      return newItem;
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao criar plataforma',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updatePlatform = useCallback(async (id: string, data: UpdatePlatformRequest) => {
    try {
      setLoading(true);
      let updated: Platform | null = null;
      setPlatforms(prev => {
        const next = prev.map(p => {
          if (p.id === id) {
            updated = { ...p, ...data, updatedAt: new Date().toISOString() } as Platform;
            return updated;
          }
          return p;
        });
        localStorage.setItem('platforms', JSON.stringify(next));
        return next;
      });
      toast({
        title: 'Sucesso',
        description: 'Plataforma atualizada com sucesso'
      });
      return updated as Platform;
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao atualizar plataforma',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deletePlatform = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setPlatforms(prev => {
        const next = prev.filter(platform => platform.id !== id);
        localStorage.setItem('platforms', JSON.stringify(next));
        return next;
      });
      toast({
        title: 'Sucesso',
        description: 'Plataforma deletada com sucesso'
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao deletar plataforma',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    platforms,
    loading,
    fetchPlatforms,
    createPlatform,
    updatePlatform,
    deletePlatform
  };
}