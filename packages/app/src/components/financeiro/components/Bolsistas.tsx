"use client"

import type React from "react"
import { useState } from "react"
import type { Bolsista } from "../hooks/useFinanceiroData"
import { Visibility, Edit, Close, Save, Delete, CloudUpload, PersonAdd, GetApp } from "@material-ui/icons"

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
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
  },
  tableActions: {
    display: "flex",
    gap: "8px",
  },
  statusIndicatorActive: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    display: "inline-block",
    marginRight: "6px",
    backgroundColor: "#2ecc71",
  },
  statusIndicatorInactive: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    display: "inline-block",
    marginRight: "6px",
    backgroundColor: "#e74c3c",
  },
  statusIndicatorPending: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    display: "inline-block",
    marginRight: "6px",
    backgroundColor: "#f39c12",
  },
  actionButtons: {
    display: "flex",
    gap: "8px",
    marginTop: "16px",
    justifyContent: "flex-end",
  },
}

interface BolsistasProps {
  bolsistas: Bolsista[]
  onView: (id: string) => void
  onEdit: (id: string) => void
  activeModal: {
    type: "view" | "edit" | "add" | "delete"
    section: "bolsa" | "bolsista" | "prestacao" | "projeto" | "conta" | "compra"
    id: string | null
  } | null
  onCloseModal: () => void
}

