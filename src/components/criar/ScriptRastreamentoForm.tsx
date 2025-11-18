import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
interface ScriptRastreamentoFormProps {
  onBack: () => void;
}
const ScriptRastreamentoForm = ({
  onBack
}: ScriptRastreamentoFormProps) => {
  const platforms = [{
    value: "adcombo",
    label: "ADCOMBO"
  }, {
    value: "buygoods",
    label: "BUYGOODS"
  }, {
    value: "clickbank",
    label: "CLICKBANK"
  }, {
    value: "clicksadv",
    label: "CLICKSADV"
  }, {
    value: "digistore",
    label: "DIGISTORE"
  }, {
    value: "dr-cash",
    label: "DR.CASH"
  }, {
    value: "everflow",
    label: "EVERFLOW"
  }, {
    value: "gurumedia",
    label: "GURUMEDIA"
  }, {
    value: "lemonad",
    label: "LEMONAD"
  }, {
    value: "maxweb",
    label: "MAXWEB"
  }, {
    value: "mediascalers",
    label: "MEDIASCALERS"
  }, {
    value: "monetizze",
    label: "MONETIZZE"
  }, {
    value: "nutriprofits",
    label: "NUTRIPROFITS"
  }, {
    value: "smartadv",
    label: "SMARTADV"
  }, {
    value: "smashloud",
    label: "SMASHLOUD"
  }, {
    value: "terraleads",
    label: "TERRALEADS"
  }, {
    value: "trafficlight",
    label: "TRAFFICLIGHT"
  }, {
    value: "webvork",
    label: "WEBVORK"
  }];
  return <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Script de Rastreamento</h1>
          <p className="text-muted-foreground">
            Configure os scripts de rastreamento para sua campanha
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuração do Script</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para gerar seu script de rastreamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome-produto-script">Nome do Produto:</Label>
              <Input id="nome-produto-script" />
            </div>
            
          </div>

          <div className="grid grid-cols-2 gap-4">
            
            <div className="space-y-2">
              <Label htmlFor="plataforma-script">Plataforma:</Label>
              <Select>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Selecione a Plataforma..." />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {platforms.map(platform => <SelectItem key={platform.value} value={platform.value} className="hover:bg-muted">
                      {platform.label}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="label-conversao-script">Nome da Meta de Conversão:</Label>
            <Input id="label-conversao-script" />
            
          </div>

          <div className="flex justify-end pt-4">
            <Button size="lg">Criar script</Button>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default ScriptRastreamentoForm;