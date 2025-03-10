"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useDispatch } from "react-redux"
import { ArrowLeft, ArrowRight, Check } from "lucide-react-native"
import { updateUserProfile } from "../../store/auth/authSlice"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { AppDispatch } from "../../store"

export default function ActivityLevelScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>()
  const dispatch = useDispatch<AppDispatch>()

  const [activityLevel, setActivityLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner")

  const levels = [
    {
      id: "beginner",
      title: "Beginner",
      description: "New to fitness or returning after a long break",
      icon: "https://via.placeholder.com/60?text=Beginner",
    },
    {
      id: "intermediate",
      title: "Intermediate",
      description: "Regular exercise with some experience",
      icon: "https://via.placeholder.com/60?text=Intermediate",
    },
    {
      id: "advanced",
      title: "Advanced",
      description: "Experienced with consistent training",
      icon: "https://via.placeholder.com/60?text=Advanced",
    },
  ]

  const handleContinue = () => {
    // Save activity level to Redux
    dispatch(
      updateUserProfile({
        activityLevel,
      }),
    )

    // Navigate to next screen
    navigation.navigate("WorkoutPreferences")
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="p-6">
          <TouchableOpacity className="flex-row items-center mb-6" onPress={() => navigation.goBack()}>
            <ArrowLeft size={20} color="#4b5563" />
            <Text className="ml-2 text-gray-600 font-medium">Back</Text>
          </TouchableOpacity>

          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-800 mb-2">Your Activity Level</Text>
            <Text className="text-gray-600">Select your current fitness experience level</Text>
          </View>

          <View className="mb-8">
            {levels.map((level) => (
              <TouchableOpacity
                key={level.id}
                className={`flex-row items-center p-4 mb-3 rounded-xl border ${
                  activityLevel === level.id ? "border-amber-500 bg-amber-50" : "border-gray-200"
                }`}
                onPress={() => setActivityLevel(level.id as any)}
              >
                <Image source={{ uri: level.icon }} className="w-12 h-12 rounded-full mr-4" />
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800 text-lg">{level.title}</Text>
                  <Text className="text-gray-600">{level.description}</Text>
                </View>
                {activityLevel === level.id && (
                  <View className="bg-amber-500 w-6 h-6 rounded-full items-center justify-center">
                    <Check size={16} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
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
    </View>
  )
}

