"use client"

import { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native"
import { useDispatch } from "react-redux"
import { login } from "../../store/auth/authSlice"
import { Eye, EyeOff, User, Lock } from "lucide-react-native"
import type { AppDispatch } from "../../store"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { AuthStackParamList } from "../../navigation/types"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"

type Log1inScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Login">
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formErrors, setFormErrors] = useState({
    username: "",
    password: "",
  })
  const dispatch = useDispatch<AppDispatch>()

  const validateForm = () => {
    let isValid = true
    const errors = { username: "", password: "" }

    if (!username.trim()) {
      errors.username = "Username tidak boleh kosong"
      isValid = false
    }

    if (!password) {
      errors.password = "Password tidak boleh kosong"
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleLogin = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      console.log("Attempting login with username:", username)
      await dispatch(login({ username, password })).unwrap()
      console.log("Login successful")
      // Navigation will be handled by the auth state listener in AuthNavigator
    } catch (error) {
      console.error("Login error:", error)
      Alert.alert(
        "Login Failed",
        (error instanceof Error && error.message || "Kode verifikasi baru telah dikirim ke email Anda")
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 justify-start">
          {/* Logo and welcome section with animation */}
          <View className="items-center mb-8 mt-10">
            
            <Image src="/">
              
            </Image>
            <View className="w-20 h-20 mb-6 bg-amber-500 rounded-full items-center justify-center">
              <Text className="text-white text-3xl font-bold">S</Text>
            </View>
            
            
            <Text className="text-2xl font-bold text-gray-800">Selamat Datang</Text>
            <Text className="text-gray-500 text-center mt-2">Silahkan masuk untuk melanjutkan</Text>
          </View>

          <View className="space-y-4 mb-4">
            <Input
              leftIcon={<User size={20} color="#6b7280" />}
              placeholder="NRP/Username"
              value={username}
              onChangeText={(text) => {
                setUsername(text)
                if (formErrors.username) setFormErrors({...formErrors, username: ""})
              }}
              autoCapitalize="none"
              error={formErrors.username}
              className="mb-2"
            />

            <Input
              leftIcon={<Lock size={20} color="#6b7280" />}
              rightIcon={showPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
              onRightIconPress={() => setShowPassword(!showPassword)}
              placeholder="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text)
                if (formErrors.password) setFormErrors({...formErrors, password: ""})
              }}
              secureTextEntry={!showPassword}
              error={formErrors.password}
              className="mb-2"
            />
          </View>

          <TouchableOpacity 
            className="self-end mb-6" 
            onPress={() => navigation.navigate("ForgotPassword")}
            activeOpacity={0.7}
          >
            <Text className="text-amber-500 font-medium">Lupa Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`bg-amber-500 py-3.5 rounded-full items-center shadow-sm ${loading ? "opacity-70" : ""}`}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white font-semibold text-lg ml-2">Masuk...</Text>
              </View>
            ) : (
              <Text className="text-white font-semibold text-lg">Masuk</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">Belum punya akun? </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate("Register")}
              activeOpacity={0.7}
            >
              <Text className="text-amber-500 font-medium">Daftar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}