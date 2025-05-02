import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const rbacPlugin = createPlugin({
  id: 'rbac',
  routes: {
    root: rootRouteRef,
  },
});

export const RbacPage = rbacPlugin.provide(
  createRoutableExtension({
    name: 'RbacPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
