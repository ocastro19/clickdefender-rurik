import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClickDefenderLogo } from '@/assets/ClickDefenderLogo';

export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulação de envio de email
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/10 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Welcome Section */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Recuperar Senha
          </h1>
          <p className="text-muted-foreground text-sm">
            Informe seu email para receber as instruções
          </p>
        </div>

        {/* Recovery Card */}
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
            {emailSent ? (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-foreground">
                    Enviamos as instruções para:
                  </p>
                  <p className="text-sm font-semibold text-primary">
                    {email}
                  </p>
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>Não recebeu o email?</p>
                  <p>Verifique sua pasta de spam ou lixo eletrônico</p>
                </div>
                <Button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Enviar novamente
                </Button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6">
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

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-14 text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Enviando...
                    </div>
                  ) : (
                    'Enviar instruções'
                  )}
                </Button>
              </form>
            )}

            {/* Back to Login */}
            <div className="mt-6 pt-4 border-t border-border/30">
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="w-full h-12 text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao login
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
              Processo seguro e criptografado
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}