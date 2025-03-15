export interface User {
  id: string
  nama_lengkap: string
  username: string
  email: string
  no_hp: string
  tempat_lahir: string
  tanggal_lahir: string
  id_satuankerja: number
  satuankerja?: string
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

