"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useDispatch } from "react-redux"
import { ArrowLeft, ArrowRight } from "lucide-react-native"
import { updateUserProfile } from "../../store/auth/authSlice"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { AppDispatch } from "../../store"

export default function BasicInfoScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>()
  const dispatch = useDispatch<AppDispatch>()

  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [age, setAge] = useState("")
  const [division, setDivision] = useState("")
  const [gender, setGender] = useState<"male" | "female" | "other" | "prefer-not-to-say">("male")

  const genderOptions: { value: "male" | "female" | "other" | "prefer-not-to-say"; label: string }[] = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer-not-to-say", label: "Prefer not to say" },
  ]

  const validateInputs = () => {
    // Validasi berat badan
    if (
      weight &&
      (isNaN(Number.parseFloat(weight)) || Number.parseFloat(weight) <= 0 || Number.parseFloat(weight) > 300)
    ) {
      Alert.alert("Invalid Weight", "Please enter a valid weight between 1-300 kg")
      return false
    }

    // Validasi tinggi badan
    if (
      height &&
      (isNaN(Number.parseFloat(height)) || Number.parseFloat(height) <= 0 || Number.parseFloat(height) > 250)
    ) {
      Alert.alert("Invalid Height", "Please enter a valid height between 1-250 cm")
      return false
    }

    // Validasi usia
    if (age && (isNaN(Number.parseInt(age)) || Number.parseInt(age) <= 0 || Number.parseInt(age) > 120)) {
      Alert.alert("Invalid Age", "Please enter a valid age between 1-120 years")
      return false
    }

    return true
  }

  const handleContinue = () => {
    if (!validateInputs()) {
      return
    }

    // Save basic info to Redux
    dispatch(
      updateUserProfile({
        weight: weight ? Number.parseFloat(weight) : undefined,
        height: height ? Number.parseFloat(height) : undefined,
        age: age ? Number.parseInt(age) : undefined,
        gender,
      }),
    )

    // Navigate to next screen
    navigation.navigate("FitnessGoals")
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="p-6">
          <TouchableOpacity className="flex-row items-center mb-6" onPress={() => navigation.goBack()}>
            <ArrowLeft size={20} color="#4b5563" />
            <Text className="ml-2 text-gray-600 font-medium">Back</Text>
          </TouchableOpacity>

          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-800 mb-2">Basic Information</Text>
            <Text className="text-gray-600">
              Let's start with some basic information to help personalize your experience
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-1">Weight (kg)</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700"
              placeholder="Enter your weight"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-1">Height (cm)</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700"
              placeholder="Enter your height"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-1">Age</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700"
              placeholder="Enter your age"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
          </View>

          
          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-1">Divisi</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700"
              placeholder="Enter your weight"
              value={division}
              onChangeText={setDivision}
              keyboardType="numeric"
            />
          </View>

          <View className="mb-8">
            <Text className="text-gray-700 font-medium mb-3">Gender</Text>
            <View className="flex-row flex-wrap">
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  className={`mr-3 mb-3 px-4 py-2 rounded-full ${
                    gender === option.value ? "bg-amber-500" : "bg-gray-100"
                  }`}
                  onPress={() => setGender(option.value)}
                >
                  <Text className={`${gender === option.value ? "text-white" : "text-gray-700"} font-medium`}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="p-6 border-t border-gray-100">
        <TouchableOpacity
          className="bg-amber-500 py-4 rounded-xl flex-row justify-center items-center"
          onPress={handleContinue}
        >
          <Text className="text-white font-bold text-lg mr-2">Continue</Text>
          <ArrowRight size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

