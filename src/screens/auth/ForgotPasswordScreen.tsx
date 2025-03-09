"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native"
import { useDispatch } from "react-redux"
import { resetPassword } from "../../store/auth/authSlice"
import { Mail, ArrowLeft } from "lucide-react-native"
import type { AppDispatch } from "../../store"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { AuthStackParamList } from "../../navigation/types"

type ForgotPasswordScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "ForgotPassword">
}

export default function ForgotPasswordScreen({ navigation }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const dispatch = useDispatch<AppDispatch>()

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address")
      return
    }

    setLoading(true)
    try {
      await dispatch(resetPassword(email)).unwrap()
      setResetSent(true)
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to send reset email. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6">
          <TouchableOpacity className="flex-row items-center mb-6" onPress={() => navigation.goBack()}>
            <ArrowLeft size={20} color="#4b5563" />
            <Text className="ml-2 text-gray-600 font-medium">Back to Login</Text>
          </TouchableOpacity>

          <View className="items-center mb-8">
            <Text className="text-2xl font-bold text-gray-800">Forgot Password</Text>
            <Text className="text-gray-500 text-center mt-2">
              {resetSent
                ? "Check your email for a link to reset your password"
                : "Enter your email and we'll send you a link to reset your password"}
            </Text>
          </View>

          {!resetSent ? (
            <>
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
              </View>

              <TouchableOpacity
                className={`bg-blue-500 py-3 rounded-lg items-center ${loading ? "opacity-70" : ""}`}
                onPress={handleResetPassword}
                disabled={loading}
              >
                <Text className="text-white font-semibold text-lg">{loading ? "Sending..." : "Send Reset Link"}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              className="bg-blue-500 py-3 rounded-lg items-center mt-4"
              onPress={() => navigation.navigate("Login")}
            >
              <Text className="text-white font-semibold text-lg">Back to Login</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

