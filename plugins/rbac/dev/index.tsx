import { createDevApp } from '@backstage/dev-utils';
import { rbacPlugin, RbacPage } from '../src/plugin';

createDevApp()
  .registerPlugin(rbacPlugin)
  .addPage({
    element: <RbacPage />,
    title: 'Root Page',
    path: '/rbac',
  })
  .render();
