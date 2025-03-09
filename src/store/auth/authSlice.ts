import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { login as loginApi, register as registerApi } from "../../services/authService"
import type { UserProfile, AuthState } from "../../types/user"

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await loginApi(email, password)

      // Store authentication data in AsyncStorage
      await AsyncStorage.setItem("userToken", response.token)
      await AsyncStorage.setItem("userData", JSON.stringify(response.user))

      return response
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed")
    }
  },
)

export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await registerApi(name, email, password)

      // Store authentication data in AsyncStorage
      await AsyncStorage.setItem("userToken", response.token)
      await AsyncStorage.setItem("userData", JSON.stringify(response.user))

      return response
    } catch (error: any) {
      return rejectWithValue(error.message || "Registration failed")
    }
  },
)

export const logout = createAsyncThunk("auth/logout", async () => {
  // Clear authentication data from AsyncStorage
  await AsyncStorage.removeItem("userToken")
  await AsyncStorage.removeItem("userData")
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    restoreUser: (state, action: PayloadAction<{ token: string; user: UserProfile }>) => {
      state.token = action.payload.token
      state.user = action.payload.user
      state.isAuthenticated = true
    },
    updateUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        }

        // Update user data in AsyncStorage
        AsyncStorage.setItem("userData", JSON.stringify(state.user)).catch((error) =>
          console.error("Failed to update user data in AsyncStorage:", error),
        )
      }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.token = action.payload.token
        state.user = action.payload.user
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || "Login failed"
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.token = action.payload.token
        state.user = action.payload.user
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || "Registration failed"
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false
        state.token = null
        state.user = null
      })
  },
})

export const { restoreUser, updateUserProfile, clearError } = authSlice.actions

export default authSlice.reducer

