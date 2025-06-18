"use client"

import { useState, useEffect, useCallback } from "react"
import { useDatabase, type Entity } from "./useDatabase"

// Type for the state of each entity
type EntityState<T> = {
  data: T[]
  loading: boolean
  error: string | null
}

// Initial state for entities
const initialState = {
  data: [],
  loading: false,
  error: null,
}

export function useFinanceiroData() {
  // Database hook
  const db = useDatabase()

  // State for each entity
  const [bolsas, setBolsas] = useState<EntityState<Entity>>(initialState)
  const [projetos, setProjetos] = useState<EntityState<Entity>>(initialState)
  const [bolsistas, setBolsistas] = useState<EntityState<Entity>>(initialState)
  const [comprasRequisicoes, setComprasRequisicoes] = useState<EntityState<Entity>>(initialState)
  const [contasPagar, setContasPagar] = useState<EntityState<Entity>>(initialState)
  const [prestacaoContas, setPrestacaoContas] = useState<EntityState<Entity>>(initialState)

  // Load bolsas
  const loadBolsas = useCallback(async () => {
    setBolsas((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const response = await db.getBolsas()
      if (response.error) {
        throw new Error(response.error)
      }
      setBolsas({ data: response.data || [], loading: false, error: null })
    } catch (error: any) {
      setBolsas((prev) => ({ ...prev, loading: false, error: error.message || "Erro desconhecido" }))
    }
  }, [db])

  // Load projetos
  const loadProjetos = useCallback(async () => {
    setProjetos((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const response = await db.getProjetos()
      if (response.error) {
        throw new Error(response.error)
      }
      setProjetos({ data: response.data || [], loading: false, error: null })
    } catch (error: any) {
      setProjetos((prev) => ({ ...prev, loading: false, error: error.message || "Erro desconhecido" }))
    }
  }, [db])

  // Load bolsistas
  const loadBolsistas = useCallback(async () => {
    setBolsistas((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const response = await db.getBolsistas()
      if (response.error) {
        throw new Error(response.error)
      }
      setBolsistas({ data: response.data || [], loading: false, error: null })
    } catch (error: any) {
      setBolsistas((prev) => ({ ...prev, loading: false, error: error.message || "Erro desconhecido" }))
    }
  }, [db])

  // Load compras e requisições
  const loadComprasRequisicoes = useCallback(async () => {
    setComprasRequisicoes((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const response = await db.getComprasRequisicoes()
      if (response.error) {
        throw new Error(response.error)
      }
      setComprasRequisicoes({ data: response.data || [], loading: false, error: null })
    } catch (error: any) {
      setComprasRequisicoes((prev) => ({ ...prev, loading: false, error: error.message || "Erro desconhecido" }))
    }
  }, [db])

  // Load contas a pagar
  const loadContasPagar = useCallback(async () => {
    setContasPagar((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const response = await db.getContasPagar()
      if (response.error) {
        throw new Error(response.error)
      }
      setContasPagar({ data: response.data || [], loading: false, error: null })
    } catch (error: any) {
      setContasPagar((prev) => ({ ...prev, loading: false, error: error.message || "Erro desconhecido" }))
    }
  }, [db])

  // Load prestação de contas
  const loadPrestacaoContas = useCallback(async () => {
    setPrestacaoContas((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const response = await db.getPrestacaoContas()
      if (response.error) {
        throw new Error(response.error)
      }
      setPrestacaoContas({ data: response.data || [], loading: false, error: null })
    } catch (error: any) {
      setPrestacaoContas((prev) => ({ ...prev, loading: false, error: error.message || "Erro desconhecido" }))
    }
  }, [db])

  // CRUD operations for bolsas
  const addBolsa = useCallback(
    async (bolsa: Omit<Entity, "id">) => {
      try {
        const response = await db.createBolsa(bolsa)
        if (response.error) {
          throw new Error(response.error)
        }
        await loadBolsas()
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error.message || "Erro desconhecido" }
      }
    },
    [db, loadBolsas],
  )

  const updateBolsa = useCallback(
    async (id: number, bolsa: Partial<Entity>) => {
      try {
        const response = await db.updateBolsa(id, bolsa)
        if (response.error) {
          throw new Error(response.error)
        }
        await loadBolsas()
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error.message || "Erro desconhecido" }
      }
    },
    [db, loadBolsas],
  )

  const deleteBolsa = useCallback(
    async (id: number) => {
      try {
        const response = await db.deleteBolsa(id)
        if (response.error) {
          throw new Error(response.error)
        }
        await loadBolsas()
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error.message || "Erro desconhecido" }
      }
    },
    [db, loadBolsas],
  )

  // CRUD operations for projetos
  const addProjeto = useCallback(
    async (projeto: Omit<Entity, "id">) => {
      try {
        const response = await db.createProjeto(projeto)
        if (response.error) {
          throw new Error(response.error)
        }
        await loadProjetos()
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error.message || "Erro desconhecido" }
      }
    },
    [db, loadProjetos],
  )

  const updateProjeto = useCallback(
    async (id: number, projeto: Partial<Entity>) => {
      try {
        const response = await db.updateProjeto(id, projeto)
        if (response.error) {
          throw new Error(response.error)
        }
        await loadProjetos()
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error.message || "Erro desconhecido" }
      }
    },
    [db, loadProjetos],
  )

  const deleteProjeto = useCallback(
    async (id: number) => {
      try {
        const response = await db.deleteProjeto(id)
        if (response.error) {
          throw new Error(response.error)
        }
        await loadProjetos()
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error.message || "Erro desconhecido" }
      }
    },
    [db, loadProjetos],
  )

  // CRUD operations for bolsistas
  const addBolsista = useCallback(
    async (bolsista: Omit<Entity, "id">) => {
      try {
        const response = await db.createBolsista(bolsista)
        if (response.error) {
          throw new Error(response.error)
        }
        await loadBolsistas()
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error.message || "Erro desconhecido" }
      }
    },
    [db, loadBolsistas],
  )

  const updateBolsista = useCallback(
    async (id: number, bolsista: Partial<Entity>) => {
      try {
        const response = await db.updateBolsista(id, bolsista)
        if (response.error) {
          throw new Error(response.error)
        }
        await loadBolsistas()
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error.message || "Erro desconhecido" }
      }
    },
    [db, loadBolsistas],
  )

  const deleteBolsista = useCallback(
    async (id: number) => {
      try {
        const response = await db.deleteBolsista(id)
        if (response.error) {
          throw new Error(response.error)
        }
        await loadBolsistas()
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error.message || "Erro desconhecido" }
      }
    },
    [db, loadBolsistas],
  )

  // CRUD operations for compras-requisicoes
  const addCompraRequisicao = useCallback(
    async (compraRequisicao: Omit<Entity, "id">) => {
      try {
        const response = await db.createCompraRequisicao(compraRequisicao)
        if (response.error) {
          throw new Error(response.error)
        }
        await loadComprasRequisicoes()
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error.message || "Erro desconhecido" }
      }
    },
    [db, loadComprasRequisicoes],
  )

  const updateCompraRequisicao = useCallback(
    async (id: number, compraRequisicao: Partial<Entity>) => {
      try {
        const response = await db.updateCompraRequisicao(id, compraRequisicao)
        if (response.error) {
          throw new Error(response.error)
        }
        await loadComprasRequisicoes()
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error.message || "Erro desconhecido" }
      }
    },
    [db, loadComprasRequisicoes],
  )

  const deleteCompraRequisicao = useCallback(
    async (id: number) => {
      try {
        const response = await db.deleteCompraRequisicao(id)
        if (response.error) {
          throw new Error(response.error)
        }
        await loadComprasRequisicoes()
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error.message || "Erro desconhecido" }
      }
    },
    [db, loadComprasRequisicoes],
  )

  // CRUD operations for contas-pagar
  const addContaPagar = useCallback(
    async (contaPagar: Omit<Entity, "id">) => {
      try {
        const response = await db.createContaPagar(contaPagar)
        if (response.error) {
          throw new Error(response.error)
        }
        await loadContasPagar()
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error.message || "Erro desconhecido" }
      }
    },
    [db, loadContasPagar],
  )

  const updateContaPagar = useCallback(
    async (id: number, contaPagar: Partial<Entity>) => {
      try {
        const response = await db.updateContaPagar(id, contaPagar)
        if (response.error) {
          throw new Error(response.error)
        }
        await loadContasPagar()
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error.message || "Erro desconhecido" }
      }
    },
    [db, loadContasPagar],
  )

  const deleteContaPagar = useCallback(
    async (id: number) => {
      try {
        const response = await db.deleteContaPagar(id)
        if (response.error) {
          throw new Error(response.error)
        }
        await loadContasPagar()
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error.message || "Erro desconhecido" }
      }
    },
    [db, loadContasPagar],
  )

  // CRUD operations for prestacao-contas
  const addPrestacaoConta = useCallback(
    async (prestacaoConta: Omit<Entity, "id">) => {
      try {
        const response = await db.createPrestacaoConta(prestacaoConta)
        if (response.error) {
          throw new Error(response.error)
        }
        await loadPrestacaoContas()
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error.message || "Erro desconhecido" }
      }
    },
    [db, loadPrestacaoContas],
  )

  const updatePrestacaoConta = useCallback(
    async (id: number, prestacaoConta: Partial<Entity>) => {
      try {
        const response = await db.updatePrestacaoConta(id, prestacaoConta)
        if (response.error) {
          throw new Error(response.error)
        }
        await loadPrestacaoContas()
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error.message || "Erro desconhecido" }
      }
    },
    [db, loadPrestacaoContas],
  )

  const deletePrestacaoConta = useCallback(
    async (id: number) => {
      try {
        const response = await db.deletePrestacaoConta(id)
        if (response.error) {
          throw new Error(response.error)
        }
        await loadPrestacaoContas()
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error.message || "Erro desconhecido" }
      }
    },
    [db, loadPrestacaoContas],
  )

  // Load all data on mount
  useEffect(() => {
    loadBolsas()
    loadProjetos()
    loadBolsistas()
    loadComprasRequisicoes()
    loadContasPagar()
    loadPrestacaoContas()
  }, [loadBolsas, loadProjetos, loadBolsistas, loadComprasRequisicoes, loadContasPagar, loadPrestacaoContas])

  return {
    // Data states
    bolsas,
    projetos,
    bolsistas,
    comprasRequisicoes,
    contasPagar,
    prestacaoContas,

    // Load functions
    loadBolsas,
    loadProjetos,
    loadBolsistas,
    loadComprasRequisicoes,
    loadContasPagar,
    loadPrestacaoContas,

    // CRUD operations for bolsas
    addBolsa,
    updateBolsa,
    deleteBolsa,

    // CRUD operations for projetos
    addProjeto,
    updateProjeto,
    deleteProjeto,

    // CRUD operations for bolsistas
    addBolsista,
    updateBolsista,
    deleteBolsista,

    // CRUD operations for compras-requisicoes
    addCompraRequisicao,
    updateCompraRequisicao,
    deleteCompraRequisicao,

    // CRUD operations for contas-pagar
    addContaPagar,
    updateContaPagar,
    deleteContaPagar,

    // CRUD operations for prestacao-contas
    addPrestacaoConta,
    updatePrestacaoConta,
    deletePrestacaoConta,
  }
}
