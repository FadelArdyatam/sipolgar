import type { Workout, WorkoutSummary } from "../types/workout"

export const mockWorkouts: Workout[] = [
  {
    id: 1,
    name: "Full Body Workout",
    description: "A complete workout targeting all major muscle groups",
    category: "Strength",
    duration: 45,
    caloriesBurned: 320,
    exercises: [
      { id: 1, name: "Squats", sets: 3, reps: 12 },
      { id: 2, name: "Push-ups", sets: 3, reps: 15 },
      { id: 3, name: "Lunges", sets: 3, reps: 10 },
      { id: 4, name: "Plank", sets: 3, reps: 1, duration: 60 },
      { id: 5, name: "Dumbbell Rows", sets: 3, reps: 12, weight: 15 },
    ],
  },
  {
    id: 2,
    name: "HIIT Cardio",
    description: "High intensity interval training to burn calories",
    category: "Cardio",
    duration: 30,
    caloriesBurned: 400,
    exercises: [
      { id: 6, name: "Jumping Jacks", sets: 4, reps: 30 },
      { id: 7, name: "Mountain Climbers", sets: 4, reps: 20 },
      { id: 8, name: "Burpees", sets: 4, reps: 15 },
      { id: 9, name: "High Knees", sets: 4, reps: 40 },
    ],
  },
  {
    id: 3,
    name: "Upper Body Focus",
    description: "Targeting chest, back, shoulders and arms",
    category: "Strength",
    duration: 40,
    caloriesBurned: 280,
    exercises: [
      { id: 10, name: "Bench Press", sets: 3, reps: 10, weight: 45 },
      { id: 11, name: "Pull-ups", sets: 3, reps: 8 },
      { id: 12, name: "Shoulder Press", sets: 3, reps: 12, weight: 15 },
      { id: 13, name: "Tricep Dips", sets: 3, reps: 15 },
      { id: 14, name: "Bicep Curls", sets: 3, reps: 12, weight: 12 },
    ],
  },
]

export const mockWorkoutSummary: WorkoutSummary = {
  workoutsCompleted: 4,
  totalMinutes: 165,
  caloriesBurned: 1250,
  improvement: 12,
}

