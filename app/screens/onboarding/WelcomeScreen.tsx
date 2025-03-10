import { View, Text, Image, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { ArrowRight } from "lucide-react-native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

export default function WelcomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>()

  const handleContinue = () => {
    navigation.navigate("BasicInfo")
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        <Image source={{ uri: "https://via.placeholder.com/200" }} className="w-40 h-40 mb-8" resizeMode="contain" />

        <Text className="text-3xl font-bold text-center text-gray-800 mb-4">Welcome to FitTrack</Text>

        <Text className="text-center text-gray-600 mb-8 text-lg">
          Let's set up your profile to personalize your fitness journey
        </Text>

        <View className="w-full bg-gray-100 rounded-lg p-4 mb-8">
          <Text className="text-gray-700 mb-2 font-medium">What you'll need to provide:</Text>
          <View className="ml-4">
            <Text className="text-gray-600 mb-1">• Basic information (height, weight)</Text>
            <Text className="text-gray-600 mb-1">• Your fitness goals</Text>
            <Text className="text-gray-600 mb-1">• Activity level and preferences</Text>
            <Text className="text-gray-600">• Workout frequency</Text>
          </View>
        </View>

        <Text className="text-gray-500 text-center mb-8">
          This will help us create a personalized experience for you
        </Text>
      </View>

      <View className="p-6">
        <TouchableOpacity
          className="bg-amber-500 py-4 rounded-xl flex-row justify-center items-center"
          onPress={handleContinue}
        >
          <Text className="text-white font-bold text-lg mr-2">Let's Get Started</Text>
          <ArrowRight size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

