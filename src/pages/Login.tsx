import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Shield, ArrowRight, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ClickDefenderLogo } from '@/assets/ClickDefenderLogo';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (email === 'usuario@clicksync.com' && password === 'Eli0701997*') {
        const offlineUser = { id: 'offline-1', email };
        localStorage.setItem('offlineUser', JSON.stringify(offlineUser));
        toast({
          title: 'Login realizado com sucesso!',
          description: 'Bem-vindo de volta!',
        });
        navigate('/');
        return;
      }
      throw new Error('Credenciais inválidas')
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: 'Erro no login',
        description: error instanceof Error ? error.message : 'Credenciais inválidas',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/10 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Welcome Section */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Bem-vindo de volta
          </h1>
          <p className="text-muted-foreground text-sm">
            Acesse sua conta para continuar protegendo seus cliques
          </p>
        </div>

        {/* Login Card */}
        <Card className="backdrop-blur-xl bg-background/90 border border-primary/20 shadow-2xl">
          <CardHeader className="space-y-1 pb-8">
            <div className="flex justify-center mb-4">
              <ClickDefenderLogo 
                size={80} 
                showText={true} 
                centered={true}
                scale={1.25}
              />
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-14 text-base bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-12 h-14 text-base bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-300"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-14 w-12 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  to="/recuperar-senha"
                  className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-14 text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Acessando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Acessar Painel
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <Separator className="bg-border/50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-background px-4 text-sm text-muted-foreground">
                  NÃO TEM CONTA?
                </span>
              </div>
            </div>

            {/* First Access Link */}
            <div className="text-center mb-4">
              <Link to="/primeiro-acesso">
                <Button
                  variant="outline"
                  className="w-full h-14 text-base border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                >
                  Criar nova conta
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-xs text-green-600 font-medium">
              Conexão segura SSL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
