export interface Exercise {
  id: number
  name: string
  sets: number
  reps: number
  weight?: number
  duration?: number
}

export interface Workout {
  id: number
  name: string
  description: string
  category: string
  duration: number
  caloriesBurned: number
  exercises: Exercise[]
}

export interface WorkoutSummary {
  workoutsCompleted: number
  totalMinutes: number
  caloriesBurned: number
  improvement: number
}

