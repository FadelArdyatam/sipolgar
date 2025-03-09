import type { Workout, WorkoutSummary } from "../types/workout"
import { mockWorkouts, mockWorkoutSummary } from "../data/workoutData"

// In a real app, this would be an API call
export const fetchWorkoutsData = async (): Promise<Workout[]> => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockWorkouts)
    }, 1000)
  })
}

export const fetchWorkoutSummaryData = async (): Promise<WorkoutSummary> => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockWorkoutSummary)
    }, 800)
  })
}

export const createWorkoutData = async (workout: Workout): Promise<Workout> => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would send the workout to a server
      // and return the created workout with an ID from the server
      mockWorkouts.push(workout)
      resolve(workout)
    }, 1000)
  })
}

export const updateWorkoutData = async (workout: Workout): Promise<Workout> => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would update the workout on the server
      const index = mockWorkouts.findIndex((w) => w.id === workout.id)
      if (index !== -1) {
        mockWorkouts[index] = workout
      }
      resolve(workout)
    }, 1000)
  })
}

export const deleteWorkoutData = async (workoutId: number): Promise<void> => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would delete the workout on the server
      const index = mockWorkouts.findIndex((w) => w.id === workoutId)
      if (index !== -1) {
        mockWorkouts.splice(index, 1)
      }
      resolve()
    }, 1000)
  })
}

