"use client"

import { useEffect, useState } from "react"
import { View, Text, ActivityIndicator } from "react-native"
import { useSelector, useDispatch } from "react-redux"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import AsyncStorage from "@react-native-async-storage/async-storage"
import AppNavigator from "./AppNavigator"
import AuthNavigator from "./AuthNavigator"
import OnboardingNavigator from "./OnBoardingNavigator"
import { restoreUser } from "../store/auth/authSlice"
import type { RootState, AppDispatch } from "../store"

const Stack = createNativeStackNavigator()

export default function RootNavigator() {
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored authentication token
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken")
        const userData = await AsyncStorage.getItem("userData")

        if (token && userData) {
          dispatch(restoreUser({ token, user: JSON.parse(userData) }))
        }
      } catch (error) {
        console.error("Failed to restore authentication state:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [dispatch])

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </View>
    )
  }

  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : user && !user.onboardingCompleted ? (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : (
          <Stack.Screen name="Main" component={AppNavigator} />
        )}
      </Stack.Navigator>
  )
}

