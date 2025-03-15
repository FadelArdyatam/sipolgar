export type AuthStackParamList = {
    Login: undefined
    Register: undefined
    ForgotPassword: undefined
    ResetPassword: { token: string }
    EmailVerification: undefined
  }
  
  export type AppStackParamList = {
    Profile: undefined
  }
  
  export type RootStackParamList = {
    Auth: undefined
    Main: undefined
  }
  
  