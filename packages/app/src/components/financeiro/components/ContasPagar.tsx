"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { ContaPagar } from "../hooks/useFinanceiroData"
import {
  Visibility,
  Edit,
  Delete,
  Close,
  Save,
  Add,
  GetApp,
  RepeatOne,
  EventNote,
  CreditCard,
  Computer,
  Build,
  ShoppingBasket,
  Category,
} from "@material-ui/icons"

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
    transition: "all 0.3s ease",
  },
  buttonModernHover: {
    backgroundColor: "rgba(52, 152, 219, 0.2)",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
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
  tabs: {
    display: "flex",
    marginBottom: "16px",
    borderBottom: "1px solid #333333",
  },
  tab: {
    padding: "12px 16px",
    cursor: "pointer",
    borderBottom: "2px solid transparent",
    transition: "all 0.2s ease",
    color: "rgba(255, 255, 255, 0.7)",
  },
  tabActive: {
    borderBottomColor: "#3498db",
    color: "#ffffff",
    fontWeight: 500,
  },
  tabContent: {
    display: "none",
  },
  tabContentActive: {
    display: "block",
    animation: "fadeIn 0.3s ease",
  },
  contasSection: {
    marginBottom: "24px",
    animation: "fadeIn 0.5s ease",
  },
  contasHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    padding: "12px 16px",
    backgroundColor: "#2a2a2a",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  contasHeaderActive: {
    backgroundColor: "#3498db",
  },
  contasTitle: {
    fontSize: "18px",
    fontWeight: 600,
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  contasFilters: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap" as const,
    marginBottom: "16px",
    animation: "slideDown 0.3s ease",
  },
  contasFilter: {
    padding: "6px 12px",
    borderRadius: "16px",
    backgroundColor: "#2a2a2a",
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  contasFilterActive: {
    backgroundColor: "#3498db",
    color: "white",
  },
  contaCard: {
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "12px",
    backgroundColor: "#2a2a2a",
    borderLeft: "4px solid transparent",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    animation: "slideIn 0.3s ease",
  },
  contaPaga: {
    borderLeftColor: "#2ecc71",
  },
  contaPendente: {
    borderLeftColor: "#f39c12",
  },
  contaAtrasada: {
    borderLeftColor: "#e74c3c",
  },
  contaCardInfra: {
    borderLeftColor: "#3498db",
  },
  contaCardSoftware: {
    borderLeftColor: "#9b59b6",
  },
  contaCardServicos: {
    borderLeftColor: "#2ecc71",
  },
  contaCardMaterial: {
    borderLeftColor: "#f1c40f",
  },
  contaCardOutros: {
    borderLeftColor: "#e74c3c",
  },
  contaHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "8px",
  },
  contaTitulo: {
    fontWeight: 600,
    fontSize: "16px",
    margin: 0,
    display: "flex",
    alignItems: "center",
  },
  contaValor: {
    fontWeight: 600,
    fontSize: "16px",
  },
  contaInfo: {
    display: "flex",
    justifyContent: "space-between",
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "14px",
  },
  contaActions: {
    marginTop: "12px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
  },
  progressBar: {
    height: "6px",
    backgroundColor: "#333333",
    borderRadius: "3px",
    marginTop: "8px",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#3498db",
    borderRadius: "3px",
    transition: "width 0.5s ease",
  },
  statusPago: {
    color: "#2ecc71",
    fontWeight: 500,
  },
  statusPendente: {
    color: "#f39c12",
    fontWeight: 500,
  },
  statusAtrasado: {
    color: "#e74c3c",
    fontWeight: 500,
  },
  sectionContent: {
    overflow: "hidden",
    transition: "max-height 0.5s ease",
    maxHeight: "0px",
  },
  sectionContentVisible: {
    maxHeight: "2000px", // Valor alto para garantir que todo o conteúdo seja exibido
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
  
  @keyframes slideIn {
    from { transform: translateX(-10px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .conta-card-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }
  
  .button-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    background-color: rgba(52, 152, 219, 0.2);
  }
  
  .progress-animation .progress-fill {
    animation: progressFill 1s ease forwards;
  }
  
  @keyframes progressFill {
    from { width: 0%; }
    to { width: var(--progress-width); }
  }
`

interface ContasPagarProps {
  contas: ContaPagar[]
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onAdd: () => void
  activeModal: {
    type: "view" | "edit" | "add" | "delete"
    section: "bolsa" | "bolsista" | "prestacao" | "projeto" | "conta" | "compra"
    id: string | null
  } | null
  onCloseModal: () => void
}

export const ContasPagar: React.FC<ContasPagarProps> = ({
  contas,
  onView,
  onEdit,
  onDelete,
  onAdd,
  activeModal,
  onCloseModal,
}) => {
  const [activeTab, setActiveTab] = useState<"todas" | "pendentes" | "pagas" | "atrasadas">("todas")
  const [editingConta, setEditingConta] = useState<ContaPagar | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [recorrenciaFilter, setRecorrenciaFilter] = useState<
    "todas" | "mensal" | "trimestral" | "semestral" | "anual" | "semanal"
  >("todas")
  const [animatedCards, setAnimatedCards] = useState<{ [key: string]: boolean }>({})

  // Adicionar um estado para controlar o tipo de gasto selecionado
  const [tipoGastoSelecionado, setTipoGastoSelecionado] = useState<"recorrentes" | "eventuais">("recorrentes")
  const [tipoGastoPadrao, setTipoGastoPadrao] = useState<"recorrentes" | "eventuais">("recorrentes")

  // Adicionar estilos de animação ao documento
  useEffect(() => {
    const styleElement = document.createElement("style")
    styleElement.innerHTML = animationStyles
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  // Animar os cards progressivamente
  useEffect(() => {
    const timer = setTimeout(() => {
      contas.forEach((conta, index) => {
        setTimeout(() => {
          setAnimatedCards((prev) => ({ ...prev, [conta.id]: true }))
        }, index * 100)
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [contas])

  // Função para formatar valores monetários
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  // Função para formatar data
  const formatarData = (dataString: string | null) => {
    if (!dataString) return "—"

    const data = new Date(dataString)
    return data.toLocaleDateString("pt-BR")
  }

  // Função para iniciar edição de conta
  const iniciarEdicao = (conta: ContaPagar) => {
    setEditingConta({ ...conta })
    onEdit(conta.id)
  }

  // Função para salvar edição de conta
  const salvarEdicao = () => {
    // Aqui seria implementada a lógica para salvar as alterações
    console.log("Salvando conta editada:", editingConta)
    onCloseModal()
    setEditingConta(null)
  }

  // Função para exportar dados em CSV
  const exportarCSV = () => {
    const headers = ["Título", "Fornecedor", "Categoria", "Valor", "Data Vencimento", "Status", "Projeto"]
    const csvContent = [
      headers.join(","),
      ...contas.map((conta) =>
        [
          conta.titulo,
          conta.fornecedor,
          conta.categoria,
          conta.valor,
          formatarData(conta.dataVencimento),
          conta.status,
          conta.projetoId,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "contas.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Função para obter o ícone da categoria
  const obterIconeCategoria = (categoria: string) => {
    switch (categoria.toLowerCase()) {
      case "infraestrutura":
        return <Build style={{ fontSize: 16, marginRight: 4 }} />
      case "software":
        return <Computer style={{ fontSize: 16, marginRight: 4 }} />
      case "serviços":
      case "servicos":
        return <CreditCard style={{ fontSize: 16, marginRight: 4 }} />
      case "material de consumo":
        return <ShoppingBasket style={{ fontSize: 16, marginRight: 4 }} />
      default:
        return <Category style={{ fontSize: 16, marginRight: 4 }} />
    }
  }

  // Função para obter a classe de categoria
  const obterClasseCategoria = (categoria: string) => {
    switch (categoria.toLowerCase()) {
      case "infraestrutura":
        return styles.contaCardInfra
      case "software":
        return styles.contaCardSoftware
      case "serviços":
      case "servicos":
        return styles.contaCardServicos
      case "material de consumo":
        return styles.contaCardMaterial
      default:
        return styles.contaCardOutros
    }
  }

  // Separar contas em recorrentes e eventuais (simulação)
  // Na implementação real, isso viria do backend ou teria um campo específico
  const contasRecorrentes = contas.filter((conta, index) => index % 2 === 0)
  const contasEventuais = contas.filter((conta, index) => index % 2 !== 0)

  // Filtrar contas com base na aba ativa, termo de busca e filtros de recorrência
  const filtrarContas = (contasLista: ContaPagar[]) => {
    return contasLista.filter((conta) => {
      const matchesTab =
        activeTab === "todas" ||
        (activeTab === "pendentes" && conta.status === "pendente") ||
        (activeTab === "pagas" && conta.status === "paga") ||
        (activeTab === "atrasadas" && conta.status === "atrasada")

      const matchesSearch =
        conta.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conta.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conta.categoria.toLowerCase().includes(searchTerm.toLowerCase())

      // Simulação de filtro de recorrência
      // Na implementação real, isso seria baseado em um campo específico
      const matchesRecorrencia =
        recorrenciaFilter === "todas" ||
        (recorrenciaFilter === "mensal" && conta.id.includes("1")) ||
        (recorrenciaFilter === "trimestral" && conta.id.includes("2")) ||
        (recorrenciaFilter === "semestral" && conta.id.includes("3")) ||
        (recorrenciaFilter === "anual" && conta.id.includes("4")) ||
        (recorrenciaFilter === "semanal" && conta.id.includes("5"))

      return matchesTab && matchesSearch && (tipoGastoSelecionado !== "recorrentes" || matchesRecorrencia)
    })
  }

  const contasRecorrentesFiltradas = filtrarContas(contasRecorrentes)
  const contasEventuaisFiltradas = filtrarContas(contasEventuais)

  // Obter contagem de contas por status
  const contasPendentes = contas.filter((conta) => conta.status === "pendente").length
  const contasPagas = contas.filter((conta) => conta.status === "paga").length
  const contasAtrasadas = contas.filter((conta) => conta.status === "atrasada").length

  // Renderizar modal de visualização
  const renderizarModalVisualizacao = () => {
    if (!activeModal || activeModal.section !== "conta" || activeModal.type !== "view" || !activeModal.id) return null

    const conta = contas.find((c) => c.id === activeModal.id)
    if (!conta) return null

    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>Detalhes da Conta</h3>
            <button style={styles.modalClose} onClick={onCloseModal}>
              <Close />
            </button>
          </div>

          <div>
            <p>
              <strong>Título:</strong> {conta.titulo}
            </p>
            <p>
              <strong>Valor:</strong> {formatarMoeda(conta.valor)}
            </p>
            <p>
              <strong>Fornecedor:</strong> {conta.fornecedor}
            </p>
            <p>
              <strong>Categoria:</strong> {conta.categoria}
            </p>
            <p>
              <strong>Data de Vencimento:</strong> {formatarData(conta.dataVencimento)}
            </p>
            <p>
              <strong>Data de Pagamento:</strong> {formatarData(conta.dataPagamento)}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                style={
                  conta.status === "paga"
                    ? styles.statusPago
                    : conta.status === "pendente"
                      ? styles.statusPendente
                      : styles.statusAtrasado
                }
              >
                {conta.status === "paga" ? "Paga" : conta.status === "pendente" ? "Pendente" : "Atrasada"}
              </span>
            </p>
            <p>
              <strong>Projeto:</strong> {conta.projetoId}
            </p>
          </div>

          <div style={styles.modalFooter}>
            <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={onCloseModal}>
              Fechar
            </button>
            <button
              style={{ ...styles.button, ...styles.buttonModern }}
              onClick={() => {
                onCloseModal()
                iniciarEdicao(conta)
              }}
              onMouseEnter={() => null}
              onMouseLeave={() => null}
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
    if (!activeModal || activeModal.section !== "conta" || activeModal.type !== "edit" || !editingConta) return null

    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>Editar Conta</h3>
            <button style={styles.modalClose} onClick={onCloseModal}>
              <Close />
            </button>
          </div>

          <div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Título</label>
              <input
                type="text"
                style={styles.formInput}
                value={editingConta.titulo}
                onChange={(e) => setEditingConta({ ...editingConta, titulo: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Valor</label>
              <input
                type="number"
                style={styles.formInput}
                value={editingConta.valor}
                onChange={(e) => setEditingConta({ ...editingConta, valor: Number(e.target.value) })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Fornecedor</label>
              <input
                type="text"
                style={styles.formInput}
                value={editingConta.fornecedor}
                onChange={(e) => setEditingConta({ ...editingConta, fornecedor: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Categoria</label>
              <input
                type="text"
                style={styles.formInput}
                value={editingConta.categoria}
                onChange={(e) => setEditingConta({ ...editingConta, categoria: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Data de Vencimento</label>
              <input
                type="date"
                style={styles.formInput}
                value={editingConta.dataVencimento.split("T")[0]}
                onChange={(e) => setEditingConta({ ...editingConta, dataVencimento: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Data de Pagamento</label>
              <input
                type="date"
                style={styles.formInput}
                value={editingConta.dataPagamento ? editingConta.dataPagamento.split("T")[0] : ""}
                onChange={(e) => setEditingConta({ ...editingConta, dataPagamento: e.target.value || null })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Status</label>
              <select
                style={styles.formInput}
                value={editingConta.status}
                onChange={(e) =>
                  setEditingConta({
                    ...editingConta,
                    status: e.target.value as "paga" | "pendente" | "atrasada",
                  })
                }
              >
                <option value="paga">Paga</option>
                <option value="pendente">Pendente</option>
                <option value="atrasada">Atrasada</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Projeto</label>
              <input
                type="text"
                style={styles.formInput}
                value={editingConta.projetoId}
                onChange={(e) => setEditingConta({ ...editingConta, projetoId: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Tipo de Gasto</label>
              <select style={styles.formInput} defaultValue="recorrente">
                <option value="recorrente">Recorrente</option>
                <option value="eventual">Eventual</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Recorrência</label>
              <select style={styles.formInput} defaultValue="mensal">
                <option value="mensal">Mensal</option>
                <option value="trimestral">Trimestral</option>
                <option value="semestral">Semestral</option>
                <option value="anual">Anual</option>
                <option value="semanal">Semanal</option>
              </select>
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
    if (!activeModal || activeModal.section !== "conta" || activeModal.type !== "add") return null

    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>Adicionar Nova Conta</h3>
            <button style={styles.modalClose} onClick={onCloseModal}>
              <Close />
            </button>
          </div>

          <div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Título</label>
              <input type="text" style={styles.formInput} placeholder="Ex: Aluguel de Servidores" />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Valor</label>
              <input type="number" style={styles.formInput} placeholder="Ex: 3500" />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Fornecedor</label>
              <input type="text" style={styles.formInput} placeholder="Ex: Amazon Web Services" />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Categoria</label>
              <input type="text" style={styles.formInput} placeholder="Ex: Infraestrutura" />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Data de Vencimento</label>
              <input type="date" style={styles.formInput} />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Data de Pagamento</label>
              <input type="date" style={styles.formInput} />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Status</label>
              <select style={styles.formInput}>
                <option value="paga">Paga</option>
                <option value="pendente">Pendente</option>
                <option value="atrasada">Atrasada</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Projeto</label>
              <select style={styles.formInput}>
                <option value="conectafapes">ConectaFapes</option>
                <option value="agentes">AgentEs</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Tipo de Gasto</label>
              <select style={styles.formInput}>
                <option value="recorrente">Recorrente</option>
                <option value="eventual">Eventual</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Recorrência</label>
              <select style={styles.formInput}>
                <option value="mensal">Mensal</option>
                <option value="trimestral">Trimestral</option>
                <option value="semestral">Semestral</option>
                <option value="anual">Anual</option>
                <option value="semanal">Semanal</option>
              </select>
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

  // Renderizar modal de exclusão
  const renderizarModalExclusao = () => {
    if (!activeModal || activeModal.section !== "conta" || activeModal.type !== "delete" || !activeModal.id) return null

    const conta = contas.find((c) => c.id === activeModal.id)
    if (!conta) return null

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
              Tem certeza que deseja excluir a conta <strong>{conta.titulo}</strong>?
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

  // Renderizar card de conta com design melhorado
  const renderizarCardConta = (conta: ContaPagar) => {
    // Simulação de progresso para demonstração
    const progresso = Math.floor(Math.random() * 100)

    return (
      <div
        key={conta.id}
        style={{
          ...styles.contaCard,
          ...(conta.status === "paga"
            ? styles.contaPaga
            : conta.status === "pendente"
              ? styles.contaPendente
              : styles.contaAtrasada),
          ...obterClasseCategoria(conta.categoria),
          transform: animatedCards[conta.id] ? "translateX(0)" : "translateX(-10px)",
          opacity: animatedCards[conta.id] ? 1 : 0,
        }}
        className="conta-card-hover"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)"
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.3)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)"
          e.currentTarget.style.boxShadow = "none"
        }}
      >
        <div style={styles.contaHeader}>
          <h3 style={styles.contaTitulo}>
            {obterIconeCategoria(conta.categoria)}
            <span style={{ marginLeft: "8px" }}>{conta.titulo}</span>
          </h3>
          <span style={styles.contaValor}>{formatarMoeda(conta.valor)}</span>
        </div>
        <div style={styles.contaInfo}>
          <span>{conta.fornecedor}</span>
          <span>
            Vencimento: {formatarData(conta.dataVencimento)}
            {conta.dataPagamento && ` • Pago em: ${formatarData(conta.dataPagamento)}`}
          </span>
        </div>

        <div style={styles.progressBar} className="progress-animation">
          <div
            className="progress-fill"
            style={
              {
                ...styles.progressBarFill,
                width: `${progresso}%`,
                "--progress-width": `${progresso}%`,
              } as React.CSSProperties
            }
          ></div>
        </div>

        <div style={styles.contaActions}>
          <button
            style={{ ...styles.button, ...styles.buttonSecondary, padding: "4px 8px" }}
            onClick={() => onView(conta.id)}
            title="Visualizar detalhes"
            className="button-hover"
          >
            <Visibility style={{ fontSize: 16 }} />
          </button>
          <button
            style={{ ...styles.button, ...styles.buttonSecondary, padding: "4px 8px" }}
            onClick={() => iniciarEdicao(conta)}
            title="Editar conta"
            className="button-hover"
          >
            <Edit style={{ fontSize: 16 }} />
          </button>
          <button
            style={{ ...styles.button, ...styles.buttonDanger, padding: "4px 8px" }}
            onClick={() => onDelete(conta.id)}
            title="Excluir conta"
          >
            <Delete style={{ fontSize: 16 }} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>
        Contas a Pagar
        <button style={{ ...styles.button, ...styles.buttonModern }} onClick={onAdd} className="button-hover">
          <Add style={{ fontSize: 16, marginRight: 4 }} />
          Nova Conta
        </button>
      </h2>

      <div style={styles.cardContent}>
        <div style={styles.tabs}>
          <div
            style={activeTab === "todas" ? { ...styles.tab, ...styles.tabActive } : styles.tab}
            onClick={() => setActiveTab("todas")}
          >
            Todas ({contas.length})
          </div>
          <div
            style={activeTab === "pendentes" ? { ...styles.tab, ...styles.tabActive } : styles.tab}
            onClick={() => setActiveTab("pendentes")}
          >
            Pendentes ({contasPendentes})
          </div>
          <div
            style={activeTab === "pagas" ? { ...styles.tab, ...styles.tabActive } : styles.tab}
            onClick={() => setActiveTab("pagas")}
          >
            Pagas ({contasPagas})
          </div>
          <div
            style={activeTab === "atrasadas" ? { ...styles.tab, ...styles.tabActive } : styles.tab}
            onClick={() => setActiveTab("atrasadas")}
          >
            Atrasadas ({contasAtrasadas})
          </div>
        </div>

        <div style={styles.searchBar}>
          <input
            type="text"
            style={styles.searchInput}
            placeholder="Buscar contas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button style={{ ...styles.button, ...styles.buttonModern }} onClick={exportarCSV} className="button-hover">
            <GetApp style={{ fontSize: 16, marginRight: 4 }} />
            Exportar
          </button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
            backgroundColor: "#2a2a2a",
            padding: "12px 16px",
            borderRadius: "8px",
            animation: "fadeIn 0.5s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: tipoGastoSelecionado === "recorrentes" ? "#3498db" : "transparent",
                color: tipoGastoSelecionado === "recorrentes" ? "white" : "rgba(255, 255, 255, 0.7)",
                transition: "all 0.3s ease",
              }}
              onClick={() => setTipoGastoSelecionado("recorrentes")}
            >
              <RepeatOne style={{ fontSize: 16, marginRight: 8, verticalAlign: "middle" }} />
              Gastos Recorrentes
            </div>
            <div
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: tipoGastoSelecionado === "eventuais" ? "#3498db" : "transparent",
                color: tipoGastoSelecionado === "eventuais" ? "white" : "rgba(255, 255, 255, 0.7)",
                transition: "all 0.3s ease",
              }}
              onClick={() => setTipoGastoSelecionado("eventuais")}
            >
              <EventNote style={{ fontSize: 16, marginRight: 8, verticalAlign: "middle" }} />
              Gastos Eventuais
            </div>
          </div>
          <button
            style={{ ...styles.button, ...styles.buttonModern }}
            onClick={() => setTipoGastoPadrao(tipoGastoSelecionado)}
            className="button-hover"
          >
            Definir {tipoGastoSelecionado === "recorrentes" ? "Recorrentes" : "Eventuais"} como Padrão
          </button>
        </div>

        {tipoGastoSelecionado === "recorrentes" && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={styles.contasFilters}>
              <div
                style={
                  recorrenciaFilter === "todas"
                    ? { ...styles.contasFilter, ...styles.contasFilterActive }
                    : styles.contasFilter
                }
                onClick={() => setRecorrenciaFilter("todas")}
              >
                Todas
              </div>
              <div
                style={
                  recorrenciaFilter === "mensal"
                    ? { ...styles.contasFilter, ...styles.contasFilterActive }
                    : styles.contasFilter
                }
                onClick={() => setRecorrenciaFilter("mensal")}
              >
                Mensal
              </div>
              <div
                style={
                  recorrenciaFilter === "trimestral"
                    ? { ...styles.contasFilter, ...styles.contasFilterActive }
                    : styles.contasFilter
                }
                onClick={() => setRecorrenciaFilter("trimestral")}
              >
                Trimestral
              </div>
              <div
                style={
                  recorrenciaFilter === "semestral"
                    ? { ...styles.contasFilter, ...styles.contasFilterActive }
                    : styles.contasFilter
                }
                onClick={() => setRecorrenciaFilter("semestral")}
              >
                Semestral
              </div>
              <div
                style={
                  recorrenciaFilter === "anual"
                    ? { ...styles.contasFilter, ...styles.contasFilterActive }
                    : styles.contasFilter
                }
                onClick={() => setRecorrenciaFilter("anual")}
              >
                Anual
              </div>
              <div
                style={
                  recorrenciaFilter === "semanal"
                    ? { ...styles.contasFilter, ...styles.contasFilterActive }
                    : styles.contasFilter
                }
                onClick={() => setRecorrenciaFilter("semanal")}
              >
                Semanal
              </div>
            </div>

            <div style={{ overflowY: "auto", maxHeight: "400px" }}>
              {contasRecorrentesFiltradas.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px", color: "rgba(255, 255, 255, 0.7)" }}>
                  Nenhuma conta recorrente encontrada
                </div>
              ) : (
                contasRecorrentesFiltradas.map(renderizarCardConta)
              )}
            </div>
          </div>
        )}

        {tipoGastoSelecionado === "eventuais" && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ overflowY: "auto", maxHeight: "400px" }}>
              {contasEventuaisFiltradas.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px", color: "rgba(255, 255, 255, 0.7)" }}>
                  Nenhuma conta eventual encontrada
                </div>
              ) : (
                contasEventuaisFiltradas.map(renderizarCardConta)
              )}
            </div>
          </div>
        )}
      </div>

      {renderizarModalVisualizacao()}
      {renderizarModalEdicao()}
      {renderizarModalAdicao()}
      {renderizarModalExclusao()}
    </div>
  )
}
