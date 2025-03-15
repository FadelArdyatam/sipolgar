import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import ProfileScreen from "../screens/ProfileScreen"
import { User } from "lucide-react-native"
import type { AppStackParamList } from "../types/navigation"

const Tab = createBottomTabNavigator<AppStackParamList>()

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case "Profile":
              return <User size={size} color={color} />
            default:
              return null
          }
        },
        tabBarActiveTintColor: "#FFBB00",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

