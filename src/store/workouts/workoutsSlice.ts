import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Workout, WorkoutSummary } from "../../types/workout"
import {
  fetchWorkoutsData,
  fetchWorkoutSummaryData,
  createWorkoutData,
  updateWorkoutData,
  deleteWorkoutData,
} from "../../services/workoutService"

interface WorkoutsState {
  workouts: Workout[]
  workoutSummary: WorkoutSummary
  loading: boolean
  error: string | null
}

const initialState: WorkoutsState = {
  workouts: [],
  workoutSummary: {
    workoutsCompleted: 0,
    totalMinutes: 0,
    caloriesBurned: 0,
    improvement: 0,
  },
  loading: false,
  error: null,
}

export const fetchWorkouts = createAsyncThunk("workouts/fetchWorkouts", async () => {
  const data = await fetchWorkoutsData()
  return data
})

export const fetchWorkoutSummary = createAsyncThunk("workouts/fetchWorkoutSummary", async () => {
  const data = await fetchWorkoutSummaryData()
  return data
})

export const createWorkout = createAsyncThunk("workouts/createWorkout", async (workout: Workout) => {
  const data = await createWorkoutData(workout)
  return data
})

export const updateWorkout = createAsyncThunk("workouts/updateWorkout", async (workout: Workout) => {
  const data = await updateWorkoutData(workout)
  return data
})

export const deleteWorkout = createAsyncThunk("workouts/deleteWorkout", async (workoutId: number) => {
  await deleteWorkoutData(workoutId)
  return workoutId
})

const workoutsSlice = createSlice({
  name: "workouts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch workouts
      .addCase(fetchWorkouts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWorkouts.fulfilled, (state, action: PayloadAction<Workout[]>) => {
        state.loading = false
        state.workouts = action.payload
      })
      .addCase(fetchWorkouts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch workouts"
      })

      // Fetch workout summary
      .addCase(fetchWorkoutSummary.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWorkoutSummary.fulfilled, (state, action: PayloadAction<WorkoutSummary>) => {
        state.loading = false
        state.workoutSummary = action.payload
      })
      .addCase(fetchWorkoutSummary.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch workout summary"
      })

      // Create workout
      .addCase(createWorkout.fulfilled, (state, action: PayloadAction<Workout>) => {
        state.workouts.push(action.payload)
      })

      // Update workout
      .addCase(updateWorkout.fulfilled, (state, action: PayloadAction<Workout>) => {
        const index = state.workouts.findIndex((workout) => workout.id === action.payload.id)
        if (index !== -1) {
          state.workouts[index] = action.payload
        }
      })

      // Delete workout
      .addCase(deleteWorkout.fulfilled, (state, action: PayloadAction<number>) => {
        state.workouts = state.workouts.filter((workout) => workout.id !== action.payload)
      })
  },
})

export default workoutsSlice.reducer

