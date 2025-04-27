import { Config } from '@backstage/config';
import { LoggerService } from '@backstage/backend-plugin-api';
import {
  DatabaseManager,
  TokenManager,
  UrlReader,
  CacheManager,
} from '@backstage/backend-common';
import { DiscoveryService, IdentityService } from '@backstage/plugin-auth-node';
import { TaskSchedulerService } from '@backstage/backend-tasks';

export type PluginEnvironment = {
  logger: LoggerService;
  database: DatabaseManager;
  cache: CacheManager;
  config: Config;
  discovery: DiscoveryService;
  tokenManager: TokenManager;
  reader: UrlReader;
  identity: IdentityService;
  scheduler: TaskSchedulerService;
};
