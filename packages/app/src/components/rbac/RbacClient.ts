import type { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';

// Tipos — você pode colocar isso em um types.ts se preferir
export type Role = {
  id: string;
  name: string;
  description: string;
};

export type NewRole = {
  name: string;
  description: string;
};

export type UpdateRole = {
  name?: string;
  description?: string;
};

// Implementação do client
export class RbacClient {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor(options: { discoveryApi: DiscoveryApi; fetchApi: FetchApi }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  private async getBaseUrl(): Promise<string> {
    return await this.discoveryApi.getBaseUrl('rbac');
  }

  // Lista todos os papéis
  async listRoles(): Promise<Role[]> {
    const baseUrl = await this.getBaseUrl();
    const response = await this.fetchApi.fetch(`${baseUrl}/roles`);
    if (!response.ok) {
      throw new Error('Erro ao listar papéis');
    }
    return await response.json();
  }

  // Cria um novo papel
  async createRole(role: NewRole): Promise<Role> {
    const baseUrl = await this.getBaseUrl();
    const response = await this.fetchApi.fetch(`${baseUrl}/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(role),
    });
    if (!response.ok) {
      throw new Error('Erro ao criar papel');
    }
    return await response.json();
  }

  // Atualiza um papel existente
  async updateRole(id: string, role: UpdateRole): Promise<Role> {
    const baseUrl = await this.getBaseUrl();
    const response = await this.fetchApi.fetch(`${baseUrl}/roles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(role),
    });
    if (!response.ok) {
      throw new Error('Erro ao atualizar papel');
    }
    return await response.json();
  }

  // Remove um papel
  async deleteRole(id: string): Promise<void> {
    const baseUrl = await this.getBaseUrl();
    const response = await this.fetchApi.fetch(`${baseUrl}/roles/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Erro ao excluir papel');
    }
  }
}
