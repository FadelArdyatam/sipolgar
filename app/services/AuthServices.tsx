import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL } from "../config"
import { logApiCall, logApiResponse, logApiError } from "../api/logger"
import { checkNetworkBeforeCall } from "../api/networkMonitor"
import type {
  UserProfile,
  SatuanKerja,
  SatuanKerjaParent,
  SatuanKerjaChild,
  LoginResponse,
  RegisterResponse,
  RegenerateOTPResponse,
} from "../types/user"

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
  (response) => {
    logApiResponse(response.config.url || "", response.data)
    return response
  },
  (error) => {
    logApiError(error.config?.url || "unknown", error)

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
    logApiCall(config.method?.toUpperCase() || "UNKNOWN", config.url || "", config.data)

    // Check network connection
    const isConnected = await checkNetworkBeforeCall()
    if (!isConnected) {
      throw new Error("No internet connection. Please check your network settings.")
    }

    const token = await AsyncStorage.getItem("userToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Login user
export const login = async (
  username: string,
  password: string,
): Promise<{ token: string; user: UserProfile; expiresAt: string }> => {
  try {
    const response = await api.post<LoginResponse>("/login", {
      username,
      password,
    })

    console.log("Login response:", JSON.stringify(response.data, null, 2))

    if (response.data.token) {
      // Store token for future authenticated requests
      await AsyncStorage.setItem("userToken", response.data.token)

      // Store user data
      await AsyncStorage.setItem("userData", JSON.stringify(response.data.user))

      // Store expiration time if available
      if (response.data.expires_at) {
        await AsyncStorage.setItem("tokenExpiresAt", response.data.expires_at)
      }

      return {
        token: response.data.token,
        user: response.data.user,
        expiresAt: response.data.expires_at,
      }
    }

    throw new Error("Login failed: No token received")
  } catch (error) {
    throw error
  }
}

// Update the register function to handle the exact response format
export const register = async (
  nama_lengkap: string,
  username: string,
  email: string,
  no_hp: string,
  tempat_lahir: string,
  tanggal_lahir: string,
  id_satuankerja: number,
  password?: string,
): Promise<RegisterResponse> => {
  try {
    // Log the registration request
    console.log("Sending registration request with data:", {
      nama_lengkap,
      username,
      email,
      no_hp,
      tempat_lahir,
      tanggal_lahir,
      id_satuankerja,
      password: password ? "[REDACTED]" : undefined,
    })

    const response = await api.post<RegisterResponse>("/register", {
      nama_lengkap,
      username,
      email,
      no_hp,
      tempat_lahir,
      tanggal_lahir,
      id_satuankerja,
      password,
      jenis_kelamin: "Laki-laki", // Default value or make this a parameter
    })

    console.log("Registration response:", response.data)
    return response.data
  } catch (error) {
    console.error("Registration error:", error)
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

// Update the regenerateOTP function to match the exact response format
export const regenerateOTP = async (email: string): Promise<RegenerateOTPResponse> => {
  try {
    const response = await api.post<RegenerateOTPResponse>("/regenerate-otp", { email })
    console.log("Regenerate OTP response:", response.data)
    return response.data
  } catch (error) {
    console.error("Regenerate OTP error:", error)
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

// Get all satuan kerja - with retry mechanism
export const getAllSatuanKerja = async (retryCount = 0): Promise<SatuanKerja[]> => {
  try {
    console.log("Fetching all satuan kerja")
    const response = await api.get("/satuan-kerja")
    console.log("All satuan kerja response:", response.data)
    return response.data.data || []
  } catch (error) {
    console.error("Failed to fetch all satuan kerja:", error)

    // Add retry logic (max 2 retries)
    if (retryCount < 2) {
      console.log(`Retrying getAllSatuanKerja (attempt ${retryCount + 1})`)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait 1 second before retry
      return getAllSatuanKerja(retryCount + 1)
    }

    return []
  }
}

// Get parent satuan kerja - with retry mechanism
export const getParentSatuanKerja = async (retryCount = 0): Promise<SatuanKerjaParent[]> => {
  try {
    console.log("Fetching parent satuan kerja")
    const response = await api.get("/satuan-kerja/parents")
    console.log("Parent satuan kerja response:", response.data)
    return response.data.data || []
  } catch (error) {
    console.error("Failed to fetch parent satuan kerja:", error)

    // Add retry logic (max 2 retries)
    if (retryCount < 2) {
      console.log(`Retrying getParentSatuanKerja (attempt ${retryCount + 1})`)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait 1 second before retry
      return getParentSatuanKerja(retryCount + 1)
    }

    return []
  }
}

// Get child satuan kerja by parent ID - with retry mechanism
export const getChildSatuanKerja = async (parentId: number, retryCount = 0): Promise<SatuanKerjaChild[]> => {
  try {
    console.log(`Fetching child satuan kerja for parent ID: ${parentId}`)
    const response = await api.get(`/satuan-kerja/children/${parentId}`)
    console.log("Child satuan kerja response:", response.data)
    return response.data.data || []
  } catch (error) {
    console.error(`Failed to fetch child satuan kerja for parent ID ${parentId}:`, error)

    // Add retry logic (max 2 retries)
    if (retryCount < 2) {
      console.log(`Retrying getChildSatuanKerja (attempt ${retryCount + 1})`)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait 1 second before retry
      return getChildSatuanKerja(parentId, retryCount + 1)
    }

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
    await AsyncStorage.removeItem("tokenExpiresAt")
  } catch (error) {
    console.error("Logout error:", error)
    // Still clear storage even if API call fails
    await AsyncStorage.removeItem("userToken")
    await AsyncStorage.removeItem("userData")
    await AsyncStorage.removeItem("tokenExpiresAt")
  }
}

