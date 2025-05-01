"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import type { Projeto } from "../hooks/useFinanceiroData"
import {
  Edit,
  Add,
  Close,
  Save,
  BarChart,
  CloudUpload,
  Dashboard,
  People,
  Assessment,
  ImportExport,
  GetApp,
  DragIndicator,
  ColorLens,
  MoreVert,
} from "@material-ui/icons"
import Chart from "chart.js/auto"

// Definindo estilos inline para substituir os estilos do módulo CSS
const styles = {
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    padding: "20px",
    height: "100%",
    transition: "box-shadow 0.3s ease, transform 0.2s ease",
    border: "1px solid #333333",
    position: "relative" as const,
    overflow: "hidden" as const,
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: 600,
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#ffffff",
  },
  cardContent: {
    height: "calc(100% - 40px)",
  },
  button: {
    borderRadius: "6px",
    padding: "8px 16px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  },
  buttonPrimary: {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    color: "#3498db",
    border: "1px solid #3498db",
  },
  buttonModern: {
    backgroundColor: "rgba(52, 152, 219, 0.1)",
    color: "#3498db",
    border: "none",
    borderRadius: "8px",
    padding: "10px 16px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  modal: {
    position: "fixed" as const,
    top: 0,
    left: "80px", // Ajustado para não sobrepor o menu
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    zIndex: 1000,
    overflow: "hidden",
    animation: "fadeIn 0.3s ease",
  },
  modalContent: {
    backgroundColor: "#1e1e1e",
    borderRadius: "12px 0 0 12px",
    padding: "24px",
    width: "90%",
    maxWidth: "600px",
    height: "100vh",
    overflowY: "auto" as const,
    position: "relative" as const,
    boxShadow: "-10px 0 30px rgba(0, 0, 0, 0.3)",
    border: "1px solid #333333",
    animation: "slideInRight 0.3s ease",
  },
  modalLargeContent: {
    width: "80%",
    maxWidth: "1200px",
    height: "90vh",
    display: "flex",
    flexDirection: "column" as const,
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    borderBottom: "1px solid #333333",
    paddingBottom: "12px",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#ffffff",
    margin: 0,
  },
  modalClose: {
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
    position: "absolute" as const,
    top: "12px",
    right: "12px",
  },
  modalBody: {
    flex: 1,
    overflowY: "auto" as const,
    paddingRight: "8px",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "24px",
    borderTop: "1px solid #333333",
    paddingTop: "16px",
  },
  modalTabs: {
    display: "flex",
    borderBottom: "1px solid #333333",
    marginBottom: "16px",
  },
  modalTab: {
    padding: "12px 16px",
    cursor: "pointer",
    borderBottom: "2px solid transparent",
    transition: "all 0.2s ease",
    color: "rgba(255, 255, 255, 0.7)",
  },
  modalTabActive: {
    borderBottomColor: "#3498db",
    color: "#ffffff",
    fontWeight: 500,
  },
  modalTabContent: {
    display: "none",
  },
  modalTabContentActive: {
    display: "block",
    animation: "fadeIn 0.3s ease",
  },
  formGroup: {
    marginBottom: "16px",
  },
  formLabel: {
    display: "block",
    marginBottom: "8px",
    fontWeight: 500,
    color: "#ffffff",
  },
  formInput: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #333333",
    borderRadius: "8px",
    backgroundColor: "#2a2a2a",
    color: "#ffffff",
    transition: "all 0.2s ease",
  },
  resumoCard: {
    backgroundColor: "#1e1e1e",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    border: "1px solid #333333",
    position: "relative" as const,
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  resumoCardTitle: {
    fontSize: "14px",
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resumoCardValue: {
    fontSize: "24px",
    fontWeight: 600,
    color: "#ffffff",
  },
  progressBar: {
    height: "6px",
    backgroundColor: "#333333",
    borderRadius: "3px",
    marginTop: "8px",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#3498db",
    borderRadius: "3px",
    transition: "width 0.5s ease",
  },
  projetoCard: {
    borderRadius: "12px",
    padding: "20px",
    height: "100%",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column" as const,
    animation: "fadeIn 0.5s ease",
    position: "relative" as const,
  },
  projetoConectaFapes: {
    background: "linear-gradient(135deg, #3498db, #2980b9)",
    color: "white",
  },
  projetoAgentEs: {
    background: "linear-gradient(135deg, #9b59b6, #8e44ad)",
    color: "white",
  },
  projetoNovo: {
    background: "linear-gradient(135deg, #27ae60, #2ecc71)",
    color: "white",
  },
  projetoAdicionar: {
    backgroundColor: "#2a2a2a",
    border: "2px dashed #333333",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(255, 255, 255, 0.7)",
  },
  projetoHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
  },
  projetoTitle: {
    fontSize: "20px",
    fontWeight: 600,
    margin: 0,
  },
  projetoMeta: {
    marginTop: "12px",
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "16px",
  },
  projetoMetaItem: {
    display: "flex",
    flexDirection: "column" as const,
  },
  projetoMetaLabel: {
    fontSize: "12px",
    opacity: 0.8,
  },
  projetoMetaValue: {
    fontSize: "18px",
    fontWeight: 600,
  },
  projetoFooter: {
    marginTop: "auto",
    paddingTop: "16px",
  },
  chartContainer: {
    height: "300px",
    margin: "20px 0",
    backgroundColor: "#2a2a2a",
    borderRadius: "8px",
    padding: "16px",
    position: "relative" as const,
    animation: "fadeIn 0.5s ease",
  },
  editIcon: {
    position: "absolute" as const,
    top: "12px",
    right: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "50%",
    padding: "6px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    zIndex: 5,
  },
  dragHandle: {
    position: "absolute" as const,
    top: "12px",
    left: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "50%",
    padding: "6px",
    cursor: "grab",
    transition: "all 0.2s ease",
    zIndex: 5,
  },
  colorPicker: {
    position: "absolute" as const,
    bottom: "12px",
    right: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "50%",
    padding: "6px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    zIndex: 5,
  },
  colorPickerPanel: {
    position: "absolute" as const,
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
  },
  colorOption: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    cursor: "pointer",
    transition: "transform 0.2s ease",
  },
  moreOptions: {
    position: "absolute" as const,
    top: "12px",
    right: "48px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "50%",
    padding: "6px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    zIndex: 5,
  },
  optionsMenu: {
    position: "absolute" as const,
    top: "50px",
    right: "48px",
    backgroundColor: "#2a2a2a",
    borderRadius: "8px",
    padding: "8px 0",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    zIndex: 10,
    minWidth: "150px",
  },
  optionItem: {
    padding: "8px 16px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "rgba(255, 255, 255, 0.8)",
  },
  optionItemHover: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#ffffff",
  },
  projectsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "16px",
    marginLeft: "20px", // Ajustado para não sobrepor o menu
  },
  editModeOverlay: {
    position: "absolute" as const,
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
  },
  editModeText: {
    color: "#ffffff",
    fontWeight: 600,
    backgroundColor: "rgba(52, 152, 219, 0.8)",
    padding: "8px 16px",
    borderRadius: "4px",
  },
}

