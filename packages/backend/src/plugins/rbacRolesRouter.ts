import { Router } from 'express';
import { PluginEnvironment } from '../types';

/**
 * Cria o router que expõe as roles do RBAC via REST.
 */
export async function createRbacRolesRouter(
  env: PluginEnvironment
): Promise<Router> {
  const router = Router();

  // Lista estática por enquanto — vamos melhorar depois!
  const roles = [
    {
      name: 'rbac_admin',
      description: 'Administrador com todas as permissões',
      members: [] // No futuro podemos preencher com membros reais
    },
    {
      name: 'rbac_editor',
      description: 'Pode editar recursos, mas não gerenciar roles',
      members: []
    },
    {
      name: 'rbac_viewer',
      description: 'Somente leitura',
      members: []
    }
  ];

  router.get('/roles', async (_req, res) => {
    res.json({ roles });
  });

  return router;
}
