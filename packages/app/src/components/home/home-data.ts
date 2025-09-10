// Mock data for tools
export const tools = [
  {
    title: "n8n",
    link: "https://n8n.leds.dev.br/home/workflows",
    icon: "workflow",
  },
  {
    title: "GPT Playground",
    link: "https://platform.openai.com/playground",
    icon: "smart_toy", 
  },
  {
    title: "Grafana",
    link: "https://grafana.com/",
    icon: "analytics", 
  },
  {
    title: "pfSense",
    link: "https://www.pfsense.org/",
    icon: "security",
  },
  {
    title: "Figma",
    link: "https://www.figma.com/",
    icon: "design_services", 
  },
  {
    title: "Alura",
    link: "https://www.alura.com.br/",
    icon: "school",
  },
]

// Mock data for notices
export const notices = [
  {
    title: "Manutenção programada",
    content: "Manutenção do servidor principal dia 15/05 das 22h às 00h",
    date: "10/05/2023",
    priority: "high",
  },
  {
    title: "Nova versão do LEDS HUB",
    content: "Atualização v2.3 disponível com novos recursos",
    date: "05/05/2023",
    priority: "medium",
  },
  {
    title: "Reunião de equipe",
    content: "Reunião semanal na sexta-feira às 14h",
    date: "03/05/2023",
    priority: "normal",
  },
]

// Mock data for calendar events
export const calendarEvents = [
  {
    title: "Reunião de Sprint",
    date: "2023-05-12",
    time: "10:00 - 11:30",
  },
  {
    title: "Apresentação do Projeto",
    date: "2023-05-15",
    time: "14:00 - 15:30",
  },
  {
    title: "Treinamento DevOps",
    date: "2023-05-18",
    time: "09:00 - 12:00",
  },
  {
    title: "Review de Código",
    date: "2023-05-20",
    time: "11:00 - 12:00",
  },
]

export const homeConfig = {
  produtosInternos: {
    tools: [
      { name: 'Backstage', url: 'https://backstage.io/docs/overview/what-is-backstage/' },
      { name: 'LEDS Core', url: 'https://core.conectafapes.leds.dev.br/' },
    ],
    issues: 'https://github.com/leds-conectafapes/produtos-internos-project/issues',
  },
};

