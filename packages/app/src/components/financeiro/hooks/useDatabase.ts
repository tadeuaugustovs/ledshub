"use client"

import { useApi } from "@backstage/core-plugin-api"
import { discoveryApiRef } from "@backstage/core-plugin-api"
import { useState, useCallback } from "react"

// Generic type for database entities
export type Entity = {
  id: number
  [key: string]: any
}

// Type for API response
type ApiResponse<T> = {
  data?: T
  error?: string
  loading: boolean
}

export function useDatabase() {
  const discoveryApi = useApi(discoveryApiRef)
  const [loading, setLoading] = useState<boolean>(false)

  // Base URL for financeiro API
  const getBaseUrl = useCallback(async () => {
    const baseUrl = await discoveryApi.getBaseUrl("financeiro")
    return `${baseUrl}/api/financeiro`
  }, [discoveryApi])

  // Generic fetch function
  const fetchData = useCallback(async <T>(
    endpoint: string,
    method: string = 'GET',
    body?: any
  ): Promise<ApiResponse<T>> => {
    setLoading(true);
  try {
    const baseUrl = await getBaseUrl()
    const url = `${baseUrl}${endpoint}`

    const headers = {
      "Content-Type": "application/json",
    }

    const options: RequestInit = {
      method,
      headers,
    }

    if (body && (method === "POST" || method === "PUT")) {
      options.body = JSON.stringify(body)
    }

    const response = await fetch(url, options)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Erro na requisição")
    }

    const data = await response.json()
    return { data, loading: false }
  } catch (error: any) {
    console.error("Erro na requisição:", error)
    return { error: error.message, loading: false }
  } finally {
    setLoading(false)
  }
}
, [getBaseUrl])

// CRUD operations for bolsas
const getBolsas = useCallback(async () => {
  return fetchData<Entity[]>("/bolsas")
}, [fetchData])

const createBolsa = useCallback(
  async (bolsa: Omit<Entity, "id">) => {
    return fetchData<Entity>("/bolsas", "POST", bolsa)
  },
  [fetchData],
)

const updateBolsa = useCallback(
  async (id: number, bolsa: Partial<Entity>) => {
    return fetchData<Entity>(`/bolsas/${id}`, "PUT", bolsa)
  },
  [fetchData],
)

const deleteBolsa = useCallback(
  async (id: number) => {
    return fetchData<{ message: string }>(`/bolsas/${id}`, "DELETE")
  },
  [fetchData],
)

// CRUD operations for projetos
const getProjetos = useCallback(async () => {
  return fetchData<Entity[]>("/projetos")
}, [fetchData])

const createProjeto = useCallback(
  async (projeto: Omit<Entity, "id">) => {
    return fetchData<Entity>("/projetos", "POST", projeto)
  },
  [fetchData],
)

const updateProjeto = useCallback(
  async (id: number, projeto: Partial<Entity>) => {
    return fetchData<Entity>(`/projetos/${id}`, "PUT", projeto)
  },
  [fetchData],
)

const deleteProjeto = useCallback(
  async (id: number) => {
    return fetchData<{ message: string }>(`/projetos/${id}`, "DELETE")
  },
  [fetchData],
)

// CRUD operations for bolsistas
const getBolsistas = useCallback(async () => {
  return fetchData<Entity[]>("/bolsistas")
}, [fetchData])

const createBolsista = useCallback(
  async (bolsista: Omit<Entity, "id">) => {
    return fetchData<Entity>("/bolsistas", "POST", bolsista)
  },
  [fetchData],
)

const updateBolsista = useCallback(
  async (id: number, bolsista: Partial<Entity>) => {
    return fetchData<Entity>(`/bolsistas/${id}`, "PUT", bolsista)
  },
  [fetchData],
)

const deleteBolsista = useCallback(
  async (id: number) => {
    return fetchData<{ message: string }>(`/bolsistas/${id}`, "DELETE")
  },
  [fetchData],
)

// CRUD operations for compras-requisicoes
const getComprasRequisicoes = useCallback(async () => {
  return fetchData<Entity[]>("/compras-requisicoes")
}, [fetchData])

const createCompraRequisicao = useCallback(
  async (compraRequisicao: Omit<Entity, "id">) => {
    return fetchData<Entity>("/compras-requisicoes", "POST", compraRequisicao)
  },
  [fetchData],
)

const updateCompraRequisicao = useCallback(
  async (id: number, compraRequisicao: Partial<Entity>) => {
    return fetchData<Entity>(`/compras-requisicoes/${id}`, "PUT", compraRequisicao)
  },
  [fetchData],
)

const deleteCompraRequisicao = useCallback(
  async (id: number) => {
    return fetchData<{ message: string }>(`/compras-requisicoes/${id}`, "DELETE")
  },
  [fetchData],
)

// CRUD operations for contas-pagar
const getContasPagar = useCallback(async () => {
  return fetchData<Entity[]>("/contas-pagar")
}, [fetchData])

const createContaPagar = useCallback(
  async (contaPagar: Omit<Entity, "id">) => {
    return fetchData<Entity>("/contas-pagar", "POST", contaPagar)
  },
  [fetchData],
)

const updateContaPagar = useCallback(
  async (id: number, contaPagar: Partial<Entity>) => {
    return fetchData<Entity>(`/contas-pagar/${id}`, "PUT", contaPagar)
  },
  [fetchData],
)

const deleteContaPagar = useCallback(
  async (id: number) => {
    return fetchData<{ message: string }>(`/contas-pagar/${id}`, "DELETE")
  },
  [fetchData],
)

// CRUD operations for prestacao-contas
const getPrestacaoContas = useCallback(async () => {
  return fetchData<Entity[]>("/prestacao-contas")
}, [fetchData])

const createPrestacaoConta = useCallback(
  async (prestacaoConta: Omit<Entity, "id">) => {
    return fetchData<Entity>("/prestacao-contas", "POST", prestacaoConta)
  },
  [fetchData],
)

const updatePrestacaoConta = useCallback(
  async (id: number, prestacaoConta: Partial<Entity>) => {
    return fetchData<Entity>(`/prestacao-contas/${id}`, "PUT", prestacaoConta)
  },
  [fetchData],
)

const deletePrestacaoConta = useCallback(
  async (id: number) => {
    return fetchData<{ message: string }>(`/prestacao-contas/${id}`, "DELETE")
  },
  [fetchData],
)

return {
    loading,
    // Bolsas
    getBolsas,
    createBolsa,
    updateBolsa,
    deleteBolsa,
    // Projetos
    getProjetos,
    createProjeto,
    updateProjeto,
    deleteProjeto,
    // Bolsistas
    getBolsistas,
    createBolsista,
    updateBolsista,
    deleteBolsista,
    // Compras e Requisições
    getComprasRequisicoes,
    createCompraRequisicao,
    updateCompraRequisicao,
    deleteCompraRequisicao,
    // Contas a Pagar
    getContasPagar,
    createContaPagar,
    updateContaPagar,
    deleteContaPagar,
    // Prestação de Contas
    getPrestacaoContas,
    createPrestacaoConta,
    updatePrestacaoConta,
    deletePrestacaoConta,
  };
}
