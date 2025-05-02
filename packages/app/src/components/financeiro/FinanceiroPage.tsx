"use client"
import { Grid } from "@material-ui/core"
import { useFinanceiroData } from "./hooks/useFinanceiroData"
import { TabelaBolsas } from "./components/TabelaBolsas"
import { Bolsistas } from "./components/Bolsistas"
import { PrestacaoContas } from "./components/PrestacaoContas"
import { Projetos } from "./components/Projetos"
import { ContasPagar } from "./components/ContasPagar"
import { ComprasRequisicoes } from "./components/ComprasRequisicoes"
import { GerenciamentoArmazenamento } from "./components/GerenciamentoArmazenamento"
import styles from "./styles.module.css"

export const FinanceiroPage = () => {
  const {
    bolsas,
    bolsistas,
    prestacaoContas,
    projetos,
    contasPagar,
    comprasRequisicoes,
    importInfo,
    isLoading,
    error,
    refreshData,
    activeModal,
    setActiveModal,
  } = useFinanceiroData()

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

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div
            style={{
              backgroundColor: "#1e1e1e",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            }}
          >
            <h2>Carregando dados financeiros...</h2>
            <div
              style={{
                width: "100%",
                height: "6px",
                backgroundColor: "#333333",
                borderRadius: "3px",
                overflow: "hidden",
                marginTop: "16px",
              }}
            >
              <div
                style={{
                  width: "30%",
                  height: "100%",
                  backgroundColor: "#3498db",
                  borderRadius: "3px",
                  animation: "loading 1.5s infinite",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div
            style={{
              backgroundColor: "#1e1e1e",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              border: "1px solid #e74c3c",
            }}
          >
            <h2 style={{ color: "#e74c3c" }}>Erro ao carregar dados</h2>
            <p>{error.message}</p>
            <button
              className={styles.button}
              style={{
                backgroundColor: "#3498db",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                marginTop: "16px",
                cursor: "pointer",
              }}
              onClick={() => refreshData()}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Sistema Financeiro</h1>

      <Grid container spacing={3}>
        {/* Prestação de Contas */}
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
            importInfo={importInfo?.bolsas}
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
            onEdit={(id) => handleOpenModal("edit", "compra", id)}
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

        {/* Seção de Gerenciamento de Armazenamento - Movida para o final */}
        <Grid item xs={12}>
          <GerenciamentoArmazenamento importInfo={importInfo} onRefresh={refreshData} />
        </Grid>
      </Grid>
    </div>
  )
}

export default FinanceiroPage
