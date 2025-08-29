// Serviço de conexão com o banco de dados Neon
// Implementação segura para ambiente Backstage

// Interface para operações de banco de dados
interface DatabaseService {
    executeQuery: (query: string, params?: any[]) => Promise<any[]>
    fetchAll: (table: string) => Promise<any[]>
    fetchById: (table: string, id: string) => Promise<any>
    insert: (table: string, data: Record<string, any>) => Promise<any>
    update: (table: string, id: string, data: Record<string, any>) => Promise<any>
    remove: (table: string, id: string) => Promise<boolean>
  }
  
  // Implementação do serviço de banco de dados
  class NeonDatabaseService implements DatabaseService {
    // Função para executar consultas SQL
    async executeQuery(query: string, params: any[] = []): Promise<any[]> {
      try {
        // Simulação de chamada à API REST para o backend
        console.log(`Executando query: ${query} com parâmetros:`, params)
  
        // Não simular tempo de resposta para evitar problemas de carregamento
        return []
      } catch (error) {
        console.error("Erro ao executar consulta:", error)
        throw error
      }
    }
  
    // Funções genéricas para operações CRUD
    async fetchAll(table: string): Promise<any[]> {
      const query = `SELECT * FROM ${table}`
      return this.executeQuery(query)
    }
  
    async fetchById(table: string, id: string): Promise<any> {
      const query = `SELECT * FROM ${table} WHERE id = $1`
      const results = await this.executeQuery(query, [id])
      return results.length > 0 ? results[0] : null
    }
  
    async insert(table: string, data: Record<string, any>): Promise<any> {
      const columns = Object.keys(data).join(", ")
      const placeholders = Object.keys(data)
        .map((_, index) => `$${index + 1}`)
        .join(", ")
      const values = Object.values(data)
  
      const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`
      const results = await this.executeQuery(query, values)
      return results.length > 0 ? results[0] : null
    }
  
    async update(table: string, id: string, data: Record<string, any>): Promise<any> {
      const setClause = Object.keys(data)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(", ")
      const values = [id, ...Object.values(data)]
  
      const query = `UPDATE ${table} SET ${setClause} WHERE id = $1 RETURNING *`
      const results = await this.executeQuery(query, values)
      return results.length > 0 ? results[0] : null
    }
  
    async remove(table: string, id: string): Promise<boolean> {
      const query = `DELETE FROM ${table} WHERE id = $1`
      await this.executeQuery(query, [id])
      return true
    }
  }
  
  // Instância do serviço de banco de dados
  const dbService = new NeonDatabaseService()
  
  // Função para calcular o uso de memória estimado
  export const calcularUsoMemoria = (registros: number): number => {
    // 1 registro ≈ 5KB
    return registros * 5
  }
  
  // Exportar funções do serviço de banco de dados
  export const executeQuery = dbService.executeQuery.bind(dbService)
  export const fetchAll = dbService.fetchAll.bind(dbService)
  export const fetchById = dbService.fetchById.bind(dbService)
  export const insert = dbService.insert.bind(dbService)
  export const update = dbService.update.bind(dbService)
  export const remove = dbService.remove.bind(dbService)
  
  // Funções específicas para cada entidade - retornam dados mockados diretamente
  export const fetchBolsas = async (): Promise<any[]> => {
    return [
      { id: "b1", nome: "BPIG-V", valor: 2700, sponsor: "FAPES", quantidadeMembros: 5, isAtipico: true },
      { id: "b2", nome: "BPIG-IV", valor: 1500, sponsor: "FAPES", quantidadeMembros: 8, isAtipico: false },
      { id: "b3", nome: "BPIG-III", valor: 1100, sponsor: "FAPES", quantidadeMembros: 12, isAtipico: false },
      { id: "b4", nome: "BPIG-II", valor: 800, sponsor: "FAPES", quantidadeMembros: 15, isAtipico: false },
      { id: "b5", nome: "BPIG-I", valor: 500, sponsor: "FAPES", quantidadeMembros: 20, isAtipico: false },
      { id: "b6", nome: "Bolsa CNPq", valor: 1800, sponsor: "CNPq", quantidadeMembros: 3, isAtipico: false },
      { id: "b7", nome: "Bolsa CAPES", valor: 2200, sponsor: "CAPES", quantidadeMembros: 2, isAtipico: false },
    ]
  }
  
  export const fetchBolsistas = async (): Promise<any[]> => {
    return [
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
    ]
  }
  
  export const fetchPrestacaoContas = async (): Promise<any[]> => {
    return [
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
    ]
  }
  
  export const fetchProjetos = async (): Promise<any[]> => {
    return [
      {
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
      {
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
    ]
  }
  
  export const fetchContasPagar = async (): Promise<any[]> => {
    return [
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
    ]
  }
  
  export const fetchComprasRequisicoes = async (): Promise<any[]> => {
    return [
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
    ]
  }
  