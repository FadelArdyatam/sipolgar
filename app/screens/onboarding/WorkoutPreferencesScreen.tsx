"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useDispatch } from "react-redux"
import { ArrowLeft, ArrowRight, Check } from "lucide-react-native"
import { updateUserProfile } from "../../store/auth/authSlice"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { AppDispatch } from "../../store"

export default function WorkoutPreferencesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>()
  const dispatch = useDispatch<AppDispatch>()

  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [workoutFrequency, setWorkoutFrequency] = useState<number>(3)

  const workoutTypes = [
    {
      id: "strength",
      title: "Strength Training",
      icon: "https://via.placeholder.com/50?text=Strength",
    },
    {
      id: "cardio",
      title: "Cardio",
      icon: "https://via.placeholder.com/50?text=Cardio",
    },
    {
      id: "hiit",
      title: "HIIT",
      icon: "https://via.placeholder.com/50?text=HIIT",
    },
    {
      id: "yoga",
      title: "Yoga",
      icon: "https://via.placeholder.com/50?text=Yoga",
    },
    {
      id: "pilates",
      title: "Pilates",
      icon: "https://via.placeholder.com/50?text=Pilates",
    },
    {
      id: "crossfit",
      title: "CrossFit",
      icon: "https://via.placeholder.com/50?text=CrossFit",
    },
  ]

  const frequencyOptions = [1, 2, 3, 4, 5, 6, 7]

  const toggleWorkoutType = (id: string) => {
    if (selectedTypes.includes(id)) {
      setSelectedTypes(selectedTypes.filter((type) => type !== id))
    } else {
      setSelectedTypes([...selectedTypes, id])
    }
  }

  const handleComplete = () => {
    // Validasi: pastikan pengguna memilih setidaknya satu jenis workout
    if (selectedTypes.length === 0) {
      Alert.alert("Selection Required", "Please select at least one workout type")
      return
    }

    // Save workout preferences to Redux
    dispatch(
      updateUserProfile({
        preferredWorkoutTypes: selectedTypes,
        workoutFrequency,
        onboardingCompleted: true,
        // Inisialisasi statistik pengguna
        stats: {
          totalWorkouts: 0,
          streak: 0,
          achievements: 0,
        },
      }),
    )

    // Navigate to home screen
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" }],
    })
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
            <Text className="text-2xl font-bold text-gray-800 mb-2">Workout Preferences</Text>
            <Text className="text-gray-600">
              Select the types of workouts you enjoy and how often you plan to exercise
            </Text>
          </View>

          <View className="mb-8">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Preferred Workout Types</Text>
            <View className="flex-row flex-wrap">
              {workoutTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  className={`mr-3 mb-3 p-3 rounded-xl border ${
                    selectedTypes.includes(type.id) ? "border-amber-500 bg-amber-50" : "border-gray-200"
                  }`}
                  onPress={() => toggleWorkoutType(type.id)}
                >
                  <View className="items-center">
                    <Image source={{ uri: type.icon }} className="w-10 h-10 mb-2" />
                    <Text className="text-gray-800 text-center">{type.title}</Text>
                    {selectedTypes.includes(type.id) && (
                      <View className="absolute top-0 right-0 bg-amber-500 w-5 h-5 rounded-full items-center justify-center">
                        <Check size={12} color="white" />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mb-8">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              How many days per week do you plan to workout?
            </Text>
            <View className="flex-row justify-between mb-2">
              {frequencyOptions.map((freq) => (
                <TouchableOpacity
                  key={freq}
                  className={`w-12 h-12 rounded-full items-center justify-center ${
                    workoutFrequency === freq ? "bg-amber-500" : "bg-gray-100"
                  }`}
                  onPress={() => setWorkoutFrequency(freq)}
                >
                  <Text className={`font-semibold ${workoutFrequency === freq ? "text-white" : "text-gray-700"}`}>
                    {freq}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text className="text-center text-gray-600 mt-2">
              {workoutFrequency} {workoutFrequency === 1 ? "day" : "days"} per week
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="p-6 border-t border-gray-100">
        <TouchableOpacity
          className="bg-amber-500 py-4 rounded-xl flex-row justify-center items-center"
          onPress={handleComplete}
        >
          <Text className="text-white font-bold text-lg mr-2">Complete Setup</Text>
          <ArrowRight size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

