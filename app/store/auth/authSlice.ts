import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as authService from "../../services/AuthServices"
import type { UserProfile, AuthState } from "../../types/user"

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  requiresEmailVerification: false,
  verificationEmail: null,
  expiresAt: null,
}

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(username, password)

      // Store authentication data in AsyncStorage
      await AsyncStorage.setItem("userToken", response.token)
      await AsyncStorage.setItem("userData", JSON.stringify(response.user))
      if (response.expiresAt) {
        await AsyncStorage.setItem("tokenExpiresAt", response.expiresAt)
      }

      return response
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed")
    }
  },
)

// Update the register thunk to handle the exact response format
export const register = createAsyncThunk(
  "auth/register",
  async (
    {
      nama_lengkap,
      username,
      email,
      no_hp,
      tempat_lahir,
      tanggal_lahir,
      id_satuankerja,
      password,
    }: {
      nama_lengkap: string
      username: string
      email: string
      no_hp: string
      tempat_lahir: string
      tanggal_lahir: string
      id_satuankerja: number
      password?: string
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.register(
        nama_lengkap,
        username,
        email,
        no_hp,
        tempat_lahir,
        tanggal_lahir,
        id_satuankerja,
        password,
      )

      return {
        message: response.message,
        email: email,
        user: response.user,
        personel: response.personel,
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Registration failed")
    }
  },
)

// Update the regenerateOTP thunk to handle the exact response format
export const regenerateOTP = createAsyncThunk("auth/regenerateOTP", async (email: string, { rejectWithValue }) => {
  try {
    const response = await authService.regenerateOTP(email)
    return {
      message: response.message,
      email: email,
    }
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to regenerate OTP")
  }
})

export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (email: string, { rejectWithValue }) => {
  try {
    const response = await authService.forgotPassword(email)
    return response
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to send reset email")
  }
})

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (
    { current_password, new_password }: { current_password: string; new_password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.changePassword(current_password, new_password)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to change password")
    }
  },
)

export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout()
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    restoreUser: (state, action: PayloadAction<{ token: string; user: UserProfile; expiresAt?: string }>) => {
      state.token = action.payload.token
      state.user = action.payload.user
      state.isAuthenticated = true
      if (action.payload.expiresAt) {
        state.expiresAt = action.payload.expiresAt
      }
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
    clearEmailVerification: (state) => {
      state.requiresEmailVerification = false
      state.verificationEmail = null
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
        state.expiresAt = action.payload.expiresAt
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
        state.requiresEmailVerification = true
        state.verificationEmail = action.payload.email
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || "Registration failed"
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || "Failed to send reset email"
      })

      // Regenerate OTP
      .addCase(regenerateOTP.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(regenerateOTP.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(regenerateOTP.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || "Failed to regenerate OTP"
      })

      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || "Failed to change password"
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false
        state.token = null
        state.user = null
        state.requiresEmailVerification = false
        state.verificationEmail = null
        state.expiresAt = null
      })
  },
})

export const { restoreUser, updateUserProfile, clearError, clearEmailVerification } = authSlice.actions

export default authSlice.reducer

