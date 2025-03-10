import { View, Text, TouchableOpacity } from "react-native"
import type { Workout } from "../types/workout"
import { Clock, Flame } from "lucide-react-native"

interface WorkoutCardProps {
  workout: Workout
  onPress?: () => void
}

export default function WorkoutCard({ workout, onPress }: WorkoutCardProps) {
  return (
    <TouchableOpacity className="bg-white p-4 rounded-xl shadow-sm" onPress={onPress}>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-gray-800">{workout.name}</Text>
        <View className="bg-blue-100 px-2 py-1 rounded">
          <Text className="text-blue-600 font-medium">{workout.category}</Text>
        </View>
      </View>

      <View className="flex-row items-center mb-3">
        <Clock size={16} color="#6b7280" />
        <Text className="text-gray-500 ml-1 mr-4">{workout.duration} min</Text>
        <Flame size={16} color="#f97316" />
        <Text className="text-gray-500 ml-1">{workout.caloriesBurned} cal</Text>
      </View>

      <Text className="text-gray-600 mb-3">{workout.description}</Text>

      <Text className="text-gray-700 font-semibold mb-1">Exercises:</Text>
      <View>
        {workout.exercises.slice(0, 3).map((exercise, index) => (
          <Text key={index} className="text-gray-600">
            • {exercise.name}
          </Text>
        ))}
        {workout.exercises.length > 3 && <Text className="text-blue-500">+{workout.exercises.length - 3} more</Text>}
      </View>
    </TouchableOpacity>
  )
}

