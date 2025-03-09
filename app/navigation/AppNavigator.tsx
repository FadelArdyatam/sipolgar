import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { AppStackParamList } from './types'
import { Home, Dumbbell, Apple, User } from 'lucide-react-native'

import HomeScreen from '../screens/HomeScreen'
import WorkoutsNavigator from './WorkoutNavigator'
import NutritionScreen from '../screens/NutritionScreen'
import ProfileScreen from '../screens/ProfileScreen'

const Tab = createBottomTabNavigator<AppStackParamList>()

const AppNavigator = () => {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        switch (route.name) {
          case "Home":
            return <Home size={size} color={color} />
          case "Workouts":
            return <Dumbbell size={size} color={color} />
          case "Nutrition":
            return <Apple size={size} color={color} />
          case "Profile":
            return <User size={size} color={color} />
          default:
            return null
        }
      },
      tabBarActiveTintColor: "#3b82f6",
      tabBarInactiveTintColor: "gray",
      headerShown: false,
    })}
  >
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Workouts" component={WorkoutsNavigator} />
  <Tab.Screen name="Nutrition" component={NutritionScreen} />
  <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
  )
}

export default AppNavigator