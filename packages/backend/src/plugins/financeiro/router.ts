import { Router, type Request, type Response } from "express"
import type { LoggerService } from "@backstage/backend-plugin-api"
import type { Pool } from "pg"
import type { JsonObject } from "@backstage/types"

export interface RouterOptions {
  database: any // Usando any para aceitar tanto DatabaseManager quanto DatabaseService
  logger?: LoggerService
}

export async function createRouter(options: RouterOptions): Promise<Router> {
  const { database, logger } = options

  // Get database client
  let pool: Pool

  try {
    // Tenta obter o cliente usando a API moderna
    if (typeof database.getClient === "function") {
      const client = await database.getClient()
      pool = client.get ? client.get() : client
    } else if (database.forPlugin) {
      // Tenta obter o cliente usando a API legada
      const dbClient = await database.forPlugin("financeiro").getClient()
      pool = dbClient.get()
    } else {
      throw new Error("Não foi possível obter o cliente de banco de dados")
    }
  } catch (error) {
    logger?.error("Erro ao obter cliente de banco de dados", error as JsonObject)
    throw error
  }

  const router = Router()

  // Middleware to handle errors
  const errorHandler = (fn: Function) => async (req: Request, res: Response, next: any) => {
    try {
      await fn(req, res, next)
    } catch (error) {
      logger?.error("Error processing request:", error as JsonObject)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  // Bolsas (Scholarships) Routes
  router.get(
    "/bolsas",
    errorHandler(async (_req: Request, res: Response) => {
      const result = await pool.query("SELECT * FROM bolsas ORDER BY id")
      res.json(result.rows)
      return
    }),
  )

  router.post(
    "/bolsas",
    errorHandler(async (req: Request, res: Response) => {
      const { nome, valor, ativo } = req.body
      const result = await pool.query("INSERT INTO bolsas (nome, valor, ativo) VALUES ($1, $2, $3) RETURNING *", [
        nome,
        valor,
        ativo ?? true,
      ])
      res.status(201).json(result.rows[0])
      return
    }),
  )

  router.put(
    "/bolsas/:id",
    errorHandler(async (req: Request, res: Response) => {
      const { id } = req.params
      const { nome, valor, ativo } = req.body
      const result = await pool.query("UPDATE bolsas SET nome = $1, valor = $2, ativo = $3 WHERE id = $4 RETURNING *", [
        nome,
        valor,
        ativo,
        id,
      ])

      if (result.rowCount === 0) {
        res.status(404).json({ error: "Bolsa não encontrada" })
        return
      }

      res.json(result.rows[0])
      return
    }),
  )

  router.delete(
    "/bolsas/:id",
    errorHandler(async (req: Request, res: Response) => {
      const { id } = req.params
      const result = await pool.query("DELETE FROM bolsas WHERE id = $1 RETURNING *", [id])

      if (result.rowCount === 0) {
        res.status(404).json({ error: "Bolsa não encontrada" })
        return
      }

      res.json({ message: "Bolsa removida com sucesso" })
      return
    }),
  )

  // Projetos (Projects) Routes
  router.get(
    "/projetos",
    errorHandler(async (_req: Request, res: Response) => {
      const result = await pool.query("SELECT * FROM projetos ORDER BY id")
      res.json(result.rows)
      return
    }),
  )

  router.post(
    "/projetos",
    errorHandler(async (req: Request, res: Response) => {
      const { nome, descricao } = req.body
      const result = await pool.query("INSERT INTO projetos (nome, descricao) VALUES ($1, $2) RETURNING *", [
        nome,
        descricao,
      ])
      res.status(201).json(result.rows[0])
      return
    }),
  )

  router.put(
    "/projetos/:id",
    errorHandler(async (req: Request, res: Response) => {
      const { id } = req.params
      const { nome, descricao } = req.body
      const result = await pool.query("UPDATE projetos SET nome = $1, descricao = $2 WHERE id = $3 RETURNING *", [
        nome,
        descricao,
        id,
      ])

      if (result.rowCount === 0) {
        res.status(404).json({ error: "Projeto não encontrado" })
        return
      }

      res.json(result.rows[0])
      return
    }),
  )

  router.delete(
    "/projetos/:id",
    errorHandler(async (req: Request, res: Response) => {
      const { id } = req.params
      const result = await pool.query("DELETE FROM projetos WHERE id = $1 RETURNING *", [id])

      if (result.rowCount === 0) {
        res.status(404).json({ error: "Projeto não encontrado" })
        return
      }

      res.json({ message: "Projeto removido com sucesso" })
      return
    }),
  )

  // Bolsistas (Scholarship Recipients) Routes
  router.get(
    "/bolsistas",
    errorHandler(async (_req: Request, res: Response) => {
      const result = await pool.query(`
      SELECT b.*, p.nome as projeto_nome, bo.nome as bolsa_nome 
      FROM bolsistas b
      LEFT JOIN projetos p ON b.projeto_id = p.id
      LEFT JOIN bolsas bo ON b.bolsa_id = bo.id
      ORDER BY b.id
    `)
      res.json(result.rows)
      return
    }),
  )

  router.post(
    "/bolsistas",
    errorHandler(async (req: Request, res: Response) => {
      const { nome, cpf, projeto_id, bolsa_id, ativo } = req.body
      const result = await pool.query(
        "INSERT INTO bolsistas (nome, cpf, projeto_id, bolsa_id, ativo) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [nome, cpf, projeto_id, bolsa_id, ativo ?? true],
      )
      res.status(201).json(result.rows[0])
      return
    }),
  )

  router.put(
    "/bolsistas/:id",
    errorHandler(async (req: Request, res: Response) => {
      const { id } = req.params
      const { nome, cpf, projeto_id, bolsa_id, ativo } = req.body
      const result = await pool.query(
        "UPDATE bolsistas SET nome = $1, cpf = $2, projeto_id = $3, bolsa_id = $4, ativo = $5 WHERE id = $6 RETURNING *",
        [nome, cpf, projeto_id, bolsa_id, ativo, id],
      )

      if (result.rowCount === 0) {
        res.status(404).json({ error: "Bolsista não encontrado" })
        return
      }

      res.json(result.rows[0])
      return
    }),
  )

  router.delete(
    "/bolsistas/:id",
    errorHandler(async (req: Request, res: Response) => {
      const { id } = req.params
      const result = await pool.query("DELETE FROM bolsistas WHERE id = $1 RETURNING *", [id])

      if (result.rowCount === 0) {
        res.status(404).json({ error: "Bolsista não encontrado" })
        return
      }

      res.json({ message: "Bolsista removido com sucesso" })
      return
    }),
  )

  // Compras e Requisições Routes
  router.get(
    "/compras-requisicoes",
    errorHandler(async (_req: Request, res: Response) => {
      const result = await pool.query("SELECT * FROM compras_requisicoes ORDER BY id")
      res.json(result.rows)
      return
    }),
  )

  router.post(
    "/compras-requisicoes",
    errorHandler(async (req: Request, res: Response) => {
      const { descricao, valor, status, data } = req.body
      const result = await pool.query(
        "INSERT INTO compras_requisicoes (descricao, valor, status, data) VALUES ($1, $2, $3, $4) RETURNING *",
        [descricao, valor, status, data],
      )
      res.status(201).json(result.rows[0])
      return
    }),
  )

  router.put(
    "/compras-requisicoes/:id",
    errorHandler(async (req: Request, res: Response) => {
      const { id } = req.params
      const { descricao, valor, status, data } = req.body
      const result = await pool.query(
        "UPDATE compras_requisicoes SET descricao = $1, valor = $2, status = $3, data = $4 WHERE id = $5 RETURNING *",
        [descricao, valor, status, data, id],
      )

      if (result.rowCount === 0) {
        res.status(404).json({ error: "Requisição não encontrada" })
        return
      }

      res.json(result.rows[0])
      return
    }),
  )

  router.delete(
    "/compras-requisicoes/:id",
    errorHandler(async (req: Request, res: Response) => {
      const { id } = req.params
      const result = await pool.query("DELETE FROM compras_requisicoes WHERE id = $1 RETURNING *", [id])

      if (result.rowCount === 0) {
        res.status(404).json({ error: "Requisição não encontrada" })
        return
      }

      res.json({ message: "Requisição removida com sucesso" })
      return
    }),
  )

  // Contas a Pagar Routes
  router.get(
    "/contas-pagar",
    errorHandler(async (_req: Request, res: Response) => {
      const result = await pool.query("SELECT * FROM contas_pagar ORDER BY id")
      res.json(result.rows)
      return
    }),
  )

  router.post(
    "/contas-pagar",
    errorHandler(async (req: Request, res: Response) => {
      const { descricao, valor, vencimento, pago } = req.body
      const result = await pool.query(
        "INSERT INTO contas_pagar (descricao, valor, vencimento, pago) VALUES ($1, $2, $3, $4) RETURNING *",
        [descricao, valor, vencimento, pago ?? false],
      )
      res.status(201).json(result.rows[0])
      return
    }),
  )

  router.put(
    "/contas-pagar/:id",
    errorHandler(async (req: Request, res: Response) => {
      const { id } = req.params
      const { descricao, valor, vencimento, pago } = req.body
      const result = await pool.query(
        "UPDATE contas_pagar SET descricao = $1, valor = $2, vencimento = $3, pago = $4 WHERE id = $5 RETURNING *",
        [descricao, valor, vencimento, pago, id],
      )

      if (result.rowCount === 0) {
        res.status(404).json({ error: "Conta não encontrada" })
        return
      }

      res.json(result.rows[0])
      return
    }),
  )

  router.delete(
    "/contas-pagar/:id",
    errorHandler(async (req: Request, res: Response) => {
      const { id } = req.params
      const result = await pool.query("DELETE FROM contas_pagar WHERE id = $1 RETURNING *", [id])

      if (result.rowCount === 0) {
        res.status(404).json({ error: "Conta não encontrada" })
        return
      }

      res.json({ message: "Conta removida com sucesso" })
      return
    }),
  )

  // Prestação de Contas Routes
  router.get(
    "/prestacao-contas",
    errorHandler(async (_req: Request, res: Response) => {
      const result = await pool.query("SELECT * FROM prestacao_contas ORDER BY id")
      res.json(result.rows)
      return
    }),
  )

  router.post(
    "/prestacao-contas",
    errorHandler(async (req: Request, res: Response) => {
      const { descricao, valor, data } = req.body
      const result = await pool.query(
        "INSERT INTO prestacao_contas (descricao, valor, data) VALUES ($1, $2, $3) RETURNING *",
        [descricao, valor, data],
      )
      res.status(201).json(result.rows[0])
      return
    }),
  )

  router.put(
    "/prestacao-contas/:id",
    errorHandler(async (req: Request, res: Response) => {
      const { id } = req.params
      const { descricao, valor, data } = req.body
      const result = await pool.query(
        "UPDATE prestacao_contas SET descricao = $1, valor = $2, data = $3 WHERE id = $4 RETURNING *",
        [descricao, valor, data, id],
      )

      if (result.rowCount === 0) {
        res.status(404).json({ error: "Prestação não encontrada" })
        return
      }

      res.json(result.rows[0])
      return
    }),
  )

  router.delete(
    "/prestacao-contas/:id",
    errorHandler(async (req: Request, res: Response) => {
      const { id } = req.params
      const result = await pool.query("DELETE FROM prestacao_contas WHERE id = $1 RETURNING *", [id])

      if (result.rowCount === 0) {
        res.status(404).json({ error: "Prestação não encontrada" })
        return
      }

      res.json({ message: "Prestação removida com sucesso" })
      return
    }),
  )

  return router
}
