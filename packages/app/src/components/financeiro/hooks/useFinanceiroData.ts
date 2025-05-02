"use client"

import { useState, useEffect, useCallback } from "react"
import * as db from "./useDatabase"

// Tipos de dados
export interface ResumoFinanceiro {
  receitas: {
    total: number
    mensal: { [mes: string]: number }
    variacao: number
  }
  despesas: {
    total: number
    mensal: { [mes: string]: number }
    variacao: number
  }
  saldo: {
    total: number
    mensal: { [mes: string]: number }
    variacao: number
  }
}

export interface Bolsa {
  id: string
  nome: string
  valor: number
  sponsor: string
  quantidadeMembros: number
  isAtipico: boolean
}

export interface Bolsista {
  id: string
  nome: string
  vinculo: string
  funcao: string
  bolsaAtual: string
  historicoBolsas: {
    bolsaId: string
    nomeBolsa: string
    dataInicio: string
    dataFim: string | null
    valor: number
  }[]
}

export interface PrestacaoConta {
  id: string
  nome: string
  naturezaContabil: string
  vinculoJuridico: string
  valor: number
  justificativa: string
  data: string
  projetoId: string
}

export interface Projeto {
  id: string
  nome: string
  orcamentoGeral: number
  orcamentoBolsas: number
  equipe: string[]
  projetosSoftware: string[]
  gastosMensais: { [mes: string]: number }
  gastosAcumulados: { [mes: string]: number }
}

export interface ContaPagar {
  id: string
  titulo: string
  valor: number
  dataVencimento: string
  dataPagamento: string | null
  fornecedor: string
  categoria: string
  status: "paga" | "pendente" | "atrasada"
  projetoId: string
  comprovante?: string
}

export interface CompraRequisicao {
  id: string
  titulo: string
  descricao: string
  valor: number
  dataRequisicao: string
  dataAprovacao: string | null
  dataCompra: string | null
  solicitante: string
  aprovador: string | null
  status: "solicitada" | "aprovada" | "rejeitada" | "comprada" | "entregue"
  projetoId: string
  prioridade: "baixa" | "media" | "alta"
}

export interface FinanceiroData {
  resumoFinanceiro: ResumoFinanceiro
  bolsas: Bolsa[]
  bolsistas: Bolsista[]
  prestacaoContas: PrestacaoConta[]
  projetos: {
    conectafapes: Projeto
    agentes: Projeto
    outros: Projeto[]
  }
  contasPagar: ContaPagar[]
  comprasRequisicoes: CompraRequisicao[]
  // Adicionando informações de importação
  importInfo: {
    bolsas: { registros: number; memoria: number }
    bolsistas: { registros: number; memoria: number }
    prestacaoContas: { registros: number; memoria: number }
    projetos: { registros: number; memoria: number }
    contasPagar: { registros: number; memoria: number }
    comprasRequisicoes: { registros: number; memoria: number }
  }
}

