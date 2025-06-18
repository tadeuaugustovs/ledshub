import type { PluginCacheManager } from "@backstage/backend-common"
import type { PluginDatabaseManager } from "@backstage/backend-common"
import type { Logger } from "winston"

export type PluginEnvironment = {
  logger: Logger
  database: PluginDatabaseManager
  cache: PluginCacheManager
}
