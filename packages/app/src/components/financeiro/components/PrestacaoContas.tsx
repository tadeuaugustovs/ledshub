"use client"

import type React from "react"
import { useState } from "react"
import type { PrestacaoConta } from "../hooks/useFinanceiroData"
import { FilterList, Visibility, Edit, Delete, Close, Save, Add, GetApp } from "@material-ui/icons"

// Definindo estilos inline para substituir os estilos do módulo CSS
const styles = {
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    padding: "20px",
    height: "100%",
    transition: "box-shadow 0.3s ease, transform 0.2s ease",
    border: "1px solid #333333",
    position: "relative" as const,
    overflow: "hidden" as const,
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: 600,
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#ffffff",
  },
  cardContent: {
    height: "calc(100% - 40px)",
  },
  button: {
    borderRadius: "6px",
    padding: "8px 16px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  },
  buttonPrimary: {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    color: "#3498db",
    border: "1px solid #3498db",
  },
  buttonDanger: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
  },
  buttonModern: {
    backgroundColor: "rgba(52, 152, 219, 0.1)",
    color: "#3498db",
    border: "none",
    borderRadius: "8px",
    padding: "10px 16px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  buttonEdit: {
    backgroundColor: "rgba(52, 152, 219, 0.1)",
    color: "#3498db",
    border: "none",
    borderRadius: "6px",
    padding: "6px 12px",
    fontSize: "13px",
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    marginTop: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  modal: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    overflow: "hidden",
  },
  modalContent: {
    backgroundColor: "#1e1e1e",
    borderRadius: "12px",
    padding: "24px",
    width: "90%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflowY: "auto" as const,
    position: "relative" as const,
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    border: "1px solid #333333",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    borderBottom: "1px solid #333333",
    paddingBottom: "12px",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#ffffff",
    margin: 0,
  },
  modalClose: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "rgba(255, 255, 255, 0.7)",
    padding: "8px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    position: "absolute" as const,
    top: "12px",
    right: "12px",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "24px",
    borderTop: "1px solid #333333",
    paddingTop: "16px",
  },
  searchBar: {
    display: "flex",
    gap: "12px",
    marginBottom: "16px",
  },
  searchInput: {
    flex: 1,
    padding: "10px 16px",
    border: "1px solid #333333",
    borderRadius: "8px",
    backgroundColor: "#2a2a2a",
    color: "#ffffff",
    transition: "all 0.2s ease",
  },
  filterContainer: {
    display: "flex",
    gap: "12px",
    marginBottom: "16px",
    flexWrap: "wrap" as const,
    alignItems: "center",
  },
  filterSelect: {
    padding: "8px 12px",
    border: "1px solid #333333",
    borderRadius: "8px",
    backgroundColor: "#2a2a2a",
    color: "#ffffff",
  },
  formGroup: {
    marginBottom: "16px",
  },
  formLabel: {
    display: "block",
    marginBottom: "8px",
    fontWeight: 500,
    color: "#ffffff",
  },
  formInput: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #333333",
    borderRadius: "8px",
    backgroundColor: "#2a2a2a",
    color: "#ffffff",
    transition: "all 0.2s ease",
  },
  formTextarea: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #333333",
    borderRadius: "8px",
    minHeight: "100px",
    backgroundColor: "#2a2a2a",
    color: "#ffffff",
    resize: "vertical" as const,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
  },
  tableHeader: {
    textAlign: "left" as const,
    padding: "12px 16px",
    backgroundColor: "#2a2a2a",
    color: "#ffffff",
    fontWeight: 600,
    borderBottom: "2px solid #333333",
  },
  tableCell: {
    padding: "12px 16px",
    borderBottom: "1px solid #333333",
    color: "rgba(255, 255, 255, 0.7)",
  },
  tableActions: {
    display: "flex",
    gap: "8px",
  },
}

interface PrestacaoContasProps {
  prestacoes: PrestacaoConta[]
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onAdd: () => void
  activeModal: {
    type: "view" | "edit" | "add" | "delete"
    section: "bolsa" | "bolsista" | "prestacao" | "projeto"
    id: string | null
  } | null
  onCloseModal: () => void
}

