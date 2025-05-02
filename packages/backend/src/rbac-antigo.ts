import { createRouter } from '@backstage-community/plugin-rbac-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    database: env.database,
    discovery: env.discovery,
    identity: env.identity,
    config: env.config,
  });
}
