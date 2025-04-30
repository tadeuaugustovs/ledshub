"use client"

import type React from "react"
import { useState } from "react"
import type { CompraRequisicao } from "../hooks/useFinanceiroData"
import { Close } from "@material-ui/icons"
import styles from "../styles.module.css"

interface ComprasRequisicoesProps {
  compras: CompraRequisicao[]
  onEdit: (id: string) => void
  activeModal: {
    type: "view" | "edit" | "add" | "delete"
    section: "bolsa" | "bolsista" | "prestacao" | "projeto" | "conta" | "compra"
    id: string | null
  } | null
  onCloseModal: () => void
}

export const ComprasRequisicoes: React.FC<ComprasRequisicoesProps> = ({
  compras,
  onEdit,
  activeModal,
  onCloseModal,
}) => {
  const [editingCompra, setEditingCompra] = useState<CompraRequisicao | null>(null)

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

  // Função para iniciar edição de compra
  const iniciarEdicao = (compra: CompraRequisicao) => {
    setEditingCompra({ ...compra })
    onEdit(compra.id)
  }

  // Função para salvar edição de compra
  const salvarEdicao = () => {
    console.log("Salvando compra editada:", editingCompra)
    onCloseModal()
    setEditingCompra(null)
  }

  // Função para obter a classe de prioridade
  const obterClassePrioridade = (prioridade: "baixa" | "media" | "alta") => {
    switch (prioridade) {
      case "baixa":
        return styles.badgeSuccess
      case "media":
        return styles.badgeWarning
      case "alta":
        return styles.badgeDanger
      default:
        return ""
    }
  }

  // Função para obter o texto de prioridade
  const obterTextoPrioridade = (prioridade: "baixa" | "media" | "alta") => {
    switch (prioridade) {
      case "baixa":
        return "Baixa"
      case "media":
        return "Média"
      case "alta":
        return "Alta"
      default:
        return ""
    }
  }

  // Função para obter a classe de status
  const obterClasseStatus = (status: string) => {
    switch (status) {
      case "solicitada":
        return styles.badgeWarning
      case "aprovada":
        return styles.badgeSuccess
      case "rejeitada":
        return styles.badgeDanger
      case "comprada":
        return styles.badgeSuccess
      case "entregue":
        return styles.badgeSuccess
      default:
        return ""
    }
  }

  // Função para obter o texto de status
  const obterTextoStatus = (status: string) => {
    switch (status) {
      case "solicitada":
        return "Solicitada"
      case "aprovada":
        return "Aprovada"
      case "rejeitada":
        return "Rejeitada"
      case "comprada":
        return "Comprada"
      case "entregue":
        return "Entregue"
      default:
        return ""
    }
  }

  // Renderizar modal de visualização
  const renderizarModalVisualizacao = () => {
    if (!activeModal || activeModal.section !== "compra" || activeModal.type !== "view" || !activeModal.id) return null

    const compra = compras.find((c) => c.id === activeModal.id)
    if (!compra) return null

    return (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Detalhes da Requisição</h3>
            <button className={styles.modalClose} onClick={onCloseModal}>
              <Close />
            </button>
          </div>

          <div>
            <p>
              <strong>Título:</strong> {compra.titulo}
            </p>
            <p>
              <strong>Descrição:</strong> {compra.descricao}
            </p>
            <p>
              <strong>Valor:</strong> {formatarMoeda(compra.valor)}
            </p>
            <p>
              <strong>Solicitante:</strong> {compra.solicitante}
            </p>
            <p>
              <strong>Aprovador:</strong> {compra.aprovador || "—"}
            </p>
            <p>
              <strong>Data de Requisição:</strong> {formatarData(compra.dataRequisicao)}
            </p>
            <p>
              <strong>Data de Aprovação:</strong> {formatarData(compra.dataAprovacao)}
            </p>
            <p>
              <strong>Data de Compra:</strong> {formatarData(compra.dataCompra)}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={obterClasseStatus(compra.status)}>{obterTextoStatus(compra.status)}</span>
            </p>
            <p>
              <strong>Prioridade:</strong>{" "}
              <span className={obterClassePrioridade(compra.prioridade)}>{obterTextoPrioridade(compra.prioridade)}</span>
            </p>
            <p>
              <strong>Projeto:</strong> {compra.projetoId}
            </p>
          </div>

          <div className={styles.modalFooter}>
            <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={onCloseModal}>
              Fechar
            </button>
            <button
              className={`${styles.button} ${styles.buttonPrimary}`}
              onClick={() => {
                onCloseModal()
                iniciarEdicao(compra)
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
    if (!activeModal || activeModal.section !== "compra" || activeModal.type !== "edit" || !editingCompra) return null

    return (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Editar Requisição</h3>
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
                value={editingCompra.titulo}
                onChange={(e) => setEditingCompra({ ...editingCompra, titulo: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Descrição</label>
              <textarea
                className={styles.formTextarea}
                value={editingCompra.descricao}
                onChange={(e) => setEditingCompra({ ...editingCompra, descricao: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Valor</label>
              <input
                type="number"
                className={styles.formInput}
                value={editingCompra.valor}
                onChange={(e) => setEditingCompra({ ...editingCompra, valor: Number(e.target.value) })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Solicitante</label>
              <input
                type="text"
                className={styles.formInput}
                value={editingCompra.solicitante}
                onChange={(e) => setEditingCompra({ ...editingCompra, solicitante: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={onCloseModal}>
              Cancelar
            </button>
            <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={salvarEdicao}>
              Salvar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {renderizarModalVisualizacao()}
      {renderizarModalEdicao()}
    </div>
  )
}