export const Bolsistas: React.FC<BolsistasProps> = ({ bolsistas, onView, onEdit, activeModal, onCloseModal }) => {
  const [editingBolsista, setEditingBolsista] = useState<Bolsista | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [bolsistaToDelete, setBolsistaToDelete] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)

  // Função para formatar valores monetários
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  // Função para formatar data
  const formatarData = (dataString: string | null) => {
    if (!dataString) return "Atual"

    const data = new Date(dataString)
    return data.toLocaleDateString("pt-BR")
  }

  // Função para iniciar edição de bolsista
  const iniciarEdicao = (bolsista: Bolsista) => {
    setEditingBolsista({ ...bolsista })
    onEdit(bolsista.id)
  }

  // Função para salvar edição de bolsista
  const salvarEdicao = () => {
    // Aqui seria implementada a lógica para salvar as alterações
    console.log("Salvando bolsista editado:", editingBolsista)
    onCloseModal()
    setEditingBolsista(null)
  }

  // Função para confirmar exclusão de bolsista
  const confirmarExclusao = (id: string) => {
    setBolsistaToDelete(id)
    setShowDeleteModal(true)
  }

  // Função para excluir bolsista
  const excluirBolsista = () => {
    // Aqui seria implementada a lógica para excluir o bolsista
    console.log("Excluindo bolsista:", bolsistaToDelete)
    setShowDeleteModal(false)
    setBolsistaToDelete(null)
  }

  // Função para exportar dados em CSV
  const exportarCSV = () => {
    const headers = ["Nome", "Vínculo", "Função", "Bolsa Atual"]
    const csvContent = [
      headers.join(","),
      ...bolsistas.map((bolsista) => [bolsista.nome, bolsista.vinculo, bolsista.funcao, bolsista.bolsaAtual].join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "bolsistas.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filtrar bolsistas com base na busca
  const bolsistasFiltrados = bolsistas.filter((bolsista) => {
    return (
      bolsista.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bolsista.vinculo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bolsista.funcao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bolsista.bolsaAtual.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Renderizar modal de visualização
  const renderizarModalVisualizacao = () => {
    if (!activeModal || activeModal.section !== "bolsista" || activeModal.type !== "view" || !activeModal.id)
      return null

    const bolsista = bolsistas.find((b) => b.id === activeModal.id)
    if (!bolsista) return null

    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>Detalhes do Bolsista</h3>
            <button style={styles.modalClose} onClick={onCloseModal}>
              <Close />
            </button>
          </div>

          <div>
            <p>
              <strong>Nome:</strong> {bolsista.nome}
            </p>
            <p>
              <strong>Vínculo:</strong> {bolsista.vinculo}
            </p>
            <p>
              <strong>Função:</strong> {bolsista.funcao}
            </p>
            <p>
              <strong>Bolsa Atual:</strong> {bolsista.bolsaAtual}
            </p>
            <p>
              <strong>Status:</strong> <span style={styles.statusIndicatorActive}></span>
              Ativo
            </p>

            <h4 style={{ marginTop: 20, marginBottom: 10 }}>Histórico de Bolsas</h4>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px 16px",
                      backgroundColor: "#2a2a2a",
                      color: "#ffffff",
                      fontWeight: 600,
                      borderBottom: "2px solid #333333",
                    }}
                  >
                    Bolsa
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px 16px",
                      backgroundColor: "#2a2a2a",
                      color: "#ffffff",
                      fontWeight: 600,
                      borderBottom: "2px solid #333333",
                    }}
                  >
                    Início
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px 16px",
                      backgroundColor: "#2a2a2a",
                      color: "#ffffff",
                      fontWeight: 600,
                      borderBottom: "2px solid #333333",
                    }}
                  >
                    Fim
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px 16px",
                      backgroundColor: "#2a2a2a",
                      color: "#ffffff",
                      fontWeight: 600,
                      borderBottom: "2px solid #333333",
                    }}
                  >
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {bolsista.historicoBolsas.map((historico, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #333333",
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      {historico.nomeBolsa}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #333333",
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      {formatarData(historico.dataInicio)}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #333333",
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      {formatarData(historico.dataFim)}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #333333",
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      {formatarMoeda(historico.valor)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.modalFooter}>
            <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={onCloseModal}>
              Fechar
            </button>
            <button
              style={{ ...styles.button, ...styles.buttonModern }}
              onClick={() => {
                onCloseModal()
                iniciarEdicao(bolsista)
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
    if (!activeModal || activeModal.section !== "bolsista" || activeModal.type !== "edit" || !editingBolsista)
      return null

    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>Editar Bolsista</h3>
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
                value={editingBolsista.nome}
                onChange={(e) => setEditingBolsista({ ...editingBolsista, nome: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Vínculo</label>
              <select
                style={styles.formInput}
                value={editingBolsista.vinculo}
                onChange={(e) => setEditingBolsista({ ...editingBolsista, vinculo: e.target.value })}
              >
                <option value="Graduação">Graduação</option>
                <option value="Mestrado">Mestrado</option>
                <option value="Doutorado">Doutorado</option>
                <option value="Pós-Doutorado">Pós-Doutorado</option>
                <option value="Professor">Professor</option>
                <option value="Externo">Externo</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Função</label>
              <input
                type="text"
                style={styles.formInput}
                value={editingBolsista.funcao}
                onChange={(e) => setEditingBolsista({ ...editingBolsista, funcao: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Bolsa Atual</label>
              <input
                type="text"
                style={styles.formInput}
                value={editingBolsista.bolsaAtual}
                onChange={(e) => setEditingBolsista({ ...editingBolsista, bolsaAtual: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Status</label>
              <select style={styles.formInput} defaultValue="ativo">
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="pendente">Pendente</option>
              </select>
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

  // Renderizar modal de exclusão
  const renderizarModalExclusao = () => {
    if (!showDeleteModal || !bolsistaToDelete) return null

    const bolsista = bolsistas.find((b) => b.id === bolsistaToDelete)
    if (!bolsista) return null

    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>Confirmar Exclusão</h3>
            <button style={styles.modalClose} onClick={() => setShowDeleteModal(false)}>
              <Close />
            </button>
          </div>

          <div>
            <p>
              Tem certeza que deseja excluir o bolsista <strong>{bolsista.nome}</strong>?
            </p>
            <p>Esta ação não pode ser desfeita.</p>
          </div>

          <div style={styles.modalFooter}>
            <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </button>
            <button style={{ ...styles.button, ...styles.buttonDanger }} onClick={excluirBolsista}>
              <Delete style={{ fontSize: 16, marginRight: 4 }} />
              Excluir
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Renderizar modal de adição manual
  const renderizarModalAdicaoManual = () => {
    if (!showAddModal) return null

    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>Adicionar Bolsista Manualmente</h3>
            <button style={styles.modalClose} onClick={() => setShowAddModal(false)}>
              <Close />
            </button>
          </div>

          <div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Nome</label>
              <input type="text" style={styles.formInput} placeholder="Ex: João Silva" />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Vínculo</label>
              <select style={styles.formInput}>
                <option value="">Selecione um vínculo</option>
                <option value="Graduação">Graduação</option>
                <option value="Mestrado">Mestrado</option>
                <option value="Doutorado">Doutorado</option>
                <option value="Pós-Doutorado">Pós-Doutorado</option>
                <option value="Professor">Professor</option>
                <option value="Externo">Externo</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Função</label>
              <input type="text" style={styles.formInput} placeholder="Ex: Desenvolvedor Frontend" />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Bolsa</label>
              <select style={styles.formInput}>
                <option value="">Selecione uma bolsa</option>
                <option value="BPIG-V">BPIG-V</option>
                <option value="BPIG-IV">BPIG-IV</option>
                <option value="BPIG-III">BPIG-III</option>
                <option value="BPIG-II">BPIG-II</option>
                <option value="BPIG-I">BPIG-I</option>
                <option value="Bolsa CNPq">Bolsa CNPq</option>
                <option value="Bolsa CAPES">Bolsa CAPES</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Data de Início</label>
              <input type="date" style={styles.formInput} />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Status</label>
              <select style={styles.formInput}>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="pendente">Pendente</option>
              </select>
            </div>
          </div>

          <div style={styles.modalFooter}>
            <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={() => setShowAddModal(false)}>
              Cancelar
            </button>
            <button style={{ ...styles.button, ...styles.buttonModern }} onClick={() => setShowAddModal(false)}>
              <Save style={{ fontSize: 16, marginRight: 4 }} />
              Salvar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Renderizar modal de importação de CSV
  const renderizarModalImportacao = () => {
    if (!showImportModal) return null

    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>Importar Bolsistas de CSV</h3>
            <button style={styles.modalClose} onClick={() => setShowImportModal(false)}>
              <Close />
            </button>
          </div>

          <div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Arquivo CSV</label>
              <input type="file" accept=".csv" style={styles.formInput} />
            </div>

            <div style={{ marginTop: 16, marginBottom: 16 }}>
              <h4>Instruções para importação:</h4>
              <ul style={{ paddingLeft: 20, color: "rgba(255, 255, 255, 0.7)" }}>
                <li>O arquivo CSV deve conter as colunas: Nome, Vínculo, Função, Bolsa, Data de Início</li>
                <li>A primeira linha deve conter os cabeçalhos das colunas</li>
                <li>As datas devem estar no formato DD/MM/AAAA</li>
                <li>O separador deve ser vírgula (,)</li>
              </ul>
            </div>

            <div style={{ marginTop: 16, marginBottom: 16 }}>
              <h4>Pré-visualização:</h4>
              <div style={{ backgroundColor: "#2a2a2a", padding: 12, borderRadius: 8 }}>
                <p style={{ color: "rgba(255, 255, 255, 0.7)", fontStyle: "italic" }}>
                  A pré-visualização será exibida após o upload do arquivo
                </p>
              </div>
            </div>
          </div>

          <div style={styles.modalFooter}>
            <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={() => setShowImportModal(false)}>
              Cancelar
            </button>
            <button style={{ ...styles.button, ...styles.buttonModern }} onClick={() => setShowImportModal(false)}>
              <CloudUpload style={{ fontSize: 16, marginRight: 4 }} />
              Importar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>
        Bolsistas
        <button style={{ ...styles.button, ...styles.buttonModern }} onClick={() => setShowAddModal(true)}>
          <PersonAdd style={{ fontSize: 16, marginRight: 4 }} />
          Adicionar
        </button>
      </h2>

      <div style={styles.cardContent}>
        <div style={styles.searchBar}>
          <input
            type="text"
            style={styles.searchInput}
            placeholder="Buscar bolsistas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button style={{ ...styles.button, ...styles.buttonModern }} onClick={exportarCSV}>
            <GetApp style={{ fontSize: 16, marginRight: 4 }} />
            Exportar
          </button>
          <button style={{ ...styles.button, ...styles.buttonModern }} onClick={() => setShowImportModal(true)}>
            <CloudUpload style={{ fontSize: 16, marginRight: 4 }} />
            Importar
          </button>
        </div>

        <div style={{ overflowY: "auto", maxHeight: "400px" }}>
          {bolsistasFiltrados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px", color: "rgba(255, 255, 255, 0.7)" }}>
              Nenhum bolsista encontrado
            </div>
          ) : (
            bolsistasFiltrados.map((bolsista) => (
              <div
                key={bolsista.id}
                style={{
                  ...styles.card,
                  marginBottom: 12,
                  padding: 12,
                  transition: "transform 0.2s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                }}
                className="bolsista-card"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.3)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16 }}>
                      <span style={styles.statusIndicatorActive}></span>
                      {bolsista.nome}
                    </h3>
                    <p style={{ margin: "4px 0", fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                      {bolsista.vinculo} • {bolsista.funcao}
                    </p>
                    <p style={{ margin: "4px 0", fontSize: 14 }}>
                      <strong>Bolsa:</strong> {bolsista.bolsaAtual}
                    </p>
                  </div>

                  <div style={styles.tableActions}>
                    <button
                      style={{ ...styles.button, ...styles.buttonSecondary, padding: "4px 8px" }}
                      onClick={() => onView(bolsista.id)}
                      title="Visualizar detalhes"
                    >
                      <Visibility style={{ fontSize: 16 }} />
                    </button>
                    <button
                      style={{ ...styles.button, ...styles.buttonSecondary, padding: "4px 8px" }}
                      onClick={() => iniciarEdicao(bolsista)}
                      title="Editar bolsista"
                    >
                      <Edit style={{ fontSize: 16 }} />
                    </button>
                    <button
                      style={{ ...styles.button, ...styles.buttonDanger, padding: "4px 8px" }}
                      onClick={() => confirmarExclusao(bolsista.id)}
                      title="Excluir bolsista"
                    >
                      <Delete style={{ fontSize: 16 }} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {renderizarModalVisualizacao()}
      {renderizarModalEdicao()}
      {renderizarModalExclusao()}
      {renderizarModalAdicaoManual()}
      {renderizarModalImportacao()}
    </div>
  )
}
