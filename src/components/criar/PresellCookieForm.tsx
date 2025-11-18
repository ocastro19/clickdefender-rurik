import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, ArrowLeft } from "lucide-react";

interface PresellCookieFormProps {
  onBack: () => void;
}

const PresellCookieForm = ({ onBack }: PresellCookieFormProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');

  const platforms = [
    { value: "adcombo", label: "ADCOMBO" },
    { value: "buygoods", label: "BUYGOODS" },
    { value: "clickbank", label: "CLICKBANK" },
    { value: "clicksadv", label: "CLICKSADV" },
    { value: "digistore", label: "DIGISTORE" },
    { value: "dr-cash", label: "DR.CASH" },
    { value: "everflow", label: "EVERFLOW" },
    { value: "gurumedia", label: "GURUMEDIA" },
    { value: "lemonad", label: "LEMONAD" },
    { value: "maxweb", label: "MAXWEB" },
    { value: "mediascalers", label: "MEDIASCALERS" },
    { value: "monetizze", label: "MONETIZZE" },
    { value: "nutriprofits", label: "NUTRIPROFITS" },
    { value: "smartadv", label: "SMARTADV" },
    { value: "smashloud", label: "SMASHLOUD" },
    { value: "terraleads", label: "TERRALEADS" },
    { value: "trafficlight", label: "TRAFFICLIGHT" },
    { value: "webvork", label: "WEBVORK" }
  ];

  const handlePlatformChange = (value: string) => {
    setSelectedPlatform(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Presell Cookie</h1>
          <p className="text-muted-foreground">
            Configure o presell de política de cookies para sua campanha
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuração do Presell</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para gerar seu presell de cookies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome-produto">Nome do Produto:</Label>
              <Input id="nome-produto" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-produto">Site do Produto:</Label>
              <Input id="site-produto" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="link-afiliado">Seu link de Afiliado:</Label>
              <Input 
                id="link-afiliado" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plataforma">Plataforma:</Label>
              <Select onValueChange={handlePlatformChange} value={selectedPlatform}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Selecione a Plataforma..." />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {platforms.map((platform) => (
                    <SelectItem 
                      key={platform.value} 
                      value={platform.value}
                      className="hover:bg-muted"
                    >
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta-conversao">Nome da Meta de Conversão:</Label>
            <Input id="meta-conversao" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titulo-presell">Título do presell:</Label>
              <Input id="titulo-presell" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="texto-botao">Texto do Botão:</Label>
              <Input id="texto-botao" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao-presell">Texto de Descrição:</Label>
            <Textarea 
              id="descricao-presell" 
              rows={4}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button size="lg">Criar presell</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PresellCookieForm;