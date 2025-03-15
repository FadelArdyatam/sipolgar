"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native"
import { useDispatch } from "react-redux"
import { register } from "../../store/auth/authSlice"
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react-native"
import { format, addMonths, subMonths, getDaysInMonth, getYear, getMonth } from "date-fns"
import { getParentSatuanKerja, getChildSatuanKerja } from "../../services/AuthServices"
import type { AppDispatch } from "../../store"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { AuthStackParamList } from "../../navigation/types"
import type { SatuanKerjaParent, SatuanKerjaChild } from "../../types/user"

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Register">
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [nama_lengkap, setNamaLengkap] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [no_hp, setNoHp] = useState("")
  const [tempat_lahir, setTempatLahir] = useState("")
  const [tanggal_lahir, setTanggalLahir] = useState(new Date())
  const [id_satuankerja, setIdSatuankerja] = useState<number | null>(null)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Satuan Kerja state
  const [parentSatuanKerja, setParentSatuanKerja] = useState<SatuanKerjaParent[]>([])
  const [childSatuanKerja, setChildSatuanKerja] = useState<SatuanKerjaChild[]>([])
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null)
  const [showSatuanKerjaPicker, setShowSatuanKerjaPicker] = useState(false)
  const [selectedSatuanKerjaName, setSelectedSatuanKerjaName] = useState("")

  const [loading, setLoading] = useState(false)
  const [fetchingData, setFetchingData] = useState(true)

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const fetchParentSatuanKerja = async () => {
      try {
        const data = await getParentSatuanKerja()
        setParentSatuanKerja(data)
      } catch (error) {
        console.error("Failed to fetch parent satuan kerja:", error)
        Alert.alert("Error", "Failed to load satuan kerja data")
      } finally {
        setFetchingData(false)
      }
    }

    fetchParentSatuanKerja()
  }, [])

  useEffect(() => {
    const fetchChildSatuanKerja = async () => {
      if (selectedParentId) {
        try {
          setFetchingData(true)
          const data = await getChildSatuanKerja(selectedParentId)
          setChildSatuanKerja(data)
        } catch (error) {
          console.error(`Failed to fetch child satuan kerja for parent ID ${selectedParentId}:`, error)
          Alert.alert("Error", "Failed to load child satuan kerja data")
        } finally {
          setFetchingData(false)
        }
      } else {
        setChildSatuanKerja([])
      }
    }

    fetchChildSatuanKerja()
  }, [selectedParentId])

  const handleRegister = async () => {
    // Validate all fields
    if (
      !nama_lengkap ||
      !username ||
      !email ||
      !no_hp ||
      !tempat_lahir ||
      !id_satuankerja ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Error", "Harap isi semua field")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Password tidak cocok")
      return
    }

    // Format tanggal lahir to YYYY-MM-DD
    const formattedDate = format(tanggal_lahir, "yyyy-MM-dd")

    setLoading(true)
    try {
      await dispatch(
        register({
          nama_lengkap,
          username,
          email,
          no_hp,
          tempat_lahir,
          tanggal_lahir: formattedDate,
          id_satuankerja,
        }),
      ).unwrap()

      // Navigate to email verification screen instead of login
      navigation.navigate("EmailVerification")
    } catch (error) {
      Alert.alert("Registrasi Gagal", error instanceof Error ? error.message : "Silahkan coba lagi")
    } finally {
      setLoading(false)
    }
  }

  const handleSelectParent = (parentId: number) => {
    setSelectedParentId(parentId)
    // Find the parent name
    const parent = parentSatuanKerja.find((item) => item.id === parentId)
    if (parent) {
      setSelectedSatuanKerjaName(parent.nama_satuan_kerja)
    }

    // If there are no children, use the parent ID as the satuan kerja ID
    if (childSatuanKerja.length === 0) {
      setIdSatuankerja(parentId)
    }
  }

  const handleSelectChild = (childId: number) => {
    setIdSatuankerja(childId)
    // Find the child name
    const child = childSatuanKerja.find((item) => item.id === childId)
    if (child) {
      setSelectedSatuanKerjaName(child.nama_satuan_kerja)
    }
    setShowSatuanKerjaPicker(false)
  }

  // Custom date picker functions
  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const selectDate = (day: number) => {
    const newDate = new Date(currentMonth)
    newDate.setDate(day)
    setTanggalLahir(newDate)
    setShowDatePicker(false)
  }

  const renderCalendar = () => {
    const year = getYear(currentMonth)
    const month = getMonth(currentMonth)
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDayOfMonth = new Date(year, month, 1).getDay()

    // Create array of days
    const days = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} className="w-10 h-10" />)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected =
        tanggal_lahir.getDate() === i && tanggal_lahir.getMonth() === month && tanggal_lahir.getFullYear() === year

      days.push(
        <TouchableOpacity
          key={i}
          className={`w-10 h-10 items-center justify-center rounded-full ${isSelected ? "bg-amber-500" : ""}`}
          onPress={() => selectDate(i)}
        >
          <Text className={`${isSelected ? "text-white" : "text-gray-800"}`}>{i}</Text>
        </TouchableOpacity>,
      )
    }

    // Group days into rows (weeks)
    const rows = []
    let cells: React.ReactElement[] = [];

    days.forEach((day, i) => {
      if (i % 7 === 0 && cells.length > 0) {
        rows.push(
          <View key={i / 7} className="flex-row justify-around my-1">
            {cells}
          </View>,
        )
        cells = []
      }
      cells.push(day)
    })

    if (cells.length > 0) {
      rows.push(
        <View key={days.length} className="flex-row justify-around my-1">
          {cells}
        </View>,
      )
    }

    return rows
  }

  if (fetchingData) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-500">Memuat data...</Text>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6">
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-amber-500 rounded-full items-center justify-center mb-4">
              <Text className="text-white text-3xl font-bold">S</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-800">Buat Akun</Text>
            <Text className="text-gray-500 text-center mt-2">Daftar untuk mulai menggunakan Sipolgar</Text>
          </View>

          <View className="space-y-4 mb-6">
            <View className="relative">
              <View className="absolute left-3 top-3 z-10">
                <User size={20} color="#6b7280" />
              </View>
              <TextInput
                className="bg-white border border-gray-300 rounded-lg px-10 py-3 text-gray-700"
                placeholder="Nama Lengkap"
                value={nama_lengkap}
                onChangeText={setNamaLengkap}
              />
            </View>

            <View className="relative">
              <View className="absolute left-3 top-3 z-10">
                <User size={20} color="#6b7280" />
              </View>
              <TextInput
                className="bg-white border border-gray-300 rounded-lg px-10 py-3 text-gray-700"
                placeholder="NRP/Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <View className="relative">
              <View className="absolute left-3 top-3 z-10">
                <Mail size={20} color="#6b7280" />
              </View>
              <TextInput
                className="bg-white border border-gray-300 rounded-lg px-10 py-3 text-gray-700"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View className="relative">
              <View className="absolute left-3 top-3 z-10">
                <Phone size={20} color="#6b7280" />
              </View>
              <TextInput
                className="bg-white border border-gray-300 rounded-lg px-10 py-3 text-gray-700"
                placeholder="Nomor HP"
                value={no_hp}
                onChangeText={setNoHp}
                keyboardType="phone-pad"
              />
            </View>

            <View className="relative">
              <View className="absolute left-3 top-3 z-10">
                <MapPin size={20} color="#6b7280" />
              </View>
              <TextInput
                className="bg-white border border-gray-300 rounded-lg px-10 py-3 text-gray-700"
                placeholder="Tempat Lahir"
                value={tempat_lahir}
                onChangeText={setTempatLahir}
              />
            </View>

            <TouchableOpacity className="relative" onPress={() => setShowDatePicker(true)}>
              <View className="absolute left-3 top-3 z-10">
                <Calendar size={20} color="#6b7280" />
              </View>
              <View className="bg-white border border-gray-300 rounded-lg px-10 py-3">
                <Text className={tanggal_lahir ? "text-gray-700" : "text-gray-400"}>
                  {format(tanggal_lahir, "dd/MM/yyyy")}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Custom Date Picker Modal */}
            <Modal
              visible={showDatePicker}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowDatePicker(false)}
            >
              <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                <View className="bg-white rounded-lg p-4 w-80">
                  <View className="flex-row justify-between items-center mb-4">
                    <TouchableOpacity onPress={goToPreviousMonth}>
                      <ChevronLeft size={24} color="#4b5563" />
                    </TouchableOpacity>
                    <Text className="text-lg font-medium text-gray-800">{format(currentMonth, "MMMM yyyy")}</Text>
                    <TouchableOpacity onPress={goToNextMonth}>
                      <ChevronRight size={24} color="#4b5563" />
                    </TouchableOpacity>
                  </View>

                  <View className="mb-2">
                    <View className="flex-row justify-around">
                      {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
                        <Text key={day} className="text-gray-500 w-10 text-center">
                          {day}
                        </Text>
                      ))}
                    </View>
                    {renderCalendar()}
                  </View>

                  <View className="flex-row justify-end mt-4">
                    <TouchableOpacity
                      className="px-4 py-2 mr-2 rounded-lg bg-gray-200"
                      onPress={() => setShowDatePicker(false)}
                    >
                      <Text className="text-gray-800">Batal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="px-4 py-2 rounded-lg bg-amber-500"
                      onPress={() => setShowDatePicker(false)}
                    >
                      <Text className="text-white">OK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* Satuan Kerja Selector */}
            <View className="relative">
              <Text className="text-gray-700 font-medium mb-1">Satuan Kerja</Text>
              <TouchableOpacity
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 flex-row justify-between items-center"
                onPress={() => setShowSatuanKerjaPicker(true)}
              >
                <Text className={selectedSatuanKerjaName ? "text-gray-700" : "text-gray-400"}>
                  {selectedSatuanKerjaName || "Pilih Satuan Kerja"}
                </Text>
                <ChevronDown size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Satuan Kerja Picker Modal */}
            <Modal
              visible={showSatuanKerjaPicker}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowSatuanKerjaPicker(false)}
            >
              <View className="flex-1 justify-end bg-black bg-opacity-50">
                <View className="bg-white rounded-t-xl p-4 h-2/3">
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-lg font-bold text-gray-800">Pilih Satuan Kerja</Text>
                    <TouchableOpacity onPress={() => setShowSatuanKerjaPicker(false)}>
                      <Text className="text-amber-500 font-medium">Tutup</Text>
                    </TouchableOpacity>
                  </View>

                  <ScrollView className="mb-4">
                    <Text className="text-gray-500 font-medium mb-2">Induk Satuan Kerja</Text>
                    {parentSatuanKerja.map((parent) => (
                      <TouchableOpacity
                        key={parent.id}
                        className={`p-3 border-b border-gray-100 ${selectedParentId === parent.id ? "bg-amber-50" : ""}`}
                        onPress={() => handleSelectParent(parent.id)}
                      >
                        <Text
                          className={`${selectedParentId === parent.id ? "text-amber-500 font-medium" : "text-gray-700"}`}
                        >
                          {parent.nama_satuan_kerja}
                        </Text>
                      </TouchableOpacity>
                    ))}

                    {selectedParentId && childSatuanKerja.length > 0 && (
                      <>
                        <Text className="text-gray-500 font-medium mt-4 mb-2">Anak Satuan Kerja</Text>
                        {childSatuanKerja.map((child) => (
                          <TouchableOpacity
                            key={child.id}
                            className={`p-3 border-b border-gray-100 ${
                              id_satuankerja === child.id ? "bg-amber-50" : ""
                            }`}
                            onPress={() => handleSelectChild(child.id)}
                          >
                            <Text
                              className={`${id_satuankerja === child.id ? "text-amber-500 font-medium" : "text-gray-700"}`}
                            >
                              {child.nama_satuan_kerja}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </>
                    )}
                  </ScrollView>

                  <TouchableOpacity
                    className="bg-amber-500 py-3 rounded-lg items-center"
                    onPress={() => setShowSatuanKerjaPicker(false)}
                  >
                    <Text className="text-white font-semibold">Pilih</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <View className="relative">
              <View className="absolute left-3 top-3 z-10">
                <Lock size={20} color="#6b7280" />
              </View>
              <TextInput
                className="bg-white border border-gray-300 rounded-lg px-10 py-3 text-gray-700"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity className="absolute right-3 top-3 z-10" onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
              </TouchableOpacity>
            </View>

            <View className="relative">
              <View className="absolute left-3 top-3 z-10">
                <Lock size={20} color="#6b7280" />
              </View>
              <TextInput
                className="bg-white border border-gray-300 rounded-lg px-10 py-3 text-gray-700"
                placeholder="Konfirmasi Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            </View>
          </View>

          <TouchableOpacity
            className={`bg-amber-500 py-3 rounded-lg items-center ${loading ? "opacity-70" : ""}`}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white font-semibold text-lg ml-2">Mendaftar...</Text>
              </View>
            ) : (
              <Text className="text-white font-semibold text-lg">Daftar</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text className="text-amber-500 font-medium">Masuk</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

