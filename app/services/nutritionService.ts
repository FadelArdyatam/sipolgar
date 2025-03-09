import type { NutritionData, NutritionSummary } from "../types/nutrition"
import { mockNutritionData, mockNutritionSummary } from "../data/nutritionData"

// In a real app, this would be an API call
export const fetchNutritionDataService = async (): Promise<NutritionData> => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockNutritionData)
    }, 1000)
  })
}

export const fetchNutritionSummaryService = async (): Promise<NutritionSummary> => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockNutritionSummary)
    }, 800)
  })
}

