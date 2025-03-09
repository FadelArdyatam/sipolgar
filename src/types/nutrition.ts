export interface Food {
  id: number
  name: string
  amount: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface Meal {
  id: number
  name: string
  time: string
  calories: number
  protein: number
  carbs: number
  fat: number
  foods: Food[]
}

export interface Macros {
  protein: number
  carbs: number
  fat: number
}

export interface NutritionData {
  meals: Meal[]
  macros: Macros
  totalCalories: number
}

export interface NutritionSummary {
  consumedCalories: number
  targetCalories: number
  protein: number
  carbs: number
  fat: number
  water: number
}

