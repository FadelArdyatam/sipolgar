import { View, Text, Dimensions } from "react-native"
import { PieChart } from "react-native-chart-kit"
import type { Macros } from "../types/nutrition"

interface MacroChartProps {
  data?: Macros
}

export default function MacroChart({ data }: MacroChartProps) {
  const screenWidth = Dimensions.get("window").width - 32 // Accounting for padding

  if (!data) {
    return (
      <View className="bg-white p-4 rounded-xl shadow-sm items-center justify-center">
        <Text className="text-gray-500">No data available</Text>
      </View>
    )
  }

  const chartData = [
    {
      name: "Protein",
      value: data.protein,
      color: "#3b82f6",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Carbs",
      value: data.carbs,
      color: "#10b981",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Fat",
      value: data.fat,
      color: "#f59e0b",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
  ]

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: () => "#000000",
  }

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm">
      <PieChart
        data={chartData}
        width={screenWidth}
        height={180}
        chartConfig={chartConfig}
        accessor="value"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  )
}

