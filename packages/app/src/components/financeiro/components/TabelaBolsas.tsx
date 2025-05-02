"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Bolsa } from "../hooks/useFinanceiroData"
import { FilterList, Visibility, Edit, GetApp, Close, Save, Add } from "@material-ui/icons"

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
    animation: "fadeIn 0.3s ease",
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
    animation: "slideUp 0.3s ease",
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
  tableRow: {
    transition: "background-color 0.2s ease, transform 0.2s ease",
  },
  tableRowHover: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  tableActions: {
    display: "flex",
    gap: "8px",
  },
  badgeWarning: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 500,
    backgroundColor: "rgba(241, 196, 15, 0.2)",
    color: "#f1c40f",
  },
  rowHighlight: {
    backgroundColor: "rgba(241, 196, 15, 0.05)",
  },
}

// Estilos CSS para animações
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes slideDown {
    from { transform: translateY(-10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .table-row-hover:hover {
    transform: translateY(-2px);
    background-color: rgba(255, 255, 255, 0.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .button-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    background-color: rgba(52, 152, 219, 0.2);
  }
`

interface TabelaBolsasProps {
  bolsas: Bolsa[]
  onView: (id: string) => void
  onEdit: (id: string) => void
  onAdd: () => void
  activeModal: {
    type: "view" | "edit" | "add" | "delete"
    section: "bolsa" | "bolsista" | "prestacao" | "projeto"
    id: string | null
  } | null
  onCloseModal: () => void
}

export const TabelaBolsas: React.FC<TabelaBolsasProps> = ({
  bolsas,
  onView,
  onEdit,
  onAdd,
  activeModal,
  onCloseModal,
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSponsor, setFilterSponsor] = useState("")
  const [editingBolsa, setEditingBolsa] = useState<Bolsa | null>(null)
  const [animatedRows, setAnimatedRows] = useState<{ [key: string]: boolean }>({})

  // Adicionar estilos de animação ao documento
  useEffect(() => {
    const styleElement = document.createElement("style")
    styleElement.innerHTML = animationStyles
    document.head.appendChild(styleElement)

    // Animar as linhas progressivamente
    const timer = setTimeout(() => {
      bolsas.forEach((bolsa, index) => {
        setTimeout(() => {
          setAnimatedRows((prev) => ({ ...prev, [bolsa.id]: true }))
        }, index * 100)
      })
    }, 300)

    return () => {
      document.head.removeChild(styleElement)
      clearTimeout(timer)
    }
  }, [bolsas])

  // Função para formatar valores monetários
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  // Filtrar bolsas com base na busca e filtro
  const bolsasFiltradas = bolsas.filter((bolsa) => {
    const matchesSearch =
      bolsa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bolsa.sponsor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterSponsor === "" || bolsa.sponsor === filterSponsor
    return matchesSearch && matchesFilter
  })

  // Obter lista única de sponsors para o filtro
  const sponsors = [...new Set(bolsas.map((bolsa) => bolsa.sponsor))]

  // Função para baixar dados em CSV
  const downloadCSV = () => {
    const headers = ["Nome", "Valor", "Sponsor", "Quantidade de Membros", "Atípico"]
    const csvContent = [
      headers.join(","),
      ...bolsasFiltradas.map((bolsa) =>
        [bolsa.nome, bolsa.valor, bolsa.sponsor, bolsa.quantidadeMembros, bolsa.isAtipico ? "Sim" : "Não"].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "bolsas.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Função para iniciar edição de bolsa
  const iniciarEdicao = (bolsa: Bolsa) => {
    setEditingBolsa({ ...bolsa })
    onEdit(bolsa.id)
  }

  // Função para salvar edição de bolsa
  const salvarEdicao = () => {
    // Aqui seria implementada a lógica para salvar as alterações no banco de dados
    if (editingBolsa) {
      // Simulação de chamada à API
      console.log("Salvando bolsa editada:", editingBolsa)

      // Na implementação real, aqui seria feita uma chamada para a API
      // const response = await fetch(`/api/bolsas/${editingBolsa.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editingBolsa)
      // });

      // if (response.ok) {
      //   const updatedBolsa = await response.json();
      //   // Atualizar o estado local com a bolsa atualizada
      // }
    }

    onCloseModal()
    setEditingBolsa(null)
  }

  // Renderizar modal de visualização
  const renderizarModalVisualizacao = () => {
    if (!activeModal || activeModal.section !== "bolsa" || activeModal.type !== "view" || !activeModal.id) return null

    const bolsa = bolsas.find((b) => b.id === activeModal.id)
    if (!bolsa) return null

    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>Detalhes da Bolsa</h3>
            <button style={styles.modalClose} onClick={onCloseModal}>
              <Close />
            </button>
          </div>

          <div>
            <p>
              <strong>Nome:</strong> {bolsa.nome || "N/A"}
            </p>
            <p>
              <strong>Valor:</strong> {formatarMoeda(bolsa.valor || 0)}
            </p>
            <p>
              <strong>Sponsor:</strong> {bolsa.sponsor || "N/A"}
            </p>
            <p>
              <strong>Quantidade de Membros:</strong> {bolsa.quantidadeMembros || 0}
            </p>
            {bolsa.isAtipico && (
              <p>
                <strong>Observação:</strong> <span style={styles.badgeWarning}>Valor Atípico</span>
              </p>
            )}
          </div>

          <div style={styles.modalFooter}>
            <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={onCloseModal}>
              Fechar
            </button>
            <button
              style={{ ...styles.button, ...styles.buttonModern }}
              onClick={() => {
                onCloseModal()
                iniciarEdicao(bolsa)
              }}
              className="button-hover"
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
    if (!activeModal || activeModal.section !== "bolsa" || activeModal.type !== "edit" || !editingBolsa) return null

    // Garantir que editingBolsa tenha todos os campos necessários
    const safeEditingBolsa = {
      ...editingBolsa,
      nome: editingBolsa.nome || "",
      valor: editingBolsa.valor || 0,
      sponsor: editingBolsa.sponsor || "",
      quantidadeMembros: editingBolsa.quantidadeMembros || 0,
      isAtipico: !!editingBolsa.isAtipico,
    }

    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>Editar Bolsa</h3>
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
                value={safeEditingBolsa.nome}
                onChange={(e) => setEditingBolsa({ ...safeEditingBolsa, nome: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Valor</label>
              <input
                type="number"
                style={styles.formInput}
                value={safeEditingBolsa.valor}
                onChange={(e) => setEditingBolsa({ ...safeEditingBolsa, valor: Number(e.target.value) })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Sponsor</label>
              <input
                type="text"
                style={styles.formInput}
                value={safeEditingBolsa.sponsor}
                onChange={(e) => setEditingBolsa({ ...safeEditingBolsa, sponsor: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Quantidade de Membros</label>
              <input
                type="number"
                style={styles.formInput}
                value={safeEditingBolsa.quantidadeMembros}
                onChange={(e) => setEditingBolsa({ ...safeEditingBolsa, quantidadeMembros: Number(e.target.value) })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>
                <input
                  type="checkbox"
                  checked={safeEditingBolsa.isAtipico}
                  onChange={(e) => setEditingBolsa({ ...safeEditingBolsa, isAtipico: e.target.checked })}
                />{" "}
                Marcar como valor atípico
              </label>
            </div>
          </div>

          <div style={styles.modalFooter}>
            <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={onCloseModal}>
              Cancelar
            </button>
            <button
              style={{ ...styles.button, ...styles.buttonModern }}
              onClick={salvarEdicao}
              className="button-hover"
            >
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
    if (!activeModal || activeModal.section !== "bolsa" || activeModal.type !== "add") return null

    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>Adicionar Nova Bolsa</h3>
            <button style={styles.modalClose} onClick={onCloseModal}>
              <Close />
            </button>
          </div>

          <div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Nome</label>
              <input type="text" style={styles.formInput} placeholder="Ex: BPIG-III" />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Valor</label>
              <input type="number" style={styles.formInput} placeholder="Ex: 1100" />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Sponsor</label>
              <input type="text" style={styles.formInput} placeholder="Ex: FAPES" />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Quantidade de Membros</label>
              <input type="number" style={styles.formInput} placeholder="Ex: 10" />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>
                <input type="checkbox" /> Marcar como valor atípico
              </label>
            </div>
          </div>

          <div style={styles.modalFooter}>
            <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={onCloseModal}>
              Cancelar
            </button>
            <button
              style={{ ...styles.button, ...styles.buttonModern }}
              onClick={onCloseModal}
              className="button-hover"
            >
              <Save style={{ fontSize: 16, marginRight: 4 }} />
              Salvar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>
        Tabela de Bolsas
        <button
          style={{
            backgroundColor: "rgba(52, 152, 219, 0.1)",
            color: "#3498db",
            border: "none",
            borderRadius: "8px",
            padding: "10px 16px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onClick={onAdd}
          className="button-hover"
        >
          <Add style={{ fontSize: 16, marginRight: 4 }} />
          Adicionar
        </button>
      </h2>

      <div style={styles.cardContent}>
        <div style={styles.searchBar}>
          <input
            type="text"
            style={styles.searchInput}
            placeholder="Buscar bolsas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button style={{ ...styles.button, ...styles.buttonModern }} onClick={downloadCSV} className="button-hover">
            <GetApp style={{ fontSize: 16, marginRight: 4 }} />
            Exportar
          </button>
        </div>

        <div style={styles.filterContainer}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FilterList style={{ color: "rgba(255, 255, 255, 0.7)" }} />
            <span>Filtrar por:</span>
          </div>

          <select style={styles.filterSelect} value={filterSponsor} onChange={(e) => setFilterSponsor(e.target.value)}>
            <option value="">Todos os Sponsors</option>
            {sponsors.map((sponsor) => (
              <option key={sponsor} value={sponsor}>
                {sponsor}
              </option>
            ))}
          </select>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Nome</th>
                <th style={styles.tableHeader}>Valor</th>
                <th style={styles.tableHeader}>Sponsor</th>
                <th style={styles.tableHeader}>Membros</th>
                <th style={styles.tableHeader}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {bolsasFiltradas.map((bolsa) => (
                <tr
                  key={bolsa.id}
                  style={{
                    ...styles.tableRow,
                    ...(bolsa.isAtipico ? styles.rowHighlight : {}),
                    opacity: animatedRows[bolsa.id] ? 1 : 0,
                    transform: animatedRows[bolsa.id] ? "translateY(0)" : "translateY(10px)",
                    transition: "opacity 0.3s ease, transform 0.3s ease, background-color 0.2s ease",
                  }}
                  className="table-row-hover"
                >
                  <td style={styles.tableCell}>{bolsa.nome}</td>
                  <td style={styles.tableCell}>
                    {formatarMoeda(bolsa.valor)}
                    {bolsa.isAtipico && <span style={{ ...styles.badgeWarning, marginLeft: 8 }}>Atípico</span>}
                  </td>
                  <td style={styles.tableCell}>{bolsa.sponsor}</td>
                  <td style={styles.tableCell}>{bolsa.quantidadeMembros}</td>
                  <td style={styles.tableCell}>
                    <div style={styles.tableActions}>
                      <button
                        style={{ ...styles.button, ...styles.buttonSecondary, padding: "4px 8px" }}
                        onClick={() => onView(bolsa.id)}
                        title="Visualizar detalhes"
                        className="button-hover"
                      >
                        <Visibility style={{ fontSize: 16 }} />
                      </button>
                      <button
                        style={{ ...styles.button, ...styles.buttonSecondary, padding: "4px 8px" }}
                        onClick={() => iniciarEdicao(bolsa)}
                        title="Editar bolsa"
                        className="button-hover"
                      >
                        <Edit style={{ fontSize: 16 }} />
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
    </div>
  )
}
