import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Shield, ArrowRight, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { ClickDefenderLogo } from '@/assets/ClickDefenderLogo';
export default function PrimeiroAcesso() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptNewsletter: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulação de registro
    setTimeout(() => {
      setIsLoading(false);
      console.log('Registration attempt:', formData);
    }, 2000);
  };
  return <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/10 flex items-center justify-center p-4">
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
            Criar Nova Conta
          </h1>
          <p className="text-muted-foreground text-sm">
            Junte-se à proteção contra cliques inválidos
          </p>
        </div>

        {/* Registration Card */}
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
            <form onSubmit={handleRegister} className="space-y-5">
              {/* Name Field */}
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-medium">
                  Nome completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input id="name" type="text" placeholder="Seu nome completo" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="pl-11 h-14 text-base bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-300" required />
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-sm font-medium">Celular</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input id="phone" type="tel" placeholder="(11) 99999-9999" value={formData.company} onChange={e => handleInputChange('company', e.target.value)} className="pl-11 h-14 text-base bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-300" required />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="pl-11 h-14 text-base bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-300" required />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Mínimo 8 caracteres" value={formData.password} onChange={e => handleInputChange('password', e.target.value)} className="pl-11 pr-12 h-14 text-base bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-300" required minLength={8} />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-14 w-12 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                  </Button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirmar senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Digite a senha novamente" value={formData.confirmPassword} onChange={e => handleInputChange('confirmPassword', e.target.value)} className="pl-11 pr-12 h-14 text-base bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-300" required />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-14 w-12 hover:bg-transparent" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                  </Button>
                </div>
              </div>

              {/* Terms and Newsletter */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start space-x-3">
                  <Checkbox id="terms" checked={formData.acceptTerms} onCheckedChange={checked => handleInputChange('acceptTerms', checked)} className="mt-1" required />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                    Aceito os{' '}
                    <Link to="/termos" className="text-primary hover:underline">
                      Termos de Uso
                    </Link>{' '}
                    e{' '}
                    <Link to="/privacidade" className="text-primary hover:underline">
                      Política de Privacidade
                    </Link>
                  </Label>
                </div>
              </div>

              {/* Register Button */}
              <Button type="submit" className="w-full h-14 text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" disabled={isLoading || !formData.acceptTerms}>
                {isLoading ? <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Criando conta...
                  </div> : <div className="flex items-center gap-2">
                    Criar conta
                    <ArrowRight className="h-5 w-5" />
                  </div>}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <Separator className="bg-border/50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-background px-4 text-xs text-muted-foreground">
                  JÁ TEM CONTA?
                </span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <Link to="/login">
                <Button variant="outline" className="w-full h-14 text-base border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
                  Fazer login
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
              Dados protegidos com criptografia SSL
            </span>
          </div>
        </div>
      </div>
    </div>;
}