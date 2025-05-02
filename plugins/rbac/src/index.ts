import { createPlugin } from '@backstage/core-plugin-api';
import { RbacPage } from './components/RbacPage';

export const rbacPlugin = createPlugin({
  id: 'rbac',
  routes: {
    root: RbacPage,
  },
});

export { RbacPage } from './plugin';


