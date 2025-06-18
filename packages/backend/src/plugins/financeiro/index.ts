import { createServiceBuilder } from "@backstage/backend-common"
import type { Logger } from "winston"
import type { Router } from "express"
import { createRouter } from "./router"
import type { PluginEnvironment } from "../../types"

export interface ServerOptions {
  port: number
  enableCors: boolean
  logger: Logger
  database?: any // Adicionamos o database como opcional
}

export async function startStandaloneServer(options: ServerOptions): Promise<any> {
  const logger = options.logger.child({ service: "financeiro-backend" })
  logger.debug("Starting financeiro backend")

  const router = await createRouter({
    logger,
    database: options.database, // Agora é opcional
  })

  let service = createServiceBuilder(module).setPort(options.port).addRouter("/api/financeiro", router)

  if (options.enableCors) {
    service = service.enableCors({ origin: "*" })
  }

  return await service.start().catch((err) => {
    logger.error(err)
    process.exit(1)
  })
}

export default async function createPlugin(env: PluginEnvironment): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    database: env.database,
  })
}