export const PrestacaoContas: React.FC<PrestacaoContasProps> = ({
  prestacoes,
  onView,
  onEdit,
  onDelete,
  onAdd,
  activeModal,
  onCloseModal,
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterNatureza, setFilterNatureza] = useState("")
  const [filterProjeto, setFilterProjeto] = useState("")
  const [editingPrestacao, setEditingPrestacao] = useState<PrestacaoConta | null>(null)
  const [showNaturezasModal, setShowNaturezasModal] = useState(false)
  const [showProjetosModal, setShowProjetosModal] = useState(false)

  // Função para formatar valores monetários
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  // Função para formatar data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return data.toLocaleDateString("pt-BR")
  }

  // Função para exportar dados em CSV
  const exportarCSV = () => {
    const headers = ["Nome", "Natureza Contábil", "Vínculo Jurídico", "Valor", "Data", "Projeto"]
    const csvContent = [
      headers.join(","),
      ...prestacoesFiltradas.map((prestacao) =>
        [
          prestacao.nome,
          prestacao.naturezaContabil,
          prestacao.vinculoJuridico,
          prestacao.valor,
          formatarData(prestacao.data),
          prestacao.projetoId,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "prestacoes.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filtrar prestações com base na busca e filtros
  const prestacoesFiltradas = prestacoes.filter((prestacao) => {
    const matchesSearch =
      prestacao.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prestacao.naturezaContabil.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prestacao.vinculoJuridico.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesNatureza = filterNatureza === "" || prestacao.naturezaContabil === filterNatureza
    const matchesProjeto = filterProjeto === "" || prestacao.projetoId === filterProjeto
    return matchesSearch && matchesNatureza && matchesProjeto
  })

  // Obter lista única de naturezas contábeis para o filtro
  const naturezas = [...new Set(prestacoes.map((prestacao) => prestacao.naturezaContabil))]

  // Obter lista única de projetos para o filtro
  const projetos = [...new Set(prestacoes.map((prestacao) => prestacao.projetoId))]

  // Função para iniciar edição de prestação
  const iniciarEdicao = (prestacao: PrestacaoConta) => {
    setEditingPrestacao({ ...prestacao })
    onEdit(prestacao.id)
  }

  // Função para salvar edição de prestação
  const salvarEdicao = () => {
    // Aqui seria implementada a lógica para salvar as alterações
    console.log("Salvando prestação editada:", editingPrestacao)
    onCloseModal()
    setEditingPrestacao(null)
  }

  // Função para abrir modal de edição de naturezas
  const abrirModalNaturezas = () => {
    setShowNaturezasModal(true)
  }

  // Função para abrir modal de edição de projetos
  const abrirModalProjetos = () => {
    setShowProjetosModal(true)
  }

  // Renderizar modal de visualização
  const renderizarModalVisualizacao = () => {
    if (!activeModal || activeModal.section !== "prestacao" || activeModal.type !== "view" || !activeModal.id)
      return null

    const prestacao = prestacoes.find((p) => p.id === activeModal.id)
    if (!prestacao) return null

    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>Detalhes da Prestação de Contas</h3>
            <button style={styles.modalClose} onClick={onCloseModal}>
              <Close />
            </button>
          </div>

          <div>
            <p>
              <strong>Nome:</strong> {prestacao.nome}
            </p>
            <p>
              <strong>Natureza Contábil:</strong> {prestacao.naturezaContabil}
            </p>
            <p>
              <strong>Vínculo Jurídico:</strong> {prestacao.vinculoJuridico}
            </p>
            <p>
              <strong>Valor:</strong> {formatarMoeda(prestacao.valor)}
            </p>
            <p>
              <strong>Data:</strong> {formatarData(prestacao.data)}
            </p>
            <p>
              <strong>Projeto:</strong> {prestacao.projetoId}
            </p>
            <p>
              <strong>Justificativa:</strong>
            </p>
            <p style={{ backgroundColor: "#2a2a2a", padding: 10, borderRadius: 4 }}>{prestacao.justificativa}</p>
          </div>

          <div style={styles.modalFooter}>
            <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={onCloseModal}>
              Fechar
            </button>
            <button
              style={{ ...styles.button, ...styles.buttonModern }}
              onClick={() => {
                onCloseModal()
                iniciarEdicao(prestacao)
              }}
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Renderizar modal de edição
  const renderizarModalEdicao = () => {
    if (!activeModal || activeModal.section !== "prestacao" || activeModal.type !== "edit" || !editingPrestacao)
      return null

    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>Editar Prestação de Contas</h3>
            <button style={styles.modalClose} onClick={onCloseModal}>
              <Close />
            </button>
          </div>

          <div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Nome</label>
              <input
                type="text"
                style={styles.formInput}
                value={editingPrestacao.nome}
                onChange={(e) => setEditingPrestacao({ ...editingPrestacao, nome: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Natureza Contábil</label>
              <select
                style={styles.formInput}
                value={editingPrestacao.naturezaContabil}
                onChange={(e) => setEditingPrestacao({ ...editingPrestacao, naturezaContabil: e.target.value })}
              >
                {naturezas.map((natureza) => (
                  <option key={natureza} value={natureza}>
                    {natureza}
                  </option>
                ))}
              </select>
              <button style={styles.buttonEdit} onClick={abrirModalNaturezas}>
                <Edit style={{ fontSize: 16, marginRight: 4 }} />
                Editar Naturezas
              </button>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Vínculo Jurídico</label>
              <input
                type="text"
                style={styles.formInput}
                value={editingPrestacao.vinculoJuridico}
                onChange={(e) => setEditingPrestacao({ ...editingPrestacao, vinculoJuridico: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Valor</label>
              <input
                type="number"
                style={styles.formInput}
                value={editingPrestacao.valor}
                onChange={(e) => setEditingPrestacao({ ...editingPrestacao, valor: Number(e.target.value) })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Projeto</label>
              <select
                style={styles.formInput}
                value={editingPrestacao.projetoId}
                onChange={(e) => setEditingPrestacao({ ...editingPrestacao, projetoId: e.target.value })}
              >
                {projetos.map((projeto) => (
                  <option key={projeto} value={projeto}>
                    {projeto}
                  </option>
                ))}
              </select>
              <button style={styles.buttonEdit} onClick={abrirModalProjetos}>
                <Edit style={{ fontSize: 16, marginRight: 4 }} />
                Editar Projetos
              </button>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Justificativa</label>
              <textarea
                style={styles.formTextarea}
                value={editingPrestacao.justificativa}
                onChange={(e) => setEditingPrestacao({ ...editingPrestacao, justificativa: e.target.value })}
              />
            </div>
          </div>

          <div style={styles.modalFooter}>
            <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={onCloseModal}>
              Cancelar
            </button>
            <button style={{ ...styles.button, ...styles.buttonModern }} onClick={salvarEdicao}>
              <Save style={{ fontSize: 16, marginRight: 4 }} />
              Salvar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Renderizar modal de adição
  const renderizarModalAdicao = () => {
    if (!activeModal || activeModal.section !== "prestacao" || activeModal.type !== "add") return null

    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>Adicionar Nova Prestação de Contas</h3>
            <button style={styles.modalClose} onClick={onCloseModal}>
              <Close />
            </button>
          </div>

          <div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Nome</label>
              <input type="text" style={styles.formInput} placeholder="Ex: Aquisição de Equipamentos" />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Natureza Contábil</label>
              <select style={styles.formInput}>
                <option value="">Selecione uma natureza</option>
                {naturezas.map((natureza) => (
                  <option key={natureza} value={natureza}>
                    {natureza}
                  </option>
                ))}
              </select>
              <button style={styles.buttonEdit} onClick={abrirModalNaturezas}>
                <Edit style={{ fontSize: 16, marginRight: 4 }} />
                Editar Naturezas
              </button>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Vínculo Jurídico</label>
              <input type="text" style={styles.formInput} placeholder="Ex: Licitação" />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Valor</label>
              <input type="number" style={styles.formInput} placeholder="Ex: 10000" />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Projeto</label>
              <select style={styles.formInput}>
                <option value="">Selecione um projeto</option>
                {projetos.map((projeto) => (
                  <option key={projeto} value={projeto}>
                    {projeto}
                  </option>
                ))}
              </select>
              <button style={styles.buttonEdit} onClick={abrirModalProjetos}>
                <Edit style={{ fontSize: 16, marginRight: 4 }} />
                Editar Projetos
              </button>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Justificativa</label>
              <textarea style={styles.formTextarea} placeholder="Descreva a justificativa para esta despesa..." />
            </div>
          </div>

          <div style={styles.modalFooter}>
            <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={onCloseModal}>
              Cancelar
            </button>
            <button style={{ ...styles.button, ...styles.buttonModern }} onClick={onCloseModal}>
              <Save style={{ fontSize: 16, marginRight: 4 }} />
              Salvar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Renderizar modal de exclusão
  const renderizarModalExclusao = () => {
    if (!activeModal || activeModal.section !== "prestacao" || activeModal.type !== "delete" || !activeModal.id)
      return null

    const prestacao = prestacoes.find((p) => p.id === activeModal.id)
    if (!prestacao) return null

    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>Confirmar Exclusão</h3>
            <button style={styles.modalClose} onClick={onCloseModal}>
              <Close />
            </button>
          </div>

          <div>
            <p>
              Tem certeza que deseja excluir a prestação de contas <strong>{prestacao.nome}</strong>?
            </p>
            <p>Esta ação não pode ser desfeita.</p>
          </div>

          <div style={styles.modalFooter}>
            <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={onCloseModal}>
              Cancelar
            </button>
            <button style={{ ...styles.button, ...styles.buttonDanger }} onClick={onCloseModal}>
              <Delete style={{ fontSize: 16, marginRight: 4 }} />
              Excluir
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Renderizar modal de edição de naturezas
  const renderizarModalNaturezas = () => {
    if (!showNaturezasModal) return null

    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>Gerenciar Naturezas Contábeis</h3>
            <button style={styles.modalClose} onClick={() => setShowNaturezasModal(false)}>
              <Close />
            </button>
          </div>

          <div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Nova Natureza</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input type="text" style={{ ...styles.formInput, flex: 1 }} placeholder="Ex: Material de Consumo" />
                <button style={{ ...styles.button, ...styles.buttonModern }}>
                  <Add style={{ fontSize: 16 }} />
                </button>
              </div>
            </div>

            <div style={{ marginTop: "16px" }}>
              <h4 style={{ marginBottom: "8px" }}>Naturezas Existentes</h4>
              <div style={{ maxHeight: "300px", overflowY: "auto" as const }}>
                {naturezas.map((natureza, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                      borderBottom: "1px solid #333333",
                    }}
                  >
                    <span>{natureza}</span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        style={{
                          ...styles.button,
                          ...styles.buttonSecondary,
                          padding: "4px 8px",
                        }}
                      >
                        <Edit style={{ fontSize: 16 }} />
                      </button>
                      <button
                        style={{
                          ...styles.button,
                          ...styles.buttonDanger,
                          padding: "4px 8px",
                        }}
                      >
                        <Delete style={{ fontSize: 16 }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={styles.modalFooter}>
            <button
              style={{ ...styles.button, ...styles.buttonSecondary }}
              onClick={() => setShowNaturezasModal(false)}
            >
              Cancelar
            </button>
            <button style={{ ...styles.button, ...styles.buttonModern }} onClick={() => setShowNaturezasModal(false)}>
              <Save style={{ fontSize: 16, marginRight: 4 }} />
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Renderizar modal de edição de projetos
  const renderizarModalProjetos = () => {
    if (!showProjetosModal) return null

    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>Gerenciar Projetos</h3>
            <button style={styles.modalClose} onClick={() => setShowProjetosModal(false)}>
              <Close />
            </button>
          </div>

          <div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Novo Projeto</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input type="text" style={{ ...styles.formInput, flex: 1 }} placeholder="Ex: Novo Projeto" />
                <button style={{ ...styles.button, ...styles.buttonModern }}>
                  <Add style={{ fontSize: 16 }} />
                </button>
              </div>
            </div>

            <div style={{ marginTop: "16px" }}>
              <h4 style={{ marginBottom: "8px" }}>Projetos Existentes</h4>
              <div style={{ maxHeight: "300px", overflowY: "auto" as const }}>
                {projetos.map((projeto, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                      borderBottom: "1px solid #333333",
                    }}
                  >
                    <span>{projeto}</span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        style={{
                          ...styles.button,
                          ...styles.buttonSecondary,
                          padding: "4px 8px",
                        }}
                      >
                        <Edit style={{ fontSize: 16 }} />
                      </button>
                      <button
                        style={{
                          ...styles.button,
                          ...styles.buttonDanger,
                          padding: "4px 8px",
                        }}
                      >
                        <Delete style={{ fontSize: 16 }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={styles.modalFooter}>
            <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={() => setShowProjetosModal(false)}>
              Cancelar
            </button>
            <button style={{ ...styles.button, ...styles.buttonModern }} onClick={() => setShowProjetosModal(false)}>
              <Save style={{ fontSize: 16, marginRight: 4 }} />
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>
        Prestação de Contas
        <button style={{ ...styles.button, ...styles.buttonModern }} onClick={onAdd}>
          <Add style={{ fontSize: 16, marginRight: 4 }} />
          Nova Despesa
        </button>
      </h2>

      <div style={styles.cardContent}>
        <div style={styles.searchBar}>
          <input
            type="text"
            style={styles.searchInput}
            placeholder="Buscar prestações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button style={{ ...styles.button, ...styles.buttonModern }} onClick={exportarCSV}>
            <GetApp style={{ fontSize: 16, marginRight: 4 }} />
            Exportar
          </button>
        </div>

        <div style={styles.filterContainer}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FilterList style={{ color: "rgba(255, 255, 255, 0.7)" }} />
            <span>Filtrar por:</span>
          </div>

          <select
            style={styles.filterSelect}
            value={filterNatureza}
            onChange={(e) => setFilterNatureza(e.target.value)}
          >
            <option value="">Todas as Naturezas</option>
            {naturezas.map((natureza) => (
              <option key={natureza} value={natureza}>
                {natureza}
              </option>
            ))}
          </select>

          <select style={styles.filterSelect} value={filterProjeto} onChange={(e) => setFilterProjeto(e.target.value)}>
            <option value="">Todos os Projetos</option>
            {projetos.map((projeto) => (
              <option key={projeto} value={projeto}>
                {projeto}
              </option>
            ))}
          </select>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Nome</th>
                <th style={styles.tableHeader}>Natureza Contábil</th>
                <th style={styles.tableHeader}>Vínculo Jurídico</th>
                <th style={styles.tableHeader}>Valor</th>
                <th style={styles.tableHeader}>Projeto</th>
                <th style={styles.tableHeader}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {prestacoesFiltradas.map((prestacao) => (
                <tr key={prestacao.id}>
                  <td style={styles.tableCell}>{prestacao.nome}</td>
                  <td style={styles.tableCell}>{prestacao.naturezaContabil}</td>
                  <td style={styles.tableCell}>{prestacao.vinculoJuridico}</td>
                  <td style={styles.tableCell}>{formatarMoeda(prestacao.valor)}</td>
                  <td style={styles.tableCell}>{prestacao.projetoId}</td>
                  <td style={styles.tableCell}>
                    <div style={styles.tableActions}>
                      <button
                        style={{ ...styles.button, ...styles.buttonSecondary, padding: "4px 8px" }}
                        onClick={() => onView(prestacao.id)}
                        title="Visualizar detalhes"
                      >
                        <Visibility style={{ fontSize: 16 }} />
                      </button>
                      <button
                        style={{ ...styles.button, ...styles.buttonSecondary, padding: "4px 8px" }}
                        onClick={() => iniciarEdicao(prestacao)}
                        title="Editar prestação"
                      >
                        <Edit style={{ fontSize: 16 }} />
                      </button>
                      <button
                        style={{ ...styles.button, ...styles.buttonDanger, padding: "4px 8px" }}
                        onClick={() => onDelete(prestacao.id)}
                        title="Excluir prestação"
                      >
                        <Delete style={{ fontSize: 16 }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {renderizarModalVisualizacao()}
      {renderizarModalEdicao()}
      {renderizarModalAdicao()}
      {renderizarModalExclusao()}
      {renderizarModalNaturezas()}
      {renderizarModalProjetos()}
    </div>
  )
}
