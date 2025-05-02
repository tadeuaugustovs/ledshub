"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Storage, Refresh, GetApp, Settings } from "@material-ui/icons"

interface ImportInfo {
  bolsas: { registros: number; memoria: number }
  bolsistas: { registros: number; memoria: number }
  prestacaoContas: { registros: number; memoria: number }
  projetos: { registros: number; memoria: number }
  contasPagar: { registros: number; memoria: number }
  comprasRequisicoes: { registros: number; memoria: number }
}

interface GerenciamentoArmazenamentoProps {
  importInfo: ImportInfo
  onRefresh: () => void
}

export const GerenciamentoArmazenamento: React.FC<GerenciamentoArmazenamentoProps> = ({ importInfo, onRefresh }) => {
  const [showContent, setShowContent] = useState(true)

  // Calcular totais usando useMemo para evitar recálculos desnecessários
  const { totalRegistros, totalMemoria } = useMemo(() => {
    const registros = Object.values(importInfo).reduce((acc, curr) => acc + curr.registros, 0)
    const memoria = Object.values(importInfo).reduce((acc, curr) => acc + curr.memoria, 0)
    return { totalRegistros: registros, totalMemoria: memoria }
  }, [importInfo])

  // Função para exportar relatório de dados
  const exportarRelatorio = () => {
    const relatorio = {
      dataExportacao: new Date().toISOString(),
      totalRegistros,
      totalMemoria,
      detalhes: importInfo,
    }

    const jsonString = JSON.stringify(relatorio, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `relatorio-financeiro-${new Date().toLocaleDateString().replace(/\//g, "-")}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div
      style={{
        backgroundColor: "#1e1e1e",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        padding: "20px",
        marginBottom: "20px",
        border: "1px solid #333333",
      }}
    >
      <div
        style={{
          fontSize: "18px",
          fontWeight: 600,
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Storage style={{ fontSize: 24 }} />
          Gerenciamento de Armazenamento
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            style={{
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              color: "#3498db",
              border: "none",
              borderRadius: "8px",
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onClick={onRefresh}
            title="Atualizar dados"
          >
            <Refresh style={{ fontSize: 16 }} />
            Atualizar
          </button>
          <button
            style={{
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              color: "#2ecc71",
              border: "none",
              borderRadius: "8px",
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onClick={exportarRelatorio}
            title="Exportar relatório"
          >
            <GetApp style={{ fontSize: 16 }} />
            Exportar
          </button>
          <button
            style={{
              backgroundColor: "transparent",
              color: "rgba(255, 255, 255, 0.7)",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setShowContent(!showContent)}
            title={showContent ? "Minimizar" : "Expandir"}
          >
            {showContent ? "−" : "+"}
          </button>
        </div>
      </div>

      {showContent && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "#2a2a2a",
                borderRadius: "8px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                Total de Registros
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "#ffffff",
                }}
              >
                {totalRegistros}
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#2a2a2a",
                borderRadius: "8px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                Uso de Memória Total
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "#ffffff",
                }}
              >
                {totalMemoria} KB
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#2a2a2a",
                borderRadius: "8px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                Última Atualização
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "#ffffff",
                }}
              >
                {new Date().toLocaleTimeString()}
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#2a2a2a",
                borderRadius: "8px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                Status da Conexão
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ color: "#2ecc71", fontSize: "16px" }}>●</span> Conectado
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#2a2a2a",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <div
              style={{
                fontSize: "16px",
                fontWeight: 600,
                marginBottom: "12px",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Settings style={{ fontSize: 18 }} />
              Detalhes por Entidade
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px 16px",
                      backgroundColor: "#333333",
                      color: "#ffffff",
                      fontWeight: 600,
                      borderBottom: "2px solid #444444",
                    }}
                  >
                    Entidade
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      padding: "12px 16px",
                      backgroundColor: "#333333",
                      color: "#ffffff",
                      fontWeight: 600,
                      borderBottom: "2px solid #444444",
                    }}
                  >
                    Registros
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      padding: "12px 16px",
                      backgroundColor: "#333333",
                      color: "#ffffff",
                      fontWeight: 600,
                      borderBottom: "2px solid #444444",
                    }}
                  >
                    Memória (KB)
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      padding: "12px 16px",
                      backgroundColor: "#333333",
                      color: "#ffffff",
                      fontWeight: 600,
                      borderBottom: "2px solid #444444",
                    }}
                  >
                    % do Total
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid #333333",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Bolsas
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "12px 16px",
                      borderBottom: "1px solid #333333",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {importInfo.bolsas.registros}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "12px 16px",
                      borderBottom: "1px solid #333333",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {importInfo.bolsas.memoria}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "12px 16px",
                      borderBottom: "1px solid #333333",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {totalRegistros > 0
                      ? ((importInfo.bolsas.registros / totalRegistros) * 100).toFixed(1) + "%"
                      : "0%"}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid #333333",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Bolsistas
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "12px 16px",
                      borderBottom: "1px solid #333333",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {importInfo.bolsistas.registros}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "12px 16px",
                      borderBottom: "1px solid #333333",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {importInfo.bolsistas.memoria}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "12px 16px",
                      borderBottom: "1px solid #333333",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {totalRegistros > 0
                      ? ((importInfo.bolsistas.registros / totalRegistros) * 100).toFixed(1) + "%"
                      : "0%"}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid #333333",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Prestação de Contas
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "12px 16px",
                      borderBottom: "1px solid #333333",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {importInfo.prestacaoContas.registros}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "12px 16px",
                      borderBottom: "1px solid #333333",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {importInfo.prestacaoContas.memoria}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "12px 16px",
                      borderBottom: "1px solid #333333",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {totalRegistros > 0
                      ? ((importInfo.prestacaoContas.registros / totalRegistros) * 100).toFixed(1) + "%"
                      : "0%"}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid #333333",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Projetos
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "12px 16px",
                      borderBottom: "1px solid #333333",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {importInfo.projetos.registros}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "12px 16px",
                      borderBottom: "1px solid #333333",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {importInfo.projetos.memoria}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "12px 16px",
                      borderBottom: "1px solid #333333",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {totalRegistros > 0
                      ? ((importInfo.projetos.registros / totalRegistros) * 100).toFixed(1) + "%"
                      : "0%"}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid #333333",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Contas a Pagar
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "12px 16px",
                      borderBottom: "1px solid #333333",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {importInfo.contasPagar.registros}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "12px 16px",
                      borderBottom: "1px solid #333333",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {importInfo.contasPagar.memoria}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "12px 16px",
                      borderBottom: "1px solid #333333",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {totalRegistros > 0
                      ? ((importInfo.contasPagar.registros / totalRegistros) * 100).toFixed(1) + "%"
                      : "0%"}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid #333333",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Compras e Requisições
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "12px 16px",
                      borderBottom: "1px solid #333333",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {importInfo.comprasRequisicoes.registros}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "12px 16px",
                      borderBottom: "1px solid #333333",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {importInfo.comprasRequisicoes.memoria}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "12px 16px",
                      borderBottom: "1px solid #333333",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {totalRegistros > 0
                      ? ((importInfo.comprasRequisicoes.registros / totalRegistros) * 100).toFixed(1) + "%"
                      : "0%"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
