import { View, Text } from "react-native"
import type { Meal } from "../types/nutrition"

interface NutritionCardProps {
  meal: Meal
}

export default function NutritionCard({ meal }: NutritionCardProps) {
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm mb-3">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-gray-800">{meal.name}</Text>
        <Text className="text-gray-500">{meal.time}</Text>
      </View>

      <View className="flex-row justify-between mb-3">
        <View>
          <Text className="text-gray-500">Calories</Text>
          <Text className="font-semibold">{meal.calories} kcal</Text>
        </View>
        <View>
          <Text className="text-gray-500">Protein</Text>
          <Text className="font-semibold">{meal.protein}g</Text>
        </View>
        <View>
          <Text className="text-gray-500">Carbs</Text>
          <Text className="font-semibold">{meal.carbs}g</Text>
        </View>
        <View>
          <Text className="text-gray-500">Fat</Text>
          <Text className="font-semibold">{meal.fat}g</Text>
        </View>
      </View>

      <Text className="text-gray-700 font-semibold mb-1">Foods:</Text>
      <View>
        {meal.foods.map((food, index) => (
          <View key={index} className="flex-row justify-between">
            <Text className="text-gray-600">{food.name}</Text>
            <Text className="text-gray-500">{food.amount}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

