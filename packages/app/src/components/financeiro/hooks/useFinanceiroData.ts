"use client"

import { useState, useEffect } from "react"

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
}

// Hook para simular os dados
export const useFinanceiroData = (): FinanceiroData => {
  const [data, setData] = useState<FinanceiroData>({
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
        historicoBolsas: [
          { bolsaId: "b2", nomeBolsa: "BPIG-IV", dataInicio: "2022-08-01", dataFim: null, valor: 1500 },
        ],
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
      {
        id: "bl4",
        nome: "Ana Costa",
        vinculo: "Graduação",
        funcao: "Desenvolvedora Backend",
        bolsaAtual: "BPIG-III",
        historicoBolsas: [
          { bolsaId: "b3", nomeBolsa: "BPIG-III", dataInicio: "2023-02-01", dataFim: null, valor: 1100 },
        ],
      },
      {
        id: "bl5",
        nome: "Lucas Ferreira",
        vinculo: "Mestrado",
        funcao: "Cientista de Dados",
        bolsaAtual: "Bolsa CNPq",
        historicoBolsas: [
          { bolsaId: "b6", nomeBolsa: "Bolsa CNPq", dataInicio: "2022-09-01", dataFim: null, valor: 1800 },
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
      {
        id: "pc4",
        nome: "Participação em Congresso",
        naturezaContabil: "Diárias e Passagens",
        vinculoJuridico: "Pagamento Direto",
        valor: 8500,
        justificativa: "Apresentação de resultados do projeto AgentEs",
        data: "2023-05-20",
        projetoId: "agentes",
      },
      {
        id: "pc5",
        nome: "Contratação de Consultoria",
        naturezaContabil: "Serviço de Pessoa Jurídica",
        vinculoJuridico: "Contrato",
        valor: 25000,
        justificativa: "Consultoria especializada para o projeto ConectaFapes",
        data: "2023-06-12",
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
      {
        id: "cp4",
        titulo: "Consultoria Especializada",
        valor: 5000,
        dataVencimento: "2023-06-25",
        dataPagamento: null,
        fornecedor: "Consultec",
        categoria: "Serviços",
        status: "pendente",
        projetoId: "agentes",
      },
      {
        id: "cp5",
        titulo: "Material de Escritório",
        valor: 800,
        dataVencimento: "2023-06-05",
        dataPagamento: "2023-06-03",
        fornecedor: "Papelaria Central",
        categoria: "Material de Consumo",
        status: "paga",
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
      {
        id: "cr4",
        titulo: "Material para Eventos",
        descricao: "Banners, folders e brindes para evento de lançamento",
        valor: 3500,
        dataRequisicao: "2023-05-15",
        dataAprovacao: "2023-05-18",
        dataCompra: "2023-05-25",
        solicitante: "Maria Oliveira",
        aprovador: "Diretor de Marketing",
        status: "entregue",
        projetoId: "conectafapes",
        prioridade: "media",
      },
      {
        id: "cr5",
        titulo: "Assinatura de API Externa",
        descricao: "Acesso a API de dados para o projeto",
        valor: 1200,
        dataRequisicao: "2023-06-10",
        dataAprovacao: null,
        dataCompra: null,
        solicitante: "João Silva",
        aprovador: null,
        status: "solicitada",
        projetoId: "conectafapes",
        prioridade: "baixa",
      },
    ],
  })

  // Simular carregamento de dados
  useEffect(() => {
    // Aqui poderia ter uma chamada de API real
    const timer = setTimeout(() => {
      // Dados já estão carregados no estado inicial
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return data
}
