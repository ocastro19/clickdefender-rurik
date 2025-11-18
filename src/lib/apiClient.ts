type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
}

export async function request<T = any>(_path: string, _options: RequestOptions = {}): Promise<T> {
  throw new Error('Backend desativado');
}

export const apiClient = {
  get: <T = any>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T = any>(path: string, body?: any) => request<T>(path, { method: 'POST', body }),
  put: <T = any>(path: string, body?: any) => request<T>(path, { method: 'PUT', body }),
  delete: <T = any>(path: string) => request<T>(path, { method: 'DELETE' }),
};

