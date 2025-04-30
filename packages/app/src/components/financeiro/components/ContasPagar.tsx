"use client"

import type React from "react"
import { useState } from "react"
import type { ContaPagar } from "../hooks/useFinanceiroData"
import { Visibility, Edit, Delete, Close, Save, Add, AttachFile } from "@material-ui/icons"
import styles from "../styles.module.css"

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

  // Filtrar contas com base na aba ativa e termo de busca
  const contasFiltradas = contas.filter((conta) => {
    const matchesTab =
      activeTab === "todas" ||
      (activeTab === "pendentes" && conta.status === "pendente") ||
      (activeTab === "pagas" && conta.status === "paga") ||
      (activeTab === "atrasadas" && conta.status === "atrasada")

    const matchesSearch =
      conta.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conta.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conta.categoria.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesTab && matchesSearch
  })

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
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Detalhes da Conta</h3>
            <button className={styles.modalClose} onClick={onCloseModal}>
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
                className={
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

            {conta.comprovante && (
              <div style={{ marginTop: 16 }}>
                <p>
                  <strong>Comprovante:</strong>
                </p>
                <div
                  style={{
                    padding: 12,
                    backgroundColor: "var(--color-surface-variant)",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <AttachFile />
                  <span>Comprovante de pagamento</span>
                  <button
                    className={`${styles.button} ${styles.buttonSecondary}`}
                    style={{ marginLeft: "auto", padding: "4px 8px" }}
                  >
                    Visualizar
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className={styles.modalFooter}>
            <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={onCloseModal}>
              Fechar
            </button>
            <button
              className={`${styles.button} ${styles.buttonPrimary}`}
              onClick={() => {
                onCloseModal()
                iniciarEdicao(conta)
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
    if (!activeModal || activeModal.section !== "conta" || activeModal.type !== "edit" || !editingConta) return null

    return (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Editar Conta</h3>
            <button className={styles.modalClose} onClick={onCloseModal}>
              <Close />
            </button>
          </div>

          <div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Título</label>
              <input
                type="text"
                className={styles.formInput}
                value={editingConta.titulo}
                onChange={(e) => setEditingConta({ ...editingConta, titulo: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Valor</label>
              <input
                type="number"
                className={styles.formInput}
                value={editingConta.valor}
                onChange={(e) => setEditingConta({ ...editingConta, valor: Number(e.target.value) })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Fornecedor</label>
              <input
                type="text"
                className={styles.formInput}
                value={editingConta.fornecedor}
                onChange={(e) => setEditingConta({ ...editingConta, fornecedor: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Categoria</label>
              <input
                type="text"
                className={styles.formInput}
                value={editingConta.categoria}
                onChange={(e) => setEditingConta({ ...editingConta, categoria: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Data de Vencimento</label>
              <input
                type="date"
                className={styles.formInput}
                value={editingConta.dataVencimento.split("T")[0]}
                onChange={(e) => setEditingConta({ ...editingConta, dataVencimento: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Data de Pagamento</label>
              <input
                type="date"
                className={styles.formInput}
                value={editingConta.dataPagamento ? editingConta.dataPagamento.split("T")[0] : ""}
                onChange={(e) => setEditingConta({ ...editingConta, dataPagamento: e.target.value || null })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Status</label>
              <select
                className={styles.formInput}
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

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Projeto</label>
              <input
                type="text"
                className={styles.formInput}
                value={editingConta.projetoId}
                onChange={(e) => setEditingConta({ ...editingConta, projetoId: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Comprovante</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input type="file" className={styles.formInput} />
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={onCloseModal}>
              Cancelar
            </button>
            <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={salvarEdicao}>
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
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Adicionar Nova Conta</h3>
            <button className={styles.modalClose} onClick={onCloseModal}>
              <Close />
            </button>
          </div>

          <div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Título</label>
              <input type="text" className={styles.formInput} placeholder="Ex: Aluguel de Servidores" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Valor</label>
              <input type="number" className={styles.formInput} placeholder="Ex: 3500" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Fornecedor</label>
              <input type="text" className={styles.formInput} placeholder="Ex: Amazon Web Services" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Categoria</label>
              <input type="text" className={styles.formInput} placeholder="Ex: Infraestrutura" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Data de Vencimento</label>
              <input type="date" className={styles.formInput} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Data de Pagamento</label>
              <input type="date" className={styles.formInput} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Status</label>
              <select className={styles.formInput}>
                <option value="paga">Paga</option>
                <option value="pendente">Pendente</option>
                <option value="atrasada">Atrasada</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Projeto</label>
              <select className={styles.formInput}>
                <option value="conectafapes">ConectaFapes</option>
                <option value="agentes">AgentEs</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Comprovante</label>
              <input type="file" className={styles.formInput} />
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={onCloseModal}>
              Cancelar
            </button>
            <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={onCloseModal}>
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
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Confirmar Exclusão</h3>
            <button className={styles.modalClose} onClick={onCloseModal}>
              <Close />
            </button>
          </div>

          <div>
            <p>
              Tem certeza que deseja excluir a conta <strong>{conta.titulo}</strong>?
            </p>
            <p>Esta ação não pode ser desfeita.</p>
          </div>

          <div className={styles.modalFooter}>
            <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={onCloseModal}>
              Cancelar
            </button>
            <button className={`${styles.button} ${styles.buttonDanger}`} onClick={onCloseModal}>
              <Delete style={{ fontSize: 16, marginRight: 4 }} />
              Excluir
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>
        Contas a Pagar
        <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={onAdd}>
          <Add style={{ fontSize: 16, marginRight: 4 }} />
          Nova Conta
        </button>
      </h2>

      <div className={styles.cardContent}>
        <div className={styles.tabs}>
          <div
            className={`${styles.tab} ${activeTab === "todas" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("todas")}
          >
            Todas ({contas.length})
          </div>
          <div
            className={`${styles.tab} ${activeTab === "pendentes" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("pendentes")}
          >
            Pendentes ({contasPendentes})
          </div>
          <div
            className={`${styles.tab} ${activeTab === "pagas" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("pagas")}
          >
            Pagas ({contasPagas})
          </div>
          <div
            className={`${styles.tab} ${activeTab === "atrasadas" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("atrasadas")}
          >
            Atrasadas ({contasAtrasadas})
          </div>
        </div>

        <div className={styles.searchBar}>
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Buscar contas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span style={{ position: "absolute", right: 10, top: 8, color: "var(--color-secondary-text)" }}>
              <Visibility style={{ fontSize: 20 }} />
            </span>
          </div>
        </div>

        <div style={{ overflowY: "auto", maxHeight: "400px" }}>
          {contasFiltradas.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px", color: "var(--color-secondary-text)" }}>
              Nenhuma conta encontrada
            </div>
          ) : (
            contasFiltradas.map((conta) => (
              <div
                key={conta.id}
                className={`${styles.contaCard} ${
                  conta.status === "paga"
                    ? styles.contaPaga
                    : conta.status === "pendente"
                      ? styles.contaPendente
                      : styles.contaAtrasada
                }`}
              >
                <div className={styles.contaHeader}>
                  <h3 className={styles.contaTitulo}>{conta.titulo}</h3>
                  <span className={styles.contaValor}>{formatarMoeda(conta.valor)}</span>
                </div>
                <div className={styles.contaInfo}>
                  <span>{conta.fornecedor}</span>
                  <span>
                    Vencimento: {formatarData(conta.dataVencimento)}
                    {conta.dataPagamento && ` • Pago em: ${formatarData(conta.dataPagamento)}`}
                  </span>
                </div>
                <div className={styles.contaActions}>
                  <button
                    className={`${styles.button} ${styles.buttonSecondary}`}
                    onClick={() => onView(conta.id)}
                    style={{ padding: "4px 8px" }}
                  >
                    <Visibility style={{ fontSize: 16 }} />
                  </button>
                  <button
                    className={`${styles.button} ${styles.buttonSecondary}`}
                    onClick={() => iniciarEdicao(conta)}
                    style={{ padding: "4px 8px" }}
                  >
                    <Edit style={{ fontSize: 16 }} />
                  </button>
                  <button
                    className={`${styles.button} ${styles.buttonDanger}`}
                    onClick={() => onDelete(conta.id)}
                    style={{ padding: "4px 8px" }}
                  >
                    <Delete style={{ fontSize: 16 }} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {renderizarModalVisualizacao()}
      {renderizarModalEdicao()}
      {renderizarModalAdicao()}
      {renderizarModalExclusao()}
    </div>
  )
}
