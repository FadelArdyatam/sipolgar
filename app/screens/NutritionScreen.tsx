"use client"

import { useEffect } from "react"
import { View, Text, ScrollView } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { fetchNutritionData } from "../store/nutrition/nutritionSlice"
import type { RootState, AppDispatch } from "../store"
import NutritionCard from "../components/NutritionCard"
import MacroChart from "../components/MacroChart"

export default function NutritionScreen() {
  const dispatch = useDispatch<AppDispatch>()
  const { nutritionData, loading } = useSelector((state: RootState) => state.nutrition)

  useEffect(() => {
    dispatch(fetchNutritionData())
  }, [dispatch])

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">Loading nutrition data...</Text>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-4">Nutrition</Text>

        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-700 mb-2">Today's Macros</Text>
          <MacroChart data={nutritionData?.macros} />
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-700 mb-2">Meals Today</Text>
          {nutritionData?.meals.map((meal) => (
            <NutritionCard key={meal.id} meal={meal} />
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