// Estilos CSS para animações
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideInRight {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes slideDown {
    from { transform: translateY(-10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .projeto-card-hover:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3);
  }
  
  .resumo-card-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }
  
  .button-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    background-color: rgba(52, 152, 219, 0.2);
  }
  
  .edit-icon-hover:hover {
    background-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.1);
  }
  
  .color-option-hover:hover {
    transform: scale(1.2);
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
  }
  
  .option-item-hover:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .dragging {
    opacity: 0.5;
    box-shadow: 0 0 20px rgba(52, 152, 219, 0.5);
  }
`

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

// Interface estendida para projetos com propriedades adicionais
interface ProjetoExtendido extends Projeto {
  cor?: string
  ordem?: number
}

export const Projetos: React.FC<ProjetosProps> = ({ projetos, onView, onEdit, onAdd, activeModal, onCloseModal }) => {
  const [editingProjeto, setEditingProjeto] = useState<Projeto | null>(null)
  const [activeTab, setActiveTab] = useState<"visao-geral" | "orcamento" | "bolsas" | "importacao">("visao-geral")
  const [filtroModalidade, setFiltroModalidade] = useState<string>("todas")
  const [filtroRegiao, setFiltroRegiao] = useState<string>("todas")
  const [animatedCards, setAnimatedCards] = useState<{ [key: string]: boolean }>({})

  // Estados para as novas funcionalidades
  const [projetosOrdenados, setProjetosOrdenados] = useState<ProjetoExtendido[]>([])
  const [draggedProject, setDraggedProject] = useState<string | null>(null)
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null)
  const [showOptionsMenu, setShowOptionsMenu] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  // Remover ou comentar esta linha:
  // const [inlineEditing, setInlineEditing] = useState<string | null>(null)
  const [projectColors, setProjectColors] = useState<{ [key: string]: string }>({})

  // Refs para os gráficos
  const gastosChartRef = useRef<Chart | null>(null)
  const distribuicaoChartRef = useRef<Chart | null>(null)
  const bolsasChartRef = useRef<Chart | null>(null)
  const tipoBolsaChartRef = useRef<Chart | null>(null)

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
  }, [projetos])

  // Adicionar estilos de animação ao documento
  useEffect(() => {
    const styleElement = document.createElement("style")
    styleElement.innerHTML = animationStyles
    document.head.appendChild(styleElement)

    // Animar os cards progressivamente
    const timer = setTimeout(() => {
      const newAnimatedCards: { [key: string]: boolean } = {}
      newAnimatedCards["conectafapes"] = true
      newAnimatedCards["agentes"] = true

      projetos.outros.forEach((projeto, index) => {
        setTimeout(() => {
          setAnimatedCards((prev) => ({ ...prev, [projeto.id]: true }))
        }, index * 150)
      })

      setAnimatedCards(newAnimatedCards)
    }, 300)

    return () => {
      document.head.removeChild(styleElement)
      clearTimeout(timer)
    }
  }, [projetos])

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

  // Função para criar gráfico de gastos mensais
  const criarGraficoGastosMensais = (canvasId: string) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement
    if (!canvas) return null

    // Destruir gráfico existente se houver
    if (gastosChartRef.current) {
      gastosChartRef.current.destroy()
    }

    // Dados para o gráfico
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
    const dados = meses.map(() => Math.floor(Math.random() * 50000) + 10000) // Dados aleatórios para demonstração

    // Criar novo gráfico
    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    const newChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: meses,
        datasets: [
          {
            label: "Gastos Mensais",
            data: dados,
            backgroundColor: "rgba(52, 152, 219, 0.7)",
            borderColor: "rgba(52, 152, 219, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
            },
          },
          x: {
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: "rgba(255, 255, 255, 0.7)",
            },
          },
        },
        animation: {
          duration: 1500,
          easing: "easeOutQuart",
        },
      },
    })

    gastosChartRef.current = newChart
    return newChart
  }

  // Função para criar gráfico de distribuição de gastos
  const criarGraficoDistribuicao = (canvasId: string) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement
    if (!canvas) return null

    // Destruir gráfico existente se houver
    if (distribuicaoChartRef.current) {
      distribuicaoChartRef.current.destroy()
    }

    // Dados para o gráfico
    const categorias = ["Infraestrutura", "Software", "Serviços", "Material de Consumo", "Outros"]
    const dados = categorias.map(() => Math.floor(Math.random() * 30) + 5) // Dados aleatórios para demonstração

    // Criar novo gráfico
    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    const newChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: categorias,
        datasets: [
          {
            data: dados,
            backgroundColor: [
              "rgba(52, 152, 219, 0.7)",
              "rgba(155, 89, 182, 0.7)",
              "rgba(46, 204, 113, 0.7)",
              "rgba(241, 196, 15, 0.7)",
              "rgba(231, 76, 60, 0.7)",
            ],
            borderColor: [
              "rgba(52, 152, 219, 1)",
              "rgba(155, 89, 182, 1)",
              "rgba(46, 204, 113, 1)",
              "rgba(241, 196, 15, 1)",
              "rgba(231, 76, 60, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              color: "rgba(255, 255, 255, 0.7)",
            },
          },
        },
        animation: {
          duration: 1500,
          easing: "easeOutQuart",
        },
      },
    })

    distribuicaoChartRef.current = newChart
    return newChart
  }

  // Função para criar gráfico de pagamentos de bolsas
  const criarGraficoPagamentosBolsas = (canvasId: string) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement
    if (!canvas) return null

    // Destruir gráfico existente se houver
    if (bolsasChartRef.current) {
      bolsasChartRef.current.destroy()
    }

    // Dados para o gráfico
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
    const dados = meses.map(() => Math.floor(Math.random() * 30000) + 5000) // Dados aleatórios para demonstração

    // Criar novo gráfico
    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    const newChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: meses,
        datasets: [
          {
            label: "Pagamentos Mensais",
            data: dados,
            backgroundColor: "rgba(46, 204, 113, 0.2)",
            borderColor: "rgba(46, 204, 113, 1)",
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
            },
          },
          x: {
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: "rgba(255, 255, 255, 0.7)",
            },
          },
        },
        animation: {
          duration: 1500,
          easing: "easeOutQuart",
        },
      },
    })

    bolsasChartRef.current = newChart
    return newChart
  }

  // Função para criar gráfico de distribuição por tipo de bolsa
  const criarGraficoTipoBolsa = (canvasId: string) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement
    if (!canvas) return null

    // Destruir gráfico existente se houver
    if (tipoBolsaChartRef.current) {
      tipoBolsaChartRef.current.destroy()
    }

    // Dados para o gráfico
    const tipos = ["BPIG-V", "BPIG-IV", "BPIG-III", "BPIG-II", "BPIG-I", "Bolsa CNPq", "Bolsa CAPES"]
    const dados = tipos.map(() => Math.floor(Math.random() * 10) + 1) // Dados aleatórios para demonstração

    // Criar novo gráfico
    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    const newChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: tipos,
        datasets: [
          {
            data: dados,
            backgroundColor: [
              "rgba(52, 152, 219, 0.7)",
              "rgba(155, 89, 182, 0.7)",
              "rgba(46, 204, 113, 0.7)",
              "rgba(241, 196, 15, 0.7)",
              "rgba(231, 76, 60, 0.7)",
              "rgba(41, 128, 185, 0.7)",
              "rgba(142, 68, 173, 0.7)",
            ],
            borderColor: [
              "rgba(52, 152, 219, 1)",
              "rgba(155, 89, 182, 1)",
              "rgba(46, 204, 113, 1)",
              "rgba(241, 196, 15, 1)",
              "rgba(231, 76, 60, 1)",
              "rgba(41, 128, 185, 1)",
              "rgba(142, 68, 173, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              color: "rgba(255, 255, 255, 0.7)",
            },
          },
        },
        animation: {
          duration: 1500,
          easing: "easeOutQuart",
        },
      },
    })

    tipoBolsaChartRef.current = newChart
    return newChart
  }

  // Efeito para inicializar os gráficos quando a aba mudar
  useEffect(() => {
    if (activeModal?.section === "projeto" && activeModal.type === "view" && activeModal.id) {
      let projeto: Projeto | undefined

      if (activeModal.id === "conectafapes") {
        projeto = projetos.conectafapes
      } else if (activeModal.id === "agentes") {
        projeto = projetos.agentes
      } else {
        projeto = projetos.outros.find((p) => p.id === activeModal.id)
      }

      if (!projeto) return

      // Inicializar gráficos com base na aba ativa
      if (activeTab === "orcamento") {
        setTimeout(() => {
          criarGraficoGastosMensais("gastosMensaisChart")
          criarGraficoDistribuicao("distribuicaoGastosChart")
        }, 300)
      } else if (activeTab === "bolsas") {
        setTimeout(() => {
          criarGraficoPagamentosBolsas("pagamentosBolsasChart")
          criarGraficoTipoBolsa("tipoBolsaChart")
        }, 300)
      }
    }

    // Limpar gráficos ao desmontar
    return () => {
      if (gastosChartRef.current) gastosChartRef.current.destroy()
      if (distribuicaoChartRef.current) distribuicaoChartRef.current.destroy()
      if (bolsasChartRef.current) bolsasChartRef.current.destroy()
      if (tipoBolsaChartRef.current) tipoBolsaChartRef.current.destroy()
    }
  }, [activeTab, activeModal, projetos])

  // Renderizar modal de visualização avançado
  const renderizarModalVisualizacao = () => {
    if (!activeModal || activeModal.section !== "projeto" || activeModal.type !== "view" || !activeModal.id) return null

    let projeto: Projeto | undefined

    if (activeModal.id === "conectafapes") {
      projeto = projetos.conectafapes
    } else if (activeModal.id === "agentes") {
      projeto = projetos.agentes
    } else {
      projeto = projetos.outros.find((p) => p.id === activeModal.id)
    }
    if (!projeto) return null

    // Calcular valores para exibição
    const gastoAcumulado = Object.values(projeto.gastosAcumulados).pop() || 0
    const saldoDisponivel = projeto.orcamentoGeral - gastoAcumulado
    const percentualGasto = Math.round((gastoAcumulado / projeto.orcamentoGeral) * 100)

    return (
      <div style={styles.modal}>
        <div style={{ ...styles.modalContent, ...styles.modalLargeContent }}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>{projeto.nome}</h3>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                style={{
                  ...styles.button,
                  backgroundColor: "rgba(52, 152, 219, 0.1)",
                  color: "#3498db",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 12px",
                }}
                onClick={() => exportarDadosProjeto(projeto.id)}
                className="button-hover"
              >
                <GetApp style={{ fontSize: 16, marginRight: 4 }} />
                Exportar
              </button>
              <button
                style={{
                  ...styles.button,
                  backgroundColor: "rgba(46, 204, 113, 0.1)",
                  color: "#2ecc71",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 12px",
                }}
                onClick={() => iniciarEdicao(projeto)}
                className="button-hover"
              >
                <Edit style={{ fontSize: 16, marginRight: 4 }} />
                Editar
              </button>
            </div>
            <button style={styles.modalClose} onClick={onCloseModal}>
              <Close />
            </button>
          </div>

          {/* Abas do modal */}
          <div style={styles.modalTabs}>
            <div
              style={activeTab === "visao-geral" ? { ...styles.modalTab, ...styles.modalTabActive } : styles.modalTab}
              onClick={() => setActiveTab("visao-geral")}
            >
              <Dashboard style={{ fontSize: 16, marginRight: 4 }} />
              Visão Geral
            </div>
            <div
              style={activeTab === "orcamento" ? { ...styles.modalTab, ...styles.modalTabActive } : styles.modalTab}
              onClick={() => setActiveTab("orcamento")}
            >
              <Assessment style={{ fontSize: 16, marginRight: 4 }} />
              Orçamento
            </div>
            <div
              style={activeTab === "bolsas" ? { ...styles.modalTab, ...styles.modalTabActive } : styles.modalTab}
              onClick={() => setActiveTab("bolsas")}
            >
              <People style={{ fontSize: 16, marginRight: 4 }} />
              Bolsas
            </div>
            <div
              style={activeTab === "importacao" ? { ...styles.modalTab, ...styles.modalTabActive } : styles.modalTab}
              onClick={() => setActiveTab("importacao")}
            >
              <ImportExport style={{ fontSize: 16, marginRight: 4 }} />
              Importação
            </div>
          </div>

          <div style={styles.modalBody}>
            {/* Conteúdo da aba Visão Geral */}
            <div style={activeTab === "visao-geral" ? styles.modalTabContentActive : styles.modalTabContent}>
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
                    <strong>Gasto Acumulado:</strong> {formatarMoeda(gastoAcumulado)}
                  </p>
                  <p>
                    <strong>Saldo Disponível:</strong> {formatarMoeda(saldoDisponivel)}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h4 style={{ marginBottom: 8 }}>Progresso do Orçamento</h4>
                <div style={styles.progressBar} title={`${percentualGasto}% utilizado`}>
                  <div
                    style={
                      {
                        ...styles.progressBarFill,
                        width: "0%",
                        animation: "progressFill 1.5s ease forwards",
                        "--progress-width": `${percentualGasto}%`,
                      } as React.CSSProperties
                    }
                  ></div>
                </div>
                <p style={{ textAlign: "right", fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                  {percentualGasto}% utilizado
                </p>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h4 style={{ marginBottom: 8 }}>Equipe</h4>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {projeto.equipe.map((membro, index) => (
                    <li key={index} style={{ animation: `fadeIn 0.5s ease ${index * 0.1}s forwards`, opacity: 0 }}>
                      {membro}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h4 style={{ marginBottom: 8 }}>Projetos de Software</h4>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {projeto.projetosSoftware.map((software, index) => (
                    <li key={index} style={{ animation: `fadeIn 0.5s ease ${index * 0.1}s forwards`, opacity: 0 }}>
                      {software}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Conteúdo da aba Orçamento */}
            <div style={activeTab === "orcamento" ? styles.modalTabContentActive : styles.modalTabContent}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
                <div
                  style={styles.resumoCard}
                  className="resumo-card-hover"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)"
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.3)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)"
                  }}
                >
                  <div style={styles.resumoCardTitle}>Orçamento Total</div>
                  <div style={styles.resumoCardValue}>{formatarMoeda(projeto.orcamentoGeral)}</div>
                </div>
                <div
                  style={styles.resumoCard}
                  className="resumo-card-hover"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)"
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.3)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)"
                  }}
                >
                  <div style={styles.resumoCardTitle}>Gasto Acumulado</div>
                  <div style={styles.resumoCardValue}>{formatarMoeda(gastoAcumulado)}</div>
                </div>
                <div
                  style={styles.resumoCard}
                  className="resumo-card-hover"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)"
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.3)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)"
                  }}
                >
                  <div style={styles.resumoCardTitle}>Saldo Disponível</div>
                  <div style={styles.resumoCardValue}>{formatarMoeda(saldoDisponivel)}</div>
                </div>
              </div>

              <div style={styles.chartContainer}>
                <h4 style={{ marginBottom: 8 }}>Gastos Mensais</h4>
                <canvas id="gastosMensaisChart" height="250"></canvas>
              </div>

              <div style={styles.chartContainer}>
                <h4 style={{ marginBottom: 8 }}>Distribuição de Gastos por Categoria</h4>
                <canvas id="distribuicaoGastosChart" height="250"></canvas>
              </div>
            </div>

            {/* Conteúdo da aba Bolsas */}
            <div style={activeTab === "bolsas" ? styles.modalTabContentActive : styles.modalTabContent}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
                <div
                  style={styles.resumoCard}
                  className="resumo-card-hover"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)"
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.3)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)"
                  }}
                >
                  <div style={styles.resumoCardTitle}>Orçamento de Bolsas</div>
                  <div style={styles.resumoCardValue}>{formatarMoeda(projeto.orcamentoBolsas)}</div>
                </div>
                <div
                  style={styles.resumoCard}
                  className="resumo-card-hover"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)"
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.3)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)"
                  }}
                >
                  <div style={styles.resumoCardTitle}>Valores Pagos</div>
                  <div style={styles.resumoCardValue}>{formatarMoeda(projeto.orcamentoBolsas * 0.65)}</div>
                </div>
                <div
                  style={styles.resumoCard}
                  className="resumo-card-hover"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)"
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.3)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)"
                  }}
                >
                  <div style={styles.resumoCardTitle}>Saldo Disponível</div>
                  <div style={styles.resumoCardValue}>{formatarMoeda(projeto.orcamentoBolsas * 0.35)}</div>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <h4 style={{ marginBottom: 8 }}>Filtros</h4>
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <label style={styles.formLabel}>Modalidade</label>
                    <select
                      style={styles.formInput}
                      value={filtroModalidade}
                      onChange={(e) => setFiltroModalidade(e.target.value)}
                    >
                      <option value="todas">Todas as Modalidades</option>
                      <option value="BPIG-V">BPIG-V</option>
                      <option value="BPIG-IV">BPIG-IV</option>
                      <option value="BPIG-III">BPIG-III</option>
                      <option value="BPIG-II">BPIG-II</option>
                      <option value="BPIG-I">BPIG-I</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={styles.formLabel}>Região</label>
                    <select
                      style={styles.formInput}
                      value={filtroRegiao}
                      onChange={(e) => setFiltroRegiao(e.target.value)}
                    >
                      <option value="todas">Todas as Regiões</option>
                      <option value="norte">Norte</option>
                      <option value="sul">Sul</option>
                      <option value="leste">Leste</option>
                      <option value="oeste">Oeste</option>
                      <option value="central">Central</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={styles.chartContainer}>
                <h4 style={{ marginBottom: 8 }}>Histórico de Pagamentos Mensais</h4>
                <canvas id="pagamentosBolsasChart" height="250"></canvas>
              </div>

              <div style={styles.chartContainer}>
                <h4 style={{ marginBottom: 8 }}>Distribuição por Tipo de Bolsa</h4>
                <canvas id="tipoBolsaChart" height="250"></canvas>
              </div>
            </div>

            {/* Conteúdo da aba Importação */}
            <div style={activeTab === "importacao" ? styles.modalTabContentActive : styles.modalTabContent}>
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ marginBottom: 8 }}>Importar Dados</h4>
                <p style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: 16 }}>
                  Selecione o tipo de dados que deseja importar e faça o upload do arquivo CSV ou Excel.
                </p>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Tipo de Dados</label>
                  <select style={styles.formInput}>
                    <option value="bolsistas">Bolsistas</option>
                    <option value="pagamentos">Pagamentos</option>
                    <option value="orcamento">Orçamento</option>
                    <option value="gastos">Gastos</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Arquivo</label>
                  <input type="file" accept=".csv,.xlsx,.xls" style={styles.formInput} />
                </div>

                <div style={{ marginTop: 16 }}>
                  <button style={{ ...styles.button, ...styles.buttonModern }} className="button-hover">
                    <CloudUpload style={{ fontSize: 16, marginRight: 4 }} />
                    Importar Arquivo
                  </button>
                </div>
              </div>

              <div style={{ marginTop: 24 }}>
                <h4 style={{ marginBottom: 8 }}>Instruções para Importação</h4>
                <div style={{ backgroundColor: "#2a2a2a", padding: 16, borderRadius: 8 }}>
                  <h5 style={{ marginTop: 0, marginBottom: 8 }}>Formato do Arquivo CSV</h5>
                  <ul style={{ margin: 0, paddingLeft: 20, color: "rgba(255, 255, 255, 0.7)" }}>
                    <li>A primeira linha deve conter os cabeçalhos das colunas</li>
                    <li>O separador deve ser vírgula (,)</li>
                    <li>As datas devem estar no formato DD/MM/AAAA</li>
                    <li>Os valores monetários devem usar ponto como separador decimal</li>
                  </ul>

                  <h5 style={{ marginTop: 16, marginBottom: 8 }}>Colunas Necessárias</h5>
                  <p style={{ margin: 0, color: "rgba(255, 255, 255, 0.7)" }}>
                    Dependendo do tipo de dados selecionado, as seguintes colunas são necessárias:
                  </p>
                  <ul style={{ paddingLeft: 20, color: "rgba(255, 255, 255, 0.7)" }}>
                    <li>
                      <strong>Bolsistas:</strong> Nome, CPF, Tipo de Bolsa, Valor, Data de Início
                    </li>
                    <li>
                      <strong>Pagamentos:</strong> CPF, Valor, Data, Referência
                    </li>
                    <li>
                      <strong>Orçamento:</strong> Categoria, Valor, Descrição
                    </li>
                    <li>
                      <strong>Gastos:</strong> Categoria, Valor, Data, Descrição
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.modalFooter}>
            <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={onCloseModal}>
              Fechar
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
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>Editar Projeto</h3>
            <button style={styles.modalClose} onClick={onCloseModal}>
              <Close />
            </button>
          </div>

          <div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Nome</label>
              <input
                type="text"
                style={styles.formInput}
                value={editingProjeto.nome}
                onChange={(e) => setEditingProjeto({ ...editingProjeto, nome: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Orçamento Geral</label>
              <input
                type="number"
                style={styles.formInput}
                value={editingProjeto.orcamentoGeral}
                onChange={(e) => setEditingProjeto({ ...editingProjeto, orcamentoGeral: Number(e.target.value) })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Orçamento de Bolsas</label>
              <input
                type="number"
                style={styles.formInput}
                value={editingProjeto.orcamentoBolsas}
                onChange={(e) => setEditingProjeto({ ...editingProjeto, orcamentoBolsas: Number(e.target.value) })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Equipe (separados por vírgula)</label>
              <input
                type="text"
                style={styles.formInput}
                value={editingProjeto.equipe.join(", ")}
                onChange={(e) =>
                  setEditingProjeto({ ...editingProjeto, equipe: e.target.value.split(",").map((item) => item.trim()) })
                }
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Projetos de Software (separados por vírgula)</label>
              <input
                type="text"
                style={styles.formInput}
                value={editingProjeto.projetosSoftware.join(", ")}
                onChange={(e) =>
                  setEditingProjeto({
                    ...editingProjeto,
                    projetosSoftware: e.target.value.split(",").map((item) => item.trim()),
                  })
                }
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Cor do Projeto</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {predefinedProjectColors.map((color: { name: string; gradient: string }, index: number) => (
                  <div
                    key={index}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: color.gradient,
                      cursor: "pointer",
                      transition: "transform 0.2s ease",
                      border: projectColors[editingProjeto.id] === color.gradient ? "2px solid white" : "none",
                    }}
                    onClick={() => {
                      setProjectColors((prev) => ({
                        ...prev,
                        [editingProjeto.id]: color.gradient,
                      }))
                    }}
                    className="color-option-hover"
                  />
                ))}
              </div>
            </div>
          </div>

          <div style={styles.modalFooter}>
            <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={onCloseModal}>
              Cancelar
            </button>
            <button
              style={{ ...styles.button, ...styles.buttonModern }}
              onClick={salvarEdicao}
              className="button-hover"
            >
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
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>Adicionar Novo Projeto</h3>
            <button style={styles.modalClose} onClick={onCloseModal}>
              <Close />
            </button>
          </div>

          <div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Nome</label>
              <input type="text" style={styles.formInput} placeholder="Ex: Novo Projeto" />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Orçamento Geral</label>
              <input type="number" style={styles.formInput} placeholder="Ex: 300000" />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Orçamento de Bolsas</label>
              <input type="number" style={styles.formInput} placeholder="Ex: 150000" />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Equipe (separados por vírgula)</label>
              <input type="text" style={styles.formInput} placeholder="Ex: João Silva, Maria Oliveira" />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Projetos de Software (separados por vírgula)</label>
              <input type="text" style={styles.formInput} placeholder="Ex: Sistema de Gestão, API de Dados" />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Cor do Projeto</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {predefinedProjectColors.map((color: { name: string; gradient: string }, index: number) => (
                  <div
                    key={index}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: color.gradient,
                      cursor: "pointer",
                      transition: "transform 0.2s ease",
                    }}
                    className="color-option-hover"
                  />
                ))}
              </div>
            </div>
          </div>

          <div style={styles.modalFooter}>
            <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={onCloseModal}>
              Cancelar
            </button>
            <button
              style={{ ...styles.button, ...styles.buttonModern }}
              onClick={onCloseModal}
              className="button-hover"
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
          ...styles.projetoCard,
          background: projectColors[projeto.id] || "linear-gradient(135deg, #27ae60, #2ecc71)",
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
          <div style={styles.dragHandle} className="edit-icon-hover">
            <DragIndicator style={{ fontSize: 16, color: "white" }} />
          </div>
        )}

        {isEditMode && (
          <div
            style={styles.editIcon}
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
            style={styles.moreOptions}
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
          <div style={styles.optionsMenu}>
            <div
              style={styles.optionItem}
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
              style={styles.optionItem}
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
          <div style={styles.colorPickerPanel}>
            {predefinedProjectColors.map((color: { name: string; gradient: string }, index: number) => (
              <div
                key={index}
                style={{
                  ...styles.colorOption,
                  background: color.gradient,
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
          <div style={styles.editModeOverlay}>
            <span style={styles.editModeText}>Modo de Edição</span>
          </div>
        )}

        <div style={styles.projetoHeader}>
          <h3 style={styles.projetoTitle}>{projeto.nome}</h3>
          <BarChart />
        </div>

        <div style={styles.projetoMeta}>
          <div style={styles.projetoMetaItem}>
            <span style={styles.projetoMetaLabel}>Orçamento</span>
            <span style={styles.projetoMetaValue}>{formatarMoeda(projeto.orcamentoGeral)}</span>
          </div>
          <div style={styles.projetoMetaItem}>
            <span style={styles.projetoMetaLabel}>Equipe</span>
            <span style={styles.projetoMetaValue}>{projeto.equipe.length} membros</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>
        Projetos Específicos
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            style={{
              ...styles.button,
              backgroundColor: isEditMode ? "rgba(231, 76, 60, 0.1)" : "rgba(46, 204, 113, 0.1)",
              color: isEditMode ? "#e74c3c" : "#2ecc71",
              border: "none",
              borderRadius: "8px",
              padding: "8px 12px",
            }}
            onClick={() => setIsEditMode(!isEditMode)}
            className="button-hover"
          >
            {isEditMode ? "Sair do Modo de Edição" : "Editar Blocos"}
          </button>
          <button style={{ ...styles.button, ...styles.buttonModern }} onClick={onAdd} className="button-hover">
            <Add style={{ fontSize: 16, marginRight: 4 }} />
            Novo Projeto
          </button>
        </div>
      </h2>

      <div style={styles.projectsContainer}>
        {/* Renderizar projetos ordenados */}
        {projetosOrdenados.map(renderizarCardProjeto)}

        {/* Adicionar Novo Projeto */}
        <div
          style={{ ...styles.projetoCard, ...styles.projetoAdicionar }}
          onClick={onAdd}
          className="projeto-card-hover"
        >
          <Add style={{ fontSize: 48, marginBottom: 16 }} />
          <span>Adicionar novo projeto</span>
        </div>
      </div>

      {renderizarModalVisualizacao()}
      {renderizarModalEdicao()}
      {renderizarModalAdicao()}
    </div>
  )
}