// Dados iniciais para evitar valores nulos
const dadosIniciais: FinanceiroData = {
  resumoFinanceiro: {
    receitas: {
      total: 1250000,
      mensal: {
        Jan: 180000,
        Fev: 190000,
        Mar: 210000,
        Abr: 220000,
        Mai: 225000,
        Jun: 225000,
      },
      variacao: 2.3,
    },
    despesas: {
      total: 980000,
      mensal: {
        Jan: 150000,
        Fev: 160000,
        Mar: 165000,
        Abr: 170000,
        Mai: 165000,
        Jun: 170000,
      },
      variacao: 3.0,
    },
    saldo: {
      total: 270000,
      mensal: {
        Jan: 30000,
        Fev: 30000,
        Mar: 45000,
        Abr: 50000,
        Mai: 60000,
        Jun: 55000,
      },
      variacao: -8.3,
    },
  },
  bolsas: [
    { id: "b1", nome: "BPIG-V", valor: 2700, sponsor: "FAPES", quantidadeMembros: 5, isAtipico: true },
    { id: "b2", nome: "BPIG-IV", valor: 1500, sponsor: "FAPES", quantidadeMembros: 8, isAtipico: false },
    { id: "b3", nome: "BPIG-III", valor: 1100, sponsor: "FAPES", quantidadeMembros: 12, isAtipico: false },
    { id: "b4", nome: "BPIG-II", valor: 800, sponsor: "FAPES", quantidadeMembros: 15, isAtipico: false },
    { id: "b5", nome: "BPIG-I", valor: 500, sponsor: "FAPES", quantidadeMembros: 20, isAtipico: false },
    { id: "b6", nome: "Bolsa CNPq", valor: 1800, sponsor: "CNPq", quantidadeMembros: 3, isAtipico: false },
    { id: "b7", nome: "Bolsa CAPES", valor: 2200, sponsor: "CAPES", quantidadeMembros: 2, isAtipico: false },
  ],
  bolsistas: [
    {
      id: "bl1",
      nome: "João Silva",
      vinculo: "Graduação",
      funcao: "Desenvolvedor Frontend",
      bolsaAtual: "BPIG-III",
      historicoBolsas: [
        { bolsaId: "b3", nomeBolsa: "BPIG-III", dataInicio: "2023-01-15", dataFim: null, valor: 1100 },
        { bolsaId: "b4", nomeBolsa: "BPIG-II", dataInicio: "2022-06-01", dataFim: "2023-01-14", valor: 800 },
      ],
    },
    {
      id: "bl2",
      nome: "Maria Oliveira",
      vinculo: "Mestrado",
      funcao: "Pesquisadora",
      bolsaAtual: "BPIG-IV",
      historicoBolsas: [{ bolsaId: "b2", nomeBolsa: "BPIG-IV", dataInicio: "2022-08-01", dataFim: null, valor: 1500 }],
    },
    {
      id: "bl3",
      nome: "Pedro Santos",
      vinculo: "Doutorado",
      funcao: "Coordenador Técnico",
      bolsaAtual: "BPIG-V",
      historicoBolsas: [
        { bolsaId: "b1", nomeBolsa: "BPIG-V", dataInicio: "2022-03-01", dataFim: null, valor: 2700 },
        { bolsaId: "b2", nomeBolsa: "BPIG-IV", dataInicio: "2021-01-15", dataFim: "2022-02-28", valor: 1500 },
      ],
    },
  ],
  prestacaoContas: [
    {
      id: "pc1",
      nome: "Aquisição de Servidores",
      naturezaContabil: "Equipamento Permanente",
      vinculoJuridico: "Licitação",
      valor: 45000,
      justificativa: "Necessário para infraestrutura do projeto ConectaFapes",
      data: "2023-02-15",
      projetoId: "conectafapes",
    },
    {
      id: "pc2",
      nome: "Licenças de Software",
      naturezaContabil: "Serviço de TI",
      vinculoJuridico: "Contrato Direto",
      valor: 12000,
      justificativa: "Licenças para desenvolvimento do projeto AgentEs",
      data: "2023-03-10",
      projetoId: "agentes",
    },
    {
      id: "pc3",
      nome: "Material de Escritório",
      naturezaContabil: "Material de Consumo",
      vinculoJuridico: "Compra Direta",
      valor: 3500,
      justificativa: "Materiais para equipe administrativa",
      data: "2023-04-05",
      projetoId: "conectafapes",
    },
  ],
  projetos: {
    conectafapes: {
      id: "conectafapes",
      nome: "ConectaFapes",
      orcamentoGeral: 500000,
      orcamentoBolsas: 300000,
      equipe: ["Pedro Santos", "Maria Oliveira", "João Silva", "Ana Costa"],
      projetosSoftware: ["Portal de Bolsas", "Sistema de Gestão de Projetos", "API de Integração"],
      gastosMensais: {
        Jan: 35000,
        Fev: 42000,
        Mar: 38000,
        Abr: 45000,
        Mai: 40000,
        Jun: 43000,
      },
      gastosAcumulados: {
        Jan: 35000,
        Fev: 77000,
        Mar: 115000,
        Abr: 160000,
        Mai: 200000,
        Jun: 243000,
      },
    },
    agentes: {
      id: "agentes",
      nome: "AgentEs",
      orcamentoGeral: 350000,
      orcamentoBolsas: 200000,
      equipe: ["Lucas Ferreira", "Ana Costa", "Maria Oliveira"],
      projetosSoftware: ["Plataforma de Agentes Inteligentes", "Dashboard Analítico"],
      gastosMensais: {
        Jan: 25000,
        Fev: 28000,
        Mar: 30000,
        Abr: 32000,
        Mai: 35000,
        Jun: 33000,
      },
      gastosAcumulados: {
        Jan: 25000,
        Fev: 53000,
        Mar: 83000,
        Abr: 115000,
        Mai: 150000,
        Jun: 183000,
      },
    },
    outros: [],
  },
  contasPagar: [
    {
      id: "cp1",
      titulo: "Aluguel de Servidores",
      valor: 3500,
      dataVencimento: "2023-06-15",
      dataPagamento: "2023-06-10",
      fornecedor: "Amazon Web Services",
      categoria: "Infraestrutura",
      status: "paga",
      projetoId: "conectafapes",
    },
    {
      id: "cp2",
      titulo: "Licenças Microsoft",
      valor: 2800,
      dataVencimento: "2023-06-20",
      dataPagamento: null,
      fornecedor: "Microsoft",
      categoria: "Software",
      status: "pendente",
      projetoId: "agentes",
    },
    {
      id: "cp3",
      titulo: "Manutenção de Equipamentos",
      valor: 1200,
      dataVencimento: "2023-05-30",
      dataPagamento: null,
      fornecedor: "TechSupport Ltda",
      categoria: "Manutenção",
      status: "atrasada",
      projetoId: "conectafapes",
    },
  ],
  comprasRequisicoes: [
    {
      id: "cr1",
      titulo: "Notebooks para Equipe",
      descricao: "Aquisição de 5 notebooks para novos membros da equipe",
      valor: 25000,
      dataRequisicao: "2023-05-20",
      dataAprovacao: "2023-05-25",
      dataCompra: "2023-06-02",
      solicitante: "Pedro Santos",
      aprovador: "Diretor de TI",
      status: "entregue",
      projetoId: "conectafapes",
      prioridade: "alta",
    },
    {
      id: "cr2",
      titulo: "Licenças Adobe Creative Cloud",
      descricao: "Licenças para equipe de design",
      valor: 4800,
      dataRequisicao: "2023-06-01",
      dataAprovacao: "2023-06-05",
      dataCompra: null,
      solicitante: "Ana Costa",
      aprovador: "Coordenador de Projetos",
      status: "aprovada",
      projetoId: "agentes",
      prioridade: "media",
    },
    {
      id: "cr3",
      titulo: "Servidor de Alta Performance",
      descricao: "Servidor para processamento de dados do projeto AgentEs",
      valor: 18000,
      dataRequisicao: "2023-06-08",
      dataAprovacao: null,
      dataCompra: null,
      solicitante: "Lucas Ferreira",
      aprovador: null,
      status: "solicitada",
      projetoId: "agentes",
      prioridade: "alta",
    },
  ],
  importInfo: {
    bolsas: { registros: 7, memoria: 35 },
    bolsistas: { registros: 3, memoria: 15 },
    prestacaoContas: { registros: 3, memoria: 15 },
    projetos: { registros: 2, memoria: 10 },
    contasPagar: { registros: 3, memoria: 15 },
    comprasRequisicoes: { registros: 3, memoria: 15 },
  },
}

