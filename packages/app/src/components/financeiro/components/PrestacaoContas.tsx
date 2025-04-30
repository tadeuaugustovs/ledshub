"use client"

import type React from "react"
import { useState } from "react"
import type { PrestacaoConta } from "../hooks/useFinanceiroData"
import { Search, FilterList, Visibility, Edit, Delete, Close, Save, Add } from "@material-ui/icons"
import styles from "../styles.module.css"

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

  // Renderizar modal de visualização
  const renderizarModalVisualizacao = () => {
    if (!activeModal || activeModal.section !== "prestacao" || activeModal.type !== "view" || !activeModal.id)
      return null

    const prestacao = prestacoes.find((p) => p.id === activeModal.id)
    if (!prestacao) return null

    return (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Detalhes da Prestação de Contas</h3>
            <button className={styles.modalClose} onClick={onCloseModal}>
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
            <p style={{ backgroundColor: "var(--color-surface-variant)", padding: 10, borderRadius: 4 }}>
              {prestacao.justificativa}
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
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Editar Prestação de Contas</h3>
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
                value={editingPrestacao.nome}
                onChange={(e) => setEditingPrestacao({ ...editingPrestacao, nome: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Natureza Contábil</label>
              <select
                className={styles.formInput}
                value={editingPrestacao.naturezaContabil}
                onChange={(e) => setEditingPrestacao({ ...editingPrestacao, naturezaContabil: e.target.value })}
              >
                {naturezas.map((natureza) => (
                  <option key={natureza} value={natureza}>
                    {natureza}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Vínculo Jurídico</label>
              <input
                type="text"
                className={styles.formInput}
                value={editingPrestacao.vinculoJuridico}
                onChange={(e) => setEditingPrestacao({ ...editingPrestacao, vinculoJuridico: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Valor</label>
              <input
                type="number"
                className={styles.formInput}
                value={editingPrestacao.valor}
                onChange={(e) => setEditingPrestacao({ ...editingPrestacao, valor: Number(e.target.value) })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Projeto</label>
              <select
                className={styles.formInput}
                value={editingPrestacao.projetoId}
                onChange={(e) => setEditingPrestacao({ ...editingPrestacao, projetoId: e.target.value })}
              >
                {projetos.map((projeto) => (
                  <option key={projeto} value={projeto}>
                    {projeto}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Justificativa</label>
              <textarea
                className={styles.formTextarea}
                value={editingPrestacao.justificativa}
                onChange={(e) => setEditingPrestacao({ ...editingPrestacao, justificativa: e.target.value })}
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

  // Renderizar modal de adição
  const renderizarModalAdicao = () => {
    if (!activeModal || activeModal.section !== "prestacao" || activeModal.type !== "add") return null

    return (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Adicionar Nova Prestação de Contas</h3>
            <button className={styles.modalClose} onClick={onCloseModal}>
              <Close />
            </button>
          </div>

          <div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nome</label>
              <input type="text" className={styles.formInput} placeholder="Ex: Aquisição de Equipamentos" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Natureza Contábil</label>
              <select className={styles.formInput}>
                <option value="">Selecione uma natureza</option>
                {naturezas.map((natureza) => (
                  <option key={natureza} value={natureza}>
                    {natureza}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Vínculo Jurídico</label>
              <input type="text" className={styles.formInput} placeholder="Ex: Licitação" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Valor</label>
              <input type="number" className={styles.formInput} placeholder="Ex: 10000" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Projeto</label>
              <select className={styles.formInput}>
                <option value="">Selecione um projeto</option>
                {projetos.map((projeto) => (
                  <option key={projeto} value={projeto}>
                    {projeto}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Justificativa</label>
              <textarea className={styles.formTextarea} placeholder="Descreva a justificativa para esta despesa..." />
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
    if (!activeModal || activeModal.section !== "prestacao" || activeModal.type !== "delete" || !activeModal.id)
      return null

    const prestacao = prestacoes.find((p) => p.id === activeModal.id)
    if (!prestacao) return null

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
              Tem certeza que deseja excluir a prestação de contas <strong>{prestacao.nome}</strong>?
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
        Prestação de Contas
        <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={onAdd}>
          <Add style={{ fontSize: 16, marginRight: 4 }} />
          Nova Despesa
        </button>
      </h2>

      <div className={styles.cardContent}>
        <div className={styles.searchBar}>
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Buscar prestações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search style={{ position: "absolute", right: 10, top: 8, color: "var(--color-secondary-text)" }} />
          </div>
        </div>

        <div className={styles.filterContainer}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FilterList style={{ color: "var(--color-secondary-text)" }} />
            <span>Filtrar por:</span>
          </div>

          <select
            className={styles.filterSelect}
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

          <select
            className={styles.filterSelect}
            value={filterProjeto}
            onChange={(e) => setFilterProjeto(e.target.value)}
          >
            <option value="">Todos os Projetos</option>
            {projetos.map((projeto) => (
              <option key={projeto} value={projeto}>
                {projeto}
              </option>
            ))}
          </select>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Natureza Contábil</th>
                <th>Vínculo Jurídico</th>
                <th>Valor</th>
                <th>Projeto</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {prestacoesFiltradas.map((prestacao) => (
                <tr key={prestacao.id}>
                  <td>{prestacao.nome}</td>
                  <td>{prestacao.naturezaContabil}</td>
                  <td>{prestacao.vinculoJuridico}</td>
                  <td>{formatarMoeda(prestacao.valor)}</td>
                  <td>{prestacao.projetoId}</td>
                  <td>
                    <div className={styles.tableActions}>
                      <button
                        className={`${styles.button} ${styles.buttonSecondary}`}
                        onClick={() => onView(prestacao.id)}
                        style={{ padding: "4px 8px" }}
                      >
                        <Visibility style={{ fontSize: 16 }} />
                      </button>
                      <button
                        className={`${styles.button} ${styles.buttonSecondary}`}
                        onClick={() => iniciarEdicao(prestacao)}
                        style={{ padding: "4px 8px" }}
                      >
                        <Edit style={{ fontSize: 16 }} />
                      </button>
                      <button
                        className={`${styles.button} ${styles.buttonDanger}`}
                        onClick={() => onDelete(prestacao.id)}
                        style={{ padding: "4px 8px" }}
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
    </div>
  )
}
