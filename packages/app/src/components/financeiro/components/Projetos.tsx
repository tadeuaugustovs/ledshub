"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Projeto } from "../hooks/useFinanceiroData"
import {
  Edit,
  Add,
  Close,
  Save,
  BarChart,
  GetApp,
  DragIndicator,
  ColorLens,
  MoreVert,
  Search,
} from "@material-ui/icons"

// Interface estendida para projetos com propriedades adicionais
interface ProjetoExtendido extends Projeto {
  cor?: string
  ordem?: number
}

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
  // Remover a variável não utilizada
  const [animatedCards, setAnimatedCards] = useState<{ [key: string]: boolean }>({})

  // Estados para as novas funcionalidades
  const [projetosOrdenados, setProjetosOrdenados] = useState<ProjetoExtendido[]>([])
  const [draggedProject, setDraggedProject] = useState<string | null>(null)
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null)
  const [showOptionsMenu, setShowOptionsMenu] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [projectColors, setProjectColors] = useState<{ [key: string]: string }>({})
  const [editingProjeto, setEditingProjeto] = useState<Projeto | null>(null)

  // Novo estado para controlar a exibição de todos os projetos
  const [showAllProjects, setShowAllProjects] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Novo projeto sendo adicionado
  const [newProjeto, setNewProjeto] = useState<Omit<Projeto, "id">>({
    nome: "",
    orcamentoGeral: 0,
    orcamentoBolsas: 0,
    equipe: [],
    projetosSoftware: [],
    gastosMensais: {},
    gastosAcumulados: {},
  })

  // Inicializar projetos ordenados
  useEffect(() => {
    const projetosArray: ProjetoExtendido[] = [
      { ...projetos.conectafapes, id: "conectafapes", ordem: 0, cor: "linear-gradient(135deg, #3498db, #2980b9)" },
      { ...projetos.agentes, id: "agentes", ordem: 1, cor: "linear-gradient(135deg, #9b59b6, #8e44ad)" },
      ...projetos.outros.map((projeto, index) => ({
        ...projeto,
        ordem: index + 2,
        cor: "linear-gradient(135deg, #27ae60, #2ecc71)",
      })),
    ]

    // Ordenar projetos pela propriedade ordem
    projetosArray.sort((a, b) => (a.ordem || 0) - (b.ordem || 0))

    setProjetosOrdenados(projetosArray)

    // Inicializar cores dos projetos
    const cores: { [key: string]: string } = {}
    projetosArray.forEach((projeto) => {
      cores[projeto.id] = projeto.cor || "linear-gradient(135deg, #27ae60, #2ecc71)"
    })
    setProjectColors(cores)

    // Animar os cards progressivamente
    const timer = setTimeout(() => {
      projetosArray.forEach((projeto, index) => {
        setTimeout(() => {
          setAnimatedCards((prev) => ({ ...prev, [projeto.id]: true }))
        }, index * 100)
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [projetos])

  // Função para formatar valores monetários
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  // Adicionar uma função para iniciar edição que realmente use a variável editingProjeto
  // Função para iniciar edição de projeto
  const iniciarEdicao = (projeto: Projeto) => {
    setEditingProjeto({ ...projeto })
    onEdit(projeto.id)
  }

  // Modificar a função salvarEdicao para realmente salvar as alterações
  const salvarEdicao = () => {
    if (editingProjeto) {
      console.log("Salvando projeto editado:", editingProjeto)
      // Atualizar o projeto na lista
      const updatedProjetos = [...projetosOrdenados]
      const index = updatedProjetos.findIndex((p) => p.id === editingProjeto.id)
      if (index !== -1) {
        updatedProjetos[index] = { ...updatedProjetos[index], ...editingProjeto }
        setProjetosOrdenados(updatedProjetos)
      }
    }
    onCloseModal()
    setEditingProjeto(null)
  }

  // Função para salvar novo projeto
  const salvarNovoProjeto = () => {
    // Aqui seria implementada a lógica para salvar o novo projeto no banco de dados
    console.log("Salvando novo projeto:", newProjeto)

    // Criar um novo projeto com ID temporário
    const novoProjeto: Projeto = {
      id: `projeto-${Date.now()}`, // ID temporário
      ...newProjeto,
    }

    // Adicionar o novo projeto à lista de projetos
    const novosProjetosOrdenados = [
      ...projetosOrdenados,
      {
        ...novoProjeto,
        ordem: projetosOrdenados.length,
        cor: "linear-gradient(135deg, #27ae60, #2ecc71)",
      },
    ]

    setProjetosOrdenados(novosProjetosOrdenados)

    // Atualizar as cores dos projetos
    setProjectColors((prev) => ({
      ...prev,
      [novoProjeto.id]: "linear-gradient(135deg, #27ae60, #2ecc71)",
    }))

    // Resetar o formulário
    setNewProjeto({
      nome: "",
      orcamentoGeral: 0,
      orcamentoBolsas: 0,
      equipe: [],
      projetosSoftware: [],
      gastosMensais: {},
      gastosAcumulados: {},
    })

    onCloseModal()
  }

  // Renderizar modal de visualização de todos os projetos
  const renderizarModalTodosProjetos = () => {
    if (!showAllProjects) return null

    // Filtrar projetos com base na busca
    const projetosFiltrados = projetosOrdenados.filter(
      (projeto) =>
        projeto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        projeto.equipe.some((membro) => membro.toLowerCase().includes(searchTerm.toLowerCase())),
    )

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
          overflow: "hidden",
          animation: "fadeIn 0.3s ease",
        }}
      >
        <div
          style={{
            backgroundColor: "#1e1e1e",
            borderRadius: "12px",
            padding: "24px",
            width: "90%",
            maxWidth: "1000px",
            maxHeight: "90vh",
            overflowY: "auto",
            position: "relative",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
            border: "1px solid #333333",
            animation: "slideUp 0.3s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              borderBottom: "1px solid #333333",
              paddingBottom: "12px",
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#ffffff",
                margin: 0,
              }}
            >
              Todos os Projetos
            </h3>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(255, 255, 255, 0.7)",
                padding: "8px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                position: "absolute",
                top: "12px",
                right: "12px",
              }}
              onClick={() => setShowAllProjects(false)}
            >
              <Close />
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                position: "relative",
                flex: 1,
              }}
            >
              <Search
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(255, 255, 255, 0.5)",
                }}
              />
              <input
                type="text"
                placeholder="Buscar por nome ou equipe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 40px",
                  border: "1px solid #333333",
                  borderRadius: "8px",
                  backgroundColor: "#2a2a2a",
                  color: "#ffffff",
                  transition: "all 0.2s ease",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {projetosFiltrados.map(renderizarCardProjeto)}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "24px",
              borderTop: "1px solid #333333",
              paddingTop: "16px",
            }}
          >
            <button
              style={{
                backgroundColor: "transparent",
                color: "#3498db",
                border: "1px solid #3498db",
                borderRadius: "6px",
                padding: "8px 16px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
              onClick={() => setShowAllProjects(false)}
            >
              Fechar
            </button>
            <button
              style={{
                backgroundColor: "rgba(52, 152, 219, 0.1)",
                color: "#3498db",
                border: "none",
                borderRadius: "8px",
                padding: "10px 16px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
              onClick={onAdd}
            >
              <Add style={{ fontSize: 16, marginRight: 4 }} />
              Novo Projeto
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
          overflow: "hidden",
        }}
      >
        <div
          style={{
            backgroundColor: "#1e1e1e",
            borderRadius: "12px",
            padding: "24px",
            width: "90%",
            maxWidth: "600px",
            maxHeight: "90vh",
            overflowY: "auto",
            position: "relative",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
            border: "1px solid #333333",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              borderBottom: "1px solid #333333",
              paddingBottom: "12px",
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#ffffff",
                margin: 0,
              }}
            >
              Adicionar Novo Projeto
            </h3>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(255, 255, 255, 0.7)",
                padding: "8px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                position: "absolute",
                top: "12px",
                right: "12px",
              }}
              onClick={onCloseModal}
            >
              <Close />
            </button>
          </div>

          <div>
            <div
              style={{
                marginBottom: "16px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 500,
                  color: "#ffffff",
                }}
              >
                Nome
              </label>
              <input
                type="text"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #333333",
                  borderRadius: "8px",
                  backgroundColor: "#2a2a2a",
                  color: "#ffffff",
                  transition: "all 0.2s ease",
                }}
                placeholder="Ex: Novo Projeto"
                value={newProjeto.nome}
                onChange={(e) => setNewProjeto({ ...newProjeto, nome: e.target.value })}
              />
            </div>

            <div
              style={{
                marginBottom: "16px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 500,
                  color: "#ffffff",
                }}
              >
                Orçamento Geral
              </label>
              <input
                type="number"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #333333",
                  borderRadius: "8px",
                  backgroundColor: "#2a2a2a",
                  color: "#ffffff",
                  transition: "all 0.2s ease",
                }}
                placeholder="Ex: 300000"
                value={newProjeto.orcamentoGeral || ""}
                onChange={(e) => setNewProjeto({ ...newProjeto, orcamentoGeral: Number(e.target.value) })}
              />
            </div>

            <div
              style={{
                marginBottom: "16px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 500,
                  color: "#ffffff",
                }}
              >
                Orçamento de Bolsas
              </label>
              <input
                type="number"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #333333",
                  borderRadius: "8px",
                  backgroundColor: "#2a2a2a",
                  color: "#ffffff",
                  transition: "all 0.2s ease",
                }}
                placeholder="Ex: 150000"
                value={newProjeto.orcamentoBolsas || ""}
                onChange={(e) => setNewProjeto({ ...newProjeto, orcamentoBolsas: Number(e.target.value) })}
              />
            </div>

            <div
              style={{
                marginBottom: "16px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 500,
                  color: "#ffffff",
                }}
              >
                Equipe (separados por vírgula)
              </label>
              <input
                type="text"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #333333",
                  borderRadius: "8px",
                  backgroundColor: "#2a2a2a",
                  color: "#ffffff",
                  transition: "all 0.2s ease",
                }}
                placeholder="Ex: João Silva, Maria Oliveira"
                value={newProjeto.equipe.join(", ")}
                onChange={(e) =>
                  setNewProjeto({
                    ...newProjeto,
                    equipe: e.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter((item) => item),
                  })
                }
              />
            </div>

            <div
              style={{
                marginBottom: "16px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 500,
                  color: "#ffffff",
                }}
              >
                Projetos de Software (separados por vírgula)
              </label>
              <input
                type="text"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #333333",
                  borderRadius: "8px",
                  backgroundColor: "#2a2a2a",
                  color: "#ffffff",
                  transition: "all 0.2s ease",
                }}
                placeholder="Ex: Sistema de Gestão, API de Dados"
                value={newProjeto.projetosSoftware.join(", ")}
                onChange={(e) =>
                  setNewProjeto({
                    ...newProjeto,
                    projetosSoftware: e.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter((item) => item),
                  })
                }
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "24px",
              borderTop: "1px solid #333333",
              paddingTop: "16px",
            }}
          >
            <button
              style={{
                backgroundColor: "transparent",
                color: "#3498db",
                border: "1px solid #3498db",
                borderRadius: "6px",
                padding: "8px 16px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
              onClick={onCloseModal}
            >
              Cancelar
            </button>
            <button
              style={{
                backgroundColor: "rgba(52, 152, 219, 0.1)",
                color: "#3498db",
                border: "none",
                borderRadius: "8px",
                padding: "10px 16px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
              onClick={salvarNovoProjeto}
            >
              <Save style={{ fontSize: 16, marginRight: 4 }} />
              Salvar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Adicionar renderização do modal de edição
  const renderizarModalEdicao = () => {
    if (!activeModal || activeModal.section !== "projeto" || activeModal.type !== "edit" || !editingProjeto) return null

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
          overflow: "hidden",
        }}
      >
        <div
          style={{
            backgroundColor: "#1e1e1e",
            borderRadius: "12px",
            padding: "24px",
            width: "90%",
            maxWidth: "600px",
            maxHeight: "90vh",
            overflowY: "auto",
            position: "relative",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
            border: "1px solid #333333",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              borderBottom: "1px solid #333333",
              paddingBottom: "12px",
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#ffffff",
                margin: 0,
              }}
            >
              Editar Projeto
            </h3>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(255, 255, 255, 0.7)",
                padding: "8px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                position: "absolute",
                top: "12px",
                right: "12px",
              }}
              onClick={onCloseModal}
            >
              <Close />
            </button>
          </div>

          <div>
            <div
              style={{
                marginBottom: "16px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 500,
                  color: "#ffffff",
                }}
              >
                Nome
              </label>
              <input
                type="text"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #333333",
                  borderRadius: "8px",
                  backgroundColor: "#2a2a2a",
                  color: "#ffffff",
                  transition: "all 0.2s ease",
                }}
                value={editingProjeto.nome}
                onChange={(e) => setEditingProjeto({ ...editingProjeto, nome: e.target.value })}
              />
            </div>

            <div
              style={{
                marginBottom: "16px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 500,
                  color: "#ffffff",
                }}
              >
                Orçamento Geral
              </label>
              <input
                type="number"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #333333",
                  borderRadius: "8px",
                  backgroundColor: "#2a2a2a",
                  color: "#ffffff",
                  transition: "all 0.2s ease",
                }}
                value={editingProjeto.orcamentoGeral}
                onChange={(e) => setEditingProjeto({ ...editingProjeto, orcamentoGeral: Number(e.target.value) })}
              />
            </div>

            <div
              style={{
                marginBottom: "16px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 500,
                  color: "#ffffff",
                }}
              >
                Orçamento de Bolsas
              </label>
              <input
                type="number"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #333333",
                  borderRadius: "8px",
                  backgroundColor: "#2a2a2a",
                  color: "#ffffff",
                  transition: "all 0.2s ease",
                }}
                value={editingProjeto.orcamentoBolsas}
                onChange={(e) => setEditingProjeto({ ...editingProjeto, orcamentoBolsas: Number(e.target.value) })}
              />
            </div>

            <div
              style={{
                marginBottom: "16px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 500,
                  color: "#ffffff",
                }}
              >
                Equipe (separados por vírgula)
              </label>
              <input
                type="text"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #333333",
                  borderRadius: "8px",
                  backgroundColor: "#2a2a2a",
                  color: "#ffffff",
                  transition: "all 0.2s ease",
                }}
                value={editingProjeto.equipe.join(", ")}
                onChange={(e) =>
                  setEditingProjeto({
                    ...editingProjeto,
                    equipe: e.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter((item) => item),
                  })
                }
              />
            </div>

            <div
              style={{
                marginBottom: "16px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 500,
                  color: "#ffffff",
                }}
              >
                Projetos de Software (separados por vírgula)
              </label>
              <input
                type="text"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #333333",
                  borderRadius: "8px",
                  backgroundColor: "#2a2a2a",
                  color: "#ffffff",
                  transition: "all 0.2s ease",
                }}
                value={editingProjeto.projetosSoftware.join(", ")}
                onChange={(e) =>
                  setEditingProjeto({
                    ...editingProjeto,
                    projetosSoftware: e.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter((item) => item),
                  })
                }
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "24px",
              borderTop: "1px solid #333333",
              paddingTop: "16px",
            }}
          >
            <button
              style={{
                backgroundColor: "transparent",
                color: "#3498db",
                border: "1px solid #3498db",
                borderRadius: "6px",
                padding: "8px 16px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
              onClick={onCloseModal}
            >
              Cancelar
            </button>
            <button
              style={{
                backgroundColor: "rgba(52, 152, 219, 0.1)",
                color: "#3498db",
                border: "none",
                borderRadius: "8px",
                padding: "10px 16px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
              onClick={salvarEdicao}
            >
              <Save style={{ fontSize: 16, marginRight: 4 }} />
              Salvar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Renderizar card de projeto
  const renderizarCardProjeto = (projeto: ProjetoExtendido) => {
    return (
      <div
        key={projeto.id}
        style={{
          borderRadius: "12px",
          padding: "20px",
          height: "100%",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          background: projectColors[projeto.id] || "linear-gradient(135deg, #27ae60, #2ecc71)",
          color: "white",
          opacity: animatedCards[projeto.id] ? 1 : 0,
          transform: animatedCards[projeto.id] ? "translateY(0)" : "translateY(20px)",
        }}
        onClick={() => !isEditMode && onView(projeto.id)}
        className={isEditMode ? "" : "projeto-card-hover"}
        draggable={isEditMode}
        onDragStart={() => handleDragStart(projeto.id)}
        onDragOver={(e) => handleDragOver(e, projeto.id)}
        onDrop={(e) => handleDrop(e, projeto.id)}
      >
        {isEditMode && (
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              padding: "6px",
              cursor: "grab",
              transition: "all 0.2s ease",
              zIndex: 5,
            }}
            className="edit-icon-hover"
          >
            <DragIndicator style={{ fontSize: 16, color: "white" }} />
          </div>
        )}

        {isEditMode && (
          <div
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              padding: "6px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              zIndex: 5,
            }}
            className="edit-icon-hover"
            onClick={(e) => {
              e.stopPropagation()
              iniciarEdicao(projeto)
            }}
          >
            <Edit style={{ fontSize: 16, color: "white" }} />
          </div>
        )}

        {isEditMode && (
          <div
            style={{
              position: "absolute",
              top: "12px",
              right: "48px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              padding: "6px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              zIndex: 5,
            }}
            className="edit-icon-hover"
            onClick={(e) => {
              e.stopPropagation()
              setShowOptionsMenu(showOptionsMenu === projeto.id ? null : projeto.id)
            }}
          >
            <MoreVert style={{ fontSize: 16, color: "white" }} />
          </div>
        )}

        {showOptionsMenu === projeto.id && (
          <div
            style={{
              position: "absolute",
              top: "50px",
              right: "48px",
              backgroundColor: "#2a2a2a",
              borderRadius: "8px",
              padding: "8px 0",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              zIndex: 10,
              minWidth: "150px",
            }}
          >
            <div
              style={{
                padding: "8px 16px",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "rgba(255, 255, 255, 0.8)",
              }}
              className="option-item-hover"
              onClick={(e) => {
                e.stopPropagation()
                exportarDadosProjeto(projeto.id)
                setShowOptionsMenu(null)
              }}
            >
              <GetApp style={{ fontSize: 16 }} />
              Exportar Dados
            </div>
            <div
              style={{
                padding: "8px 16px",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "rgba(255, 255, 255, 0.8)",
              }}
              className="option-item-hover"
              onClick={(e) => {
                e.stopPropagation()
                setShowColorPicker(projeto.id)
                setShowOptionsMenu(null)
              }}
            >
              <ColorLens style={{ fontSize: 16 }} />
              Alterar Cor
            </div>
          </div>
        )}

        {showColorPicker === projeto.id && (
          <div
            style={{
              position: "absolute",
              bottom: "50px",
              right: "12px",
              backgroundColor: "#2a2a2a",
              borderRadius: "8px",
              padding: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              zIndex: 10,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "8px",
            }}
          >
            {predefinedProjectColors.map((color: { name: string; gradient: string }, index: number) => (
              <div
                key={index}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: color.gradient,
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  changeProjectColor(projeto.id, color.gradient)
                }}
                className="color-option-hover"
              />
            ))}
          </div>
        )}

        {isEditMode && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 4,
            }}
          >
            <span
              style={{
                color: "#ffffff",
                fontWeight: 600,
                backgroundColor: "rgba(52, 152, 219, 0.8)",
                padding: "8px 16px",
                borderRadius: "4px",
              }}
            >
              Modo de Edição
            </span>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "16px",
          }}
        >
          <h3
            style={{
              fontSize: "20px",
              fontWeight: 600,
              margin: 0,
            }}
          >
            {projeto.nome}
          </h3>
          <BarChart />
        </div>

        <div
          style={{
            marginTop: "12px",
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                opacity: 0.8,
              }}
            >
              Orçamento
            </span>
            <span
              style={{
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
              {formatarMoeda(projeto.orcamentoGeral)}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                opacity: 0.8,
              }}
            >
              Equipe
            </span>
            <span
              style={{
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
              {projeto.equipe.length} membros
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Função para exportar dados do projeto
  const exportarDadosProjeto = (projetoId: string) => {
    let projeto: Projeto | undefined

    if (projetoId === "conectafapes") {
      projeto = projetos.conectafapes
    } else if (projetoId === "agentes") {
      projeto = projetos.agentes
    } else {
      projeto = projetos.outros.find((p) => p.id === projetoId)
    }

    if (!projeto) return

    // Criar objeto para exportação
    const dadosExportacao = {
      nome: projeto.nome,
      id: projeto.id,
      orcamentoGeral: projeto.orcamentoGeral,
      orcamentoBolsas: projeto.orcamentoBolsas,
      equipe: projeto.equipe,
      projetosSoftware: projeto.projetosSoftware,
      gastosAcumulados: projeto.gastosAcumulados,
    }

    // Converter para JSON e criar blob
    const jsonString = JSON.stringify(dadosExportacao, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    // Criar link para download
    const link = document.createElement("a")
    link.href = url
    link.download = `projeto_${projeto.id}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Função para iniciar o arrastar de um projeto
  const handleDragStart = (projetoId: string) => {
    if (!isEditMode) return
    setDraggedProject(projetoId)
  }

  // Função para quando um projeto está sendo arrastado sobre outro
  const handleDragOver = (e: React.DragEvent, projetoId: string) => {
    e.preventDefault()
    if (!isEditMode || !draggedProject || draggedProject === projetoId) return
  }

  // Função para quando um projeto é solto sobre outro
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!isEditMode || !draggedProject || draggedProject === targetId) return

    // Encontrar índices dos projetos
    const draggedIndex = projetosOrdenados.findIndex((p) => p.id === draggedProject)
    const targetIndex = projetosOrdenados.findIndex((p) => p.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    // Criar cópia do array de projetos
    const newProjetosOrdenados = [...projetosOrdenados]

    // Remover projeto arrastado
    const [draggedItem] = newProjetosOrdenados.splice(draggedIndex, 1)

    // Inserir no novo local
    newProjetosOrdenados.splice(targetIndex, 0, draggedItem)

    // Atualizar ordens
    const updatedProjetosOrdenados = newProjetosOrdenados.map((projeto, index) => ({
      ...projeto,
      ordem: index,
    }))

    setProjetosOrdenados(updatedProjetosOrdenados)
    setDraggedProject(null)
  }

  // Função para alterar a cor de um projeto
  const changeProjectColor = (projetoId: string, gradient: string) => {
    setProjectColors((prev) => ({
      ...prev,
      [projetoId]: gradient,
    }))
    setShowColorPicker(null)
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
      <h2
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
        Projetos Específicos
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            style={{
              backgroundColor: isEditMode ? "rgba(231, 76, 60, 0.1)" : "rgba(46, 204, 113, 0.1)",
              color: isEditMode ? "#e74c3c" : "#2ecc71",
              border: "none",
              borderRadius: "8px",
              padding: "8px 12px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
            onClick={() => setIsEditMode(!isEditMode)}
            className="button-hover"
          >
            {isEditMode ? "Sair do Modo de Edição" : "Editar Blocos"}
          </button>
          <button
            style={{
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              color: "#3498db",
              border: "none",
              borderRadius: "8px",
              padding: "10px 16px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
            onClick={onAdd}
            className="button-hover"
          >
            <Add style={{ fontSize: 16, marginRight: 4 }} />
            Novo Projeto
          </button>
        </div>
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
          marginLeft: "20px", // Ajustado para não sobrepor o menu
        }}
      >
        {/* Renderizar apenas os primeiros 4 projetos */}
        {projetosOrdenados.slice(0, 4).map(renderizarCardProjeto)}

        {/* Adicionar Novo Projeto */}
        {projetosOrdenados.length < 4 && (
          <div
            style={{
              borderRadius: "12px",
              padding: "20px",
              height: "100%",
              transition: "transform 0.2s ease, box-shadow 0.3s ease",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#2a2a2a",
              border: "2px dashed #333333",
              color: "rgba(255, 255, 255, 0.7)",
            }}
            onClick={onAdd}
            className="projeto-card-hover"
          >
            <Add style={{ fontSize: 48, marginBottom: 16 }} />
            <span>Adicionar novo projeto</span>
          </div>
        )}
      </div>

      {/* Botão "Ver todos os projetos" se houver mais de 4 projetos */}
      {projetosOrdenados.length > 4 && (
        <div
          style={{
            marginTop: "16px",
            textAlign: "center",
          }}
        >
          <button
            style={{
              background: "none",
              border: "none",
              color: "#3498db",
              cursor: "pointer",
              fontSize: "14px",
              textDecoration: "underline",
              padding: "8px",
            }}
            onClick={() => setShowAllProjects(true)}
          >
            Ver todos os projetos
          </button>
        </div>
      )}

      {/* Modal para visualizar todos os projetos */}
      {renderizarModalTodosProjetos()}

      {/* Modais existentes */}
      {renderizarModalAdicao()}
      {renderizarModalEdicao()}
    </div>
  )
}

// Cores predefinidas para os projetos
const predefinedProjectColors = [
  { name: "Azul", gradient: "linear-gradient(135deg, #3498db, #2980b9)" },
  { name: "Roxo", gradient: "linear-gradient(135deg, #9b59b6, #8e44ad)" },
  { name: "Verde", gradient: "linear-gradient(135deg, #27ae60, #2ecc71)" },
  { name: "Laranja", gradient: "linear-gradient(135deg, #e67e22, #d35400)" },
  { name: "Vermelho", gradient: "linear-gradient(135deg, #e74c3c, #c0392b)" },
  { name: "Amarelo", gradient: "linear-gradient(135deg, #f1c40f, #f39c12)" },
  { name: "Turquesa", gradient: "linear-gradient(135deg, #1abc9c, #16a085)" },
  { name: "Cinza", gradient: "linear-gradient(135deg, #95a5a6, #7f8c8d)" },
]
