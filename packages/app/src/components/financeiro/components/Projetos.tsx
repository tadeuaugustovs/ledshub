"use client"

import type React from "react"
import { useState } from "react"
import type { Projeto } from "../hooks/useFinanceiroData"
import { Edit, Add, Close, Save, BarChart } from "@material-ui/icons"
import styles from "../styles.module.css"

interface ProjetosProps {
  projetos: {
    conectafapes: Projeto
    agentes: Projeto
    outros: Projeto[]
  }
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

export const Projetos: React.FC<ProjetosProps> = ({ projetos, onView, onEdit, onAdd, activeModal, onCloseModal }) => {
  const [editingProjeto, setEditingProjeto] = useState<Projeto | null>(null)

  // Função para formatar valores monetários
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  // Função para iniciar edição de projeto
  const iniciarEdicao = (projeto: Projeto) => {
    setEditingProjeto({ ...projeto })
    onEdit(projeto.id)
  }

  // Função para salvar edição de projeto
  const salvarEdicao = () => {
    // Aqui seria implementada a lógica para salvar as alterações
    console.log("Salvando projeto editado:", editingProjeto)
    onCloseModal()
    setEditingProjeto(null)
  }

  // Renderizar modal de visualização
const renderizarModalVisualizacao = () => {
  if (!activeModal || activeModal.section !== "projeto" || activeModal.type !== "view" || !activeModal.id) return null;

  let projeto: Projeto | undefined;

  if (activeModal.id === "conectafapes") {
    projeto = projetos.conectafapes;
  } else if (activeModal.id === "agentes") {
    projeto = projetos.agentes;
  } else {
    projeto = projetos.outros.find((p) => p.id === activeModal.id);
  }
    if (!projeto) return null

    return (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Detalhes do Projeto</h3>
            <button className={styles.modalClose} onClick={onCloseModal}>
              <Close />
            </button>
          </div>

          <div>
            <h2 style={{ margin: "0 0 16px 0" }}>{projeto.nome}</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div>
                <p>
                  <strong>Orçamento Geral:</strong> {formatarMoeda(projeto.orcamentoGeral)}
                </p>
                <p>
                  <strong>Orçamento de Bolsas:</strong> {formatarMoeda(projeto.orcamentoBolsas)}
                </p>
              </div>
              <div>
                <p>
                  <strong>Gasto Acumulado:</strong> {formatarMoeda(Object.values(projeto.gastosAcumulados).pop() || 0)}
                </p>
                <p>
                  <strong>Saldo Disponível:</strong>{" "}
                  {formatarMoeda(projeto.orcamentoGeral - (Object.values(projeto.gastosAcumulados).pop() || 0))}
                </p>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h4 style={{ marginBottom: 8 }}>Equipe</h4>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {projeto.equipe.map((membro, index) => (
                  <li key={index}>{membro}</li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h4 style={{ marginBottom: 8 }}>Projetos de Software</h4>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {projeto.projetosSoftware.map((software, index) => (
                  <li key={index}>{software}</li>
                ))}
              </ul>
            </div>

            <div className={styles.chartContainer}>
              <h4 style={{ marginBottom: 8 }}>Gastos Mensais</h4>
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  border: "1px dashed var(--color-border)",
                  borderRadius: "8px",
                }}
              >
                Gráfico de Gastos Mensais
                <div style={{ fontSize: "12px", marginTop: "8px", color: "var(--color-secondary-text)" }}>
                  (Visualização de gráfico de barras com dados de gastos mensais)
                </div>
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={onCloseModal}>
              Fechar
            </button>
            <button
              className={`${styles.button} ${styles.buttonPrimary}`}
              onClick={() => {
                onCloseModal()
                iniciarEdicao(projeto)
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
    if (!activeModal || activeModal.section !== "projeto" || activeModal.type !== "edit" || !editingProjeto) return null

    return (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Editar Projeto</h3>
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
                value={editingProjeto.nome}
                onChange={(e) => setEditingProjeto({ ...editingProjeto, nome: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Orçamento Geral</label>
              <input
                type="number"
                className={styles.formInput}
                value={editingProjeto.orcamentoGeral}
                onChange={(e) => setEditingProjeto({ ...editingProjeto, orcamentoGeral: Number(e.target.value) })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Orçamento de Bolsas</label>
              <input
                type="number"
                className={styles.formInput}
                value={editingProjeto.orcamentoBolsas}
                onChange={(e) => setEditingProjeto({ ...editingProjeto, orcamentoBolsas: Number(e.target.value) })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Equipe (separados por vírgula)</label>
              <input
                type="text"
                className={styles.formInput}
                value={editingProjeto.equipe.join(", ")}
                onChange={(e) =>
                  setEditingProjeto({ ...editingProjeto, equipe: e.target.value.split(",").map((item) => item.trim()) })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Projetos de Software (separados por vírgula)</label>
              <input
                type="text"
                className={styles.formInput}
                value={editingProjeto.projetosSoftware.join(", ")}
                onChange={(e) =>
                  setEditingProjeto({
                    ...editingProjeto,
                    projetosSoftware: e.target.value.split(",").map((item) => item.trim()),
                  })
                }
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
    if (!activeModal || activeModal.section !== "projeto" || activeModal.type !== "add") return null

    return (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Adicionar Novo Projeto</h3>
            <button className={styles.modalClose} onClick={onCloseModal}>
              <Close />
            </button>
          </div>

          <div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nome</label>
              <input type="text" className={styles.formInput} placeholder="Ex: Novo Projeto" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Orçamento Geral</label>
              <input type="number" className={styles.formInput} placeholder="Ex: 300000" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Orçamento de Bolsas</label>
              <input type="number" className={styles.formInput} placeholder="Ex: 150000" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Equipe (separados por vírgula)</label>
              <input type="text" className={styles.formInput} placeholder="Ex: João Silva, Maria Oliveira" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Projetos de Software (separados por vírgula)</label>
              <input type="text" className={styles.formInput} placeholder="Ex: Sistema de Gestão, API de Dados" />
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
      <h2 className={styles.cardTitle}>Projetos Específicos</h2>

      <div className={styles.cardContent}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {/* Projeto ConectaFapes */}
          <div className={`${styles.projetoCard} ${styles.projetoConectaFapes}`} onClick={() => onView("conectafapes")}>
            <div className={styles.projetoHeader}>
              <h3 className={styles.projetoTitle}>{projetos.conectafapes.nome}</h3>
              <BarChart />
            </div>

            <div className={styles.projetoMeta}>
              <div className={styles.projetoMetaItem}>
                <span className={styles.projetoMetaLabel}>Orçamento</span>
                <span className={styles.projetoMetaValue}>{formatarMoeda(projetos.conectafapes.orcamentoGeral)}</span>
              </div>
              <div className={styles.projetoMetaItem}>
                <span className={styles.projetoMetaLabel}>Equipe</span>
                <span className={styles.projetoMetaValue}>{projetos.conectafapes.equipe.length} membros</span>
              </div>
            </div>

            <div className={styles.projetoFooter}>
              <button
                className={`${styles.button} ${styles.buttonSecondary}`}
                onClick={(e) => {
                  e.stopPropagation()
                  iniciarEdicao(projetos.conectafapes)
                }}
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)", color: "white", border: "none" }}
              >
                <Edit style={{ fontSize: 16, marginRight: 4 }} />
                Editar
              </button>
            </div>
          </div>

          {/* Projeto AgentEs */}
          <div className={`${styles.projetoCard} ${styles.projetoAgentEs}`} onClick={() => onView("agentes")}>
            <div className={styles.projetoHeader}>
              <h3 className={styles.projetoTitle}>{projetos.agentes.nome}</h3>
              <BarChart />
            </div>

            <div className={styles.projetoMeta}>
              <div className={styles.projetoMetaItem}>
                <span className={styles.projetoMetaLabel}>Orçamento</span>
                <span className={styles.projetoMetaValue}>{formatarMoeda(projetos.agentes.orcamentoGeral)}</span>
              </div>
              <div className={styles.projetoMetaItem}>
                <span className={styles.projetoMetaLabel}>Equipe</span>
                <span className={styles.projetoMetaValue}>{projetos.agentes.equipe.length} membros</span>
              </div>
            </div>

            <div className={styles.projetoFooter}>
              <button
                className={`${styles.button} ${styles.buttonSecondary}`}
                onClick={(e) => {
                  e.stopPropagation()
                  iniciarEdicao(projetos.agentes)
                }}
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)", color: "white", border: "none" }}
              >
                <Edit style={{ fontSize: 16, marginRight: 4 }} />
                Editar
              </button>
            </div>
          </div>

          {/* Outros Projetos */}
          {projetos.outros.map((projeto) => (
            <div
              key={projeto.id}
              className={`${styles.projetoCard} ${styles.projetoNovo}`}
              onClick={() => onView(projeto.id)}
            >
              <div className={styles.projetoHeader}>
                <h3 className={styles.projetoTitle}>{projeto.nome}</h3>
                <BarChart />
              </div>

              <div className={styles.projetoMeta}>
                <div className={styles.projetoMetaItem}>
                  <span className={styles.projetoMetaLabel}>Orçamento</span>
                  <span className={styles.projetoMetaValue}>{formatarMoeda(projeto.orcamentoGeral)}</span>
                </div>
                <div className={styles.projetoMetaItem}>
                  <span className={styles.projetoMetaLabel}>Equipe</span>
                  <span className={styles.projetoMetaValue}>{projeto.equipe.length} membros</span>
                </div>
              </div>

              <div className={styles.projetoFooter}>
                <button
                  className={`${styles.button} ${styles.buttonSecondary}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    iniciarEdicao(projeto)
                  }}
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.2)", color: "white", border: "none" }}
                >
                  <Edit style={{ fontSize: 16, marginRight: 4 }} />
                  Editar
                </button>
              </div>
            </div>
          ))}

          {/* Adicionar Novo Projeto */}
          <div className={`${styles.projetoCard} ${styles.projetoAdicionar}`} onClick={onAdd}>
            <Add style={{ fontSize: 48, marginBottom: 16 }} />
            <span>Adicionar novo projeto</span>
          </div>
        </div>
      </div>

      {renderizarModalVisualizacao()}
      {renderizarModalEdicao()}
      {renderizarModalAdicao()}
    </div>
  )
}
