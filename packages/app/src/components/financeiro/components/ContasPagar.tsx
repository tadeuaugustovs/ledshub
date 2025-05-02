"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { ContaPagar } from "../hooks/useFinanceiroData"
import {
  Visibility,
  Edit,
  Delete,
  Add,
  Close,
  Save,
  FilterList,
  GetApp,
  CalendarToday,
  Business,
  Category,
  CheckCircle,
  Warning,
  Schedule,
} from "@material-ui/icons"

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
  const [filtroStatus, setFiltroStatus] = useState<"todas" | "pendente" | "paga" | "atrasada">("todas")
  const [searchTerm, setSearchTerm] = useState("")
  const [editingConta, setEditingConta] = useState<ContaPagar | null>(null)
  const [newConta, setNewConta] = useState<Omit<ContaPagar, "id">>({
    titulo: "",
    valor: 0,
    dataVencimento: new Date().toISOString().split("T")[0],
    dataPagamento: null,
    fornecedor: "",
    categoria: "",
    status: "pendente",
    projetoId: "conectafapes",
  })
  const [animatedItems, setAnimatedItems] = useState<{ [key: string]: boolean }>({})

  // Animar itens ao carregar
  useEffect(() => {
    const timer = setTimeout(() => {
      const newAnimatedItems: { [key: string]: boolean } = {}
      contas.forEach((conta, index) => {
        setTimeout(() => {
          setAnimatedItems((prev) => ({ ...prev, [conta.id]: true }))
        }, index * 100)
      })
      setAnimatedItems(newAnimatedItems)
    }, 100)

    return () => clearTimeout(timer)
  }, [contas])

  // Filtrar contas com base no status e termo de busca
  const contasFiltradas = contas.filter((conta) => {
    const matchesStatus = filtroStatus === "todas" || conta.status === filtroStatus
    const matchesSearch =
      conta.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conta.fornecedor.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Contagem por status
  const contagens = {
    todas: contas.length,
    pendente: contas.filter((c) => c.status === "pendente").length,
    paga: contas.filter((c) => c.status === "paga").length,
    atrasada: contas.filter((c) => c.status === "atrasada").length,
  }

  // Função para formatar valores monetários
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  // Função para formatar datas
  const formatarData = (dataString: string | null) => {
    if (!dataString) return "N/A"
    const data = new Date(dataString)
    return data.toLocaleDateString("pt-BR")
  }

  // Função para iniciar edição
  const iniciarEdicao = (conta: ContaPagar) => {
    setEditingConta({ ...conta })
    onEdit(conta.id)
  }

  // Função para salvar edição
  const salvarEdicao = () => {
    // Aqui seria implementada a lógica para salvar as alterações no banco de dados
    if (editingConta) {
      console.log("Salvando conta editada:", editingConta)
      // Na implementação real, aqui seria feita uma chamada para a API
    }
    onCloseModal()
    setEditingConta(null)
  }

  // Função para salvar nova conta
  const salvarNovaConta = () => {
    console.log("Salvando nova conta:", newConta)
    // Na implementação real, aqui seria feita uma chamada para a API

    // Resetar o formulário
    setNewConta({
      titulo: "",
      valor: 0,
      dataVencimento: new Date().toISOString().split("T")[0],
      dataPagamento: null,
      fornecedor: "",
      categoria: "",
      status: "pendente",
      projetoId: "conectafapes",
    })

    onCloseModal()
  }

  // Função para confirmar exclusão
  const confirmarExclusao = () => {
    if (activeModal?.id) {
      onDelete(activeModal.id)
      onCloseModal()
    }
  }

  // Função para exportar dados em CSV
  const exportarCSV = () => {
    const headers = ["Título", "Valor", "Vencimento", "Pagamento", "Fornecedor", "Categoria", "Status", "Projeto"]
    const csvContent = [
      headers.join(","),
      ...contasFiltradas.map((conta) =>
        [
          conta.titulo,
          conta.valor,
          conta.dataVencimento,
          conta.dataPagamento || "",
          conta.fornecedor,
          conta.categoria,
          conta.status,
          conta.projetoId,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "contas_a_pagar.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Renderizar modal de visualização
  const renderizarModalVisualizacao = () => {
    if (!activeModal || activeModal.section !== "conta" || activeModal.type !== "view" || !activeModal.id) return null

    const conta = contas.find((c) => c.id === activeModal.id)
    if (!conta) return null

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            backgroundColor: "#1e1e1e",
            borderRadius: "12px",
            padding: "24px",
            width: "90%",
            maxWidth: "500px",
            maxHeight: "90vh",
            overflowY: "auto",
            position: "relative",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Detalhes da Conta</h2>
          <button
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
            onClick={onCloseModal}
          >
            <Close />
          </button>

          <div style={{ marginBottom: "16px" }}>
            <h3 style={{ margin: "0 0 8px 0" }}>{conta.titulo}</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 16px 0" }}>{formatarMoeda(conta.valor)}</p>

            <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
              <CalendarToday style={{ marginRight: "8px", fontSize: "18px" }} />
              <span>Vencimento: {formatarData(conta.dataVencimento)}</span>
            </div>

            {conta.dataPagamento && (
              <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                <CheckCircle style={{ marginRight: "8px", fontSize: "18px", color: "#2ecc71" }} />
                <span>Pago em: {formatarData(conta.dataPagamento)}</span>
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
              <Business style={{ marginRight: "8px", fontSize: "18px" }} />
              <span>Fornecedor: {conta.fornecedor}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
              <Category style={{ marginRight: "8px", fontSize: "18px" }} />
              <span>Categoria: {conta.categoria}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
              {conta.status === "paga" && (
                <CheckCircle style={{ marginRight: "8px", fontSize: "18px", color: "#2ecc71" }} />
              )}
              {conta.status === "pendente" && (
                <Schedule style={{ marginRight: "8px", fontSize: "18px", color: "#f39c12" }} />
              )}
              {conta.status === "atrasada" && (
                <Warning style={{ marginRight: "8px", fontSize: "18px", color: "#e74c3c" }} />
              )}
              <span>
                Status: {conta.status === "paga" && "Paga"}
                {conta.status === "pendente" && "Pendente"}
                {conta.status === "atrasada" && "Atrasada"}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
            <button
              style={{
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
              onClick={() => {
                onCloseModal()
                onDelete(conta.id)
              }}
            >
              <Delete fontSize="small" /> Excluir
            </button>
            <button
              style={{
                backgroundColor: "#3498db",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
              onClick={() => {
                onCloseModal()
                iniciarEdicao(conta)
              }}
            >
              <Edit fontSize="small" /> Editar
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
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            backgroundColor: "#1e1e1e",
            borderRadius: "12px",
            padding: "24px",
            width: "90%",
            maxWidth: "500px",
            maxHeight: "90vh",
            overflowY: "auto",
            position: "relative",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Editar Conta</h2>
          <button
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
            onClick={onCloseModal}
          >
            <Close />
          </button>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px" }}>Título</label>
            <input
              type="text"
              value={editingConta.titulo}
              onChange={(e) => setEditingConta({ ...editingConta, titulo: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "#333",
                border: "1px solid #555",
                borderRadius: "4px",
                color: "white",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px" }}>Valor</label>
            <input
              type="number"
              value={editingConta.valor}
              onChange={(e) => setEditingConta({ ...editingConta, valor: Number(e.target.value) })}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "#333",
                border: "1px solid #555",
                borderRadius: "4px",
                color: "white",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px" }}>Data de Vencimento</label>
            <input
              type="date"
              value={editingConta.dataVencimento.split("T")[0]}
              onChange={(e) => setEditingConta({ ...editingConta, dataVencimento: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "#333",
                border: "1px solid #555",
                borderRadius: "4px",
                color: "white",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px" }}>Data de Pagamento</label>
            <input
              type="date"
              value={editingConta.dataPagamento ? editingConta.dataPagamento.split("T")[0] : ""}
              onChange={(e) => setEditingConta({ ...editingConta, dataPagamento: e.target.value || null })}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "#333",
                border: "1px solid #555",
                borderRadius: "4px",
                color: "white",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px" }}>Fornecedor</label>
            <input
              type="text"
              value={editingConta.fornecedor}
              onChange={(e) => setEditingConta({ ...editingConta, fornecedor: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "#333",
                border: "1px solid #555",
                borderRadius: "4px",
                color: "white",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px" }}>Categoria</label>
            <input
              type="text"
              value={editingConta.categoria}
              onChange={(e) => setEditingConta({ ...editingConta, categoria: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "#333",
                border: "1px solid #555",
                borderRadius: "4px",
                color: "white",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px" }}>Status</label>
            <select
              value={editingConta.status}
              onChange={(e) =>
                setEditingConta({ ...editingConta, status: e.target.value as "paga" | "pendente" | "atrasada" })
              }
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "#333",
                border: "1px solid #555",
                borderRadius: "4px",
                color: "white",
              }}
            >
              <option value="pendente">Pendente</option>
              <option value="paga">Paga</option>
              <option value="atrasada">Atrasada</option>
            </select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px" }}>Projeto</label>
            <select
              value={editingConta.projetoId}
              onChange={(e) => setEditingConta({ ...editingConta, projetoId: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "#333",
                border: "1px solid #555",
                borderRadius: "4px",
                color: "white",
              }}
            >
              <option value="conectafapes">ConectaFapes</option>
              <option value="agentes">AgentEs</option>
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
            <button
              style={{
                backgroundColor: "#7f8c8d",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={onCloseModal}
            >
              Cancelar
            </button>
            <button
              style={{
                backgroundColor: "#3498db",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
              onClick={salvarEdicao}
            >
              <Save fontSize="small" /> Salvar
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
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            backgroundColor: "#1e1e1e",
            borderRadius: "12px",
            padding: "24px",
            width: "90%",
            maxWidth: "500px",
            maxHeight: "90vh",
            overflowY: "auto",
            position: "relative",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Nova Conta</h2>
          <button
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
            onClick={onCloseModal}
          >
            <Close />
          </button>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px" }}>Título</label>
            <input
              type="text"
              value={newConta.titulo}
              onChange={(e) => setNewConta({ ...newConta, titulo: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "#333",
                border: "1px solid #555",
                borderRadius: "4px",
                color: "white",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px" }}>Valor</label>
            <input
              type="number"
              value={newConta.valor}
              onChange={(e) => setNewConta({ ...newConta, valor: Number(e.target.value) })}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "#333",
                border: "1px solid #555",
                borderRadius: "4px",
                color: "white",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px" }}>Data de Vencimento</label>
            <input
              type="date"
              value={newConta.dataVencimento}
              onChange={(e) => setNewConta({ ...newConta, dataVencimento: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "#333",
                border: "1px solid #555",
                borderRadius: "4px",
                color: "white",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px" }}>Fornecedor</label>
            <input
              type="text"
              value={newConta.fornecedor}
              onChange={(e) => setNewConta({ ...newConta, fornecedor: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "#333",
                border: "1px solid #555",
                borderRadius: "4px",
                color: "white",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px" }}>Categoria</label>
            <input
              type="text"
              value={newConta.categoria}
              onChange={(e) => setNewConta({ ...newConta, categoria: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "#333",
                border: "1px solid #555",
                borderRadius: "4px",
                color: "white",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px" }}>Status</label>
            <select
              value={newConta.status}
              onChange={(e) => setNewConta({ ...newConta, status: e.target.value as "paga" | "pendente" | "atrasada" })}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "#333",
                border: "1px solid #555",
                borderRadius: "4px",
                color: "white",
              }}
            >
              <option value="pendente">Pendente</option>
              <option value="paga">Paga</option>
              <option value="atrasada">Atrasada</option>
            </select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px" }}>Projeto</label>
            <select
              value={newConta.projetoId}
              onChange={(e) => setNewConta({ ...newConta, projetoId: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "#333",
                border: "1px solid #555",
                borderRadius: "4px",
                color: "white",
              }}
            >
              <option value="conectafapes">ConectaFapes</option>
              <option value="agentes">AgentEs</option>
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
            <button
              style={{
                backgroundColor: "#7f8c8d",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={onCloseModal}
            >
              Cancelar
            </button>
            <button
              style={{
                backgroundColor: "#3498db",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
              onClick={salvarNovaConta}
            >
              <Save fontSize="small" /> Salvar
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
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            backgroundColor: "#1e1e1e",
            borderRadius: "12px",
            padding: "24px",
            width: "90%",
            maxWidth: "500px",
            position: "relative",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Confirmar Exclusão</h2>
          <button
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
            onClick={onCloseModal}
          >
            <Close />
          </button>

          <p>Tem certeza que deseja excluir a conta "{conta.titulo}"?</p>
          <p>Esta ação não pode ser desfeita.</p>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
            <button
              style={{
                backgroundColor: "#7f8c8d",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={onCloseModal}
            >
              Cancelar
            </button>
            <button
              style={{
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
              onClick={confirmarExclusao}
            >
              <Delete fontSize="small" /> Excluir
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        backgroundColor: "#1e1e1e",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        padding: "20px",
        height: "100%",
        transition: "box-shadow 0.3s ease, transform 0.2s ease",
        border: "1px solid #333333",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 600,
            margin: 0,
            color: "#ffffff",
          }}
        >
          Contas a Pagar
        </h2>
        <button
          style={{
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
          onClick={onAdd}
        >
          <Add fontSize="small" /> Nova Conta
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "16px",
          overflowX: "auto",
          padding: "4px 0",
        }}
      >
        <button
          style={{
            backgroundColor: filtroStatus === "todas" ? "#3498db" : "#2a2a2a",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "20px",
            cursor: "pointer",
          }}
          onClick={() => setFiltroStatus("todas")}
        >
          Todas ({contagens.todas})
        </button>
        <button
          style={{
            backgroundColor: filtroStatus === "pendente" ? "#f39c12" : "#2a2a2a",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "20px",
            cursor: "pointer",
          }}
          onClick={() => setFiltroStatus("pendente")}
        >
          Pendentes ({contagens.pendente})
        </button>
        <button
          style={{
            backgroundColor: filtroStatus === "paga" ? "#2ecc71" : "#2a2a2a",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "20px",
            cursor: "pointer",
          }}
          onClick={() => setFiltroStatus("paga")}
        >
          Pagas ({contagens.paga})
        </button>
        <button
          style={{
            backgroundColor: filtroStatus === "atrasada" ? "#e74c3c" : "#2a2a2a",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "20px",
            cursor: "pointer",
          }}
          onClick={() => setFiltroStatus("atrasada")}
        >
          Atrasadas ({contagens.atrasada})
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        <div style={{ flex: 1, position: "relative" }}>
          <input
            type="text"
            placeholder="Buscar contas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 16px",
              paddingLeft: "36px",
              backgroundColor: "#2a2a2a",
              border: "1px solid #333",
              borderRadius: "4px",
              color: "white",
            }}
          />
          <FilterList
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#999",
            }}
          />
        </div>
        <button
          style={{
            backgroundColor: "#2a2a2a",
            color: "#3498db",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
          onClick={exportarCSV}
        >
          <GetApp fontSize="small" /> Exportar
        </button>
      </div>

      <div>
        {contasFiltradas.length === 0 ? (
          <div
            style={{
              padding: "32px",
              textAlign: "center",
              backgroundColor: "#2a2a2a",
              borderRadius: "8px",
              marginTop: "16px",
            }}
          >
            <p>Nenhuma conta encontrada.</p>
          </div>
        ) : (
          contasFiltradas.map((conta) => (
            <div
              key={conta.id}
              style={{
                backgroundColor: "#2a2a2a",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "12px",
                borderLeft: `4px solid ${
                  conta.status === "paga" ? "#2ecc71" : conta.status === "pendente" ? "#f39c12" : "#e74c3c"
                }`,
                opacity: animatedItems[conta.id] ? 1 : 0,
                transform: animatedItems[conta.id] ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 8px 0" }}>{conta.titulo}</h3>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Business fontSize="small" style={{ color: "#999" }} />
                      <span style={{ color: "#999" }}>{conta.fornecedor}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Category fontSize="small" style={{ color: "#999" }} />
                      <span style={{ color: "#999" }}>{conta.categoria}</span>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "4px" }}>
                    {formatarMoeda(conta.valor)}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end" }}>
                    <CalendarToday fontSize="small" style={{ color: "#999" }} />
                    <span style={{ color: "#999" }}>Vencimento: {formatarData(conta.dataVencimento)}</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "12px",
                  paddingTop: "12px",
                  borderTop: "1px solid #333",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {conta.status === "paga" && (
                    <>
                      <CheckCircle fontSize="small" style={{ color: "#2ecc71" }} />
                      <span style={{ color: "#2ecc71" }}>Paga em {formatarData(conta.dataPagamento)}</span>
                    </>
                  )}
                  {conta.status === "pendente" && (
                    <>
                      <Schedule fontSize="small" style={{ color: "#f39c12" }} />
                      <span style={{ color: "#f39c12" }}>Pendente</span>
                    </>
                  )}
                  {conta.status === "atrasada" && (
                    <>
                      <Warning fontSize="small" style={{ color: "#e74c3c" }} />
                      <span style={{ color: "#e74c3c" }}>Atrasada</span>
                    </>
                  )}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    style={{
                      backgroundColor: "transparent",
                      color: "#3498db",
                      border: "1px solid #3498db",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={() => onView(conta.id)}
                  >
                    <Visibility fontSize="small" />
                  </button>
                  <button
                    style={{
                      backgroundColor: "transparent",
                      color: "#f39c12",
                      border: "1px solid #f39c12",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={() => iniciarEdicao(conta)}
                  >
                    <Edit fontSize="small" />
                  </button>
                  <button
                    style={{
                      backgroundColor: "transparent",
                      color: "#e74c3c",
                      border: "1px solid #e74c3c",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={() => onDelete(conta.id)}
                  >
                    <Delete fontSize="small" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {renderizarModalVisualizacao()}
      {renderizarModalEdicao()}
      {renderizarModalAdicao()}
      {renderizarModalExclusao()}
    </div>
  )
}
