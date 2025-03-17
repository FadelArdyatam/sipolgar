export interface User {
  id: number
  name: string
  username: string
  email: string
  status: boolean
  role: string
  created_at: string
  updated_at: string
  personel?: Personel
}

export interface Personel {
  id: number
  nama_lengkap: string
  tempat_lahir: string
  tanggal_lahir: string
  no_hp: string
  jenis_kelamin: string
  jenis_pekerjaan: string | null
  intensitas: string | null
  tinggi_badan: number | null // Changed from string to number
  berat_badan: number | null // Added berat_badan field as number
  fitness_goal: string | null
  activity_level: string | null
  id_satuankerja: number
  id_pangkat: number | null
  id_user: number
  created_at: string
  updated_at: string
}

// Create a partial version of Personel for updates
export interface PersonelUpdate {
  id?: number
  nama_lengkap?: string
  tempat_lahir?: string
  tanggal_lahir?: string
  no_hp?: string
  jenis_kelamin?: string
  jenis_pekerjaan?: string | null
  intensitas?: string | null
  tinggi_badan?: number | null
  berat_badan?: number | null
  fitness_goal?: string | null
  activity_level?: string | null
  id_satuankerja?: number
  id_pangkat?: number | null
  id_user?: number
  created_at?: string
  updated_at?: string
}

export interface UserProfile extends User {
  // Additional profile fields can be added here
  isVerified?: boolean
  profileImage?: string
}

export interface AuthState {
  user: UserProfile | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  requiresEmailVerification: boolean
  verificationEmail: string | null
  expiresAt: string | null
}

export interface SatuanKerja {
  id: number
  nama_satuan_kerja: string
  parent_id?: number
  level?: string
  maps_url?: string
  latitude?: string
  longitude?: string
  isDeleted?: boolean
  created_at?: string
  updated_at?: string
}

export interface SatuanKerjaParent {
  id: number
  nama_satuan_kerja: string
}

export interface SatuanKerjaChild {
  id: number
  nama_satuan_kerja: string
}

export interface SatuanKerjaResponse {
  message: string
  data: SatuanKerja[] | SatuanKerja
}

export interface SatuanKerjaParentResponse {
  message: string
  data: SatuanKerjaParent[]
}

export interface SatuanKerjaChildResponse {
  message: string
  data: SatuanKerjaChild[]
}

export interface LoginResponse {
  message: string
  user: UserProfile
  token: string
  expires_at: string
}

// Update the RegisterResponse interface to match the exact response format
export interface RegisterResponse {
  message: string
  user: {
    name: string
    username: string
    email: string
    role: string
    status: boolean
    updated_at: string
    created_at: string
    id: number
  }
  personel: {
    nama_lengkap: string
    tempat_lahir: string
    tanggal_lahir: string
    no_hp: string
    id_satuankerja: string
    id_user: number
    updated_at: string
    created_at: string
    id: number
  }
}

// Update the RegenerateOTPResponse interface to match the exact response format
export interface RegenerateOTPResponse {
  message: string
}

// Update the ForgotPasswordResponse interface to match the exact response format
export interface ForgotPasswordResponse {
  message: string
}

