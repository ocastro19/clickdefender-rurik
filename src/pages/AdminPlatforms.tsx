import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { usePlatforms } from '@/hooks/usePlatforms';
import { Platform, CreatePlatformRequest, UpdatePlatformRequest } from '@/types/platform';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminPlatforms() {
  const { platforms, loading, fetchPlatforms, createPlatform, updatePlatform, deletePlatform } = usePlatforms();
  const { toast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [formData, setFormData] = useState<CreatePlatformRequest>({
    name: '',
    postbackUrl: '',
    description: '',
    parameters: [],
    isActive: true
  });
  const [parameterInput, setParameterInput] = useState('');

  useEffect(() => {
    fetchPlatforms();
  }, [fetchPlatforms]);

  const handleOpenModal = (platform?: Platform) => {
    if (platform) {
      setSelectedPlatform(platform);
      setFormData({
        name: platform.name,
        postbackUrl: platform.postbackUrl,
        description: platform.description || '',
        parameters: platform.parameters,
        isActive: platform.isActive
      });
    } else {
      setSelectedPlatform(null);
      setFormData({
        name: '',
        postbackUrl: '',
        description: '',
        parameters: [],
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlatform(null);
    setFormData({
      name: '',
      postbackUrl: '',
      description: '',
      parameters: [],
      isActive: true
    });
    setParameterInput('');
  };

  const handleAddParameter = () => {
    if (parameterInput.trim() && !formData.parameters.includes(parameterInput.trim())) {
      setFormData(prev => ({
        ...prev,
        parameters: [...prev.parameters, parameterInput.trim()]
      }));
      setParameterInput('');
    }
  };

  const handleRemoveParameter = (parameter: string) => {
    setFormData(prev => ({
      ...prev,
      parameters: prev.parameters.filter(p => p !== parameter)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedPlatform) {
        await updatePlatform(selectedPlatform.id, formData);
      } else {
        await createPlatform(formData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar plataforma:', error);
    }
  };

  const handleDeleteClick = (platform: Platform) => {
    setSelectedPlatform(platform);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedPlatform) {
      try {
        await deletePlatform(selectedPlatform.id);
        setIsDeleteDialogOpen(false);
        setSelectedPlatform(null);
      } catch (error) {
        console.error('Erro ao deletar plataforma:', error);
      }
    }
  };

  const handleTestUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Administração de Plataformas</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os postbacks das plataformas de afiliados
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Plataforma
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>URL do Postback</TableHead>
              <TableHead>Parâmetros</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : platforms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Nenhuma plataforma cadastrada
                </TableCell>
              </TableRow>
            ) : (
              platforms.map((platform) => (
                <TableRow key={platform.id}>
                  <TableCell className="font-medium">{platform.name}</TableCell>
                  <TableCell className="max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm">{platform.postbackUrl}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTestUrl(platform.postbackUrl)}
                        className="h-6 w-6 p-0"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {platform.parameters.slice(0, 3).map((param) => (
                        <Badge key={param} variant="outline" className="text-xs">
                          {param}
                        </Badge>
                      ))}
                      {platform.parameters.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{platform.parameters.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={platform.isActive ? "default" : "secondary"}>
                      {platform.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal(platform)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(platform)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal de Criação/Edição */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedPlatform ? 'Editar Plataforma' : 'Nova Plataforma'}
            </DialogTitle>
            <DialogDescription>
              {selectedPlatform 
                ? 'Edite as informações da plataforma' 
                : 'Adicione uma nova plataforma de postback'
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome da Plataforma</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: ADCOMBO"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="postbackUrl">URL do Postback</Label>
                <Textarea
                  id="postbackUrl"
                  value={formData.postbackUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, postbackUrl: e.target.value }))}
                  placeholder="https://clickdefender.pro/postback-plataformas/..."
                  rows={3}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Use placeholders como {'{codigousuario}'}, {'{trans_id}'}, etc.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição da plataforma..."
                  rows={2}
                />
              </div>

              <div className="grid gap-2">
                <Label>Parâmetros</Label>
                <div className="flex gap-2">
                  <Input
                    value={parameterInput}
                    onChange={(e) => setParameterInput(e.target.value)}
                    placeholder="Ex: codigousuario"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddParameter())}
                  />
                  <Button type="button" onClick={handleAddParameter} variant="outline">
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.parameters.map((param) => (
                    <Badge key={param} variant="secondary" className="gap-1">
                      {param}
                      <button
                        type="button"
                        onClick={() => handleRemoveParameter(param)}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Plataforma Ativa</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button type="submit">
                {selectedPlatform ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a plataforma "{selectedPlatform?.name}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}