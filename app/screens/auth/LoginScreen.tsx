"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native"
import { useDispatch } from "react-redux"
import { login } from "../../store/auth/authSlice"
import { Eye, EyeOff, Mail, Lock } from "lucide-react-native"
import type { AppDispatch } from "../../store"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { AuthStackParamList } from "../../navigation/types"

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Login">
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      await dispatch(login({ email, password })).unwrap()
      // Navigation will be handled by the auth state listener in AuthNavigator
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error instanceof Error ? error.message : "Please check your credentials and try again",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 justify-center">
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-primary-foreground rounded-full items-center justify-center mb-4">
              <Text className="text-white text-3xl font-bold">F</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-800">Welcome Back</Text>
            <Text className="text-gray-500 text-center mt-2">
              Sign in to your FitTrack account to continue your fitness journey
            </Text>
          </View>

          <View className="space-y-4 mb-6">
            <View className="relative">
              <View className="absolute left-3 top-3 z-10">
                <Mail size={20} color="#6b7280" />
              </View>
              <TextInput
                className="bg-white border border-gray-300 rounded-lg px-10 py-3 text-gray-700"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View className="relative">
              <View className="absolute left-3 top-3 z-10">
                <Lock size={20} color="#6b7280" />
              </View>
              <TextInput
                className="bg-white border border-gray-300 rounded-lg px-10 py-3 text-gray-700"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity className="absolute right-3 top-3 z-10" onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity className="self-end mb-6" onPress={() => navigation.navigate("ForgotPassword")}>
            <Text className="text-[#Ffd06c] font-medium">Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`bg-primary py-3 rounded-lg items-center ${loading ? "opacity-70" : ""}`}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="text-white font-semibold text-lg">{loading ? "Signing in..." : "Sign In"}</Text>
          </TouchableOpacity>

          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500">or continue with</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          <View className="flex-row justify-between mb-6">
            <TouchableOpacity className="flex-1 mr-2 flex-row justify-center items-center bg-white border border-gray-300 py-3 rounded-lg">
              <Image source={{ uri: "https://www.google.com/favicon.ico" }} className="w-5 h-5 mr-2" />
              <Text className="text-gray-700 font-medium">Google</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 ml-2 flex-row justify-center items-center bg-white border border-gray-300 py-3 rounded-lg">
              <Image source={{ uri: "https://www.apple.com/favicon.ico" }} className="w-5 h-5 mr-2" />
              <Text className="text-gray-700 font-medium">Apple</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-600">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text className="text-primary font-medium">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

