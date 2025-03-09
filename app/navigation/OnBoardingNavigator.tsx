import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import WelcomeScreen from "../screens/onboarding/WelcomeScreen"
import BasicInfoScreen from "../screens/onboarding/BasicInfoScreen"
import FitnessGoalsScreen from "../screens/onboarding/FitnessGoalsScreen"
import ActivityLevelScreen from "../screens/onboarding/ActivityLevelScreen"
import WorkoutPreferencesScreen from "../screens/onboarding/WorkoutPreferencesScreen"

const Stack = createNativeStackNavigator()

export default function OnboardingNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
            }}
        >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="BasicInfo" component={BasicInfoScreen} />
            <Stack.Screen name="FitnessGoals" component={FitnessGoalsScreen} />
            <Stack.Screen name="ActivityLevel" component={ActivityLevelScreen} />
            <Stack.Screen name="WorkoutPreferences" component={WorkoutPreferencesScreen} />
        </Stack.Navigator>
    )
}