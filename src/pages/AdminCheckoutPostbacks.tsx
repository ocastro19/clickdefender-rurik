import { useState, useEffect } from 'react';
import { useCheckoutPostbacks, CheckoutPostback, CreateCheckoutPostbackData } from '../hooks/useCheckoutPostbacks';
import { usePlatforms } from '../hooks/usePlatforms';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Trash2, Edit, Plus, TestTube, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCheckoutPostbacks() {
  const { postbacks, loading, error, fetchCheckoutPostbacks, createPostback, updatePostback, deletePostback, testPostback } = useCheckoutPostbacks();
  const { platforms, fetchPlatforms } = usePlatforms();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPostback, setEditingPostback] = useState<CheckoutPostback | null>(null);
  const [formData, setFormData] = useState<CreateCheckoutPostbackData>({
    platform_id: '',
    name: '',
    url: '',
    method: 'POST',
    headers: {},
    payload_template: '',
    status: 'active'
  });

  const [headerKey, setHeaderKey] = useState('');
  const [headerValue, setHeaderValue] = useState('');

  useEffect(() => {
    if (platforms.length > 0 && !formData.platform_id) {
      setFormData(prev => ({ ...prev, platform_id: platforms[0].id }));
    }
  }, [platforms, formData.platform_id]);

  // Carregar dados iniciais
  useEffect(() => {
    fetchPlatforms();
    fetchCheckoutPostbacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    try {
      const result = await createPostback(formData);
      if (result) {
        toast.success('Postback de checkout criado com sucesso!');
        setIsCreateModalOpen(false);
        resetForm();
      }
    } catch (err) {
      toast.error('Erro ao criar postback de checkout');
    }
  };

  const handleUpdate = async () => {
    if (!editingPostback) return;
    
    try {
      const result = await updatePostback(editingPostback.id, formData);
      if (result) {
        toast.success('Postback de checkout atualizado com sucesso!');
        setIsEditModalOpen(false);
        setEditingPostback(null);
        resetForm();
      }
    } catch (err) {
      toast.error('Erro ao atualizar postback de checkout');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este postback?')) return;
    
    try {
      const success = await deletePostback(id);
      if (success) {
        toast.success('Postback de checkout excluído com sucesso!');
      }
    } catch (err) {
      toast.error('Erro ao excluir postback de checkout');
    }
  };

  const handleTest = async (id: string) => {
    try {
      const result = await testPostback(id);
      if (result.success) {
        toast.success('Postback testado com sucesso!');
      } else {
        toast.error(`Erro ao testar postback: ${result.message}`);
      }
    } catch (err) {
      toast.error('Erro ao testar postback');
    }
  };

  const resetForm = () => {
    setFormData({
      platform_id: platforms[0]?.id || '',
      name: '',
      url: '',
      method: 'POST',
      headers: {},
      payload_template: '',
      status: 'active'
    });
    setHeaderKey('');
    setHeaderValue('');
  };

  const openEditModal = (postback: CheckoutPostback) => {
    setEditingPostback(postback);
    setFormData({
      platform_id: postback.platform_id,
      name: postback.name,
      url: postback.url,
      method: postback.method,
      headers: postback.headers,
      payload_template: postback.payload_template || '',
      status: postback.status
    });
    setIsEditModalOpen(true);
  };

  const addHeader = () => {
    if (!headerKey.trim() || !headerValue.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      headers: {
        ...prev.headers,
        [headerKey]: headerValue
      }
    }));
    setHeaderKey('');
    setHeaderValue('');
  };

  const removeHeader = (key: string) => {
    setFormData(prev => {
      const newHeaders = { ...prev.headers };
      delete newHeaders[key];
      return { ...prev, headers: newHeaders };
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('URL copiada para a área de transferência!');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Postbacks de Checkout</h1>
          <p className="text-muted-foreground">Gerencie os postbacks de checkout das plataformas</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Postback
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Postback de Checkout</DialogTitle>
              <DialogDescription>
                Configure um novo postback de checkout para uma plataforma
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platform">Plataforma</Label>
                  <Select
                    value={formData.platform_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, platform_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map(platform => (
                        <SelectItem key={platform.id} value={platform.id}>
                          {platform.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome do postback"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="url">URL</Label>
                <Textarea
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://exemplo.com/postback"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="method">Método</Label>
                  <Select
                    value={formData.method}
                    onValueChange={(value: 'GET' | 'POST' | 'PUT') => setFormData(prev => ({ ...prev, method: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="status"
                    checked={formData.status === 'active'}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, status: checked ? 'active' : 'inactive' }))}
                  />
                  <Label htmlFor="status">Ativo</Label>
                </div>
              </div>
              
              <div>
                <Label>Headers</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nome do header"
                      value={headerKey}
                      onChange={(e) => setHeaderKey(e.target.value)}
                    />
                    <Input
                      placeholder="Valor do header"
                      value={headerValue}
                      onChange={(e) => setHeaderValue(e.target.value)}
                    />
                    <Button type="button" onClick={addHeader} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {Object.entries(formData.headers || {}).map(([key, value]) => (
                    <div key={key} className="flex gap-2 items-center">
                      <span className="font-medium">{key}:</span>
                      <span className="text-sm text-muted-foreground flex-1">{value}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeHeader(key)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="payload_template">Template de Payload (JSON)</Label>
                <Textarea
                  id="payload_template"
                  value={formData.payload_template}
                  onChange={(e) => setFormData(prev => ({ ...prev, payload_template: e.target.value }))}
                  placeholder='{"key": "value"}'
                  rows={4}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreate} disabled={loading}>
                Criar Postback
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Postbacks de Checkout</CardTitle>
          <CardDescription>
            Lista de todos os postbacks de checkout configurados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Plataforma</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {postbacks.map((postback) => (
                <TableRow key={postback.id}>
                  <TableCell className="font-medium">{postback.name}</TableCell>
                  <TableCell>{postback.platforms?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{postback.method}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={postback.status === 'active' ? 'default' : 'secondary'}>
                      {postback.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground truncate max-w-xs">
                        {postback.url}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(postback.url)}
                        className="h-6 w-6"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(postback.url, '_blank')}
                        className="h-6 w-6"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleTest(postback.id)}
                        className="h-8 w-8"
                      >
                        <TestTube className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(postback)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(postback.id)}
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {postbacks.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum postback de checkout configurado ainda.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Postback de Checkout</DialogTitle>
            <DialogDescription>
              Atualize as configurações do postback de checkout
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-platform">Plataforma</Label>
                <Select
                  value={formData.platform_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, platform_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map(platform => (
                      <SelectItem key={platform.id} value={platform.id}>
                        {platform.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome do postback"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-url">URL</Label>
              <Textarea
                id="edit-url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://exemplo.com/postback"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-method">Método</Label>
                <Select
                  value={formData.method}
                  onValueChange={(value: 'GET' | 'POST' | 'PUT') => setFormData(prev => ({ ...prev, method: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-status"
                  checked={formData.status === 'active'}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, status: checked ? 'active' : 'inactive' }))}
                />
                <Label htmlFor="edit-status">Ativo</Label>
              </div>
            </div>
            
            <div>
              <Label>Headers</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nome do header"
                    value={headerKey}
                    onChange={(e) => setHeaderKey(e.target.value)}
                  />
                  <Input
                    placeholder="Valor do header"
                    value={headerValue}
                    onChange={(e) => setHeaderValue(e.target.value)}
                  />
                  <Button type="button" onClick={addHeader} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {Object.entries(formData.headers || {}).map(([key, value]) => (
                  <div key={key} className="flex gap-2 items-center">
                    <span className="font-medium">{key}:</span>
                    <span className="text-sm text-muted-foreground flex-1">{value}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeHeader(key)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-payload_template">Template de Payload (JSON)</Label>
              <Textarea
                id="edit-payload_template"
                value={formData.payload_template}
                onChange={(e) => setFormData(prev => ({ ...prev, payload_template: e.target.value }))}
                placeholder='{"key": "value"}'
                rows={4}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate} disabled={loading}>
              Atualizar Postback
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
