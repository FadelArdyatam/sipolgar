import { createSlice } from "@reduxjs/toolkit"
import type { User, UserStats } from "../../types/user"

interface UserState {
  user: User | null
  stats: UserStats | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  user: {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
  },
  stats: {
    totalWorkouts: 24,
    streak: 5,
    achievements: 8,
    height: 175,
    weight: 70,
    bmi: 22.9,
    goal: "Build Muscle",
  },
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload }
    },
    updateUserStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload }
    },
  },
})

export const { updateUserProfile, updateUserStats } = userSlice.actions
export default userSlice.reducer

