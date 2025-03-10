"use client"

import { useEffect } from "react"
import { View, Text, FlatList, TouchableOpacity } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { fetchWorkouts } from "../store/workouts/workoutsSlice"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RootState, AppDispatch } from "../store"
import WorkoutCard from "../components/WorkoutCard"

export default function WorkoutsScreen() {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation<NativeStackNavigationProp<any>>()
  const { workouts, loading } = useSelector((state: RootState) => state.workouts)

  useEffect(() => {
    dispatch(fetchWorkouts())
  }, [dispatch])

  const handleCreateWorkout = () => {
    navigation.navigate("CreateWorkout")
  }

  const handleWorkoutPress = (workoutId: number) => {
    navigation.navigate("WorkoutDetail", { workoutId })
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">Loading workouts...</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold text-gray-800">Workouts</Text>
        <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-lg" onPress={handleCreateWorkout}>
          <Text className="text-white font-semibold">New Workout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleWorkoutPress(item.id)}>
            <WorkoutCard workout={item} />
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      />
    </View>
  )
}

