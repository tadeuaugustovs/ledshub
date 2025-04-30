"use client"

import type React from "react"
import { useState } from "react"
import type { Bolsista } from "../hooks/useFinanceiroData"
import { Visibility, Edit, Close, Save } from "@material-ui/icons"
import styles from "../styles.module.css"

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
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Detalhes do Bolsista</h3>
            <button className={styles.modalClose} onClick={onCloseModal}>
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

            <h4 style={{ marginTop: 20, marginBottom: 10 }}>Histórico de Bolsas</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Bolsa</th>
                  <th>Início</th>
                  <th>Fim</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {bolsista.historicoBolsas.map((historico, index) => (
                  <tr key={index}>
                    <td>{historico.nomeBolsa}</td>
                    <td>{formatarData(historico.dataInicio)}</td>
                    <td>{formatarData(historico.dataFim)}</td>
                    <td>{formatarMoeda(historico.valor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.modalFooter}>
            <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={onCloseModal}>
              Fechar
            </button>
            <button
              className={`${styles.button} ${styles.buttonPrimary}`}
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
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Editar Bolsista</h3>
            <button className={styles.modalClose} onClick={onCloseModal}>
              <Close />
            </button>
          </div>

          <div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nome</label>
              <input
                type="text"
                className={styles.formInput}
                value={editingBolsista.nome}
                onChange={(e) => setEditingBolsista({ ...editingBolsista, nome: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Vínculo</label>
              <select
                className={styles.formInput}
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

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Função</label>
              <input
                type="text"
                className={styles.formInput}
                value={editingBolsista.funcao}
                onChange={(e) => setEditingBolsista({ ...editingBolsista, funcao: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Bolsa Atual</label>
              <input
                type="text"
                className={styles.formInput}
                value={editingBolsista.bolsaAtual}
                onChange={(e) => setEditingBolsista({ ...editingBolsista, bolsaAtual: e.target.value })}
              />
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

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Bolsistas</h2>

      <div className={styles.cardContent}>
        <div className={styles.searchBar}>
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Buscar bolsistas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span style={{ position: "absolute", right: 10, top: 8, color: "var(--color-secondary-text)" }}>
              <Visibility style={{ fontSize: 20 }} />
            </span>
          </div>
        </div>

        <div style={{ overflowY: "auto", maxHeight: "400px" }}>
          {bolsistasFiltrados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px", color: "var(--color-secondary-text)" }}>
              Nenhum bolsista encontrado
            </div>
          ) : (
            bolsistasFiltrados.map((bolsista) => (
              <div key={bolsista.id} className={styles.card} style={{ marginBottom: 12, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16 }}>{bolsista.nome}</h3>
                    <p style={{ margin: "4px 0", fontSize: 14, color: "var(--color-secondary-text)" }}>
                      {bolsista.vinculo} • {bolsista.funcao}
                    </p>
                    <p style={{ margin: "4px 0", fontSize: 14 }}>
                      <strong>Bolsa:</strong> {bolsista.bolsaAtual}
                    </p>
                  </div>

                  <div className={styles.tableActions}>
                    <button
                      className={`${styles.button} ${styles.buttonSecondary}`}
                      onClick={() => onView(bolsista.id)}
                      style={{ padding: "4px 8px" }}
                    >
                      <Visibility style={{ fontSize: 16 }} />
                    </button>
                    <button
                      className={`${styles.button} ${styles.buttonSecondary}`}
                      onClick={() => iniciarEdicao(bolsista)}
                      style={{ padding: "4px 8px" }}
                    >
                      <Edit style={{ fontSize: 16 }} />
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
    </div>
  )
}
