import { configureStore } from "@reduxjs/toolkit"
import workoutsReducer from "./workouts/workoutsSlice"
import nutritionReducer from "./nutrition/nutritionSlice"
import userReducer from "./user/userSlice"
import authReducer from "./auth/authSlice"

export const store = configureStore({
  reducer: {
    workouts: workoutsReducer,
    nutrition: nutritionReducer,
    user: userReducer,
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

