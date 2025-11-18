import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Shield, User, Users, Mail, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  ukey: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  plan: string;
  created_at: string;
  updated_at: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const stored = localStorage.getItem('users');
      const list: User[] = stored ? JSON.parse(stored) : [];
      setUsers(list);
    } catch (error) {
      toast({
        title: 'Erro ao carregar usuários',
        description: 'Não foi possível carregar a lista de usuários.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      setUpdatingRole(userId);
      setUsers(prev => {
        const next = prev.map(user => user.id === userId ? { ...user, role: newRole } : user);
        localStorage.setItem('users', JSON.stringify(next));
        return next;
      });
      toast({
        title: 'Role atualizado com sucesso',
        description: `O usuário agora é ${newRole === 'admin' ? 'administrador' : 'usuário'}.`,
      });
    } catch (error) {
      toast({
        title: 'Erro ao atualizar role',
        description: 'Não foi possível atualizar o role do usuário.',
        variant: 'destructive',
      });
    } finally {
      setUpdatingRole(null);
    }
  };

  const getAuthToken = async (): Promise<string> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || '';
    } catch {
      return '';
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gerenciamento de Usuários
          </CardTitle>
          <CardDescription>Carregando lista de usuários...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span className="text-muted-foreground">Carregando usuários...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gerenciamento de Usuários
          </CardTitle>
          <CardDescription>
            Gerencie os usuários do sistema e defina suas permissões
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum usuário encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{user.name}</h4>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role === 'admin' ? (
                            <>
                              <Shield className="h-3 w-3 mr-1" />
                              Admin
                            </>
                          ) : (
                            <>
                              <User className="h-3 w-3 mr-1" />
                              User
                            </>
                          )}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(user.created_at)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Plano: {user.plan || 'free'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                    </span>
                    <Switch
                      checked={user.role === 'admin'}
                      onCheckedChange={(checked) => 
                        updateUserRole(user.id, checked ? 'admin' : 'user')
                      }
                      disabled={updatingRole === user.id}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Informações Importantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• <strong>Administradores</strong> têm acesso completo ao sistema, incluindo gerenciamento de usuários.</p>
            <p>• <strong>Usuários</strong> têm acesso limitado e não podem ver a aba de administração.</p>
            <p>• Use com cuidado ao promover usuários para administrador.</p>
            <p>• As alterações são aplicadas imediatamente.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}