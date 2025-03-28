
export type AuthStackParamList = {
    Login: undefined
    Register: undefined
    ForgotPassword: undefined
    ResetPassword: { token: string }
    EmailVerification: undefined
    ChangePassword: { email: string, token:string }
  }
  
  export type OnboardingStackParamList = {
    Onboarding: undefined
    Main: undefined
  }
  
  export type AppStackParamList = {
    Profile: undefined
    Home: undefined
    Workout: undefined
    Nutrition: undefined
    Progress: undefined
    FitnessStats: undefined
  }
  
  export type RootStackParamList = {
    Auth: undefined
    Onboarding: undefined
    Main: undefined
  }
  
  