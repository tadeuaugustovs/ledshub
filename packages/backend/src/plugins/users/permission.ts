import { createRouter } from '@backstage/plugin-permission-backend';
import { AuthorizeResult, PolicyDecision, PermissionPolicy } from '@backstage/plugin-permission-common';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

// Simples controle de permissões baseado em grupos
const rolePermissions: Record<string, string[]> = {
  'admin': ['catalog-entity-create', 'catalog-entity-read', 'catalog-entity-update'],
  'user': ['catalog-entity-read'],
};

class RBACLitePolicy implements PermissionPolicy {
  async handle(request: { permission: { name: string }, resourceRef?: string, token?: string }): Promise<PolicyDecision> {
    const user = request.token?.claims?.sub || '';
    const groups = request.token?.claims?.groups || [];

    // Se o usuário é do grupo 'admin', libera tudo
    if (groups.includes('admin')) {
      return { result: AuthorizeResult.ALLOW };
    }

    // Verifica se as permissões do grupo incluem a permissão solicitada
    const allowed = groups.some(group => rolePermissions[group]?.includes(request.permission.name));

    if (allowed) {
      return { result: AuthorizeResult.ALLOW };
    }

    return { result: AuthorizeResult.DENY };
  }
}

export default async function createPlugin(env: PluginEnvironment): Promise<Router> {
  return createRouter({
    config: env.config,
    logger: env.logger,
    discovery: env.discovery,
    policy: new RBACLitePolicy(),
    identity: env.identity,
  });
}
