import { createBackendModule } from "@backstage/backend-plugin-api"
import { createRouter } from "../../plugins/financeiro/router"
import { coreServices } from "@backstage/backend-plugin-api"

export const financeiroModule = createBackendModule({
  pluginId: "financeiro",
  moduleId: "financeiro",
  register(env) {
    env.registerInit({
      deps: {
        http: coreServices.httpRouter,
        database: coreServices.database,
        logger: coreServices.logger,
      },
      async init({ http, database, logger }) {
        const router = await createRouter({
          database,
          logger,
        })

        http.use(router)

      },
    })
  },
})
