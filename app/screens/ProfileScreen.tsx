import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../store/auth/authSlice"
import { User, Settings, LogOut, Award, Calendar, Activity, ChevronRight } from "lucide-react-native"
import type { RootState, AppDispatch } from "../store"

export default function ProfileScreen() {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
  }

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading profile...</Text>
      </View>
    )
  }

  // Calculate BMI if height and weight are available
  const bmi = user.height && user.weight ? (user.weight / Math.pow(user.height / 100, 2)).toFixed(1) : null

  // Determine BMI category
  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: "text-blue-500" }
    if (bmi < 25) return { label: "Normal", color: "text-green-500" }
    if (bmi < 30) return { label: "Overweight", color: "text-orange-500" }
    return { label: "Obese", color: "text-red-500" }
  }

  const bmiCategory = bmi ? getBmiCategory(Number.parseFloat(bmi)) : null

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="bg-blue-500 pt-12 pb-6 px-4 rounded-b-3xl">
        <View className="flex-row items-center">
          <View className="bg-white p-1 rounded-full">
            <Image source={{ uri: "https://via.placeholder.com/100" }} className="w-20 h-20 rounded-full" />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-white text-xl font-bold">{user.name}</Text>
            <Text className="text-blue-100">{user.email}</Text>

            <View className="flex-row mt-2">
              <TouchableOpacity className="bg-white bg-opacity-20 px-3 py-1 rounded-full mr-2">
                <Text className="text-white text-sm">Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                <Text className="text-white text-sm">Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* User Stats */}
      <View className="mx-4 -mt-4 bg-white rounded-xl shadow-sm p-4 mb-6">
        <Text className="text-gray-800 font-semibold mb-3">Your Stats</Text>
        <View className="flex-row justify-between">
          {user.weight && (
            <View className="items-center">
              <Text className="text-gray-500 text-xs">Weight</Text>
              <Text className="text-gray-800 font-bold text-lg">{user.weight} kg</Text>
            </View>
          )}

          {user.height && (
            <View className="items-center">
              <Text className="text-gray-500 text-xs">Height</Text>
              <Text className="text-gray-800 font-bold text-lg">{user.height} cm</Text>
            </View>
          )}

          {bmi && (
            <View className="items-center">
              <Text className="text-gray-500 text-xs">BMI</Text>
              <Text className="text-gray-800 font-bold text-lg">{bmi}</Text>
              <Text className={`text-xs ${bmiCategory?.color}`}>{bmiCategory?.label}</Text>
            </View>
          )}

          {user.age && (
            <View className="items-center">
              <Text className="text-gray-500 text-xs">Age</Text>
              <Text className="text-gray-800 font-bold text-lg">{user.age}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Fitness Goal */}
      {user.fitnessGoal && (
        <View className="mx-4 bg-white rounded-xl shadow-sm p-4 mb-6">
          <View className="flex-row items-center mb-2">
            <Award size={18} color="#4b5563" />
            <Text className="text-gray-800 font-semibold ml-2">Fitness Goal</Text>
          </View>
          <Text className="text-gray-700">
            {user.fitnessGoal === "lose-weight" && "Lose Weight"}
            {user.fitnessGoal === "gain-muscle" && "Gain Muscle"}
            {user.fitnessGoal === "maintain" && "Maintain Fitness"}
            {user.fitnessGoal === "improve-fitness" && "Improve Overall Fitness"}
            {user.fitnessGoal === "other" && "Custom Goal"}
          </Text>
        </View>
      )}

      {/* Workout Preferences */}
      <View className="mx-4 bg-white rounded-xl shadow-sm p-4 mb-6">
        <View className="flex-row items-center mb-2">
          <Activity size={18} color="#4b5563" />
          <Text className="text-gray-800 font-semibold ml-2">Workout Preferences</Text>
        </View>

        <View className="mb-3">
          <Text className="text-gray-600 mb-1">Activity Level</Text>
          <Text className="text-gray-800">
            {user.activityLevel === "beginner" && "Beginner"}
            {user.activityLevel === "intermediate" && "Intermediate"}
            {user.activityLevel === "advanced" && "Advanced"}
            {!user.activityLevel && "Not specified"}
          </Text>
        </View>

        <View className="mb-3">
          <Text className="text-gray-600 mb-1">Workout Frequency</Text>
          <Text className="text-gray-800">
            {user.workoutFrequency ? `${user.workoutFrequency} days per week` : "Not specified"}
          </Text>
        </View>

        {user.preferredWorkoutTypes && user.preferredWorkoutTypes.length > 0 && (
          <View>
            <Text className="text-gray-600 mb-1">Preferred Workout Types</Text>
            <View className="flex-row flex-wrap">
              {user.preferredWorkoutTypes.map((type) => (
                <View key={type} className="bg-blue-100 px-2 py-1 rounded mr-2 mb-2">
                  <Text className="text-blue-700 text-xs">{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Menu Items */}
      <View className="mx-4 bg-white rounded-xl shadow-sm p-4 mb-6">
        <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
          <View className="flex-row items-center">
            <User size={18} color="#4b5563" />
            <Text className="text-gray-800 ml-3">Account Settings</Text>
          </View>
          <ChevronRight size={18} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
          <View className="flex-row items-center">
            <Calendar size={18} color="#4b5563" />
            <Text className="text-gray-800 ml-3">Workout History</Text>
          </View>
          <ChevronRight size={18} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
          <View className="flex-row items-center">
            <Settings size={18} color="#4b5563" />
            <Text className="text-gray-800 ml-3">App Settings</Text>
          </View>
          <ChevronRight size={18} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between py-3" onPress={handleLogout}>
          <View className="flex-row items-center">
            <LogOut size={18} color="#ef4444" />
            <Text className="text-red-500 ml-3">Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

