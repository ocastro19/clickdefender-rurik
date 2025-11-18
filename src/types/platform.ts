export interface Platform {
  id: string;
  name: string;
  postbackUrl: string;
  description?: string;
  parameters: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlatformRequest {
  name: string;
  postbackUrl: string;
  description?: string;
  parameters: string[];
  isActive?: boolean;
}

export interface UpdatePlatformRequest {
  name?: string;
  postbackUrl?: string;
  description?: string;
  parameters?: string[];
  isActive?: boolean;
}