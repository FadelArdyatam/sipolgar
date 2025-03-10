"use client"

import { useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native"
import { useSelector, useDispatch } from "react-redux"
import { fetchWorkoutSummary } from "../store/workouts/workoutsSlice"
import { Calendar, Award, TrendingUp, Dumbbell } from "lucide-react-native"
import type { RootState, AppDispatch } from "../store"

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { workoutSummary, loading } = useSelector((state: RootState) => state.workouts)

  useEffect(() => {
    dispatch(fetchWorkoutSummary())
  }, [dispatch])

  // Personalized greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 18) return "Good Afternoon"
    return "Good Evening"
  }

  // Personalized workout suggestion based on user preferences
  const getWorkoutSuggestion = () => {
    if (!user || !user.preferredWorkoutTypes || user.preferredWorkoutTypes.length === 0) {
      return "Try a full body workout today"
    }

    const day = new Date().getDay() // 0 = Sunday, 1 = Monday, etc.

    // Rotate through preferred workout types based on day of week
    const index = day % user.preferredWorkoutTypes.length
    const workoutType = user.preferredWorkoutTypes[index]

    switch (workoutType) {
      case "strength":
        return "How about a strength training session today?"
      case "cardio":
        return "A cardio workout would be perfect for today!"
      case "hiit":
        return "Ready for an intense HIIT session today?"
      case "yoga":
        return "A yoga session would be great for today!"
      case "pilates":
        return "Try a pilates workout today!"
      case "crossfit":
        return "Challenge yourself with CrossFit today!"
      default:
        return "Try a workout that matches your goals today!"
    }
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="bg-blue-500 pt-12 pb-6 px-4 rounded-b-3xl">
        <Text className="text-blue-100 text-lg">{getGreeting()}</Text>
        <Text className="text-white text-2xl font-bold mb-4">{user ? user.name : "Fitness Enthusiast"}</Text>

        <View className="bg-white bg-opacity-20 p-4 rounded-xl">
          <Text className="text-white font-medium mb-1">Today's Suggestion</Text>
          <Text className="text-white text-lg">{getWorkoutSuggestion()}</Text>
        </View>
      </View>

      {/* Workout Summary */}
      <View className="mx-4 -mt-4 bg-white rounded-xl shadow-sm p-4 mb-6">
        <Text className="text-gray-800 font-semibold mb-3">Your Progress</Text>
        <View className="flex-row justify-between">
          <View className="items-center">
            <View className="bg-blue-100 w-12 h-12 rounded-full items-center justify-center mb-1">
              <Dumbbell size={20} color="#3b82f6" />
            </View>
            <Text className="text-gray-800 font-bold">{workoutSummary.workoutsCompleted}</Text>
            <Text className="text-gray-500 text-xs">Workouts</Text>
          </View>

          <View className="items-center">
            <View className="bg-green-100 w-12 h-12 rounded-full items-center justify-center mb-1">
              <Calendar size={20} color="#10b981" />
            </View>
            <Text className="text-gray-800 font-bold">{user?.stats?.streak || 0}</Text>
            <Text className="text-gray-500 text-xs">Day Streak</Text>
          </View>

          <View className="items-center">
            <View className="bg-orange-100 w-12 h-12 rounded-full items-center justify-center mb-1">
              <TrendingUp size={20} color="#f97316" />
            </View>
            <Text className="text-gray-800 font-bold">{workoutSummary.totalMinutes}</Text>
            <Text className="text-gray-500 text-xs">Minutes</Text>
          </View>

          <View className="items-center">
            <View className="bg-purple-100 w-12 h-12 rounded-full items-center justify-center mb-1">
              <Award size={20} color="#8b5cf6" />
            </View>
            <Text className="text-gray-800 font-bold">{user?.stats?.achievements || 0}</Text>
            <Text className="text-gray-500 text-xs">Achievements</Text>
          </View>
        </View>
      </View>

      {/* Fitness Goal */}
      {user?.fitnessGoal && (
        <View className="mx-4 bg-white rounded-xl shadow-sm p-4 mb-6">
          <Text className="text-gray-800 font-semibold mb-2">Your Fitness Goal</Text>
          <View className="flex-row items-center">
            <View className="bg-blue-100 w-10 h-10 rounded-full items-center justify-center mr-3">
              <Award size={18} color="#3b82f6" />
            </View>
            <View>
              <Text className="text-gray-800 font-medium">
                {user.fitnessGoal === "lose-weight" && "Lose Weight"}
                {user.fitnessGoal === "gain-muscle" && "Gain Muscle"}
                {user.fitnessGoal === "maintain" && "Maintain Fitness"}
                {user.fitnessGoal === "improve-fitness" && "Improve Overall Fitness"}
                {user.fitnessGoal === "other" && "Custom Goal"}
              </Text>
              <Text className="text-gray-500 text-sm">{user.workoutFrequency} workouts per week</Text>
            </View>
          </View>
        </View>
      )}

      {/* Recommended Workouts */}
      <View className="mx-4 mb-6">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-gray-800 font-semibold">Recommended Workouts</Text>
          <TouchableOpacity>
            <Text className="text-blue-500">See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2, 3].map((item) => (
            <TouchableOpacity
              key={item}
              className="mr-4 bg-white rounded-xl shadow-sm overflow-hidden"
              style={{ width: 200 }}
            >
              <Image
                source={{ uri: `https://via.placeholder.com/200x120?text=Workout+${item}` }}
                className="w-full h-24"
              />
              <View className="p-3">
                <Text className="text-gray-800 font-semibold mb-1">
                  {item === 1 && "Full Body Workout"}
                  {item === 2 && "HIIT Cardio"}
                  {item === 3 && "Core Strength"}
                </Text>
                <View className="flex-row justify-between">
                  <Text className="text-gray-500 text-xs">30 min</Text>
                  <Text className="text-gray-500 text-xs">Intermediate</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Recent Activity */}
      <View className="mx-4 mb-8">
        <Text className="text-gray-800 font-semibold mb-3">Recent Activity</Text>

        {loading ? (
          <View className="bg-white rounded-xl shadow-sm p-4 items-center justify-center py-8">
            <Text className="text-gray-500">Loading your activity...</Text>
          </View>
        ) : workoutSummary.workoutsCompleted > 0 ? (
          [1, 2].map((item) => (
            <View key={item} className="bg-white rounded-xl shadow-sm p-4 mb-3">
              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center">
                  <View className="bg-blue-100 w-8 h-8 rounded-full items-center justify-center mr-3">
                    <Dumbbell size={16} color="#3b82f6" />
                  </View>
                  <Text className="text-gray-800 font-medium">{item === 1 ? "Upper Body Workout" : "Leg Day"}</Text>
                </View>
                <Text className="text-gray-500 text-xs">{item === 1 ? "Today" : "Yesterday"}</Text>
              </View>
              <View className="flex-row">
                <Text className="text-gray-500 text-xs mr-3">{item === 1 ? "45 min" : "30 min"}</Text>
                <Text className="text-gray-500 text-xs">{item === 1 ? "320 calories" : "250 calories"}</Text>
              </View>
            </View>
          ))
        ) : (
          <View className="bg-white rounded-xl shadow-sm p-4 items-center justify-center py-8">
            <Text className="text-gray-500">No recent activity</Text>
            <TouchableOpacity className="mt-3 bg-blue-500 px-4 py-2 rounded-lg">
              <Text className="text-white font-medium">Start a Workout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

