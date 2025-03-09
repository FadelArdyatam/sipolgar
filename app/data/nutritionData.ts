import type { NutritionData, NutritionSummary, Meal } from "../types/nutrition"

export const mockMeals: Meal[] = [
  {
    id: 1,
    name: "Breakfast",
    time: "7:30 AM",
    calories: 450,
    protein: 25,
    carbs: 45,
    fat: 15,
    foods: [
      { id: 1, name: "Oatmeal", amount: "1 cup", calories: 150, protein: 5, carbs: 27, fat: 3 },
      { id: 2, name: "Banana", amount: "1 medium", calories: 105, protein: 1, carbs: 27, fat: 0 },
      { id: 3, name: "Greek Yogurt", amount: "1 cup", calories: 130, protein: 17, carbs: 6, fat: 4 },
      { id: 4, name: "Almonds", amount: "10 nuts", calories: 65, protein: 2, carbs: 2, fat: 6 },
    ],
  },
  {
    id: 2,
    name: "Lunch",
    time: "12:30 PM",
    calories: 650,
    protein: 40,
    carbs: 65,
    fat: 22,
    foods: [
      { id: 5, name: "Grilled Chicken", amount: "4 oz", calories: 180, protein: 35, carbs: 0, fat: 4 },
      { id: 6, name: "Brown Rice", amount: "1 cup", calories: 215, protein: 5, carbs: 45, fat: 2 },
      { id: 7, name: "Mixed Vegetables", amount: "1 cup", calories: 80, protein: 4, carbs: 16, fat: 0 },
      { id: 8, name: "Olive Oil", amount: "1 tbsp", calories: 120, protein: 0, carbs: 0, fat: 14 },
    ],
  },
  {
    id: 3,
    name: "Snack",
    time: "3:30 PM",
    calories: 200,
    protein: 10,
    carbs: 25,
    fat: 8,
    foods: [{ id: 9, name: "Protein Bar", amount: "1 bar", calories: 200, protein: 10, carbs: 25, fat: 8 }],
  },
]

export const mockNutritionData: NutritionData = {
  meals: mockMeals,
  macros: {
    protein: 75,
    carbs: 135,
    fat: 45,
  },
  totalCalories: 1300,
}

export const mockNutritionSummary: NutritionSummary = {
  consumedCalories: 1300,
  targetCalories: 2200,
  protein: 75,
  carbs: 135,
  fat: 45,
  water: 1.8,
}

