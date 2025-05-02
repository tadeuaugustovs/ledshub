import { createApiRef } from '@backstage/core-plugin-api';

export interface RbacApi {
  getRoles(): Promise<any[]>;
}

export const rbacApiRef = createApiRef<RbacApi>({
  id: 'plugin.rbac.service',
});