// Hook para carregar os dados do banco
export const useFinanceiroData = () => {
  // Modificar a interface para incluir os novos tipos de seção
  const [activeModal, setActiveModal] = useState<{
    type: "view" | "edit" | "add" | "delete"
    section: "bolsa" | "bolsista" | "prestacao" | "projeto" | "conta" | "compra"
    id: string | null
  } | null>(null)

  // Inicializar com dados mockados para evitar tela de carregamento
  const [data, setData] = useState<FinanceiroData>(dadosIniciais)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [dataLoaded, setDataLoaded] = useState(true)

  // Função para atualizar as informações de importação
  const updateImportInfo = (newData: Partial<FinanceiroData>) => {
    const importInfo = {
      bolsas: {
        registros: newData.bolsas?.length || data.bolsas.length,
        memoria: db.calcularUsoMemoria(newData.bolsas?.length || data.bolsas.length),
      },
      bolsistas: {
        registros: newData.bolsistas?.length || data.bolsistas.length,
        memoria: db.calcularUsoMemoria(newData.bolsistas?.length || data.bolsistas.length),
      },
      prestacaoContas: {
        registros: newData.prestacaoContas?.length || data.prestacaoContas.length,
        memoria: db.calcularUsoMemoria(newData.prestacaoContas?.length || data.prestacaoContas.length),
      },
      projetos: {
        registros: newData.projetos
          ? (newData.projetos.outros?.length || 0) + 2
          : // +2 para conectafapes e agentes
            data.projetos.outros.length + 2,
        memoria: db.calcularUsoMemoria(
          newData.projetos ? (newData.projetos.outros?.length || 0) + 2 : data.projetos.outros.length + 2,
        ),
      },
      contasPagar: {
        registros: newData.contasPagar?.length || data.contasPagar.length,
        memoria: db.calcularUsoMemoria(newData.contasPagar?.length || data.contasPagar.length),
      },
      comprasRequisicoes: {
        registros: newData.comprasRequisicoes?.length || data.comprasRequisicoes.length,
        memoria: db.calcularUsoMemoria(newData.comprasRequisicoes?.length || data.comprasRequisicoes.length),
      },
    }

    return importInfo
  }

  // Função para carregar todos os dados
  const loadData = useCallback(async () => {
    // Evitar recarregar se já estiver carregando
    if (isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      // Usar Promise.all para carregar dados em paralelo
      const [bolsas, bolsistas, prestacaoContas, projetosData, contasPagar, comprasRequisicoes] = await Promise.all([
        db.fetchBolsas(),
        db.fetchBolsistas(),
        db.fetchPrestacaoContas(),
        db.fetchProjetos(),
        db.fetchContasPagar(),
        db.fetchComprasRequisicoes(),
      ])

      // Separar projetos específicos
      let conectafapes = projetosData.find((p) => p.id === "conectafapes")
      let agentes = projetosData.find((p) => p.id === "agentes")
      const outros = projetosData.filter((p) => p.id !== "conectafapes" && p.id !== "agentes")

      // Garantir que os projetos principais existam
      if (!conectafapes) {
        conectafapes = dadosIniciais.projetos.conectafapes
      }

      if (!agentes) {
        agentes = dadosIniciais.projetos.agentes
      }

      // Calcular resumo financeiro
      const resumoFinanceiro = dadosIniciais.resumoFinanceiro

      // Montar objeto de dados
      const newData = {
        resumoFinanceiro,
        bolsas,
        bolsistas,
        prestacaoContas,
        projetos: {
          conectafapes,
          agentes,
          outros,
        },
        contasPagar,
        comprasRequisicoes,
        importInfo: {} as any,
      }

      // Atualizar informações de importação
      newData.importInfo = updateImportInfo(newData)

      setData(newData)
      setDataLoaded(true)
    } catch (err) {
      console.error("Erro ao carregar dados:", err)
      setError(err instanceof Error ? err : new Error("Erro desconhecido ao carregar dados"))
      // Não alterar os dados em caso de erro, manter os dados iniciais
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, data.projetos.outros.length])

  // Carregar dados apenas uma vez na inicialização
  useEffect(() => {
    // Não precisamos carregar dados, já temos os dados iniciais
    // loadData()
  }, [loadData])

  // Funções CRUD para Bolsas
  const addBolsa = async (bolsa: Omit<Bolsa, "id">): Promise<Bolsa> => {
    try {
      // Gerar ID único para a nova bolsa
      const newId = `b${Date.now()}`
      const newBolsa = { ...bolsa, id: newId }

      // Atualizar estado local imediatamente
      setData((prev) => {
        const newBolsas = [...prev.bolsas, newBolsa]
        return {
          ...prev,
          bolsas: newBolsas,
          importInfo: {
            ...prev.importInfo,
            bolsas: {
              registros: newBolsas.length,
              memoria: db.calcularUsoMemoria(newBolsas.length),
            },
          },
        }
      })

      // Simular chamada à API
      await db.insert("bolsas", bolsa)

      return newBolsa
    } catch (error) {
      console.error("Erro ao adicionar bolsa:", error)
      throw error
    }
  }

  const updateBolsa = async (id: string, bolsa: Partial<Bolsa>): Promise<Bolsa> => {
    try {
      // Atualizar estado local imediatamente
      let updatedBolsa: Bolsa | undefined

      setData((prev) => {
        const newBolsas = prev.bolsas.map((b) => {
          if (b.id === id) {
            updatedBolsa = { ...b, ...bolsa }
            return updatedBolsa
          }
          return b
        })

        return {
          ...prev,
          bolsas: newBolsas,
        }
      })

      // Simular chamada à API
      await db.update("bolsas", id, bolsa)

      if (!updatedBolsa) {
        throw new Error("Bolsa não encontrada")
      }

      return updatedBolsa
    } catch (error) {
      console.error("Erro ao atualizar bolsa:", error)
      throw error
    }
  }

  const deleteBolsa = async (id: string): Promise<boolean> => {
    try {
      // Atualizar estado local imediatamente
      setData((prev) => {
        const newBolsas = prev.bolsas.filter((b) => b.id !== id)
        return {
          ...prev,
          bolsas: newBolsas,
          importInfo: {
            ...prev.importInfo,
            bolsas: {
              registros: newBolsas.length,
              memoria: db.calcularUsoMemoria(newBolsas.length),
            },
          },
        }
      })

      // Simular chamada à API
      await db.remove("bolsas", id)

      return true
    } catch (error) {
      console.error("Erro ao excluir bolsa:", error)
      throw error
    }
  }

  // Funções CRUD para Bolsistas
  const addBolsista = async (bolsista: Omit<Bolsista, "id">): Promise<Bolsista> => {
    try {
      // Gerar ID único para o novo bolsista
      const newId = `bl${Date.now()}`
      const newBolsista = { ...bolsista, id: newId }

      // Atualizar estado local imediatamente
      setData((prev) => {
        const newBolsistas = [...prev.bolsistas, newBolsista]
        return {
          ...prev,
          bolsistas: newBolsistas,
          importInfo: {
            ...prev.importInfo,
            bolsistas: {
              registros: newBolsistas.length,
              memoria: db.calcularUsoMemoria(newBolsistas.length),
            },
          },
        }
      })

      // Simular chamada à API
      await db.insert("bolsistas", bolsista)

      return newBolsista
    } catch (error) {
      console.error("Erro ao adicionar bolsista:", error)
      throw error
    }
  }

  const updateBolsista = async (id: string, bolsista: Partial<Bolsista>): Promise<Bolsista> => {
    try {
      // Atualizar estado local imediatamente
      let updatedBolsista: Bolsista | undefined

      setData((prev) => {
        const newBolsistas = prev.bolsistas.map((b) => {
          if (b.id === id) {
            updatedBolsista = { ...b, ...bolsista }
            return updatedBolsista
          }
          return b
        })

        return {
          ...prev,
          bolsistas: newBolsistas,
        }
      })

      // Simular chamada à API
      await db.update("bolsistas", id, bolsista)

      if (!updatedBolsista) {
        throw new Error("Bolsista não encontrado")
      }

      return updatedBolsista
    } catch (error) {
      console.error("Erro ao atualizar bolsista:", error)
      throw error
    }
  }

  const deleteBolsista = async (id: string): Promise<boolean> => {
    try {
      // Atualizar estado local imediatamente
      setData((prev) => {
        const newBolsistas = prev.bolsistas.filter((b) => b.id !== id)
        return {
          ...prev,
          bolsistas: newBolsistas,
          importInfo: {
            ...prev.importInfo,
            bolsistas: {
              registros: newBolsistas.length,
              memoria: db.calcularUsoMemoria(newBolsistas.length),
            },
          },
        }
      })

      // Simular chamada à API
      await db.remove("bolsistas", id)

      return true
    } catch (error) {
      console.error("Erro ao excluir bolsista:", error)
      throw error
    }
  }

  // Funções CRUD para Prestação de Contas
  const addPrestacaoConta = async (prestacao: Omit<PrestacaoConta, "id">): Promise<PrestacaoConta> => {
    try {
      // Gerar ID único para a nova prestação
      const newId = `pc${Date.now()}`
      const newPrestacao = { ...prestacao, id: newId }

      // Atualizar estado local imediatamente
      setData((prev) => {
        const newPrestacoes = [...prev.prestacaoContas, newPrestacao]
        return {
          ...prev,
          prestacaoContas: newPrestacoes,
          importInfo: {
            ...prev.importInfo,
            prestacaoContas: {
              registros: newPrestacoes.length,
              memoria: db.calcularUsoMemoria(newPrestacoes.length),
            },
          },
        }
      })

      // Simular chamada à API
      await db.insert("prestacao_contas", prestacao)

      return newPrestacao
    } catch (error) {
      console.error("Erro ao adicionar prestação de contas:", error)
      throw error
    }
  }

  const updatePrestacaoConta = async (id: string, prestacao: Partial<PrestacaoConta>): Promise<PrestacaoConta> => {
    try {
      // Atualizar estado local imediatamente
      let updatedPrestacao: PrestacaoConta | undefined

      setData((prev) => {
        const newPrestacoes = prev.prestacaoContas.map((p) => {
          if (p.id === id) {
            updatedPrestacao = { ...p, ...prestacao }
            return updatedPrestacao
          }
          return p
        })

        return {
          ...prev,
          prestacaoContas: newPrestacoes,
        }
      })

      // Simular chamada à API
      await db.update("prestacao_contas", id, prestacao)

      if (!updatedPrestacao) {
        throw new Error("Prestação de contas não encontrada")
      }

      return updatedPrestacao
    } catch (error) {
      console.error("Erro ao atualizar prestação de contas:", error)
      throw error
    }
  }

  const deletePrestacaoConta = async (id: string): Promise<boolean> => {
    try {
      // Atualizar estado local imediatamente
      setData((prev) => {
        const newPrestacoes = prev.prestacaoContas.filter((p) => p.id !== id)
        return {
          ...prev,
          prestacaoContas: newPrestacoes,
          importInfo: {
            ...prev.importInfo,
            prestacaoContas: {
              registros: newPrestacoes.length,
              memoria: db.calcularUsoMemoria(newPrestacoes.length),
            },
          },
        }
      })

      // Simular chamada à API
      await db.remove("prestacao_contas", id)

      return true
    } catch (error) {
      console.error("Erro ao excluir prestação de contas:", error)
      throw error
    }
  }

  // Funções CRUD para Projetos
  const addProjeto = async (projeto: Omit<Projeto, "id">): Promise<Projeto> => {
    try {
      // Gerar ID único para o novo projeto
      const newId = `proj${Date.now()}`
      const newProjeto = { ...projeto, id: newId }

      // Atualizar estado local imediatamente
      setData((prev) => {
        const newOutros = [...prev.projetos.outros, newProjeto]
        return {
          ...prev,
          projetos: {
            ...prev.projetos,
            outros: newOutros,
          },
          importInfo: {
            ...prev.importInfo,
            projetos: {
              registros: newOutros.length + 2, // +2 para conectafapes e agentes
              memoria: db.calcularUsoMemoria(newOutros.length + 2),
            },
          },
        }
      })

      // Simular chamada à API
      await db.insert("projetos", projeto)

      return newProjeto
    } catch (error) {
      console.error("Erro ao adicionar projeto:", error)
      throw error
    }
  }

  const updateProjeto = async (id: string, projeto: Partial<Projeto>): Promise<Projeto> => {
    try {
      // Atualizar estado local imediatamente
      let updatedProjeto: Projeto | undefined

      setData((prev) => {
        const newProjetos = { ...prev.projetos }

        if (id === "conectafapes") {
          updatedProjeto = { ...newProjetos.conectafapes, ...projeto }
          newProjetos.conectafapes = updatedProjeto
        } else if (id === "agentes") {
          updatedProjeto = { ...newProjetos.agentes, ...projeto }
          newProjetos.agentes = updatedProjeto
        } else {
          newProjetos.outros = newProjetos.outros.map((p) => {
            if (p.id === id) {
              updatedProjeto = { ...p, ...projeto }
              return updatedProjeto
            }
            return p
          })
        }

        return {
          ...prev,
          projetos: newProjetos,
        }
      })

      // Simular chamada à API
      await db.update("projetos", id, projeto)

      if (!updatedProjeto) {
        throw new Error("Projeto não encontrado")
      }

      return updatedProjeto
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error)
      throw error
    }
  }

  const deleteProjeto = async (id: string): Promise<boolean> => {
    try {
      // Não permitir excluir os projetos principais
      if (id === "conectafapes" || id === "agentes") {
        throw new Error("Não é possível excluir projetos principais")
      }

      // Atualizar estado local imediatamente
      setData((prev) => {
        const newOutros = prev.projetos.outros.filter((p) => p.id !== id)
        return {
          ...prev,
          projetos: {
            ...prev.projetos,
            outros: newOutros,
          },
          importInfo: {
            ...prev.importInfo,
            projetos: {
              registros: newOutros.length + 2, // +2 para conectafapes e agentes
              memoria: db.calcularUsoMemoria(newOutros.length + 2),
            },
          },
        }
      })

      // Simular chamada à API
      await db.remove("projetos", id)

      return true
    } catch (error) {
      console.error("Erro ao excluir projeto:", error)
      throw error
    }
  }

  // Funções CRUD para Contas a Pagar
  const addContaPagar = async (conta: Omit<ContaPagar, "id">): Promise<ContaPagar> => {
    try {
      // Gerar ID único para a nova conta
      const newId = `cp${Date.now()}`
      const newConta = { ...conta, id: newId }

      // Atualizar estado local imediatamente
      setData((prev) => {
        const newContas = [...prev.contasPagar, newConta]
        return {
          ...prev,
          contasPagar: newContas,
          importInfo: {
            ...prev.importInfo,
            contasPagar: {
              registros: newContas.length,
              memoria: db.calcularUsoMemoria(newContas.length),
            },
          },
        }
      })

      // Simular chamada à API
      await db.insert("contas_pagar", conta)

      return newConta
    } catch (error) {
      console.error("Erro ao adicionar conta a pagar:", error)
      throw error
    }
  }

  const updateContaPagar = async (id: string, conta: Partial<ContaPagar>): Promise<ContaPagar> => {
    try {
      // Atualizar estado local imediatamente
      let updatedConta: ContaPagar | undefined

      setData((prev) => {
        const newContas = prev.contasPagar.map((c) => {
          if (c.id === id) {
            updatedConta = { ...c, ...conta }
            return updatedConta
          }
          return c
        })

        return {
          ...prev,
          contasPagar: newContas,
        }
      })

      // Simular chamada à API
      await db.update("contas_pagar", id, conta)

      if (!updatedConta) {
        throw new Error("Conta a pagar não encontrada")
      }

      return updatedConta
    } catch (error) {
      console.error("Erro ao atualizar conta a pagar:", error)
      throw error
    }
  }

  const deleteContaPagar = async (id: string): Promise<boolean> => {
    try {
      // Atualizar estado local imediatamente
      setData((prev) => {
        const newContas = prev.contasPagar.filter((c) => c.id !== id)
        return {
          ...prev,
          contasPagar: newContas,
          importInfo: {
            ...prev.importInfo,
            contasPagar: {
              registros: newContas.length,
              memoria: db.calcularUsoMemoria(newContas.length),
            },
          },
        }
      })

      // Simular chamada à API
      await db.remove("contas_pagar", id)

      return true
    } catch (error) {
      console.error("Erro ao excluir conta a pagar:", error)
      throw error
    }
  }

  // Funções CRUD para Compras e Requisições
  const addCompraRequisicao = async (compra: Omit<CompraRequisicao, "id">): Promise<CompraRequisicao> => {
    try {
      // Gerar ID único para a nova compra
      const newId = `cr${Date.now()}`
      const newCompra = { ...compra, id: newId }

      // Atualizar estado local imediatamente
      setData((prev) => {
        const newCompras = [...prev.comprasRequisicoes, newCompra]
        return {
          ...prev,
          comprasRequisicoes: newCompras,
          importInfo: {
            ...prev.importInfo,
            comprasRequisicoes: {
              registros: newCompras.length,
              memoria: db.calcularUsoMemoria(newCompras.length),
            },
          },
        }
      })

      // Simular chamada à API
      await db.insert("compras_requisicoes", compra)

      return newCompra
    } catch (error) {
      console.error("Erro ao adicionar compra/requisição:", error)
      throw error
    }
  }

  const updateCompraRequisicao = async (id: string, compra: Partial<CompraRequisicao>): Promise<CompraRequisicao> => {
    try {
      // Atualizar estado local imediatamente
      let updatedCompra: CompraRequisicao | undefined

      setData((prev) => {
        const newCompras = prev.comprasRequisicoes.map((c) => {
          if (c.id === id) {
            updatedCompra = { ...c, ...compra }
            return updatedCompra
          }
          return c
        })

        return {
          ...prev,
          comprasRequisicoes: newCompras,
        }
      })

      // Simular chamada à API
      await db.update("compras_requisicoes", id, compra)

      if (!updatedCompra) {
        throw new Error("Compra/requisição não encontrada")
      }

      return updatedCompra
    } catch (error) {
      console.error("Erro ao atualizar compra/requisição:", error)
      throw error
    }
  }

  const deleteCompraRequisicao = async (id: string): Promise<boolean> => {
    try {
      // Atualizar estado local imediatamente
      setData((prev) => {
        const newCompras = prev.comprasRequisicoes.filter((c) => c.id !== id)
        return {
          ...prev,
          comprasRequisicoes: newCompras,
          importInfo: {
            ...prev.importInfo,
            comprasRequisicoes: {
              registros: newCompras.length,
              memoria: db.calcularUsoMemoria(newCompras.length),
            },
          },
        }
      })

      // Simular chamada à API
      await db.remove("compras_requisicoes", id)

      return true
    } catch (error) {
      console.error("Erro ao excluir compra/requisição:", error)
      throw error
    }
  }

  // Função para recarregar todos os dados
  const refreshData = async () => {
    await loadData()
  }

  return {
    ...data,
    isLoading,
    error,
    dataLoaded,
    refreshData,
    addBolsa,
    updateBolsa,
    deleteBolsa,
    addBolsista,
    updateBolsista,
    deleteBolsista,
    addPrestacaoConta,
    updatePrestacaoConta,
    deletePrestacaoConta,
    addProjeto,
    updateProjeto,
    deleteProjeto,
    addContaPagar,
    updateContaPagar,
    deleteContaPagar,
    addCompraRequisicao,
    updateCompraRequisicao,
    deleteCompraRequisicao,
    activeModal,
    setActiveModal,
  }
}
