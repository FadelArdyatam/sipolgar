"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useDispatch } from "react-redux"
import { ArrowLeft, ArrowRight, Check } from "lucide-react-native"
import { updateUserProfile } from "../../store/auth/authSlice"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { AppDispatch } from "../../store"

export default function FitnessGoalsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>()
  const dispatch = useDispatch<AppDispatch>()

  const [fitnessGoal, setFitnessGoal] = useState<
    "lose-weight" | "gain-muscle" | "maintain" | "improve-fitness" | "other"
  >("improve-fitness")

  const goals = [
    {
      id: "lose-weight",
      title: "Lose Weight",
      description: "Burn fat and reduce overall body weight",
      icon: "https://via.placeholder.com/60?text=Weight",
    },
    {
      id: "gain-muscle",
      title: "Gain Muscle",
      description: "Build strength and increase muscle mass",
      icon: "https://via.placeholder.com/60?text=Muscle",
    },
    {
      id: "maintain",
      title: "Maintain Fitness",
      description: "Keep your current fitness level and body composition",
      icon: "https://via.placeholder.com/60?text=Maintain",
    },
    {
      id: "improve-fitness",
      title: "Improve Overall Fitness",
      description: "Enhance endurance, flexibility, and general health",
      icon: "https://via.placeholder.com/60?text=Fitness",
    },
    {
      id: "other",
      title: "Other Goal",
      description: "I have a different fitness goal in mind",
      icon: "https://via.placeholder.com/60?text=Other",
    },
  ]

  const handleContinue = () => {
    // Save fitness goal to Redux
    dispatch(
      updateUserProfile({
        fitnessGoal,
      }),
    )

    // Navigate to next screen
    navigation.navigate("ActivityLevel")
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
            <Text className="text-2xl font-bold text-gray-800 mb-2">What's Your Goal?</Text>
            <Text className="text-gray-600">Select the primary fitness goal you want to achieve</Text>
          </View>

          <View className="mb-8">
            {goals.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                className={`flex-row items-center p-4 mb-3 rounded-xl border ${
                  fitnessGoal === goal.id ? "border-amber-500 bg-amber-50" : "border-gray-200"
                }`}
                onPress={() => setFitnessGoal(goal.id as any)}
              >
                <Image source={{ uri: goal.icon }} className="w-12 h-12 rounded-full mr-4" />
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800 text-lg">{goal.title}</Text>
                  <Text className="text-gray-600">{goal.description}</Text>
                </View>
                {fitnessGoal === goal.id && (
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

