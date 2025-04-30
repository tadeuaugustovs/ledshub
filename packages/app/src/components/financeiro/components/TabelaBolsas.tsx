"use client"

import type React from "react"
import { useState } from "react"
import type { Bolsa } from "../hooks/useFinanceiroData"
import { Search, FilterList, Visibility, Edit, GetApp, Close, Save } from "@material-ui/icons"
import styles from "../styles.module.css"

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
    const headers = ["Nome", "Valor", "Sponsor", "Quantidade de Membros"]
    const csvContent = [
      headers.join(","),
      ...bolsasFiltradas.map((bolsa) => [bolsa.nome, bolsa.valor, bolsa.sponsor, bolsa.quantidadeMembros].join(",")),
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
    // Aqui seria implementada a lógica para salvar as alterações
    // Por exemplo, chamar uma API ou atualizar o estado global
    console.log("Salvando bolsa editada:", editingBolsa)
    onCloseModal()
    setEditingBolsa(null)
  }

  // Renderizar modal de visualização
  const renderizarModalVisualizacao = () => {
    if (!activeModal || activeModal.section !== "bolsa" || activeModal.type !== "view" || !activeModal.id) return null

    const bolsa = bolsas.find((b) => b.id === activeModal.id)
    if (!bolsa) return null

    return (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Detalhes da Bolsa</h3>
            <button className={styles.modalClose} onClick={onCloseModal}>
              <Close />
            </button>
          </div>

          <div>
            <p>
              <strong>Nome:</strong> {bolsa.nome}
            </p>
            <p>
              <strong>Valor:</strong> {formatarMoeda(bolsa.valor)}
            </p>
            <p>
              <strong>Sponsor:</strong> {bolsa.sponsor}
            </p>
            <p>
              <strong>Quantidade de Membros:</strong> {bolsa.quantidadeMembros}
            </p>
            {bolsa.isAtipico && (
              <p>
                <strong>Observação:</strong> <span className={styles.badgeWarning}>Valor Atípico</span>
              </p>
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
                iniciarEdicao(bolsa)
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
    if (!activeModal || activeModal.section !== "bolsa" || activeModal.type !== "edit" || !editingBolsa) return null

    return (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Editar Bolsa</h3>
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
                value={editingBolsa.nome}
                onChange={(e) => setEditingBolsa({ ...editingBolsa, nome: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Valor</label>
              <input
                type="number"
                className={styles.formInput}
                value={editingBolsa.valor}
                onChange={(e) => setEditingBolsa({ ...editingBolsa, valor: Number(e.target.value) })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Sponsor</label>
              <input
                type="text"
                className={styles.formInput}
                value={editingBolsa.sponsor}
                onChange={(e) => setEditingBolsa({ ...editingBolsa, sponsor: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Quantidade de Membros</label>
              <input
                type="number"
                className={styles.formInput}
                value={editingBolsa.quantidadeMembros}
                onChange={(e) => setEditingBolsa({ ...editingBolsa, quantidadeMembros: Number(e.target.value) })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <input
                  type="checkbox"
                  checked={editingBolsa.isAtipico}
                  onChange={(e) => setEditingBolsa({ ...editingBolsa, isAtipico: e.target.checked })}
                />{" "}
                Marcar como valor atípico
              </label>
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
    if (!activeModal || activeModal.section !== "bolsa" || activeModal.type !== "add") return null

    return (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Adicionar Nova Bolsa</h3>
            <button className={styles.modalClose} onClick={onCloseModal}>
              <Close />
            </button>
          </div>

          <div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nome</label>
              <input type="text" className={styles.formInput} placeholder="Ex: BPIG-III" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Valor</label>
              <input type="number" className={styles.formInput} placeholder="Ex: 1100" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Sponsor</label>
              <input type="text" className={styles.formInput} placeholder="Ex: FAPES" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Quantidade de Membros</label>
              <input type="number" className={styles.formInput} placeholder="Ex: 10" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <input type="checkbox" /> Marcar como valor atípico
              </label>
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

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>
        Tabela de Bolsas
        <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={onAdd}>
          Adicionar
        </button>
      </h2>

      <div className={styles.cardContent}>
        <div className={styles.searchBar}>
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Buscar bolsas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search style={{ position: "absolute", right: 10, top: 8, color: "var(--color-secondary-text)" }} />
          </div>

          <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={downloadCSV}>
            <GetApp style={{ fontSize: 16, marginRight: 4 }} />
            Exportar
          </button>
        </div>

        <div className={styles.filterContainer}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FilterList style={{ color: "var(--color-secondary-text)" }} />
            <span>Filtrar por:</span>
          </div>

          <select
            className={styles.filterSelect}
            value={filterSponsor}
            onChange={(e) => setFilterSponsor(e.target.value)}
          >
            <option value="">Todos os Sponsors</option>
            {sponsors.map((sponsor) => (
              <option key={sponsor} value={sponsor}>
                {sponsor}
              </option>
            ))}
          </select>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Valor</th>
                <th>Sponsor</th>
                <th>Membros</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {bolsasFiltradas.map((bolsa) => (
                <tr key={bolsa.id} className={bolsa.isAtipico ? styles.rowHighlight : ""}>
                  <td>{bolsa.nome}</td>
                  <td>
                    {formatarMoeda(bolsa.valor)}
                    {bolsa.isAtipico && (
                      <span className={styles.badgeWarning} style={{ marginLeft: 8 }}>
                        Atípico
                      </span>
                    )}
                  </td>
                  <td>{bolsa.sponsor}</td>
                  <td>{bolsa.quantidadeMembros}</td>
                  <td>
                    <div className={styles.tableActions}>
                      <button
                        className={`${styles.button} ${styles.buttonSecondary}`}
                        onClick={() => onView(bolsa.id)}
                        style={{ padding: "4px 8px" }}
                      >
                        <Visibility style={{ fontSize: 16 }} />
                      </button>
                      <button
                        className={`${styles.button} ${styles.buttonSecondary}`}
                        onClick={() => iniciarEdicao(bolsa)}
                        style={{ padding: "4px 8px" }}
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
