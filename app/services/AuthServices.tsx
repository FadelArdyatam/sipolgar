import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL } from "../config"
import type { UserProfile, SatuanKerja, SatuanKerjaParent, SatuanKerjaChild } from "../types/user"

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message)

    // Handle network errors
    if (!error.response) {
      return Promise.reject(new Error("Network error. Please check your connection and try again."))
    }

    // Handle API errors with appropriate messages
    const errorMessage = error.response.data?.message || "An unexpected error occurred"
    return Promise.reject(new Error(errorMessage))
  },
)

// Add request interceptor to automatically add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Login user
export const login = async (username: string, password: string): Promise<{ token: string; user: UserProfile }> => {
  try {
    const response = await api.post("/login", {
      username,
      password,
    })

    if (response.data.token) {
      // Store token for future authenticated requests
      await AsyncStorage.setItem("userToken", response.data.token)

      // Get user profile with the token
      const userProfile = await getUserProfile(response.data.token)

      return {
        token: response.data.token,
        user: userProfile,
      }
    }

    throw new Error("Login failed: No token received")
  } catch (error) {
    throw error
  }
}

// Register a new user
export const register = async (
  nama_lengkap: string,
  username: string,
  email: string,
  no_hp: string,
  tempat_lahir: string,
  tanggal_lahir: string,
  id_satuankerja: number,
): Promise<{ message: string }> => {
  try {
    const response = await api.post("/register", {
      nama_lengkap,
      username,
      email,
      no_hp,
      tempat_lahir,
      tanggal_lahir,
      id_satuankerja,
    })

    return { message: response.data.message || "Registration successful" }
  } catch (error) {
    throw error
  }
}

// Change password
export const changePassword = async (current_password: string, new_password: string): Promise<{ message: string }> => {
  try {
    const response = await api.post("/change-password", {
      current_password,
      new_password,
    })

    return { message: response.data.message || "Password changed successfully" }
  } catch (error) {
    throw error
  }
}

// Forgot password
export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  try {
    const response = await api.post("/forgot-password", { email })
    return { message: response.data.message || "Password reset email sent" }
  } catch (error) {
    throw error
  }
}

// Regenerate OTP
export const regenerateOTP = async (email: string): Promise<{ message: string }> => {
  try {
    const response = await api.post("/regenerate-otp", { email })
    return { message: response.data.message || "New verification code has been sent" }
  } catch (error) {
    throw error
  }
}

// Get user profile
export const getUserProfile = async (token: string): Promise<UserProfile> => {
  try {
    const response = await api.get("/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data.user
  } catch (error) {
    throw error
  }
}

// Get all satuan kerja
export const getAllSatuanKerja = async (): Promise<SatuanKerja[]> => {
  try {
    const response = await api.get("/satuan-kerja")
    return response.data.data || []
  } catch (error) {
    console.error("Failed to fetch all satuan kerja:", error)
    return []
  }
}

// Get parent satuan kerja
export const getParentSatuanKerja = async (): Promise<SatuanKerjaParent[]> => {
  try {
    const response = await api.get("/satuan-kerja/parents")
    return response.data.data || []
  } catch (error) {
    console.error("Failed to fetch parent satuan kerja:", error)
    return []
  }
}

// Get child satuan kerja by parent ID
export const getChildSatuanKerja = async (parentId: number): Promise<SatuanKerjaChild[]> => {
  try {
    const response = await api.get(`/satuan-kerja/chilren/${parentId}`)
    return response.data.data || []
  } catch (error) {
    console.error(`Failed to fetch child satuan kerja for parent ID ${parentId}:`, error)
    return []
  }
}

// Get satuan kerja detail by ID
export const getSatuanKerjaDetail = async (id: number): Promise<SatuanKerja | null> => {
  try {
    const response = await api.get(`/satuan-kerja/${id}`)
    return response.data.data || null
  } catch (error) {
    console.error(`Failed to fetch satuan kerja detail for ID ${id}:`, error)
    return null
  }
}

// Logout
export const logout = async (): Promise<void> => {
  try {
    const token = await AsyncStorage.getItem("userToken")

    if (token) {
      // Call logout API if needed
      // await api.post('/logout');
    }

    // Clear local storage
    await AsyncStorage.removeItem("userToken")
    await AsyncStorage.removeItem("userData")
  } catch (error) {
    console.error("Logout error:", error)
    // Still clear storage even if API call fails
    await AsyncStorage.removeItem("userToken")
    await AsyncStorage.removeItem("userData")
  }
}

