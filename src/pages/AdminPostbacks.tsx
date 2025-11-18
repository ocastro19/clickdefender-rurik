import { useState, useEffect } from 'react';
import { usePostbacks, Postback, CreatePostbackData } from '../hooks/usePostbacks';
import { usePlatforms } from '../hooks/usePlatforms';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, TestTube, ExternalLink } from 'lucide-react';

export default function AdminPostbacks() {
  const { postbacks, loading, error, fetchPostbacks, createPostback, updatePostback, deletePostback, testPostback } = usePostbacks();
  const { platforms, loading: platformsLoading } = usePlatforms();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPostback, setEditingPostback] = useState<Postback | null>(null);
  const [formData, setFormData] = useState<CreatePostbackData>({
    platformId: '',
    name: '',
    url: '',
    method: 'POST',
    headers: {},
    payloadTemplate: '',
    status: 'active',
  });

  useEffect(() => {
    fetchPostbacks();
  }, [fetchPostbacks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPostback) {
        await updatePostback(editingPostback.id, formData);
        toast.success('Postback atualizado com sucesso!');
      } else {
        await createPostback(formData);
        toast.success('Postback criado com sucesso!');
      }
      
      setIsModalOpen(false);
      setEditingPostback(null);
      resetForm();
      await fetchPostbacks();
    } catch (err) {
      toast.error(editingPostback ? 'Erro ao atualizar postback' : 'Erro ao criar postback');
    }
  };

  const handleEdit = (postback: Postback) => {
    setEditingPostback(postback);
    setFormData({
      platformId: postback.platformId,
      name: postback.name,
      url: postback.url,
      method: postback.method,
      headers: postback.headers,
      payloadTemplate: postback.payloadTemplate || '',
      status: postback.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este postback?')) {
      try {
        await deletePostback(id);
        toast.success('Postback deletado com sucesso!');
      } catch (err) {
        toast.error('Erro ao deletar postback');
      }
    }
  };

  const handleTest = async (postback: Postback) => {
    try {
      const testData = {
        event: 'conversion',
        clickId: 'test-click-123',
        conversionValue: 100.00,
        timestamp: new Date().toISOString(),
      };
      
      const result = await testPostback(postback.id, testData);
      toast.success('Teste de postback realizado com sucesso!');
      console.log('Resultado do teste:', result);
    } catch (err) {
      toast.error('Erro ao testar postback');
    }
  };

  const resetForm = () => {
    setFormData({
      platformId: '',
      name: '',
      url: '',
      method: 'POST',
      headers: {},
      payloadTemplate: '',
      status: 'active',
    });
  };

  const openModal = () => {
    setEditingPostback(null);
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPostback(null);
    resetForm();
  };

  const headersString = JSON.stringify(formData.headers, null, 2);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Erro ao carregar postbacks: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Postbacks</h1>
        <Button onClick={openModal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Postback
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {postbacks.map((postback) => (
          <Card key={postback.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{postback.name}</h3>
                <p className="text-sm text-gray-600">{postback.platformName}</p>
              </div>
              <Badge variant={postback.status === 'active' ? 'success' : 'secondary'}>
                {postback.status === 'active' ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-700 mr-2">Método:</span>
                <Badge variant="outline">{postback.method}</Badge>
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-700">URL:</span>
                <p className="text-gray-600 truncate">{postback.url}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTest(postback)}
                className="flex items-center gap-1"
              >
                <TestTube className="h-3 w-3" />
                Testar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(postback)}
                className="flex items-center gap-1"
              >
                <Edit2 className="h-3 w-3" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(postback.id)}
                className="flex items-center gap-1 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
                Deletar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {postbacks.length === 0 && (
        <div className="text-center py-12">
          <ExternalLink className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum postback encontrado</h3>
          <p className="text-gray-600 mb-4">Crie seu primeiro postback para começar.</p>
          <Button onClick={openModal}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Postback
          </Button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingPostback ? 'Editar Postback' : 'Criar Postback'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="platformId">Plataforma *</Label>
                  <Select
                    id="platformId"
                    value={formData.platformId}
                    onChange={(e) => setFormData({ ...formData, platformId: e.target.value })}
                    required
                    disabled={platformsLoading}
                  >
                    <option value="">Selecione uma plataforma</option>
                    {platforms.map((platform) => (
                      <option key={platform.id} value={platform.id}>
                        {platform.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Ex: Postback de Conversão"
                  />
                </div>

                <div>
                  <Label htmlFor="url">URL *</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    required
                    placeholder="https://exemplo.com/postback"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="method">Método</Label>
                    <Select
                      id="method"
                      value={formData.method}
                      onChange={(e) => setFormData({ ...formData, method: e.target.value as 'GET' | 'POST' | 'PUT' })}
                    >
                      <option value="POST">POST</option>
                      <option value="GET">GET</option>
                      <option value="PUT">PUT</option>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    >
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="headers">Headers (JSON)</Label>
                  <Textarea
                    id="headers"
                    value={headersString}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setFormData({ ...formData, headers: parsed });
                      } catch {
                        // Ignora JSON inválido temporariamente
                      }
                    }}
                    placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
                    rows={3}
                    className="font-mono text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="payloadTemplate">Template do Payload</Label>
                  <Textarea
                    id="payloadTemplate"
                    value={formData.payloadTemplate}
                    onChange={(e) => setFormData({ ...formData, payloadTemplate: e.target.value })}
                    placeholder="Template para o corpo da requisição..."
                    rows={4}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use variáveis como {clickId}, {conversionValue}, etc.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingPostback ? 'Atualizar' : 'Criar'}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}