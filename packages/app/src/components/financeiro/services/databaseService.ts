import { useDatabase } from "../hooks/useDatabase"

// This service acts as a wrapper around the useDatabase hook
// to provide a more convenient API for components
export const databaseService = {
  // Use this function to get the database hook in components
  useDatabase,

  // You can add additional utility functions here if needed
  formatCurrency: (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  },

  formatDate: (date: string | Date): string => {
    if (!date) return ""
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj.toLocaleDateString("pt-BR")
  },

  // Helper to parse form data
  parseFormData: (formData: FormData): Record<string, any> => {
    const data: Record<string, any> = {}
    formData.forEach((value, key) => {
      // Handle numeric values
      if (!isNaN(Number(value)) && value !== "") {
        data[key] = Number(value)
      } else if (value === "true") {
        data[key] = true
      } else if (value === "false") {
        data[key] = false
      } else {
        data[key] = value
      }
    })
    return data
  },
}
