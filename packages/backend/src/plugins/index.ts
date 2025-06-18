import { errorHandler } from "@backstage/backend-common"
import express from "express"
import Router from "express-promise-router"
import { createRouter } from "./router"
import type { PluginEnvironment } from "../../types"

export default async function createPlugin(env: PluginEnvironment): Promise<express.Router> {
  const router = Router()
  router.use(express.json())

  router.use(
    await createRouter({
      logger: env.logger,
      database: env.database,
    }),
  )

  router.use(errorHandler())
  return router
}
