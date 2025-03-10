import AsyncStorage from "@react-native-async-storage/async-storage"
import type { UserProfile } from "../types/user"

// Mock user data for demonstration
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "fadel@example.com",
    password: "password123",
  },
]

// In a real app, this would be an API call to your backend
export const login = async (email: string, password: string): Promise<{ token: string; user: UserProfile }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = mockUsers.find((u) => u.email === email)

  if (!user || user.password !== password) {
    throw new Error("Invalid email or password")
  }

  // Check if user has completed onboarding before
  let onboardingStatus = false
  try {
    const existingUserData = await AsyncStorage.getItem("userData")
    if (existingUserData) {
      const parsedData = JSON.parse(existingUserData)
      if (parsedData.id === user.id && parsedData.onboardingCompleted) {
        onboardingStatus = true
      }
    }
  } catch (error) {
    console.error("Error checking onboarding status:", error)
  }

  // Create a user profile without the password
  const userProfile: UserProfile = {
    id: user.id,
    name: user.name,
    email: user.email,
    onboardingCompleted: onboardingStatus,
    // Initialize stats if this is a new login
    stats: {
      totalWorkouts: 0,
      streak: 0,
      achievements: 0,
    },
  }

  // Generate a mock token
  const token = `mock-token-${Date.now()}`

  return { token, user: userProfile }
}

export const register = async (
  name: string,
  email: string,
  password: string,
): Promise<{ token: string; user: UserProfile }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Check if user already exists
  const existingUser = mockUsers.find((u) => u.email === email)
  if (existingUser) {
    throw new Error("Email already in use")
  }

  // Create a new user
  const newUser = {
    id: `${mockUsers.length + 1}`,
    name,
    email,
    password,
  }

  mockUsers.push(newUser)

  // Create a user profile without the password
  const userProfile: UserProfile = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    onboardingCompleted: false,
    // Initialize stats for new user
    stats: {
      totalWorkouts: 0,
      streak: 0,
      achievements: 0,
    },
  }

  // Generate a mock token
  const token = `mock-token-${Date.now()}`

  return { token, user: userProfile }
}

// Update user profile in AsyncStorage
export const updateProfile = async (userData: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    // Get current user data
    const userDataString = await AsyncStorage.getItem("userData")
    if (!userDataString) {
      throw new Error("User data not found")
    }

    const currentUserData = JSON.parse(userDataString) as UserProfile

    // Update user data
    const updatedUserData = {
      ...currentUserData,
      ...userData,
    }

    // Save updated user data
    await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData))

    return updatedUserData
  } catch (error) {
    console.error("Failed to update profile:", error)
    throw error
  }
}

