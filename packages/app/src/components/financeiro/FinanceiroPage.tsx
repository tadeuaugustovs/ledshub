"use client"

import { useState } from "react"
import { Grid } from "@material-ui/core"
import { useFinanceiroData } from "./hooks/useFinanceiroData"
import { TabelaBolsas } from "./components/TabelaBolsas"
import { Bolsistas } from "./components/Bolsistas"
import { PrestacaoContas } from "./components/PrestacaoContas"
import { Projetos } from "./components/Projetos"
import { ContasPagar } from "./components/ContasPagar"
import { ComprasRequisicoes } from "./components/ComprasRequisicoes"
import styles from "./styles.module.css"

export const FinanceiroPage = () => {
  const { bolsas, bolsistas, prestacaoContas, projetos, contasPagar, comprasRequisicoes } =
    useFinanceiroData()

  const [activeModal, setActiveModal] = useState<{
    type: "view" | "edit" | "add" | "delete"
    section: "bolsa" | "bolsista" | "prestacao" | "projeto" | "conta" | "compra"
    id: string | null
  } | null>(null)

  const handleOpenModal = (
    type: "view" | "edit" | "add" | "delete",
    section: "bolsa" | "bolsista" | "prestacao" | "projeto" | "conta" | "compra",
    id: string | null = null,
  ) => {
    setActiveModal({ type, section, id })
  }

  const handleCloseModal = () => {
    setActiveModal(null)
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Sistema Financeiro</h1>

      <Grid container spacing={3}>
        {/* Prestação de Contas - Agora no topo */}
        <Grid item xs={12}>
          <PrestacaoContas
            prestacoes={prestacaoContas}
            onView={(id) => handleOpenModal("view", "prestacao", id)}
            onEdit={(id) => handleOpenModal("edit", "prestacao", id)}
            onDelete={(id) => handleOpenModal("delete", "prestacao", id)}
            onAdd={() => handleOpenModal("add", "prestacao")}
            activeModal={activeModal}
            onCloseModal={handleCloseModal}
          />
        </Grid>

        {/* Contas a Pagar */}
        <Grid item xs={12}>
          <ContasPagar
            contas={contasPagar}
            onView={(id) => handleOpenModal("view", "conta", id)}
            onEdit={(id) => handleOpenModal("edit", "conta", id)}
            onDelete={(id) => handleOpenModal("delete", "conta", id)}
            onAdd={() => handleOpenModal("add", "conta")}
            activeModal={activeModal}
            onCloseModal={handleCloseModal}
          />
        </Grid>

        {/* Tabela de Bolsas */}
        <Grid item xs={12} md={6}>
          <TabelaBolsas
            bolsas={bolsas}
            onView={(id) => handleOpenModal("view", "bolsa", id)}
            onEdit={(id) => handleOpenModal("edit", "bolsa", id)}
            onAdd={() => handleOpenModal("add", "bolsa")}
            activeModal={activeModal}
            onCloseModal={handleCloseModal}
          />
        </Grid>

        {/* Bolsistas */}
        <Grid item xs={12} md={6}>
          <Bolsistas
            bolsistas={bolsistas}
            onView={(id) => handleOpenModal("view", "bolsista", id)}
            onEdit={(id) => handleOpenModal("edit", "bolsista", id)}
            activeModal={activeModal}
            onCloseModal={handleCloseModal}
          />
        </Grid>

        {/* Compras e Requisições */}
        <Grid item xs={12}>
          <ComprasRequisicoes
            compras={comprasRequisicoes}
            onView={(id) => handleOpenModal("view", "compra", id)}
            onEdit={(id) => handleOpenModal("edit", "compra", id)}
            onDelete={(id) => handleOpenModal("delete", "compra", id)}
            onAdd={() => handleOpenModal("add", "compra")}
            activeModal={activeModal}
            onCloseModal={handleCloseModal}
          />
        </Grid>

        {/* Projetos Específicos */}
        <Grid item xs={12}>
          <Projetos
            projetos={projetos}
            onView={(id) => handleOpenModal("view", "projeto", id)}
            onEdit={(id) => handleOpenModal("edit", "projeto", id)}
            onAdd={() => handleOpenModal("add", "projeto")}
            activeModal={activeModal}
            onCloseModal={handleCloseModal}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default FinanceiroPage