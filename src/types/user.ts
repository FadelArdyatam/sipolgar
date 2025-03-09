export interface User {
  id: string
  name: string
  email: string
}

export interface UserStats {
  totalWorkouts: number
  streak: number
  achievements: number
  height: number
  weight: number
  bmi: number
  goal: string
}

// Menghapus definisi User yang redundan dan menyatukan semua ke UserProfile
export interface UserProfile {
  id: string
  name: string
  email: string
  weight?: number // in kg
  height?: number // in cm
  age?: number
  gender?: "male" | "female" | "other" | "prefer-not-to-say"
  fitnessGoal?: "lose-weight" | "gain-muscle" | "maintain" | "improve-fitness" | "other"
  activityLevel?: "beginner" | "intermediate" | "advanced"
  workoutFrequency?: number // workouts per week
  preferredWorkoutTypes?: string[] // e.g., ['cardio', 'strength', 'yoga']
  onboardingCompleted: boolean
  // Menambahkan statistik pengguna
  stats?: {
    totalWorkouts: number
    streak: number
    achievements: number
  }
}

export interface AuthState {
  user: UserProfile | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

